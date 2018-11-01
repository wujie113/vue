<template>
  <div class="app-container">
    <div class="widget-all-system-body">
      <el-row :gutter="20">
        <el-col :xs="12" :sm="12" :md="10" :lg="8" :xl="6">
          <div class="grid-content bg-purple-light panel">
            <div class="panelHeading">
              <div>
                单位
              </div>
              <div>
                <el-checkbox v-model="checked">仅显示所选单位用户</el-checkbox>
              </div>
            </div>
            <div class="source panel-body">
              <el-tree :data="dataArray" :props="defaultProps" @node-click="handleNodeClick" empty-text="暂无数据" highlight-current></el-tree>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :md="14" :lg="16" :xl="18">
          1111
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      checked: true
    }
  },
  created() {

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.widget-all-system-body {
  .panel {
    margin-bottom: 0;
    height: 86vh;
    overflow: auto;
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
      padding: 24px;
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
