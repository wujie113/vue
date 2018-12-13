<template>
  <div>
    <div class="filter-container" >
      <el-input placeholder="输入责任段名称" v-model="listQuery.name" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button type="primary" icon="el-icon-plus" @click="addRiver">新增</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row row-key="id" stripe style="width: 100%">
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="river.name" label="所属河流" />
      <el-table-column prop="area.name" label="责任主体" />
      <el-table-column prop="code" label="河流编码" />
      <el-table-column prop="sort" label="排序" :show-overflow-tooltip="true" />
      <el-table-column prop="description" label="描述" :show-overflow-tooltip="true" />
      <el-table-column prop="id" label="操作" width="135">
        <template slot-scope="scope">
          <el-button title="设置打卡点" type="text"  icon="el-icon-location-outline" @click="spot(scope.row)"></el-button>
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
        <el-table-column prop="postName" label="职属" />
      </el-table>
    </el-dialog>
    <el-dialog :visible.sync="visible" title="编辑" :append-to-body="false" :close-on-click-modal="false" :modal="false" :modal-append-to-body="false" top="1vh">
      <el-form ref="form" :model="form" label-width="90px">
        <el-form-item prop="name" label="责任段名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="所属河流">
          <rm-river-select v-model="form.river" :defaultExpand="Infinity" />
        </el-form-item>
        <el-form-item prop="area" label="责任主体">
          <rm-area-select v-model="form.area" :defaultExpand="Infinity"/>
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

     <el-dialog  title="设置打卡点"  :visible.sync="visiblespot"  :append-to-body="false" :close-on-click-modal="false" :modal="false" :modal-append-to-body="false">
       <div style="width:100%">
         <label class="upload-demo">请在地图上设置打卡点</label>
         <el-table style="width:100%"    :data="dutyClockList">
           <el-table-column label="名称" prop='name'></el-table-column>
           <el-table-column label="坐标" :formatter="formatterthis"> </el-table-column>
           <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button @click="delspot(scope.index, scope.row)">删除</el-button>
                </template></el-table-column>
         </el-table>
       </div>
       <div>
         <el-button type="primary" @click="rest">还原</el-button>
         <el-button type="primary" @click="commit">提交</el-button>
       </div>
    </el-dialog>

  </div>
</template> 
<script>
import Pagination from "@/components/Pagination";
import {
  getList,
  save,
  del,
  getxslist,
  getfiles,
  delfiles
} from "@/api/res/river.js";
import { delBtn,addspot,getspot } from "@/api/res/dutyPart.js";
import {
  deluser,
  getmanagerlist,
  saveusers,
  gethzbuserbyareaid
} from "@/api/res/management.js";
import RmDict from "@/components/rm/dict";
import RmOrgSelect from "@/components/rm/orgselect";
import RmUserSelect from "@/components/rm/userselect";
import RmAreaSelect from "@/components/rm/areaselect";
import RmRiverSelect from "@/components/rm/riverselect";
import { getToken } from "@/utils/auth";
import { file } from '@/api/imgUplodFile'

