<template>
    <div class="filter-container">  
	  <div class="filter-container">
		<el-input placeholder="检索水闸编码、名称" v-model="listQuery.search" style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter"/> 
		<el-button  class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
		<el-upload :action="uploadaction"  :show-file-list="false" :limit="1" accept=".xlsx,.xls" class="upload-demo"
              :before-upload="beforeUpload"  :file-list="fileList"
				:data="uploaddata"   :on-success="handleSuccess"   :on-error="handlError">
				<el-button  class="filter-item"  type="primary">点击上传</el-button> 
		</el-upload>
	  </div> 
		<el-table  v-loading="listLoading" :data="list"    border  fit highlight-current-row  row-key="id"  stripe style="width: 100%">
        <el-table-column prop="name" label="名称" min-width="110"/>
        <el-table-column prop="code" label="编码" min-width="160"/>
        <el-table-column prop="lat" label="经度" min-width="160"/>
        <el-table-column prop="lng" label="纬度" min-width="160"/>
        <el-table-column prop="province" label="省" min-width="110"/>
        <el-table-column prop="region" label="地区" min-width="110"/>
        <el-table-column prop="county" label="县" min-width="110"/>
        <el-table-column prop="town" label="乡（镇）" min-width="200" :show-overflow-tooltip="true"/>
        <el-table-column prop="village" label="街（村）" min-width="220" :show-overflow-tooltip="true"/>
        <el-table-column prop="regimeCode" label="行政区划代码" min-width="220"/>
        <el-table-column prop="threeCode" label="所在水资源三级区名称及编码"     min-width="220"/>
        <el-table-column prop="riverName" label="所在河流（湖、库、渠、海堤）名称" min-width="250"/>
        <el-table-column prop="riverCode" label="所在河流（湖、库、渠、海堤）编码" min-width="250"/>
        <el-table-column prop="coloum1" label="所在灌区(引调水工程)名称" min-width="220"/>
        <el-table-column prop="coloum2" label="所在灌区(引调水工程)编码" min-width="220"/>
        <el-table-column prop="coloum3" label="是否为闸站工程" min-width="220"/>
        <el-table-column prop="coloum4" label="是否为套闸工程" min-width="220"/>
        <el-table-column prop="coloum5" label="工程建设情况" min-width="220"/>
        <el-table-column prop="coloum6" label="建成时间（年）" min-width="220"/>
        <el-table-column prop="coloum7" label="建成时间（月）" min-width="220"/>
        <el-table-column prop="coloum8" label="开工时间（年）" min-width="220"/>
        <el-table-column prop="coloum9" label="开工时间（月）" min-width="220"/>
        <el-table-column prop="coloum10" label="工程等别" min-width="220"/>
        <el-table-column prop="coloum11" label="主要建筑物级别" min-width="220"/>
        <el-table-column prop="coloum12" label="闸孔数量（孔）" min-width="220"/>
        <el-table-column prop="coloum13" label="闸孔总净宽（米）" min-width="220"/>
        <el-table-column prop="coloum14" label="副闸闸孔数量（孔）" min-width="220"/>
        <el-table-column prop="coloum15" label="副闸闸孔总净宽（米）" min-width="220"/>
        <el-table-column prop="coloum16" label="水闸类型" min-width="140"/>
        <el-table-column prop="coloum17" label="分(泄)洪闸过闸流量(立方米/秒)" min-width="220"/>
        <el-table-column prop="coloum18" label="分(泄)洪闸设计洪水标准［重现期］（年）" min-width="330"/>
        <el-table-column prop="coloum19" label="分(泄)洪闸校核洪水标准［重现期］（（年）" min-width="330"/>
        <el-table-column prop="coloum20" label="节制闸过闸流量(立方米/秒)" min-width="250"/>
        <el-table-column prop="coloum21" label="节制闸设计洪水标准［重现期］（年）" min-width="280"/>
        <el-table-column prop="coloum22" label="节制闸校核洪水标准［重现期］（年）" min-width="280"/>
        <el-table-column prop="coloum23" label="排(退)水闸过闸流量(立方米/秒)" min-width="220"/>
        <el-table-column prop="coloum24" label="排(退)水闸设计洪水标准［重现期］（年）" min-width="330"/>
        <el-table-column prop="coloum25" label="排(退)水闸校核洪水标准［重现期］（年）" min-width="330"/>
        <el-table-column prop="coloum26" label="排(退)水闸是否为引排双向闸" min-width="220"/>
        <el-table-column prop="coloum27" label="引(进)水闸过闸流量(立方米/秒)" min-width="220"/>
        <el-table-column prop="coloum28" label="引(进)水闸设计洪水标准［重现期］（年）" min-width="330"/>
        <el-table-column prop="coloum29" label="引(进)水闸校核洪水标准［重现期］（年）" min-width="330"/>
        <el-table-column prop="coloum30" label="引(进)水闸引水能力(万立方米)" min-width="220"/>
        <el-table-column prop="coloum31" label="引(进)水闸引水用途供水对象" min-width="220"/>
        <el-table-column prop="coloum32" label="引(进)水闸引水用途灌区名称" min-width="220"/>
        <el-table-column prop="coloum33" label="引(进)水闸是否为引排双向闸" min-width="220"/>
        <el-table-column prop="coloum34" label="挡潮闸过闸流量(立方米/秒)" min-width="220"/>
        <el-table-column prop="coloum35" label="挡潮闸设计潮水标准［重现期］（年）" min-width="330"/>
        <el-table-column prop="coloum36" label="挡潮闸校核潮水标准［重现期］（年）" min-width="330"/>
        <el-table-column prop="coloum37" label="橡胶坝坝高（米）" min-width="220"/>
        <el-table-column prop="coloum38" label="橡胶坝坝长（米）" min-width="220"/>
        <el-table-column prop="coloum39" label="橡胶坝高程系统" min-width="220"/>
        <el-table-column prop="coloum40" label="橡胶坝坝顶高程（米）" min-width="220"/>
        <el-table-column prop="coloum41" label="水闸管理单位名称" min-width="320" :show-overflow-tooltip="true"/>
        <el-table-column prop="coloum42" label="水闸管理单位代码" min-width="220"/>
        <el-table-column prop="coloum43" label="水闸归口管理部门" min-width="220"/>
        <el-table-column prop="division" label="是否完成划界" min-width="220"/>
        <el-table-column prop="confirm" label="是否完成确权" min-width="220"/>
        <el-table-column prop="recordMan" label="填表人员" min-width="220"/>
        <el-table-column prop="recordPhone" label="填表联系人电话" min-width="220"/>
        <el-table-column prop="reviewMan" label="复核人员" min-width="150"/>
        <el-table-column prop="reviewPhone" label="复核人联系电话" min-width="150"/>
        <el-table-column prop="auditMan" label="审查人员" min-width="150"/>
        <el-table-column prop="auditSymbol" label="审核标志" min-width="150"/>
        <el-table-column prop="regionAudit" label="地区审核" min-width="150"/>
        <el-table-column prop="provinceAudit" label="省级审核" min-width="150"/>
        <el-table-column prop="nationAudit" label="中央审核" min-width="150"/> 
      </el-table>  
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />  
   </div>
