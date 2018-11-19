<template>
  <div class="app-container homeIndex">
    <div class="topWrap">
      <el-row :gutter="10">
        <el-col :xs="9" :sm="9" :md="9" :lg="9" :xl="9">
          <div class="grid-content bg-purple">
            <div class="topTitle">
              <div class="left">
                <img src="../../../static/img/gq.png" alt="图标">
                <span>巡和专管员优秀榜</span>
              </div>
              <div class="right">
                <span>本月专管员巡河</span>
                <span>|</span>
                <span>本月巡河</span>
              </div>
            </div>
            <div class="tableBox">
              <el-table :data="tableData3" height="270" border style="width: 100%" size="mini">
                <el-table-column type="index" width="50" label="排名">
                </el-table-column>
                <el-table-column prop="date" label="姓名">
                </el-table-column>
                <el-table-column prop="name" label="所属单位" width="180" show-overflow-tooltip="">
                </el-table-column>
                <el-table-column prop="address" label="巡河次数">
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-col>
        <el-col :xs="9" :sm="9" :md="9" :lg="9" :xl="9">
          <div class="grid-content bg-purple-light">
            <div class="topTitle">
              <div class="left">
                <img src="../../../static/img/zrd.png" alt="图标">
                <span>入库河流统计</span>
              </div>
              <div class="right">
                <el-select v-model="value" placeholder="请选择" size="mini">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
                <span>市级筛选</span>
              </div>
            </div>
            <div class="flexBox">
              <ul class="clearfix">
                <li v-for="(list, index) in [1,2,3,4,5,6]">
                  <div class="home-page-bottom-Survey-list">
                    <div class="home-page-bottom-Survey-main">
                      <div class="home-page-bottom-Survey-img home-page-bottom-Survey-river"></div>
                      <div class="home-page-bottom-Survey-main-body">
                        <div class="home-page-bottom-Survey-number">10 + {{ index }}</div>
                        <div class="home-page-bottom-Survey-title">江河流数</div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </el-col>
        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
          <div class="grid-content bg-purple-right">
            <div class="topTitle">
              <div class="left">
                <img src="../../../static/img/gq.png" alt="图标">
                <span>工单处理统计</span>
              </div>
              <div class="right">
                <el-select v-model="value" placeholder="请选择" size="mini">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="canvasBox">
              <div id="myChart" :style="{width: '100%', height: '290px'}"></div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="bottomWrap">
      <el-row :gutter="10">
        <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18">
          <div class="grid-content bg-purple">
            <div class="topTitle">
              <div class="left">
                <img src="../../../static/img/st.png" alt="图标">
                <span>河长管理分析</span>
              </div>
              <div class="right">
                <el-select v-model="value" placeholder="请选择" size="mini">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
                <span>筛选</span>
              </div>
            </div>
            <div class="tableBox">
              <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="本月投诉次数统计" name="first">
                  151616161
                </el-tab-pane>
                <el-tab-pane label="本月工单统计" name="second">配置管理</el-tab-pane>
              </el-tabs>
            </div>
          </div>
          <!-- <div class="dashboard-text">name:{{ name }}</div> -->

        </el-col>
        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
          <div class="dashboard-text">roles:<span v-for="role in roles" :key="role">{{ role }}</span></div>

        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import echarts from 'echarts'
