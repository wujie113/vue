<template>
	<div>
		<div class="filter-container">
			<el-input placeholder="检索水库名称、编码" v-model="query.search" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
			<el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
			<el-button icon="el-icon-download" type="primary" @click="downloadExcel">下载水库数据模板</el-button>
			<el-button icon="el-icon-refresh" type="primary" @click="updateData">更新水库数据</el-button>
		</div>
		<el-table v-loading="listLoading" :data="list" border row-key="id" stripe style="width: 100%;">
			<el-table-column prop="name" label="水库名称" :show-overflow-tooltip="true" min-width="150px" />
			<el-table-column prop="code" label="水库编码" :show-overflow-tooltip="true" min-width="150px" />
			<el-table-column prop="lng" label="经度" :show-overflow-tooltip="true" />
			<el-table-column prop="lat" label="纬度" :show-overflow-tooltip="true" />
			<el-table-column prop="province" label="省" :show-overflow-tooltip="true" />
			<el-table-column prop="region" label="地区" :show-overflow-tooltip="true" />
			<el-table-column prop="county" label="县" :show-overflow-tooltip="true" />
			<el-table-column prop="town" label="乡（镇）" :show-overflow-tooltip="true" />
			<el-table-column prop="village" label="街（村）" :show-overflow-tooltip="true" />
			<el-table-column prop="regimeCode" label="行政区划代码" :show-overflow-tooltip="true" min-width="150px" />
			<el-table-column prop="threeCode" label="所在水资源三级区名称及编码" :show-overflow-tooltip="true" min-width="250px" />
			<el-table-column prop="riverName" label="所在河流（湖泊）名称" :show-overflow-tooltip="true" min-width="200px" />
			<el-table-column prop="riverCode" label="所在河流（湖泊）编码" :show-overflow-tooltip="true" min-width="200px" />
			<el-table-column prop="reservoirType" label="水库类型" :show-overflow-tooltip="true" min-width="200px" />
			<el-table-column prop="type" label="类型" :show-overflow-tooltip="true" min-width="200px" />
			<el-table-column prop="coloum1" label="挡水主坝类型按材料分" :show-overflow-tooltip="true" min-width="200px" />
			<el-table-column prop="column2" label="挡水主坝类型按结构分" :show-overflow-tooltip="true" min-width="200px" />
			<el-table-column prop="column3" label="主要泄洪建筑物型式" :show-overflow-tooltip="true" min-width="200px" />
			<el-table-column prop="column4" label="坝址控制流域面积（平方公里）" :show-overflow-tooltip="true" min-width="250px" />
			<el-table-column prop="column5" label="坝址多年平均径流量（万立方米）" :show-overflow-tooltip="true" min-width="250px" />
			<el-table-column prop="column6" label="生产安置人口（万人）" :show-overflow-tooltip="true" min-width="200px" />
			<el-table-column prop="column7" label="搬迁安置人口（万人）" :show-overflow-tooltip="true" min-width="200px" />
			<el-table-column prop="column8" label="工程建设情况" :show-overflow-tooltip="true" min-width="200px" />
			<el-table-column prop="column9" label="建成时间（年）" :show-overflow-tooltip="true" min-width="200px" />
			<el-table-column prop="column10" label="建成时间（月）" :show-overflow-tooltip="true" min-width="200px" />
			<el-table-column prop="column11" label="开工时间（年）" :show-overflow-tooltip="true" min-width="200px" />
			<el-table-column prop="column12" label="开工时间（月）" :show-overflow-tooltip="true" min-width="200px" />
			<el-table-column prop="column13" label="水库调节性能" :show-overflow-tooltip="true" min-width="200px" />
			<el-table-column prop="column14" label="工程等别" :show-overflow-tooltip="true" min-width="200px" />
			<el-table-column prop="column15" label="主坝级别" :show-overflow-tooltip="true" min-width="200px" />
			<el-table-column prop="column16" label="主坝尺寸坝高（m）" :show-overflow-tooltip="true" min-width="200px" />
			<el-table-column prop="column17" label="主坝尺寸坝长（m）" :show-overflow-tooltip="true" min-width="200px" />
			<el-table-column prop="column18" label="最大泄洪流量（立方米/S）" :show-overflow-tooltip="true" min-width="200px" />
			<el-table-column prop="column19" label="高程系统" :show-overflow-tooltip="true" min-width="200px" />
			<el-table-column prop="column20" label="坝顶高程(m)" :show-overflow-tooltip="true" min-width="200px" />
			<el-table-column prop="column21" label="设计洪水标准［重现期］（年）" :show-overflow-tooltip="true" min-width="250px" />
			<el-table-column prop="column22" label="校核洪水标准［重现期］（年）" :show-overflow-tooltip="true" min-width="250px" />
			<el-table-column prop="column23" label="校核洪水位(m)" :show-overflow-tooltip="true" min-width="200px" />
			<el-table-column prop="column24" label="设计洪水位(m)" :show-overflow-tooltip="true" min-width="200px" />
			<el-table-column prop="column25" label="防洪高水位(m)" :show-overflow-tooltip="true" min-width="200px" />
			<el-table-column prop="column26" label="正常蓄水位(m)" :show-overflow-tooltip="true" min-width="200px" />
			<el-table-column prop="column27" label="防洪限制水位(m)" :show-overflow-tooltip="true" min-width="200px" />
			<el-table-column prop="column28" label="死水位(m)" :show-overflow-tooltip="true" min-width="200px" />
			<el-table-column prop="column29" label="总库容（万立方米）" :show-overflow-tooltip="true" min-width="200px" />
			<el-table-column prop="column30" label="调洪库容（万立方米）" :show-overflow-tooltip="true" min-width="200px" />
			<el-table-column prop="column31" label="防洪库容（万立方米）" :show-overflow-tooltip="true" min-width="200px" />
			<el-table-column prop="column32" label="兴利库容（万立方米）" :show-overflow-tooltip="true" min-width="200px" />
			<el-table-column prop="column33" label="死库容(万立方米)" :show-overflow-tooltip="true" min-width="200px" />
			<el-table-column prop="column34" label="正常蓄水位相应水面面积（平方公里）" :show-overflow-tooltip="true" min-width="300px" />
			<el-table-column prop="column35" label="防洪" :show-overflow-tooltip="true" />
			<el-table-column prop="column36" label="发电" :show-overflow-tooltip="true" />
			<el-table-column prop="column37" label="供水" :show-overflow-tooltip="true" />
			<el-table-column prop="column38" label="灌溉" :show-overflow-tooltip="true" />
			<el-table-column prop="column39" label="航运" :show-overflow-tooltip="true" />
			<el-table-column prop="column40" label="养殖" :show-overflow-tooltip="true" />
			<el-table-column prop="column41" label="其它" :show-overflow-tooltip="true" />
			<el-table-column prop="column42" label="重要保护对象" :show-overflow-tooltip="true" min-width="200px" />
			<el-table-column prop="column43" label="设计年供水量" :show-overflow-tooltip="true" min-width="200px" />
			<el-table-column prop="column44" label="2011年供水量(万立方米)" :show-overflow-tooltip="true" min-width="200px" />
			<el-table-column prop="column45" label="2011年供水量数据来源" :show-overflow-tooltip="true" min-width="200px" />
			<el-table-column prop="column46" label="取水口数量（个）" :show-overflow-tooltip="true" min-width="200px" />
			<el-table-column prop="column47" label="供水对象" :show-overflow-tooltip="true" min-width="200px" />
			<el-table-column prop="column48" label="设计灌溉面积（万亩）" :show-overflow-tooltip="true" min-width="200px" />
			<el-table-column prop="column49" label="灌溉对象：灌区名称" :show-overflow-tooltip="true" min-width="200px" />
			<el-table-column prop="column50" label="水库管理单位名称" :show-overflow-tooltip="true" min-width="200px" />
			<el-table-column prop="column51" label="水库管理单位代码" :show-overflow-tooltip="true" min-width="200px" />
			<el-table-column prop="column52" label="水库归口管理部门" :show-overflow-tooltip="true" min-width="200px" />
			<el-table-column prop="division" label="是否完成划界" :show-overflow-tooltip="true" min-width="200px" />
			<el-table-column prop="confirm" label="是否完成确权" :show-overflow-tooltip="true" min-width="200px" />
			<el-table-column prop="recordMan" label="填表人员" :show-overflow-tooltip="true" min-width="200px" />
			<el-table-column prop="recordPhone" label="填表联系人电话" :show-overflow-tooltip="true" min-width="200px" />
			<el-table-column prop="reviewMan" label="复核人员" :show-overflow-tooltip="true" min-width="200px" />
			<el-table-column prop="reviewPhone" label="复核人联系电话" :show-overflow-tooltip="true" min-width="200px" />
			<el-table-column prop="auditMan" label="审查人员" :show-overflow-tooltip="true" min-width="200px" />
			<el-table-column prop="auditSymbol" label="审核标志" :show-overflow-tooltip="true" min-width="200px" />
			<el-table-column prop="regionAudit" label="地区审核" :show-overflow-tooltip="true" min-width="200px" />
			<el-table-column prop="provinceAudit" label="省级审核" :show-overflow-tooltip="true" min-width="200px" />
			<el-table-column prop="nationAudit" label="中央审核" :show-overflow-tooltip="true" min-width="200px" />
			<el-table-column prop="id" label="操作" width="100">
				<template slot-scope="scope">
					<el-button @click="edit(scope.row)" type="text" size="mini" icon="el-icon-edit" />
					<el-button @click="del(scope.row)" type="text" size="mini" icon="el-icon-delete" />
				</template>
			</el-table-column>
		</el-table>
		<pagination v-show="query.total>0" :total="query.total" :page.sync="query.pageNo" :limit.sync="query.pageSize" @pagination="getList" />

		<el-dialog :visible.sync="v.formhistory" title="历史上传资源文件列表" :append-to-body="false" :close-on-click-modal="false" :modal="false" :modal-append-to-body="false">
			<el-table v-loading="listLoadingHistory" :data="listDate" row-key="id" stripe border>
				<el-table-column type="index" label="序号" width="50" />
				<el-table-column prop="CreateDate" label="上传时间" width="150" />
				<el-table-column prop="name" label="文件名" width="250" />
				<el-table-column prop="id" label="操作" min-width="100">
					<template slot-scope="scope">
						<el-button type="primary" size="mini" title="导出该时间上传资源文件"><a :href="(scope.row.url)">导出</a></el-button>
						<el-button @click="get(scope.row)" type="primary" size="mini" title="资源恢复到该时间上传的文件">恢复</el-button>
						<el-button @click="del(scope.row)" type="primary" size="mini" title="删除该时间上传的文件">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-dialog>

		<el-dialog :visible.sync="v.formupdate" title="上传提示" :append-to-body="false" :close-on-click-modal="false" :modal="false" :modal-append-to-body="false" width="30%">
			<el-form :model="form" abel-width="80px" size="mini" class="leftBox">
				<el-form-item label="文件格式要求为：">
					<span style="color:red">.xls</span>(Excel 97-2018工作簿)
				</el-form-item>
				<el-form-item label="文件必需包含字段：">
					名称<br />县名<br />经度（如：113.8569）<br />纬度（如：27.6253）<br />
				</el-form-item>
			</el-form>
			<el-upload :action="uploadaction" :show-file-list="false" :limit="1" accept=".xlsx,.xls" class="upload-demo" :before-upload="beforeUpload" :data="uploaddata" :on-success="handleSuccess" :on-error="handlError">
				<el-button type="primary" size="mini">去上传</el-button>
			</el-upload>
		</el-dialog>
	</div>
