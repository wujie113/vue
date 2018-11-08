<template>
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
  <el-tab-pane label="排污口" name="10">
      <keep-alive>
        <sewage v-if="activeName==10"/>
      </keep-alive>
  </el-tab-pane>
</el-tabs>
</template>

<script>  
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
export default {
  name: 'Tab',
  components: { sluice ,cradle,reservoir,wells,agricultural,waterSubstation,intake,riverWall,pump,sewage},
  data() {
    return {
      activeName: '1',
      createdTimes: 0
    }
  },
  methods: {
    showCreatedTimes() {
      this.createdTimes = this.createdTimes + 1
    },
    clickNew2(){

    }
  }
}
</script>

<style scoped>
  .tab-container{
    margin: 30px;
  }
</style>