</template> 
<script> 
import Pagination from '@/components/Pagination' 
import { getList } from '@/api/res/sluice.js'
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
	  listLoading:null,
	  fileList:[],
	  form: {
	  	name: null,	  	
	  	code: null,	  	
	  	lat: null,	  	
	  	lng: null,	  	
	  	province: null,	  	
	  	region: null,	  	
	  	county: null,	  	
	  	town: null,	  	
	  	village: null,	  	
	  	regimeCode: null,	  	
	  	threeCode: null,	  	
	  	riverName: null,	  	
	  	riverCode: null,	  	
	  	coloum1: null,	  	
	  	coloum2: null,	  	
	  	coloum3: null,	  	
	  	coloum4: null,	  	
	  	coloum5: null,	  	
	  	coloum6: null,	  	
	  	coloum7: null,	  	
	  	coloum8: null,	  	
	  	coloum9: null,	  	
	  	coloum10: null,	  	
	  	coloum11: null,	  	
	  	coloum12: null,	  	
	  	coloum13: null,	  	
	  	coloum14: null,	  	
	  	coloum15: null,	  	
	  	coloum16: null,	  	
	  	coloum17: null,	  	
	  	coloum18: null,	  	
	  	coloum19: null,	  	
	  	coloum20: null,	  	
	  	coloum21: null,	  	
	  	coloum22: null,	  	
	  	coloum23: null,	  	
	  	coloum24: null,	  	
	  	coloum25: null,	  	
	  	coloum26: null,	  	
	  	coloum27: null,	  	
	  	coloum28: null,	  	
	  	coloum29: null,	  	
	  	coloum30: null,	  	
	  	coloum31: null,	  	
	  	coloum32: null,	  	
	  	coloum33: null,	  	
	  	coloum34: null,	  	
	  	coloum35: null,	  	
	  	coloum36: null,	  	
	  	coloum37: null,	  	
	  	coloum38: null,	  	
	  	coloum39: null,	  	
	  	coloum40: null,	  	
	  	coloum41: null,	  	
	  	coloum42: null,	  	
	  	coloum43: null,	  	
	  	division: null,	  	
	  	confirm: null,	  	
	  	recordMan: null,	  	
	  	recordPhone: null,	  	
	  	reviewMan: null,	  	
	  	reviewPhone: null,	  	
	  	auditMan: null,	  	
	  	auditSymbol: null,	  	
	  	regionAudit: null,	  	
	  	provinceAudit: null,	  	
	  	nationAudit: null	  	
	  },
	  list: null, 
	  uploadaction: process.env.BASE_API+'/api/res/sluice/import2?token='+getToken(),
      total: 0 ,
      listQuery: {
        pageNo: 1,
        pageSize: 10, 
        importance: undefined,
        search: undefined,
        type: undefined,
        sort: '+id'
	  },
	  uploaddata:{
        bizId:10001,
        bizType:"SZ"
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
	
	elTableHeadFunction(h,l,fontSize) { 
			let f = 14;
			if(typeof(fontSize) != "undefined" && fontSize != null){
				f = fontSize;
			}
			//列头的实际宽度
			let width = l.column.realWidth;
			//14：字体大小 32 是el表格的左右 padding 的合
			let maxFontCount = Math.floor((width-32)/f)-1;
			let chars =  l.column.label.split("");
			var label = "";
			if(maxFontCount < chars.length){
				for (let i = 0; i < maxFontCount; i++){
					label += chars[i];
				}
				label +="..";
			}else{
				label = l.column.label;
			}
			console.log(label);
			return label;
	},
	labelHead(h,{column,index}){
                    let l = column.label.length
                    let f = 16 //每个字大小，其实是每个字的比例值，大概会比字体大小差不多大一点，
                   column.minWidth = f*l //字大小乘个数即长度 ,注意不要加px像素，这里minWidth只是一个比例值，不是真正的长度
　　　　　　　　　　　　//然后将列标题放在一个div块中，注意块的宽度一定要100%，否则表格显示不完全
                  return h('div',{class:'table-head',style:{width:'100%'}},[column.label])
     
    }
  }
}
</script>
<style <style lang="scss" scoped>
.el-table th>.cell {
	white-space: nowrap;
}
.upload-demo {
	display: inline-block;
}
</style>