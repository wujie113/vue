/*
 * @Author: 刘小康 
 * @Date: 2018-11-05 11:57:16 
 * @Last Modified by: 刘小康
 * @Last Modified time: 2018-11-05 16:20:31
 */
<template>
  <div class="app-container">
    <el-row :gutter="20" v-loading="loading">
      <el-col :xs="8" :sm="8" :md="8" :lg="6" :xl="6">
        <left-tree titleName="行政区域" :dataArray="dataArray" @areaData="selectNode" :isShowTabbar="isShowTabbar" />
      </el-col>
      <el-col :xs="8" :sm="8" :md="8" :lg="9" :xl="9">
        <div class="panel">
          <div class="panelHeading">
            <div>
              <svg-icon icon-class="server" />单位机构 - {{ unitObj.label }}
            </div>
          </div>
          <div class="source panel-body">
            <div class="filter-container">
              <el-button class="filter-item" type="primary" icon="el-icon-circle-plus-outline" @click="addUnitBtn" size="mini">添加单位</el-button>
              <el-button class="filter-item" type="info" icon="el-icon-delete" @click="deleteBtn" size="mini">删除</el-button>
            </div>
            <el-table :data="tableData" stripe style="width: 100%" @selection-change="handleSelectionChange1" border>
              <el-table-column type="selection" align="center">
              </el-table-column>
              <el-table-column prop="name" label="名称" align="center">
              </el-table-column>
              <el-table-column prop="area" label="备注" align="center">
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button @click="unitEdit(scope.$index, scope.row)" type="text" title="编辑">
                    <svg-icon icon-class="editColor" />
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-col>
      <el-col :xs="8" :sm="8" :md="8" :lg="9" :xl="9">
        <div class="panel">
          <div class="panelHeading">
            <div>
              <svg-icon icon-class="server" />部门角色-萍乡市河长办
            </div>
          </div>
          <div class="source panel-body">
            <div class="filter-container">
              <el-button class="filter-item" type="primary" icon="el-icon-circle-plus-outline" @click="addRoleBtn" size="mini">添加角色</el-button>
              <el-button class="filter-item" type="info" icon="el-icon-delete" @click="deleteBtn" size="mini">删除</el-button>
            </div>
            <el-table :data="tableData" stripe style="width: 100%" @selection-change="handleSelectionChange2" border>
              <el-table-column type="selection" align="center">
              </el-table-column>
              <el-table-column prop="date" label="角色名称" align="center">
              </el-table-column>
              <el-table-column prop="name" label="描述" align="center">
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button @click="roleEdit(scope.$index, scope.row)" type="text" title="编辑">
                    <svg-icon icon-class="editColor" />
                  </el-button>
                  <el-button @click="authBtn(scope.$index, scope.row)" type="text" title="授权">
                    <svg-icon icon-class="authorizationColor" />
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <!-- <left-tree @getMsgs="getWay" :message="parentMsg" /> -->
      </el-col>
    </el-row>
    <!-- 单位编辑弹窗 -->
    <el-dialog :visible.sync="unitEditDialog" width="30%" title="编辑">
      单位编辑弹窗
      <div slot="footer" class="dialog-footer">
        <el-button @click="unitEditDialog = false">取 消</el-button>
        <el-button @click="unitEditSave" type="primary">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 角色编辑弹窗 -->
    <el-dialog :visible.sync="roleEditDialog" width="30%" title="编辑">
      角色编辑弹窗
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleEditDialog = false">取 消</el-button>
        <el-button @click="roleEditSave" type="primary">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 授权弹窗 -->
    <el-dialog :visible.sync="authDialog" width="30%" title="菜单授权">
      2授权弹窗22
      <div slot="footer" class="dialog-footer">
        <el-button @click="authDialog = false">取 消</el-button>
        <el-button @click="authSave" type="primary">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { AreaTree, getDepList, getDepUser } from '@/api/setting/unitRole'
import LeftTree from './components/leftTree'
import Pagination from '@/components/Pagination'

export default {
  components: { LeftTree, Pagination },
  data() {
    return {
      parentMsg: "hello,child",
      dataArray: [],
      selectNodeData: {},
      // defaultData: [],
      loading: true,
      isShowTabbar: false,
      unitEditDialog: false,
      roleEditDialog: false,
      authDialog: false,
      unitObj: {

      },
      tableData: []
    }
  },
  created() {
    this.AreaTreeFun()
  },
  methods: {
    AreaTreeFun() {
      AreaTree().then(res => {
        this.loading = false

        this.dataArray = res.data.list
        // this.defaultData = res.data.list[0]
        this.unitObj = res.data.list[0]
        let params = {
          "area.id": this.unitObj.id
        }
        getDepList(params).then((res) => {
          console.log("部门列表", res)
          this.tableData = res.data.list
          // getDepUser(params).then(res => {
          //   console.log(res)
          // }).catch(errorRes => { })
        }).catch((errorRes) => {
          this.loading = false
        })

        // this.firstNode = res.data.list[0].label
        // this.ruleForm.name = res.data.list[0].label
        // this.ruleForm.sort = res.data.list[0].sort
        // this.nodeData = res.data.list[0]
      }).catch(errorRes => {
        this.loading = false

        this.$message({
          type: "error",
          message: "网络错误!"
        })
      })
    },
    getWay(msg) {
      console.log(msg)
    },
    selectNode(data) {
      console.log('父组件data', data)
      this.selectNodeData = data
      let params = {
        "area.id": data.id
      }
      this.loading = true
      getDepList(params).then((res) => {
        this.loading = false

        console.log("部门列表", res)
        this.tableData = res.data.list
        // getDepUser(params).then(res => {
        //   console.log(res)
        // }).catch(errorRes => { })
      }).catch((errorRes) => {
        this.loading = false
      })
    },
    // 添加单位
    addUnitBtn() {

    },
    // 添加角色
    addRoleBtn() {

    },
    // 点击 单位 编辑按钮
    unitEdit() {
      this.unitEditDialog = true
    },
    // 点击 角色 编辑按钮
    roleEdit() {
      this.roleEditDialog = true
    },
    // 点击 授权 按钮
    authBtn() {
      this.authDialog = true
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

