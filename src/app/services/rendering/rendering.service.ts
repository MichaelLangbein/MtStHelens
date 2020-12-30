import { Injectable, NgZone } from '@angular/core';
import {
  AmbientLight, DirectionalLight, DoubleSide, Mesh, MeshBasicMaterial,
  PerspectiveCamera, PlaneGeometry, Scene, WebGLRenderer, MeshPhongMaterial,
  AxesHelper, BoxGeometry, MeshLambertMaterial, Group, Vector3, TextureLoader, WebGLCubeRenderTarget, CubeTextureLoader
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { Collada, ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';
import { perlin3D } from './utils/noise';
import { ArrayCube } from './utils/arrayMatrix';
import { createMarchingCubeBlockMeshes, fetchWasm, MarchingCubeService } from './marchingCubes/marchingCubes';



@Injectable({
  providedIn: 'root'
})
export class RenderingService {
  scene: Scene;
  controls: OrbitControls;
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;

  constructor(private zone: NgZone) { }

  init(container: HTMLCanvasElement) {
  
    const scene = new Scene();
    const renderer = new WebGLRenderer({
      canvas: container
    });
    renderer.setSize(container.clientWidth, container.clientHeight);

    const camera = new PerspectiveCamera(75, container.width / container.height, 0.1, 1000);
    camera.position.z = 30;
    camera.position.y = 20;
    camera.position.x = -20;
    camera.name = 'camera';

    const light = new DirectionalLight('white', 0.8);
    light.position.x = -3;
    light.position.y = 1;
    light.position.z = 5;
    light.name = 'light1';
    scene.add(light);

    const light2 = new AmbientLight('#c5f8f3', 0.3);
    light2.name = 'light2';
    scene.add(light2);

    const controls = new OrbitControls(camera, container);

    const helpers = new AxesHelper(10);
    scene.add(helpers);

    const textureLoader = new CubeTextureLoader();
    const texture = textureLoader.load([
      'assets/skybox/Daylight_Box_Right.bmp',
      'assets/skybox/Daylight_Box_Left.bmp',
      'assets/skybox/Daylight_Box_Top.bmp',
      'assets/skybox/Daylight_Box_Bottom.bmp',
      'assets/skybox/Daylight_Box_Front.bmp',
      'assets/skybox/Daylight_Box_Back.bmp',
    ]);
    scene.background = texture;

    const loader = new ColladaLoader();
    loader.load('assets/mtStHelensCollada/model.dae', (data: Collada) => {
      const model = data.scene.children[0].children[1];
      model.name = "MtStHelens";
      model.scale.set( 0.2, 0.2, 0.2);
      model.position.add(new Vector3(-70, 0, -80));
      model.rotateX(- Math.PI / 2);
      model.rotateZ(Math.PI);
      scene.add(model);
      console.log(model)
    });

    this.scene = scene;
    this.controls = controls;
    this.camera = camera;
    this.renderer = renderer;
  }

  render() {
    const animationFunction = () => {
      this.renderer.render(this.scene, this.camera);
      setTimeout(animationFunction, 60);
    };
    animationFunction.bind(this);
    this.zone.runOutsideAngular(animationFunction);
  }

}
