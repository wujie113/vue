<template>
  <div class="camera"> 
      <div class="filter-container">
      <el-input placeholder="检索视频监控名称、编码" v-model="query.search" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button icon="el-icon-download" type="primary" @click="downloadExcel">下载视频监控数据模板</el-button>
      <el-button icon="el-icon-refresh" type="primary" @click="updateData">更新视频监控数据</el-button> 
    </div> 
      <el-table   border stripe :data="list" row-key="id" tooltip-effect="dark" @current-change="handleSelectionChange"   v-loading="v.listLoading">
        <el-table-column type="index" label="序号"/>
        <el-table-column prop="name" label="摄像名称" :show-overflow-tooltip="true" min-width="230px"/>
        <el-table-column prop="code" label="摄像头编码" :show-overflow-tooltip="true" min-width="130px"/>
         <el-table-column prop="lng" label="经度" :show-overflow-tooltip="true" min-width="130px"/>
        <el-table-column prop="lat" label="纬度" :show-overflow-tooltip="true" min-width="130px"/>
        <el-table-column prop="province" label="省" :show-overflow-tooltip="true" min-width="200px"/>
        <el-table-column prop="region" label="地区" :show-overflow-tooltip="true" min-width="200px"/>
        <el-table-column prop="county" label="县" :show-overflow-tooltip="true" min-width="200px"/>
        <el-table-column prop="town" label="乡（镇）" :show-overflow-tooltip="true" min-width="200px"/>
        <el-table-column prop="village" label="街（村）" :show-overflow-tooltip="true" min-width="200px"/>
        <el-table-column prop="regimeCode" label="行政区划代码" :show-overflow-tooltip="true" min-width="200px"/>
        <el-table-column prop="Url" label="视频播放地址" :show-overflow-tooltip="true" min-width="200px"/>
        <el-table-column prop="useState" label="启用状态" :show-overflow-tooltip="true" min-width="200px"/> 
      </el-table>  
    <pagination v-show="query.total>0" :total="query.total" :page.sync="query.pageNo" :limit.sync="query.pageSize" @pagination="getList" /> 
  
  
  <el-dialog :visible.sync="v.formhistory" title="历史上传资源文件列表" width="60%"  :append-to-body="false" :close-on-click-modal="false" :modal="false" :modal-append-to-body="false">
      <el-table v-loading="v.listLoadingHistory" :data="listDate" row-key="id" stripe  border>
        <el-table-column type="index" label="序号" width="50" />
        <el-table-column prop="createDate" label="上传时间" width="150" />
        <el-table-column prop="name" label="文件名" width="250" />
        <el-table-column prop="id" label="操作" min-width="120">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" title="导出该时间上传资源文件"><a :href="(scope.row.url)">导出</a></el-button>
            <el-button @click="get(scope.row)" type="primary" size="mini" title="资源恢复到该时间上传的文件">恢复</el-button>
            <el-button @click="del(scope.row)" type="primary" size="mini" title="删除该时间上传的文件">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog
      :visible.sync="v.formupdate"
      title="上传提示"
      :append-to-body="false"
      :close-on-click-modal="false"
      :modal="false"
      :modal-append-to-body="false"
      width="30%"
    >
      <el-form :model="form" abel-width="80px" size="mini" class="leftBox">
        <el-form-item label="文件格式要求为：">
          <span style="color:red">.xls</span>(Excel 97-2018工作簿)
        </el-form-item>
        <el-form-item label="文件必需包含字段：">名称
          <br>县名
          <br>经度（如：113.8569）
          <br>纬度（如：27.6253）
          <br>
        </el-form-item>
      </el-form>
      <el-upload
        :action="uploadaction"
        :show-file-list="false"
        accept=".xlsx, .xls"
        class="upload-demo"
        :before-upload="beforeUpload"
        :data="uploaddata"
        :on-success="handleSuccess"
        :on-error="handlError"
      >
        <el-button type="primary" size="mini">去上传</el-button>
      </el-upload>
    </el-dialog> 
       </div>
</template> 
<script> 
import Pagination from '@/components/Pagination' 
import { getList,getBtn,save,del } from '@/api/res/camera.js'
import { getfiles, delfiles } from "@/api/res/river.js"
import RmDict from '@/components/rm/dict'
import RmDictRadio from '@/components/rm/dictradio'
import RmOrgSelect from "@/components/rm/orgselect"
import RmUserSelect from "@/components/rm/userselect"
import RmAreaSelect from "@/components/rm/areaselect"
import { getToken } from "@/utils/auth"
export default {
  components: { Pagination,RmDict,RmDictRadio,RmOrgSelect, RmUserSelect, RmAreaSelect },
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
          formupdate:false,
          form: false,
          loading: false,
          formhistory:false,
          listLoadingHistory:false,
          listLoading:false, 
        },
        
      uploaddata: {
        bizId: 10011,
        bizType: "spjk"
      },
      listDate:null,
      uploadaction: process.env.BASE_API + "/api/res/camera/import?token=" + getToken(),
      list:  null,      
      listSelected: [],
      query: {
      	total: 0 ,
        pageNo: 1,
        pageSize: 10, 
        search:undefined,  	
        type: undefined
      },
	  form: { 
	  	name:null,	  	
	  	code:null,	  	
	  	lat:null,	  	
	  	lng:null,	  	
	  	province:null,	  	
	  	region:null,	  	
	  	county:null,	  	
	  	town:null,	  	
	  	village:null,	  	
	  	regimeCode:null,	  	
	  	Url:null,	  	
	  	useState:null,	  	
	  },
    }
    },
  created() {
    this.getList()
  },
  methods: {
    getList() {  
        this.v.loading = true ; 
        getList(this.query).then(response => { 
          this.v.loading = false
           this.list = response.data.list
           this.query.total = response.data.count
        })
    },
    handleSelectionChange(row) {
      console.log("row",row);
      
      this.$emit('clickRow', { id: row.id, gtype: 'camera', name: row.name, lng: row.lng, lat: row.lat})
    },
     handleFilter() {
      this.query.pageNo = 1
      this.getList()
    },
    beforeUpload(file) {
      this.v.listLoading = true;
      this.v.formupdate = false;
    },
    handleSuccess(respone) {
      if (respone.success == true) {
        this.$message({
          message: "导入数据成功",
          type: "success"
        });
        this.v.listLoading = false;
      } else {
        this.$message({
          message: respone.msg,
          type: "error"
        });
        this.v.listLoading = false;
      }
      this.query.search = "";
      this.getList();
    },
    handlError() {
      this.$message({
        message: "导入数据失败",
        type: "error"
      });
      this.query.search = "";
      this.getList();
    },
    downloadExcel() {
      this.v.formhistory = true;
      this.v.listLoadingHistory = true;
      getfiles(this.uploaddata).then(response => {
        this.listDate = response.uploadexcelarr; 
        this.v.listLoadingHistory = false;
      });
    }, 
    updateData() {
      this.v.formupdate = true;
    },
    get(row) {
      this.v.listLoading = true;
      this.v.formhistory = false;
      this.query.search = "";
      getBtn(row.id).then(response => {    
        this.$message({
          message: '恢复数据成功',
          type: 'success'
        });
        this.v.listLoading = false;
        this.getList();
      });
    },
    del(row) {
      console.log("id",row.id)
      this.v.listLoadingHistory = true;
      delfiles({id:row.id}).then(response => {
        this.v.listLoadingHistory = false;
        this.$message({
          message: '删除数据成功',
          type: 'success'
        });
        this.downloadExcel();
      });
    }, 
  }
}
</script>