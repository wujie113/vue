/*
 * @Author: 刘小康 
 * @Date: 2018-11-19 16:15:52 
 * @Last Modified by: 刘小康
 * @Last Modified time: 2019-01-11 10:31:34
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
                <span>巡河专管员优秀榜</span>
              </div>
              <div class="right">
                <span
                  :class="{ spanActive : spanActiveIndex === 0 }"
                  @click="spanBtn(0)"
                  data-index="0"
                >本月专管员巡河</span>
                <span>|</span>
                <span
                  :class="{ spanActive : spanActiveIndex === 1 }"
                  @click="spanBtn(1)"
                  data-index="1"
                >本月巡河</span>
              </div>
            </div>
            <div class="tableBox">
              <el-table
                :data="tableData3"
                height="270"
                border
                style="width: 100%"
                size="mini"
                v-show="spanActiveIndex === 0"
              >
                <el-table-column type="index" width="50" label="排名"></el-table-column>
                <el-table-column prop="name" label="姓名"></el-table-column>
                <el-table-column prop="officeName" label="所属单位" width="180" show-overflow-tooltip></el-table-column>
                <el-table-column prop="total" label="巡河次数"></el-table-column>
              </el-table>
              <el-table
                :data="tableData3"
                height="270"
                border
                style="width: 100%"
                size="mini"
                v-show="spanActiveIndex === 1"
              >
                <el-table-column type="index" width="50" label="排名"></el-table-column>
                <el-table-column prop="name" label="姓名"></el-table-column>
                <el-table-column prop="total" label="巡河次数"></el-table-column>
              </el-table>
            </div>
          </div>
        </el-col>
        <el-col :xs="9" :sm="9" :md="9" :lg="9" :xl="9">
          <div class="grid-content bg-purple-light">
            <div class="topTitle">
              <div class="left">
                <img src="../../../static/img/riverCount.svg" :alt="riverMap.msg">
                <!-- <span>入库河流统计</span> -->
                <span>{{ riverMap.msg }}</span>
              </div>
              <!--       <div class="right">
                <el-select v-model="value" placeholder="请选择" size="mini">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
                <span>市级筛选</span>
              </div>-->
            </div>
            <div class="flexBox">
              <ul class="clearfix">
                <!-- 江河总数 -->
                <li>
                  <div class="home-page-bottom-Survey-list">
                    <div class="home-page-bottom-Survey-main">
                      <div class="home-page-bottom-Survey-img home-page-bottom-Survey-river"></div>
                      <div class="home-page-bottom-Survey-main-body">
                        <div class="home-page-bottom-Survey-number">{{ riverWrap.data }}</div>
                        <div class="home-page-bottom-Survey-title">{{ riverWrap.msg }}</div>
                      </div>
                    </div>
                  </div>
                </li>
                <!-- 责任段总数 -->
                <li>
                  <div class="home-page-bottom-Survey-list">
                    <div class="home-page-bottom-Survey-main">
                      <div class="home-page-bottom-Survey-img home-page-bottom-Survey-duty"></div>
                      <div class="home-page-bottom-Survey-main-body">
                        <div class="home-page-bottom-Survey-number">{{ dutyWrap.data }}</div>
                        <div class="home-page-bottom-Survey-title">{{ dutyWrap.msg }}</div>
                      </div>
                    </div>
                  </div>
                </li>
                <!-- 湖库 -->
                <li>
                  <div class="home-page-bottom-Survey-list">
                    <div class="home-page-bottom-Survey-main">
                      <div class="home-page-bottom-Survey-img home-page-bottom-Survey-hPlake"></div>
                      <div class="home-page-bottom-Survey-main-body">
                        <div class="home-page-bottom-Survey-number">{{ hPlakeWrap.data }}</div>
                        <div class="home-page-bottom-Survey-title">{{ hPlakeWrap.msg }}</div>
                      </div>
                    </div>
                  </div>
                </li>
                <!-- 山塘 -->
                <li>
                  <div class="home-page-bottom-Survey-list">
                    <div class="home-page-bottom-Survey-main">
                      <div class="home-page-bottom-Survey-img home-page-bottom-Survey-lake"></div>
                      <div class="home-page-bottom-Survey-main-body">
                        <div class="home-page-bottom-Survey-number">{{ lakeWrap.data }}</div>
                        <div class="home-page-bottom-Survey-title">{{ lakeWrap.msg }}</div>
                      </div>
                    </div>
                  </div>
                </li>
                <!-- 沟渠 -->
                <li>
                  <div class="home-page-bottom-Survey-list">
                    <div class="home-page-bottom-Survey-main">
                      <div class="home-page-bottom-Survey-img home-page-bottom-Survey-ditch"></div>
                      <div class="home-page-bottom-Survey-main-body">
                        <div class="home-page-bottom-Survey-number">{{ ditchWrap.data }}</div>
                        <div class="home-page-bottom-Survey-title">{{ ditchWrap.msg }}</div>
                      </div>
                    </div>
                  </div>
                </li>
                <!-- 其他 -->
                <li>
                  <div class="home-page-bottom-Survey-list">
                    <div class="home-page-bottom-Survey-main">
                      <div class="home-page-bottom-Survey-img home-page-bottom-Survey-other"></div>
                      <div class="home-page-bottom-Survey-main-body">
                        <div class="home-page-bottom-Survey-number">{{ otherWrap.data }}</div>
                        <div class="home-page-bottom-Survey-title">{{ otherWrap.msg }}</div>
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
              <!--  <div class="right">
                <el-select v-model="value" placeholder="请选择" size="mini">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </div>-->
            </div>
            <div class="canvasBox">
              <!-- <div id="myChart" :style="{width: '100%', height: '290px'}" ref="myChart"></div> -->
              <!-- 饼状图 -->
              <com-echarts :option="pieOption" height="290px"></com-echarts>
              <!-- <echarts-pie :_chartData="pieChartData"></echarts-pie> -->
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
              <!--      <div class="right">
                <el-select v-model="value" placeholder="请选择" size="mini">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
                <span>筛选</span>
              </div>-->
            </div>
            <div class="tableBox" style="min-height:26.5em;">
              <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="本月投诉次数统计" name="first">
                  <!-- <div id="myChart1" :style="{width: '100%', height: '23em'}" ref="myChart1"></div> -->
                  <!-- <leftEchartsBar v-if="activeName === 'first'" :left_chartData="leftData"></leftEchartsBar> -->
                  <com-echarts :option="leftOption" height="22em" v-if="activeName === 'first'"></com-echarts>
                </el-tab-pane>
                <el-tab-pane label="本月工单统计" name="second">
                  <!-- <div id="myChart2" :style="{width: '100%', height: '23em'}" ref="myChart2"></div> -->
                  <!-- <rightEchartsBar v-if="activeName === 'second'" :right_chartData="rightData"></rightEchartsBar> -->
                  <com-echarts :option="rightOption" height="22em" v-if="activeName === 'second'"></com-echarts>
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
                <span :class="{msgActive: msgActiveIndex === 0}" @click="msgBtn(0)">通知公告</span>
                <span :class="{msgActive: msgActiveIndex === 1}" @click="msgBtn(1)">新闻动态</span>
                <span :class="{msgActive: msgActiveIndex === 2}" @click="msgBtn(2)">任务提醒</span>
                <span :class="{msgActive: msgActiveIndex === 3}" @click="msgBtn(3)">工作简报</span>
              </div>
              <div class="right" style="cursor: pointer;">
                <!--更多,跳转到通知公告-->
                <router-link :to="linkUrl">更多<i class="el-icon-d-arrow-right"></i></router-link>                
              </div>
            </div>
            <div class="NewsBox">
              <!-- 通知广告 -->
              <ul v-show="msgActiveIndex === 0">
                <li
                  class="home-page-top-notice-list"
                  v-for="(list, index) in msgMap"
                  @click="newsDetailBtn(index, msgActiveIndex, list.id)"
                >
                  <span class="home-page-top-notice-list-top">
                    <span>{{ list.title }}</span>
                    <!-- <i class="circle"></i> -->
                  </span>
                  <span class="home-page-top-notice-list-bottom">
                    <i class="el-icon-time"></i>
                    {{ list.createDate }}
                  </span> 
                </li>
              </ul>
              <!-- 新闻动态 -->
              <ul v-show="msgActiveIndex === 1">
                <li
                  class="home-page-top-notice-list"
                  v-for="(list, index) in newsList"
                  @click="newsDetailBtn(index, msgActiveIndex)"
                >
                  <span class="home-page-top-notice-list-top">
                    <span>{{ list.title }}</span>
                    <!-- <i class="circle"></i> -->
                  </span>
                  <span class="home-page-top-notice-list-bottom">
                    <i class="el-icon-time"></i>
                    {{ list.createDate }}
                  </span> 
                </li>
              </ul>               
              <!-- 工作简报 -->
              <ul v-show="msgActiveIndex === 3">
                <li
                  class="home-page-top-notice-list"
                  v-for="(list, index) in workList"
                  @click="newsDetailBtn(index, msgActiveIndex)"
                >
                  <span class="home-page-top-notice-list-top">
                    <span>{{ list.title }}</span>
                    <!-- <i class="circle"></i> -->
                  </span>
                  <span class="home-page-top-notice-list-bottom">
                    <i class="el-icon-time"></i>
                    {{ list.createDate }}
                  </span> 
                </li>
              </ul>              
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 通知公告弹窗 -->
    <el-dialog title="详情" :visible.sync="dialogVisible" width="60%">
      <div class="NotificationDetailContent clearfix">
        <div class="subContent clearfix">
          <h2 class="ContentHeader">{{ msgDeatail.title }}</h2>
          <p style="color: #636363;font-size: 12px;text-align: center;">{{msgDeatail.createDate}} {{msgDeatail.createByName}}</p>
          <!-- <p class="DetailMore">{{ msgDeatail.content }}</p> -->
          <div class="content ql-editor" v-html="msgDeatail.content"></div>
          <div class="clearfix" v-show="images1.length > 0">
            <viewer :images="images1" class="clearfix">
              <img v-for="src in images1" :src="src.url" :key="src.name">
            </viewer>
          </div>
          <!-- <div class="subUser">
            <span class="DetailTime">{{ msgDeatail.createDate }}</span>
            <span class="DetailUser">{{ msgDeatail.createByName }}</span>
          </div> -->
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import echarts from 'echarts'
import resize from '@/components/Charts/mixins/resize'
import { getList, getNewsList, getMsgList, getWorkBriefingList, getFiles } from '@/api/home/home'
import EchartsPie from './components/echartsPie'
import leftEchartsBar from './components/leftEchartsBar'
import rightEchartsBar from './components/rightEchartsBar'
import ComEcharts from './components/echarts'
export default {
  name: 'Home',
  data() {
    return {
      pieShow: false,
      pieOption: {
        tooltip: {
          trigger: 'item',
          formatter: "{b}: {c} ({d}%)"
        },
        color: ["#52b4ff", "#ffc552"],
        legend: {
          orient: 'horizontal',
          y: 'bottom',
          // data: ['待处理工单', '待处理投诉']
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
            data: []
          }
        ]
      },
      leftOption: {
        color: ["#ff7370", "#48dff0", "#52b4ff", "#ff66a3", "#5ce5aa", "#c484f5", "#ffb870", "#fae164"],
        tooltip: {
          show: true,
          trigger: 'axis',
        },
        dataZoom: {
          show: false,
          realtime: true,
          height: 20,
          end: 100,
          handleSize: '20px',
        },
        legend: {
          data: [],
          left: "right"
        },
        grid: {
          x: "5%",
          x2: "5%",
          y: "10%",
          y2: "15%",
        },
        xAxis: [{
          name: "类型",
          type: 'category',
          data: [],
          axisLabel: {
            interval: 0, //横轴信息全部显示
            //rotate: 60, //60度角倾斜显示
          },
          axisLine: {
            lineStyle: {
              color: '#008acd' //坐标轴线颜色
            }
          },
        }],
        yAxis: [{
          name: "数量",
          type: 'value',
          minInterval: 1,
          axisLine: {
            lineStyle: {
              color: '#008acd' //坐标轴线颜色
            }
          },
        }],
        series: [{
          name: '数量',
          type: 'bar',
          barCategoryGap: "55%",
          data: [],
        }]
      },
      rightOption: {
        tooltip: {
          show: true,
          trigger: 'axis',
        },
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
          y: "10%",
          y2: "15%",
        },
        xAxis: [{
          name: "单位",
          type: 'category',
          data: [],
          axisLabel: {
            interval: 0, //横轴信息全部显示
            rotate: 60, //60度角倾斜显示
          },
          axisLine: {
            lineStyle: {
              color: '#008acd' //坐标轴线颜色
            }
          },
        }],
        yAxis: [{
          //nameLocation:"middle",
          name: "数量",
          type: 'value',
          minInterval: 1,
          axisLine: {
            lineStyle: {
              color: '#008acd' //坐标轴线颜色
            }
          },
        }],
        series: [{
          name: '工单数量',
          type: 'bar',
          barCategoryGap: "55%",
          data: [],
        }]
      },
      barColor: ["#ff7370", "#48dff0", "#52b4ff", "#ff66a3", "#5ce5aa", "#c484f5", "#ffb870", "#fae164"],
      spanActiveIndex: 0,
      msgActiveIndex: 0,
      linkUrl: "/setting/msg",
      pieChartData: [],
      leftData: {},
      rightData: {},
      activeName: '',
      dialogVisible: false,
      msgMap: [],
      newsList: [],
      workList: [],
      riverMap: [],
      riverWrap: {},
      dutyWrap: {},
      hPlakeWrap: {},
      lakeWrap: {},
      ditchWrap: {},
      otherWrap: {},
      msgDeatail: {},
      tableData3: [],
      images1: []
    }
  },
  components: {
    EchartsPie,
    leftEchartsBar,
    rightEchartsBar,
    ComEcharts
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  created() {
    this.getListData()
  },
  mounted() {
    // this.drawPie()
    // this.drawBar()
    //让echarts窗口自适应
    // this.init()
  },
  methods: {
    getListData() {
      const loading = this.$loading({
        lock: true,
        text: '加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.6)'
      })
      getList({}).then((res) => {
        //关闭加载中
        loading.close()
        // 通知广告 --- 只取前五个
        this.msgMap = res.data.msgMap.msgList.slice(0, 5)
        this.riverMap = res.data.riverMap
        // 河流
        this.riverWrap = res.data.riverMap.riverWrap
        // 责任段
        this.dutyWrap = res.data.riverMap.dutyWrap
        // 湖库
        this.hPlakeWrap = res.data.riverMap.hPlakeWrap
        // 山塘
        this.lakeWrap = res.data.riverMap.lakeWrap
        // 沟渠
        this.ditchWrap = res.data.riverMap.ditchWrap
        // 其他
        this.otherWrap = res.data.riverMap.otherWrap
        this.riverPersonMap = res.data.riverPersonMap
        // 进来默认显示 专管员巡河
        this.tableData3 = res.data.riverPersonMap.reportPersonWrap.data.list
        // 工单饼状图
        const reportMap = res.data.reportMap
        const reportMapArray = []
        reportMapArray.push(reportMap.complaintWrap)
        reportMapArray.push(reportMap.reportWrap)
        reportMapArray.map(item => {
          const obj = {}
          obj.name = item.msg
          obj.value = item.data
          this.pieChartData.push(obj)
        })
        this.pieOption.series[0].data = this.pieChartData
        this.pieShow = true

        const statisticalMap = res.data.statisticalMap
        //本月投诉统计
        const tempComplaints = statisticalMap.statisticalComplaintsWrap.data.list
        
        this.leftData = this.echartsDataTran(tempComplaints, true)
        let value = []
        this.leftData.yAxis.map((item, index) => {
          value.push({
            value: item,
            itemStyle: {
              normal: {
                color: this.barColor[index % this.barColor.length]
              }
            }
          })
        })
        this.leftOption.xAxis[0].data = this.leftData.xAxis
        this.leftOption.series[0].data = value

        // 解决第一次进来页面不显示 '本月投诉统计'的问题
        this.activeName = 'first'
        //本月工单统计
        const tempReport = statisticalMap.statisticalReportWrap.data.list
        this.rightData = this.echartsDataTran(tempReport)
        let value2 = []
        this.rightData.yAxis.map((item, index) => {
          value2.push({
            value: item,
            itemStyle: {
              normal: {
                color: this.barColor[index % this.barColor.length]
              }
            }
          })
        })
        this.rightOption.xAxis[0].data = this.rightData.xAxis
        this.rightOption.series[0].data = value2
      }).catch(erroRes => {
        loading.close()
      })
    },
    /**
     *
     * @param originData 后台原始数据
     * @param isReverse 数组是否需要反转
     * @returns {*}
     */
    // 格式化 '本月投诉统计' 和 '本月工单统计'的后台数据
    echartsDataTran(originData, isReverse) {
      const xAxis = []
      const yAxis = []
      for (const key in originData) {
        xAxis.push(originData[key].xAxis)
        yAxis.push(originData[key].yAxis)
      }
      if (isReverse) {
        return {
          'xAxis': xAxis.reverse(),
          'yAxis': yAxis.reverse()
        }
      } else {
        return {
          'xAxis': xAxis,
          'yAxis': yAxis
        }
      }
    },
    spanBtn(e) {
      // console.log('e', e)
      this.spanActiveIndex = e
      if (e === 0) {
        // 本月专管员巡河
        this.tableData3 = this.riverPersonMap.reportPersonWrap.data.list
      } else if (e === 1) {
        // 本月巡河
        this.tableData3 = this.riverPersonMap.riverPersonWrap.data.list
      }
    },
    msgBtn(i){
      this.msgActiveIndex = i
      // 通知公告
      if(i === 0){
        this.linkUrl = "/setting/msg"
        
      }else if(i === 1){
        // 新闻动态
        this.linkUrl = "/setting/sysNews"
        const p = {
          pageSize: 5,
          pageNo: 1
        }
        getNewsList(p).then((res) => {
          this.newsList = res.data.list
        }).catch((errorRes) => {})
      }else if(i === 2){
        // 任务提醒
        //Todo 路由路径没填
        this.linkUrl = "/"
      }else if(i === 3){
        // 工作简报
        this.linkUrl = "/assessmentmanagement/workBriefing"
        const p = {
          pageSize: 5,
          pageNo: 1
        }
        getWorkBriefingList(p).then((res) => {
          this.workList = res.data.list
        }).catch((errorRes) => {})
      }
    },
    // 点击通知列表,出现弹窗
    newsDetailBtn(index, msgActiveIndex, bizId) {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.images1 = []
        if(msgActiveIndex === 0) {
          const p = {
            "bizId": bizId
          }
          getFiles(p).then((res) => {
            this.images1 = res.data
          }).catch((errorRes) => {
            
          })
          this.msgDeatail = this.msgMap[index]
        }else if(msgActiveIndex === 1){
          this.msgDeatail = this.newsList[index]
        }else if(msgActiveIndex === 2){

        }else if(msgActiveIndex === 3){
          this.msgDeatail = this.workList[index]
        }
      })            
    },    
    init() {
      const self = this
      setTimeout(() => {
        window.onresize = function () {
          self.chart = echarts.init(document.getElementById('pieID'))
          // self.chart1 = echarts.init(self.$refs.myChart1)
          // self.chart2 = echarts.init(self.$refs.myChart2)
          self.chart.resize()
          // self.chart1.resize()
          // self.chart2.resize()
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
      })
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
          }
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

    handleClick(tab, event) {
      // console.log(tab, event)
      // if (tab.paneName == 'second') {
      //   setTimeout(() => {
      //     this.drawBar2()
      //   }, 100);
      // }
    }
  }


}
</script>

