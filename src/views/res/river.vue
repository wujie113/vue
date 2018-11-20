<template>
  <div>
    <div class="filter-container river">
      <el-input placeholder="输入河流湖泊名称" v-model="listQuery.name" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.type" placeholder="请选择类型" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in typeOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button type="primary" icon="el-icon-plus" @click="addRiver">新增</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row row-key="id" stripe size="mini" @current-change="handleCurrentChange" >
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="river.name" label="所属水系" />
      <el-table-column prop="typename" label="河流类型" />
      <el-table-column prop="area.name" label="责任主体" />
      <el-table-column prop="description" label="描述" :show-overflow-tooltip="true" />
      <el-table-column prop="area.name" label="责任主体" />
      <el-table-column prop="sort" label="排序" :show-overflow-tooltip="true" />
      <el-table-column prop="id" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="mini" icon="el-icon-edit" title="编辑" />
          <el-button @click="personEdit(scope.row)" type="text" title="人员管理">
            <svg-icon icon-class="user_blue" />
          </el-button>
          <el-button @click="del(scope.row)" type="text" size="mini" icon="el-icon-delete" title="删除" />
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
        <el-table-column prop="postName" label="职属" />
      </el-table>
    </el-dialog>
    <!--     
     <el-dialog :visible.sync="areauser.visible"  width="60%" height="600px" title="关联管理人员"> 
              <el-button  class="filter-item" type="primary" icon="el-icon-search" @click="adduser">添加新用户</el-button>
               <el-table  v-loading="areauser.userloading" :data="areauser.userlist"    border  fit highlight-current-row  row-key="id"  stripe style="width: 100%"> 
                <el-table-column prop="name" label="姓名"/> 
                <el-table-column prop="post" label="职属"/>  
                <el-table-column prop="id" label="操作" width="100"   >
                <template slot-scope="scope"> 
                    <el-button @click="deluser(scope.row)" type="text" size="mini" icon="el-icon-delete" title="删除" />
                </template>
              </el-table-column>    
              </el-table> 
              <el-dialog title="人员管理">
                    <el-table  v-loading="areauser.userloading" :data="areauser.userlist"    border  fit highlight-current-row  row-key="id"  stripe style="width: 100%">
                      <el-table-column type="selection"  width="55"/> 
                      <el-table-column prop="name" label="姓名"/> 
                      <el-table-column prop="post" label="职属"/>      
                    </el-table> 
              </el-dialog>
        </el-dialog> -->

    <el-dialog :visible.sync="visible" :title="dialogTitle" top="1vh" :append-to-body="false" :close-on-click-modal="false" :modal="false" :modal-append-to-body="false">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item prop="name" label="河流名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="所属水系">
          <el-select v-model="form.river.id" placeholder="请选择水系" clearable class="filter-item">
            <el-option v-for="item in sxOptions" :key="item.key" :label="item.label" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item prop="type" label="河流类型">
          <el-select v-model="form.type" placeholder="请选择类型" clearable class="filter-item">
            <el-option v-for="item in typeOptions" :key="item.key" :label="item.label" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item prop="area" label="责任主体">
          <rm-area-select v-model="form.area" />
        </el-form-item>
        <el-form-item prop="sort" label="排序">
          <el-input v-model="form.sort" />
        </el-form-item>
        <el-form-item prop="description" label="河流描述">
          <el-input v-model="form.description" :rows="4" type="textarea" />
        </el-form-item>
      </el-form>
      <el-upload :action="doUpload" list-type="picture-card" :auto-upload="false" :on-preview="handlePictureCardPreview" accept=".jpg,.jpeg,.png,.gif" ref="upload" :file-list="fileList" :before-remove="removefile" :data="uploaddata" :on-success="handleSuccess" :on-remove="handleRemove">
        <i class="el-icon-plus"></i>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button @click="save()" type="primary">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 图片预览的弹窗 -->
    <el-dialog :visible.sync="dialogVisibleImg" title="图片预览" :append-to-body="false" :close-on-click-modal="false" :modal="false" :modal-append-to-body="false">
      <img width="100%" :src="dialogImageUrl" alt>
    </el-dialog>

  </div>
