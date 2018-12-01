<template>
  <div>
    <div :style="{width: width, height: height}" :id="id" :class="className" ref="myChart"></div>
  </div>
</template>
<script>
import echarts from 'echarts'
export default {
  name: 'leftEchartsBar',
  data() {
    return {

    }
  },
  mounted() {
    this.initChart()
    this.init()
  },
  props: {
    className: {
      type: String,
      default: 'yourClassName'
    },
    id: {
      type: String,
      default: 'yourID'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '23em'
    },
    left_chartData: {
      type: Array,
      required: true,
      default: function() {
        return []
      }
    }
  },
  methods: {
    init() {
      const self = this;//因为箭头函数会改变this指向，指向windows。所以先把this保存
      setTimeout(() => {
        window.onresize = function () {
          self.chart = echarts.init(self.$refs.myChart)
          self.chart.resize()
          console.log('柱形图1111')

        }
      }, 20)
    },
    initChart() {
      this.chart = echarts.init(this.$refs.myChart);
      // 把配置和数据放这里
      this.chart.setOption({
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: "{b}: {c}"
        },
        grid: {
          left: '0%',
          right: '5%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisTick: {
              alignWithLabel: true
            },
            name: "类型"
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: "数量"
          }
        ],
        series: [
          {
            name: '直接访问',
            type: 'bar',
            barWidth: '60%',
            data: [80, 52, 200, 334, 390, 330, 220]
          }
        ]
      })
    },
  }
}
</script>