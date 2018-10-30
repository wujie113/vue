<template>
  <div class="app-container">
    <div class="filter-container"> 
       <el-input placeholder="输入标题" v-model="listQuery.search" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.importance" placeholder="请选择列别" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item"/>
      </el-select> 
      <rm-dict title="请选择类型"  placeholder="请选择类型"  type="yes_no"     :name.sync="listQuery.type" />
       <el-button  class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
       <el-button
			 type="primary"
			 icon="el-icon-plus"
			 @click="visible=true"
			>新增</el-button>
    </div>
      <el-table :data="list" row-key="id"  stripe style="width: 100%">
                <el-table-column prop="名称" label="名称"/>
        <el-table-column prop="编码" label="编码"/>
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
		<el-table-column prop="id" label="操作" width="100"   >
        	<template slot-scope="scope">
            	<el-button @click="edit(scope.row)" type="text" size="mini" icon="el-icon-edit"/>
			<el-button @click="del(scope.row)" type="text" size="mini" icon="el-icon-delete"/>
        	</template>
        </el-table-column>
      </el-table>  
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" /> 
  
  
  <el-dialog :visible.sync="visible" title="编辑">
  	<el-form :model="form">
			<el-form-item label="名称">
				<el-input v-model="form.名称"/>
			</el-form-item>
			<el-form-item label="编码">
				<el-input v-model="form.编码"/>
			</el-form-item>
			<el-form-item label="经度">
				<el-input v-model="form.lat"/>
			</el-form-item>
			<el-form-item label="纬度">
				<el-input v-model="form.lng"/>
			</el-form-item>
			<el-form-item label="省">
				<el-input v-model="form.province"/>
			</el-form-item>
			<el-form-item label="地区">
				<el-input v-model="form.region"/>
			</el-form-item>
			<el-form-item label="县">
				<el-input v-model="form.county"/>
			</el-form-item>
			<el-form-item label="乡（镇）">
				<el-input v-model="form.town"/>
			</el-form-item>
			<el-form-item label="街（村）">
				<el-input v-model="form.village"/>
			</el-form-item>
			<el-form-item label="行政区划代码">
				<el-input v-model="form.regimeCode"/>
			</el-form-item>
			<el-form-item label="所在水资源三级区名称及编码">
				<el-input v-model="form.threeCode"/>
			</el-form-item>
			<el-form-item label="取水水源类型">
				<el-input v-model="form.type"/>
			</el-form-item>
			<el-form-item label="河湖（水库）名称">
				<el-input v-model="form.riverName"/>
			</el-form-item>
			<el-form-item label="河湖（水库）编码">
				<el-input v-model="form.riverCode"/>
			</el-form-item>
			<el-form-item label="取水口个数（个）">
				<el-input v-model="form.getNum"/>
			</el-form-item>
			<el-form-item label="水质目标">
				<el-input v-model="form.cloumn1"/>
			</el-form-item>
			<el-form-item label="水源地水质是否监测">
				<el-input v-model="form.cloumn2"/>
			</el-form-item>
			<el-form-item label="水源地现状水质类别">
				<el-input v-model="form.cloumn3"/>
			</el-form-item>
			<el-form-item label="水源地水质是否达标">
				<el-input v-model="form.cloumn4"/>
			</el-form-item>
			<el-form-item label="是否划分水源保护区">
				<el-input v-model="form.cloumn5"/>
			</el-form-item>
			<el-form-item label="一级保护区水域面积（平方公里）">
				<el-input v-model="form.cloumn6"/>
			</el-form-item>
			<el-form-item label="一级保护区陆域面积（平方公里）">
				<el-input v-model="form.cloumn7"/>
			</el-form-item>
			<el-form-item label="一级保护区河长（公里）">
				<el-input v-model="form.cloumn8"/>
			</el-form-item>
			<el-form-item label="二级保护区水域面积（平方公里）">
				<el-input v-model="form.cloumn9"/>
			</el-form-item>
			<el-form-item label="二级保护区陆域面积（平方公里）">
				<el-input v-model="form.cloumn10"/>
			</el-form-item>
			<el-form-item label="二级保护区河长（公里）">
				<el-input v-model="form.cloumn11"/>
			</el-form-item>
			<el-form-item label="准保护区">
				<el-input v-model="form.cloumn12"/>
			</el-form-item>
			<el-form-item label="主要供水用途">
				<el-input v-model="form.cloumn13"/>
			</el-form-item>
			<el-form-item label="供水人口（万人）">
				<el-input v-model="form.cloumn14"/>
			</el-form-item>
			<el-form-item label="主要供水城镇名称1">
				<el-input v-model="form.cloumn15"/>
			</el-form-item>
			<el-form-item label="主要供水城镇名称2">
				<el-input v-model="form.cloumn16"/>
			</el-form-item>
			<el-form-item label="主要供水城镇名称3">
				<el-input v-model="form.cloumn17"/>
			</el-form-item>
			<el-form-item label="供水规模（万立方米/日）">
				<el-input v-model="form.cloumn18"/>
			</el-form-item>
			<el-form-item label="2011年供水量（万立方米）">
				<el-input v-model="form.cloumn19"/>
			</el-form-item>
			<el-form-item label="单位名称">
				<el-input v-model="form.deptName"/>
			</el-form-item>
			<el-form-item label="单位代码">
				<el-input v-model="form.deptCode"/>
			</el-form-item>
			<el-form-item label="所属行业">
				<el-input v-model="form.industry"/>
			</el-form-item>
			<el-form-item label="填表人员">
				<el-input v-model="form.recordMan"/>
			</el-form-item>
			<el-form-item label="填表联系人电话">
				<el-input v-model="form.recordPhone"/>
			</el-form-item>
			<el-form-item label="复核人员">
				<el-input v-model="form.reviewMan"/>
			</el-form-item>
			<el-form-item label="复核人联系电话">
				<el-input v-model="form.reviewPhone"/>
			</el-form-item>
			<el-form-item label="审查人员">
				<el-input v-model="form.auditMan"/>
			</el-form-item>
			<el-form-item label="审核标志">
				<el-input v-model="form.auditSymbol"/>
			</el-form-item>
			<el-form-item label="地区审核">
				<el-input v-model="form.regionAudit"/>
			</el-form-item>
			<el-form-item label="省级审核">
				<el-input v-model="form.provinceAudit"/>
			</el-form-item>
			<el-form-item label="中央审核">
				<el-input v-model="form.nationAudit"/>
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
import { getList } from '@/api/res/cradle.js'
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
      visible : false,
	  form: {
	  	名称:null,	  	
	  	编码:null,	  	
	  	lat:null,	  	
	  	lng:null,	  	
	  	province:null,	  	
	  	region:null,	  	
	  	county:null,	  	
	  	town:null,	  	
	  	village:null,	  	
	  	regimeCode:null,	  	
	  	threeCode:null,	  	
	  	type:null,	  	
	  	riverName:null,	  	
	  	riverCode:null,	  	
	  	getNum:null,	  	
	  	cloumn1:null,	  	
	  	cloumn2:null,	  	
	  	cloumn3:null,	  	
	  	cloumn4:null,	  	
	  	cloumn5:null,	  	
	  	cloumn6:null,	  	
	  	cloumn7:null,	  	
	  	cloumn8:null,	  	
	  	cloumn9:null,	  	
	  	cloumn10:null,	  	
	  	cloumn11:null,	  	
	  	cloumn12:null,	  	
	  	cloumn13:null,	  	
	  	cloumn14:null,	  	
	  	cloumn15:null,	  	
	  	cloumn16:null,	  	
	  	cloumn17:null,	  	
	  	cloumn18:null,	  	
	  	cloumn19:null,	  	
	  	deptName:null,	  	
	  	deptCode:null,	  	
	  	industry:null,	  	
	  	recordMan:null,	  	
	  	recordPhone:null,	  	
	  	reviewMan:null,	  	
	  	reviewPhone:null,	  	
	  	auditMan:null,	  	
	  	auditSymbol:null,	  	
	  	regionAudit:null,	  	
	  	provinceAudit:null,	  	
	  	nationAudit:null,	  	
	  },
      list:  null, 
      total: 0 ,
      listQuery: {
        pageNo: 1,
        pageSize: 10, 
        importance: undefined,
        search: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
    }
    },
  created() {
    this.getList()
  },
  methods: {
    getList() {  
        this.listLoading = true ;
        console.log("this.listQuery::::",this.listQuery);
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
	edit(row){
		//console.log(JSON.stringify(row));
		this.visible=true;
		this.form=row;
	},
	save(){
		//console.log('保存:',JSON.stringify(this.form),this.selectUser);
		this.visible=false;
		//
	},
	del(row){
		var self=this;
		//console.log(row); 
	}  
  }
}
</script>