import resize from '@/components/Charts/mixins/resize'
export default {
  name: 'Home',
  mixins: [resize],
  data() {
    return {
      activeName: 'first',
      tableData3: [{
        date: '2016-05-03',
        name: '王小虎',
        address: '11'
      }, {
        date: '2016-05-02',
        name: '王小虎',
        address: '11'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '11'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '11'
      }, {
        date: '2016-05-08',
        name: '王小虎',
        address: '11'
      }, {
        date: '2016-05-06',
        name: '王小虎',
        address: '11'
      }, {
        date: '2016-05-07',
        name: '王小虎',
        address: '11'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '11'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '11'
      }, {
        date: '2016-05-08',
        name: '王小虎',
        address: '11'
      }, {
        date: '2016-05-06',
        name: '王小虎',
        address: '11'
      }, {
        date: '2016-05-07',
        name: '王小虎',
        address: '11'
      }],
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value: ''
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  mounted() {
    this.drawLine();
  },
  methods: {
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('myChart'))
      // 绘制图表
      myChart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: "{b}: {c} ({d}%)"
        },
        legend: {
          orient: 'horizontal',
          y: 'bottom',
          data: ['待处理工单', '待处理投诉']
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '16',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              { value: 335, name: '待处理工单' },
              { value: 310, name: '待处理投诉' }
            ]
          }
        ]
      });
      window.onresize = myChart.resize;
    },
    handleClick(tab, event) {
      console.log(tab, event);
    }
  },

}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
<style lang="scss" scoped>
.homeIndex {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.topWrap {
  padding-bottom: 10px;
  height: 42%;
}
.bottomWrap {
  height: 58%;
  .el-row {
    height: 100%;
    .el-col {
      height: 100%;
    }
  }
}
.grid-content {
  height: 100%;
  width: 100%;
  position: relative;
  z-index: 2;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: auto;
  background-color: #fff;
  .topTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    background-color: #4282fe;
    color: #fff;
    height: 4vh;
    min-height: 37px;
    padding: 0 10px;
    .left {
      display: flex;
      align-items: center;
      img {
        width: 3vh;
        margin-right: 8px;
      }
    }
    .right {
      font-size: 14px;
      span:first-of-type {
        padding-right: 5px;
      }
      span:last-of-type {
        color: #333;
        padding-left: 5px;
      }
    }
  }
  /deep/ .tableBox {
    padding: 10px 15px;
    /deep/
      .el-table__body
      .el-table__row:first-child
      .el-table_1_column_1
      .cell
      div {
      background-image: url(../../../static/img/one.png);
      background-position: center center;
      background-repeat: no-repeat;
      color: #fff;
    }
    /deep/
      .el-table__body
      .el-table__row:nth-of-type(2)
      .el-table_1_column_1
      .cell
      div {
      background-image: url(../../../static/img/two.png);
      background-position: center center;
      background-repeat: no-repeat;
      color: #fff;
    }
    /deep/
      .el-table__body
      .el-table__row:nth-of-type(3)
      .el-table_1_column_1
      .cell
      div {
      background-image: url(../../../static/img/three.png);
      background-position: center center;
      background-repeat: no-repeat;
      color: #fff;
    }
    /deep/ .el-table__body .el-table__row .el-table_1_column_1 .cell {
      position: relative;
      z-index: 3;
    }
    /deep/
      .el-table__body
      .el-table__row
      .el-table_1_column_1
      .cell
      div::after {
      content: "";
      display: block;
      position: absolute;
      background: #eaf0f5;
      border-radius: 50%;
      height: 18px;
      width: 18px;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      z-index: -1;
    }
  }
  .flexBox {
    padding: 5px;
    ul,
    li {
      padding: 0;
      list-style: none;
      margin: 0;
    }
    ul {
      height: 100%;
      width: 100%;
      li {
        list-style: none;
        float: left;
        height: 50%;
        width: 33.3%;
        padding: 8px;
        .home-page-bottom-Survey-list {
          border-radius: 4px;
          height: 100%;
          width: 100%;
          border: 1px solid #ddd;
          position: relative;
          .home-page-bottom-Survey-main {
            display: flex;
            justify-content: space-between;
            align-items: center;
            min-height: 122px;
            .home-page-bottom-Survey-img {
              background-repeat: no-repeat;
              background-size: cover;
              float: left;
              width: 30%;
              margin: 0 10px;
            }
            .home-page-bottom-Survey-river {
              background-image: url(../../../static/img/jh.png);
            }
            .home-page-bottom-Survey-img::before {
              content: "";
              display: inline-block;
              padding-bottom: 95%;
              width: 0.1px;
            }
          }
          .home-page-bottom-Survey-main-body {
            float: left;
            width: 70%;
            text-align: center;
            .home-page-bottom-Survey-number {
              height: 46px;
              text-align: center;
              margin-top: 2px;
              font-size: 32px;
            }
            .home-page-bottom-Survey-title {
              font-size: 14px;
              color: #8a9299;
            }
          }
        }
      }
    }
  }
  .canvasBox {
    padding: 0 10px;
    height: 290px;
    width: 100%;
  }
}
</style>