</template> 
<script> 
import Pagination from '@/components/Pagination'
import { getList, save, del, getxslist, getfiles, delfiles } from '@/api/res/river.js' 
import { deluser, getmanagerlist, saveusers, gethzbuserbyareaid } from '@/api/res/management.js'
import RmDict from '@/components/rm/dict'
import RmOrgSelect from "@/components/rm/orgselect"
import RmUserSelect from "@/components/rm/userselect"
import RmAreaSelect from "@/components/rm/areaselect"
import { getToken } from '@/utils/auth'
export default {
  components: { Pagination, RmDict, RmOrgSelect, RmUserSelect, RmAreaSelect  }, 
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
      listLoading: null,
      doUpload: process.env.BASE_FILE_API + "?token=" + getToken(),
      fileList: [], 
      areauser: {
        checkuserids:null,
        userlisted: null,
        userloadinged: false,
        userlist: null,
        visible: false,
        form: {
          bizid: null,
          type: 'HL',
          userids: null
        },
        tbshow: true,
        checkeduser: null,
      },
      dialogVisibleImg: false,
      dialogImageUrl: null,
      dialogTitle: null,
      form: {
        id: null,
        type: null,
        province: null,
        region: null,
        county: null,
        town: null,
        name: null,
        lng: null,
        lat: null,
        description: null,
        area: null,
        sort: null,
        river: {
          id: null
        }
      },
      uploaddata: {
        bizId: null,
        bizType: "R"
      },
      list: null,
      total: 0,
      riverrow: null,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        importance: undefined,
        search: null,
        type: "HL",
        sort: null
      },
      typeOptions: [{ label: '河流', key: 'HL' }, { label: '沟渠', key: 'GQ' }],
      sxOptions: null
    }
  },
  created() {
    this.getList()
    this.getxslist()
  },
  methods: {
    getList() {
      this.listLoading = true
      console.log("this.listQuery::::", this.listQuery)
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
    getxslist() {
      getxslist(this.listQuery).then(response => {
        this.sxOptions = response.data.list
      })
    },
    addRiver() {
      this.visible = true
      this.dialogTitle = '添加'
      if (this.$refs.form != undefined) {
        Object.assign(this.form, this.$options.data().form)
      }
    },
    edit(row) {
      this.visible = true
      this.dialogTitle = '编辑'
      Object.assign(this.form, row)
      console.log('form', this.form)
      getfiles({ bizId: this.form.id, bizType: "R" }).then(response => {
        this.fileList = response.data;
      })

    },
    save() {
      this.visible = false
      this.listLoading = true
      save(this.form).then(response => {
        this.uploaddata.bizId = response.data.id;
        if (this.$refs.upload.uploadFiles != undefined && this.$refs.upload.uploadFiles.length > 0) {
          // 上传到服务器
          this.$refs.upload.submit();
        } else {
          this.getList();
        }
      }).catch(error => {
        this.listLoading = false
      })
    },
    handleSuccess() {
      this.fileList = [];
      this.getList();
    },
    removefile(file) {
      delfiles({ ids: file.id }).then(response => {
        console.log("图片删除成功!!!!!");
      })
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisibleImg = true;
    },
    del(row) {
      var self = this
      console.log(row.id)
      del(row.id).then(response => {
        this.getList()
      }).catch(error => {
        this.listLoading = false
      })
    },
    //用户部分
    personEdit(row) {
      this.riverrow = row
      this.areauser.listLoadinged = true
      this.areauser.visible = true;
      this.findmanagerlist(row.id);
    },
    findmanagerlist(id) {
      getmanagerlist({ type: "HL", bizid: id }).then(response => {
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
    saveusers({ bizid: this.riverrow.id, userids: this.areauser.checkuserids , type: 'HL' }).then(response => {
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
    },
    //结束用户部分
    //地图界面交互操作
    handleCurrentChange(row) { 
        this.$emit('clickrow',row);
    },
    testclick(data){
      console.log("子界面data:::",data);
    }
  }
}
</script>
 
