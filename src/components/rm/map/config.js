import { Group as LayerGroup, Tile as TileLayer } from 'ol/layer.js'
import XYZ from 'ol/source/XYZ.js'
//地图配置文件
var googleS = new LayerGroup({
    layers: [
        new TileLayer({
            source: new XYZ({
                title: "Google影像图",
                url: "http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}"
            })
        }),
        new TileLayer({
            source: new XYZ({
                title: "Google影像注记",
                url: "http://www.google.cn/maps/vt?lyrs=h@189&gl=cn&x={x}&y={y}&z={z}"
            })
        })]
})

var google = new LayerGroup({
    layers: [
        new TileLayer({
            source: new XYZ({
                title: "Google电子地图",
                url: "http://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
            })
        }),
        new TileLayer({
            source: new XYZ({
                title: "Google交通地图",
                url: "http://www.google.cn/maps/vt/pb=!1m4!1m3!1i{z}!2i{x}!3i{y}!2m3!1e0!2sm!3i380072576!3m8!2szh-CN!3scn!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m1!1e0"
            })
        })]
})

var tiandi = new LayerGroup({
    layers: [new TileLayer({
        source: new XYZ({
            title: "天地图路网",
            url: "http://t2.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}"
        })
    }),
    new TileLayer({
        source: new XYZ({
            title: "天地图文字标注",
            url: "http://t2.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}"
        })
    })
    ]
})

var tiandiS = new LayerGroup({
    layers: [new TileLayer({
        source: new XYZ({
            title: "天地图卫星",
            url: "http://t3.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}"
        })
    }),
    new TileLayer({
        source: new XYZ({
            title: "天地图文字标注",
            url: "http://t2.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}"
        })
    })
    ]
})
//定义基本配置
export const cfg = {
    wmsServerUrl: 'http://117.40.230.32:10103/geoserver/zhhz/wms',
    wmtsServerUrl: 'http://117.40.230.32:10103/geoserver/gwc/service/wmts',
    projection: 'EPSG:4326',//'EPSG:4326',3857
    center: [113.88, 27.67],//默认中心位置
    minZoom: 6,
    zoom: 9,
    bglayers: [
        { id: 'googleS', name: 'google卫星', layer: googleS, visible: false },
        { id: 'google', name: 'google电子', layer: google, visible: false },
        { id: 'tiandi', name: '天地图电子', layer: tiandi, visible: false },
        { id: 'tiandiS', name: '天地图卫星', layer: tiandiS, visible: false }],
    datalayers: [
        { id: 'quyu', name: '行政区域', code: "zhhz:getRegion", type: 'wmts', layer: {}, visible: true },
        { id: 'heliu', name: '河流', code: "zhhz:getRiverAll", type: 'wmts', layer: {}, visible: true },
        { id: 'shuizha', name: '水闸', code: "zhhz:resSluice", layer: {}, visible: false },
        { id: 'shuiyuandi', name: '水源地',code: "zhhz:resWatersource", layer: {}, visible: false },
        { id: 'shuiku', name: '水库',code: "zhhz:resReservoir", layer: {}, visible: false },
        { id: 'shuijing', name: '水井',code: "zhhz:resWell", layer: {}, visible: false },
        { id: 'shuidz', name: '水电站', layer: {}, visible: false },
        { id: 'qushuikou', name: '取水口', layer: {}, visible: false },
        { id: 'paiwukou', name: '排污口', layer: {}, visible: false },
        { id: 'nongyin', name: '农饮工程', layer: {}, visible: false },
        { id: 'diba', name: '堤坝', layer: {}, visible: false },
        { id: 'bengzhan', name: '泵站', layer: {}, visible: false }]
}


