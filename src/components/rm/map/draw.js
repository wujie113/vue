
import { Vector as VectorSource } from 'ol/source.js'
import { Draw, Modify, Snap } from 'ol/interaction.js'
import { LineString, Polygon } from 'ol/geom.js' 
import { unByKey } from 'ol/Observable.js'
import Collection from 'ol/Collection'
import { getArea, getLength } from 'ol/sphere.js'
import WKT from 'ol/format/WKT.js'
import {   drawingStyleFunc } from "@/components/rm/map/style.js"
 

//绘制河流责任段
export const draw = { 
    /**
     * 
     * @param {地图组件} map 
     * @param {要绘制的对象类型，点、线、多边形等} geotype 
     * @param {对象属性} options
     * @param { 绘画回调函数} callbackFunc  
     */
    draw: function(map, geotype, options, callbackFunc) {
        var isInit = true
        if (this.map) {
            isInit = false
        }

        this.map = map
        this.featureId = options.id
        this.featureName = options.name
        this.callbackFunc = callbackFunc

        /**绘制责任段，默认在责任段图层中绘制 */
        var layerCode = "zhhz:zerenduan"
        this.geotype = geotype
        this.fid = layerCode + '.' + this.featureId

        this.layer = this.getLayerByCode(layerCode)
        //如果没有找到图层，则在绘画图层上
        if (!this.layer) {
            this.layer = this.getLayerByCode('drawlayer')
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
                self.callbackFunc('change', { feature: self.sketch, remarks: output, wkt: self.toWKT(geom) })
            })
        }
    },
    unbindLister: function(f) {
        if (this.listener && f) {
            unByKey(this.listener)
        }
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
        var length = getLength(line)
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
        var area = getArea(polygon)
        var output
        if (area > 10000) {
            output = (Math.round(area / 1000000 * 100) / 100) +
                ' ' + 'km<sup>2</sup>'
        } else {
            output = (Math.round(area * 100) / 100) +
                ' ' + 'm<sup>2</sup>'
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
