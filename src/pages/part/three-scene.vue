<template>
    <div ref="canvas"/>
</template>

<script>
    import * as THREE from 'three';

    export default {
        name: "three-scene",
        props: ["width", "height", "cellSize", "deadColor", "liveColor"],
        data: function () {
            return {
                scene: null,
                camera: null,
                renderer: null,
                cameraPosition: {
                    x: 0,
                    y: 0,
                    z: 100,
                },
                cells: {},
                meshs: {},
            };
        },
        computed: {
            cellColumns: function () {
                return this.width / this.cellSize;
            },
            cellRows: function () {
                return this.height / this.cellSize;
            },
            cellOffset: function () {
                return this.cellSize / 2;
            },
            geometry: function () {
                return new THREE.BoxGeometry(this.cellSize, this.cellSize, this.cellSize);
            },
            liveMaterial: function () {
                return new THREE.MeshBasicMaterial({color: this.liveColor});
            },
            deadMaterial: function () {
                return new THREE.MeshBasicMaterial({color: this.deadColor});
            }
        },
        mounted() {
            this.init();
            this.animate();
        },
        watch: {
            cameraPosition: function () {
                this.setCamera();
            },
        },
        methods: {
            keyfy: function (x, y) {
                return `${x}-${y}`;
            },
            foreachCoordinate: function (f) {
                for (let x = 0; x < this.cellColumns; x++) {
                    for (let y = 0; y< this.cellRows; y++) {
                       f({x, y});
                    }
                }
            },
            addCell: function (x, y, isAlive) {
                const cell = new THREE.Mesh(this.geometry, isAlive ? this.liveMaterial : this.deadMaterial);
                cell.position.set(x * this.cellSize + this.cellOffset, y * this.cellSize + this.cellOffset, 0);
                this.scene.add(cell);
                return cell;
            },
            setCamera: function () {
                const p = this.cameraPosition;
                this.camera.position.set(p.x, p.y, p.z);
            },
            init() {
                this.scene = new THREE.Scene();
                this.camera = new THREE.OrthographicCamera(0, this.width, 0, this.height, 1, 1000);
                this.renderer = new THREE.WebGLRenderer();
                this.renderer.setSize(this.width, this.height);
                this.$refs.canvas.appendChild(this.renderer.domElement);
                this.setCamera();
                this.camera.lookAt(0, 0, 0);

                const meshs = {};
                const cells = {};
                this.foreachCoordinate(p => {
                    const {x, y} = p;
                    const key = this.keyfy(x, y);
                    const isAlive = Math.floor(Math.random()*100) > 50;
                    meshs[key] = this.addCell(x, y, false);
                    cells[key] = isAlive;
                });
                this.meshs = meshs;
                this.cells = cells;
                this.syncMeth();
            },
            syncMeth: function () {
                this.foreachCoordinate(p => {
                    const {x, y} = p;
                    const key = this.keyfy(x, y);
                    this.meshs[key].material = this.cells[key] ? this.liveMaterial : this.deadMaterial;
                });
            },
            animate() {
                requestAnimationFrame(this.animate);
                this.renderer.render(this.scene, this.camera);
            }
        }

    }
</script>

<style scoped>

</style>