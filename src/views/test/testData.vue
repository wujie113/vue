<template>
  <div class="app-container">
    <el-container>
      <el-header class="filter-container" style="height:auto;">
        <el-form ref="queryForm" :model="query" :inline="true" size="medium">
          <el-form-item>
            <rm-user-select v-model="query.user" class="filter-item" style="width:200px;" />
          </el-form-item>
          <el-form-item>
            <rm-org-select v-model="query.office" class="filter-item" style="width:200px;" />
          </el-form-item>
          <el-form-item>
            <rm-area-select v-model="query.area" class="filter-item" style="width:200px;" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="query.name" placeholder="请输入名称" class="filter-item" />
          </el-form-item>
          <el-form-item>
            <rm-dict-radio type="sex" v-model="query.sex" class="filter-item" style="width:200px;" />
          </el-form-item>
          <el-form-item>
            <el-date-picker v-model="query.inDate" type="date" placeholder="请选择加入日期" class="filter-item" value-format="yyyy-MM-dd HH:mm:ss" style="width:200px;" />
          </el-form-item>
          <el-form-item>
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
            <el-button @click="resetForm('queryForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-header>
      <el-main>
        <div class="filter-container" style="padding-top: 0;">
          <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="create">新增</el-button>
          <el-button class="filter-item" type="info" icon="el-icon-delete" @click="dels">删除</el-button>
        </div>
        <el-table ref="listTable" border stripe :data="list" row-key="id" tooltip-effect="dark" @selection-change="handleSelectionChange" v-loading="v.loading">
          <el-table-column prop="user" label="归属用户" />
          <el-table-column prop="office" label="归属部门" />
          <el-table-column prop="area" label="归属区域" />
          <el-table-column prop="name" label="名称" />
          <el-table-column prop="sex" label="性别" />
          <el-table-column prop="inDate" label="加入日期" />
          <el-table-column prop="id" label="操作" width="150">
            <template slot-scope="scope">
              <el-button @click="edit(scope.row)" type="primary" size="mini" icon="el-icon-edit" />
              <el-button @click="del(scope.row)" type="danger" size="mini" icon="el-icon-delete" />
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="query.total>0" :total="query.total" :page.sync="query.pageNo" :limit.sync="query.pageSize" @pagination="getList" />
      </el-main>
    </el-container>

    <el-dialog :visible.sync="v.form" title="编辑">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" status-icon>
        <el-form-item label="归属用户" prop="user">
          <rm-user-select v-model="form.user" />
        </el-form-item>
        <el-form-item label="归属部门" prop="office">
          <rm-org-select v-model="form.office" />
        </el-form-item>
        <el-form-item label="归属区域" prop="area">
          <rm-area-select v-model="form.area" />
        </el-form-item>
        <el-form-item label="名称" prop="name" required>
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <rm-dict-radio type="sex" v-model="form.sex" />
        </el-form-item>
        <el-form-item label="加入日期" prop="inDate">
          <el-date-picker v-model="form.inDate" type="date" placeholder="请选择日期" style="width: 100%;" value-format="yyyy-MM-dd HH:mm:ss" />
        </el-form-item>
        <el-form-item label="备注信息" prop="remarks">
          <el-input v-model="form.remarks" type="textarea" placeholder="请输入备注信息"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="v.form = false">取 消</el-button>
        <el-button @click="save()" type="primary">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template> 
<script> 
  import Pagination from '@/components/Pagination'
  import { getList, get, save, del } from '@/api/test/testData.js'
  import RmDict from '@/components/rm/dict'
  import RmDictRadio from '@/components/rm/dictradio'
  import RmOrgSelect from "@/components/rm/orgselect"
  import RmUserSelect from "@/components/rm/userselect"
  import RmAreaSelect from "@/components/rm/areaselect"
  export default {
    components: { Pagination, RmDict, RmDictRadio, RmOrgSelect, RmUserSelect, RmAreaSelect },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'gray',
          deleted: 'danger'
        }
        return statusMap[status]
      }
    },
    data() {
      return {
        v: {
          form: false,
          loading: false
        },
        list: null,
        listSelected: [],
        query: {
          total: 0,
          pageNo: 1,
          pageSize: 10,
          user: null,
          office: null,
          area: null,
          name: null,
          sex: null,
          inDate: null
        },
        form: {
          user: null,
          office: null,
          area: null,
          name: null,
          sex: null,
          inDate: null
        },
        rules: {
          user: [{ required: true, message: "请选择用户", trigger: "blur" }],
          office: [{ required: true, message: "请选择部门", trigger: "blur" }],
          area: [{ required: true, message: "请选择区域", trigger: "blur" }],
          name: [
            { required: true, message: "请填写您的姓名", trigger: "blur" },
            { min: 3, max: 4, message: "长度在 3 到 10 个字符", trigger: "blur" }
          ],
          sex: [{ required: true, message: "性别必填的", trigger: "blur" }]
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.v.loading = true
        //console.log("this.query::::",this.query);
        getList(this.query).then(response => {
          this.v.loading = false
          this.list = response.data.list
          this.query.total = response.data.count
        })
      },
      handleFilter() {
        this.query.pageNo = 1
        this.getList()
      },
      create() {
        this.v.form = true
        this.form = {}
      },
      edit(row) {
        //console.log(JSON.stringify(row));
        this.v.form = true
        this.form = row
      },
      save() {
        var self = this
        //console.log('保存:',JSON.stringify(this.form),this.selectUser);         
        save(this.form).then(response => {
          this.v.form = false
          if (response.success) {
            this.$message(response.msg)
            //添加到列表中
            //this.list.unshift(this.form)
            self.getList()
          } else {
            this.$message({
              message: response.msg,
              type: "warning"
            })
          }
        })
      },
      handleSelectionChange(val) {
        this.listSelected = val
      },
      dels() {
        var self = this
        if (this.listSelected.length > 0) {
          const idArray = []
          this.listSelected.map(item => {
            idArray.push(item.id)
          })
          const idStr = idArray.join()
          console.log('idStr', idStr)
          this.$confirm("确认删除?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            del(idStr).then(res => {
              //刷新列表
              self.getList()
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
            message: "请先选择记录!"
          })
        }
      },
      del(row) {
        //var self = this
        //console.log(row) 
        del(row.id).then(response => {
          this.v.form = false
          if (response.success) {
            this.$message(response.msg)
            //删除列表数据
            const index = this.list.indexOf(row) //找到要删除数据在list中的位置 
            this.list.splice(index, 1) //通过splice 删除数据
          } else {
            this.$message({
              message: response.msg,
              type: "warning"
            })
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>
