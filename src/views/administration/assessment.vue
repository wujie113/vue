<template>
  <div class="app-container">
    <el-container v-loading="v.loading">
      <el-container>
        <el-header height="125px">
          <div style class="topTitle">考核评分表</div>

          <div class="filter-container" style>
            <template>
              <div class="block">单位名称
                <el-select v-model="value2" :clearable="true" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>日期选择
                <el-date-picker
                  v-model="yearvalue"
                  type="year"
                  format="yyyy年"
                  value-format="yyyy"
                  placeholder="选择年"
                  @change="yearselection"
                  :clearable="false"
                ></el-date-picker>
                <el-date-picker
                  v-model="monthvalue"
                  type="month"
                  format="M月"
                  value-format="M"
                  placeholder="选择月"
                  @change="monthselection"
                  :clearable="false"
                ></el-date-picker>
                <el-button
                  type="primary"
                  slot="reference"
                  icon="el-icon-search"
                  size="mini"
                  @click="handleFilter"
                >查询</el-button>
                <el-button
                  type="primary"
                  slot="reference"
                  icon="el-icon-setting"
                  size="mini"
                  @click="getasslist"
                >考核设置</el-button>
              </div>
            </template>
          </div>
        </el-header>

        <el-main>
          <div class="filter-container" style="padding-top: 0;">
            <el-button
              class="filter-item"
              type="primary"
              icon="el-icon-tickets"
              @click="assscore"
            >考核评分</el-button>
            <el-button class="filter-item" type="info" icon="el-icon-delete">删除</el-button>
          </div>

          <div>
            <el-table
              row-key="id"
              stripe
              style="width: 100%"
              border
              @selection-change="assessmentchange"
            >
              <el-table-column type="selection" width="55" align="center"></el-table-column>
              <el-table-column type="index" width="50" border align="center" label="序号"></el-table-column>
              <el-table-column prop label="单位名称"/>
              <el-table-column prop label="日常巡查"/>
              <el-table-column prop label="公众投诉"/>
              <el-table-column prop label="宣传教育工作"/>
              <el-table-column prop label="奖励分"/>
              <el-table-column prop label="时间处理率"/>
              <el-table-column prop label="水质变化"/>
              <el-table-column prop label="领导综合评估"/>
              <el-table-column prop label="其他"/>
              <el-table-column prop label="总分"/>
              <el-table-column prop label="操作  " width="100">
                <template slot-scope="scope">
                  <el-button @click="edit(scope.row)" type="text" size="mini" icon="el-icon-edit"/>
                </template>
              </el-table-column>
            </el-table>
            <pagination
              v-show="query.total>0"
              :total="query.total"
              :page.sync="query.pageNo"
              :limit.sync="query.pageSize"
            />
          </div>
          <el-button type="primary" size="mini">提交</el-button>
        </el-main>

        <!-- 考核设置 -->
        <el-dialog
          :visible.sync="settingVisible"
          title="修改考核模板"
          :modal-append-to-body="false"
          width="60%"
        >
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="editassBtn">编辑考核项</el-button>
          <el-button type="primary" size="mini" icon="el-icon-delete" @click="delassBtn">删除考核项</el-button>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-circle-plus-outline"
            @click="addassBtn"
          >新增考核项</el-button>
          <div>
            <template>
              <el-table
                ref="singleTable"
                :data="list"
                style="width: 100%"
                highlight-current-row
                :border="true"
                @current-change="handleCurrentChange"
                :summary-method="getCount"
                show-summary
              >
                <el-table-column prop="name" label="考核项目" width="120"></el-table-column>
                <el-table-column prop="content" label="考评内容" width="400"></el-table-column>
                <el-table-column prop="score" label="基本分" width="120"></el-table-column>
                <el-table-column prop="standard" label="考核标准" width="400"></el-table-column>
              </el-table>
              <div>
                <!-- 总计  总分 -->
              </div>
              <!-- <div style="margin-top: 20px">
                <el-button type="primary">提交</el-button>
              </div>-->
            </template>
          </div>
        </el-dialog>

        <!-- 考核评分 -->
        <el-dialog
          :visible.sync="scoreVisible"
          title="考核评分"
          :modal-append-to-body="false"
          width="65%"
        >
          <template>
            <div>
              <span>日期选择</span>
              <el-date-picker
                v-model="yearvalue2"
                type="year"
                format="yyyy年"
                value-format="yyyy"
                placeholder="选择年"
                @change="yearselection2"
                :clearable="false"
              ></el-date-picker>

              <el-date-picker
                v-model="monthvalue2"
                type="month"
                format="M月"
                value-format="M"
                @change="monthselection2"
                placeholder="选择月"
                :clearable="false"
              ></el-date-picker>
              <span>单位选择</span>
              <el-select v-model="value3" :clearable="true" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>

            <div>
              <el-table
                :data="scorelist"
                style="width: 100%"
                highlight-current-row
                :border="true"
                @current-change="handleCurrentChange"
                :summary-method="getCount"
                show-summary
                v-loading="scoreloading"
              >
                <el-table-column prop="name" label="考核项目" width="120"></el-table-column>
                <el-table-column prop="content" label="考评内容" width="400"></el-table-column>
                <el-table-column prop="score" label="基本分" width="120"></el-table-column>
                <el-table-column prop="standard" label="考核标准" width="400"></el-table-column>
                <el-table-column prop="fraction" label="得分" width="150" align="center">
                  <template slot-scope="scope">
                    <el-input
                      size="small"
                      id="index"
                      type="text"
                      @change="inputChange(scope.$index,scope.en,scope.row)"
                      v-model="scope.numberscore"
                      placeholder="请打分"
                      style="width: 80px;"
                    ></el-input>
                    <span>分</span>
                  </template>
                </el-table-column>
              </el-table>
              <div style="margin-top: 20px">
                <el-button type="primary" @click="scoreBtn">提交</el-button>
              </div>
            </div>
          </template>
        </el-dialog>

        <!-- 新增考核项弹窗 -->
        <el-dialog title="新增考核项" :visible.sync="addVisible">
          <el-form>
            <el-form-item label="考核项目">
              <el-input type="textarea" v-model="proTaskFrom.name" placeholder="请输入考核项目" rows="1"></el-input>
            </el-form-item>
            <el-form-item label="考评内容">
              <el-input
                type="textarea"
                v-model="proTaskFrom.content"
                placeholder="请输入考评内容"
                rows="3"
              ></el-input>
            </el-form-item>
            <el-form-item label="基本分">
              <el-input type="textarea" v-model="proTaskFrom.score" placeholder="请输入基本分" rows="1"></el-input>
            </el-form-item>
            <el-form-item label="考核标准">
              <el-input
                type="textarea"
                v-model="proTaskFrom.standard"
                placeholder="请输入考核标准"
                rows="3"
              ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitBtn">新增提交</el-button>
          </div>
        </el-dialog>

        <!-- 编辑考核项弹窗 -->
        <el-dialog title="编辑考核项" :visible.sync="editVisible">
          <el-form>
            <el-form-item label="考核项目">
              <el-input type="textscore" v-model="proTaskFrom.name" rows="1"></el-input>
            </el-form-item>
            <el-form-item label="考评内容">
              <el-input type="textscore" v-model="proTaskFrom.content" rows="3"></el-input>
            </el-form-item>
            <el-form-item label="基本分">
              <el-input type="textscore" v-model="proTaskFrom.score" rows="1"></el-input>
            </el-form-item>
            <el-form-item label="考核标准">
              <el-input type="textscore" v-model="proTaskFrom.standard" rows="3"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitBtn">修改提交</el-button>
          </div>
        </el-dialog>
      </el-container>
    </el-container>
  </div>
