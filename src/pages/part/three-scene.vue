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
        created: function () {
            setInterval(() => {
                this.updateCells();
                this.syncMesh();
            }, 1);
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
                       f(x, y);
                    }
                }
            },
            foreachAroundCoordinate: function (x, y, f) {
                for(let xOffset = -1; xOffset <= 1; xOffset++) {
                    for(let yOffset = -1; yOffset <= 1; yOffset++) {
                        if (xOffset === 0 && yOffset === 0) continue;
                        f(x+xOffset, y+yOffset);
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
            isLiveCell: function (x, y) {
                const key = this.keyfy(x, y);
                return !!this.cells[key];
            },
            willAlive: function (x, y) {
                const key = this.keyfy(x, y);
                if (!(key in this.cells)) return false;
                let alive = 0;
                this.foreachAroundCoordinate(x, y, (nx, ny) => {
                    if(this.isLiveCell(nx, ny)) alive++;
                });
                if (this.isLiveCell(x, y)) {
                    return [2, 3].includes(alive);
                } else {
                    return alive === 3;
                }

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
                this.foreachCoordinate((x, y) => {
                    const key = this.keyfy(x, y);
                    const isAlive = Math.floor(Math.random()*100) > 50;
                    meshs[key] = this.addCell(x, y, false);
                    cells[key] = isAlive;
                });
                this.meshs = meshs;
                this.cells = cells;
                this.syncMesh();
            },
            syncMesh: function () {
                this.foreachCoordinate((x, y) => {
                    const key = this.keyfy(x, y);
                    this.meshs[key].material = this.cells[key] ? this.liveMaterial : this.deadMaterial;
                });
            },
            updateCells: function () {
                const cells = {};
                this.foreachCoordinate((x, y) => {
                    const key = this.keyfy(x, y);
                    cells[key] = this.willAlive(x, y);
                });
                this.cells = cells;
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