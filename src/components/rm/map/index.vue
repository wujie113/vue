<template>
  <div class="mapContainer">
    <div ref="mapid"  class="map" :style="{height: ClientHeigth + 'px'}"></div>
    <div id="mapctrl" class="map-ctrl-panel">
      <el-popover popper-class="map-ctrl-tool" width="460" placement="left" visible-arrow="false" trigger="manual" v-model="v.tool">
        <el-button-group>
          <el-button id="map-btn-resetview" title="还原视图" size="mini" @click="resetView()">
            <svg-icon icon-class="map-revert" />
          </el-button>
          <el-button id="map-btn-browse" title="浏览模式" size="mini" @click="resetAction">
            <svg-icon icon-class="map-pointer" />
          </el-button>
          <el-button title="新增" icon="el-icon-plus" size="mini" disabled></el-button>
          <el-button title="编辑" icon="el-icon-edit" size="mini" disabled></el-button>
          <!-- <el-button title="范围搜索" icon="el-icon-search" size="mini" disabled></el-button> -->
          <el-button id="map-btn-clean" title="清除绘制操作" icon="el-icon-delete" size="mini" @click="cleanDraw"></el-button>
          <el-button id="map-btn-mea" title="测距" size="mini" @click="meaLine">
            <svg-icon icon-class="map-mea" />
          </el-button>
          <el-button id="map-btn-mark" title="标注" icon="el-icon-location-outline" size="mini" @click="newMarker()"></el-button>
          <el-button id="map-btn-help" title="帮助" icon="el-icon-question" size="mini" @click="help"></el-button>
        </el-button-group>
        <el-button id="map-btn-toolbar" title="工具栏" class="map-ctrl-btn" slot="reference" @click="v.tool=!v.tool">
          <svg-icon icon-class="map-tool" />
        </el-button>
      </el-popover>
      <el-popover title="图层管理" width="400" placement="left-end" trigger="click" v-model="v.ctrl">
        <el-collapse v-model="activeNames">
          <el-collapse-item title="数据图层" name="datalayer">
            <div class="map-c-layer-box" v-for="item in datalayers" :key="item.value" v-bind:class="{active: item.visible}" @click="switchDatalayer(item)">
              <img :src="require('@/../static/map/'+(item.icon || item.id )+'.png')" />
              <span>{{item.name}}</span>
            </div>
          </el-collapse-item>
          <el-collapse-item title="底图图层" name="bglayer">
            <div class="map-c-layer-box" v-for="item in bglayers" :key="item.value" v-bind:class="{ active: item.visible}" @click="switchBglayer(item)">
              <img :src="require('@/../static/map/'+item.id +'.png' )" />
              <span>{{item.name}}</span>
            </div>
          </el-collapse-item>
        </el-collapse>
        <el-button id="map-btn-layer" title="地图图层" class="map-ctrl-btn" slot="reference">
          <svg-icon icon-class="map-layer" />
        </el-button>
      </el-popover>

    </div>

    <!-- 标注编辑框 -->
    <el-popover placement="right" offset="30" title="标注" width="250" trigger="manual" v-model="marker.show">
      <p>
        <el-input v-model="marker.name" placeholder="请输入名称"></el-input>
      </p>
      <div style="text-align: right; margin-top: 30px;">
        <el-button type="danger" size="mini" @click="delMarker()">删除</el-button>
        <el-button size="mini" type="info" @click="marker.show = false">关闭</el-button>
        <el-button type="primary" size="mini" @click="updateMarker()">确定</el-button>
      </div>
      <div id="markpopup" slot="reference"></div>
    </el-popover>

    <!-- 资源属性编辑框 -->
    <el-popover placement="right" offset="30" title="资源属性" width="550" height="500px" trigger="manual" v-model="propanel.show">
      <el-table :data="propanel.list" stripe :show-header="false" style="width: 100%;" max-height="350">
        <el-table-column type="index">
        </el-table-column>
        <el-table-column prop="label" label="属性" width="150" align="left">
        </el-table-column>
        <el-table-column prop="value" label="值" align="left">
        </el-table-column>
      </el-table>
      <div style="text-align: right; margin: 10px">
        <el-button size="mini" type="info" @click="propanel.show = false">关闭</el-button>
      </div>
      <div id="propopup" slot="reference"></div>
    </el-popover>
  </div>
