/*
 * @Author: 刘小康 
 * @Date: 2018-11-19 16:15:52 
 * @Last Modified by: 刘小康
 * @Last Modified time: 2018-11-23 18:27:38
 */
<template>
  <div class="app-container homeIndex">
    <div class="topWrap">
      <el-row :gutter="10">
        <el-col :xs="9" :sm="9" :md="9" :lg="9" :xl="9">
          <div class="grid-content bg-purple">
            <div class="topTitle">
              <div class="left">
                <img src="../../../static/img/youxiu.svg" alt="巡和专管员优秀榜">
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
                <img src="../../../static/img/riverCount.svg" alt="入库河流统计">
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
                        <div class="home-page-bottom-Survey-number">10{{ index }}</div>
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
                <img src="../../../static/img/gdgl.svg" alt="工单处理统计">
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
              <!-- <div id="myChart" :style="{width: '100%', height: '290px'}" ref="myChart"></div> -->
              <echarts-pie></echarts-pie>
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
                <img src="../../../static/img/fenxi.svg" alt="河长管理分析">
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
                  <!-- <div id="myChart1" :style="{width: '100%', height: '23em'}" ref="myChart1"></div> -->
                  <leftEchartsBar></leftEchartsBar>
                </el-tab-pane>
                <el-tab-pane label="本月工单统计" name="second">
                  <!-- <div id="myChart2" :style="{width: '100%', height: '23em'}" ref="myChart2"></div> -->
                  <rightEchartsBar></rightEchartsBar>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
          <!-- <div class="dashboard-text">name:{{ name }}</div> -->
          <!-- <div class="dashboard-text">roles:<span v-for="role in roles" :key="role">{{ role }}</span></div> -->
        </el-col>
        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
          <div class="grid-content">
            <div class="topTitle">
              <div class="left">
                <img src="../../../static/img/news.svg" alt="通知公告">
                <span>通知公告</span>
              </div>
              <div class="right" style="cursor: pointer;">
                更多<i class="el-icon-d-arrow-right"></i>
              </div>
            </div>
            <div class="NewsBox">
              <ul>
                <li class="home-page-top-notice-list" v-for="(list, index) in [1, 2, 3, 4, 5]" @click="newsDetailBtn">
                  <span class="home-page-top-notice-list-top">
                    <span>关于智慧河长系统人员使用情况</span>
                    <i class="circle"></i>
                  </span>
                  <span class="home-page-top-notice-list-bottom">
                    <i class="el-icon-time"></i>
                    2018-03-12 19:47:32
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 通知公告弹窗 -->
    <el-dialog title="通知公告详情" :visible.sync="dialogVisible" width="60%" top="5vh">
      <div class="NotificationDetailContent clearfix">
        <div class="subContent clearfix">
          <h1 class="ContentHeader">
            关于深入开展“清河行动”的通知
          </h1>
          <p class="DetailMore">
            各乡镇人民政府： 为进一步贯彻落实全面实行河长制工作部署，不断巩固我县水生态环境，结合实际，决定在全县范围内组织开展“清河行动”。 “清河行动”按照“河畅、水清、岸绿、景美”的标准和“全覆盖、无盲区”的要求，开展集中整治行动，营造全社会共同关心、爱护、保护河库的良好局面。具体标准为全县所有河流、水库、塘坝水体及滩地达到四无标准： 1.无生活垃圾造成的“白色污染”，确保河岸整洁； 2.无工业企业排污造成的“黑色污染”，确保水质清洁； 3.无工程施工过程中淤泥、黄土造成的“黄色污染”，确保河湖水质清澈； 4.无影响行洪的障碍物，确保河道安全度汛。 请各乡镇级“总河长”或“副总河长”亲自督办，务必引起高度重视，并通过“芦溪县河长办”微信工作群向县河长办报备。
          </p>
          <div class="clearfix">
            <viewer :images="images1">
              <img v-for="src in images1" :src="src.url" :key="src.name">
            </viewer>
            <!-- <div class="images" v-viewer="{movable: true}">
              <img v-for="src in imgs" :src="src.url" :key="src.name">
            </div> -->
          </div>
          <div class="subUser">
            <span class="DetailTime">2018-03-20 09:33:28</span>
            <span class="DetailUser">芦溪县管理员</span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import echarts from 'echarts'
