import { Injectable, NgZone } from '@angular/core';
import {
  AmbientLight, DirectionalLight, DoubleSide, Mesh, MeshBasicMaterial,
  PerspectiveCamera, PlaneGeometry, Scene, WebGLRenderer, MeshPhongMaterial,
  AxesHelper, BoxGeometry
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
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
    // renderer.setSize(container.width, container.height);

    const camera = new PerspectiveCamera(75, container.width / container.height, 0.1, 1000);
    camera.position.z = 10;
    camera.position.y = 4;
    camera.name = 'camera';


    const light = new DirectionalLight('white', 0.6);
    light.position.x = -3;
    light.position.y = 1;
    light.position.z = 5;
    light.name = 'light1';
    scene.add(light);

    const light2 = new AmbientLight('#c5f8f3', 0.2);
    light2.name = 'light2';
    scene.add(light2);

    const axesHelper = new AxesHelper(5);
    axesHelper.name = 'axesHelper';
    scene.add(axesHelper);

    const skyBox = new Mesh(
      new BoxGeometry(500, 500, 500, 3, 3, 3),
      new MeshPhongMaterial({
        color: '#daf8e3',
        side: DoubleSide
      })
    );
    skyBox.name = 'skybox';
    scene.add(skyBox);

    const controls = new OrbitControls(camera, container);

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
