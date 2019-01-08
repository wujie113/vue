<template>
  <div class="resourceMange">
    <el-container>
   <rm-map v-model="map" />
      <!-- 最大化按钮 -->
      <div  class="el-mindiv" v-show="!dialogVisible" @click="dialogVisible = !dialogVisible" >
        <div class="layui-layer-title">资源管理</div>
        <span class="layui-layer-setwin"> <i class="el-icon-ali-diejia"></i> </span>
      </div>
    </el-container>

    <el-container>
      <!--弹出窗口-->
      <!-- <el-dialog :visible.sync="dialogVisible" width="90%" :before-close="beforeClose()" :append-to-body="false" :close-on-click-modal="false" :modal="false" :modal-append-to-body="false" title="资源管理" top="2vh"> -->
      <Layer
        title="资源管理"
        v-model="dialogVisible"
        :dialog="false"
        class="layer-1"
        :animation="2"
        :maskLayer="false"
        :shade="false"
         width="5000"
        height="680"
      >
        <span
          slot="title"
          class="dialog-title-rm"
        >
          <span>资源管理</span>
          <span @click="digLogMiniBtn">
            <i class="el-icon-minus"></i>
          </span>
        </span>
        <el-tabs
          v-model="activeName"
          type="border-card"
        >
          <el-tab-pane
            label="水闸"
            name="1"
          >
            <keep-alive>
              <sluice v-if="activeName==1" @clickRow="clickRow" />
            </keep-alive>
          </el-tab-pane>
          <el-tab-pane
            label="水源地"
            name="2"
          >
            <keep-alive>
              <cradle v-if="activeName==2"  @clickRow="clickRow"  />
            </keep-alive>
          </el-tab-pane>
          <el-tab-pane
            label="水库"
            name="3"
          >
            <keep-alive>
              <reservoir v-if="activeName==3" @clickRow="clickRow"  />
            </keep-alive>
          </el-tab-pane>
          <el-tab-pane
            label="水井"
            name="4"
          >
            <keep-alive>
              <wells v-if="activeName==4" @clickRow="clickRow"  />
            </keep-alive>
          </el-tab-pane>
          <el-tab-pane
            label="农饮工程"
            name="5"
          >
            <keep-alive>
              <agricultural v-if="activeName==5" @clickRow="clickRow"  />
            </keep-alive>
          </el-tab-pane>
          <el-tab-pane
            label="水电站"
            name="6"
          >
            <keep-alive>
              <waterSubstation v-if="activeName==6" @clickRow="clickRow"  />
            </keep-alive>
          </el-tab-pane>
          <el-tab-pane
            label="取水口"
            name="7"
          >
            <keep-alive>
              <intake v-if="activeName==7" @clickRow="clickRow" />
            </keep-alive>
          </el-tab-pane>
          <el-tab-pane
            label="堤防"
            name="8"
          >
            <keep-alive>
              <riverWall v-if="activeName==8" @clickRow="clickRow" />
            </keep-alive>
          </el-tab-pane>
          <el-tab-pane
            label="泵站"
            name="9"
          >
            <keep-alive>
              <pump v-if="activeName==9" @clickRow="clickRow" />
            </keep-alive>
          </el-tab-pane>
          <el-tab-pane
            label="排污口"
            name="10"
          >
            <keep-alive>
              <sewage v-if="activeName==10" @clickRow="clickRow" />
            </keep-alive>
          </el-tab-pane>

          <el-tab-pane
            label="公示牌"
            name="11"
          >
            <keep-alive>
              <resBillboard v-if="activeName==11" @clickRow="clickRow" />
            </keep-alive>
          </el-tab-pane>

        </el-tabs>
        <!-- </el-dialog> -->
      </Layer>
    </el-container>
    <!-- <div class="wrap">
      111
      <div class="aaa">
        <div class="box">
          <div class="fatherBox">
            222
            <div class="aaa"></div>
              333
              <div class="box">
                <div class="fatherBox">
                  444
                  <div class="aaa">555</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> -->
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
import sewage from '../res/sewage.vue' //排污口
import resBillboard from'../res/resBillboard.vue' //
export default {
  name: "Restabmap",
  components: { Pagination, RmMap, sluice, cradle, reservoir, wells, agricultural, waterSubstation, intake, riverWall, pump, sewage, resBillboard},
  data() {
    return {
      activeName: "1",
      loading: true,
      map: null,
      tableLoading: false,
      checked: false,
      dataArray: [],
      hpdataarray: [],
      dialogVisible: false,
      digLogMini: false,
      defaultProps: {
        children: "children",
        label: "label"
      }
    }
  },
  created() {
  },
  mounted() {
    this.dialogVisible = true
  },
  methods: {
    digLogMiniBtn() {
      if (this.digLogMini) {
        this.digLogMini = false
        this.dialogVisible = true
        console.log(this.digLogMini, this.dialogVisible)
      } else {
        this.digLogMini = true
        this.dialogVisible = false
        console.log(this.digLogMini, this.dialogVisible)
      }
    }, 
    clickRow(data) {
        //转list 
        this.map.showFeature({ list: [data] })
    },
    handleClick(tab) {

    },
    handleNodeClick() {
      // console.log("tab:::",tab);
    },
    beforeClose() {

    }
  }
}
</script> 
<style lang="scss" scoped>
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
</style>
<style>
/* .leftBox .el-form-item__content {
  float: left;
}
.resourceMange .el-container > .el-dialog__wrapper .el-dialog .el-dialog__body {
  height: 53em;
} */
</style>


