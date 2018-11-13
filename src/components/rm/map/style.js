/**用的的所有样式定义 */
import { Polygon, MultiPoint } from 'ol/geom.js'
import { Circle, Fill, Stroke, Style, Text } from 'ol/style.js'
/**vector对象显示样式 */
export const vectorStyleFunc = function(feature, resolution) {
    return new Style({
        stroke: new Stroke({
            color: 'blue',
            width: 2
        }),
        fill: new Fill({
            color: 'rgba(255,0,0,0.2)'
        })
    })
}

/**vector对象被选中样式 */
export const selectedStyleFunc = function(feature, resolution) {
    return new Style({
        stroke: new Stroke({
            color: 'blue',
            width: 2
        }),
        fill: new Fill({
            color: 'rgba(255,0,0,0.2)'
        })
    })
}
/**绘图样式 */
export const drawingStyleFunc = function(f, resolution) {
    var style = new Style({
        fill: new Fill({
            color: 'rgba(255, 255, 255, 0.2)'
        }),
        stroke: new Stroke({
            color: '#ffcc33',
            width: 2
        }),
        image: new Circle({
            radius: 7,
            fill: new Fill({
                color: '#ffcc33'
            })
        }),
        text: new Text({
            text: f.get('name'),
            fill: new Fill({
                color: '#ffcc33'
            }),
            stroke: new Stroke({
                color: '#ffcc33',
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
                color: '#ffcc33',
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
    return new Style({
        stroke: new Stroke({
            color: 'green',
            width: 2
        }),
        fill: new Fill({
            color: 'rgba(255,0,0,0.2)'
        })
    })
}
