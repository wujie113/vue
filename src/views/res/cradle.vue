<template>
  <div>
    <div class="filter-container">
      <el-input placeholder="检索水源地编码、名称" v-model="listQuery.search" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button icon="el-icon-download" type="primary" @click="downloadExcel">下载水源地数据模板</el-button>
      <el-button icon="el-icon-refresh" type="primary" @click="updateData">更新水源地数据</el-button>

    </div>
    <el-table v-loading="listLoading" :data="list" border row-key="id" stripe style="width: 100%">
      <el-table-column prop="name" label="水源地名称" :show-overflow-tooltip="true" min-width="220" />
      <el-table-column prop="code" label="水源地编码" :show-overflow-tooltip="true" min-width="120" />
      <el-table-column prop="lng" label="经度" :show-overflow-tooltip="true" min-width="100" />
      <el-table-column prop="lat" label="纬度" :show-overflow-tooltip="true" min-width="100" />
      <el-table-column prop="province" label="省" :show-overflow-tooltip="true" min-width="100" />
      <el-table-column prop="region" label="地区" :show-overflow-tooltip="true" min-width="180" />
      <el-table-column prop="county" label="县" :show-overflow-tooltip="true" min-width="180" />
      <el-table-column prop="town" label="乡（镇）" :show-overflow-tooltip="true" min-width="180" />
      <el-table-column prop="village" label="街（村）" :show-overflow-tooltip="true" min-width="180" />
      <el-table-column prop="regimeCode" label="行政区划代码" :show-overflow-tooltip="true" min-width="180" />
      <el-table-column prop="threeCode" label="所在水资源三级区名称及编码" :show-overflow-tooltip="true" min-width="210" />
      <el-table-column prop="type" label="取水水源类型" :show-overflow-tooltip="true" min-width="180" />
      <el-table-column prop="riverName" label="河湖（水库）名称" :show-overflow-tooltip="true" min-width="180" />
      <el-table-column prop="riverCode" label="河湖（水库）编码" :show-overflow-tooltip="true" min-width="180" />
      <el-table-column prop="getNum" label="取水口个数（个）" :show-overflow-tooltip="true" min-width="180" />
      <el-table-column prop="cloumn1" label="水质目标" :show-overflow-tooltip="true" min-width="180" />
      <el-table-column prop="cloumn2" label="水源地水质是否监测" :show-overflow-tooltip="true" min-width="180" />
      <el-table-column prop="cloumn3" label="水源地现状水质类别" :show-overflow-tooltip="true" min-width="180" />
      <el-table-column prop="cloumn4" label="水源地水质是否达标" :show-overflow-tooltip="true" min-width="180" />
      <el-table-column prop="cloumn5" label="是否划分水源保护区" :show-overflow-tooltip="true" min-width="180" />
      <el-table-column prop="cloumn6" label="一级保护区水域面积（平方公里）" :show-overflow-tooltip="true" min-width="240" />
      <el-table-column prop="cloumn7" label="一级保护区陆域面积（平方公里）" :show-overflow-tooltip="true" min-width="240" />
      <el-table-column prop="cloumn8" label="一级保护区河长（公里）" :show-overflow-tooltip="true" min-width="240" />
      <el-table-column prop="cloumn9" label="二级保护区水域面积（平方公里）" :show-overflow-tooltip="true" min-width="240" />
      <el-table-column prop="cloumn10" label="二级保护区陆域面积（平方公里）" :show-overflow-tooltip="true" min-width="240" />
      <el-table-column prop="cloumn11" label="二级保护区河长（公里）" :show-overflow-tooltip="true" min-width="240" />
      <el-table-column prop="cloumn12" label="准保护区" :show-overflow-tooltip="true" min-width="180" />
      <el-table-column prop="cloumn13" label="主要供水用途" :show-overflow-tooltip="true" min-width="180" />
      <el-table-column prop="cloumn14" label="供水人口（万人）" :show-overflow-tooltip="true" min-width="180" />
      <el-table-column prop="cloumn15" label="主要供水城镇名称1" :show-overflow-tooltip="true" min-width="180" />
      <el-table-column prop="cloumn16" label="主要供水城镇名称2" :show-overflow-tooltip="true" min-width="180" />
      <el-table-column prop="cloumn17" label="主要供水城镇名称3" :show-overflow-tooltip="true" min-width="180" />
      <el-table-column prop="cloumn18" label="供水规模（万立方米/日）" :show-overflow-tooltip="true" min-width="210" />
      <el-table-column prop="cloumn19" label="2011年供水量（万立方米）" :show-overflow-tooltip="true" min-width="210" />
      <el-table-column prop="deptName" label="单位名称" :show-overflow-tooltip="true" min-width="100" />
      <el-table-column prop="deptCode" label="单位代码" :show-overflow-tooltip="true" min-width="100" />
      <el-table-column prop="industry" label="所属行业" :show-overflow-tooltip="true" min-width="100" />
      <el-table-column prop="recordMan" label="填表人员" :show-overflow-tooltip="true" min-width="100" />
      <el-table-column prop="recordPhone" label="填表联系人电话" :show-overflow-tooltip="true" min-width="150" />
      <el-table-column prop="reviewMan" label="复核人员" :show-overflow-tooltip="true" min-width="150" />
      <el-table-column prop="reviewPhone" label="复核人联系电话" :show-overflow-tooltip="true" min-width="150" />
      <el-table-column prop="auditMan" label="审查人员" :show-overflow-tooltip="true" min-width="120" />
      <el-table-column prop="auditSymbol" label="审核标志" :show-overflow-tooltip="true" min-width="100" />
      <el-table-column prop="regionAudit" label="地区审核" :show-overflow-tooltip="true" min-width="100" />
      <el-table-column prop="provinceAudit" label="省级审核" :show-overflow-tooltip="true" min-width="100" />
      <el-table-column prop="nationAudit" label="中央审核" :show-overflow-tooltip="true" min-width="150" />
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog :visible.sync="v.formhistory" title="历史上传资源文件列表" width="60%" :append-to-body="false" :close-on-click-modal="false" :modal="false" :modal-append-to-body="false">
      <el-table v-loading="listLoadingHistory" :data="listDate" row-key="id" stripe  border>
        <el-table-column type="index" label="序号" width="50" />
        <el-table-column prop="CreateDate" label="上传时间" width="150" />
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
      <el-upload :action="uploadaction" :show-file-list="false" :limit="1" accept=".xlsx,.xls" class="upload-demo" :before-upload="beforeUpload" :data="uploaddata" :on-success="handleSuccess" :on-error="handlError">
        <el-button type="primary" size="mini">去上传</el-button>
      </el-upload>
    </el-dialog>
  </div>
