<template>
  <div class="app-container">
    <el-container v-loading="loading">
        <rm-map/>
    </el-container> 
    <!--弹出窗口-->
     <el-dialog :visible.sync="dialogVisible"  width="70%"  title="河流管理">
           <el-tabs v-model="activeName" type="border-card">
              <el-tab-pane name="1">
                <span slot="label"><i class="el-icon-date"></i> 河流</span>
                <keep-alive> 
                     <river/>
                </keep-alive>
              </el-tab-pane>
              <el-tab-pane name="2">
                <span slot="label"><i class="el-icon-date"></i> 山塘、湖库</span>
                <keep-alive> 
                       <lake/>
                </keep-alive>
              </el-tab-pane>
              <el-tab-pane name="3">
                <span slot="label"><i class="el-icon-date"></i> 责任段</span>
                <keep-alive> 
                        <dutypart/>
                </keep-alive>
              </el-tab-pane>
           </el-tabs> 
     </el-dialog>
  </div>
</template>
<script>
import { tree } from '@/api/res/river'
import { hptree } from '@/api/res/lake'
import Pagination from '@/components/Pagination'
import river from '../res/river.vue' //河流 
import lake from '../res/lake.vue' //湖泊 
import dutypart from '../res/dutyPart.vue' //责任段
import RmMap from "@/components/rm/map"
export default {
  components: { Pagination ,RmMap,river,lake,dutypart},
  data() { 
    return {
      activeName:"1",
      loading: true,
      tableLoading: false,
      checked: false,
      dataArray: [],
      hpdataarray:[], 
      dialogVisible: true, 
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
