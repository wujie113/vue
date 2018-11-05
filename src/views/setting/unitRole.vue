<template>
  <div class="app-container">
    <el-row :gutter="20" v-loading="loading">
      <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
        <left-tree titleName="行政区域" :dataArray="dataArray" @areaData="selectNode" />

      </el-col>
      <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
        <h2>父元素 部门维护--单位角色</h2>

      </el-col>
      <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
        <h2>父元素 部门维护--单位角色</h2>
        <!-- <left-tree @getMsgs="getWay" :message="parentMsg" /> -->
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { AreaTree } from '@/api/setting/unitRole'
import LeftTree from './components/leftTree'
export default {
  components: { LeftTree },
  data() {
    return {
      parentMsg: "hello,child",
      dataArray: [],
      selectNodeData: {},
      defaultData: [],
      loading: true
    }
  },
  created() {
    this.AreaTreeFun()
  },
  methods: {
    AreaTreeFun() {
      AreaTree().then(res => {
        this.dataArray = res.data.list
        this.defaultData = res.data.list[0]
        this.loading = false
        // this.firstNode = res.data.list[0].label
        // this.ruleForm.name = res.data.list[0].label
        // this.ruleForm.sort = res.data.list[0].sort
        // this.nodeData = res.data.list[0]
      }).catch(errorRes => { })
    },
    getWay(msg) {
      console.log(msg)
    },
    selectNode(data) {
      console.log('父组件data', data)
      this.selectNodeData = data
    }
  }
}
</script>
<style lang="scss" scoped>
</style>

