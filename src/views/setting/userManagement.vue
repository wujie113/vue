/*
 * @Author: 刘小康 
 * @Date: 2018-12-27 09:43:20 
 * @Last Modified by:   刘小康 
 * @Last Modified time: 2018-12-27 09:43:20 
 */
//  用户管理
<template>
  <div class="app-container userM">
    <el-container v-loading="loading">
      <el-aside>
        <!-- <div class="panel">
          <div class="panelHeading">
            <div>单位</div>
            <div>
              <el-checkbox v-model="checked" @change="onlyShowSelectBtn">仅显示所选单位用户</el-checkbox>
            </div>
          </div>
          <div class="source panel-body">
            <el-tree :data="dataArray" :props="defaultProps" @node-click="handleNodeClick" empty-text="暂无数据" highlight-current></el-tree>
          </div>
        </div> -->
        <left-tree titleName="单位" :dataArray="dataArray" @areaData="handleNodeClick" :isShowTabbar="isShowTabbar" />
      </el-aside>
      <el-container>
        <el-header height="125px">
          <div style="" class="topTitle">
            用户列表
          </div>
          <div class="filter-container" style="">
            <el-input placeholder="输入姓名、帐号或电话搜索..." style="width: 210px;" class="filter-item" @keyup.enter.native="searchBtn" v-model="listQuery.name" />
            状态：
            <el-select placeholder="请选择状态" clearable style="width: 140px" class="filter-item" v-model="listQuery.state">
              <el-option v-for="item in states" :key="item" :label="item" :value="item" />
            </el-select>
            <!-- 角色：
            <el-select placeholder="请选择角色" clearable style="width: 140px" class="filter-item" v-model="listQuery.role">
              <el-option v-for="item in roles" :key="item" :label="item" :value="item" />
            </el-select> -->
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchBtn">查询</el-button>
          </div>
        </el-header>
        <el-main>
          <div class="filter-container" style="padding-top: 0;">
            <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="addBtn">新增用户</el-button>
            <el-button class="filter-item" type="info" icon="el-icon-delete" @click="deleteBtn">删除</el-button>
          </div>
          <div>
            <el-table ref="multipleTable" border stripe :data="tableData3" tooltip-effect="dark" @selection-change="handleSelectionChange" v-loading="tableLoading">
              <el-table-column type="selection" width="55" align="center">
              </el-table-column>
              <el-table-column type="index" width="50" align="center" label="序号">
              </el-table-column>
              <el-table-column prop="loginName" label="账号" width="120" align="center">
              </el-table-column>
              <el-table-column prop="name" label="姓名" width="120" align="center">
              </el-table-column>
              <el-table-column prop="mobile" label="联系号码" width="120" align="center">
              </el-table-column>
              <el-table-column prop="dept.name" label="部门" width="120" show-overflow-tooltip align="center">
              </el-table-column>
              <el-table-column prop="postStateLabel" label="状态" align="center">
              </el-table-column>
              <el-table-column label="操作" align="center" width="150px">
                <template slot-scope="scope">
                  <el-button @click="handleEdit(scope.$index, scope.row)" type="text" title="编辑">
                    <svg-icon icon-class="editColor" />
                  </el-button>
                  <el-button type="text" @click="ModifyPassword(scope.$index, scope.row)" title="修改密码">
                    <svg-icon icon-class="password1" />
                  </el-button>
                  <el-button @click="handleStart(scope.$index, scope.row)" type="text" :title="scope.row.state == '1' ? '启用' : '停用'">
                    <svg-icon :icon-class="scope.row.state == '1' ? 'remove1' : 'remove'" />
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />
          </div>
        </el-main>

      </el-container>
    </el-container>
    <!-- 新增用户弹窗 -->
    <el-dialog :visible.sync="dialogVisible" width="40%" title="添加用户" top="5vh" :modal-append-to-body="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" status-icon>
        <el-form-item label="单位">
          {{ unit }}
        </el-form-item>
        <el-form-item prop="post" label="岗位" required>
          <!-- <rm-area-select v-model="form.dept" /> -->
          <el-select v-model="form.post" placeholder="请选择">
            <el-option v-for="item in postArray" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="loginName" label="账号" required>
          <el-input v-model="form.loginName" />
        </el-form-item>
        <el-form-item prop="name" label="姓名" required>
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item prop="password" label="密码" required>
          <el-input type="password" v-model="form.password" />
        </el-form-item>
        <el-form-item prop="checkPass" label="确认密码" required>
          <el-input type="password" v-model="form.checkPass" />
        </el-form-item>
        <el-form-item prop="sort" label="排序" required>
          <el-input type="number" v-model="form.sort" />
        </el-form-item>
        <el-form-item prop="mobile" label="手机号码" required>
          <el-input type="text" v-model="form.mobile" />
        </el-form-item>
        <el-form-item prop="gender" label="性别">
          <el-select v-model="form.gender" placeholder="请选择性别" clearable class="filter-item">
            <!-- <el-option v-for="item in typeOptions" :key="item.key" :label="item.label" :value="item.key" /> -->
            <el-option label="男" value="M"></el-option>
            <el-option label="女" value="F"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="state" label="状态" required>
          <el-select v-model="form.state" placeholder="请选择状态" clearable class="filter-item">
            <!-- <el-option v-for="item in typeOptions" :key="item.key" :label="item.label" :value="item.key" /> -->
            <el-option label="正常" value="0"></el-option>
            <el-option label="停用" value="1"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item prop="post" label="职位">
          <el-input v-model="form.post" />
        </el-form-item> -->
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="form.email" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button @click="save" type="primary">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑弹窗 -->
    <el-dialog :visible.sync="dialogVisible1" width="40%" title="用户详情" top="5vh" :modal-append-to-body="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" status-icon>
        <el-form-item label="单位">
          {{ unit }}
          <!-- <el-input type="text" v-model="form.unit" disabled="disabled" /> -->
        </el-form-item>
        <el-form-item prop="post" label="岗位" required>
          <!-- <rm-area-select v-model="form.dept" /> -->
          <el-select v-model="form.post" placeholder="请选择">
            <el-option v-for="item in postArray" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="loginName" label="账号" required>
          <el-input v-model="form.loginName" />
        </el-form-item>
        <el-form-item prop="name" label="姓名" required>
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item prop="sort" label="排序" required>
          <el-input type="number" v-model="form.sort" />
        </el-form-item>
        <el-form-item prop="mobile" label="手机号码" required>
          <el-input type="text" v-model="form.mobile" />
        </el-form-item>
        <el-form-item prop="gender" label="性别">
          <el-select v-model="form.gender" placeholder="请选择性别" clearable class="filter-item">
            <!-- <el-option v-for="item in typeOptions" :key="item.key" :label="item.label" :value="item.key" /> -->
            <el-option label="男" value="M"></el-option>
            <el-option label="女" value="F"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="state" label="状态">
          <el-select v-model="form.state" placeholder="请选择状态" clearable class="filter-item">
            <!-- <el-option v-for="item in typeOptions" :key="item.key" :label="item.label" :value="item.key" /> -->
            <el-option label="正常" value="0"></el-option>
            <el-option label="停用" value="1"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item prop="post" label="职位">
          <el-input v-model="form.post" />
        </el-form-item> -->
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="form.email" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
        <el-button @click="save" type="primary">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改密码弹窗 -->
    <el-dialog :visible.sync="dialogVisible2" width="40%" title="修改密码" top="5vh" :modal-append-to-body="false">
      <el-form :model="form2" :rules="rules2" ref="form2" label-width="80px" status-icon>
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input type="text" v-model="form2.oldPassword" auto-complete="off" placeholder="请输入旧的密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" v-model="form2.newPassword" auto-complete="off" placeholder="请输入新的密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="form2.checkPass" auto-complete="off" placeholder="请确认密码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button @click="savePass" type="primary">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { tree, tableList, Delete, save, modifyPwd, modifyState, getPostState } from '@/api/setting/userMangement'
import Pagination from '@/components/Pagination'
import RmDict from '@/components/rm/dict'
import RmOrgSelect from "@/components/rm/orgselect"
import RmUserSelect from "@/components/rm/userselect"
import RmAreaSelect from "@/components/rm/areaselect"
import LeftTree from './components/leftTree'

