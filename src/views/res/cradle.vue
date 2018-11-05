<template>
 	<div class="filter-container">  
	  <div class="filter-container">
		<el-input placeholder="检索水源地编码、名称" v-model="listQuery.search" style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter"/> 
		<el-button  class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
		<el-upload :action="uploadaction"  :show-file-list="false" :limit="1" accept=".xlsx,.xls" class="upload-demo"
              :before-upload="beforeUpload"  :file-list="fileList"
				:data="uploaddata"   :on-success="handleSuccess"   :on-error="handlError">
				<el-button  class="filter-item"  type="primary">点击上传</el-button> 
		</el-upload>
	  </div> 
      <el-table :data="list" row-key="id"  stripe style="width: 100%">
        <el-table-column prop="name" label="水源地名称"/>
        <el-table-column prop="code" label="水源地编码"/>
        <el-table-column prop="lat" label="经度"/>
        <el-table-column prop="lng" label="纬度"/>
        <el-table-column prop="province" label="省"/>
        <el-table-column prop="region" label="地区"/>
        <el-table-column prop="county" label="县"/>
        <el-table-column prop="town" label="乡（镇）"/>
        <el-table-column prop="village" label="街（村）"/>
        <el-table-column prop="regimeCode" label="行政区划代码"/>
        <el-table-column prop="threeCode" label="所在水资源三级区名称及编码"/>
        <el-table-column prop="type" label="取水水源类型"/>
        <el-table-column prop="riverName" label="河湖（水库）名称"/>
        <el-table-column prop="riverCode" label="河湖（水库）编码"/>
        <el-table-column prop="getNum" label="取水口个数（个）"/>
        <el-table-column prop="cloumn1" label="水质目标"/>
        <el-table-column prop="cloumn2" label="水源地水质是否监测"/>
        <el-table-column prop="cloumn3" label="水源地现状水质类别"/>
        <el-table-column prop="cloumn4" label="水源地水质是否达标"/>
        <el-table-column prop="cloumn5" label="是否划分水源保护区"/>
        <el-table-column prop="cloumn6" label="一级保护区水域面积（平方公里）"/>
        <el-table-column prop="cloumn7" label="一级保护区陆域面积（平方公里）"/>
        <el-table-column prop="cloumn8" label="一级保护区河长（公里）"/>
        <el-table-column prop="cloumn9" label="二级保护区水域面积（平方公里）"/>
        <el-table-column prop="cloumn10" label="二级保护区陆域面积（平方公里）"/>
        <el-table-column prop="cloumn11" label="二级保护区河长（公里）"/>
        <el-table-column prop="cloumn12" label="准保护区"/>
        <el-table-column prop="cloumn13" label="主要供水用途"/>
        <el-table-column prop="cloumn14" label="供水人口（万人）"/>
        <el-table-column prop="cloumn15" label="主要供水城镇名称1"/>
        <el-table-column prop="cloumn16" label="主要供水城镇名称2"/>
        <el-table-column prop="cloumn17" label="主要供水城镇名称3"/>
        <el-table-column prop="cloumn18" label="供水规模（万立方米/日）"/>
        <el-table-column prop="cloumn19" label="2011年供水量（万立方米）"/>
        <el-table-column prop="deptName" label="单位名称"/>
        <el-table-column prop="deptCode" label="单位代码"/>
        <el-table-column prop="industry" label="所属行业"/>
        <el-table-column prop="recordMan" label="填表人员"/>
        <el-table-column prop="recordPhone" label="填表联系人电话"/>
        <el-table-column prop="reviewMan" label="复核人员"/>
        <el-table-column prop="reviewPhone" label="复核人联系电话"/>
        <el-table-column prop="auditMan" label="审查人员"/>
        <el-table-column prop="auditSymbol" label="审核标志"/>
        <el-table-column prop="regionAudit" label="地区审核"/>
        <el-table-column prop="provinceAudit" label="省级审核"/>
        <el-table-column prop="nationAudit" label="中央审核"/> 
      </el-table>  
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />  
  </div> 
</template> 
<script> 
import Pagination from '@/components/Pagination' 
import { getList } from '@/api/res/cradle.js'
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
     listLoading:null,
	  fileList:[],
	  uploadaction: process.env.BASE_API+'/api/res/sluice/import?token='+getToken(),
      list: null, 
      total: 0 ,
      listQuery: {
        pageNo: 1,
        pageSize: 10, 
        importance: undefined,
        search: undefined,
        type: undefined,
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
	edit(row) {
		//console.log(JSON.stringify(row));
		this.visible = true
		this.form = row
	},
	save() {
		//console.log('保存:',JSON.stringify(this.form),this.selectUser);
		this.visible = false
		//
	},
	del(row) {
		var self = this
		//console.log(row); 
	},
	 beforeUpload(file){ 
		  this.listLoading = true 
 	 },
     handleFilter() {
      this.listQuery.pageNo = 1
	  this.getList();
	  
	}, 
	handleSuccess(){  
		this.$message({
          message: '导入数据成功',
          type: 'success'
        }); 
		this.fileList = [];
		this.getList(); 
	},

	handlError(){  
		this.$message({
          message: '导入数据失败',
          type: 'error'
        }); 
		this.fileList = [];
		this.getList(); 
	},
  }
}
</script>
