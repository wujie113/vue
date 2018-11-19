<template>
  <div class="">
    <el-button type="button"  @click="clicktest">测试</el-button>
     <el-container v-loading="loading">
       <rm-map v-model="map"></rm-map>
      <div class="el-mindiv" v-show="!dialogVisible" @click="dialogVisible=!dialogVisible">
        <div class="layui-layer-title">河流管理</div>
         
        <span class="layui-layer-setwin">
          <!-- <svg-icon icon-class="huanyuan" /> -->
          <i class="el-icon-ali-diejia"></i>
        </span>
      </div>
    </el-container>
  
    <!--弹出窗口-->
    <el-dialog :visible.sync="dialogVisible" width="80%" title="河流管理" :append-to-body="false" :close-on-click-modal="false" :modal="false" :modal-append-to-body="false" top="3vh">
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane name="HL">
          <span slot="label"><i class="el-icon-date"></i> 河流</span>
          <keep-alive>
            <river   @clickrow="clickrow"  ref="river"/>
          </keep-alive>
        </el-tab-pane>
        <el-tab-pane name="HP">
          <span slot="label"><i class="el-icon-date"></i> 山塘、湖库</span>
          <keep-alive>
            <lake />
          </keep-alive>
        </el-tab-pane>
        <el-tab-pane name="ZRD">
          <span slot="label"><i class="el-icon-date"></i> 责任段</span>
          <keep-alive>
            <dutypart />
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
  name: "rivermap",
  components: { Pagination, RmMap, river, lake, dutypart },
  data() {
    return {
      activeName: "HL",
      loading: true,
      tableLoading: false,
      checked: false,
      dataArray: [],
      map:null,
      hpdataarray: [],
      river:null,
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
    loadHpTree() {
      hptree().then((res) => {
        console.log("左边树22", res)
        const data = res.data.list
        this.hpdataarray = data
        this.loading = false
      }).catch((errorRes) => {
        this.loading = false
      })
    },
    handleClick(tab) {

    },
    handleNodeClick() {
      // console.log("tab:::",tab);
    },
    clickrow(data){
      console.log("子页面传递过来的参数值:::",data);
    },
    clicktest(){ 
        this.$refs.river.testclick()
    },
    centerView() {
        this.map.centerView([113.88, 27.67],16)
    },
    drawRiverLine(id,name) {
               // var id = '001'
               var self = this
                var callback = function(type,data) {
                    console.log('回调：',type,data)
                    if (type === 'change') {
                    self.lineLength = data.remarks
                    self.wkt = data.wkt
                    }
                }
                
                this.map.drawLine({ id: id,name: name },callback)
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
<style>
.title {
  padding: 0 80px 0 20px;
  height: 42px;
  line-height: 42px;
  border-bottom: 1px solid #eee;
  font-size: 14px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  background-color: #f8f8f8;
  border-radius: 2px 2px 0 0;
}

.el-dialog__body {
  padding-top: 10px;
}
</style>