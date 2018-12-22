import request from '@/utils/request'
import { cfg as mapCfg } from "@/components/rm/map/config.js"
import GeoJSON from 'ol/format/GeoJSON.js'
import { Vector as VectorLayer, Layer } from 'ol/layer.js'
import { Vector as VectorSource } from 'ol/source.js'
import TileLayer from 'ol/layer/Tile.js'
import TileWMS from 'ol/source/TileWMS.js'
import { getWidth, getTopLeft } from 'ol/extent.js'
import { get as getProjection } from 'ol/proj.js'
import WMTSTileGrid from 'ol/tilegrid/WMTS.js'
import WMTSCapabilities from 'ol/format/WMTSCapabilities.js'
import WMTS, { optionsFromCapabilities } from 'ol/source/WMTS.js'
import { bbox as bboxStrategy } from 'ol/loadingstrategy.js'
import { vectorStyleFunc, searchResultStyleFunc, searchSelectStyleFunc, drawingStyleFunc, markerStyleFunc, measureStyleFunc } from "@/components/rm/map/style.js"
import { getArea, getLength } from 'ol/sphere.js'
import WKT from 'ol/format/WKT.js'

var __wmtsCapabilities = null

//工具类
export const utils = {
    getFeatureInfo: function(url) {
        return request({
            url: url,
            method: 'get',
            transformResponse: [function(data) {
                // 拦截器返回的数据不是json，而是文本
                var json = JSON.parse(data)
                var data2 = { success: true, features: json.features }
                //console.log('data:',data,data2)
                return data2
            }]
        })
    },
    initBgLayers: function(map, bglayers) {
        bglayers.forEach((k) => {
            k.layer.set('code', k.id)
            k.layer.set('ltype', 'bg')
            k.layer.setVisible(k.visible)
            map.addLayer(k.layer)
        })
    },
    switchBglayer: function(map, layer, bglayers) {
        bglayers.forEach((k) => {
            k.visible = false
            k.layer.setVisible(false)
        })
        //当前图层显示
        layer.visible = true
        layer.layer.setVisible(true)
    },
    getCapabilities: function(layerCode) {
        //从服务器读取WMTS配置
        return new Promise((resolve, reject) => {
            //读取服务器WMTS的配置信息。有可能网络问题，无法读取
            if (__wmtsCapabilities) {
                var options = optionsFromCapabilities(__wmtsCapabilities, {
                    layer: layerCode //'zhhz:getRiverAll'//zhhz:getRegion，只取指定图层的数据
                    //matrixSet: 'EPSG:3857'
                })
                //console.log('WMTS options2222：', options)
                resolve(options)
            } else {
                request({
                    url: mapCfg.wmtsServerUrl + '?Service=WMTS&Version=1.0.0&Request=GetCapabilities',
                    method: 'get',
                    transformResponse: [function(data) {
                        // logout shiro拦截器返回的数据不是json，而是文本
                        var data2 = { success: true, text: data }
                        //console.log('data:',data,data2)
                        return data2
                    }]
                }).then(response => {
                    var parser = new WMTSCapabilities()
                    var result = parser.read(response.text)
                    //缓存本地变量
                    __wmtsCapabilities = result
                    var options = optionsFromCapabilities(result, {
                        layer: layerCode//'zhhz:getRiverAll'//zhhz:getRegion，只取指定图层的数据
                        //matrixSet: 'EPSG:3857'
                    })
                    //console.log('WMTS options', options)
                    resolve(options)
                })
            }
        })
    },
    createWMSTileLayer: function(item) {
        return new TileLayer({
            source: new TileWMS({
                url: item.server || mapCfg.wmsServerUrl,
                crossOrigin: 'anonymous',
                params: { 'VERSION': '1.1.1', 'LAYERS': item.code || item.id, 'TILED': true },
                serverType: 'geoserver',
                // Countries have transparency, so do not fade tiles:
                transition: 0
            })
        })
    },
    createWFSTileLayer: function(item) {
        return new VectorLayer({
            source: new VectorSource({
                format: new GeoJSON(),
                url: function(extent) {
                    return mapCfg.wfsServerUrl + '?service=WFS&' +
                        'version=1.1.0&request=GetFeature&typeName=' + item.code + '&' +
                        'outputFormat=application/json&srsname=' + mapCfg.projection + '&' +
                        'bbox=' + extent.join(',') + ',' + mapCfg.projection
                },
                strategy: bboxStrategy
            }),
            style: item.style || vectorStyleFunc
        })
    },
    createWMTSTileLayer: function(item, callback) {
        var layer = null
        var layerCode = item.code || item.id
        this.getCapabilities(layerCode).then(options => {
            // console.log('server-->', JSON.stringify(options))
            //new WMTS(/** @type {!module:ol/source/WMTS~Options} */ (options))
            layer = new TileLayer({
                opacity: 0.8,
                source: new WMTS(/** @type {!module:ol/source/WMTS~Options} */(options))
            })

            callback(layer)
        })

        return layer
    },
    createWMTSTileLayer2: function(item) {
        //通过本地计算出来的配置，和真正服务器配置，还有小差别，可能导致瓦片参数不正确，建议还是从服务器上读取配置
        var layer = null
        // var layerCode = item.code || item.id 
        // create the WMTS tile grid in the google projection
        var projection = getProjection('EPSG:900913')
        var tileSizePixels = 256
        var tileSizeMtrs = getWidth(projection.getExtent()) / tileSizePixels
        var matrixIds = []
        var resolutions = []
        for (var i = 0; i <= 21; i++) {
            matrixIds[i] = 'EPSG:900913:' + i//??
            resolutions[i] = tileSizeMtrs / Math.pow(2, i)
            //console.log(i,resolutions[i],matrixIds[i])
        }
        var tileGrid = new WMTSTileGrid({
            origin: getTopLeft(projection.getExtent()),
            resolutions: resolutions,
            matrixIds: matrixIds
        })

        var wmtsSource = new WMTS({
            url: mapCfg.wmtsServerUrl,
            layer: item.code || item.id,
            format: 'image/png',
            projection: projection,
            matrixSet: 'shili_EPSG:900913',
            attributions: ['©国土局'],
            tileGrid: tileGrid,
            style: ''
        })
        layer = new TileLayer({
            opacity: 0.8,
            source: wmtsSource
        })

        return layer
    },
    initDataLayer: function(map, layers) {
        layers.forEach((k) => {
            if (k.layer instanceof Layer) {
                k.layer.set('code', k.id)
                k.layer.set('name', k.name)
                if (!k.layer.get('ltype')) {
                    k.layer.set('ltype', k.type || 'wms')
                }
                k.layer.setVisible(k.visible)
                map.addLayer(k.layer)
            } else {
                //console.error('数据图层[%s]配置错误', k.name)
                //创建数据图层
                if (k.type === 'wmts') {
                    //行政区域图
                    this.createWMTSTileLayer(k, function(layer2) {
                        k.layer = layer2
                        k.layer.set('code', k.id)
                        k.layer.set('name', k.name)
                        k.layer.set('ltype', 'wmts')
                        k.layer.setVisible(k.visible)
                        map.addLayer(layer2)
                    })
                } else if (k.type === 'wfs') {
                    //vector feature 图层
                    k.layer = this.createWFSTileLayer(k)
                    if (k.zindex) {
                        k.layer.setZIndex(k.zindex)
                    }
                    k.layer.set('code', k.id)
                    k.layer.set('name', k.name)
                    k.layer.set('ltype', 'wfs')
                    k.layer.setVisible(k.visible)
                    map.addLayer(k.layer)
                } else {
                    k.layer = this.createWMSTileLayer(k)
                    if (k.zindex) {
                        k.layer.setZIndex(k.zindex)
                    }
                    k.layer.set('code', k.id)
                    k.layer.set('name', k.name)
                    k.layer.set('ltype', 'wms')
                    k.layer.setVisible(k.visible)
                    map.addLayer(k.layer)
                }
            }
        })
    },
    //初始化基础图层
    initBaseLayer: function(map) {
        // TODO 
        var _drawLayer = new VectorLayer({
            zIndex: 98,
            source: new VectorSource({ format: new GeoJSON() }),
            style: drawingStyleFunc//'createDrawStyleFunction'
        })


        _drawLayer.set('code', 'drawlayer')
        _drawLayer.set('ltype', 'base')
        _drawLayer.set('name', '默认绘图层')
        _drawLayer.set('editable', true)

        // 添加一个默认的查询结果图层
        var _searchLayer = new VectorLayer({
            zIndex: 99,
            source: new VectorSource({ format: new GeoJSON() }),
            style: searchResultStyleFunc//'createSelectionStyleFunction'
        })
        _searchLayer.set('code', 'searchlayer')
        _searchLayer.set('ltype', 'base')
        _searchLayer.set('name', '搜索结果层')
        _searchLayer.set('editable', false)
        // 用于绘制选择框的图层 
        var _selectionDrawLayer = new VectorLayer({
            zIndex: 100,
            source: new VectorSource({ format: new GeoJSON() }),
            style: searchSelectStyleFunc//'createSelectionStyleFunction'
        })
        _selectionDrawLayer.set('code', 'selectionDrawLayer')
        _selectionDrawLayer.set('ltype', 'base')
        _selectionDrawLayer.set('name', '绘制选择框的图层')
        _selectionDrawLayer.set('editable', false)

        // 用于个人标注图层 
        var _markerLayer = new VectorLayer({
            zIndex: 101,
            source: new VectorSource({ format: new GeoJSON() }),
            style: markerStyleFunc//'createSelectionStyleFunction'
        })
        _markerLayer.set('code', 'markerLayer')
        _markerLayer.set('ltype', 'base')
        _markerLayer.set('name', '个人标注图层')
        _markerLayer.set('editable', true)

        // 用于个人标注图层 
        var _meaLayer = new VectorLayer({
            zIndex: 101,
            source: new VectorSource({ format: new GeoJSON() }),
            style: measureStyleFunc//'createSelectionStyleFunction'
        })
        _meaLayer.set('code', 'meaLayer')
        _meaLayer.set('ltype', 'base')
        _meaLayer.set('name', '量测图层')
        _meaLayer.set('editable', true)

        map.addLayer(_searchLayer)
        map.addLayer(_drawLayer)
        map.addLayer(_selectionDrawLayer)
        map.addLayer(_markerLayer)
        map.addLayer(_meaLayer)
    },
    getLayerByCode: function(map, code) {
        var layer = null
        map.getLayers().forEach(function(l, i, arr) {
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
