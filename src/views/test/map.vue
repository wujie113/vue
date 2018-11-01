<template>
    <div>
        <div id="mapctrl">
            <el-popover placement="图层管理" width="400" trigger="click">
                <el-collapse v-model="activeNames">
                    <el-collapse-item title="数据图层" name="datalayer">
                        <div class="map-c-layer-box" v-for="item in datalayers" :key="item.value" v-bind:class="{active: item.visible}" @click="switchDatalayer(item)">
                            <img :src="'/static/map/'+item.id +'.png'" />
                            <span>{{item.name}}</span>
                        </div>
                    </el-collapse-item>
                    <el-collapse-item title="底图图层" name="bglayer">
                        <div class="map-c-layer-box" v-for="item in bglayers" :key="item.value" v-bind:class="{ active: item.visible}" @click="switchBglayer(item)">
                            <img :src="'/static/map/'+item.id +'.png' " />
                            <span>{{item.name}}</span>
                        </div>
                    </el-collapse-item>
                </el-collapse>
                <el-button slot="reference">图层</el-button>
            </el-popover>
        </div>
        <svg-icon icon-class="map-tool" />
        <svg-icon icon-class="map-layer" />
        <div id="map" class="map"></div>
    </div>
</template> 
<script> 
    import 'ol/ol.css'
    import { Map, View } from 'ol'
    //import { Group as LayerGroup, Tile as TileLayer } from 'ol/layer.js'
    import { fromLonLat } from 'ol/proj.js'
    import { defaults as defaultControls } from 'ol/control.js'
    import { ScaleLine } from 'ol/control.js'
    import MousePosition from 'ol/control/MousePosition.js'
    import { createStringXY } from 'ol/coordinate.js'
    //import XYZ from 'ol/source/XYZ.js'
    import { cfg as mapCfg } from "@/components/rm/map/config.js"
    import { utils as mapUtils } from "@/components/rm/map/utils.js"
    export default {
        data() {
            return {
                map: null,
                bglayers: [], //底图
                datalayers: [],//数据图层
                activeNames: ['datalayer', 'bglayer']
            }
        },
        mounted() {
            this.initMap()
        },
        methods: {
            switchDatalayer(layer) {
                layer.visible = !layer.visible
                //console.log(layer)
                layer.layer.setVisible(layer.visible)
            },
            switchBglayer(layer) {
                //console.log(layer)
                layer.visible = true
                mapUtils.switchBglayer(this.map, layer, mapCfg.bglayers)
            },
            initMap() {
                //console.log('initMap')
                this.map = new Map({
                    target: 'map',
                    controls: defaultControls({
                        attribution: true,
                        attributionOptions: {
                            collapsible: true
                        },
                        zoomOptions: { zoomInTipLabel: '放大', zoomOutTipLabel: '缩小' }
                    }).extend([new ScaleLine({ units: 'metric' }), new MousePosition({
                        coordinateFormat: createStringXY(4),
                        projection: 'EPSG:4326',
                        undefinedHTML: '&nbsp;'
                    })]),
                    layers: [
                    ],
                    view: new View({
                        center: mapCfg.center,//, fromLonLat(mapCfg.center)
                        projection: mapCfg.projection,
                        minZoom: mapCfg.minZoom,
                        zoom: mapCfg.zoom
                    })
                })

                //初始化底图
                mapUtils.initBgLayers(this.map, mapCfg.bglayers)
                mapUtils.initBaseLayer(this.map) //添加基础图层，包括选择搜索、搜索结果、绘画层
                mapUtils.initDataLayer(this.map, mapCfg.datalayers) //添加数据图层

                //初始化地图操作控件
                this.bglayers = mapCfg.bglayers
                this.datalayers = mapCfg.datalayers
            }
        }
    }
</script>
<style>
    .ol-mouse-position {
      top: auto;
      bottom: 25px;
      left: 10px;
      position: absolute;
      color: #ccc;
    }
    .map-c-layer-box {
      width: 90px;
      height: 70px;
      display: inline-block;
      text-align: center;
    }
    .map-c-layer-box img {
      width: 80px;
      height: 50px;
      display: block;
    }
    .map-c-layer-box.active {
      color: #3280fc;
    }
    .map-c-layer-box.active img {
      border: 2px solid #3280fc;
      box-shadow: 0px 0px 7px #3280fc;
    }
</style>
