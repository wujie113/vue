<template>
  <div class="">
    <el-container v-loading="loading">
      <el-aside style="margin-right: 0;">
        <div class="panel">
          <div class="source panel-body">

            <el-tree :data="myofficeusertreelist" :props="defaultProps" empty-text="暂无数据" highlight-current>
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
                <span>
                  <el-button type="text" class="el-icon-tickets" size="mini" @click.stop="detailClick(data)" />
                </span>
              </span>
            </el-tree>

            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>下级部门</span>
              </div>
              <!--
               <el-tree :data="lowerofficeusertreelist" :props="defaultProps" @node-click="handleNodeClick" empty-text="暂无数据" highlight-current>  
                   <span class="custom-tree-node" slot-scope="{ node, data }"  > 
                      <span>{{ node.label }}</span>
                      <span>
                        <el-button type="text" class="el-icon-tickets" size="mini" @click.stop="detailClick(data)"/>  
                      </span> 
                   </span> 
              </el-tree> 
              -->
              <el-collapse @change="handleChange" :data="list" v-for="(menu,index) in list" :key="index">
                <el-collapse-item :title="menu.label" name="1">
                  <div v-for="(child,index2) in menu.children" :key="index2" class="wrapBoxDiv">
                    <img src="../../../static/img/offline.png" alt="离线" srcset="">
                    <!-- <img src="../../../static/img/online.png" alt="在线" srcset=""> -->
                    <div class="divPatrol">
                      <span>
                        {{child.label}}-111111
                      </span>
                      <p>2018-11-11</p>
                    </div>
                    <div class="btn-group MonitorStationItem-operations">
                      <svg-icon icon-class="edit" title="查看绑定责任段"  />
                      <svg-icon icon-class="user" title="查看轨迹" />
                      <svg-icon icon-class="deleteColor" title="个人详情" />
                    </div>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </el-card>
          </div>
        </div>
      </el-aside>
      <el-container>
        <!--插入地图-->
        <rm-map v-model="map" />
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
import Layer from '@/components/layer'
import { findOfficeUserstree } from '@/api/res/management'
export default {
  name: "usermanger",
  components: { Pagination, RmMap },
  data() {
    return {
      map: null,
      lowerofficeusertreelist: [],
      activeNames: ['1'],
      menu: null,
      myofficeusertreelist: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      query: {
        pid: "58e0b27968354ae0b51d532cc092637e",
        loading: false,
      },
      list: [
        {
          "id": "dfd6a05879c84a9fa095392bef17b5c4",
          "parentId": "58e0b27968354ae0b51d532cc092637e",
          "label": "安源区河长办",
          "code": "100001007001001",
          "type": "o",
          "sort": 30,
          "children": [
            {
              "id": "80f259115cd24c7198dac136790adae8",
              "parentId": "dfd6a05879c84a9fa095392bef17b5c4",
              "label": "555",
              "type": "u"
            },
            {
              "id": "55e5cea42d9c417a96898d6df8451cb5",
              "parentId": "dfd6a05879c84a9fa095392bef17b5c4",
              "label": "康峰",
              "type": "u"
            }
          ]
        },
        {
          "id": "54edd6b3718348e0ac254394ada6cfac",
          "parentId": "58e0b27968354ae0b51d532cc092637e",
          "label": "湘东河长办",
          "code": "100001007001001007",
          "type": "o",
          "sort": 30,
          "isDisabled": true
        }
      ]
    }
  },
  created() {
    this.loadOfficeTree()
  },
  methods: {
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
    /deep/ .box-card {
      .el-card__header {
        padding: 10px;
      }
    }
    /deep/ .el-card__body {
      padding: 10px;
    }
    .wrapBoxDiv:hover {
      box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.12),
        0 1px 4px 0 rgba(0, 0, 0, 0.12);
    }
    .wrapBoxDiv {
      position: relative;
      display: -webkit-inline-box;
      width: 100%;
      cursor: pointer;
      .svg-icon {
        width: 1.2rem;
        height: 1.2rem;
        cursor: pointer;
      }
      .svg-icon:nth-last-of-type() {
        margin-right: 5px;

      }
      img {
        position: absolute;
        left: 6px;
        top: 7px;
        width: 32px;
        height: 32px;
        border-radius: 100%;
      }
      .divPatrol {
        margin-left: 50px;
        width: 110px;
      }
      .MonitorStationItem-operations {
        width: 80px;
        text-align: right;
        vertical-align: middle;
        padding-top: 12px;
        position: relative;
        display: inline-block;
        vertical-align: middle;
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
  background-color: #fff;
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
