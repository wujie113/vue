/*
 * @Author: 刘小康 
 * @Date: 2018-12-24 17:28:23 
 * @Last Modified by: 刘小康
 * @Last Modified time: 2018-12-26 16:52:46
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
                    placeholder="选择年月"
                    @change="tabMonthChange"
                  ></el-date-picker>
                  <el-button
                    :loading="downloadLoading"
                    style="margin:0 0 20px 20px;"
                    type="primary"
                    icon="document"
                    @click="handleDownload"
                  >下载Excel</el-button>
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
            <h6
              style="font-size: 20px;margin: 0px 0 20px 0;text-align: center;font-weight: normal;"
            >{{ aeesssTableParams.tab2Year }}年{{ aeesssTableParams.tab2Month }}月{{ officeName }}下级单位考核评分表</h6>
            <el-table
              :data="assessTable.tableData"
              style="width: 100%"
              border
              :header-cell-style="{'color': '#333333'}"
            >
              <el-table-column
                :prop="item.prop"
                :label="item.label"
                v-for="(item, index) in assessTable.tableCoulmn"
                :key="index"
              ></el-table-column>
            </el-table>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import echarts from 'echarts'
import { mapGetters } from 'vuex'
import { getChartsList, getAssessTable } from '@/api/statisticalAnalysis/assessmentStatistics.js'
export default {
  name: "assessmentStatistics",
  data() {
    return {
      legendDataArray: [],
      echartsData: {},
      clientHeight: '',
      loading: false,
      downloadLoading: false,
      year: '',
      aeesssTableParams: {
        tab2Month: '',
        tab2Year: ''
      },
      assessTable: {
        tableCoulmn: [],
        tableData: [],
      },
      value1: '',
      value2: '',
      activeName: 'first'
    }
  },
  created() {
    this.loading = true
    this.year = new Date().getFullYear()
    this.aeesssTableParams.tab2Year = new Date().getFullYear()
    this.aeesssTableParams.tab2Month = new Date().getMonth() + 1
    this.filename = this.aeesssTableParams.tab2Year + '年' + this.aeesssTableParams.tab2Month + '月' + this.officeName + '下级单位考核评分表'
    this.getChartsList()
  },
  mounted() {
    const tempH = this.getHeight(document.getElementsByClassName('app-container')[0]) - 217
    this.clientHeight = tempH
    const that = this
    window.onresize = function temp() {
      // that.clientHeight = `${document.documentElement.clientHeight}px`
      that.clientHeight = that.getHeight(document.getElementsByClassName('app-container')[0]) - 217
      // that.clientHeight = that.getHeight(window) - 84
    }
    // setTimeout(() => {
    //   this.drawBar()      
    // }, 30)
    //让echarts窗口自适应
    this.init()
  },
  computed: {
    ...mapGetters([
      'officeName',
    ])
  },
  methods: {
    init() {
      const self = this
      setTimeout(() => {
        window.onresize = function () {
          if (self.$refs.myChart) {
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
    // 获取tab2选项卡table数据接口
    getAssessTable() {
      const params = {
        "year": this.aeesssTableParams.tab2Year,
        "month": this.aeesssTableParams.tab2Month
      }
      getAssessTable(params).then((res) => {
        this.loading = false
        // res.data.tableCoulmn.push({"prop":"sum","label":"总分"})
        // res.data.tableData.map((item, index) => {
        //   item.sum = 10
        // })
        this.assessTable.tableCoulmn = res.data.tableCoulmn
        this.assessTable.tableData = res.data.tableData
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
      } else if (tab.paneName == 'second') {
        this.loading = true
        this.getAssessTable()
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
      this.aeesssTableParams.tab2Year = tab2Year
      this.aeesssTableParams.tab2Month = tab2Month
      this.assessTable.tableCoulmn = []
      this.assessTable.tableData = []
      this.filename = this.aeesssTableParams.tab2Year + '年' + this.aeesssTableParams.tab2Month + '月' + this.officeName + '下级单位考核评分表'      
      this.getAssessTable()
    },
    // 下载导出Excel表格
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        let tHeaderTemp = []
        let filterValTemp = []
        this.assessTable.tableCoulmn.map(item => {
          tHeaderTemp.push(item.label)
          filterValTemp.push(item.prop)
        })
        const tHeader = tHeaderTemp
        const filterVal = filterValTemp
        const list = this.assessTable.tableData
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
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
            color: '#008acd'
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
    > .el-container {
      // 兼容IE浏览器
      min-height: 86vh;
    }
  }
}
</style>