</template> 


<script>
import {
  getarealist,
  save,
  getasslist,
  del,
  getscorelist
} from "@/api/administration/assessment.js";
export default {
  components: {},
  data() {
    return {
      aaaaaa: "",
      v: {
        loading: false
      },
      list: null,
      scorelist:null,
      addVisible: false,
      editVisible: false,
      settingVisible: false,
      popoverVisible: false,
      value2: null,
      value3: null,
      yearvalue: "",
      monthvalue: "",
      yearvalue2: "",
      monthvalue2: "",
      scoreVisible: false,
      scoreloading: null,
      query: {
        total: 0,
        pageNo: 1,
        pageSize: 10,
        search: undefined,
        type: "5"
      },
      proTaskFrom: {
        id: null,
        name: null,
        content: null,
        score: null,
        standard: null
      },
      condition: {
        year: null,
        month: null
      },
      selectionitems: null,
      options: []
    };
  },
  created() {
    this.getarealist();
  },
  methods: {
    getarealist() {
      getarealist().then(Response => {
        this.options = Response.data.list;
        console.log("this.options", this.options);
      });
    },
    edit(row) {
      alert("修改windows");
    },
    //时间事件
    yearselection(yearselection) {
      var date = new Date();
      var year = date.getFullYear();
      if (this.yearvalue > year) {
        this.yearvalue = null;
        this.monthvalue = null;
        this.$message({
          message: "超出当前系统时间",
          type: "warning"
        });
      } else {
        this.condition.year = yearselection;
        var month = date.getMonth() + 1;
        this.monthvalue = month + "月";
        this.condition.month = month.toString();
        getasslist(this.condition).then(response => {
          this.list = response.data.list;
          this.$message({
            message: "查询成功",
            type: "success"
          });
        });
      }
    },
    monthselection(monthselection) {
      var date = new Date();
      var month = date.getMonth() + 1;
      if (this.monthvalue > month) {
        this.yearvalue = null;
        this.monthvalue = null;
        this.$message({
          message: "超出当前系统时间",
          type: "warning"
        });
      } else {
        this.condition.month = monthselection;
        var year = date.getFullYear();
        this.yearvalue = year + "年";
        getasslist(this.condition).then(response => {
          this.list = response.data.list;
          this.$message({
            message: "查询成功",
            type: "success"
          });
        });
      }
    },

    yearselection2(yearselection2) {
      var date = new Date();
      var year = date.getFullYear();
      if (this.yearvalue2 > year) {
        this.yearvalue2 = null;
        this.monthvalue2 = null;
        this.$message({
          message: "超出当前系统时间",
          type: "warning"
        });
      } else {
        this.condition.year = yearselection2;
        var month = date.getMonth() + 1;
        this.monthvalue2 = month + "月";
        this.condition.month = month.toString();
        getscorelist(this.condition).then(response => {
          this.scorelist = response.data.list;
          this.$message({
            message: "查询成功",
            type: "success"
          });
        });
      }
    },
    monthselection2(monthselection2) {
      var date = new Date();
      var month = date.getMonth()+1;
      if (this.monthvalue2 > month) {
        this.yearvalue2 = null;
        this.monthvalue2 = null;
        this.$message({
          message: "超出当前系统时间",
          type: "warning"
        });
      } else {
        this.condition.month = monthselection2;
        var year = date.getFullYear();
        this.yearvalue2 = year + "年";
        getscorelist(this.condition).then(response => {
          this.scorelist = response.data.list;
          this.$message({
            message: "查询成功",
            type: "success"
          });
        });
      }
    },
    assessmentchange(val) {
      this.multipleSelection = val;
    },
    assitemchange(val) {
      this.multipleSelection = val;
    },
    //考核评分
    assscore() {
      this.scoreVisible = true;
      this.scoreloading = true;
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      getscorelist({ year: year, month: month }).then(response => {
        this.scoreloading = false;
        this.scorelist = response.data.list;
        //  this.$message({
        //     message:"查询成功",
        //     type: "success"
        //   })
      });
    },
    //考核设置
    getasslist() {
      this.settingVisible = true;
      getasslist().then(response => {
        this.list = response.data.list;
      });
    },
    //新增考核项
    addassBtn() {
      this.addVisible = true;
      this.proTaskFrom = [];
    },
    //编辑考核项
    editassBtn() {
      if (this.selectionitems == null) {
        this.$message({
          message: "请选择编辑项",
          type: "error"
        });
      } else {
        this.editVisible = true;
        this.proTaskFrom = this.selectionitems;
      }
    },
    //删除
    delassBtn() {
      if (this.selectionitems == null) {
        this.$message({
          message: "请选择删除项",
          type: "error"
        });
      } else {
        del(this.selectionitems.id).then(response => {
          this.getasslist();
          this.$message({
            message: response.msg,
            type: "success"
          });
        });
      }
    },
    //查询
    handleFilter() {
      var condition = {
        officeid: this.value2,
        year: this.condition.year,
        month: this.condition.month
      };
      console.log("condition", condition);
    },
    //提交
    submitBtn() {
      var proTaskFrom = {
        id: this.proTaskFrom.id,
        name: this.proTaskFrom.name,
        content: this.proTaskFrom.content,
        score: this.proTaskFrom.score,
        standard: this.proTaskFrom.standard
      };
      console.log("proTaskFrom", proTaskFrom);
      if (
        proTaskFrom.name != null &&
        proTaskFrom.content != null &&
        proTaskFrom.score != null &&
        proTaskFrom.standard != null
      ) {
        save(proTaskFrom).then(Response => {
          this.addVisible = false;
          this.editVisible = false;
          this.getasslist();
          this.$message({
            message: "处理成功",
            type: "success"
          });
        });
      } else {
        this.$message({
          message: "输入不能为空",
          type: "error"
        });
      }
    },
    handleCurrentChange(row) {
      this.selectionitems = row;
      this.proTaskFrom.id = row.id;
    },
    //评分提交
    scoreBtn() {
      var condition = {
        officeid: this.value3,
        //year: this.condition.year,
      // month: this.condition.month
      };
      if (condition.officeid != null && condition.officeid != "") {
        console.log("condition", condition);
      } else {
        this.$message({
          message: "请选择单位",
          type: "warning"
        });
      }
    },
    //
   inputChange(index, value,row){
     console.log("row.id",row.id)
     console.log(this.scorelist)
     console.log("aaaa",this.scorelist[index].fraction)
        //this.scorelist[index].fraction = value
      },
    //合计
    getCount(param) {
      console.log("param", param);
      const { columns, data } = param;
      const sums = [];
      let values = [];
      console.log("columns", columns);
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (column.property == "score") {
          values = data.map(item => Number(item.score));
          console.log("--------121212", values);
        } else if (column.property === "fraction") {
          console.log("column.property", column.property);
          values = data.map(item => Number(item.fraction));
          console.log("values", values);
        }
        if (column.property == "score" || column.property == "fraction") {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] += "分";
        } else {
          sums[index] = "N/A";
        }
      });
      console.log(sums);
      return sums;
    }
  }
};
</script>


