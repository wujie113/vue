<template>
  <div>
    <div :style="{width: width, height: height}" :id="id" :class="className" ref="myChart"></div>
  </div>
</template>
<script>
import echarts from 'echarts'
export default {
  name: 'rightEchartsBar',
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
    right_chartData: {
      type: Object,
      required: true,
      default: function() {
        return {}
      }
    }
  },
  watch: {

  },
  methods: {
    init() {
      const self = this;//因为箭头函数会改变this指向，指向windows。所以先把this保存
      setTimeout(() => {
        window.onresize = function() {
          if(self.$refs.myChart) {
            self.chart = echarts.init(self.$refs.myChart)
            self.chart.resize()
            console.log('柱形图222')
          }
        }
      }, 20)
    },
    initChart() {
      this.chart = echarts.init(this.$refs.myChart);
      // 把配置和数据放这里
      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: "{b}: {c}"
        },
        grid: {
          left: '1%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.right_chartData.xAxis,
          name: "单位",
          axisLabel: {
            rotate: 40
          },
        },
        yAxis: {
          type: 'value',
          name: "数量"
        },
        series: [{
          data: this.right_chartData.yAxis,
          type: 'bar'
        }]
      })
    },
  }
}
</script>
