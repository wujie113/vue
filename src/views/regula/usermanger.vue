<template>
  <div class="">
    <el-container v-loading="loading">
      <el-aside style="margin-right: 0;">
        <div class="panel">
          <div class="source panel-body">
            <div style="padding-top:10px;">
              <!-- <el-tree :data="myofficeusertreelist" :props="defaultProps" empty-text="暂无数据" highlight-current>
                <span class="custom-tree-node" slot-scope="{ node, data }">
                  <span>{{ node.label }}</span>
                  <span>
                    <el-button type="text" class="el-icon-tickets" size="mini" @click.stop="detailClick(data)" />
                  </span>
                </span>
              </el-tree> -->
              <el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini">
                <el-form-item>
                  <el-input v-model="formInline.user" placeholder="审批人"></el-input>
                </el-form-item>              
                <el-form-item>
                  <el-button type="primary" >查询</el-button>
                </el-form-item>
              </el-form>
              <el-collapse @change="handleChange" :data="myofficeusertreelist" v-for="(menu,index) in myofficeusertreelist" :key="index + '1'">
                <el-collapse-item :title="menu.label" name="0">
                  <div v-for="(child,index2) in menu.children" class="wrapBoxDiv"  :key="index2" @click="topSelected(index2)" :class="{ showThePerson : topActiveIndex === index2 }">
                    <div class="divPatrol">
                      <img src="../../../static/img/offline.png" alt="离线">
                      <!-- <img src="../../../static/img/online.png" alt="在线" > -->
                      <div>
                        <span>{{child.label}}</span>
                      <p>2018-11-11</p>  
                      </div>                      
                    </div>
                    <div class="btn-group MonitorStationItem-operations">
                      <el-button type="text" title="查看绑定责任段">
                        <!-- <svg-icon icon-class="edit" title="查看绑定责任段" />                         -->
                        <i class="el-icon-ali-bolangneng"></i>
                      </el-button>
                      <el-button type="text" title="查看轨迹">
                        <!-- <svg-icon icon-class="user" title="查看轨迹" /> -->
                        <i class="el-icon-ali-user"></i>
                      </el-button>
                      <el-button type="text" title="个人详情">
                        <i class="el-icon-ali-lishi"></i>
                      </el-button>

                    </div>
                  </div>
                </el-collapse-item>
              </el-collapse>
              <span class="nextDeptName">下级部门</span>
              <el-collapse @change="handleChange" :data="lowerofficeusertreelist" v-for="(menu,index) in lowerofficeusertreelist" :key="index">
                <el-collapse-item :title="menu.label" name="1">
                  <div v-for="(child,index2) in menu.children" class="wrapBoxDiv" :key="index2" @click="bottomSelected(index, index2)" :class="{ showThePerson : firstIndex === index && bottomActiveIndex === index2 }">
                    <div class="divPatrol">
                      <img src="../../../static/img/offline.png" alt="离线">
                      <!-- <img src="../../../static/img/online.png" alt="在线" > -->
                      <div>
                        <span>{{child.label}}</span>
                      <p>2018-11-11</p>  
                      </div>                      
                    </div>
                    <div class="btn-group MonitorStationItem-operations">
                      <el-button type="text" title="查看绑定责任段" @click="showresponsibility">
                        <!-- <svg-icon icon-class="edit" title="查看绑定责任段" />                         -->
                        <i class="el-icon-ali-bolangneng"></i>
                      </el-button>
                      <el-button type="text" title=" 个人详情" @click="showdetails(child.id)">
                        <!-- <svg-icon icon-class="user" title="个人详情" /> -->
                        <i class="el-icon-ali-user"></i>
                      </el-button>
                       <el-button type="text" title=" 查看轨迹" @click="showtrajectory(child.id)" >
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
        <!--插入地图-->
        <rm-map v-model="map" />

         <Layer title="个人详情"  v-model="details"   :dialog="false" class="layer-1" width="300" :animation="2" :maskLayer="false" :shade= "false"
                 height="600" confirm="确定" cancel="取消" >
                  <el-form :v-model="userdetails"  abel-width="80px" size="mini" class="leftBox" style="">
                      <el-form-item label="头    像:">{{userdetails.name}}</el-form-item>
                      <el-form-item label="头像下单位:">{{userdetails.officeName}}</el-form-item>
                      <el-form-item label="区   划:">{{userdetails.address}}</el-form-item>
                      <el-form-item label="单   位:">{{userdetails.officeName}}</el-form-item>
                      <el-form-item label="部   门:">{{userdetails.postLabel}}</el-form-item>
                      <el-form-item label="状   态:">{{userdetails.postState}}</el-form-item>
                      <el-form-item label="手机号码:">{{userdetails.phone}}</el-form-item>
                      <el-form-item label="性   别:">{{userdetails.gender}}</el-form-item>
                      <el-form-item label="邮   箱:">{{userdetails.email}}</el-form-item>
                      <el-form-item label="职   务:"> </el-form-item>
                      <el-form-item label="固定电话:">{{userdetails.mobile}}</el-form-item>
                      <el-form-item label="传   真:"></el-form-item> 
                  </el-form>
         </Layer>

         <Layer title="巡护轨迹 - (用户)"  v-model="trajectory"   :dialog="false" class="layer-1" width="500" :animation="2" :maskLayer="false" :shade= "false"
                 height="600" confirm="确定" cancel="取消" >
                    <template> 
                     <div class="block">
                      <span class="demonstration"></span>
                      <el-date-picker v-model="value4" type="datetimerange"  range-separator="至"  start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                      <el-button icon="el-icon-search"></el-button>
                    </div>
                    </template>
                   <span>共有轨迹(count)条</span> 
                    <div>轨迹1</div>
                    <div>轨迹2</div>
                    <div>轨迹3</div>
         </Layer>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import { tree, getmanagerlist, get } from '@/api/res/river'
