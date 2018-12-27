<template>
  <div>
    <div :style="{width: width, height: height}" :id="id" :class="className" ref="myChart"></div>
  </div>
</template>
<script>
import echarts from 'echarts'
export default {
  name: 'EchartsPie',
  data() {
    return {

    }
  },
  mounted() {
    this.initChart()
    this.init()
    // console.log('this._chartData', this._chartData)
  },
  watch: {
    _chartData(v) {
      console.log('v', v)
      this.initChart()
    }
  },
  props: {
    className: {
      type: String,
      default: 'yourClassName'
    },
    id: {
      type: String,
      default: 'pieID'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '290px'
    },
    _chartData: {
      type: Array,
      required: true,
      default: function() {
        return []
      }
    }
  },
  methods: {
    init() {
      const self = this
      setTimeout(() => {
        window.onresize = function () {
          self.chart = echarts.init(self.$refs.myChart)
          self.chart.resize()
          console.log('饼状图')
        }
      }, 20)
    },
    initChart(v) {
      this.chart = echarts.init(this.$refs.myChart);
      // 把配置和数据放这里
      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: "{b}: {c} ({d}%)"
        },
        color: ["#52b4ff", "#ffc552"],
        legend: {
          orient: 'horizontal',
          y: 'bottom',
          // data: ['待处理工单', '待处理投诉']
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '16',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: this._chartData
          }
        ]
      })
    },
  }
}
</script>