</template> 
<script> 
  import 'ol/ol.css'
  import { Map, View } from 'ol'
  import { Vector as VectorLayer } from 'ol/layer.js'
  import request from '@/utils/request'
  // import { Group as LayerGroup, Tile as TileLayer } from 'ol/layer.js'
  // import { fromLonLat } from 'ol/proj.js'
  import { defaults as defaultControls } from 'ol/control.js'
  import { ScaleLine } from 'ol/control.js'
  import MousePosition from 'ol/control/MousePosition.js'
  import { createStringXY } from 'ol/coordinate.js'
  //import Feature from 'ol/Feature.js'
  import Point from 'ol/geom/Point.js'
  //import XYZ from 'ol/source/XYZ.js'
  import Overlay from 'ol/Overlay.js'
  import { unByKey } from 'ol/Observable.js'
  import { cfg as mapCfg } from "@/components/rm/map/config.js"
  import { utils as mapUtils } from "@/components/rm/map/utils.js"
  import { drawGeom, drawMark, drawMeasure, showUtil } from "@/components/rm/map/draw.js"

  import * as Driver from 'driver.js' // import driver.js
  import 'driver.js/dist/driver.min.css' // import driver.js css
  import steps from './helpSteps'

  export default {
    name: "RmMap",
    props: {
      id: { 
        required: false,
        default: 'map-' + Math.floor(Math.random() * 1000 + 1)
      },
      value: {
        required: false
      },
      clientHeight: {
        required: false,
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        v: { ctrl: false, tool: false },
        map: null,
        pointmoveListner: null,
        clickListner: null,
        bglayers: [], //底图
        datalayers: [],//数据图层
        activeNames: ['datalayer', 'bglayer'],
        marker: {
          show: false,
          name: ''
        },
        propanel: {
          show: false,
          list: []
        },
        driver: null
      }
    },
    // 计算属性
    computed: {
      ClientHeigth() {
        let aa
        if (this.clientHeight) {
          aa = this.clientHeight
        } else {
          aa = this.getHeight(window) - 84
          // 监听window的resize事件．
          const that = this
          window.onresize = function temp() {
            // that.clientHeight = `${document.documentElement.clientHeight}px`
            //console.log('this.getHeight()::::after', that.getHeight(window))
            aa = that.getHeight(window) - 84
          }
        }
        //console.log('aaaaa', aa)
        return aa
        // return this.clientHeight ? this.clientHeight : this.getHeight(window) - 84
      } 
    },
    watch: {

    },
    mounted() { 
      this.initMap()
      this.driver = new Driver({
        doneBtnText: '完成', // Text on the final button
        closeBtnText: '关闭', // Text on the close button for this step
        nextBtnText: '下一个', // Next button text for this step
        prevBtnText: '上一个'
      })
    },    
    beforeDestroy: function() {
      //触发方式,在console里面打myVue.$destroy();
      //在开始销毁实例时调用。此时实例仍然有功能。
      //console.log("销毁前")
      if (this.pointmoveListner) {
        unByKey(this.pointmoveListner)
        this.map.un('pointermove', this.pointmoveListner)
        this.pointmoveListner = null
      }
      if (this.clickListner) {
        unByKey(this.clickListner)
        this.map.un('singleclick', this.clickListner)
        this.clickListner = null
      }
    },
    methods: {
      /**展示点*/
      showFeature(options) {
        this.resetAction()
        //放大
        if (!options.zoomView) {
          var lng = options.lng || options.list[0].lng
          var lat = options.lat || options.list[0].lat
          this.centerView([lng,  lat], 15)
        }
        showUtil.showFeature(this, options)
      },
      /**展示轨迹*/
      showTrail(options) {
        this.resetAction()
        //放大
        if (options.lng) {
          this.centerView([options.lng, options.lat], 15)
        }
        showUtil.showTrail(this, options)
      },
      /**回访轨迹*/
      playTrail(options) {
        this.resetAction()
        //放大
        //  if (options.lng) {
        //   this.centerView([options.lng, options.lat], 12)
        // }
        showUtil.playTrail(this, options)
      },
      /**选中线段*/
      selectLine(options) {
        this.resetAction()
        //放大
        if (options.lng) {
          this.centerView([options.lng, options.lat], 16)
        }
        drawGeom.selectGeom(this.map, 'zerenduan', options)
      },
      /**绘制责任段 */
      drawLine(options, callbackFunc) {
        this.resetAction()
        drawGeom.draw(this.map, 'LineString', 'zerenduan', options, callbackFunc)
      },
      /**删除责任段绘制内容 */
      removeLine(options, callbackFunc) {
        drawGeom.removeGeom(this.map, 'zerenduan', options, callbackFunc)
      },
      /**绘制胡泊 */
      drawArea(options, callbackFunc) {
        this.resetAction()
        drawGeom.draw(this.map, 'Polygon', 'hupo', options, callbackFunc)
      },
      /**删除湖泊绘制内容 */
      removeHupo(options, callbackFunc) {
        drawGeom.removeGeom(this.map, 'hupo', options, callbackFunc)
      },
      /**打卡点 */
      drawDakadian(options, callbackFunc) {
        this.resetAction()
        drawGeom.draw(this.map, 'Point', 'dakadian', options, callbackFunc)
      },
      /**删除打卡点绘制内容 */
      removeDakadian(options, callbackFunc) {
        drawGeom.removeGeom(this.map, 'dakadian', options, callbackFunc)
      },
      resetAction() {
        /**还原操作，比如之前是做测距操作，接着想做标注操作，在每个操作之前，都应该清空之前的设置 */
        drawMeasure.close()
        drawGeom.close()
        drawMark.close()
      },
      cleanDraw() {
        drawMeasure.clean()
        this.resetAction()
      },
      meaLine() {
        this.resetAction()
        var cb = function(data) {
          console.log('回调，测距', data)
        }
        drawMeasure.meaLine(this, cb)
        //drawMeasure.meaArea(this, cb)
      },
      newMarker() {
        this.resetAction()
        var cb = function(data) {
          console.log('回调，标注', data)
        }
        drawMark.markPoint(this, cb)
      },
      showMarkPopup(data) {
        this.marker = data
      },
      hideMarkPopup() {
        // this.$set(this.marker,'show','false')
        this.marker.show = false
      },
      updateMarker() {
        //设置名称
        this.marker.f.set('name', this.marker.name)
        this.marker.show = false
      },
      delMarker() {
        //删除
        drawMark.delMark(this, this.marker.f)
        this.marker.show = false
      },
      help() {
        this.driver.defineSteps(steps)
        this.driver.start()
      },
      resetView() {
        this.centerView(mapCfg.center, mapCfg.zoom)
      },
      centerView(coord, zoom) {
        zoom = zoom === undefined ? 16 : zoom
        if (!coord[0] || !coord[1]) return
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
      showProperties(id, type) {
        //console.log('显示对象属性：', id, type)
        this.propanel.show = false
        console.log("id::::",id)
        request({
          url: '/api/res/river/sourcecomment',
          method: 'get',
          params: { id: id, type: type }
        }).then(response => {
          //console.log('对象属性：', response)
          this.propanel.list = response.data.list
          //显示窗口
          this.propanel.show = true
        })
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
       // console.log('initMap',  this.map)
        this.map = new Map({
          target: this.$refs.mapid,
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

        var bglayers =  mapCfg.bglayers 
        //console.log(JSON.stringify(mapCfg.datalayers))
        //数据图层要拷贝配置，防止不同页面之间数据共享
        var datalayers = JSON.parse(JSON.stringify(mapCfg.datalayers)) 
        //初始化底图
        mapUtils.initBgLayers(this.map,  bglayers)
        mapUtils.initBaseLayer(this.map) //添加基础图层，包括选择搜索、搜索结果、绘画层
        mapUtils.initDataLayer(this.map,  datalayers) //添加数据图层

        //初始化地图操作控件
        this.bglayers =  bglayers
        this.datalayers = datalayers

        //属性框
        if (!this.proOverlay) {
          this.proOverlay = new Overlay({
            element: document.getElementById('propopup')
          })
          this.map.addOverlay(this.proOverlay)
        }


        //alert('reg map click listner ')
        var self = this
        var clickListnerFunc = function(evt) {
          var pixel = self.map.getEventPixel(evt.originalEvent)
          //document.getElementById('info').innerHTML = ''
          var viewResolution = /** @type {number} */ (self.map.getView().getResolution())

          //栅格图层处理方式
          self.map.forEachLayerAtPixel(pixel, function(layer) {
            //console.log('cb:', layer)
            if (layer instanceof VectorLayer) {
              var f = layer.getSource().getClosestFeatureToCoordinate(evt.coordinate)
              //console.log(f.getId(), f.get('name'))
              //如果是工单类型，向上抛出事件，如果是资源类型的，显示属性窗口
              if (f.get('gtype') === 'tousu' || f.get('gtype') === 'shangbao') {
                //向上抛出事件，由上级页面处理展示内容
                self.$emit("clickHandle", { type: f.get('gtype'), id: f.get('id'), name: f.get('name'), x: evt.originalEvent.x, y: evt.originalEvent.y })
              } else {
                 self.showProperties(f.get('id'), f.get('gtype'))
                    //设置显示位置 
                 self.proOverlay.setPosition(evt.coordinate)
              }
            } else {
              //从geoserver获取feature信息URL,'INFO_FORMAT': 'text/html',application/json
              var url = layer.getSource().getGetFeatureInfoUrl(evt.coordinate, viewResolution, mapCfg.projection,
                { 'INFO_FORMAT': 'application/json' })
              //console.log('f url:', url)
              if (url) {
                //document.getElementById('info').innerHTML = '<iframe seamless src="' + url + '"></iframe>'
                mapUtils.getFeatureInfo(url).then(response => {
                  //console.log(response.features)
                  if (response.features.length > 0) {
                    var f = response.features[0] 
                    var id = f.id.split('.')[1]
                    console.log(id, f.properties.name)
                    self.showProperties(id, f.properties.gtype)
                    //设置显示位置 
                    self.proOverlay.setPosition(evt.coordinate)
                  }
                })
              }
            }
            return true
          }, {
              layerFilter: function(l) {
                //只检查数据图层
                return l.get('ltype') === "wms" || l.get('ltype') === "base"
              },
              hitTolerance: 10
            })
        }
        this.clickListner = this.map.on('singleclick', clickListnerFunc)

        this.pointmoveListner = this.map.on('pointermove', function(evt) {
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
                  return l.get('ltype') === "wms" || l.get('ltype') === "base"
                },
                hitTolerance: 10
              })
            self.map.getTargetElement().style.cursor = hit ? 'pointer' : ''
          } catch (error) {
            // console.error(error.message)
          }
        })

        //选择组件
        // var select = new Select()
        // this.map.addInteraction(select)

        //将map对象传给父页面
        this.$emit("input", this)
      }
    }
  }
</script>
<style scoped>
  .mapContainer {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .map {
    height: calc(100vh - 84px);
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

  .pro-label {
    min-width: 150px;
  }

  .tooltip-measure {
    color: #e6a23c;
  }
  /deep/ .cell{
    white-space:normal !important
  }
</style>
