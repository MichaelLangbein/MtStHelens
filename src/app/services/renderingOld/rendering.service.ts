import { Injectable, NgZone } from '@angular/core';
import {
    AmbientLight, DirectionalLight, DoubleSide, Mesh, MeshBasicMaterial,
    PerspectiveCamera, PlaneGeometry, Scene, WebGLRenderer,
    AxesHelper, Vector3, CubeTextureLoader
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Collada, ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';
import { ArrayCube } from './utils/arrayMatrix';
import { BlockContainer, createMarchingCubeBlockMeshes } from './marchingCubes/marchingCubesJs';
import perlinNoise3d from 'perlin-noise-3d';
import * as Stats from 'stats-js';



@Injectable({
    providedIn: 'root'
})
export class RenderingService {

    scene: Scene;
    controls: OrbitControls;
    camera: PerspectiveCamera;
    renderer: WebGLRenderer;
    allData: ArrayCube;
    meshes: BlockContainer[];
    blockSize: [number, number, number];
    cubeSize: [number, number, number];

    constructor(private zone: NgZone) { }

    init(container: HTMLCanvasElement) {

        const scene = new Scene();
        const renderer = new WebGLRenderer({
            canvas: container
        });
        renderer.setSize(container.clientWidth, container.clientHeight);

        const camera = new PerspectiveCamera(75, container.width / container.height, 0.1, 1000);
        camera.position.z = 50;
        camera.position.y = 40;
        camera.position.x = -40;
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
            model.scale.set(0.2, 0.2, 0.2);
            model.position.add(new Vector3(-70, 0, -80));
            model.rotateX(- Math.PI / 2);
            model.rotateZ(Math.PI);
            scene.add(model);
        });


        const noise = new perlinNoise3d();
        noise.noiseSeed(Math.E);

        function spaceFunction(x: number, y: number, z: number, maxVal: number): number {
            const noiseVal = maxVal * (
                0.3 * noise.get((8*x)/X, (8*y)/Y, (8*z)/Z) +
                0.4 * noise.get((4*x)/X, (4*y)/Y, (4*z)/Z) +
                0.2 * noise.get((2*x)/X, (2*y)/Y, (2*z)/Z) +
                0.1 * noise.get(x/(1*X), y/(1*Y), z/(1*Z)) +
                0.0 * noise.get(x/(2*X), y/(2*Y), z/(2*Z)) +
                0.0 * noise.get(x/(4*X), y/(4*Y), z/(4*Z))
            );
            const proximityX = 1 - (Math.abs(x - X / 2) / (X / 2));
            const proximityY = 1 - (Math.abs(y - Y*0.9) / (Y*0.9));
            const proximityZ = 1 - (Math.abs(z - Z / 2) / (Z / 2));
            const val = noiseVal * proximityX * Math.pow(proximityY, 1.55) * Math.pow(proximityZ, 1.5);
            return val;
        }

        const maxVal = 100;
        const X = 150;
        const Y = 80;
        const Z = 150;
        const allData = new ArrayCube(X, Y, Z);
        for (let x = 0; x < X; x++) {
            for (let y = 0; y < Y; y++) {
                for (let z = 0; z < Z; z++) {
                    if (x !== 0 && y !== 0 && z !== 0 && x !== X - 1 && y !== Y - 1 && z !== Z - 1) {
                        allData.set(x, y, z, spaceFunction(x, y, z, maxVal));
                    } else {
                        allData.set(x, y, z, 0);
                    }
                }
            }
        }
        const threshold = 20;

        const cubeSize: [number, number, number] = [1.25, 1.25, 1.25];
        const blockSize: [number, number, number] = [100, 100, 100];

        const colorFunc = (val: number): [number, number, number] => {
            const perc = val/100;
            const r = perc;
            const g = 1 - perc;
            return [r, g, 0];
        };

        const meshes = createMarchingCubeBlockMeshes(allData, threshold, cubeSize[0], blockSize, colorFunc);
        meshes.map(m => m.mesh.translateX(- cubeSize[0] * X / 2));
        meshes.map(m => m.mesh.translateY(- cubeSize[1] * Y / 2));
        meshes.map(m => m.mesh.translateZ(- cubeSize[2] * Z / 2));
        meshes.map((m, i) => m.mesh.name = `mesh${i}`);
        meshes.map(m => scene.add(m.mesh));



        const planeGeom = new PlaneGeometry(Z, Y);
        const planeMaterial = new MeshBasicMaterial({
            color: '#4400f2',
            side: DoubleSide,
            transparent: true,
            opacity: 0.5
        });
        const cutPlane = new Mesh(planeGeom, planeMaterial);
        cutPlane.position.setX(- cubeSize * X / 2);
        cutPlane.lookAt(-1, 0, 0);
        cutPlane.name = 'cutPlane';
        scene.add(cutPlane);


        this.allData = allData;
        this.meshes = meshes;
        this.cubeSize = cubeSize;
        this.blockSize = blockSize;
    


        this.scene = scene;
        this.controls = controls;
        this.camera = camera;
        this.renderer = renderer;
    }

    render(fpsContainer: HTMLDivElement) {
        var stats = new Stats();
        stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        stats.dom.style.position = "relative";
        fpsContainer.appendChild(stats.dom);

        const animationFunction = () => {
            stats.begin();
            this.renderer.render(this.scene, this.camera);
            stats.end();
            setTimeout(animationFunction, 60);
        };
        animationFunction.bind(this);
        this.zone.runOutsideAngular(animationFunction);
    }



    updateMeshData(minX: number, maxX: number, minZ: number, maxZ: number, threshold: number) {
        for (const mesh of this.meshes) {
            const bbox = mesh.getBbox();
            if (this.squareIntersection(
                    [minX,      minZ,       maxX,       maxZ],
                    [bbox.xMin, bbox.zMin,  bbox.xMax,  bbox.zMax])
                ) {
                    mesh.mesh.visible = true;

                const startPointWC = mesh.mesh.position.toArray();
                const originalData = this.allData.getSubBlock(mesh.startPoint, mesh.blockSize);

                const newData = new ArrayCube(mesh.blockSize[0], mesh.blockSize[1], mesh.blockSize[2]);
                for (let x = 0; x < mesh.blockSize[0]; x++) {
                    for (let y = 0; y < mesh.blockSize[1]; y++) {
                        for (let z = 0; z < mesh.blockSize[2]; z++) {
                            const xVal = startPointWC[0] + x * this.cubeSize[0];
                            const zVal = startPointWC[2] + z * this.cubeSize[2];
                            const val = originalData.get(x, y, z);
                            if (xVal < minX || xVal > maxX || zVal < minZ || zVal > maxZ || val < threshold) {
                                newData.set(x, y, z, 0);
                            } else {
                                newData.set(x, y, z,
                                    originalData.get(x, y, z));
                            }
                        }
                    }
                }
                mesh.updateData(newData);
                // mesh.updateThreshold(threshold);
            } else {
                mesh.mesh.visible = false;
            }
        }
    }

    private squareIntersection(sq1: [number, number, number, number], sq2: [number, number, number, number]): boolean {
        return !(
            sq1[0] > sq2[2] ||   // sq1.left   > sq2.right
            sq1[2] < sq2[0] ||   // sq1.right  < sq2.left
            sq1[1] > sq2[3] ||   // sq1.bottom > sq2.top
            sq1[3] < sq2[1]      // sq1.top    < sq2.bottom
        );
    }

}
