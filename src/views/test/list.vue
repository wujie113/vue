<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input clearable placeholder="输入标题" v-model="query.search" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />

      <rm-dict type="sex" v-model="query.sex" class="filter-item" />
      <rm-dict class="filter-item" title="请选择类型" placeholder="请选择类型" type="yes_no"  v-model="query.type"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="create">新增</el-button>
    </div>
    <el-table :data="list" row-key="id" stripe style="width: 100%">
      <el-table-column prop="user.name" label="归属用户" />
      <el-table-column prop="office.name" label="归属部门" />
      <el-table-column prop="area.name" label="归属区域" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="sex" label="性别" />
      <el-table-column prop="inDate" label="加入日期" />
      <el-table-column prop="id" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="mini" icon="el-icon-edit" />
          <el-button @click="del(scope.row)" type="text" size="mini" icon="el-icon-delete" />
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="query.total>0" :total="query.total" :page.sync="query.pageNo" :limit.sync="query.pageSize" @pagination="getList" />

    <el-dialog :visible.sync="v.form" title="编辑">
      <el-form :model="form" label-width="120px">
        <el-form-item label="归属用户">
          <rm-user-select v-model="form.user" />
        </el-form-item>
        <el-form-item label="归属部门">
          <rm-org-select v-model="form.office" />
        </el-form-item>
        <el-form-item label="归属区域">
          <rm-area-select v-model="form.area" />
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="性别">
          <rm-dict-radio type="sex" v-model="form.sex" />
        </el-form-item>
        <el-form-item label="加入日期">
          <el-date-picker v-model="form.inDate" type="date" placeholder="Pick a date" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="备注信息">
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
  import { getList, save, del } from '@/api/test/testData.js'
  import RmDict from '@/components/rm/dict'
  import RmDictRadio from '@/components/rm/dictradio'
  import RmDictCheckbox from '@/components/rm/dictcheckbox'
  import RmOrgSelect from "@/components/rm/orgselect"
  import RmUserSelect from "@/components/rm/userselect"
  import RmAreaSelect from "@/components/rm/areaselect"
  export default {
    components: { Pagination, RmDict, RmDictRadio, RmDictCheckbox, RmOrgSelect, RmUserSelect, RmAreaSelect },
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
        query: {
          total: 0,
          pageNo: 1,
          pageSize: 10,
          importance: undefined,
          search: undefined,
          type: undefined,
          sort: '+id'
        },
        form: {
          user: { id: '', label: '-' },
          office: { id: '', label: '-' },
          area: { id: '', label: '-' },
          name: null,
          sex: null,
          inDate: null,sexs: []
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        console.log("this.query::::", this.query)
        getList(this.query).then(response => {
          this.listLoading = false
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
        this.form.user.label = this.form.user.name
        this.form.office.label = this.form.office.name
        this.form.area.label = this.form.area.name
      },
      save() {
        //console.log('保存:',JSON.stringify(this.form),this.selectUser);         
        save(this.form).then(response => {
          this.v.form = false
          if (response.success) {
            this.$message(response.msg)
            //添加到列表中
            this.list.unshift(this.form)
          } else {
            this.$message({
              message: response.msg,
              type: "warning"
            })
          }
        })
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
      }
    }
  }
</script>
