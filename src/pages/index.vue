<template>
    <div>
        <three-scene :width=800 :height=600 :cell-size=40 :live-color=0x00ff00 :dead-color=0x0000ff />
    </div>

</template>

<script>
    import ThreeScene from "./part/three-scene";
    export default {
        name: "index",
        components: {ThreeScene}
    }
</script>

<style scoped>

</style>