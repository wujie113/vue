<template>
  <div :style="{width: '100%', height: height}" ref="myChart"></div>
</template>
<script>
import echarts from 'echarts'

export default {
  name: 'ComEcharts',
  data() {
    return {
      chart: null,
    }
  },
  // props: {
    // className: {
    //   type: String,
    //   default: 'yourClassName'
    // },
    // id: {
    //   type: String,
    //   default: 'pieID'
    // },
    // width: {
    //   type: String,
    //   default: '100%'
    // },
    // height: {
    //   type: String,
    //   default: '290px'
    // },
    // _chartOption: {
    //   type: Object,
    //   required: false,
    //   default: function () {
    //     return {}
    //   }
    // }
  // },
  props:["height", "option"],
  mounted() {
    // setTimeout(() => {
      this.initChart(this.option)
    // }, 30);
    // setTimeout(() => {
    //   console.log('option', this.option)
    //   this.initChart(this.option)   
    // }, 300);

  },
  watch: {
    // 对象的watch监听
    option: {
      handler(newValue, oldValue) {       
        this.initChart(newValue)
      },
      deep: true, //深度监听
      immediate: true
    },

  },
  methods: {
    initChart(o) {
      let myChart = this.$refs.myChart
      if (myChart) {
        this.chart = echarts.init(myChart)
        this.chart.setOption(o)
        window.addEventListener('resize', () => {
          console.log('柱形图---addEventListener')
          this.chart.resize()
        })
      }

    },
  }
}
</script>