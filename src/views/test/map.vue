<template>
    <div class="aaaa">
        <el-button icon="el-icon-location" size="mini" @click="centerView()">定位</el-button>
        <el-button icon="el-icon-location" size="mini" @click="drawRiverLine('001','001责任段')">001责任段</el-button>
        <el-button icon="el-icon-location" size="mini" @click="drawRiverLine('002','002责任段')">002责任段</el-button>
        <el-button icon="el-icon-location" size="mini" @click="drawArea('003','003湖(多边形)')">003湖(多边形)</el-button>
         <span>{{lineLength}},{{wkt}}</span>
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
                map: null,
                lineLength: 0,
                wkt: ''
            }
        },
        mounted() {
           // console.log('================',this.map)
        },
        methods: {
            centerView() {
                this.map.centerView([113.88, 27.67],16)
            },
            drawRiverLine(id,name) {
               // var id = '001'
               var self = this
                var callback = function(type,data) {
                    console.log('回调：',type,data)
                    if (type === 'change') {
                        self.lineLength = data.remarks
                        self.wkt = data.wkt
                    }
                }
                
                this.map.drawLine({ id: id,name: name },callback)
            },
            drawArea(id,name) {
               // var id = '001'
               var self = this
                var callback = function(type,data) {
                    console.log('回调：',type,data)
                    if (type === 'change') {
                    self.lineLength = data.remarks
                    self.wkt = data.wkt
                    }
                }
                
                this.map.drawArea({ id: id,name: name },callback)
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