export default {
  components: {
    Pagination,
    RmDict,
    RmOrgSelect,
    RmUserSelect,
    RmAreaSelect,
    RmRiverSelect
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger"
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      visible: false,
      listLoading: null,
      doUpload: process.env.BASE_FILE_API + "?token=" + getToken(),
      fileList: [],
      visiblespot: false,
      dutyClockList:null,
      areauser: {
        checkuserids: null,
        userlisted: null,
        userloadinged: false,
        userlist: null,
        visible: false,
        form: {
          bizid: null,
          type: "ZRD",
          userids: null
        },
        tbshow: true,
        checkeduser: null
      },
      form: {
        id: null,
        type: "ZRD",
        province: null,
        region: null,
        county: null,
        town: null,
        name: null,
        lng: null,
        lat: null,
        code: null,
        description: null,
        area: null,
        river: null,
        sort: null
      },
      uploaddata: {
        bizId: null,
        bizType: "ZRD"
      },
      params:  null,
      list: null,
      total: 0,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        importance: undefined,
        search: undefined,
        type: "ZRD",
        sort: "+id"
      },
      sxOptions: null
    };
  },
  created() {
    this.getList();
    this.getxslist();
  },
  methods: {
    getList() {
      this.listLoading = true;
     // console.log("this.listQuery::::", this.listQuery);
      getList(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.count;
      });
    },
    formatterthis(row){
      return row.lng + "," + row.lat
    },
    handleFilter() {
      this.listQuery.pageNo = 1;
      this.getList();
    },
    getxslist() {
      getxslist(this.listQuery).then(response => {
        this.sxOptions = response.data.list;
      });
    },
    addRiver() {
      this.visible = true;
      // this.form={};
      if (this.$refs.form != undefined) {
        Object.assign(this.form, this.$options.data().form);
      }
    },
    edit(row) {
      this.visible = true;
      Object.assign(this.form, row);
      getfiles({ bizId: this.form.id, bizType: "R" }).then(response => {
        this.fileList = response.data;
        console.log("this.fileList",this.fileList)
      });
    },
    save() {
      this.visible = false;
      this.listLoading = true;
      save(this.form)
        .then(response => {
          this.uploaddata.bizId = response.data.id;
          if (
            this.$refs.upload.uploadFiles != undefined &&
            this.$refs.upload.uploadFiles.length > 0
          ) {
            // this.$refs.upload.submit();
            // 上传到服务器
            const imgParams =  '&bizType=' + this.uploaddata.bizType + '&bizId=' + this.uploaddata.bizId

            file(imgParams, this.$refs.upload.uploadFiles).then(res => {
              // console.log('file----res', res)
            }).catch((errorRes) => {})
          } else {
            this.getList();
          }
          this.listLoading = false

        })
        .catch(error => {
          this.listLoading = false
        });
    },
    handleSuccess() {
      this.fileList = [];
      this.getList();
    },
    removefile(file) {
      delfiles({ ids: file.id }).then(response => {
        console.log("图片删除成功!!!!!");
      });
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    del(row) {
      var self = this;
      console.log(row.id);
      del(row.id)
        .then(response => {
          this.getList();
        })
        .catch(error => {
          this.listLoading = false;
        });
    },
    //用户部分
    personEdit(row) {
      this.riverrow = row;
      this.areauser.listLoadinged = true;
      this.areauser.visible = true;
      this.findmanagerlist(row.id);
    },
    findmanagerlist(id) {
      getmanagerlist({ type: "ZRD", bizid: id }).then(response => {
        this.areauser.userlisted = response.data.list;
        this.areauser.userloadinged = false;
      });
    },
    adduser() {
      this.areauser.tbshow = false;
      gethzbuserbyareaid({
        areaid: this.riverrow.area.id,
        bizid: this.riverrow.id
      }).then(response => {
        this.areauser.userlist = response.data.list;
        this.areauser.listLoading = false;
      });
    },
    deluser(row) {
      console.log("row:::", row);
      deluser(row.id).then(response => {
        this.$message({
          message: "删除用户成功!!",
          type: "success"
        });
        this.areauser.userloadinged = true;
        this.findmanagerlist(this.riverrow.id);
      });
    },
    //责任段id
    spot(row) {
      this.visiblespot = true;
      this.params = row;
      getspot(row.id).then( response =>{
            this.dutyClockList=response.data.list
      })
    },
    //提交打卡点
    commit() {
      //  数组转成json字符串
      //  var jsonstr = JSON.stringify(this.dutyClockList)
       var json= {
            idA:this.params.id,
            latlng: JSON.stringify(this.dutyClockList)
      }
      addspot(json).then(response => {
         this.visiblespot = false;
        this.$message({
          message: "添加打卡点成功!!",
          type: "success"
        });
      });
    },
    //删除打卡点
    delspot(index, row){
      var arry =this.dutyClockList
       arry.splice(index, 1);
       delBtn(row.id).then(response =>{
          this.$message({
          message: "删除打卡点成功!!",
          type: "success"
        });
       })
    },
    //还原
    rest(){
      this.dutyClockList = null;
    },
    saveusers() {
      if (
        this.areauser.checkuserids == null ||
        this.areauser.checkuserids == ""
      ) {
        this.closeuser();
        return;
      }
      saveusers({
        bizid: this.riverrow.id,
        userids: this.areauser.checkuserids,
        type: "ZRD"
      })
        .then(response => {
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
        })
        .catch(error => {
          this.listLoading = false;
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      val.forEach((a, b) => {
        if (b == 0) {
          this.areauser.checkuserids = a.id;
        } else {
          this.areauser.checkuserids += "," + a.id;
        }
      });
    },
    closeuser() {
      this.areauser.tbshow = true;
      this.areauser.userlist = [];
      this.findmanagerlist(this.riverrow.id);
      this.areauser.checkuserids = null;
    },
    closedialog() {
      this.areauser.tbshow = true;
      this.areauser.userlist = [];
      this.areauser.visible = false;
      this.areauser.checkuserids = null;
      this.riverrow = null;
    }
    //结束用户部分
  }
};
</script>
