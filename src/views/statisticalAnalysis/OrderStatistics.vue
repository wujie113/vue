/*
 * @Author: 刘小康 
 * @Date: 2018-12-26 10:18:46 
 * @Last Modified by: 刘小康
 * @Last Modified time: 2018-12-27 15:46:29
 */
// 工单统计
<template>
  <div class="app-container">
    <el-container v-loading="loading">
      <el-aside>
        <left-tree
          titleName="单位"
          :dataArray="dataArray"
          @areaData="handleNodeClick"
          :isShowTabbar="isShowTabbar"
        />
      </el-aside>
      <el-container>
        <el-header height="125px">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="工单统计图" name="first">
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
            <el-tab-pane label="工单报表" name="second">
              <div class="filter-container" style>
                <div class="block">
                  <span class="demonstration">年份</span>
                  <el-date-picker
                    v-model="value1"
                    type="year"
                    placeholder="选择年"
                    @change="tabYearChange"
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
        <el-main v-loading="mainLoading">
          <div class="canvasBox" v-if="activeName === 'first'">
            <div id="myChart" :style="{width: '100%', height: clientHeight + 'px'}" ref="myChart"></div>
          </div>
          <div class="canvasBox" v-if="activeName === 'second'">
            <h6
              style="font-size: 20px;margin: 0px 0 20px 0;text-align: center;font-weight: normal;"
            >{{ year }}年{{ unit }}工单报表</h6>
            <el-table
              :data="tableData"
              style="width: 100%"
              border
              :header-cell-style="{'color': '#333333'}"
            >
              <el-table-column prop="type" label="类型" fixed></el-table-column>
              <el-table-column prop="Jan" label="一月"></el-table-column>
              <el-table-column prop="Feb" label="二月"></el-table-column>
              <el-table-column prop="Mar" label="三月"></el-table-column>
              <el-table-column prop="Apr" label="四月"></el-table-column>
              <el-table-column prop="May" label="五月"></el-table-column>
              <el-table-column prop="Jun" label="六月"></el-table-column>
              <el-table-column prop="Jul" label="七月"></el-table-column>
              <el-table-column prop="Aug" label="八月"></el-table-column>
              <el-table-column prop="Sep" label="九月"></el-table-column>
              <el-table-column prop="Oct" label="十月"></el-table-column>
              <el-table-column prop="Nov" label="十一月"></el-table-column>
              <el-table-column prop="Dec" label="十二月"></el-table-column>
            </el-table>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import { tree } from '@/api/setting/userMangement'
import LeftTree from '../setting/components/leftTree'
import echarts from 'echarts'
import { getOrderChartsList } from '@/api/statisticalAnalysis/assessmentStatistics'
export default {
  name: 'OrderStatistics',
  components: { LeftTree },
  data() {
    return {
      isShowTabbar: false,
      defaultProps: {
        children: "children",
        label: "label"
      },
      dataArray: [],
      downloadLoading: false,
      loading: false,
      mainLoading: false,
      activeName: 'first',
      year: '',
      yearMonth: '',
      value1: '',
      value2: '',
      activeName: 'first',
      legendDataArray: [],
      echartsData: {},
      clientHeight: '',
      checked: false,
      tableData: [],
      listQuery: {
        "office.id": ''
      },
      unit: "", //单位---XXX河长办
    }
  },
  created() {
    // 默认年
    this.year = new Date().getFullYear()
    this.filename = this.year + "年" + this.unit + "工单报表"
    this.loading = true
    this.loadLeftTree()
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
    //让echarts窗口自适应
    this.init()
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
    loadLeftTree() {
      tree().then((res) => {
        const data = res.data.list
        this.dataArray = data
        // 第一次默认 选第一个 单位
        this.listQuery['office.id'] = data[0].id
        this.unit = data[0].label
        this.getChartsList()
        this.loading = false
      }).catch((errorRes) => {
        this.loading = false
      })
    },
    // 获取echarts图表的数据
    getChartsList() {
      const params = {
        "year": this.year,
        "offce.id": this.listQuery['office.id']
      }
      // 表格置空
      this.tableData = []
      getOrderChartsList(params).then((res) => {
        this.echartsData = res.data
        this.legendDataArray = res.data.legend.data
        let barColor = ["#ff7370", "#48dff0", "#52b4ff", "#ff66a3", "#5ce5aa", "#c484f5", "#ffb870", "#fae164"]
        let Months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        this.echartsData.series.map((item, index) => {
          let obj = {
            "type": item.name
          }
          for (let i = 0; i < Months.length; i++) {
            obj[Months[i]] = item.data[i]
          }
          this.tableData.push(obj)
          item.tooltip = {
            trigger: 'item'
          }
          item.stack = 'group1'
          item.barCategoryGap = '55%'
        })
        this.drawBar()
        this.mainLoading = false
      }).catch((errorRes) => {
        this.mainLoading = false
      })
    },
    // 点击树形节点  handleNodeClick
    handleNodeClick(data) {
      //选择的是哪个单位
      this.unit = data.label
      this.listQuery['office.id'] = data.id
      this.mainLoading = true
      this.getChartsList()
    },
    // 点击tab选项卡
    handleClick(tab, event) {
      if (tab.paneName == 'first') {
        setTimeout(() => {
          this.drawBar()
        }, 100);
      }
    },
    // 选择日期--年份
    tabYearChange(v) {
      this.year = new Date(v).getFullYear() //年芦溪河长办工单报表
      this.filename = this.year + "年" + this.unit + "工单报表"
      this.mainLoading = true
      this.getChartsList()
    },
    // 下载Excel表格
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['类型', '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
        const filterVal = ["type", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const list = this.tableData
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
    // 画echarts图表
    drawBar() {
      // 基于准备好的dom，初始化echarts实例
      // let myChart1 = echarts.init(document.getElementById('myChart1'))
      if (this.$refs.myChart) {
        this.chart1 = echarts.init(this.$refs.myChart)
        // 图表配置
        let option = {
          axisPointer: {
            show: false,
          },
          title: {
            text: this.echartsData.title,
            x: "center",
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
          color: ['#52b4ff', '#fa7de5', '#48dff0', '#ff7370', '#5ce5aa', '#ffb870', '#bc84f5', '#fae164', '#778eff', '#ff7faa'],
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
            y: "20%",
            y2: "5%",
          },
          xAxis: [{
            name: "月份",
            type: 'category',
            data: this.echartsData.xAxisData,
            /*  nameTextStyle: {
                  color: "#000"
              },*/
            axisLabel: {
              interval: 0, //横轴信息全部显示
              rotate: 60, //60度角倾斜显示
              textStyle: {
                color: "#000"
              }
            },
            axisLine: {
              lineStyle: {
                color: '#008acd' //坐标轴线颜色
              }
            },
          }],
          yAxis: [{
            type: 'value',
            name: "数量",
            axisLine: {
              lineStyle: {
                color: '#008acd' //坐标轴线颜色
              }
            },
          }],
          series: this.echartsData.series
        }
        // 绘制图表
        this.chart1.setOption(option)
      }

    },
  },
}
</script>
<style lang="scss" scoped>
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
    min-height: calc(100vh - 126px);
    > .el-container {
      // 兼容IE浏览器
      min-height: calc(100vh - 126px);
    }
  }
}
</style>

