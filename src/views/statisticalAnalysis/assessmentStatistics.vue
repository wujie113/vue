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
        <el-main>
          <h1 v-if="activeName === 'first'">东环空间林赛</h1>
          <h2 v-if="activeName === 'second'">我的tab2</h2>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { getChartsList } from '@/api/statisticalAnalysis/assessmentStatistics.js'
export default {
  name: "assessmentStatistics",
  data() {
    return {
      year: '',
      yearMonth: '',
      value1: '',
      value2: '',
      activeName: 'first'
    }
  },
  created() {
    this.getChartsList()
  },
  methods: {
    getChartsList() {
      const params = {
        "year": this.year
      }
      getChartsList(params).then((res) => {
        console.log('res', res)

      }).catch((errorRes) => { })
    },
    handleClick() {

    },
    tabYearChange(v) {
      this.year = new Date(v).getFullYear()
      this.getChartsList()

    },
    tabMonthChange(v) {
      console.log('tabMonth', v)

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
