<template>
  <div>
    <div class="filter-container">
      <el-input placeholder="检索水电站名称、编码" v-model="listQuery.search" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>

      <el-button icon="el-icon-download" type="primary" @click="downloadExcel">下载水电站数据模板</el-button>
      <el-button icon="el-icon-refresh" type="primary" @click="updateData">更新水电站数据</el-button>

    </div>
    <el-table  @current-change="handleCurrentChange" v-loading="listLoading" :data="list" border row-key="id" stripe style="width: 100%">
      <el-table-column type="index" label="序号" />
      <el-table-column prop="name" label="水电站名称" :show-overflow-tooltip="true" min-width="150px" />
      <el-table-column prop="code" label="水电站编码" :show-overflow-tooltip="true" min-width="150px" />
      <el-table-column prop="lng" label="厂房中点地理坐标(经度)" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="lat" label="厂房中点地理坐标(纬度)" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="province" label="省" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="region" label="地区" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="county" label="县" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="town" label="乡（镇）" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="village" label="街（村）" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="regimeCode" label="行政区划代码" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="threeCode" label="所在水资源三级区名称及编码" :show-overflow-tooltip="true" min-width="250px" />
      <el-table-column prop="riverName" label="所在河流（湖泊）名称" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="riverCode" label="所在河流（湖泊）编码" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="isPower" label="是否利用水库发电" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="reservoirName" label="水库名称" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="reservoirCode" label="水库编码" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="type" label="水电站类型" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="column1" label="生产安置人口（万人）" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="column2" label="搬迁安置人口（万人）" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="column3" label="建成时间（年）" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="column4" label="建成时间（月）" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="column5" label="开工时间（年）" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="column6" label="开工时间（月）" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="column7" label="工程等别" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="column8" label="主要建筑物级别" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="column9" label="装机容量（kW）" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="column10" label="保证出力（kW）" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="column11" label="额定水头(m)" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="column12" label="机组台数(台)" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="column13" label="多年平均发电量(万kW&middot;h)" :show-overflow-tooltip="true" min-width="250px" />
      <el-table-column prop="column14" label="2011年发电量(万kW&middot;h)" :show-overflow-tooltip="true" min-width="250px" />
      <el-table-column prop="column15" label="水电站管理单位名称" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="column16" label="水电站管理单位代码" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="column17" label="独立核算单位性质" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="column18" label="水电站归口管理部门" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="column19" label="工程建设情况" :show-overflow-tooltip="true" min-width="200px" />
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
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog :visible.sync="v.formhistory" title="历史上传资源文件列表" width="60%" :append-to-body="false" :close-on-click-modal="false" :modal="false" :modal-append-to-body="false">
      <el-table v-loading="listLoadingHistory" :data="listDate" row-key="id" stripe   border>
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
    <el-dialog :visible.sync="v.formupdate" title="上传提示" :append-to-body="false" :close-on-click-modal="false" :modal="false" :modal-append-to-body="false" width="30%">
      <el-form :model="form" abel-width="80px" size="mini" class="leftBox">
        <el-form-item label="文件格式要求为：">
          <span style="color:red">.xls</span>(Excel 97-2018工作簿)
        </el-form-item>
        <el-form-item label="文件必需包含字段：">
          名称<br />县名<br />经度（如：113.8569）<br />纬度（如：27.6253）<br />
        </el-form-item>
      </el-form>
      <el-upload :action="uploadaction" :show-file-list="false"  accept=".xlsx,.xls" class="upload-demo" :before-upload="beforeUpload" :data="uploaddata" :on-success="handleSuccess" :on-error="handlError">
        <el-button type="primary" size="mini">去上传</el-button>
      </el-upload>
    </el-dialog>
  </div>
</template> 
<script>
import Pagination from "@/components/Pagination";
import { getList, getfiles, get, delBtn } from "@/api/res/waterSubstation.js";
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
        form: false,
        formhistory: false,
        loading: false,
        formupdate: false
      },
      visible: false,
      listLoading: null,
      listLoadingHistory: null,
      listDate: null,
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
        isPower: null,
        reservoirName: null,
        reservoirCode: null,
        type: null,
        column1: null,
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
      uploadaction:
        process.env.BASE_API +
        "/api/res/waterSubstation/import?token=" +
        getToken(),
      total: 0,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        importance: undefined,
        search: undefined,
        type: undefined,
        sort: "+id"
      },
      uploaddata: {
        bizId: 10006,
        bizType: "sdz"
      },
      importanceOptions: [1, 2, 3]
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      console.log("this.listQuery::::", this.listQuery);
      getList(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.count;
      });
    },
    downloadExcel() {
      this.v.formhistory = true;
      this.listLoadingHistory = true;
      getfiles(this.uploaddata).then(response => {
        this.listDate = response.uploadexcelarr;
        this.listLoadingHistory = false;
      });
    },
    handleCurrentChange(row){
			console.log(row)
			  this.$emit('clickRow', { id: row.id, gtype: 'shuidz', name: row.name, lng: row.lng, lat: row.lat })
		},
    updateData() {
      this.v.formupdate = true;
    },
    beforeUpload(file) {
      this.listLoading = true;
      this.v.formupdate = false;
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
      this.listQuery.search = "";
      this.getList();
    },
    handlError() {
      this.$message({
        message: "导入数据失败",
        type: "error"
      });
      this.listQuery.search = "";
      this.getList();
    },
    handleFilter() {
      this.listQuery.pageNo = 1;
      this.getList();
    },
    edit(row) {
      //console.log(JSON.stringify(row));
      this.visible = true;
      this.form = row;
    },
    save() {
      //console.log('保存:',JSON.stringify(this.form),this.selectUser);
      this.visible = false;
      //
    },
    get(row) {
      this.listLoading = true;
      this.v.formhistory = false;
      this.listQuery.search = "";
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
      this.listLoadingHistory = true;
      delBtn(row.id).then(response => {
        this.listLoadingHistory = false;
        this.$message({
          message: '删除数据成功',
          type: 'success'
        });
        this.downloadExcel();
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
