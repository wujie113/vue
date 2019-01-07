/*
 * @Author: 刘小康 
 * @Date: 2018-12-26 10:18:46 
 * @Last Modified by: 刘小康
 * @Last Modified time: 2018-12-28 14:31:06
 */
// 打卡报表
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
            <el-tab-pane label="打卡报表(日)" name="first">
              <div class="filter-container" style>
                <div class="block">
                  <span class="demonstration">日期</span>
                  <el-date-picker
                    v-model="value1"
                    type="date"
                    placeholder="选择日期"
                    @change="tabDateChange"
                  ></el-date-picker>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="打卡报表(月)" name="second">
              <div class="filter-container" style>
                <div class="block">
                  <span class="demonstration">年份</span>
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
        <el-main v-loading="mainLoading">
          <div class="canvasBox" v-if="activeName === 'first'">
            <h1>这里是打卡,暂未完成</h1>
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
import { getOrderChartsList } from '@/api/statisticalAnalysis/assessmentStatistics'
export default {
  name: 'OrderStatistics',
  components: {
    LeftTree
  },
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
      month: '',
      value1: '',
      value2: '',
      activeName: 'first',
      tableData: [],
      listQuery: {
        "office.id": ''
      },
      unit: '',//单位字段
    }
  },
  created() {
    // 默认年
    this.year = new Date().getFullYear()
    this.filename = this.year + "年" + this.unit + "打卡报表"
    this.loading = true
    this.loadLeftTree()
  },
  methods: {
    loadLeftTree() {
      tree().then((res) => {
        const data = res.data.list
        this.dataArray = data
        // 第一次默认 选第一个 单位
        this.listQuery['office.id'] = data[0].id
        this.unit = data[0].label
        this.getSignTable()
        this.loading = false
      }).catch((errorRes) => {
        this.loading = false
      })
    },
    getSignTable() {
      this.mainLoading = false
    },
    // 点击树形节点  handleNodeClick
    handleNodeClick(data) {
      this.mainLoading = true
      this.getSignTable()
    },
    // 点击tab选项卡
    handleClick(tab, event) {
      if (tab.paneName == 'first') {
        // setTimeout(() => {
        //   this.drawBar()
        // }, 100);
      }
    },
    // 选择日期
    tabDateChange(date) {
      this.mainLoading = true
      this.getSignTable()
    },
    // 选择月份
    tabMonthChange(v){
      this.year = new Date(v).getFullYear()
      this.month = new Date(v).getMonth() + 1
      this.filename = this.year + "年" + this.month + "月" + this.unit + "打卡报表" //2018年1月萍乡市河长办打卡报表
      this.mainLoading = true
      this.getSignTable()
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

