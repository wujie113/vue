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
        <reservoir v-if="activeName==3"  />
  </el-tab-pane>
  <el-tab-pane label="水井" name="4"> 
        <wells v-if="activeName==4"  />
  </el-tab-pane>
  
</el-tabs>
</template>

<script>  
import sluice from '../res/sluice.vue'  //水闸
import cradle from '../res/cradle.vue' //水源地
import reservoir from '../res/reservoir.vue' //水库
import wells from '../res/wells.vue' //水库 
export default {
  name: 'Tab',
  components: { sluice ,cradle,reservoir,wells},
  data() {
    return {
      tabMapOptions: [
        { label: '水闸', key: 'sz' },
        { label: '水源地', key: 'US' },
        { label: '水库', key: 'JP' },
        { label: '水井', key: 'EU' }
      ],
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