import resize from '@/components/Charts/mixins/resize'
import { getList } from '@/api/home/home'
import EchartsPie from './components/echartsPie'
import leftEchartsBar from './components/leftEchartsBar'
import rightEchartsBar from './components/rightEchartsBar'
export default {
  name: 'Home',
  data() {
    return {
      activeName: 'first',
      dialogVisible: false,
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
      }],
      value: '',
      images1: [
        {
          url:
            "http://117.40.230.32:10101/file/20181103/154122821368920157eaa041d4397a6c117f5025bc984_thumb.png",
          title: "pic1",
          name: "1111"
        },
        {
          url:
            "http://117.40.230.32:10101/file/20181103/154122821368920157eaa041d4397a6c117f5025bc984_thumb.png",
          title: "pic2",
          name: "22222"
        },
        {
          url:
            "http://117.40.230.32:10101/file/20181103/154122821368920157eaa041d4397a6c117f5025bc984_thumb.png",
          title: "pic2",
          name: "222"
        },
        {
          url:
            "http://117.40.230.32:10101/file/20181103/154122821368920157eaa041d4397a6c117f5025bc984_thumb.png",
          title: "pic2",
          name: "2"
        },
        {
          url:
            "http://117.40.230.32:10101/file/20181103/154122821368920157eaa041d4397a6c117f5025bc984_thumb.png",
          title: "pic2",
          name: "222122"
        }
      ],
    }
  },
  components: {
    EchartsPie,
    leftEchartsBar,
    rightEchartsBar
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  created () {
    this.getListData()
  },
  mounted() {
    // this.drawPie()
    // this.drawBar()
    this.init() //让echarts窗口自适应
  },
  methods: {
    getListData(){
      getList({}).then((res) => {
        console.log('请求成功')

        console.log('home-index.vue', res)
      }).catch(erroRes => {
        console.log('网络错误')
      })
    },
    init() {
      const self = this;//因为箭头函数会改变this指向，指向windows。所以先把this保存
      setTimeout(() => {
        window.onresize = function () {
          self.chart = echarts.init(self.$refs.myChart)
          self.chart1 = echarts.init(self.$refs.myChart1)
          self.chart2 = echarts.init(self.$refs.myChart2)

          self.chart.resize()
          self.chart1.resize()
          self.chart2.resize()
        }
      }, 20)
    },
    drawPie() {
      // 基于准备好的dom，初始化echarts实例
      // let myChart = echarts.init(document.getElementById('myChart'))
      this.chart = echarts.init(this.$refs.myChart)
      // 绘制图表
      this.chart.setOption({
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
      // window.onresize = myChart.resize;
    },
    drawBar() {
      // 基于准备好的dom，初始化echarts实例
      // let myChart1 = echarts.init(document.getElementById('myChart1'))
      this.chart1 = echarts.init(this.$refs.myChart1)
      // 绘制图表
      this.chart1.setOption({
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: "{b}: {c}"
        },
        grid: {
          left: '0%',
          right: '5%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisTick: {
              alignWithLabel: true
            },
            name: "类型"
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: "数量"
          }
        ],
        series: [
          {
            name: '直接访问',
            type: 'bar',
            barWidth: '60%',
            data: [10, 52, 200, 334, 390, 330, 220]
          }
        ]
      })
      // window.onresize = myChart1.resize;
    },
    drawBar2() {
      // 基于准备好的dom，初始化echarts实例
      // let myChart2 = echarts.init(document.getElementById('myChart2'))
      this.chart2 = echarts.init(this.$refs.myChart2)

      // 绘制图表
      this.chart2.setOption({
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
      // window.onresize = myChart2.resize;
    },
    newsDetailBtn() {
      this.dialogVisible = true
    },
    handleClick(tab, event) {
      console.log(tab, event);
      if (tab.paneName == 'second') {
        setTimeout(() => {
          this.drawBar2()
        }, 100);
      }
    }
  },


}
</script>

<style lang="scss" scoped>
.homeIndex {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  .subContent {
    h1,
    p {
      margin: 0;
      padding: 0;
    }
    .ContentHeader {
      text-align: center;
      font-weight: 600;
      font-size: 18px;
      // font-family: "微软雅黑";
    }
    .DetailMore {
      text-indent: 2em;
      padding-top: 15px;
      letter-spacing: 0.08em;
      font-size: 15px;
      color: rgb(41, 46, 51);
      text-align: justify;
      line-height: 26px;
      // font-family: "宋体";
      min-height: 200px;
    }
    .subUser {
      margin-top: 25px;
      float: right;
      span {
        display: block;
        padding-top: 5px;
      }
    }
  }
  .el-dialog__body img {
    width: 19%;
    height: 100px;
    max-height: 15em;
    margin: 0.5em 0.2em 0 0;
    float: left;
  }
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
  // overflow: auto;
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
  // /deep/ .tableBox {
  //   padding: 10px 15px;
  //   /deep/
  //     .el-table__body
  //     .el-table__row:first-child
  //     .el-table_1_column_1
  //     .cell
  //     div {
  //     background-image: url(../../../static/img/one.png);
  //     background-position: center center;
  //     background-repeat: no-repeat;
  //     color: #fff;
  //   }
  //   /deep/
  //     .el-table__body
  //     .el-table__row:nth-of-type(2)
  //     .el-table_1_column_1
  //     .cell
  //     div {
  //     background-image: url(../../../static/img/two.png);
  //     background-position: center center;
  //     background-repeat: no-repeat;
  //     color: #fff;
  //   }
  //   /deep/
  //     .el-table__body
  //     .el-table__row:nth-of-type(3)
  //     .el-table_1_column_1
  //     .cell
  //     div {
  //     background-image: url(../../../static/img/three.png);
  //     background-position: center center;
  //     background-repeat: no-repeat;
  //     color: #fff;
  //   }
  //   /deep/ .el-table__body .el-table__row .el-table_1_column_1 .cell {
  //     position: relative;
  //     z-index: 3;
  //   }
  //   /deep/
  //     .el-table__body
  //     .el-table__row
  //     .el-table_1_column_1
  //     .cell
  //     div::after {
  //     content: "";
  //     display: block;
  //     position: absolute;
  //     background: #eaf0f5;
  //     border-radius: 50%;
  //     height: 18px;
  //     width: 18px;
  //     left: 50%;
  //     top: 50%;
  //     transform: translate(-50%, -50%);
  //     z-index: -1;
  //   }
  //   .el-tabs {
  //     height: 100%;
  //   }
  // }
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
  .NewsBox {
    height: 92%;
    width: 100%;
    ul,
    li {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    ul {
      height: 100%;
      padding: 10px;
      .home-page-top-notice-list:hover {
        background: #fafafa;
        border-radius: 8px;
      }
      .home-page-top-notice-list {
        width: 100%;
        height: 20%;
        padding: 0 5px;
        border-bottom: 1px solid #eee;
        cursor: pointer;
        .home-page-top-notice-list-top {
          height: 50%;
          font-size: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .circle {
            width: 10px;
            height: 10px;
            background-color: #fd3431;
            border-radius: 5px;
          }
        }
        .home-page-top-notice-list-bottom {
          height: 50%;
          font-size: 14px;
          display: flex;
          justify-content: flex-start;
          // align-items: center;
          i {
            margin-right: 10px;
          }
        }
      }
    }
  }
}
</style>
<style>
.homeIndex .tableBox {
  padding: 10px 15px;
}
.homeIndex
  .tableBox
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
.homeIndex
  .tableBox
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
.homeIndex
  .tableBox
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
.homeIndex .tableBox .el-table__body .el-table__row .el-table_1_column_1 .cell {
  position: relative;
  z-index: 3;
}
.homeIndex
  .tableBox
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
.homeIndex .tableBox .el-tabs {
  height: 100%;
}
</style>



