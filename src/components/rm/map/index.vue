<template> 
    <div class="mapContainer">
        <div id="map" class="map"></div>
        <div id="mapctrl" class="map-ctrl-panel">
            <el-popover popper-class="map-ctrl-tool" width="460" placement="left" visible-arrow="false" trigger="manual" v-model="v.tool">
                <el-button-group>
                    <el-button title="还原视图" size="mini" @click="resetView()">
                        <svg-icon icon-class="map-revert" />
                    </el-button>
                    <el-button title="新增" icon="el-icon-plus" size="mini"></el-button>
                    <el-button icon="el-icon-edit" size="mini"></el-button>
                    <el-button icon="el-icon-delete" size="mini"></el-button>
                    <el-button title="范围搜索" icon="el-icon-search" size="mini"></el-button>
                    <el-button title="测距" size="mini">
                        <svg-icon icon-class="map-mea" />
                    </el-button>
                    <el-button title="标注" icon="el-icon-location-outline" size="mini"></el-button>
                    <el-button title="帮助" icon="el-icon-question" size="mini"></el-button>
                </el-button-group>
                <el-button title="工具栏" class="map-ctrl-btn" slot="reference" @click="v.tool=!v.tool">
                    <svg-icon icon-class="map-tool" />
                </el-button>
            </el-popover>
            <el-popover title="图层管理" width="400" placement="left-end" trigger="click" v-model="v.ctrl">
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
                <el-button title="地图图层" class="map-ctrl-btn" slot="reference">
                    <svg-icon icon-class="map-layer" />
                </el-button>
            </el-popover>

        </div>
    </div>
</template> 
<script> 
    import 'ol/ol.css'
    import { Map, View } from 'ol'
    // import { Group as LayerGroup, Tile as TileLayer } from 'ol/layer.js'
    // import { fromLonLat } from 'ol/proj.js'
    import { defaults as defaultControls } from 'ol/control.js'
    import { ScaleLine } from 'ol/control.js'
    import MousePosition from 'ol/control/MousePosition.js'
    import { createStringXY } from 'ol/coordinate.js'
    //import Feature from 'ol/Feature.js'
    import Point from 'ol/geom/Point.js'
    //import XYZ from 'ol/source/XYZ.js'
    import { cfg as mapCfg } from "@/components/rm/map/config.js"
    import { utils as mapUtils } from "@/components/rm/map/utils.js"
    export default {
        name: "RmMap",
        props: {
            value: {
                required: false
            }
        },
        data() {
            return {
                v: { ctrl: false, tool: false },
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
            resetView() {
                this.centerView(mapCfg.center, mapCfg.zoom)
            },
            centerView(coord, zoom) {
                zoom = zoom === undefined ? 16 : zoom
                //console.log(zoom, coord)
                var geo = (new Point(coord))

                // var pf = new Feature({
                //     geometry: new Point(coord)
                // })
                //var geo = (pf.getGeometry())
                this.map.getView().fit(geo, {
                    padding: [100, 100, 100, 100],
                    constrainResolution: false,
                    nearest: false,
                    maxZoom: zoom,
                    duration: 2000
                })
                //this.map.getView().fit(geo, {padding: [170, 50, 30, 150], constrainResolution: false});
                // this.map.getView().centerOn(coord, size, [570, 500])
            },
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
                var self = this
                this.map.on('singleclick', function(evt) {
                    var pixel = self.map.getEventPixel(evt.originalEvent)
                    //document.getElementById('info').innerHTML = ''
                    var viewResolution = /** @type {number} */ (self.map.getView().getResolution())
                    self.map.forEachLayerAtPixel(pixel, function(layer) {
                        //console.log('cb:',layer)
                        //从geoserver获取feature信息URL,'INFO_FORMAT': 'text/html',application/json
                        var url = layer.getSource().getGetFeatureInfoUrl(evt.coordinate, viewResolution, mapCfg.projection, 
                        { 'INFO_FORMAT': 'application/json' })
                        console.log('f url:', url)
                        if (url) {
                            //document.getElementById('info').innerHTML = '<iframe seamless src="' + url + '"></iframe>'
                            mapUtils.getFeatureInfo(url).then(response => {
                                console.log(response.features)
                                if (response.features.length > 0) {
                                   var f = response.features[0]  
                                    console.log(f.properties.id,f.properties.name)
                                }
                            })
                        }
                        return true
                    }, {
                            layerFilter: function(l) {
                                //只检查数据图层
                                return l.get('ltype') === "data"
                            },
                            hitTolerance: 10
                        })
                })

                this.map.on('pointermove', function(evt) {
                    if (evt.dragging) {
                        return
                    }
                    //如果有对象，显示手型指针
                    try {
                        var pixel = self.map.getEventPixel(evt.originalEvent)
                        var hit = self.map.forEachLayerAtPixel(pixel, function(layer) {
                            //console.log('cb:',layer)
                            return true
                        }, {
                                layerFilter: function(l) {
                                    //只检查数据图层
                                    return l.get('ltype') === "data"
                                },
                                hitTolerance: 10
                            })
                        self.map.getTargetElement().style.cursor = hit ? 'pointer' : ''
                    } catch (error) {
                        // console.error(error.message)
                    }
                })


                //将map对象传给父页面
                this.$emit("input", this)
            }
        }
    }
</script>
<style>
    .mapContainer {
        width: 100%;
        height: 100%;
    }
    .map {
        height: 83vh;
    }
    .ol-mouse-position {
      top: auto;
      bottom: 25px;
      left: 10px;
      position: absolute;
      color: #ccc;
    }
    .ol-zoom.ol-control {
      top: 250px;
      left: auto;
      right: 10px;
      width: 50px;
      background-color: inherit;
      padding: 0px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
    }
    .ol-zoom.ol-control:hover {
      background-color: inherit;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.5);
    }
    .ol-zoom.ol-control button {
      width: 50px;
      height: 50px;
      font-size: 35px;
      color: #606266;
      background-color: rgba(255, 255, 255, 0.8);
      border: 0px;
    }
    .ol-zoom.ol-control button:hover,
    .ol-zoom.ol-control button:focus {
      text-decoration: none;
      color: #409eff;
      border: 0px;
      background-color: #ecf5ff;
    }

    .map-ctrl-panel {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 50px;
    }
    .map-ctrl-tool {
      padding: 2px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }
    .map-ctrl-tool:hover {
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.5);
    }

    .map-ctrl-tool button {
      font-size: 25px;
    }

    .map-ctrl-btn {
      width: 50px;
      height: 50px;
      font-size: 30px;
      padding: 0px;
      margin: 2px 0px;
      background-color: rgba(255, 255, 255, 0.8);
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }
    .map-ctrl-btn:hover {
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.5);
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
    .map-c-layer-box img:hover {
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.5);
    }
    .map-c-layer-box.active {
      color: #3280fc;
    }
    .map-c-layer-box.active img {
      border: 2px solid #3280fc;
      box-shadow: 0px 0px 7px #3280fc;
    }
</style>