import { hptree } from '@/api/res/lake'
import Pagination from '@/components/Pagination'
import RmMap from "@/components/rm/map"
import { getfiles, delfiles, uploadFile } from '@/api/core/file.js'
import { getToken } from '@/utils/auth'
import { getgeometryList } from '@/api/res/geometry'

import { userinfo } from '@/api/core/user'
import Layer from '@/components/layer'
import { findOfficeUserstree } from '@/api/res/management'
import {gettrajectory } from '@/api/res/workTrajectory'
export default {
  name: "usermanger",
  components: { Pagination, RmMap },
  data() {
    return {
      formInline: {
        user: '',
        region: ''
      },
      topActiveIndex: '',
      bottomActiveIndex: '',
      firstIndex: '',
      map: null,
      lowerofficeusertreelist: [],
      activeNames: ['1'],
      menu: null,
      myofficeusertreelist: [],
      trajectory:false,
      details:false,
      value4: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
      userdetails:{
          name:null,
          officeName:null,
          address:null,
          officeName:null,
          postLabel:null,
          postState:null,
          phone:null,
          gender:null,
          email:null,
          mobile:null
      },
      defaultProps: {
        children: "children",
        label: "label"
      },
      query: {
        pid: "58e0b27968354ae0b51d532cc092637e",
        loading: false,
      },
      loading:false 
    }
  },
  created() {
    this.loadOfficeTree()
  },
  methods: {
    topSelected(i){
      this.topActiveIndex = i
    },
    bottomSelected(index, i){
      this.firstIndex = index
      this.bottomActiveIndex = i
    },
    handleNodeClick(data) {
      this.centerView(data);
    },
    handleChange(val) {
      console.log(val);
    },
    loadOfficeTree() {
      this.loading = true;
      findOfficeUserstree(this.query).then(response => {
        this.lowerofficeusertreelist = response.data.lowerlist;
        console.log("this.lowerofficeusertreelist", this.lowerofficeusertreelist)
        this.myofficeusertreelist = response.data.currentlist;
        this.loading = false;
      })
    },
    //查看绑定责任段
    showresponsibility(){
      alert("查看绑定责任段")
    },
    //查看个人详情
    showdetails(child){
       // alert("查看个人详情")
       console.log(" child", child)
       this.details = true
      userinfo(child).then(response => {
         this.userdetails = response.data
          console.log(" this.userdetails ", this.userdetails )
      })
    },
    //查看轨迹
    showtrajectory(child){
       // alert("查看轨迹")
      // 获取用户
       //var username  =child.label
        this.trajectory = true
        gettrajectory(child).then(response =>{
          //this.trajectory = response.data
        })
    },

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
