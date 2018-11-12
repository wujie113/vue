import request from '@/utils/request'
import { cfg as mapCfg } from "@/components/rm/map/config.js"
import GeoJSON from 'ol/format/GeoJSON.js'
import { Vector as VectorLayer, Layer } from 'ol/layer.js'
import { Vector as VectorSource } from 'ol/source.js'
import { Fill, Stroke, Style } from 'ol/style.js'
import TileLayer from 'ol/layer/Tile.js'
import TileWMS from 'ol/source/TileWMS.js'
import { getWidth, getTopLeft } from 'ol/extent.js'
import { get as getProjection } from 'ol/proj.js'
import WMTSTileGrid from 'ol/tilegrid/WMTS.js'
import WMTSCapabilities from 'ol/format/WMTSCapabilities.js'
import WMTS, { optionsFromCapabilities } from 'ol/source/WMTS.js'

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
                console.log('WMTS options2222：', options)
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
                    console.log('WMTS options', options)
                    resolve(options)
                })
            }
        })
    },
    createWMSTileLayer: function(item) {
        return new TileLayer({
            source: new TileWMS({
                url: mapCfg.wmsServerUrl,
                crossOrigin: 'anonymous',
                attributions: '©国土局',
                params: { 'LAYERS': item.code || item.id, 'TILED': true },
                serverType: 'geoserver',
                // Countries have transparency, so do not fade tiles:
                transition: 0
            })
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
                        k.layer.setVisible(k.visible)
                        map.addLayer(layer2)
                    })
                } else {
                    k.layer = this.createWMSTileLayer(k)
                    k.layer.set('code', k.id)
                    k.layer.set('ltype', 'data')
                    k.layer.setVisible(k.visible)
                    map.addLayer(k.layer)
                }
            }
        })
    },
    //初始化基础图层
    initBaseLayer: function(map) {
        var styleFunction = function(feature) {
            return new Style({
                stroke: new Stroke({
                    color: 'red',
                    width: 2
                }),
                fill: new Fill({
                    color: 'rgba(255,0,0,0.2)'
                })
            })
        }


        // TODO 
        var _drawLayer = new VectorLayer({
            zIndex: 98,
            source: new VectorSource({ format: new GeoJSON() }),
            style: styleFunction//'createDrawStyleFunction'
        })


        _drawLayer.set('code', 'drawlayer')
        _drawLayer.set('ltype', 'base')
        _drawLayer.set('name', '默认绘图层')
        _drawLayer.set('editable', true)

        // 添加一个默认的查询结果图层
        var _searchLayer = new VectorLayer({
            zIndex: 99,
            source: new VectorSource({ format: new GeoJSON() }),
            style: styleFunction//'createSelectionStyleFunction'
        })
        _searchLayer.set('code', 'searchlayer')
        _searchLayer.set('ltype', 'base')
        _searchLayer.set('name', '搜索结果层')
        _searchLayer.set('editable', false)
        // 用于绘制选择框的图层 
        var _selectionDrawLayer = new VectorLayer({
            zIndex: 100,
            source: new VectorSource({ format: new GeoJSON() }),
            style: styleFunction//'createSelectionStyleFunction'
        })
        _selectionDrawLayer.set('code', 'selectionDrawLayer')
        _selectionDrawLayer.set('ltype', 'base')
        _selectionDrawLayer.set('name', '绘制选择框的图层')
        _selectionDrawLayer.set('editable', false)

        map.addLayer(_searchLayer)
        map.addLayer(_drawLayer)
        map.addLayer(_selectionDrawLayer)
    }
}