<style lang="scss" scoped>
.homeIndex {
  // position: absolute;
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
      margin-bottom:0.6em;
      margin-top:0;
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
  .ql-editor {
    /deep/ img {
      width: 100%;
    }
  }  
}
.topWrap {
  padding-bottom: 19px;
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
      span {
        padding: 0 0.3em;
        color: #333;
        cursor: pointer;
      }
      span.msgActive {
        color: #ffffff;
      }
    }
    .right {
      font-size: 14px;
      span:first-of-type {
        padding-right: 5px;
        cursor: pointer;
        color: #333;
      }
      .spanActive {
        color: #fff !important;
      }
      span:last-of-type {
        color: #333;
        padding-left: 5px;
        cursor: pointer;
      }
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
            height: 122px;
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
            .home-page-bottom-Survey-duty {
              background-image: url(../../../static/img/zrd.png);
            }
            .home-page-bottom-Survey-hPlake {
              background-image: url(../../../static/img/hp.png);
            }
            .home-page-bottom-Survey-lake {
              background-image: url(../../../static/img/st.png);
            }
            .home-page-bottom-Survey-ditch {
              background-image: url(../../../static/img/gq.png);
            }
            .home-page-bottom-Survey-other {
              background-image: url(../../../static/img/qt.png);
            }
            .home-page-bottom-Survey-img::before {
              content: "";
              display: inline-block;
              padding-bottom: 90%;
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
    height: 26.5em;
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
      // overflow-y: scroll;
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
          font-size: 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .circle {
            width: 10px;
            height: 10px;
            background-color: #fd3431;
            border-radius: 5px;
          }
          span {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
        }
        .home-page-top-notice-list-bottom {
          height: 50%;
          font-size: 14px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
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
  tr.el-table__row:nth-of-type(1)
  td:nth-of-type(1)
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
  tr.el-table__row:nth-of-type(2)
  td:nth-of-type(1)
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
  tr.el-table__row:nth-of-type(3)
  td:nth-of-type(1)
  .cell
  div {
  background-image: url(../../../static/img/three.png);
  background-position: center center;
  background-repeat: no-repeat;
  color: #fff;
}
.homeIndex .tableBox .el-table__body tr.el-table__row td:nth-of-type(1) .cell {
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



