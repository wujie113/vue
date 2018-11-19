<template>
  <div>
    <div class="filter-container">
      <el-input placeholder="检索堤防名称、编码" v-model="query.search" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>

      <el-button icon="el-icon-download" type="primary" @click="downloadExcel">下载堤防数据模板</el-button>
      <el-button icon="el-icon-refresh" type="primary" @click="updateData">更新堤防数据</el-button>

    </div>
    <el-table v-loading="listLoading" :data="list" border row-key="id" stripe style="width: 100%">
      <el-table-column prop="name" label="堤防名称" :show-overflow-tooltip="true" min-width="150px" />
      <el-table-column prop="code" label="堤防编码" :show-overflow-tooltip="true" min-width="150px" />
      <el-table-column prop="startLng" label="起点坐标经度" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="startLat" label="起点坐标纬度" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="endLng" label="终点坐标经度" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="endLat" label="终点坐标纬度" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="startProvince" label="起点位置 省" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="startRegion" label="起点位置 地区" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="startCounty" label="起点位置 县" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="startTower" label="起点位置 乡（镇）" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="startVillage" label="起点位置 街（村）" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="startRegimeCode" label="起点 行政区划代码" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="endProvince" label="终点位置 省" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="endRegion" label="终点位置 地区" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="endCounty" label="终点位置 县" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="endTown" label="终点位置 乡" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="endVillage" label="终点位置 村" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="endRegimeCode" label="终点 行政区划代码" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="riverName" label="所在河流(湖泊、海岸)名称" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="riverCode" label="所在河流(湖泊、海岸)编码" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="riverType" label="河流岸别" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="crossover" label="堤防跨界情况" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="category" label="堤防类型" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="method" label="堤防型式" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="bulid" label="工程建设情况" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="buildedYear" label="建成时间（年）" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="buildedMonth" label="建成时间（月）" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="buildYear" label="开工时间（年）" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="buildMonth" label="开工时间（月）" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="projectTask" label="工程任务" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="level" label="堤防级别" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="planYear" label="规划防洪(潮)标准［重现期］（年）" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="length" label="堤防长度(m)" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="achieveLength" label="达到规划防洪（潮）标准的长度(m)" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="elevation" label="高程系统" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="startElevation" label="堤顶高程（起点高程(m)）" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="endElevation" label="堤顶高程（终点高程(m)）" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="water" label="设计水（高潮）位(m)" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="heightMax" label="堤防高度(m)（最大值）" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="heightMin" label="堤防高度(m)（最小值）" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="widthMax" label="堤顶宽度(m)（最大值）" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="widthMin" label="堤顶宽度(m)（最小值）" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="lockNum" label="水闸数量(个)" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="tubeNum" label="管涵数量(个)" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="pumpNum" label="泵站数量(处)" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="siphonNum" label="倒虹吸数量(个)" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="mangerName" label="堤防工程管理单位名称" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="mangerCode" label="堤防工程管理单位编码" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="underManger" label="堤防工程归口管理部门" :show-overflow-tooltip="true" min-width="200px" />
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
      <el-table v-loading="listLoadingHistory" :data="listDate" row-key="id" stripe width="90%" border>
        <el-table-column type="index" label="序号" width="50" />
        <el-table-column prop="CreateDate" label="上传时间" width="150" />
        <el-table-column prop="name" label="文件名" width="250" />
        <el-table-column prop="id" label="操作" min-width="150">
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
} from "@/api/res/riverWall.js";
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
      uploadaction:
        process.env.BASE_API + "/api/res/riverWall/import?token=" + getToken(),
      list: null,
      query: {
        total: 0,
        pageNo: 1,
        pageSize: 10,
        search: undefined,
        type: undefined
      },
      uploaddata: {
        bizId: 10008,
        bizType: "df"
      },
      listLoading: null,
      listLoadingHistory: null,
      listDate: null,
      form: {
        name: null,
        code: null,
        startLng: null,
        startLat: null,
        endLng: null,
        endLat: null,
        startProvince: null,
        startRegion: null,
        startCounty: null,
        startTower: null,
        startVillage: null,
        startRegimeCode: null,
        endProvince: null,
        endRegion: null,
        endCounty: null,
        endTown: null,
        endVillage: null,
        endRegimeCode: null,
        riverName: null,
        riverCode: null,
        riverType: null,
        crossover: null,
        category: null,
        method: null,
        bulid: null,
        buildedYear: null,
        buildedMonth: null,
        buildYear: null,
        buildMonth: null,
        projectTask: null,
        level: null,
        planYear: null,
        length: null,
        achieveLength: null,
        elevation: null,
        startElevation: null,
        endElevation: null,
        water: null,
        heightMax: null,
        heightMin: null,
        widthMax: null,
        widthMin: null,
        lockNum: null,
        tubeNum: null,
        pumpNum: null,
        siphonNum: null,
        mangerName: null,
        mangerCode: null,
        underManger: null,
        recordMan: null,
        recordPhone: null,
        reviewMan: null,
        reviewPhone: null,
        auditMan: null,
        auditSymbol: null,
        regionAudit: null,
        provinceAudit: null,
        nationAudit: null
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      console.log("this.query::::", this.query);
      getList(this.query).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
        this.query.total = response.data.count;
      });
    },
    beforeUpload(file) {
      this.listLoading = true;
      this.v.formupdate = false;
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
    handleFilter() {
      this.query.pageNo = 1;
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