</template> 
<script>
import Pagination from "@/components/Pagination";
import {
	getList,
	get,
	save,
	del,
	getfiles,
	delBtn
} from "@/api/res/reservoir.js";
import RmDict from "@/components/rm/dict";
import RmOrgSelect from "@/components/rm/orgselect";
import RmUserSelect from "@/components/rm/userselect";
import RmAreaSelect from "@/components/rm/areaselect";
import { getToken } from "@/utils/auth";
export default {
	components: { Pagination, RmDict, RmOrgSelect, RmUserSelect, RmAreaSelect },
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
			v: {
				formhistory: false,
				loading: false,
				formupdate: false
			},
			list: null,
			uploadaction:
				process.env.BASE_API + "/api/res/reservoir/import?token=" + getToken(),
			query: {
				total: 0,
				pageNo: 1,
				pageSize: 10,
				search: undefined,
				type: undefined
			},
			listLoading: null,
			listDate: null,
			listLoadingHistory: null,
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
				reservoirType: null,
				type: null,
				coloum1: null,
				column2: null,
				column3: null,
				column4: null,
				column5: null,
				column6: null,
				column7: null,
				column8: null,
				column9: null,
				column10: null,
				column11: null,
				column12: null,
				column13: null,
				column14: null,
				column15: null,
				column16: null,
				column17: null,
				column18: null,
				column19: null,
				column20: null,
				column21: null,
				column22: null,
				column23: null,
				column24: null,
				column25: null,
				column26: null,
				column27: null,
				column28: null,
				column29: null,
				column30: null,
				column31: null,
				column32: null,
				column33: null,
				column34: null,
				column35: null,
				column36: null,
				column37: null,
				column38: null,
				column39: null,
				column40: null,
				column41: null,
				column42: null,
				column43: null,
				column44: null,
				column45: null,
				column46: null,
				column47: null,
				column48: null,
				column49: null,
				column50: null,
				column51: null,
				column52: null,
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
			uploaddata: {
				bizId: 10003,
				bizType: "sk"
			}
		};
	},

	created() {
		this.getList();
	},
	methods: {
		getList() {
			this.listLoading = true;
			getList(this.query).then(response => {
				this.listLoading = false;
				this.list = response.data.list;
				this.query.total = response.data.count;
			});
		},
		downloadExcel() {
			this.v.formhistory = true;
			this.listLoadingHistory = true;
			getfiles(this.uploaddata).then(response => {
				this.listDate = response.data;
				this.listLoadingHistory = false;
			});
		},

		updateData() {
			this.v.formupdate = true;
		},
		beforeUpload(file) {
			this.listLoading = true;
			this.v.formupdate = false;
		},
		handleFilter() {
			this.query.pageNo = 1;
			this.getList();
		},
		handleSuccess(respone) {
			if (respone.success == true) {
				this.$message({
					message: "导入数据成功",
					type: "success"
				});
			} else {
				this.$message({
					message: respone.msg,
					type: "error"
				});
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
		create() {
			this.v.form = true;
			this.form = {};
		},
		edit(row) {
			//console.log(JSON.stringify(row));
			this.v.form = true;
			this.form = row;
		},
		del(row) {
			this.listLoadingHistory = true;
			delBtn(row.id).then(response => {
				this.listLoadingHistory = false;
				this.$message({
					message: '删除数据成功',
					type: 'success'
				});
				this.downloadExcel();
			});
		},
		save() {
			//console.log('保存:',JSON.stringify(this.form),this.selectUser);
			save(this.form).then(response => {
				this.v.form = false;
				if (response.success) {
					this.$message(response.msg);
					//添加到列表中
					this.list.unshift(this.form);
				} else {
					this.$message({
						message: response.msg,
						type: "warning"
					});
				}
			});
		},
		get(row) {
			this.listLoading = true;
			this.v.formhistory = false;
			this.query.search = "";
			get(row.id).then(response => {			
				this.$message({
					message: '恢复数据成功',
					type: 'success'
				});
				this.listLoading = false;
				this.getList();
			});
		},
		del(row) {
			//var self = this
			//console.log(row)
			del(row.id).then(response => {
				this.v.form = false;
				if (response.success) {
					this.$message(response.msg);
					//删除列表数据
					const index = this.list.indexOf(row); //找到要删除数据在list中的位置
					this.list.splice(index, 1); //通过splice 删除数据
				} else {
					this.$message({
						message: response.msg,
						type: "warning"
					});
				}
			});
		}
	}
};
</script>
<style>
.leftBox .el-form-item__content {
  float: left;
}
</style>
