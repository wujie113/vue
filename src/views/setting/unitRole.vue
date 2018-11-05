/*
 * @Author: 刘小康 
 * @Date: 2018-11-05 11:57:16 
 * @Last Modified by: 刘小康
 * @Last Modified time: 2018-11-05 18:36:12
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
          不要了
        </div>
        <!-- <left-tree @getMsgs="getWay" :message="parentMsg" /> -->
      </el-col>
    </el-row>
    <!-- 单位编辑弹窗 -->
    <el-dialog :visible.sync="unitEditDialog" width="30%" title="编辑">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" status-icon>
        <el-form-item prop="area" label="所属区划">
          {{ form.area }}
        </el-form-item>
        <el-form-item prop="depName" label="所属部门" required>
          <el-select v-model="form.depName" placeholder="请选择部门" clearable class="filter-item">
            <el-option v-for="item in departments" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item prop="name" label="名 称" required>
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item prop="sex" label="部门类型">
          <el-select v-model="form.depType" placeholder="请选择性别" clearable class="filter-item">
            <!-- <el-option v-for="item in typeOptions" :key="item.key" :label="item.label" :value="item.key" /> -->
            <el-option label="男" value="male"></el-option>
            <el-option label="女" value="female"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="sort" label="排序" required>
          <el-input type="number" v-model="form.sort" />
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input type="textarea" v-model="form.desc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="unitEditDialog = false">取 消</el-button>
        <el-button @click="unitEditSave" type="primary">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { AreaTree, getDepList, getDepUser, deleteDep } from '@/api/setting/unitRole'
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
      form: {
        area: "",
        depName: "",
        name: "",
        depType: "",
        sort: "",
        desc: ""
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
          "area.id": this.unitObj.parentId
        }
        getDepList(params).then((res) => {
          this.tableData = res.data.list
        }).catch((errorRes) => {
          this.loading = false
        })

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
        "area.id": data.parentId
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
    // 点击 单位 编辑按钮
    unitEdit() {
      this.unitEditDialog = true
    },
    unitEditSave() {

    },
    // 全选,单选
    handleSelectionChange1(val) {
      if (val.length > 0) {
        let ids = [], idsStr = ""
        val.map(item => {
          let id = item.id
          ids.push(item.id)
          console.log('ids', ids)
        })
        idsStr = ids.join()
        this.deleteDepIDs = idsStr
      }
    },
    // 删除部门
    deleteBtn() {
      this.$confirm("确认删除当前部门?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let params = {
          ids: this.deleteDepIDs
        }
        deleteDep(params).then((res) => {
          this.$message({
            type: "success",
            message: "删除成功!"
          })
          this.loading = true
          let params = {
            "area.id": this.unitObj.parentId
          }
          getDepList(params).then((res) => {
            this.loading = false
            this.tableData = res.data.list
          }).catch((errorRes) => {
            this.loading = false
            this.$message({
              type: "error",
              message: "网络错误!"
            })
          })
        }).catch((errorRes) => {
          this.loading = false
          this.$message({
            type: "error",
            message: "网络错误!"
          })
        })
      }).catch(() => {
        // 用户取消删除
      })

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

