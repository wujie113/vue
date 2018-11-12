<template>
    <div class="aaaa">
        <el-button icon="el-icon-location" size="mini" @click="centerView()">定位</el-button>
        <rm-map v-model="map"></rm-map>
    </div>
</template> 
<script> 

    import RmMap from "@/components/rm/map"
    export default {
        components: { RmMap },
        data() {
            return {
                v: { ctrl: false, tool: false },
                map: null
            }
        },
        mounted() {
            console.log('================',this.map)
        },
        methods: {
            centerView() {
                this.map.centerView([113.88, 27.67],16)
            }
        }
    }
</script>
<style>
    .aaaa {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }
</style>
