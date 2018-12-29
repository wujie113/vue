<template>
  <!-- <div> -->
  <div :style="{width: width, height: height}" :id="id" :class="className" ref="myChart"></div>
  <!-- </div> -->
</template>
<script>
import echarts from 'echarts'
export default {
  name: 'EchartsPie',
  data() {
    return {
      chart: null,
    }
  },
  mounted() {
    this.initChart()
  },
  watch: {
    // 数组的watch监听
    _chartData: {
      handler(newValue, oldValue) {
        this.initChart()
      }
    },
    deep: true //深度监听
  },
  destroyed() {
    console.log('首页顶部的饼图--destroyed');
    window.removeEventListener('resize', () => {
      console.log('饼状图---removeEventListener')
    })
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
      default: function () {
        return []
      }
    }
  },
  methods: {
    // init() {
    //   const self = this
    //   setTimeout(() => {
    //     window.onresize = function () {
    //       if (self.$refs.myChart) {
    //         self.chart = echarts.init(self.$refs.myChart)
    //         self.chart.resize()
    //         console.log('饼状图')
    //       }
    //     }
    //   }, 20)
    // },
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
      // 图表自适应
      window.addEventListener('resize', () => {
        this.chart.resize()
      })
    },
  }
}
</script>