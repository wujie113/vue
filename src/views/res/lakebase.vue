<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input placeholder="输入名称搜索" v-model="listQuery.name" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button type="primary" icon="el-icon-plus" @click="add">新增</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row row-key="id" stripe style="width: 100%">
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="typename" label="类型" />
      <el-table-column prop="area.name" label="责任主体" />
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="id" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="mini" icon="el-icon-edit" />
          <el-button @click="del(scope.row)" type="text" size="mini" icon="el-icon-delete" />
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog :visible.sync="visible" title="编辑">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="责任主体">
          <rm-area-select v-model="form.area" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" :rows="4" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button @click="save()" type="primary">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template> 
<script> 
import Pagination from '@/components/Pagination'
import { lakegetList, lakessave, lakeget, lakedel } from '@/api/res/lake.js'
import RmDict from '@/components/rm/dict'
import RmOrgSelect from "@/components/rm/orgselect"
import RmUserSelect from "@/components/rm/userselect"
import RmAreaSelect from "@/components/rm/areaselect"
export default {
  components: { Pagination, RmDict, RmOrgSelect, RmUserSelect, RmAreaSelect },
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
      visible: false,
      listLoading: false,

      form: {
        id: null,
        name: null,
        province: null,
        region: null,
        county: null,
        town: null,
        type: "B",
        lng: null,
        lat: null,
        area: null,
        description: null
      },
      list: null,
      total: 0,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        importance: undefined,
        name: undefined,
        type: "B",
        sort: '+id'
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true;
      console.log("this.listQuery::::", this.listQuery);
      lakegetList(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.list
        this.total = response.data.count
      })
    },
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    add() {
      this.visible = true;
      if (this.$refs.form != undefined) {
        Object.assign(this.form, this.$options.data().form)
      }
    },
    edit(row) {
      //console.log(JSON.stringify(row));
      this.visible = true;
      Object.assign(this.form, row)
    },
    save() {
      //console.log('保存:',JSON.stringify(this.form),this.selectUser);
      this.visible = false
      this.listLoading = true
      lakessave(this.form).then(response => {
        this.getList();
      }).catch(error => {
        this.listLoading = false
      })
      //
    },
    del(row) {
      var self = this;
      var self = this
      console.log(row)
      lakedel(row.id).then(response => {
        this.getList()
      }).catch(error => {
        this.listLoading = false
      })
    }
  }
}
</script>