</template> 
<script>
import Pagination from "@/components/Pagination";
import { getList, getfiles, get, delBtn } from "@/api/res/cradle.js";
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
        listLoading: false,
        loading: false,
        formupdate: false,
        formhistory: false
      },
      listLoading: null,
      listLoadingHistory: null,
      listDate: null,
      uploadaction:
        process.env.BASE_API + "/api/res/cradle/import?token=" + getToken(),
      list: null,
      uploaddata: {
        bizId: 10002,
        bizType: "syd"
      },
      total: 0,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        importance: undefined,
        search: undefined,
        type: undefined,
        sort: "+id"
      },
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
        type: null,
        riverName: null,
        riverCode: null,
        getNum: null,
        cloumn1: null,
        cloumn2: null,
        cloumn3: null,
        cloumn4: null,
        cloumn5: null,
        cloumn6: null,
        cloumn7: null,
        cloumn8: null,
        cloumn9: null,
        cloumn10: null,
        cloumn11: null,
        cloumn12: null,
        cloumn13: null,
        cloumn14: null,
        cloumn15: null,
        cloumn16: null,
        cloumn17: null,
        cloumn18: null,
        cloumn19: null,
        deptName: null,
        deptCode: null,
        industry: null,
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
      importanceOptions: [1, 2, 3]
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
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
        this.listDate = response.data;
        this.listLoadingHistory = false;
      });
    },
    updateData() {
      this.v.formupdate = true;
    },
    handleFilter() {
      this.listQuery.pageNo = 1;
      this.getList();
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
    del(row) {
      var self = this;
      //console.log(row);
    },
    beforeUpload(file) {
      this.listLoading = true;
      this.v.formupdate = false;
    },
    handleFilter() {
      this.listQuery.pageNo = 1;
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
    }
  }
};
</script>
