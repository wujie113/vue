<template>
  <div class="app-container">
    
    <el-row :gutter="10">
      <el-col :xs="9" :sm="9" :md="9" :lg="9" :xl="9">
        <div class="grid-content bg-purple">
          <div class="topTitle">
            <div class="left">
              <img src="" alt="图标">
              <span>巡和专管员优秀榜</span>
            </div>
            <div class="right">
              <span>本月专管员巡河</span>
              <span>|</span>
              <span>本月巡河</span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="9" :sm="9" :md="9" :lg="9" :xl="9">
        <div class="grid-content bg-purple-light">
          入库河流统计
        </div>
      </el-col>
      <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
        <div class="grid-content bg-purple">
          工单处理统计
        </div>
      </el-col>
    </el-row>
    <!-- <component :is="currentRole"/> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'

export default {
  name: 'Dashboard',
  components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    if (!this.roles.includes('admin')) {
      this.currentRole = 'editorDashboard'
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .topTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    background-color: #4282fe;
    color: #fff;
    .left {
      img {
        width: 10px;
        height: 10px;;
      }
    }
    .right {

    }
  }
</style>
