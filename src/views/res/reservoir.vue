<template>
  <div class="app-container">
    <div class="filter-container"> 

       <el-input placeholder="检索水库名称、编码" v-model="query.search" style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter"/>
       <el-button  class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
       <el-upload :action="uploadaction"  :show-file-list="false" :limit="1" accept=".xlsx,.xls" class="upload-demo"
              :before-upload="beforeUpload"  
				:data="uploaddata"   :on-success="handleSuccess"   :on-error="handlError">
				<el-button  class="filter-item"  type="primary">点击上传</el-button> 
		</el-upload>
    </div>
      <el-table :data="list" row-key="id"  stripe style="width: 100%">
               <el-table-column prop="name" label="水库名称"/>
        <el-table-column prop="code" label="水库编码"/>
        <el-table-column prop="lat" label="经度"/>
        <el-table-column prop="lng" label="纬度"/>
        <el-table-column prop="province" label="省"/>
        <el-table-column prop="region" label="地区"/>
        <el-table-column prop="county" label="县"/>
        <el-table-column prop="town" label="乡（镇）"/>
        <el-table-column prop="village" label="街（村）"/>
        <el-table-column prop="regimeCode" label="行政区划代码"/>
        <el-table-column prop="threeCode" label="所在水资源三级区名称及编码"/>
        <el-table-column prop="riverName" label="所在河流（湖泊）名称"/>
        <el-table-column prop="riverCode" label="所在河流（湖泊）编码"/>
        <el-table-column prop="reservoirType" label="水库类型"/>
        <el-table-column prop="type" label="类型"/>
        <el-table-column prop="coloum1" label="挡水主坝类型按材料分"/>
        <el-table-column prop="column2" label="挡水主坝类型按结构分"/>
        <el-table-column prop="column3" label="主要泄洪建筑物型式"/>
        <el-table-column prop="column4" label="坝址控制流域面积（平方公里）"/>
        <el-table-column prop="column5" label="坝址多年平均径流量（万立方米）"/>
        <el-table-column prop="column6" label="生产安置人口（万人）"/>
        <el-table-column prop="column7" label="搬迁安置人口（万人）"/>
        <el-table-column prop="column8" label="工程建设情况"/>
        <el-table-column prop="column9" label="建成时间（年）"/>
        <el-table-column prop="column10" label="建成时间（月）"/>
        <el-table-column prop="column11" label="开工时间（年）"/>
        <el-table-column prop="column12" label="开工时间（月）"/>
        <el-table-column prop="column13" label="水库调节性能"/>
        <el-table-column prop="column14" label="工程等别"/>
        <el-table-column prop="column15" label="主坝级别"/>
        <el-table-column prop="column16" label="主坝尺寸坝高（m）"/>
        <el-table-column prop="column17" label="主坝尺寸坝长（m）"/>
        <el-table-column prop="column18" label="最大泄洪流量（立方米/S）"/>
        <el-table-column prop="column19" label="高程系统"/>
        <el-table-column prop="column20" label="坝顶高程(m)"/>
        <el-table-column prop="column21" label="设计洪水标准［重现期］（年）"/>
        <el-table-column prop="column22" label="校核洪水标准［重现期］（年）"/>
        <el-table-column prop="column23" label="校核洪水位(m)"/>
        <el-table-column prop="column24" label="设计洪水位(m)"/>
        <el-table-column prop="column25" label="防洪高水位(m)"/>
        <el-table-column prop="column26" label="正常蓄水位(m)"/>
        <el-table-column prop="column27" label="防洪限制水位(m)"/>
        <el-table-column prop="column28" label="死水位(m)"/>
        <el-table-column prop="column29" label="总库容（万立方米）"/>
        <el-table-column prop="column30" label="调洪库容（万立方米）"/>
        <el-table-column prop="column31" label="防洪库容（万立方米）"/>
        <el-table-column prop="column32" label="兴利库容（万立方米）"/>
        <el-table-column prop="column33" label="死库容(万立方米)"/>
        <el-table-column prop="column34" label="正常蓄水位相应水面面积（平方公里）"/>
        <el-table-column prop="column35" label="防洪"/>
        <el-table-column prop="column36" label="发电"/>
        <el-table-column prop="column37" label="供水"/>
        <el-table-column prop="column38" label="灌溉"/>
        <el-table-column prop="column39" label="航运"/>
        <el-table-column prop="column40" label="养殖            养殖"/>
        <el-table-column prop="column41" label="其它"/>
        <el-table-column prop="column42" label="重要保护对象"/>
        <el-table-column prop="column43" label="设计年供水量"/>
        <el-table-column prop="column44" label="2011年供水量(万立方米)"/>
        <el-table-column prop="column45" label="2011年供水量数据来源"/>
        <el-table-column prop="column46" label="取水口数量（个）"/>
        <el-table-column prop="column47" label="供水对象"/>
        <el-table-column prop="column48" label="设计灌溉面积（万亩）"/>
        <el-table-column prop="column49" label="灌溉对象：灌区名称"/>
        <el-table-column prop="column50" label="水库管理单位名称"/>
        <el-table-column prop="column51" label="水库管理单位代码"/>
        <el-table-column prop="column52" label="水库归口管理部门"/>
        <el-table-column prop="division" label="是否完成划界"/>
        <el-table-column prop="confirm" label="是否完成确权"/>
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
			<el-form-item label="水库名称">
				<el-input v-model="form.name" placeholder="请输入水库名称"/>
			</el-form-item>
			<el-form-item label="水库编码">
				<el-input v-model="form.code" placeholder="请输入水库编码"/>
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
			<el-form-item label="所在河流（湖泊）名称">
				<el-input v-model="form.riverName" placeholder="请输入所在河流（湖泊）名称"/>
			</el-form-item>
			<el-form-item label="所在河流（湖泊）编码">
				<el-input v-model="form.riverCode" placeholder="请输入所在河流（湖泊）编码"/>
			</el-form-item>
			<el-form-item label="水库类型">
				<el-input v-model="form.reservoirType" placeholder="请输入水库类型"/>
			</el-form-item>
			<el-form-item label="类型">
				<el-input v-model="form.type" placeholder="请输入类型"/>
			</el-form-item>
			<el-form-item label="挡水主坝类型按材料分">
				<el-input v-model="form.coloum1" placeholder="请输入挡水主坝类型按材料分"/>
			</el-form-item>
			<el-form-item label="挡水主坝类型按结构分">
				<el-input v-model="form.column2" placeholder="请输入挡水主坝类型按结构分"/>
			</el-form-item>
			<el-form-item label="主要泄洪建筑物型式">
				<el-input v-model="form.column3" placeholder="请输入主要泄洪建筑物型式"/>
			</el-form-item>
			<el-form-item label="坝址控制流域面积（平方公里）">
				<el-input v-model="form.column4" placeholder="请输入坝址控制流域面积（平方公里）"/>
			</el-form-item>
			<el-form-item label="坝址多年平均径流量（万立方米）">
				<el-input v-model="form.column5" placeholder="请输入坝址多年平均径流量（万立方米）"/>
			</el-form-item>
			<el-form-item label="生产安置人口（万人）">
				<el-input v-model="form.column6" placeholder="请输入生产安置人口（万人）"/>
			</el-form-item>
			<el-form-item label="搬迁安置人口（万人）">
				<el-input v-model="form.column7" placeholder="请输入搬迁安置人口（万人）"/>
			</el-form-item>
			<el-form-item label="工程建设情况">
				<el-input v-model="form.column8" placeholder="请输入工程建设情况"/>
			</el-form-item>
			<el-form-item label="建成时间（年）">
				<el-input v-model="form.column9" placeholder="请输入建成时间（年）"/>
			</el-form-item>
			<el-form-item label="建成时间（月）">
				<el-input v-model="form.column10" placeholder="请输入建成时间（月）"/>
			</el-form-item>
			<el-form-item label="开工时间（年）">
				<el-input v-model="form.column11" placeholder="请输入开工时间（年）"/>
			</el-form-item>
			<el-form-item label="开工时间（月）">
				<el-input v-model="form.column12" placeholder="请输入开工时间（月）"/>
			</el-form-item>
			<el-form-item label="水库调节性能">
				<el-input v-model="form.column13" placeholder="请输入水库调节性能"/>
			</el-form-item>
			<el-form-item label="工程等别">
				<el-input v-model="form.column14" placeholder="请输入工程等别"/>
			</el-form-item>
			<el-form-item label="主坝级别">
				<el-input v-model="form.column15" placeholder="请输入主坝级别"/>
			</el-form-item>
			<el-form-item label="主坝尺寸坝高（m）">
				<el-input v-model="form.column16" placeholder="请输入主坝尺寸坝高（m）"/>
			</el-form-item>
			<el-form-item label="主坝尺寸坝长（m）">
				<el-input v-model="form.column17" placeholder="请输入主坝尺寸坝长（m）"/>
			</el-form-item>
			<el-form-item label="最大泄洪流量（立方米/S）">
				<el-input v-model="form.column18" placeholder="请输入最大泄洪流量（立方米/S）"/>
			</el-form-item>
			<el-form-item label="高程系统">
				<el-input v-model="form.column19" placeholder="请输入高程系统"/>
			</el-form-item>
			<el-form-item label="坝顶高程(m)">
				<el-input v-model="form.column20" placeholder="请输入坝顶高程(m)"/>
			</el-form-item>
			<el-form-item label="设计洪水标准［重现期］（年）">
				<el-input v-model="form.column21" placeholder="请输入设计洪水标准［重现期］（年）"/>
			</el-form-item>
			<el-form-item label="校核洪水标准［重现期］（年）">
				<el-input v-model="form.column22" placeholder="请输入校核洪水标准［重现期］（年）"/>
			</el-form-item>
			<el-form-item label="校核洪水位(m)">
				<el-input v-model="form.column23" placeholder="请输入校核洪水位(m)"/>
			</el-form-item>
			<el-form-item label="设计洪水位(m)">
				<el-input v-model="form.column24" placeholder="请输入设计洪水位(m)"/>
			</el-form-item>
			<el-form-item label="防洪高水位(m)">
				<el-input v-model="form.column25" placeholder="请输入防洪高水位(m)"/>
			</el-form-item>
			<el-form-item label="正常蓄水位(m)">
				<el-input v-model="form.column26" placeholder="请输入正常蓄水位(m)"/>
			</el-form-item>
			<el-form-item label="防洪限制水位(m)">
				<el-input v-model="form.column27" placeholder="请输入防洪限制水位(m)"/>
			</el-form-item>
			<el-form-item label="死水位(m)">
				<el-input v-model="form.column28" placeholder="请输入死水位(m)"/>
			</el-form-item>
			<el-form-item label="总库容（万立方米）">
				<el-input v-model="form.column29" placeholder="请输入总库容（万立方米）"/>
			</el-form-item>
			<el-form-item label="调洪库容（万立方米）">
				<el-input v-model="form.column30" placeholder="请输入调洪库容（万立方米）"/>
			</el-form-item>
			<el-form-item label="防洪库容（万立方米）">
				<el-input v-model="form.column31" placeholder="请输入防洪库容（万立方米）"/>
			</el-form-item>
			<el-form-item label="兴利库容（万立方米）">
				<el-input v-model="form.column32" placeholder="请输入兴利库容（万立方米）"/>
			</el-form-item>
			<el-form-item label="死库容(万立方米)">
				<el-input v-model="form.column33" placeholder="请输入死库容(万立方米)"/>
			</el-form-item>
			<el-form-item label="正常蓄水位相应水面面积（平方公里）">
				<el-input v-model="form.column34" placeholder="请输入正常蓄水位相应水面面积（平方公里）"/>
			</el-form-item>
			<el-form-item label="防洪">
				<el-input v-model="form.column35" placeholder="请输入防洪"/>
			</el-form-item>
			<el-form-item label="发电">
				<el-input v-model="form.column36" placeholder="请输入发电"/>
			</el-form-item>
			<el-form-item label="供水">
				<el-input v-model="form.column37" placeholder="请输入供水"/>
			</el-form-item>
			<el-form-item label="灌溉">
				<el-input v-model="form.column38" placeholder="请输入灌溉"/>
			</el-form-item>
			<el-form-item label="航运">
				<el-input v-model="form.column39" placeholder="请输入航运"/>
			</el-form-item>
			<el-form-item label="养殖            养殖">
				<el-input v-model="form.column40" placeholder="请输入养殖            养殖"/>
			</el-form-item>
			<el-form-item label="其它">
				<el-input v-model="form.column41" placeholder="请输入其它"/>
			</el-form-item>
			<el-form-item label="重要保护对象">
				<el-input v-model="form.column42" placeholder="请输入重要保护对象"/>
			</el-form-item>
			<el-form-item label="设计年供水量">
				<el-input v-model="form.column43" placeholder="请输入设计年供水量"/>
			</el-form-item>
			<el-form-item label="2011年供水量(万立方米)">
				<el-input v-model="form.column44" placeholder="请输入2011年供水量(万立方米)"/>
			</el-form-item>
			<el-form-item label="2011年供水量数据来源">
				<el-input v-model="form.column45" placeholder="请输入2011年供水量数据来源"/>
			</el-form-item>
			<el-form-item label="取水口数量（个）">
				<el-input v-model="form.column46" placeholder="请输入取水口数量（个）"/>
			</el-form-item>
			<el-form-item label="供水对象">
				<el-input v-model="form.column47" placeholder="请输入供水对象"/>
			</el-form-item>
			<el-form-item label="设计灌溉面积（万亩）">
				<el-input v-model="form.column48" placeholder="请输入设计灌溉面积（万亩）"/>
			</el-form-item>
			<el-form-item label="灌溉对象：灌区名称">
				<el-input v-model="form.column49" placeholder="请输入灌溉对象：灌区名称"/>
			</el-form-item>
			<el-form-item label="水库管理单位名称">
				<el-input v-model="form.column50" placeholder="请输入水库管理单位名称"/>
			</el-form-item>
			<el-form-item label="水库管理单位代码">
				<el-input v-model="form.column51" placeholder="请输入水库管理单位代码"/>
			</el-form-item>
			<el-form-item label="水库归口管理部门">
				<el-input v-model="form.column52" placeholder="请输入水库归口管理部门"/>
			</el-form-item>
			<el-form-item label="是否完成划界">
				<el-input v-model="form.division" placeholder="请输入是否完成划界"/>
			</el-form-item>
			<el-form-item label="是否完成确权">
				<el-input v-model="form.confirm" placeholder="请输入是否完成确权"/>
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
import { getList,get,save,del } from '@/api/res/reservoir.js'
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
	  uploadaction: process.env.BASE_API+'/api/res/reservoir/import?token='+getToken(),   
      query: {
      	total: 0 ,
        pageNo: 1,
        pageSize: 10, 
        search: undefined,
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
	  	threeCode:null,	  	
	  	riverName:null,	  	
	  	riverCode:null,	  	
	  	reservoirType:null,	  	
	  	type:null,	  	
	  	coloum1:null,	  	
	  	column2:null,	  	
	  	column3:null,	  	
	  	column4:null,	  	
	  	column5:null,	  	
	  	column6:null,	  	
	  	column7:null,	  	
	  	column8:null,	  	
	  	column9:null,	  	
	  	column10:null,	  	
	  	column11:null,	  	
	  	column12:null,	  	
	  	column13:null,	  	
	  	column14:null,	  	
	  	column15:null,	  	
	  	column16:null,	  	
	  	column17:null,	  	
	  	column18:null,	  	
	  	column19:null,	  	
	  	column20:null,	  	
	  	column21:null,	  	
	  	column22:null,	  	
	  	column23:null,	  	
	  	column24:null,	  	
	  	column25:null,	  	
	  	column26:null,	  	
	  	column27:null,	  	
	  	column28:null,	  	
	  	column29:null,	  	
	  	column30:null,	  	
	  	column31:null,	  	
	  	column32:null,	  	
	  	column33:null,	  	
	  	column34:null,	  	
	  	column35:null,	  	
	  	column36:null,	  	
	  	column37:null,	  	
	  	column38:null,	  	
	  	column39:null,	  	
	  	column40:null,	  	
	  	column41:null,	  	
	  	column42:null,	  	
	  	column43:null,	  	
	  	column44:null,	  	
	  	column45:null,	  	
	  	column46:null,	  	
	  	column47:null,	  	
	  	column48:null,	  	
	  	column49:null,	  	
	  	column50:null,	  	
	  	column51:null,	  	
	  	column52:null,	  	
	  	division:null,	  	
	  	confirm:null,	  	
	  	recordMan:null,	  	
	  	recordPhone:null,	  	
	  	reviewMan:null,	  	
	  	reviewPhone:null,	  	
	  	auditMan:null,	  	
	  	auditSymbol:null,	  	
	  	regionAudit:null,	  	
	  	provinceAudit:null,	  	
	  	nationAudit:null,	  	
	  } ,
	  uploaddata:{
        bizId:10001,
        bizType:"SZ"
      },
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
     handleFilter() {
      this.query.pageNo = 1
      this.getList()
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
		this.listQuery.search = ""
		this.fileList = [];
		this.getList(); 
	},
	handlError(){  
		this.$message({
          message: '导入数据失败',
          type: 'error'
		}); 
		this.listQuery.search = ""
		this.fileList = [];
		this.getList(); 
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
<style>
.upload-demo {
	display: inline-block;
}
</style>
