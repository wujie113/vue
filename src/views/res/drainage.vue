<template>
  <div class="app-container">
    <div class="filter-container"> 
       <el-input placeholder="输入标题" v-model="listQuery.search" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.importance" placeholder="请选择列别" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item"/>
      </el-select> 
       <el-button  class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button
              type="primary"
              icon="el-icon-plus"
              @click="addRiver"	>新增</el-button>
    </div>
      <el-table  v-loading="listLoading" :data="list"    border  fit highlight-current-row  row-key="id"  stripe style="width: 100%">
         <el-table-column prop="name" label="水系名称"/>  
        <el-table-column prop="area.name" label="责任主体"/>
        <el-table-column prop="code" label="水系编码"/>
        <el-table-column prop="chief" label="河长办"/>
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
        <el-form-item prop="name" label="水系名称">
          <el-input v-model="form.name"/>
        </el-form-item>  
        <el-form-item   prop="area" label="责任主体">
          <rm-area-select v-model="form.area"  />
        </el-form-item> 
        <el-form-item   prop="description" label="水系描述">
          <el-input v-model="form.description" :rows="4" type="textarea" />
        </el-form-item> 
      </el-form> 
       <el-upload 
           action="http://localhost:8010/hzmis/common/fileRecord"
              list-type="picture-card"  
:auto-upload="false"
              :on-preview="handlePictureCardPreview"
              accept=".jpg,.jpeg,.png,.gif"
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
import { getList ,save,del } from '@/api/res/river.js'
import RmDict from '@/components/rm/dict'
import RmOrgSelect from "@/components/rm/orgselect"
import RmUserSelect from "@/components/rm/userselect"
import RmAreaSelect from "@/components/rm/areaselect"
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
      fullscreenLoading: false,
       dialogImageUrl: '',
      dialogVisible: false,
      form: {
        type: "SX",	   	
        name: null,	  	
        lng: null,	  	
        lat: null,	  	
        description: null,	  	
        area: null,	 
        code: null,
        river: null	  	
      },
      list: null, 
      total: 0 ,
      listLoading: false,
      listQuery: {
        pageNo: 1,
        pageSize: 10, 
        importance: undefined,
        search: undefined,
        type: "SX", 
        sort: '+id'
      },
      importanceOptions: [1, 2, 3]
    }
    },
  created() {
    this.getList()
  },
  methods: {
    getList() {  
        this.listLoading = true  
        getList(this.listQuery).then(response => { 
          this.listLoading = false 
           this.list = response.data.list
           this.total = response.data.count
        })
    },
     addRiver() {    
    this.visible = true   
    if (this.$refs.form != undefined) {  
       Object.assign(this.form, this.$options.data().form) 
    }  
  },
     handleFilter() {
      this.listQuery.pageNo = 1
      this.getList()
    },
     handleRemove(file, fileList) {
        console.log(file, fileList)
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
	edit(row) { 
		this.visible = true 
    Object.assign(this.form, row) 
	},
	save() { 
      this.visible = false
      var action = "http://localhost:8010/hzmis/common/fileRecord"
      // this.fullscreenLoading = true;
       this.listLoading = true  
      console.log('保存:',JSON.stringify(this.form))
      save(this.form).then(response => {
            // this.fullscreenLoading=false;
           this.getList()
         // console.log("then:::")
      }).catch(error => {
        //  this.fullscreenLoading=false; 
          this.listLoading = false 
          // console.log(this.listLoading);
      })
      //
      // this.listLoading = false 
	},
	del(row) {
    var self = this
    console.log(row.id)
	   del(row.id).then(response => {
            // this.fullscreenLoading=false;
           this.getList()
         // console.log("then:::")
      }).catch(error => {
        //  this.fullscreenLoading=false; 
          this.listLoading = false 
          // console.log(this.listLoading);
      })
	}  
  }
}
</script>
