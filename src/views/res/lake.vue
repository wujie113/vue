<template>
  <div>
    <div class="filter-container">
      <el-input placeholder="输入名称搜索" v-model="listQuery.name" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.type" placeholder="请选择类型" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in typeOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button type="primary" icon="el-icon-plus" @click="add">新增</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row row-key="id" stripe style="width: 100%">
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="typename" label="类型(湖泊山塘)" />
      <el-table-column prop="lake.name" label="所属区域" />
      <el-table-column prop="area.name" label="责任主体" />
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="id" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="mini" icon="el-icon-edit" />
          <el-button @click="personEdit(scope.row)" type="text" title="人员管理">
            <svg-icon icon-class="user_blue" />
          </el-button>
          <el-button @click="del(scope.row)" type="text" size="mini" icon="el-icon-delete" />
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <el-dialog :before-close="closedialog" :visible.sync="areauser.visible" title="关联管理人员" :append-to-body="false" :close-on-click-modal="false" :modal="false" :modal-append-to-body="false">
      <el-button type="primary" icon="el-icon-plus" @click="adduser" v-show="areauser.tbshow">新增用户</el-button>
      <el-table v-loading="areauser.userloadinged" :data="areauser.userlisted" v-show="areauser.tbshow" border fit highlight-current-row row-key="id" stripe style="width: 100%">
        <el-table-column type="index" label="序号" width="100px" />
        <el-table-column prop="userName" label="姓名" />
        <el-table-column prop="post" label="职属" />
        <el-table-column prop="id" label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="deluser(scope.row)" type="text" size="mini" icon="el-icon-delete" title="删除" />
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" v-show="!areauser.tbshow" icon="el-icon-plus" @click="saveusers">确认</el-button>
      <el-button type="primary" v-show="!areauser.tbshow" icon="el-icon-plus" @click="closeuser">关闭</el-button>
      <el-table v-loading="areauser.userloading" @selection-change="handleSelectionChange" v-show="!areauser.tbshow" :data="areauser.userlist" border fit highlight-current-row row-key="id" stripe style="width: 100%">
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" label="序号" width="100px" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="postLabel" label="职属" />
      </el-table>
    </el-dialog>
    <el-dialog :visible.sync="visible" title="编辑" :append-to-body="false" :close-on-click-modal="false" :modal="false" :modal-append-to-body="false" top="1vh">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item prop="type" label="类型">
          <el-select v-model="form.type" placeholder="请选择类型" clearable class="filter-item">
            <el-option v-for="item in typeOptions" :key="item.key" :label="item.label" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属区域">
          <el-select v-model="form.lake.id" placeholder="请选择水系" clearable class="filter-item">
            <el-option v-for="item in quOptions" :key="item.key" :label="item.label" :value="item.key" />
          </el-select>
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
import { getList, save, get, del, getqlist } from '@/api/res/lake.js' 
import { deluser, getmanagerlist, saveusers, gethzbuserbyareaid } from '@/api/res/management.js'
import RmDict from '@/components/rm/dict'
import RmOrgSelect from "@/components/rm/orgselect"
import RmUserSelect from "@/components/rm/userselect"
import RmAreaSelect from "@/components/rm/areaselect"
export default {
  name: "lake",
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
      quOptions: null,
      listLoading: null,
       areauser: {
        checkuserids:null,
        userlisted: null,
        userloadinged: false,
        userlist: null,
        visible: false,
        form: {
          bizid: null,
          type: 'HP',
          userids: null
        },
        tbshow: true,
        checkeduser: null,
      },
      form: {
        id: null,
        name: null,
        province: null,
        region: null,
        county: null,
        town: null,
        type: null,
        lng: null,
        lat: null,
        area: null,
        lake: { id: null },
        description: null,
        pid: null,
      },
      list: null,
      total: 0,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        importance: undefined,
        name: undefined,
        type: undefined,
        sort: '+id'
      },
      typeOptions: [{ label: '山塘', key: 'ST' }, { label: '湖泊', key: 'HP' }],
    }
  },
  created() {
    this.getList();
    getqlist("B").then(response => {
      this.quOptions = response.data.list
    })
  },
  methods: {
    getList() {
      this.listLoading = true;
      console.log("this.listQuery::::", this.listQuery);
      getList(this.listQuery).then(response => {
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
      save(this.form).then(response => {
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
      del(row.id).then(response => {
        this.getList()
      }).catch(error => {
        this.listLoading = false
      })
    },
    personEdit(row) {
      this.riverrow = row
      this.areauser.listLoadinged = true
      this.areauser.visible = true;
      this.findmanagerlist(row.id);
    },
    findmanagerlist(id) {
      getmanagerlist({ type: "HP", bizid: id }).then(response => {
        this.areauser.userlisted = response.data.list;
        this.areauser.userloadinged = false
      })
    },
    adduser() {
      this.areauser.tbshow = false;
      gethzbuserbyareaid({ areaid: this.riverrow.area.id, bizid: this.riverrow.id }).then(response => {
        this.areauser.userlist = response.data.list;
        this.areauser.listLoading = false
      })
    },
    deluser(row) {
      console.log("row:::", row);
      deluser(row.id).then(response => {
        this.$message({
          message: "删除用户成功!!",
          type: "success"
        });
        this.areauser.userloadinged = true
        this.findmanagerlist(this.riverrow.id);
      })
    },
    saveusers() {
      if (this.areauser.checkuserids == null || this.areauser.checkuserids  == '') {
        this.closeuser();
        return;
      }
    saveusers({ bizid: this.riverrow.id, userids: this.areauser.checkuserids , type: 'HP' }).then(response => {
        console.log("response:::", response);
        if (response.success == true) {
          this.$message({
            message: "新增用户成功",
            type: "success"
          });
          this.closeuser();
        } else {
          this.$message({
            message: "新增用户失败",
            type: "error"
          });
        }

      }).catch(error => {
        this.listLoading = false
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      val.forEach((a, b) => {
        if (b == 0) {
          this.areauser.checkuserids = a.id;
        } else {
          this.areauser.checkuserids  += "," + a.id;
        }
      });
    },
    closeuser() {
      this.areauser.tbshow = true;
      this.areauser.userlist = [];
      this.findmanagerlist(this.riverrow.id);
      this.areauser.checkuserids  = null;
    },
    closedialog() {
      this.areauser.tbshow = true;
      this.areauser.userlist = [];
      this.areauser.visible = false;
      this.areauser.checkuserids  = null;
      this.riverrow = null;
    }
  }
}
</script>