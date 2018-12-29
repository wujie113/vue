<template>
  <!-- <div> -->
    <div :style="{width: width, height: height}" :id="id" :class="className" ref="myChart"></div>
  <!-- </div> -->
</template>
<script>
import echarts from 'echarts'
export default {
  name: 'rightEchartsBar',
  data() {
    return {
      barColor: ["#ff7370", "#48dff0", "#52b4ff", "#ff66a3", "#5ce5aa", "#c484f5", "#ffb870", "#fae164"],
    }
  },
  mounted() {
    setTimeout(() => {
    this.initChart()
      
    }, 100);
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
      default: '22em'
    },
    right_chartData: {
      type: Object,
      required: true,
      default: function () {
        return {}
      }
    }
  },
  watch: {

  },
  destroyed() {
    window.onresize = null
  },
  methods: {
    init() {
      const self = this;//因为箭头函数会改变this指向，指向windows。所以先把this保存
      setTimeout(() => {
        window.onresize = function () {
          if (self.$refs.myChart) {
            self.chart = echarts.init(self.$refs.myChart)
            self.chart.resize()
            console.log('柱形图222')
          }
        }
      }, 20)
    },
    initChart() {
      this.chart = echarts.init(this.$refs.myChart)
      let value = []
      this.right_chartData.yAxis.map((item, index) => {
        value.push({
          value: item,
          itemStyle: {
            normal: {
              color: this.barColor[index % this.barColor.length]
            }
          }
        })
      })
      // 把配置和数据放这里
      let option = {
        tooltip: {
          show: true,
          trigger: 'axis',
        },
        dataZoom: {
          show: false,
          realtime: true,
          height: 20,
          end: 100,
          handleSize: '20px',
        },
        grid: {
          x: "5%",
          x2: "5%",
          y: "10%",
          y2: "15%",
        },
        xAxis: [{
          name: "单位",
          type: 'category',
          data: this.right_chartData.xAxis,
          axisLabel: {
            interval: 0, //横轴信息全部显示
            rotate: 60, //60度角倾斜显示
          },
          axisLine: {
            lineStyle: {
              color: '#008acd' //坐标轴线颜色
            }
          },
        }],
        yAxis: [{
          //nameLocation:"middle",
          name: "数量",
          type: 'value',
          minInterval: 1,
          axisLine: {
            lineStyle: {
              color: '#008acd' //坐标轴线颜色
            }
          },
        }],
        series: [{
          name: '工单数量',
          type: 'bar',
          barCategoryGap: "55%",
          data: "",
        }]
        // tooltip: {
        //   trigger: 'axis',
        //   axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        //     type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        //   },
        //   formatter: "{b}: {c}"
        // },
        // grid: {
        //   left: '1%',
        //   right: '4%',
        //   bottom: '3%',
        //   containLabel: true
        // },
        // xAxis: {
        //   type: 'category',
        //   data: this.right_chartData.xAxis,
        //   name: "单位",
        //   axisLabel: {
        //     rotate: 40
        //   },
        // },
        // yAxis: {
        //   type: 'value',
        //   name: "数量"
        // },
        // series: [{
        //   data: this.right_chartData.yAxis,
        //   type: 'bar'
        // }]
      }
      option.series[0].data = value
      this.chart.setOption(option)
    },
  }
}
</script>
