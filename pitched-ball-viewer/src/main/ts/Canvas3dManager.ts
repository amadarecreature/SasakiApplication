import * as THREE from "three";
import { PointerPosition } from "./PointerPosition";


export class Canvas3dManager {

    readonly _canvas;
    readonly _scene;
    readonly _renderer;
    readonly _camera;
    constructor(canvas: HTMLCanvasElement, height: number, width: number) {
        this._canvas = canvas;
        this._canvas.height = height;
        this._canvas.width = width;
        this._camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
        this._camera.position.set(0, 0, 1000);


        this._renderer = new THREE.WebGLRenderer({ canvas: canvas });
        this._scene = new THREE.Scene();
        this._renderer.setSize(width, height);

    }

    public viewBall(radius: number, centerPosition: PointerPosition): void {
        console.info("viewBall");

        // ①ジオメトリを作成
        const geometry = new THREE.SphereGeometry(300, 100, 100);
        // マテリアルを作成
        const material = new THREE.MeshPhongMaterial({ color: 0xFF0000 });
        // メッシュを作成
        const mesh = new THREE.Mesh(geometry, material);
        // 3D空間にメッシュを追加
        this._scene.add(mesh);

        const light = new THREE.DirectionalLight(0xffffff);
        light.position.set(1, 1, 1);
        this._scene.add(light);



        const tick = (): void => {
            requestAnimationFrame(tick);

            mesh.rotation.x += 0.05;
            mesh.rotation.y += 0.05;

            // 描画
            this._renderer.render(this._scene, this._camera);
        };
        tick();

    }



}