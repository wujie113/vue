/**用的的所有样式定义 */
import { Polygon, MultiPoint } from 'ol/geom.js'
import { Circle, Fill, Stroke, Style, Text, Icon } from 'ol/style.js'
/**vector对象显示样式 */
export const vectorStyleFunc = function(f, resolution) {
    var lineStyle = new Style({
        stroke: new Stroke({
            color: 'blue',
            width: 2
        }),
        fill: new Fill({
            color: 'rgba(0,0,255,0.2)'
        })
    })
    //console.log(resolution)
    if (resolution <= 0.0000429) {
        lineStyle.setText(new Text({
            text: f.get('name'),
            fill: new Fill({
                color: 'blue'
            }),
            stroke: new Stroke({
                color: '#fff',
                width: 1
            })
        }))
    }
    //点样式 
    var pointStyle = new Style({
        image: new Circle({
            radius: 1.5,
            fill: new Fill({
                color: '#00f'
            }),
            stroke: new Stroke({
                color: '#fff',
                width: 1
            })
        }), geometry: function(f) {
            var coordinates = f.getGeometry().getCoordinates()
            if (f.getGeometry() instanceof Polygon) {
                coordinates = coordinates[0]
            }
            return new MultiPoint(coordinates)
        }
    })

    return [lineStyle, pointStyle]
}

/**vector对象被选中样式 */
export const selectedStyleFunc = function(feature, resolution) {
    return new Style({
        stroke: new Stroke({
            color: '#FF6100',
            width: 2.5
        }),
        fill: new Fill({
            color: 'rgba(255,0,0,0.8)'
        }),
        text: new Text({
            text: feature.get('name'),
            fill: new Fill({
                color: '#000000'
            }),
            stroke: new Stroke({
                color: '#ffffff',
                width: 1
            })
        })
    })
}
/**绘图样式 */
export const drawingStyleFunc = function(f, resolution) {
    var style = new Style({
        fill: new Fill({
            color: 'rgba(255, 0, 0, 0.2)'
        }),
        stroke: new Stroke({
            color: '#ff0000',
            width: 2
        }),
        image: new Circle({
            radius: 7,
            fill: new Fill({
                color: '#ffffff'
            })
        }),
        text: new Text({
            text: f.get('name'),
            fill: new Fill({
                color: '#000000'
            }),
            stroke: new Stroke({
                color: '#ffffff',
                width: 1
            })
        })
    })
    //点样式 
    var style2 = new Style({
        image: new Circle({
            radius: 2.5,
            fill: new Fill({
                color: '#f00'
            }),
            stroke: new Stroke({
                color: '#ffffff',
                width: 1
            })
        }), geometry: function(f) {
            var coordinates = f.getGeometry().getCoordinates()
            if (f.getGeometry() instanceof Polygon) {
                coordinates = coordinates[0]
            }
            return new MultiPoint(coordinates)
        }
    })
    return [style, style2]
}

/**查询选框样式 */
export const searchSelectStyleFunc = function(feature, resolution) {
    return new Style({
        stroke: new Stroke({
            color: 'gray',
            width: 2
        }),
        fill: new Fill({
            color: 'rgba(255,0,0,0.2)'
        })
    })
}

/**查询结果样式 */
export const searchResultStyleFunc = function(feature, resolution) {
    //判断不通过的对象类型，构造不同的显示
    var gtype = feature.get('gtype')
    if (gtype === 'trail') {
        return trailStyleFunc(feature, resolution)
    }
    var style = new Style({
        fill: new Fill({
            color: 'rgba(255, 0, 0, 0.2)'
        }),
        stroke: new Stroke({
            color: '#ff0000',
            width: 2.5
        }),
        image: new Icon({
            anchor: [0.5, 48],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            size: [48, 48],
            src: require('@/../static/map/icon/' + gtype + '.png')
        }),
        text: new Text({
            text: feature.get('name'),
            fill: new Fill({
                color: '#000000'
            }),
            stroke: new Stroke({
                color: '#ffffff',
                width: 1
            })
        })
    })
    //点样式 
    var style2 = new Style({
        image: new Circle({
            radius: 3,
            fill: new Fill({
                color: '#ff0000'
            })
        }),
        geometry: function(f) {
            var coordinates = f.getGeometry().getCoordinates()
            if (f.getGeometry() instanceof Polygon) {
                coordinates = coordinates[0]
            }
            return new MultiPoint(coordinates)
        }
    })
    return [style, style2]
}

/** 投诉事件 */
export const tousuStyleFunc = function(feature, resolution) {
    var style = new Style({
        stroke: new Stroke({
            color: '#ff0000',
            width: 4
        }),
        image: new Icon({
            anchor: [0.5, 48],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            size: [48, 48],
            src: require('@/../static/map/icon/tousu.png')
        }),
        text: new Text({
            text: feature.get('name'),
            fill: new Fill({
                color: '#000000'
            }),
            stroke: new Stroke({
                color: '#ffffff',
                width: 1
            })
        })
    })

    return style
}

