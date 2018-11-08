<template>
  <div class="app-container">
    <el-container v-loading="loading">
        <rm-map/>
    </el-container> 
    <!--弹出窗口-->
     <el-dialog :visible.sync="dialogVisible"  width="70%"  title="河流管理">
           <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane name="1">
          <span slot="label"><i class="el-icon-date"></i> 水闸</span>
          <keep-alive> 
                  <sluice @create="showCreatedTimes"/>
          </keep-alive>
        </el-tab-pane>
        <el-tab-pane label="水源地" name="2" >  
          <keep-alive> 
            <cradle v-if="activeName==2"  />
          </keep-alive>
        </el-tab-pane>
        <el-tab-pane label="水库" name="3"> 
          <keep-alive>
              <reservoir v-if="activeName==3"  />
          </keep-alive>
        </el-tab-pane>
        <el-tab-pane label="水井" name="4"> 
          <keep-alive>
              <wells v-if="activeName==4"  />
          </keep-alive>
        </el-tab-pane>
        <el-tab-pane label="农饮工程" name="5">
          <keep-alive>
            <agricultural v-if="activeName==5" />
          </keep-alive>
        </el-tab-pane> 
        <el-tab-pane label="水电站" name="6">
          <keep-alive>
            <waterSubstation v-if="activeName==6" />
          </keep-alive>
        </el-tab-pane> 
          <el-tab-pane label="取水口" name="7">
          <keep-alive>
            <intake v-if="activeName==7" />
          </keep-alive>
        </el-tab-pane> 
        <el-tab-pane label="堤防" name="8">
            <keep-alive>
              <riverWall v-if="activeName==8"/>
            </keep-alive>
        </el-tab-pane>
        <el-tab-pane label="泵站" name="9">
            <keep-alive>
              <pump v-if="activeName==9"/>
            </keep-alive>
        </el-tab-pane>
        <el-tab-pane label="排水口" name="10">
            <keep-alive>
              <sewage v-if="activeName==10"/>
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
import RmMap from "@/components/rm/map"
import sluice from '../res/sluice.vue'  //水闸
import cradle from '../res/cradle.vue' //水源地
import reservoir from '../res/reservoir.vue' //水库
import wells from '../res/wells.vue' //水库 
import agricultural from '../res/agricultural.vue'  //农饮工程
import waterSubstation from '../res/waterSubstation.vue' //水电站
import intake from '../res/intake.vue' //取水口
import riverWall from '../res/riverWall.vue' //堤防
import pump from '../res/pump.vue' //泵站
import sewage from '../res/sewage.vue' //排水口
export default {
  components: { Pagination ,RmMap,sluice ,cradle,reservoir,wells,agricultural,waterSubstation,intake,riverWall,pump,sewage},
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
