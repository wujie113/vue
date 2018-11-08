<template>
  <div class="app-container">
    <div class="filter-container"> 
       <el-input placeholder="检索排污口名称、编码" v-model="query.search" style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter"/>
       <el-button  class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>

       <el-upload :action="uploadaction"  :show-file-list="false" :limit="1" accept=".xlsx,.xls" class="upload-demo"
              :before-upload="beforeUpload"  
				:data="uploaddata"   :on-success="handleSuccess"   :on-error="handlError">
				<el-button  class="filter-item"  type="primary">点击上传</el-button> 
		</el-upload>
    </div>
      <el-table :data="list" row-key="id"  stripe style="width: 100%">
        <el-table-column prop="name" label="排污口名称"/>
        <el-table-column prop="code" label="排污口编码"/>
        <el-table-column prop="lat" label="经度"/>
        <el-table-column prop="lng" label="纬度"/>
        <el-table-column prop="province" label="省"/>
        <el-table-column prop="region" label="地区"/>
        <el-table-column prop="county" label="县"/>
        <el-table-column prop="town" label="乡（镇）"/>
        <el-table-column prop="village" label="街（村）"/>
        <el-table-column prop="regimeCode" label="行政区划代码"/>
        <el-table-column prop="threeCode" label="所在水资源三级区名称及编码"/>
        <el-table-column prop="type" label="排入水域类型"/>
        <el-table-column prop="reservoirName" label="水库名称"/>
        <el-table-column prop="reservoirCode" label="水库编码"/>
        <el-table-column prop="lakeName" label="湖泊名称"/>
        <el-table-column prop="lankeCode" label="湖泊编码"/>
        <el-table-column prop="riverName" label="河流名称"/>
        <el-table-column prop="riverCode" label="河流编码"/>
        <el-table-column prop="isFunction" label="是否划定水功能区"/>
        <el-table-column prop="firstType" label="水功能一级区类别"/>
        <el-table-column prop="firstName" label="水功能一级区名称"/>
        <el-table-column prop="secondType" label="水功能二级区类别"/>
        <el-table-column prop="secondName" label="水功能二级区名称"/>
        <el-table-column prop="isApproval" label="是否已登记或取得许可批准"/>
        <el-table-column prop="approvalNum" label="批准（或登记）的废污水年排放量（万吨）"/>
        <el-table-column prop="approvalYear" label="取得入河湖排污许可(或登记)时间-年"/>
        <el-table-column prop="approvalMonth" label="取得入河湖排污许可(或登记)时间-月"/>
        <el-table-column prop="auditLevel" label="审批级别"/>
        <el-table-column prop="auditDept" label="设置部门"/>
        <el-table-column prop="approvalY2011" label="2011年入河湖废污水量（万吨）"/>
        <el-table-column prop="sewageMethod" label="入河湖废污水量数据取得方式"/>
        <el-table-column prop="sewageSource" label="污水主要来源"/>
        <el-table-column prop="sewageType" label="污水分类情况"/>
        <el-table-column prop="isEectric" label="是否为电厂温排水"/>
        <el-table-column prop="regular" label="排放规律"/>
        <el-table-column prop="sewageRiver" label="入河湖排污方式"/>
        <el-table-column prop="sewageName1" label="主要排污单位名称1"/>
        <el-table-column prop="sewageName2" label="主要排污单位名称2"/>
        <el-table-column prop="sewageName3" label="主要排污单位名称3"/>
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
    <pagination v-show="query.total>0" :total="query.total" :page.sync="query.pageNo" :limit.sync="query.pageSize" @pagination="getList" /> 
  
  
  <el-dialog :visible.sync="v.form" title="编辑">
  	<el-form ref="form" :model="form" label-width="120px">
			<el-form-item label="排污口名称">
				<el-input v-model="form.name" placeholder="请输入排污口名称"/>
			</el-form-item>
			<el-form-item label="排污口编码">
				<el-input v-model="form.code" placeholder="请输入排污口编码"/>
			</el-form-item>
			<el-form-item label="经度">
				<el-input v-model="form.lat" placeholder="请输入经度"/>
			</el-form-item>
			<el-form-item label="纬度">
				<el-input v-model="form.lng" placeholder="请输入纬度"/>
			</el-form-item>
			<el-form-item label="省">
				<el-input v-model="form.province" placeholder="请输入省"/>
			</el-form-item>
			<el-form-item label="地区">
				<el-input v-model="form.region" placeholder="请输入地区"/>
			</el-form-item>
			<el-form-item label="县">
				<el-input v-model="form.county" placeholder="请输入县"/>
			</el-form-item>
			<el-form-item label="乡（镇）">
				<el-input v-model="form.town" placeholder="请输入乡（镇）"/>
			</el-form-item>
			<el-form-item label="街（村）">
				<el-input v-model="form.village" placeholder="请输入街（村）"/>
			</el-form-item>
			<el-form-item label="行政区划代码">
				<el-input v-model="form.regimeCode" placeholder="请输入行政区划代码"/>
			</el-form-item>
			<el-form-item label="所在水资源三级区名称及编码">
				<el-input v-model="form.threeCode" placeholder="请输入所在水资源三级区名称及编码"/>
			</el-form-item>
			<el-form-item label="排入水域类型">
				<el-input v-model="form.type" placeholder="请输入排入水域类型"/>
			</el-form-item>
			<el-form-item label="水库名称">
				<el-input v-model="form.reservoirName" placeholder="请输入水库名称"/>
			</el-form-item>
			<el-form-item label="水库编码">
				<el-input v-model="form.reservoirCode" placeholder="请输入水库编码"/>
			</el-form-item>
			<el-form-item label="湖泊名称">
				<el-input v-model="form.lakeName" placeholder="请输入湖泊名称"/>
			</el-form-item>
			<el-form-item label="湖泊编码">
				<el-input v-model="form.lankeCode" placeholder="请输入湖泊编码"/>
			</el-form-item>
			<el-form-item label="河流名称">
				<el-input v-model="form.riverName" placeholder="请输入河流名称"/>
			</el-form-item>
			<el-form-item label="河流编码">
				<el-input v-model="form.riverCode" placeholder="请输入河流编码"/>
			</el-form-item>
			<el-form-item label="是否划定水功能区">
				<el-input v-model="form.isFunction" placeholder="请输入是否划定水功能区"/>
			</el-form-item>
			<el-form-item label="水功能一级区类别">
				<el-input v-model="form.firstType" placeholder="请输入水功能一级区类别"/>
			</el-form-item>
			<el-form-item label="水功能一级区名称">
				<el-input v-model="form.firstName" placeholder="请输入水功能一级区名称"/>
			</el-form-item>
			<el-form-item label="水功能二级区类别">
				<el-input v-model="form.secondType" placeholder="请输入水功能二级区类别"/>
			</el-form-item>
			<el-form-item label="水功能二级区名称">
				<el-input v-model="form.secondName" placeholder="请输入水功能二级区名称"/>
			</el-form-item>
			<el-form-item label="是否已登记或取得许可批准">
				<el-input v-model="form.isApproval" placeholder="请输入是否已登记或取得许可批准"/>
			</el-form-item>
			<el-form-item label="批准（或登记）的废污水年排放量（万吨）">
				<el-input v-model="form.approvalNum" placeholder="请输入批准（或登记）的废污水年排放量（万吨）"/>
			</el-form-item>
			<el-form-item label="取得入河湖排污许可(或登记)时间-年">
				<el-input v-model="form.approvalYear" placeholder="请输入取得入河湖排污许可(或登记)时间-年"/>
			</el-form-item>
			<el-form-item label="取得入河湖排污许可(或登记)时间-月">
				<el-input v-model="form.approvalMonth" placeholder="请输入取得入河湖排污许可(或登记)时间-月"/>
			</el-form-item>
			<el-form-item label="审批级别">
				<el-input v-model="form.auditLevel" placeholder="请输入审批级别"/>
			</el-form-item>
			<el-form-item label="设置部门">
				<el-input v-model="form.auditDept" placeholder="请输入设置部门"/>
			</el-form-item>
			<el-form-item label="2011年入河湖废污水量（万吨）">
				<el-input v-model="form.approvalY2011" placeholder="请输入2011年入河湖废污水量（万吨）"/>
			</el-form-item>
			<el-form-item label="入河湖废污水量数据取得方式">
				<el-input v-model="form.sewageMethod" placeholder="请输入入河湖废污水量数据取得方式"/>
			</el-form-item>
			<el-form-item label="污水主要来源">
				<el-input v-model="form.sewageSource" placeholder="请输入污水主要来源"/>
			</el-form-item>
			<el-form-item label="污水分类情况">
				<el-input v-model="form.sewageType" placeholder="请输入污水分类情况"/>
			</el-form-item>
			<el-form-item label="是否为电厂温排水">
				<el-input v-model="form.isEectric" placeholder="请输入是否为电厂温排水"/>
			</el-form-item>
			<el-form-item label="排放规律">
				<el-input v-model="form.regular" placeholder="请输入排放规律"/>
			</el-form-item>
			<el-form-item label="入河湖排污方式">
				<el-input v-model="form.sewageRiver" placeholder="请输入入河湖排污方式"/>
			</el-form-item>
			<el-form-item label="主要排污单位名称1">
				<el-input v-model="form.sewageName1" placeholder="请输入主要排污单位名称1"/>
			</el-form-item>
			<el-form-item label="主要排污单位名称2">
				<el-input v-model="form.sewageName2" placeholder="请输入主要排污单位名称2"/>
			</el-form-item>
			<el-form-item label="主要排污单位名称3">
				<el-input v-model="form.sewageName3" placeholder="请输入主要排污单位名称3"/>
			</el-form-item>
			<el-form-item label="填表人员">
				<el-input v-model="form.recordMan" placeholder="请输入填表人员"/>
			</el-form-item>
			<el-form-item label="填表联系人电话">
				<el-input v-model="form.recordPhone" placeholder="请输入填表联系人电话"/>
			</el-form-item>
			<el-form-item label="复核人员">
				<el-input v-model="form.reviewMan" placeholder="请输入复核人员"/>
			</el-form-item>
			<el-form-item label="复核人联系电话">
				<el-input v-model="form.reviewPhone" placeholder="请输入复核人联系电话"/>
			</el-form-item>
			<el-form-item label="审查人员">
				<el-input v-model="form.auditMan" placeholder="请输入审查人员"/>
			</el-form-item>
			<el-form-item label="审核标志">
				<el-input v-model="form.auditSymbol" placeholder="请输入审核标志"/>
			</el-form-item>
			<el-form-item label="地区审核">
				<el-input v-model="form.regionAudit" placeholder="请输入地区审核"/>
			</el-form-item>
			<el-form-item label="省级审核">
				<el-input v-model="form.provinceAudit" placeholder="请输入省级审核"/>
			</el-form-item>
			<el-form-item label="中央审核">
				<el-input v-model="form.nationAudit" placeholder="请输入中央审核"/>
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
import { getList,get,save,del } from '@/api/res/sewage.js'
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
      v: {
          form: false,
          loading: false
        },
			list:  null, 
			uploadaction: process.env.BASE_API+'/api/res/sewage/import?token='+getToken(),     
      query: {
      	total: 0 ,
        pageNo: 1,
        pageSize: 10, 
        search: undefined,
        type: undefined
			},
		 uploaddata:{
        bizId:10001,
        bizType:"SZ"
	  },
	   fileList:[],
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
	  	threeCode:null,	  	
	  	type:null,	  	
	  	reservoirName:null,	  	
	  	reservoirCode:null,	  	
	  	lakeName:null,	  	
	  	lankeCode:null,	  	
	  	riverName:null,	  	
	  	riverCode:null,	  	
	  	isFunction:null,	  	
	  	firstType:null,	  	
	  	firstName:null,	  	
	  	secondType:null,	  	
	  	secondName:null,	  	
	  	isApproval:null,	  	
	  	approvalNum:null,	  	
	  	approvalYear:null,	  	
	  	approvalMonth:null,	  	
	  	auditLevel:null,	  	
	  	auditDept:null,	  	
	  	approvalY2011:null,	  	
	  	sewageMethod:null,	  	
	  	sewageSource:null,	  	
	  	sewageType:null,	  	
	  	isEectric:null,	  	
	  	regular:null,	  	
	  	sewageRiver:null,	  	
	  	sewageName1:null,	  	
	  	sewageName2:null,	  	
	  	sewageName3:null,	  	
	  	recordMan:null,	  	
	  	recordPhone:null,	  	
	  	reviewMan:null,	  	
	  	reviewPhone:null,	  	
	  	auditMan:null,	  	
	  	auditSymbol:null,	  	
	  	regionAudit:null,	  	
	  	provinceAudit:null,	  	
	  	nationAudit:null,	  	
	  }
    }
    },
  created() {
    this.getList()
  },
  methods: {
    getList() {  
        this.listLoading = true ;
        console.log("this.query::::",this.query);
        getList(this.query).then(response => { 
          this.listLoading = false 
           this.list = response.data.list
           this.query.total = response.data.count
        })
		},
		 beforeUpload(file){ 
		  this.listLoading = true 
 	 },
handleSuccess(respone){  
		if(respone.success==true){
			this.$message({
				message: '导入数据成功',
				type: 'success'
        	}); 
		}else{
			this.$message({
				message: respone.msg,
				type: 'error'
        	}); 
		}
		this.query.search = ""
		this.fileList = [];
		this.getList(); 
	},
	handlError(){  
		this.$message({
          message: '导入数据失败',
          type: 'error'
		}); 
		this.query.search= ""
		this.fileList = [];
		this.getList(); 
	}, 
     handleFilter() {
      this.query.pageNo = 1
      this.getList()
    },
    create() {
        this.v.form = true
        this.form = {}
    },
	edit(row){
		//console.log(JSON.stringify(row));
		this.v.form=true;
		this.form=row;
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
<style <style lang="scss" scoped>
	.upload-demo {
		display: inline-block;
	}
	</style>