/** 上报事件 */
export const shangbaoStyleFunc = function(feature, resolution) {
    var style = new Style({
        stroke: new Stroke({
            color: '#ff0000',
            width: 4
        }),
        image: new Icon({
            anchor: [0.5, 48],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            size: [48, 48],
            src: require('@/../static/map/icon/shangbao.png')
        }),
        text: new Text({
            text: feature.get('name'),
            fill: new Fill({
                color: '#000000'
            }),
            stroke: new Stroke({
                color: '#ffffff',
                width: 1
            })
        })
    })

    return style
}

export const trailGeoMarkerStyle = new Style({ 
    image: new Circle({
        radius: 12,
        fill: new Fill({
            color: '#fff'
        }), 
        stroke: new Stroke({
            color: '#409EFF',
            width: 3
        })
    }),
    text: new Text({
        text: 'Go',
        fill: new Fill({
            color: '#000000'
        }) 
    })
})
/** 轨迹事件 */
export const trailStyleFunc = function(feature, resolution) {
    var type = feature.get('type')
    var styles = {
        "trailMarker1": null,
        "trailStart": new Style({ 
            image: new Icon({
                anchor: [0.5, 48],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                size: [48, 48],
                src: require('@/../static/map/icon/start.png')
            }),
            text: new Text({
                text: feature.get('name'),
                fill: new Fill({
                    color: '#000000'
                }) 
            })
        }),
        "trailEnd": new Style({ 
            image: new Icon({
                anchor: [0.5, 48],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                size: [48, 48],
                src: require('@/../static/map/icon/end.png')
            }),
            text: new Text({
                text: feature.get('name'),
                fill: new Fill({
                    color: '#000000'
                }) 
            })
        }),
        "trail": [new Style({ 
            stroke: new Stroke({
                color: '#409EFF',
                width: 4,
                lineCap: 'square',
                lineDash: [5, 9]
            }),            
            text: new Text({
                font: '14px Microsoft YaHei',
                text: feature.get('name'),
                fill: new Fill({
                    color: '#409EFF'
                }),
                stroke: new Stroke({
                    color: '#ffffff',
                    width: 1
                })
            })
        }),new Style({
            image: new Circle({
                radius: 4,
                fill: new Fill({
                    color: '#fff'
                }), 
                stroke: new Stroke({
                    color: '#409EFF',
                    width: 2
                })
            }),
            geometry: function(f) {
                var coordinates = f.getGeometry().getCoordinates()
                if (f.getGeometry() instanceof Polygon) {
                    coordinates = coordinates[0]
                }
                return new MultiPoint(coordinates)
            }
        })]
    } 
    return  styles[type]
}
/**个人标注 */
export const markerStyleFunc = function(feature, resolution) {
    return new Style({
        stroke: new Stroke({
            color: 'green',
            width: 2
        }),
        fill: new Fill({
            color: 'rgba(255,0,0,0.2)'
        }),
        image: new Icon({
            anchor: [0.5, 32],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            size: [32, 32],
            src: require('@/../static/map/icon/marker.png')
        }),
        text: new Text({
            text: feature.get('name'),
            offsetY: 12,
            fill: new Fill({
                color: '#000'
            }),
            stroke: new Stroke({
                color: '#fff',
                width: 1
            })
        })
    })
}
/**打卡点标注 */
export const dakadianStyleFunc = function(feature, resolution) {
    return new Style({
        stroke: new Stroke({
            color: 'green',
            width: 2
        }),
        fill: new Fill({
            color: 'rgba(255,0,0,0.2)'
        }),
        image: new Icon({
            anchor: [0.5, 32],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            size: [32, 32],
            src: require('@/../static/map/icon/dakadian.png')
        }),
        text: new Text({
            text: feature.get('name'),
            offsetY: 12,
            fill: new Fill({
                color: '#000'
            }),
            stroke: new Stroke({
                color: '#fff',
                width: 1
            })
        })
    })
}
export const markerSelectedStyleFunc = function(feature, resolution) {
    var style = markerStyleFunc(feature, resolution)
    //点样式 
    var pointStyle = new Style({
        image: new Circle({
            radius: 5,
            stroke: new Stroke({
                color: 'rgba(0, 0, 0, 0.7)'
            }),
            fill: new Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            })
        }), geometry: function(f) {
            var coordinates = f.getGeometry().getCoordinates()
            if (f.getGeometry() instanceof Polygon) {
                coordinates = coordinates[0]
            }
            return new MultiPoint(coordinates)
        }
    })
    return [style, pointStyle]
}

export const measureStyleFunc = function(feature, resolution) {
    var style = new Style({
        fill: new Fill({
            color: 'rgba(255, 255, 255, 0.2)'
        }),
        stroke: new Stroke({
            color: '#E6A23C',
            lineDash: [10, 10],
            width: 3.5
        }),
        image: new Circle({
            radius: 5,
            stroke: new Stroke({
                color: 'rgba(0, 0, 0, 0.7)'
            }),
            fill: new Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            })
        })
    })

    //点样式 
    var pointStyle = new Style({
        image: new Circle({
            radius: 5,
            stroke: new Stroke({
                color: '#E6A23C'
            }),
            fill: new Fill({
                color: 'rgba(255, 255, 255, 0.5)'
            })
        }), geometry: function(f) {
            var coordinates = f.getGeometry().getCoordinates()
            if (f.getGeometry() instanceof Polygon) {
                coordinates = coordinates[0]
            }
            return new MultiPoint(coordinates)
        }
    })
    return [style, pointStyle]
}
