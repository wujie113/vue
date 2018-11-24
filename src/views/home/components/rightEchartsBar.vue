<template>
  <div>
    <div id="myChart" :style="{width: width, height: height}" :id="id" :class="className" ref="myChart"></div>
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
    }
  },
  methods: {
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
          data: ['八矿回旋车场', '建许路口', '北汴路南站', '城南三路东站', '科技路南站',
            '六矿', '沁园小区', '伟太公司', '森林半岛', '凤鸣路站', '河南城建学院',
            '冬勤路北站', '豫美面粉公司', '平煤中心站', '建东站', '济南站'
          ],
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
          data: [8900, 9000, 8000, 8000, 6000, 6000, 6000, 5377, 2000, 1760, 1325, 1200, 1000, 1000, 1000, 5000],
          type: 'bar'
        }]
      })
    },
  }
}
</script>