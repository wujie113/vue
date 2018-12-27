/*
 * @Author: 刘小康 
 * @Date: 2018-12-26 10:18:46 
 * @Last Modified by: 刘小康
 * @Last Modified time: 2018-12-27 09:43:03
 */
// 工单统计
<template>
  <div class="app-container">
    <el-container v-loading="loading">
      <el-aside>
        <left-tree titleName="单位" :dataArray="dataArray" @areaData="handleNodeClick" :isShowTabbar="isShowTabbar" /> 
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
            <h6 style="font-size: 20px;margin: 0px 0 20px 0;text-align: center;font-weight: normal;">
              {{ year }}年{{ unit }}工单报表
            </h6>
            <el-table
              :data="tableData"
              style="width: 100%"
              border
              :header-cell-style="{'color': '#333333'}"
            >
              <el-table-column prop="type" label="类型"></el-table-column>
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
import { tree, tableList, Delete, save, modifyPwd, modifyState, getPostState } from '@/api/setting/userMangement'
import LeftTree from '../setting/components/leftTree'
import echarts from 'echarts'

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
    this.year = new Date().getFullYear()
    this.filename = this.year + "年" + this.unit + "工单报表"
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
  },
  methods: {
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
    getChartsList(){
      this.mainLoading = false
    },
    // 点击树形节点  handleNodeClick
    handleNodeClick(data) {
      //选择的是哪个单位
      this.unit = data.label
      this.listQuery['office.id'] = data.id
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
    handleDownload() {

    },
    drawBar(){},
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
    min-height: 86vh;
    > .el-container {
      // 兼容IE浏览器
      min-height: 86vh;
    }
  }
}
</style>

