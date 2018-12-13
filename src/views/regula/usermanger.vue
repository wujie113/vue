<template>
  <div class="userManagerWrap">
    <el-container v-loading="loading">
      <el-aside style="margin-right: 0;">
        <div class="panel">
          <div class="source panel-body">
            <div style="padding-top:10px;">
              <el-form
                :inline="true"
                :model="formInline"
                class="demo-form-inline"
                size="mini"
              >
                <el-form-item>
                  <el-input
                    v-model="formInline.user"
                    placeholder="审批人"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary">查询</el-button>
                </el-form-item>
              </el-form>
              <el-collapse
                @change="handleChange"
                :data="myofficeusertreelist"
                v-for="(menu, index) in myofficeusertreelist"
                :key="index + '1'"
              >
                <el-collapse-item :title="menu.label" name="0">
                  <div
                    v-for="(child, index2) in menu.children"
                    class="wrapBoxDiv"
                    :key="index2"
                    @click="topSelected(index2);"
                    :class="{ showThePerson: topActiveIndex === index2 }"
                  >
                    <div class="divPatrol">
                      <img src="../../../static/img/offline.png" alt="离线" />
                      <!--
                        <img src="../../../static/img/online.png" alt="在线" >
                      -->
                      <div>
                        <span>{{ child.label }}</span>
                        <p>2018-11-11</p>
                      </div>
                    </div>
                    <div class="btn-group MonitorStationItem-operations">
                      <el-button type="text" title="查看绑定责任段" @click="showresponsibility(child)">
                        <i class="el-icon-ali-bolangneng"></i>
                      </el-button>
                      <el-button type="text" title="个人详情" @click="showdetails(child.id)">
                        <i class="el-icon-ali-user"></i>
                      </el-button>
                      <el-button type="text" title="查看轨迹" @click="showtrajectory(child)">
                        <i class="el-icon-ali-lishi"></i>
                      </el-button>
                    </div>
                  </div>
                </el-collapse-item>
              </el-collapse>
              <span class="nextDeptName">下级部门</span>
              <el-collapse
                @change="handleChange"
                :data="lowerofficeusertreelist"
                v-for="(menu, index) in lowerofficeusertreelist"
                :key="index"
              >
                <el-collapse-item :title="menu.label" name="1">
                  <div
                    v-for="(child, index2) in menu.children"
                    class="wrapBoxDiv"
                    :key="index2"
                    @click="bottomSelected(index, index2);"
                    :class="{
                      showThePerson:
                        firstIndex === index && bottomActiveIndex === index2
                    }"
                  >
                    <div class="divPatrol">
                      <img src="../../../static/img/offline.png" alt="离线" />
                      <!--
                        <img src="../../../static/img/online.png" alt="在线" >
                      -->
                      <div>
                        <span>{{ child.label }}</span>
                        <p>2018-11-11</p>
                      </div>
                    </div>
                    <div class="btn-group MonitorStationItem-operations">
                      <el-button
                        type="text"
                        title="查看绑定责任段"
                        @click="showresponsibility(child)"
                      >
                        <!--
                          <svg-icon icon-class="edit" title="查看绑定责任段" />
                        -->
                        <i class="el-icon-ali-bolangneng"></i>
                      </el-button>
                      <el-button
                        type="text"
                        title=" 个人详情"
                        @click="showdetails(child.id)"
                      >
                        <!-- <svg-icon icon-class="user" title="个人详情" /> -->
                        <i class="el-icon-ali-user"></i>
                      </el-button>
                      <el-button
                        type="text"
                        title=" 查看轨迹"
                        @click="showtrajectory(child)"
                      >
                        <i class="el-icon-ali-lishi"></i>
                      </el-button>
                    </div>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>
        </div>
      </el-aside>
      <el-container>
        <!-- 插入地图 -->
        <rm-map v-model="map" />
        <Layer
          title="个人详情"
          v-model="details"
          :dialog="false"
          class="layer-1"
          width="400"
          :animation="2"
          :maskLayer="false"
          :shade="false"
          height="600"
          confirm="确定"
          cancel="取消"
        >
          <el-form
            :v-model="userdetails"
            abel-width="80px"
            size="mini"
            class="leftBox"
            style=""
          >
            <el-form-item>
              <div class="topImgBox">
                <img src="static\img\avatar_gaitubao_com_70x70.png" />
                <div>
                  <span>{{ userdetails.name }}</span>
                  <p>{{ userdetails.officeName }}</p>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="头像下单位:">
              {{userdetails.officeName }}
            </el-form-item>
            <el-form-item label="区   划:">
              {{userdetails.address }}
            </el-form-item>
            <el-form-item label="单   位:">
              {{userdetails.officeName }}
            </el-form-item>
            <el-form-item label="部   门:">
              {{userdetails.postLabel }}
            </el-form-item>
            <el-form-item label="状   态:">
              {{ userdetails.postState }}
            </el-form-item>
            <el-form-item label="手机号码:">
              {{userdetails.mobile }}
            </el-form-item>
            <el-form-item label="性   别:">
              {{userdetails.gender }}
            </el-form-item>
            <el-form-item label="邮   箱:">
              {{ userdetails.email }}
            </el-form-item>
            <el-form-item label="职   务:"></el-form-item>
            <el-form-item label="固定电话:"></el-form-item>
            <el-form-item label="传   真:"></el-form-item>
          </el-form>
        </Layer>
        <Layer
          :title="'巡护轨迹 - ' + titleName"
          v-model="trajectory"
          :dialog="false"
          class="layer-1"
          width="493"
          :animation="2"
          :maskLayer="false"
          :shade="false"
          height="600"
          confirm="确定"
          cancel="取消"
        >
          <template>
            <div class="block">
              <el-date-picker
                v-model="value1"
                type="date"
                value-format="timestamp"
                @change="start"
                size="mini"
                placeholder="开始日期"
              >
              </el-date-picker>
              <span>至</span>
              <el-date-picker
                v-model="value2"
                type="date"
                value-format="timestamp"
                @change="end"
                size="mini"
                placeholder="结束日期"
              >
              </el-date-picker>
              <el-popover
                placement="right-start"
                title=""
                width="200"
                trigger="manual"
                content="结束时间需大于开始时间。"
                v-model="popoverVisible"
              >
                <el-button
                  slot="reference"
                  icon="el-icon-search"
                  @click="searchBtn"
                  size="mini"
                  >查询</el-button
                >
              </el-popover>
            </div>
          </template>
          <div class="divHistoricalRouteClear">
            <span style="margin-left: 10px;"> 共有轨迹 </span>
            <div :class="{ showLoad: isShowLoad, showLoading: isLoading }">
              <div class="loadEffect">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            <span
              :class="{ showLoad: isShowLoad, showLoading: !isLoading }"
              class="label label-badge label-info historicalRouteNum"
              data-dojo-attach-point="historicalRouteNum"
              style="background-color: rgb(39, 156, 245);"
              >{{ count }}</span
            >
            <span> 条 </span>
            <!--
              <button class="btn btn-info btnHistoricalRouteClear" data-dojo-attach-point="btnHistoricalRouteClear" style="display: none;">
                     清除轨迹
                 </button>
            -->
          </div>
          <div class="historicalRoute-resultPage">
            <div class="historicalroute-PatrolItem">
              <div class="routePatrolItemGroup">
                <ul v-show="workTrajectory.length > 0">
                  <li
                    :class="{ 'get-focus-list': getFocusList === index }"
                    @click="getFocusListBtn(index);"
                    v-for="(item, index) in workTrajectory" 
