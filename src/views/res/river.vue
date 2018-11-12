<template>
  <div class="app-container">
    <div class="filter-container"> 
       <el-input placeholder="输入河流湖泊名称" v-model="listQuery.search" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.type" placeholder="请选择类型" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in typeOptions" :key="item.key" :label="item.label" :value="item.key"/>
      </el-select>
      <el-button  class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
       <el-button
              type="primary"
              icon="el-icon-plus"
              @click="addRiver"	>新增</el-button>
    </div>
      <el-table  v-loading="listLoading" :data="list"    border  fit highlight-current-row  row-key="id"  stripe style="width: 100%">
      <el-table-column prop="name" label="名称"/> 
      <el-table-column prop="river.name" label="所属水系"/> 
      <el-table-column prop="typename" label="河流类型"/>   
      <el-table-column prop="area.name" label="责任主体"/> 
      <el-table-column prop="description" label="描述" :show-overflow-tooltip="true"/>
       <el-table-column prop="area.name" label="责任主体"/> 
      <el-table-column prop="sort" label="排序" :show-overflow-tooltip="true"/>
		<el-table-column prop="id" label="操作" width="100"   >
        	<template slot-scope="scope">
            	<el-button @click="edit(scope.row)" type="text" size="mini" icon="el-icon-edit"/>
			<el-button @click="del(scope.row)" type="text" size="mini" icon="el-icon-delete"/>
        	</template>
        </el-table-column>
      </el-table>  
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />  
  
   <el-dialog :visible.sync="visible"  width="30%" title="编辑">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item prop="name" label="河流名称">
          <el-input v-model="form.name"/>
        </el-form-item>    
       <el-form-item   label="所属水系">
            <el-select v-model="form.river.id" placeholder="请选择水系" clearable class="filter-item" >
              <el-option v-for="item in sxOptions" :key="item.key" :label="item.label" :value="item.key"/>
            </el-select>
        </el-form-item>  
       <el-form-item   prop="type"  label="河流类型">
            <el-select v-model="form.type" placeholder="请选择类型" clearable class="filter-item" >
              <el-option v-for="item in typeOptions" :key="item.key" :label="item.label" :value="item.key"/>
            </el-select>
        </el-form-item>  
        <el-form-item   prop="area"  label="责任主体">
          <rm-area-select v-model="form.area"  />
         
        </el-form-item>  
        <el-form-item   prop="sort"  label="排序"> 
              <el-input v-model="form.sort"/>
        </el-form-item> 
        <el-form-item prop="description" label="河流描述">
          <el-input v-model="form.description" :rows="4" type="textarea" />
        </el-form-item>
       </el-form>
        <el-upload 
           :action="doUpload"
              list-type="picture-card"  :auto-upload="false"
              :on-preview="handlePictureCardPreview"
              accept=".jpg,.jpeg,.png,.gif"
              ref="upload" 
              :file-list="fileList"
              :before-remove="removefile"
              :data="uploaddata" 
              :on-success="handleSuccess"
              :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
        </el-upload>  
            <div slot="footer" class="dialog-footer">
                <el-button @click="visible = false">取 消</el-button>
                <el-button @click="save()" type="primary" >确 定</el-button>
            </div>
        </el-dialog>
        
       </div>
</template> 
<script> 
import Pagination from '@/components/Pagination' 
import { getList ,save,del,getxslist ,getfiles,delfiles} from '@/api/res/river.js'
import RmDict from '@/components/rm/dict'
import RmOrgSelect from "@/components/rm/orgselect"
import RmUserSelect from "@/components/rm/userselect"
import RmAreaSelect from "@/components/rm/areaselect"
import { getToken } from '@/utils/auth'
export default {
  components: { Pagination,RmDict,RmOrgSelect, RmUserSelect, RmAreaSelect },
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
    doUpload:process.env.BASE_FILE_API+"?token="+getToken(),
    fileList:[],
	  form: {
      id:null,
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
      sort:null,
	  	river: {
        id:null
      }	  	
    },
    uploaddata:{
        bizId:null,
        bizType:"R"
    },
    list: null, 
    total: 0 ,
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
  } ,
  created() {
    this.getList()
    this.getxslist() 
  },
  methods: {
    getList() {  
        this.listLoading = true 
        console.log("this.listQuery::::",this.listQuery)
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
      // this.form={};
      if (this.$refs.form != undefined) {
        Object.assign(this.form, this.$options.data().form)
      }
    },
	  edit(row) { 
      this.visible = true  
      Object.assign(this.form, row)
      getfiles({bizId:this.form.id,bizType:"R"}).then(response => {  
          this.fileList=response.data;
      })
  	},
	  save() {
	    this.visible = false
  	  this.listLoading = true   
      save(this.form).then(response => {
           this.uploaddata.bizId=response.data.id;  
           if(this.$refs.upload.uploadFiles!=undefined&&this.$refs.upload.uploadFiles.length>0){ 
             this.$refs.upload.submit();  
           } else{ 
             this.getList(); 
           } 
      }).catch(error => { 
          this.listLoading = false   
      })
  },
  handleSuccess(){  
    this.fileList = [];
    this.getList(); 
  },
  removefile(file){ 
      delfiles({ids:file.id}).then(response => { 
          console.log("图片删除成功!!!!!");
     })   
  },
  handleRemove(file, fileList) {
    console.log(file, fileList);
  },
  handlePictureCardPreview(file) {
    this.dialogImageUrl = file.url;
    this.dialogVisible = true;
  },
	del(row) {
      var self = this
      console.log(row.id)
      del(row.id).then(response => { 
            this.getList() 
      }).catch(error => { 
          this.listLoading = false  
      })  
	  }  
  }
}
</script>
