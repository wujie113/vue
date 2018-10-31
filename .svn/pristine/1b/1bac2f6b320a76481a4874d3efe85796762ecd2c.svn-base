<template>
    <div id="map" class="map"></div>
</template> 
<script> 
    import 'ol/ol.css'
    import { Map, View } from 'ol'
    import { Group as LayerGroup, Tile as TileLayer } from 'ol/layer.js'
    import { defaults as defaultControls } from 'ol/control.js'
    import { ScaleLine } from 'ol/control.js'
    import MousePosition from 'ol/control/MousePosition.js'
    import { createStringXY } from 'ol/coordinate.js'
    import XYZ from 'ol/source/XYZ.js'
    export default {
        data() {
            return {
                map: null
            }
        },
        mounted() {
            this.initMap()
        },
        methods: {
            initMap() {
                //console.log('initMap')
                this.map = new Map({
                    target: 'map',
                    controls: defaultControls({
                        attribution: false,
                        attributionOptions: {
                            collapsible: false
                        },
                        zoomOptions: { zoomInTipLabel: '放大', zoomOutTipLabel: '缩小' }
                    }).extend([new ScaleLine({ units: 'metric' }), new MousePosition({
                        coordinateFormat: createStringXY(4),
                        projection: 'EPSG:4326',
                        undefinedHTML: '&nbsp;'
                    })]),
                    layers: [
                        new LayerGroup({
                            visible: true,
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
                        }),
                        new LayerGroup({
                            visible: false,
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
                        }),
                        new LayerGroup({
                            visible: false,
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
                        }),
                        new LayerGroup({
                            visible: false,
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
                            ]                        })
                    ],
                    view: new View({
                        center: [113.373171, 23.104508],
                        projection: 'EPSG:4326',
                        minZoom: 6,
                        zoom: 15
                    })
                })
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
</style>
