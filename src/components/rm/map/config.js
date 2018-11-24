import { Group as LayerGroup, Tile as TileLayer } from 'ol/layer.js'
import XYZ from 'ol/source/XYZ.js'
// import { Vector as VectorLayer  } from 'ol/layer.js'
// import { Vector as VectorSource } from 'ol/source.js' 
import { dakadianStyleFunc } from "@/components/rm/map/style.js"

//地图配置文件
var googleS = new LayerGroup({
    layers: [
        new TileLayer({
            zIndex: 0,
            source: new XYZ({
                title: "Google影像图",
                url: "http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}"
            })
        }),
        new TileLayer({
            zIndex: 1,
            source: new XYZ({
                title: "Google影像注记",
                url: "http://www.google.cn/maps/vt?lyrs=h@189&gl=cn&x={x}&y={y}&z={z}"
            })
        })]
})

var google = new LayerGroup({
    layers: [
        new TileLayer({
            zIndex: 0,
            source: new XYZ({
                title: "Google电子地图",
                url: "http://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
            })
        }),
        new TileLayer({
            zIndex: 1,
            source: new XYZ({
                title: "Google交通地图",
                url: "http://www.google.cn/maps/vt/pb=!1m4!1m3!1i{z}!2i{x}!3i{y}!2m3!1e0!2sm!3i380072576!3m8!2szh-CN!3scn!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m1!1e0"
            })
        })]
})

var tiandi = new LayerGroup({ 
    layers: [new TileLayer({
        zIndex: 0,
        source: new XYZ({
            title: "天地图路网",
            url: "http://t2.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}"
        })
    }),
    new TileLayer({
        zIndex: 1,
        source: new XYZ({
            title: "天地图文字标注",
            url: "http://t2.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}"
        })
    })
    ]
})

var tiandiS = new LayerGroup({
    layers: [new TileLayer({
        zIndex: 0,
        source: new XYZ({
            title: "天地图卫星",
            url: "http://t3.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}"
        })
    }),
    new TileLayer({
        source: new XYZ({
            zIndex: 1,
            title: "天地图文字标注",
            url: "http://t2.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}"
        })
    })
    ]
})

// var testZerenduanLayer = new VectorLayer({
//     zIndex: 21,
//     source: new VectorSource(),
//     style: vectorStyleFunc//'createSelectionStyleFunction'
// })

//定义基本配置
export const cfg = {
    wmsServerUrl2: 'http://117.40.230.32:10103/geoserver/zhhz/wms',
    wmsServerUrl: "http://47.107.32.58:8888/geoserver/zhhz/wms",
    wfsServerUrl: 'http://47.107.32.58:8888/geoserver/zhhz/ows',
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
        { id: 'quyu', name: '行政区域', code: "zhhz:getRegion", type: 'wmts', layer: {}, zindex: 2, visible: true },
        { id: 'heliu', name: '河流', code: "zhhz:getRiverAll", type: 'wmts', layer: {}, zindex: 3, visible: true },
        { id: 'shuizha', name: '水闸', code: "zhhz:shuizha", layer: {}, zindex: 10, visible: false },
        { id: 'shuiyuandi', name: '水源地', code: "zhhz:shuiyuandi", layer: {}, zindex: 11, visible: false },
        { id: 'shuiku', name: '水库', code: "zhhz:shuiku", layer: {}, zindex: 12, visible: false },
        { id: 'shuijing', name: '水井', code: "zhhz:shuijing", layer: {}, zindex: 14, visible: false },
        { id: 'shuidz', name: '水电站', code: "zhhz:shuidz", layer: {}, zindex: 15, visible: false },
        { id: 'qushuikou', name: '取水口', code: "zhhz:qushuikou", layer: {}, zindex: 16, visible: false },
        { id: 'paiwukou', name: '排污口', code: "zhhz:paiwukou", layer: {}, zindex: 17, visible: false },
        { id: 'nongyin', name: '农饮工程', code: "zhhz:nongyin", layer: {}, zindex: 18, visible: false },
        { id: 'diba', name: '堤坝', code: "zhhz:diba", layer: {}, zindex: 19, visible: false },
        { id: 'bengzhan', name: '泵站', code: "zhhz:bengzhan", layer: {}, zindex: 20, visible: false },
        { id: 'zerenduan', name: '责任段', code: "zhhz:zerenduan", icon: 'heliu', type: 'wfs', layer: {}, zindex: 22, visible: true },
        { id: 'hupo', name: '湖泊山塘', code: "zhhz:hupo",   type: 'wfs', layer: {}, zindex: 4, visible: true },
        { id: 'dakadian', name: '打卡点', code: "zhhz:dakadian",  type: 'wfs', layer: {}, style:,zindex: 23, visible: false }
    ]
}


