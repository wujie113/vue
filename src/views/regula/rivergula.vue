<template>
  <div class="app-container">
    <el-container v-loading="loading">
      <el-aside>
        <div class="panel"> 
          <div class="source panel-body">
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="河流" name="hl">  
                    <el-tree :data="dataArray" :props="defaultProps" @node-click="handleNodeClick" empty-text="暂无数据" highlight-current>
                      <span class="custom-tree-node" slot-scope="{ node, data }">
                        <span>{{ node.label }}</span>
                        <span>
                          <el-button
                            type="text" class="el-icon-tickets"
                            size="mini" @click="detailClick(node)" > 
                          </el-button> 
                        </span>
                      </span> 
                  </el-tree>
              </el-tab-pane>
              <el-tab-pane label="湖泊" name="hp">
                     <el-tree :data="hpdataarray" :props="defaultProps" @node-click="handleNodeClick" empty-text="暂无数据" highlight-current></el-tree>
              </el-tab-pane> 
            </el-tabs> 
          </div>
        </div>
      </el-aside>
      <el-container>
          <!--插入地图-->
          <rm-map/>
      </el-container>
    </el-container> 
  </div>
</template>
<script>
import { tree } from '@/api/res/river'
import { hptree } from '@/api/res/lake'
import Pagination from '@/components/Pagination'

import RmMap from "@/components/rm/map"
export default {
  name:"rivergula",
  components: { Pagination ,RmMap},
  data() { 
    return {
      activeName:"hl",
      loading: true,
      tableLoading: false,
      checked: false,
      dataArray: [],
      hpdataarray:[],
      dialogVisible: false,
      dialogVisible1: false,
      dialogVisible2: false,
      defaultProps: {
        children: "children",
        label: "label"
      }
    }
  },
  created() {
    this.loadLeftTree()
     this.loadHpTree();
  },
  methods: {
    loadLeftTree() {
      tree().then((res) => {
        console.log("左边树", res)
        const data = res.data.list
        this.dataArray = data
        this.loading = false
      }).catch((errorRes) => {
        this.loading = false
      })
    },
    loadHpTree(){
        hptree().then((res) => {
        console.log("左边树22", res)
        const data = res.data.list
        this.hpdataarray = data
        this.loading = false
      }).catch((errorRes) => {
        this.loading = false
      })
    },
    handleClick(tab){ 
       
    },
    handleNodeClick(){
      // console.log("tab:::",tab);
    },
    detailClick(node){
      console.log("node::::",node);
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
// .cell .el-button--text:nth-of-type(3) .svg-icon {
//   fill: #f25c5c;
// }
.el-container {
  .el-aside {
    width: 15% !important;
    margin-right: 1%;
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
.app-container {
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
  margin-bottom: 20px;
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