:key="index"
                  >
                    <div class="routeItem">
                      <div class="routeItemTag">轨迹 {{ index + 1}}</div>
                      <p class="routeItemName">
                        {{ item.startPlace }} → {{ item.endPlace }}
                      </p>
                      <p class="routeItemNameInfo">
                        <span class="spanWithBorder" title="开始时间" >{{ item.startTime }}</span>
                        <span class="spanWithBorder" title="轨迹路程">{{ item.mileage }}<span>公里</span></span>
                        <span class="" title="总耗时">{{ item.timeZones }}</span>
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Layer>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import { tree, getmanagerlist, get,getusermanagentriver } from "@/api/res/river"
import { hptree } from "@/api/res/lake"
import Pagination from "@/components/Pagination"
import RmMap from "@/components/rm/map"
import { getfiles, delfiles, uploadFile } from "@/api/core/file.js"
import { getToken } from "@/utils/auth"
import { getgeometryList } from "@/api/res/geometry"

import { userinfo } from "@/api/core/user"
import Layer from "@/components/layer"
import { findOfficeUserstree } from "@/api/res/management"
import { gettrajectory } from "@/api/res/workTrajectory"
export default {
  name: "Usermanger",
  components: { Pagination, RmMap },
  data() {
    return {
      isLoading: false,
      isShowLoad: true,
      titleName: "",
      formInline: {
        user: "",
        region: ""
      },
      count: "",
      workTrajectory: [],
      popoverVisible: false,
      topActiveIndex: "",
      bottomActiveIndex: "",
      firstIndex: "",
      getFocusList: "",
      map: null,
      maplnglat: {
          lng: null,
          id: null,
          lat: null
        },
      lowerofficeusertreelist: [],
      activeNames: ["1"],
      menu: null,
      myofficeusertreelist: [],
      trajectory: false,
      details: false,
      parems: {
        starttime: null,
        endtime: null,
        id: ''
      },
      value1: "",
      value2: "",
      // value4: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
      userdetails: {
        name: null,
        officeName: null,
        address: null,
        officeName: null,
        postLabel: null,
        postState: null,
        phone: null,
        gender: null,
        email: null,
        mobile: null
      },
      defaultProps: {
        children: "children",
        label: "label"
      },
      query: {
        pid: null,
        loading: false
      },
      loading: false
    }
  },
  created() {
    this.loadOfficeTree()
  },
  methods: {
    // 计算相差时间 date2 > date1
    DateTime(date1, date2) {
      // var date1= '2018-11-30 11:39:10';  //开始时间
      // var date2 = new Date();    //结束时间
      const date3 = new Date(date2).getTime() - new Date(date1).getTime() //时间差的毫秒数

      //计算出相差天数
      const days = Math.floor(date3 / (24 * 3600 * 1000))
      //计算出小时数
      const leave1 = date3 % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
      const hours = Math.floor(leave1 / (3600 * 1000))
      //计算相差分钟数
      const leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
      const minutes = Math.floor(leave2 / (60 * 1000))
      //计算相差秒数
      const leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数
      const seconds = Math.round(leave3 / 1000)
      let diffValue
      if (days > 0) {
        diffValue = days + "天 " + hours + "小时 " + minutes + " 分钟" + seconds + " 秒"
      } else {
        diffValue = hours + "小时 " + minutes + " 分钟" + seconds + " 秒"
      }
      return diffValue
    },
    topSelected(i) {
      this.topActiveIndex = i
    },
    bottomSelected(index, i) {
      this.firstIndex = index
      this.bottomActiveIndex = i
    },
    getFocusListBtn(i) {
      this.getFocusList = i
    },
    handleNodeClick(data) {
      this.centerView(data)
    },
    handleChange(val) {
    },
    loadOfficeTree() {
      this.loading = true
      findOfficeUserstree(this.query).then(response => {
        this.lowerofficeusertreelist = response.data.lowerlist
        this.myofficeusertreelist = response.data.currentlist
        this.loading = false
      }).catch((errorRes) => {
        
      })
    },
    //查看绑定责任段
    showresponsibility(child) {
      getusermanagentriver({ id: child.id }).then(response => {
        //绑定责任段数据
        const maplnglat = response.data.list;
        console.log("maplnglat",maplnglat)
          var maplist = maplnglat.map((item, index) => {
            return maplnglat[index].id
          })
          this.map.selectLine({ id: maplist,lng:maplnglat[0].lng,lat: maplnglat[0].lat })
       })
    },
    //查看个人详情
    showdetails(child) {
      this.details = true
      userinfo(child).then(response => {
        this.userdetails = response.data
      })
    },

    //查看轨迹
    showtrajectory(child) {
      // alert("查看轨迹")
      // 获取用户
      //var username  =child.label
      this.trajectory = true
      this.isLoading = true
      this.getFocusList = ""
      this.workTrajectory = []
      this.parems.id = child.id
      this.titleName = child.label

      gettrajectory({ id: child.id }).then(response => {
        this.isLoading = false
        this.count = response.data.count
        if (response.data.list.length > 0) {
          // DateTime()
          response.data.list.map(item => {
            item.timeZones = this.DateTime(item.startTime, item.endTime)
          })
          this.workTrajectory = response.data.list
          // 弹窗顶部的title
        }
      }).catch(() => {
        this.isLoading = false
      })
    },
    start(start) {
      this.parems.starttime = start
    },
    end(end) {
      this.parems.endtime = end
    },
    //根据时间进行查询
    searchBtn() {
      if (this.parems.starttime > this.parems.endtime) {
        this.popoverVisible = true
        setTimeout(() => {
          this.popoverVisible = false
        }, 1500)
        return
      } else {
        // const querytrajectory = {
        //   starttime: this.parems.starttime,
        //   endtime: this.parems.endtime
        // };
        const querytrajectory = this.parems
        //时间区间正确选择,调用查询接口
        gettrajectory(querytrajectory).then(response => {
          //轨迹列表显示
          this.count = response.data.count
          if (response.data.list.length > 0) {
            // DateTime()
            response.data.list.map(item => {
              item.timeZones = this.DateTime(item.startTime, item.endTime)
            })
            this.workTrajectory = response.data.list
          }else {
            this.workTrajectory = []
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-button .svg-icon {
  width: 1.2rem;
  height: 1.2rem;
}
.cell .el-button--text:first-of-type .svg-icon {
  fill: #4ecc89;
}
.el-container {
  .el-aside {
    width: 17% !important;
    min-width: 255px;
  }
  .el-header,
  .el-main {
    border: 1px solid transparent;
    border-color: #ddd;
    border-radius: 4px;
    -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
    width: 100%;
  }
  .el-header {
    margin-bottom: 1%;
  }
  .leftBox {
    .topImgBox {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      height: 90px;
      border-bottom: 1px solid #e1e4e6;
      margin-bottom: 4px;
      div {
        display: flex;
        flex-direction: column;
        margin-left: 1em;
      }
      p {
        margin: 0;
        padding: 0;
      }
      span {
        font-size: 18px;
        color: #1b95d8;
      }
    }
  }
  /deep/ .el-date-editor.el-input {
    width: 180px;
  }
  .divHistoricalRouteClear {
    margin: 10px 0;
    background-color: #f1eff0;
    width: 100%;
    height: 32px;
    line-height: 32px;
    vertical-align: middle;
    margin-left: 2px;
    zoom: 1;
    > span {
      margin: 0 6px;
      vertical-align: middle;
    }
    > span:nth-of-type(2) {
      min-width: 10px;
      padding: 5px 7px;
      font-size: 12px;
      line-height: 1;
      border-radius: 100%;
      color: #fff;
    }
    .showLoading {
      display: inline-block !important;
    }
    .showLoad {
      display: none;
      vertical-align: middle;
      .loadEffect {
        width: 25px;
        height: 25px;
        position: relative;
        vertical-align: middle;
        span {
          display: inline-block;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: lightgreen;
          position: absolute;
          -webkit-animation: load 1.04s ease infinite;
        }
        span:nth-child(1) {
          left: 0;
          top: 50%;
          margin-top: -1.6px;
          -webkit-animation-delay: 0.13s;
        }
        span:nth-child(2) {
          left: 2.8px;
          top: 2.8px;
          -webkit-animation-delay: 0.26s;
        }
        span:nth-child(3) {
          left: 50%;
          top: 0;
          margin-left: -1.6px;
          -webkit-animation-delay: 0.39s;
        }
        span:nth-child(4) {
          top: 2.8px;
          right: 2.8px;
          -webkit-animation-delay: 0.52s;
        }
        span:nth-child(5) {
          right: 0;
          top: 50%;
          margin-top: -1.6px;
          -webkit-animation-delay: 0.65s;
        }
        span:nth-child(6) {
          right: 2.8px;
          bottom: 2.8px;
          -webkit-animation-delay: 0.78s;
        }
        span:nth-child(7) {
          bottom: 0;
          left: 50%;
          margin-left: -1.6px;
          -webkit-animation-delay: 0.91s;
        }
        span:nth-child(8) {
          bottom: 2.8px;
          left: 2.8px;
          -webkit-animation-delay: 1.04s;
        }
      }
    }

    @-webkit-keyframes load {
        0% {
            opacity: 1;
        }
        100% {
            opacity: 0.2;
        }
    }
  }
  .historicalRoute-resultPage {
    overflow-y: auto;
    height: 365px;
    .historicalroute-PatrolItem {
      padding: 0 20px;
      .routePatrolItemGroup {
        display: block;
        ul,
        li {
          margin: 0;
          padding: 0;
          list-style: none;
        }
        // 点击选中责任段
        .get-focus-list {
          border: 1px solid #f3f3f3;
          box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.12),
            0 1px 4px 0 rgba(0, 0, 0, 0.12);
          background-color: #f1eff0;
          .routeItem {
            .routeItemTag {
              background-color: #279cf5;
            }
          }
        }
        li:hover {
          border: 1px solid #f3f3f3;
          box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.12),
            0 1px 4px 0 rgba(0, 0, 0, 0.12);
        }
        li:hover .routeItemTag {
          background-color: #03b8cf !important;
        }
        li {
          border: 1px solid #e4e6e7;
          cursor: pointer;
          width: 100%;
          margin-top: 2px;
          margin-bottom: 8px;
          .routeItem {
            color: #666;
            line-height: 22px;
            padding: 25px 18px 10px;
            .routeItemTag {
              float: left;
              width: auto;
              padding: 0 15px;
              color: #fff;
              margin-top: -26px;
              margin-left: -19px;
              line-height: 20px;
              background-color: #888;
            }
            p {
              margin: 5px 0;
              // width: 260px;
            }
            .routeItemName {
              font-size: 14px;
              color: #36c;
            }
            .routeItemNameInfo {
              .spanWithBorder {
                border-right: 1px solid #ddd;
              }
              span {
                padding-right: 8px;
                margin-right: 8px;
              }
            }
          }
        }
      }
    }
  }
}

.panel {
  margin-bottom: 0;
  min-height: 86vh;
  overflow: auto;
  height: 100%;
  .panelHeading {
    color: #333;
    background-color: #f5f5f5;
    border-color: #ddd;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 39px;
    .svg-icon {
      margin: 0 5px;
    }
    .btn-group {
      position: relative;
      // display: inline-block;
      vertical-align: middle;
      float: right;
    }
  }
  .source {
    padding-left: 10px;
    padding-right: 10px;
  }
  .panel-body {
    overflow: auto;
    height: calc(86vh - 41px);
    p {
      margin: 0;
      padding: 0;
    }
    /deep/ .el-form--inline {
      .el-form-item {
        margin-right: 0px;
        margin-bottom: 10px;
      }
    }
    /deep/ .el-collapse {
      .el-collapse-item__header {
        padding-left: 10px;
        color: #03a9f4;
      }
      .el-collapse-item__content {
        padding: 5px 0 10px 0;
      }
      .el-collapse-item__header:hover {
        background-color: #388bf3;
        color: #fff;
      }
      div.is-active {
        background-color: #388bf3;
        color: #fff;
      }
    }
    .nextDeptName {
      font-size: 13px;
      color: #9e9e9e;
      line-height: 30px;
    }
    .wrapBoxDiv:hover {
      box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.12),
        0 1px 4px 0 rgba(0, 0, 0, 0.12);
    }
    .showThePerson {
      box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.12),
        0 1px 4px 0 rgba(0, 0, 0, 0.12);
    }
    .wrapBoxDiv {
      position: relative;
      // display: -webkit-inline-box;
      width: 100%;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 6px;
      margin-top: 5px;
      .svg-icon {
        width: 1.1rem;
        height: 1.1rem;
        cursor: pointer;
      }
      .svg-icon:nth-last-of-type() {
        margin-right: 5px;
      }
      img {
        // position: absolute;
        // left: 6px;
        // top: 7px;
        width: 32px;
        height: 32px;
        border-radius: 100%;
        margin-right: 10px;
      }
      .divPatrol {
        // margin-left: 50px;
        // width: 155px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        p {
          line-height: 18px;
          font-size: 12px;
          color: #999;
          max-width: 120px;
          vertical-align: top;
          word-break: break-all;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 120px;
        }
      }
      .MonitorStationItem-operations {
        // width: 80px;
        text-align: right;
        vertical-align: middle;
        position: relative;
        display: inline-block;
        vertical-align: middle;
        white-space: nowrap;
      }
    }
  }
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.panel {
  background-color: #f2f6fc;
  border: 1px solid transparent;
  border-color: #ddd;
  border-radius: 4px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
}
.panelHeading {
  padding: 8px 15px;
  border-bottom: 1px solid transparent;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
}
</style>
