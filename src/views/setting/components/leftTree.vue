<template>
  <div class="panel">
    <div class="panelHeading">
      <div>
        <svg-icon icon-class="tree" />{{titleName}}
      </div>
      <div class="btn-group">
        <button class="btn mini" @click="refreshBtn">
          <i class="el-icon-refresh"></i>
        </button>
        <button class="btn mini" @click="addBtn">
          <i class="el-icon-circle-plus"></i>
        </button>
        <button class="btn mini" @click="deleteBtn">
          <i class="el-icon-delete"></i>
        </button>
      </div>
    </div>
    <div class="source panel-body">
      <el-tree :data="dataArray" :props="defaultProps" @node-click="handleNodeClick" empty-text="暂无数据" highlight-current></el-tree>
    </div>
  </div>
  <!-- <div>
    <h1>子组件---部门维护--单位角色</h1>
    <p>{{message}}</p>
    <button @click="getMsg">按钮</button>
  </div> -->
</template>
<script>
export default {
  name: "LeftTree",
  data() {
    return {
      text: "我是子组件向父组件传递参数",
      msg: {
        number: 60,
        content: "这是从子组件中传递过来的对象"
      },
      defaultProps: {
        children: "children",
        label: "label"
      },
    }
  },
  props: {
    // message: {
    //   type: String,
    //   required: true
    // },
    titleName: {
      type: String,
      required: true
    },
    dataArray: {
      type: Array,
      required: true
    }
  },

  methods: {
    getMsg() {
      this.$emit("getMsgs", this.msg)
    },
    refreshBtn() {

    },
    addBtn() {

    },
    deleteBtn() {

    },
    handleNodeClick(data) {
      this.$emit('areaData', data)
    }
  }
}
</script>
<style lang="scss" scoped>
.panel {
  margin-bottom: 0;
  min-height: 86vh;
  overflow: auto;
  background-color: #fff;
  border: 1px solid transparent;
  border-color: #ddd;
  border-radius: 4px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  .panelHeading {
    color: #333;
    background-color: #f5f5f5;
    border-color: #ddd;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 39px;
    padding: 8px 15px;
    border-bottom: 1px solid transparent;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
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
</style>