export default {
  name: 'UserManagement',
  components: { Pagination, RmDict, RmOrgSelect, RmUserSelect, RmAreaSelect, LeftTree },
  data() {
    // 自定义校验规则
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.form.checkPass !== '') {
          this.$refs.form.validateField('checkPass')
        }
        callback()
      }
      if (value) {
        if (value.lemgth < 6) {
          callback(new Error('密码小于6个字符'))
        }
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    var validatePass3 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form2.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      isShowTabbar: false,
      postArray: [],
      loading: true,
      tableLoading: false,
      checked: false,
      dataArray: [],
      dialogVisible: false,
      dialogVisible1: false,
      dialogVisible2: false,
      defaultProps: {
        children: "children",
        label: "label"
      },
      listQuery: {
        name: "",
        state: "",
        role: "",
        pageNo: 1,
        pageSize: 10,
        // id: ""
      },
      unit: "",
      "company.id": "",
      form: {
        // office: null,
        dept: null,
        loginName: null,
        name: null,
        password: null,
        checkPass: "",
        sort: null,
        mobile: null,
        gender: null,
        state: null,
        post: null,
        email: null,
        id: null
      },
      rules: {
        post: [{ required: true, message: "请选择岗位", trigger: "change" }],
        loginName: [{ required: true, message: "请填写登录账号", trigger: "blur" }],
        name: [
          { required: true, message: "请填写您的姓名", trigger: "blur" },
          { min: 2, max: 4, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { validator: validatePass, trigger: "blur" }
          // { min: 6, message: "密码长度必须大于6字符", trigger: "blur" }
        ],
        checkPass: [
          { validator: validatePass2, trigger: "blur" }
          // { min: 6, message: "密码长度必须大于6字符", trigger: "blur" }
        ],
        sort: [{ required: true, message: "序号是必填的", trigger: "change" }],
        mobile: [{ required: true, message: "请填写手机号码", trigger: "change" }],
        state: [{ required: true, message: '请选择状态', trigger: "change" }]
      },
      form2: {
        oldPassword: "",
        newPassword: "",
        checkPass: ""
      },
      rules2: {
        newPassword: [
          { validator: validatePass, trigger: "blur" }
        ],
        checkPass: [
          { validator: validatePass3, trigger: "blur" }
        ]
      },
      total: 0,
      states: ["正常", "停用"],
      roles: ["巡河长", "张三", "李四", "王五", "赵六"],
      // departments: ["总河长", "管理员", "科长"],
      tableData3: [],
      multipleSelection: []
    }
  },
  created() {
    this.loadLeftTree()
  },
  methods: {
    loadLeftTree() {
      tree().then((res) => {
        const data = res.data.list
        this.dataArray = data
        // 第一次默认
        this.listQuery['office.id'] = data[0].id
        this.unit = data[0].label
        this.deptObj = {
          id: data[0].id
        }
        this.getList()
        this.loading = false
      }).catch((errorRes) => {
        this.loading = false
      })
    },
    onlyShowSelectBtn(v) {
      console.log("只显示所属单位", v)
    },
    handleNodeClick(data) {
      console.log("节点信息", data)
      //选择的是哪个单位
      this.unit = data.label
      console.log('this.form.unit', this.unit)

      this.listQuery['office.id'] = data.id
      const deptObj = {
        id: data.id
      }
      this.deptObj = deptObj
      this.getList()
    },
    // 表单编辑
    handleEdit(index, row) {
      // if (this.$refs.form != undefined) {
      //   this.$refs.form.resetFields()
      // }
      // Object.assign(this.form, row)
      // 查询岗位----对应的是弹窗里面的部门
      getPostState({ id: this.listQuery['office.id'] }).then(res => {
        this.postArray = res.data.list
      }).catch(errorRes => {

      })
      this.form = row
      this.dialogVisible1 = true
      console.log('表单编辑', row)
      // this.form2 = row
    },
    // 修改密码
    ModifyPassword(index, row) {
      console.log(index, row)
      if (this.$refs.form2 != undefined) {
        this.$refs.form2.resetFields()
        // Object.assign(this.form, this.$options.data().form)
      }
      this.dialogVisible2 = true
    },
    // 修改密码保存
    savePass() {
      modifyPwd(this.form2).then(res => {
        this.dialogVisible2 = false
        this.$message({
          type: "success",
          message: "成功修改密码!"
        })
      }).catch(errorRes => {
        this.dialogVisible2 = false
      })
    },
    // 停用启用
    handleStart(index, row) {
      const params = {
        id: row.id
      }
      if (row.state == '1') {
        params.state = 0
      } else if (row.state == '0') {
        params.state = 1
      }
      modifyState(params).then(res => {
        this.$message({
          type: "success",
          message: "修改成功!"
        })
        this.getList()
      }).catch(errorRes => {

      })
    },
    getList() {
      this.tableLoading = true
      tableList(this.listQuery).then((res) => {
        console.log('表单列表', res)
        this.tableData3 = res.data.list
        this.total = res.data.count
        this.tableLoading = false
      }).catch(errorRes => {
        this.tableLoading = false
      })
    },
    searchBtn() {
      console.log("这是查询啊")
      this.listQuery.pageNo = 1
      this.getList()
    },
    addBtn() {
      getPostState({ id: this.listQuery['office.id'] }).then(res => {
        this.postArray = res.data.list
      }).catch(errorRes => {

      })
      console.log('添加的---之前', this.unit)

      this.dialogVisible = true
      if (this.$refs.form != undefined) {
        // this.$refs.form.resetFields()
        // Object.assign(this.form, this.$options.data().form)
        Object.assign(this.form, this.$options.data().form)
      }
      this.form.dept = this.deptObj
      console.log('添加的---', this.unit)
    },
    deleteBtn() {
      if (this.multipleSelection.length > 0) {
        const idArray = []
        this.multipleSelection.map(item => {
          idArray.push(item.id)
        })
        const idStr = idArray.join()
        console.log('idStr', idStr)
        this.$confirm("确认删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          Delete(idStr).then(res => {
            this.AreaTree()
            this.$message({
              type: "success",
              message: "删除成功!"
            })
          }).catch(errorRes => {

          })
        }).catch(() => {
          // 用户点击取消按钮
        })
      } else {
        this.$message({
          type: "warn",
          message: "请先勾选!"
        })
      }
    },
    // 新增用户  保存
    save(e) {
      this.dialogVisible = false
      console.log(this.form)
      const params = {
        "company.id": 'system',
        "office.id": this.form.dept.id
      }
      // let data = Object.assign(params, this.form)
      // 登录账号
      if (this.form.loginName) {
        params.loginName = this.form.loginName
      }
      // 用户姓名
      if (this.form.name) {
        params.name = this.form.name
      }
      if (this.form.email) {
        params.email = this.form.email
      }
      // 性别
      if (this.form.gender) {
        params.gender = this.form.gender
      }
      if (this.form.id) {
        params.id = this.form.id
      }
      // 手机号
      if (this.form.mobile) {
        params.mobile = this.form.mobile
      }
      // 岗位
      if (this.form.post) {
        params.post = this.form.post
      }
      // 状态
      if (this.form.state) {
        params.state = this.form.state
      }
      console.log('编辑新增的params', params)
      save(params).then(res => {
        this.getList()
        this.dialogVisible1 = false
      }).catch(errorRes => {
        this.dialogVisible1 = false
      })
    },

    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style lang="scss" scoped>
.el-button .svg-icon {
  width: 1.2rem;
  height: 1.2rem;
}
.cell .el-button--text:first-of-type .svg-icon {
  fill: #4ecc89;
}
// .cell .el-button--text:nth-of-type(3) .svg-icon {
//   fill: #f25c5c;
// }

.app-container {
  .panel {
    margin-bottom: 0;
    min-height: 86vh;
    overflow: auto;
    height: 100%;
    margin-bottom: 0;
    min-height: 86vh;
    overflow: auto;
    height: 100%;
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
}
</style>
<style scoped>
.userM >>> .el-table--medium td {
  padding: 3px 0 !important;
}
.userM >>> .el-dialog__body {
  max-height: 500px;
}
</style>

