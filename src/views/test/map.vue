<template>
  <div class="aaaa">
    <el-button icon="el-icon-location" size="mini" @click="centerView()">定位</el-button>
    <el-button icon="el-icon-location" size="mini" @click="drawRiverLine('001','001责任段')">001责任段</el-button>
    <el-button icon="el-icon-location" size="mini" @click="drawRiverLine('002','002责任段')">002责任段</el-button>
    <el-button icon="el-icon-location" size="mini" @click="selectRiverLine()">选择责任段</el-button>
    <el-button icon="el-icon-location" size="mini" @click="removeRiverLine('002')">清除002责任段</el-button>
    <el-button icon="el-icon-location" size="mini" @click="drawArea('003','003湖(多边形)')">003湖(多边形)</el-button>
    <el-button icon="el-icon-location" size="mini" @click="showFeature('gd003','shangbao')">展示工单</el-button>
    <el-button icon="el-icon-location" size="mini" @click="showTrail('gj003')">展示轨迹</el-button>
    <el-button icon="el-icon-location" size="mini" @click="playTrail('gj003')">回放轨迹</el-button>
    <br> <span>{{lineLength}},{{wkt}}</span>
    <rm-map v-model="map" @clickHandle="onClickFeature"></rm-map>
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
        this.map.centerView([113.88, 27.67], 16)
      },
      removeRiverLine(id) {
        var callback = function(data) {
          console.log('回调：', data)
        }

        this.map.removeLine({ id: id, name: name }, callback)
      },
      selectRiverLine() {
        var lng = null// '113.916'
        var lat = '27.70'
        this.map.selectLine({ id: ["001", "002"], lng: lng, lat: lat })
      },
      drawRiverLine(id, name) {
        // var id = '001'
        var self = this
        var callback = function(type, data) {
          console.log('回调：', type, data)
          if (type === 'change') {
            self.lineLength = data.remarks
            self.wkt = data.wkt
          }
        }

        this.map.drawLine({ id: id, name: name }, callback)
      },
      drawArea(id, name) {
        // var id = '001'
        var self = this
        var callback = function(type, data) {
          console.log('回调：', type, data)
          if (type === 'change') {
            self.lineLength = data.remarks
            self.wkt = data.wkt
          }
        }

        this.map.drawArea({ id: id, name: name }, callback)
      },
      onClickFeature(params) {
        console.log('click handle:', params)
      },
      showFeature(id, type) {
        var lng = '113.916'
        var lat = '27.70'
        console.log("this.map", this.map)
        this.map.showFeature({ list: [{ id: id, gtype: type, name: '测试工单1', lng: lng, lat: lat },{ id: '0002', gtype: type, name: '测试工单2', lng: '113.936', lat: '27.703' }] })
      },
      showTrail(id) {
        var lng = '113.01'
        var lat = '28.00'
        var wkt = 'LINESTRING(113.01 28.00,113.01 27.99,113.06 27.95,113.08 27.95,113.09 27.95,113.12 27.95)'
        //var wkt2 = 'POINT(113.916 27.71)'
        this.map.showTrail({ id: id, wkt: wkt, name: '测试轨迹', lng: lng, lat: lat })
      },
      playTrail(id) {
        //var lng = '113.01'
        // var lat = '28.00'
        // var wkt = 'LINESTRING(113.01 28.00,113.01 27.99,113.06 27.95,113.08 27.95,113.09 27.95,113.12 27.95)'
        //var wkt2 = 'POINT(113.916 27.71)'
        this.map.playTrail({ id: id })
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
