/*
 * @Author: 刘小康 
 * @Date: 2018-12-27 09:45:50 
 * @Last Modified by: 刘小康
 * @Last Modified time: 2018-12-28 11:17:30
 */
<template>
  <div class="panel" :style="{ minHeight: 'calc(' + panelMinHeight + 'vh - 126px)' }">
    <div class="panelHeading">
      <div>
        <svg-icon icon-class="tree" />{{titleName}}
      </div>
      <div class="btn-group" v-show="isShowTabbar">
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
    <div class="source panel-body" :style="{ height: 'calc(' + panelbodyHeight + 'vh - 165px)' }">
      <el-tree
        :data="dataArray"
        :props="defaultProps"
        @node-click="handleNodeClick"
        empty-text="暂无数据"
        highlight-current
        node-key="id"
        ref="tree"
        :show-checkbox="showCheckbox"
        @check="checkBoxClick"
      ></el-tree>
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
    },
    isShowTabbar: {
      type: Boolean,
      required: true
    },
    showCheckbox: {
      type: Boolean,
      required: false,
      default: false
    },
    panelMinHeight: {
      type: Number,
      required: false,
      default: 100
    },
    panelbodyHeight: {
      type: Number,
      required: false,
      default: 100
    }
  },
  mounted(){
    this.$emit("input",this.$refs.tree)
  },
  methods: {
    getMsg() {
      this.$emit("getMsgs", this.msg)
    },
    refreshBtn() {
      this.$emit('refresh')
    },
    addBtn() {
      this.$emit('add')
    },
    deleteBtn() {
      this.$emit('delete')
    },
    handleNodeClick(data) {
      this.$emit('areaData', data)
    },
    checkBoxClick(a, b) {
      this.$emit('checkBoxBtn', a, b)
    }
  }
}
</script>
<style lang="scss" scoped>
.panel {
  margin-bottom: 0;
  /*min-height: 86vh;*/
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
    padding: 10px;
  }
  .panel-body {
    overflow: auto;
    /*height: calc(86vh - 41px);*/
  }
    /*滚动条样式*/
  .panel-body::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 4px;
    /*高宽分别对应横竖滚动条的尺寸*/
    height: 4px;
  }
  .panel-body::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: rgba(0, 0, 0, 0.2);
  }
  .panel-body::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 0;
    background: rgba(0, 0, 0, 0.1);
  }
}
</style>

