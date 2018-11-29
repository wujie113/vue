import { cfg as mapCfg } from "@/components/rm/map/config.js"
import { utils as mapUtils } from "@/components/rm/map/utils.js"
import { Vector as VectorSource } from 'ol/source.js'
import { Draw, Modify, Snap, Select } from 'ol/interaction.js'
import { LineString, Polygon } from 'ol/geom.js'
import { unByKey } from 'ol/Observable.js'
import Collection from 'ol/Collection'
import { getArea, getLength } from 'ol/sphere.js'
import Overlay from 'ol/Overlay.js'
import WKT from 'ol/format/WKT.js'
import { drawingStyleFunc, markerSelectedStyleFunc, measureStyleFunc,selectedStyleFunc } from "@/components/rm/map/style.js"


//绘制河流责任段
export const drawGeom = {
    selectGeom: function(map, layerCode, options) {
        this.map = map
        this.featureId = options.id
        this.featureName = options.name
        
        this.fid = layerCode + '.' + this.featureId
        this.layer = this.getLayerByCode(layerCode)
        if (this.selectedFeature) {
            this.selectedFeature.setStyle(null)
        }
        if (this.layer) {
            this.layer.setVisible(true)
            this.selectedFeature = this.layer.getSource().getFeatureById(this.fid)
            //console.log("选中记录",this.fid,this.selectedFeature)
            if (!this.selectedFeature) return 
            this.selectedFeature.setStyle(selectedStyleFunc)
        }
    },
    /**
     * 
     * @param {地图组件} map 
     * @param {要绘制的对象类型，点、线、多边形等} geotype 
     * @param {对象属性} options
     * @param { 绘画回调函数} callbackFunc  
     */
    draw: function(map, geotype, layerCode, options, callbackFunc) {
        var isInit = true
        if (this.map) {
            isInit = false
        }

        this.map = map
        this.featureId = options.id
        this.featureName = options.name
        this.callbackFunc = callbackFunc

        /**绘制责任段，默认在责任段图层中绘制 */
        //var layerCode = "zerenduan"
        this.geotype = geotype
        this.fid = layerCode + '.' + this.featureId

        this.layer = this.getLayerByCode(layerCode)
        //如果没有找到图层，则在绘画图层上
        if (!this.layer) {
            this.layer = this.getLayerByCode('drawlayer')
        } else {
            this.layer.setVisible(true)
        }

        //先清理下记录
        this.clean()

        //先在图层中查找featureid，如果找到就修改操作，如果没找到新增操作
        var source = this.layer.getSource()
        if (source instanceof VectorSource) {
            var f = source.getFeatureById(this.fid)
            if (f) {
                console.log('对象已经存在,modify')
                //修改      
                f.setStyle(drawingStyleFunc)
            }
            this.sketch = f
            this.bindChangeLister(this.sketch)
        } else {
            //
            console.error('非Vector图层，不能绘图')
        }

        //初始化地图绘画、修改等控件 
        this.initInteraction(isInit)
    },
    /**
     * 清除上一次操作痕迹
     */
    clean: function() {
        if (this.drawInteraction) {
            //先清除draw、modify的Interaction
            this.map.removeInteraction(this.drawInteraction)
            this.map.removeInteraction(this.modifyInteraction)
            // this.map.removeInteraction(this.select)
            this.map.removeInteraction(this.snap)
            // this.select.getFeatures().clear()

            this.drawInteraction = null
            this.modifyInteraction = null
            this.snap = null
        }

        if (this.sketch) {
            this.sketch.setStyle(null)
            this.unbindLister(this.sketch)
        }
        if (this.selectedFeature) {
            this.selectedFeature.setStyle(null)
        }
    },
    bindChangeLister: function(f) {
        if (f) {
            var self = this
            this.listener = f.getGeometry().on('change', function(evt) {
                var geom = evt.target
                //console.log('change……', f.getId(), geom)
                var output
                if (geom instanceof Polygon) {
                    output = self.formatArea(geom)
                } else if (geom instanceof LineString) {
                    output = self.formatLength(geom)
                }
                self.callbackFunc('change', { feature: self.sketch, remarks: output, coord: geom.getFirstCoordinate(), wkt: self.toWKT(geom) })
            })
        }
    },
    unbindLister: function(f) {
        if (this.listener && f) {
            unByKey(this.listener)
        }
    },
    close: function() {
        //if (this.drawInteraction) {
        //    this.drawInteraction.setActive(false)
        //     this.modifyInteraction.setActive(false)
        // }
        this.clean()
    },
    initInteraction: function(isInit) {
        this.initDraw()
        this.initModify()
    },
    initDraw: function() {
        this.drawInteraction = new Draw({
            source: this.layer.getSource(),
            type: this.geotype,
            geometryName: this.featureName
        })
        this.map.addInteraction(this.drawInteraction)
        this.setDrawActive(true)
        this.setModifyActive(false)

        var self = this
        this.drawInteraction.on('drawstart',
            function(evt) {
                // set sketch
                self.sketch = evt.feature
                self.callbackFunc('start', { feature: self.sketch })

                self.sketch.setId(self.fid) //设置对象id
                self.sketch.set('name', self.featureName)//对象名称
                //设置Style
                self.sketch.setStyle(drawingStyleFunc)

                self.bindChangeLister(self.sketch)
            }, this)

        this.drawInteraction.on('drawend',
            function() {
                console.log('drawend……')
                // unset sketch
                self.callbackFunc('end', { feature: self.sketch })


                //关闭绘制功能，打开修改功能
                self.setDrawActive(false)
                self.setModifyActive(true)

                //self.sketch.setStyle(null)
                //self.sketch = null
                //unByKey(self.listener)
            }, this)
    },
    initModify: function() {
        if (!this.sketch) return
        var fs = new Collection([this.sketch])
        // this.select = new Select({
        //     features: new Collection([this.sketch])
        // })
        // this.map.addInteraction(this.select)
        // console.log('init modify fs ', fs.getArray().length)
        this.modifyInteraction = new Modify({
            features: fs
            //features: this.select.getFeatures()
            //source: this.layer.getSource()
        })
        this.map.addInteraction(this.modifyInteraction)
        this.setDrawActive(false)
        this.setModifyActive(true)

        this.setEvents()

        // The snap interaction must be added after the Modify and Draw interactions
        // in order for its map browser event handlers to be fired first. Its handlers
        // are responsible of doing the snapping.
        var snap = new Snap({
            //source: this.layer.getSource()
            features: fs
        })
        this.map.addInteraction(snap)
    },
    setEvents: function() {
        // var selectedFeatures = this.select.getFeatures()

        // this.select.on('change:active', function() {
        //     console.log('select changes,', selectedFeatures.length)
        //     selectedFeatures.forEach(function(each) {
        //         selectedFeatures.remove(each)
        //     })
        // })
    },
    setModifyActive: function(active) {
        if (!this.modifyInteraction && this.sketch) {
            this.initModify()
        }
        if (this.modifyInteraction) {
            // this.select.setActive(active)
            this.modifyInteraction.setActive(active)
        }
    },
    setDrawActive: function(active) {
        this.drawInteraction.setActive(active)
    },
    getLayerByCode: function(code) {
        var layer = null
        this.map.getLayers().forEach(function(l, i, arr) {
            var layerCode = l.get('code')
            if (layerCode === code) {
                layer = l
            }
        })
        return layer
    },
    /**
     * Format length output.
     * @param {module:ol/geom/LineString~LineString} line The line.
     * @return {string} The formatted length.
     */
    formatLength: function(line) {
        var length = getLength(line, { projection: mapCfg.projection })
        var output
        if (length > 100) {
            output = (Math.round(length / 1000 * 100) / 100) +
                ' ' + 'km'
        } else {
            output = (Math.round(length * 100) / 100) +
                ' ' + 'm'
        }
        return output
    },
    /**
       * Format area output.
       * @param {module:ol/geom/Polygon~Polygon} polygon The polygon.
       * @return {string} Formatted area.
       */
    formatArea: function(polygon) {
        var area = getArea(polygon, { projection: mapCfg.projection })
        var output
        if (area > 10000) {
            output = (Math.round(area / 1000000 * 100) / 100) +
                ' ' + 'km²'
        } else {
            output = (Math.round(area * 100) / 100) +
                ' ' + 'm²'
        }
        return output
    },
    toWKT: function(geom) {
        if (!this.wkt) {
            this.wkt = new WKT()
        }
        return this.wkt.writeGeometry(geom)
    }
}
//=================================================================================
//=================================================================================
//=================================================================================
//绘制标注点
export const drawMark = {
    markPoint: function(parent, callbackFunc) {
        this.parent = parent
        this.map = parent.map
        this.callbackFunc = callbackFunc
        this.layer = this.getLayerByCode('markerLayer')

        this.initInteraction()
        this.draw.setActive(true)
        this.modifyInteraction.setActive(true)
    },
    delMark: function(parent, feature) {
        this.parent = parent
        this.layer = this.getLayerByCode('markerLayer')
        this.layer.getSource().removeFeature(feature)
    },
    showInputOverlay: function(f) {
        if (f) {
            //展示名字输入框
            if (!this.inputOverlay) {
                this.inputOverlay = new Overlay({
                    element: document.getElementById('markpopup')
                })
                this.map.addOverlay(this.inputOverlay)
            }
            //设置显示位置
            var coordinate = f.getGeometry().getFirstCoordinate()
            this.inputOverlay.setPosition(coordinate)
            //var element = this.inputOverlay.getElement()
            //var pos = fromLonLat(coordinate,mapCfg.projection)
            //element.innerHTML = pos

            this.parent.showMarkPopup({ show: true, name: f.get('name'), f: f })
        }
    },
    close: function() {
        if (this.draw) {
            this.draw.setActive(false)
            this.modifyInteraction.setActive(false)
        }
    },
    initInteraction: function() {
        if (this.draw) return

        //this.cleanInteraction()
        // this.cleanInteraction()

        // this.map.getInteractions().forEach(function(interaction, i, arr) {
        //     console.log(interaction)
        // })

        this.draw = new Draw({
            source: this.layer.getSource(),
            type: "Point"
        })
        this.map.addInteraction(this.draw)
        var self = this
        this.draw.on('drawstart',
            function(evt) {
                self.sketch = evt.feature
                if (!self.count) {
                    self.count = 1
                }
                self.sketch.set('name', '标注' + self.count)
                self.count = self.count + 1
            })
        this.draw.on('drawend',
            function(evt) {
                self.draw.setActive(false)
                self.sketch = evt.feature
                //self.showInputOverlay(self.sketch)
                self.callbackFunc({ type: 'end', coord: self.sketch.getGeometry().getFirstCoordinate(), f: self.sketch })
            })


        //指定固定layer有效
        this.select = new Select({ layers: [this.layer], style: markerSelectedStyleFunc })
        this.select.set('code', 'marker')
        this.map.addInteraction(this.select)
        // console.log('init modify fs ', fs.getArray().length)
        this.modifyInteraction = new Modify({
            //source: this.layer.getSource()
            features: this.select.getFeatures()
        })
        this.map.addInteraction(this.modifyInteraction)
        this.modifyInteraction.setActive(true)
        this.modifyInteraction.on('modifyend',
            function(evt) {
                if (evt.features.getLength() > 0) {
                    self.sketch = evt.features.item(0)
                    //self.showInputOverlay(self.sketch)
                    self.callbackFunc({ type: 'end', coord: self.sketch ? self.sketch.getGeometry().getFirstCoordinate() : null, f: self.sketch })
                }
            })
        // var selectedFeatures = this.select.getFeatures()
        // this.select.on('change:active', function() {
        //     console.log('select changes,', selectedFeatures.length)
        //     selectedFeatures.forEach(function(each) {
        //         selectedFeatures.remove(each)
        //     })
        // })
        this.select.on('select', function(evt) {
            //console.log('mark select ,', evt)
            //取消选中
            if (evt.selected.length > 0) {
                self.sketch = evt.selected[0]
                self.parent.hideMarkPopup()
                setTimeout(function() {
                    self.showInputOverlay(self.sketch)
                }, 100)
            }
            //取消选中
            if (evt.deselected.length > 0) {
                //evt.deselected[0]
                self.sketch.setStyle(null)
            }
        })

        // The snap interaction must be added after the Modify and Draw interactions
        // in order for its map browser event handlers to be fired first. Its handlers
        // are responsible of doing the snapping.
        var snap = new Snap({
            source: this.layer.getSource()
        })
        this.map.addInteraction(snap)
    },
    cleanInteraction: function() {
        /**将所有draw/Modify/Snap都删除，避免状态混乱 */
        var self = this
        this.map.getInteractions().forEach(function(interaction, i, arr) {
            console.log(i, interaction ? interaction.getActive() : false, interaction)
            if ((interaction instanceof Draw) || (interaction instanceof Modify) || (interaction instanceof Snap)) {
                //console.log('remove', interaction.getActive(), interaction)
                try {
                    interaction.setActive(false)
                    self.map.removeInteraction(interaction)
                } catch (e) {
                    console.error(e.message)
                }
            }
        })
    },
    getLayerByCode: function(code) {
        var layer = null
        this.map.getLayers().forEach(function(l, i, arr) {
            var layerCode = l.get('code')
            if (layerCode === code) {
                layer = l
            }
        })
        return layer
    }
}
//=================================================================================
//=================================================================================
//=================================================================================
export const drawMeasure = {
    /**测距离 */
    meaLine: function(parent, callbackFunc) {
        this.geotype = 'LineString'

        this.init(parent, callbackFunc)
    },
    /**测面积 */
    meaArea: function(parent, callbackFunc) {
        this.geotype = 'Polygon'

        this.init(parent, callbackFunc)
    },
    init: function(parent, callbackFunc) {
        this.parent = parent
        this.map = parent.map
        this.callbackFunc = callbackFunc

        this.layer = mapUtils.getLayerByCode(this.map, 'meaLayer')

        //初始化变量
        this.initVar()

        this.initInteraction()

        this.draw.setActive(true)
        this.modifyInteraction.setActive(true)
    },
    clean: function() {
        if (!this.map) return
        this.sketch = null
        this.layer.getSource().clear()
        //解除绑定事件
        unByKey(this.pointermoveListener)
        unByKey(this.mouseoutListener)
        unByKey(this.listener)

        this.pointermoveListener = null
        this.mouseoutListener = null
        var self = this
        this.map.getOverlays().forEach(function(ol, i) {
            if (!ol) return
            //console.log(ol,ol.get('_type'))
            if (ol.get('_type') === 'meatext') {
                self.map.removeOverlay(ol)
            }
        })
        //this.map.removeInteraction(this.draw)
        //this.draw = null
        this.close()
    },
    initVar: function() {
        //操作对象
        this.sketch = null
        // 帮助提示容器
        this.helpTooltipElement
        //帮助提示信息
        this.helpTooltip
        this.measureTooltipElement
        this.measureTooltip
        this.continuePolygonMsg = '单击，继续绘制多边形'
        this.continueLineMsg = '单击，继续绘制线条'


        if (this.pointermoveListener) return

        this.createHelpTooltip()

        // 初始化map事件

        var self = this
        /**
       * Handle pointer move.
       * @param {module:ol/MapBrowserEvent~MapBrowserEvent} evt The event.
       */
        var pointerMoveHandler = function(evt) {
            if (evt.dragging || !self.draw.getActive()) {
                return
            }
            /** @type {string} */
            var helpMsg = '单击开始'

            if (self.sketch) {
                var geom = (self.sketch.getGeometry())
                if (geom instanceof Polygon) {
                    helpMsg = self.continuePolygonMsg
                } else if (geom instanceof LineString) {
                    helpMsg = self.continueLineMsg
                }
            }

            self.helpTooltipElement.innerHTML = helpMsg
            self.helpTooltip.setPosition(evt.coordinate)

            self.helpTooltipElement.classList.remove('hidden')
        }

        this.pointermoveListener = this.map.on('pointermove', pointerMoveHandler)
        this.mouseoutListener = this.map.getViewport().addEventListener('mouseout', function() {
            self.helpTooltipElement.classList.add('hidden')
        })
    },
    close: function() {
        if (this.draw) {
            this.draw.setActive(false)
            this.modifyInteraction.setActive(false)
        }
    },
    initInteraction: function() {
        if (this.draw) return

        console.log('new draw interaction')
        this.draw = new Draw({
            source: this.layer.getSource(),
            type: this.geotype,
            style: measureStyleFunc
        })
        this.map.addInteraction(this.draw)


        var self = this
        this.draw.on('drawstart',
            function(evt) {
                // set sketch
                self.sketch = evt.feature
                if (!self.count) {
                    self.count = 0
                }
                self.count = self.count + 1
                var id = self.count
                self.sketch.set('code', id)

                /** @type {module:ol/coordinate~Coordinate|undefined} */
                var tooltipCoord = evt.coordinate

                self.measureTooltipElement = null
                self.createMeasureTooltip()
                //绑定提示对象
                self.sketch.getGeometry().set('_m_ele', self.measureTooltipElement)
                self.sketch.getGeometry().set('_m_tip', self.measureTooltip)
                self.measureTooltip.set('code', id)


                self.listener = self.sketch.getGeometry().on('change', function(evt) {
                    var geom = evt.target
                    console.log('geom', mapUtils.toWKT(geom))
                    var output
                    if (geom instanceof Polygon) {
                        output = mapUtils.formatArea(geom)
                        tooltipCoord = geom.getInteriorPoint().getCoordinates()
                    } else if (geom instanceof LineString) {
                        output = mapUtils.formatLength(geom)
                        tooltipCoord = geom.getLastCoordinate()
                    }

                    //修改相应对象的值
                    var tooltipElement = geom.get('_m_ele')
                    var measureTooltip = geom.get('_m_tip')
                    if (measureTooltip) {
                        tooltipElement.innerHTML = output
                        measureTooltip.setPosition(tooltipCoord)
                    }
                })
            }, this)

        this.draw.on('drawend',
            function() {
                self.measureTooltipElement.className = 'tooltip tooltip-static'
                self.measureTooltip.setOffset([0, -7])

                // unset sketch
                // self.sketch = null
                // unset tooltip so that a new one can be created
                // self.measureTooltipElement = null
                //self.createMeasureTooltip()
                //unByKey(listener)

                self.helpTooltipElement.innerHTML = ''
                self.draw.setActive(false)
            }, this)

        this.modifyInteraction = new Modify({
            source: this.layer.getSource()
        })
        this.map.addInteraction(this.modifyInteraction)
        // this.modifyInteraction.on('modifystart', function(evt) {
        //self.sketch = evt.features.item(0)
        ///console.log('modifystart', evt.features.getLength(), self.sketch.get('code'),evt)
        // })
        var snap = new Snap({
            source: this.layer.getSource()
        })
        this.map.addInteraction(snap)
    },
    /**
      * Creates a new help tooltip
      */
    createHelpTooltip: function() {
        console.log('new  HelpTooltip')
        if (this.helpTooltipElement) {
            this.helpTooltipElement.parentNode.removeChild(this.helpTooltipElement)
        }
        this.helpTooltipElement = document.createElement('div')
        this.helpTooltipElement.className = 'tooltip hidden'
        this.helpTooltip = new Overlay({
            element: this.helpTooltipElement,
            offset: [15, 0],
            positioning: 'center-left'
        })
        this.helpTooltip.set('_type', 'helptext')
        this.map.addOverlay(this.helpTooltip)
    },
    /**
     * Creates a new measure tooltip
     */
    createMeasureTooltip: function() {
        console.log('new  MeasureTooltip')
        if (this.measureTooltipElement) {
            this.measureTooltipElement.parentNode.removeChild(this.measureTooltipElement)
        }
        this.measureTooltipElement = document.createElement('div')
        this.measureTooltipElement.className = 'tooltip tooltip-measure'
        this.measureTooltip = new Overlay({
            element: this.measureTooltipElement,
            offset: [0, -15],
            positioning: 'bottom-center'
        })
        this.measureTooltip.set('_type', 'meatext')
        this.map.addOverlay(this.measureTooltip)
    }

}
