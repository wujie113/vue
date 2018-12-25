/*
 * @Author: 刘小康 
 * @Date: 2018-12-24 17:28:23 
 * @Last Modified by: 刘小康
 * @Last Modified time: 2018-12-25 15:23:29
 */
//  考核统计
<template>
  <div class="app-container">
    <el-container>
      <el-container>
        <el-header height="125px">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="考核统计" name="first">
              <div class="filter-container" style>
                <div class="block">
                  <span class="demonstration">年份</span>
                  <el-date-picker
                    v-model="value1"
                    type="year"
                    placeholder="选择年"
                    @change="tabYearChange"
                  ></el-date-picker>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="考核报表" name="second">
              <div class="filter-container" style>
                <div class="block">
                  <span class="demonstration">年月</span>
                  <el-date-picker
                    v-model="value2"
                    type="month"
                    placeholder="选择月"
                    @change="tabMonthChange"
                  ></el-date-picker>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-header>
        <el-main v-loading="loading">
          <div class="canvasBox" v-if="activeName === 'first'">
            <div id="myChart" :style="{width: '100%', height: clientHeight + 'px'}" ref="myChart"></div>
          </div>
          <div class="canvasBox" v-if="activeName === 'second'">
            <h2>我的tab2</h2>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import echarts from 'echarts'
import { getChartsList } from '@/api/statisticalAnalysis/assessmentStatistics.js'
export default {
  name: "assessmentStatistics",
  data() {
    return {
      legendDataArray: [],
      echartsData: {},
      clientHeight: '',
      loading: false,
      year: '',
      yearMonth: '',
      value1: '',
      value2: '',
      activeName: 'first'
    }
  },
  created() {
    this.loading = true
    this.year = new Date().getFullYear()
    this.getChartsList()
  },
  mounted() {
    const tempH = this.getHeight(document.getElementsByClassName('app-container')[0]) - 217
    console.log('--mounted周期', tempH)
    this.clientHeight = tempH
    const that = this
    window.onresize = function temp() {
      // that.clientHeight = `${document.documentElement.clientHeight}px`
      that.clientHeight = that.getHeight(document.getElementsByClassName('app-container')[0]) - 217
      // that.clientHeight = that.getHeight(window) - 84
      console.log('window.onresize', that.clientHeight)
    }
    // setTimeout(() => {
    //   this.drawBar()      
    // }, 30)
    //让echarts窗口自适应
    this.init()
  },
  methods: {
    init() {
      const self = this
      setTimeout(() => {
        window.onresize = function () {
          if(self.$refs.myChart) {
            self.chart = echarts.init(self.$refs.myChart)
            self.chart.resize()
          }
        }
      }, 20)
    },
    // 调用后台接口
    getChartsList() {
      const params = {
        "year": this.year
      }
      getChartsList(params).then((res) => {
        console.log('res', res)
        this.echartsData = res.data
        this.legendDataArray = res.data.series.map(item => item.name)
        this.drawBar()
        this.loading = false
      }).catch((errorRes) => { 
        this.loading = false
      })
    },
    handleClick(tab, event) {
      // console.log(tab, event)
      if (tab.paneName == 'first') {
        setTimeout(() => {
          this.drawBar()
        }, 100);
      }
    },
    tabYearChange(v) {
      this.loading = true
      this.year = new Date(v).getFullYear()
      this.getChartsList()
    },
    tabMonthChange(v) {
      let tab2Year = new Date(v).getFullYear()
      let tab2Month = new Date(v).getMonth() + 1
    },
    // 画图表
    drawBar() {
      // 基于准备好的dom，初始化echarts实例
      // let myChart1 = echarts.init(document.getElementById('myChart1'))
      this.chart1 = echarts.init(this.$refs.myChart)
      // 绘制图表
      this.chart1.setOption({
        title: {
          text: this.echartsData.title,
          x: "50%",
          y: "3%",
          textStyle: {
            color: '#008acd',
            fontSize: 16
          }
        },
        tooltip: {
          show: true,
          trigger: 'axis',
        },
        legend: {
          data: this.legendDataArray,
          x: "7%",
          y: "10%",
        },
        xAxis: [{
          name: "月份",
          type: 'category',
          data: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
          axisLabel: {
            interval: 0, //横轴信息全部显示
            //   rotate: 30, //60度角倾斜显示            
          },
          axisLine: {
            lineStyle: {
              color: '#008acd' //坐标轴线颜色
            }
          },
          boundaryGap: true,
        }],
        yAxis: [{
          type: 'value',
          name: '总分',
          nameTextStyle: {
            color:'#008acd'
          },
          axisLine: {
            lineStyle: {
              color: '#008acd' //坐标轴线颜色
            }
          }
        }],
        grid: {
          x: "5%",
          x2: "5%",
          y: "20%",
          y2: "5%",
        },
        color: ['#52b4ff', '#fa7de5', '#48dff0', '#ff7370', '#5ce5aa', '#ffb870', '#bc84f5', '#fae164', '#778eff', '#ff7faa'],
        series: this.echartsData.series
      })
    },
  },
}
</script>

<style scoped lang="scss">
.app-container {
  /deep/ .el-tabs__header {
    margin: 0 0 0px;
  }
  .filter-container {
    span {
      color: #636363;
      font-size: 12px;
    }
  }
  > .el-container {
    min-height: 86vh;
  }
}
</style>
