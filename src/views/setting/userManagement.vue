<template>
  <div class="app-container">
    <el-container v-loading="loading">
      <el-aside>
        <div class="panel">
          <div class="panelHeading">
            <div>
              单位
            </div>
            <div>
              <el-checkbox v-model="checked" @change="onlyShowSelectBtn">仅显示所选单位用户</el-checkbox>
            </div>
          </div>
          <div class="source panel-body">
            <el-tree :data="dataArray" :props="defaultProps" @node-click="handleNodeClick" empty-text="暂无数据" highlight-current></el-tree>
          </div>
        </div>
      </el-aside>
      <el-container>
        <el-header height="125px">
          <div style="" class="topTitle">
            用户列表
          </div>
          <div class="filter-container" style="">
            <el-input placeholder="输入姓名、帐号或角色搜索..." style="width: 210px;" class="filter-item" @keyup.enter.native="handleFilter" v-model="listQuery.search" />
            状态：
            <el-select placeholder="请选择状态" clearable style="width: 140px" class="filter-item" v-model="listQuery.state">
              <el-option v-for="item in states" :key="item" :label="item" :value="item" />
            </el-select>
            角色：
            <el-select placeholder="请选择角色" clearable style="width: 140px" class="filter-item" v-model="listQuery.role">
              <el-option v-for="item in roles" :key="item" :label="item" :value="item" />
            </el-select>

            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchBtn">查询</el-button>

          </div>
        </el-header>
        <!-- <div style="height:2%;width:100%;background-color:#f5f5f5"></div> -->
        <el-main>
          <div class=" filter-container">
            <el-button class="filter-item" type="primary" icon="el-icon-circle-plus-outline" @click="addBtn">新增用户</el-button>
            <el-button class="filter-item" type="info" icon="el-icon-delete" @click="deleteBtn">删除</el-button>
          </div>
          <div>
            <el-table ref="multipleTable" border stripe :data="tableData3" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" v-loading="tableLoading">
              <el-table-column type="selection" width="55" align="center">
              </el-table-column>
              <el-table-column type="index" width="50" align="center" label="序号">
              </el-table-column>
              <el-table-column label="账号" width="120" align="center">
                <template slot-scope="scope">{{ scope.row.date }}</template>
              </el-table-column>
              <el-table-column prop="name" label="联系号码" width="120" align="center">
              </el-table-column>
              <el-table-column prop="address" label="所属区域" align="center">
              </el-table-column>
              <el-table-column prop="address" label="单位" show-overflow-tooltip align="center">
              </el-table-column>
              <el-table-column prop="address" label="状态" align="center">
              </el-table-column>
              <el-table-column prop="address" label="操作" align="center" width="150px">
                <template slot-scope="scope">
                  <el-button @click="handleEdit(scope.$index, scope.row)" type="text" title="编辑">
                    <svg-icon icon-class="editColor" />
                  </el-button>
                  <el-button type="text" @click="ModifyPassword(scope.$index, scope.row)" title="修改密码">
                    <svg-icon icon-class="password1" />
                  </el-button>
                  <el-button @click="handleStart(scope.$index, scope.row)" type="text" :title="scope.row.isStart ? '启用' : '已停用'">
                    <svg-icon :icon-class="scope.row.isStart ? 'remove' : 'remove1'" />
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="tableList" />
          </div>
        </el-main>

      </el-container>
    </el-container>
    <!-- 新增用户弹窗 -->
    <el-dialog :visible.sync="dialogVisible" width="30%" title="添加用户">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" status-icon>
        <el-form-item prop="unit" label="单位">
          <el-input type="text" v-model="form.unit" disabled="disabled" />
        </el-form-item>
        <el-form-item prop="department" label="部门" required>
          <el-select v-model="form.department" placeholder="请选择部门" clearable class="filter-item">
            <el-option v-for="item in departments" :key="item" :label="item" :value="item" />
            <!-- <el-option label="区域一" value="shanghai"></el-option> -->
            <!-- <el-option label="区域二" value="beijing"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item prop="account" label="账号" required>
          <el-input v-model="form.account" />
        </el-form-item>
        <el-form-item prop="username" label="姓名" required>
          <el-input v-model="form.username" />
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
        <el-form-item prop="mobilePhone" label="手机号码" required>
          <el-input type="text" v-model="form.mobilePhone" />
        </el-form-item>
        <el-form-item prop="sex" label="性别">
          <el-select v-model="form.sex" placeholder="请选择性别" clearable class="filter-item">
            <!-- <el-option v-for="item in typeOptions" :key="item.key" :label="item.label" :value="item.key" /> -->
            <el-option label="男" value="male"></el-option>
            <el-option label="女" value="female"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="sex" label="状态">
          <el-select v-model="form.state" placeholder="请选择状态" clearable class="filter-item">
            <!-- <el-option v-for="item in typeOptions" :key="item.key" :label="item.label" :value="item.key" /> -->
            <el-option label="正常" value="start"></el-option>
            <el-option label="停用" value="stop"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="position" label="职位">
          <el-input v-model="form.position" />
        </el-form-item>
        <el-form-item prop="telephone" label="固话">
          <el-input v-model="form.telephone" />
        </el-form-item>
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
    <el-dialog :visible.sync="dialogVisible1" width="30%" title="用户详情">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" status-icon>
        <el-form-item prop="unit" label="单位">
          {{ form.unit }}
          <!-- <el-input type="text" v-model="form.unit" disabled="disabled" /> -->
        </el-form-item>
        <el-form-item prop="department" label="部门" required>
          <el-select v-model="form.department" placeholder="请选择部门" clearable class="filter-item">
            <el-option v-for="item in departments" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item prop="account" label="账号" required>
          <el-input v-model="form.account" />
        </el-form-item>
        <el-form-item prop="username" label="姓名" required>
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item prop="password" label="密码" required>
          <el-input type="password" v-model="form.password" />
        </el-form-item>
        <el-form-item prop="sort" label="排序" required>
          <el-input type="number" v-model="form.sort" />
        </el-form-item>
        <el-form-item prop="mobilePhone" label="手机号码" required>
          <el-input type="text" v-model="form.mobilePhone" />
        </el-form-item>
        <el-form-item prop="sex" label="性别">
          <el-select v-model="form.sex" placeholder="请选择性别" clearable class="filter-item">
            <!-- <el-option v-for="item in typeOptions" :key="item.key" :label="item.label" :value="item.key" /> -->
            <el-option label="男" value="male"></el-option>
            <el-option label="女" value="female"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="sex" label="状态">
          <el-select v-model="form.state" placeholder="请选择状态" clearable class="filter-item">
            <!-- <el-option v-for="item in typeOptions" :key="item.key" :label="item.label" :value="item.key" /> -->
            <el-option label="正常" value="start"></el-option>
            <el-option label="停用" value="stop"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="position" label="职位">
          <el-input v-model="form.position" />
        </el-form-item>
        <el-form-item prop="telephone" label="固话">
          <el-input v-model="form.telephone" />
        </el-form-item>
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
    <el-dialog :visible.sync="dialogVisible2" width="30%" title="修改密码" top="20%">
      <el-form :model="form2" status-icon :rules="rules2" ref="form2" label-width="80px" status-icon>
        <el-form-item label="新密码" prop="pass">
          <el-input type="password" v-model="form2.pass" auto-complete="off" placeholder="请输入新的密码"></el-input>
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
import { tree, tableList } from '@/api/setting/userMangement'
import Pagination from '@/components/Pagination'
export default {
  name: 'userManagement',
  components: { Pagination },
  data() {
    // 自定义校验规则
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.form.checkPass !== '') {
          this.$refs.form.validateField('checkPass');
        }
        callback();
      }
      if (value) {
        if (value.lemgth < 6)
          callback(new Error('密码小于6个字符'));
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
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
        search: "",
        state: "",
        role: "",
        pageNo: 1,
        pageSize: 10,
        id: ""
      },
      form: {
        unit: "广州市",
        department: null,
        account: null,
        username: null,
        password: null,
        checkPass: "",
        sort: null,
        mobilePhone: null,
        sex: null,
        state: null,
        position: null,
        telephone: null,
        email: null
      },
      rules: {
        department: [{ required: true, message: "请选择部门", trigger: "change" }],
        account: [{ required: true, message: "请填写描述内容", trigger: "blur" }],
        username: [
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
        mobilePhone: [{ required: true, message: "请填写手机号码", trigger: "change" }]
      },
      form2: {
        pass: "",
        checkPass: ""
      },
      rules2: {
        pass: [
          { validator: validatePass, trigger: "blur" }
        ],
        checkPass: [
          { validator: validatePass2, trigger: "blur" }
        ]
      },
      total: 2,
      states: ["正常", "停用"],
      roles: ["巡河长", "张三", "李四", "王五", "赵六"],
      departments: ["总河长", "管理员", "科长"],
      tableData3: [{
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        isStart: true
      }, {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        isStart: false
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        isStart: true
      }],
      multipleSelection: []
    }
  },
  created() {
    this.loadLeftTree()
  },
  methods: {
    loadLeftTree() {
      tree().then((res) => {
        console.log("左边树", res)
        const data = res.data.list
        this.dataArray = data
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

      const idx = data.id
      const params = {
        id: idx
      }
      this.getList(params)
    },
    // 表单编辑
    handleEdit(index, row) {
      if (this.$refs.form != undefined) {
        this.$refs.form.resetFields()
        // Object.assign(this.form, this.$options.data().form)
      }
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
    // 停用启用
    handleStart() {

    },
    getList(idx) {
      this.tableLoading = true

      tableList(idx).then((res) => {
        console.log('表单列表', res)
        this.tableLoading = false
      }).catch(errorRes => {
        this.tableLoading = false
      })
    },
    // 查询,分页使用
    tableList() {

    },
    handleFilter() {

    },
    searchBtn() {

    },
    addBtn() {
      this.dialogVisible = true
      console.log(this.$refs.form)

      if (this.$refs.form != undefined) {
        this.$refs.form.resetFields()
        // Object.assign(this.form, this.$options.data().form)
      }
    },
    deleteBtn() {

    },
    // 新增用户  保存
    save(e) {
      this.dialogVisible = false
      console.log('保存', this.form)
    },
    // 修改密码保存
    savePass() {
      this.dialogVisible2 = false
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
      console.log("全选,多选", val)
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
<style lang="scss">
.el-container {
  .el-aside {
    width: 25% !important;
    margin-right: 1%;
  }
  .el-header,
  .el-main {
    border: 1px solid transparent;
    border-color: #ddd;
    border-radius: 4px;
    -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
    width: 100%;
  }
  .el-header {
    margin-bottom: 1%;
    .topTitle {
      text-align: left;
      border-bottom: 1px solid #ccc;
      padding: 10px 0;
    }
    .filter-container {
      padding: 25px 0 !important;
    }
  }
}
</style>
