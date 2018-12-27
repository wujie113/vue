/*
 * @Author: 刘小康 
 * @Date: 2018-12-26 10:18:46 
 * @Last Modified by: 刘小康
 * @Last Modified time: 2018-12-26 10:24:25
 */
// 打卡报表
<template>
  <div class="app-container">
    <h1>打卡报表</h1>
  </div>
</template>
<script>
export default {
  name: 'OrderStatistics',
  data () {
    return {
      
    }
  },
  methods: {
    
  },
}
</script>
<style lang="scss" scoped>
.app-container {
  /deep/ .el-tabs__header {
    margin: 0 0 0px;
  }
  .filter-container {
    span {
      color: #636363;
      font-size: 12px;
    }
  }
  > .el-container {
    min-height: 86vh;
    > .el-container {
      // 兼容IE浏览器
      min-height: 86vh;
    }
  }
}
</style>

