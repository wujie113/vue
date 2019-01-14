<template>
  <div class="app-container">
    <el-container v-loading="v.loading">
      <el-container>
        <el-header height="125px">
          <div style class="topTitle">考核评分表</div>

          <div class="filter-container" style>
            <div class="block">
              <span>单位名称</span>
              <el-select v-model="value2" :clearable="true" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                ></el-option>
              </el-select>
              <span>日期选择</span>
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
          </div>
        </el-header>

        <el-main>
          <div class="filter-container" style="padding-top: 0">
            <el-button
              class="filter-item"
              type="primary"
              icon="el-icon-tickets"
              @click="assscore"
            >考核评分</el-button>
          </div>

          <div>
             <el-table :data="officescorelist.tableData"    v-loading="listloading" style="width: 100%" border :header-cell-style="{'color': '#333333'}">
              <el-table-column type="index" label="序号">
               
              </el-table-column> 
              <el-table-column :prop="item.prop" :label="item.label" v-for="(item, index) in officescorelist.tableCoulmn" :key="index">
               
              </el-table-column> 
              <el-table-column  label="操作">
                <template slot-scope="scope">
                  <!-- <el-button @click="editoffice(scope.row)" type="text"  size="mini" icon="el-icon-edit"/> -->
                  <el-button @click="editoffice(scope.row)" type="text" size="mini" title="编辑">
                    <svg-icon icon-class="editColor"/>
                  </el-button>                  
                </template>
              </el-table-column> 
            </el-table>
          </div>
          <!-- <el-button type="primary" size="mini">提交</el-button> -->
        </el-main>

        <!-- 考核设置 -->
        <el-dialog
          :visible.sync="settingVisible"
          title="修改考核模板"
          :modal-append-to-body="false"
          width="60%"
        >
          <div class="filter-container">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="editassBtn">编辑考核项</el-button>
            <el-button type="info" size="mini" icon="el-icon-delete" @click="delassBtn">删除考核项</el-button>
            <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" @click="addassBtn">新增考核项</el-button>
          </div>
          <div>
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
              <el-table-column prop="name" label="考核项目" show-overflow-tooltip></el-table-column>
              <el-table-column prop="content" label="考评内容" show-overflow-tooltip></el-table-column>
              <el-table-column prop="score" label="基本分"></el-table-column>
              <el-table-column prop="standard" label="考核标准" width="500" show-overflow-tooltip></el-table-column>
            </el-table>
          
          </div>
        </el-dialog>

        <!-- 考核评分 -->
        <el-dialog
          :visible.sync="scoreVisible"
          title="考核评分"
          :modal-append-to-body="false"
          width="64.2%"
        >
          <div class="filter-container"  v-if="searchshow">
            <div class="block">
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
                  v-for="item in options2"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
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
                    type="number"
                    @input="inputChange(scope.row.fraction,scope.row.score,scope.row,scope.$index)"
                    v-model="scope.row.fraction" 
                    value="请打分"
                    style="width: 80px"
                    onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
                    :min="1"
                  ></el-input>
                  <span>分</span>
                </template>
              </el-table-column>
            </el-table>            
          </div>
          <div  slot="footer" class="dialog-footer">
            <el-button type="primary" @click="scoreBtn">评分提交</el-button>
          </div>
        </el-dialog>

        <!-- 新增考核项弹窗 -->
        <el-dialog title="新增考核项" :visible.sync="addVisible">
          <el-form>
            <el-form-item label="考核项目">
              <el-input type="textarea" v-model="proTaskFrom.names" placeholder="请输入考核项目" rows="1"></el-input>
            </el-form-item>
            <el-form-item label="考评内容">
              <el-input
                type="textarea"
                v-model="proTaskFrom.contents"
                placeholder="请输入考评内容"
                rows="3"
              ></el-input>
            </el-form-item>
            <el-form-item label="基本分">
              <el-input type="textarea" v-model="proTaskFrom.scores" placeholder="请输入基本分" rows="1"></el-input>
            </el-form-item>
            <el-form-item label="考核标准">
              <el-input
                type="textarea"
                v-model="proTaskFrom.standards"
                placeholder="请输入考核标准"
                rows="3"
              ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="addsubmitBtn">新增提交</el-button>
          </div>
        </el-dialog>

        <!-- 编辑考核项弹窗 -->
        <el-dialog title="编辑考核项" :visible.sync="editVisible">
          <el-form>
            <el-form-item label="考核项目">
              <el-input type="textscore" v-model="proTaskFrom.names" rows="1"></el-input>
            </el-form-item>
            <el-form-item label="考评内容">
              <el-input type="textscore" v-model="proTaskFrom.contents" rows="3"></el-input>
            </el-form-item>
            <el-form-item label="基本分">
              <el-input type="textscore" v-model="proTaskFrom.scores" rows="1"></el-input>
            </el-form-item>
            <el-form-item label="考核标准">
              <el-input type="textscore" v-model="proTaskFrom.standards" rows="3"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="editsubmitBtn">修改提交</el-button>
          </div>
        </el-dialog>
      </el-container>
    </el-container>
  </div>
</template> 


<script>
import { save, findsettemplateItemlist, del, getscorelist, savescore, officelist,getlist,editsavescore,geteditscorelist } from "@/api/ass/assessment.js"
import { getLoweroffice } from "@/api/core/org.js"
export default {
  components: {},
  data() {
    return {
      scorearray:[],
      v: {
        loading: false
      },
      scorenum:0,
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
      scoreloading: false,
      listloading:false,
      totalscore: [],
      searchshow:true,
      currentRow: null,
      query: {
        total: 0,
        pageNo: 1,
        pageSize: 10,
        search: undefined,
        type: "5"
      },
      proTaskFrom: {
        id: null,
        names: null,
        contents: null,
        scores: null,
        standards: null
      },
      condition: {
          office: null,
          year: null,
          month: null,
        },
    officescorelist: {
        tableCoulmn: [],
        tableData:[],
      },
      idvalue: [],
      selectionitems: null,
      options: [],
      options2: []
    }
  },
  created() {
    this.getarealist()
    this.getlist()
    this.getarealist1()
  },
  methods: {
    getarealist() {
      getLoweroffice().then(Response => {
        this.options = Response.data.list
      })
    },
    getarealist1() {
      getLoweroffice({"pid":this.value2}).then(Response => {
        this.options2 = Response.data.list
      })
    },
    //时间事件
    yearselection(yearselection) {
      console.log("yearselection",yearselection)
      var date = new Date()
      var year = date.getFullYear()
      if (this.yearvalue > year) {
        this.yearvalue = null
        this.monthvalue = null
        this.$message({
          message: "超出当前系统时间",
          type: "warning"
        })
      } else {
        this.condition.year = yearselection
        var month = date.getMonth() + 1
        this.monthvalue = month + "月"
        this.condition.month = month.toString()
        console.log("this.condition",this.condition);
        officelist(this.condition).then(response => {
          this.officescorelist.tableCoulmn = response.data.tableCoulmn
            this.officescorelist.tableData = response.data.tableData 
            this.value2=null
          this.$message({
            message: "查询成功",
            type: "success"
          })
        })
      }
    },
    monthselection(monthselection) {
      var date = new Date()
      var month = date.getMonth() + 1
      let index = this.yearvalue.indexOf("年")
      console.log('index', index);
      let cc
      if(index > -1){
        cc = Number(this.yearvalue.slice(0, index))
      }else {
        cc = this.yearvalue
      }
      if(cc > date.getFullYear()){
        // this.yearvalue = null
        // this.monthvalue = null
        this.$message({
          message: "超出当前系统时间",
          type: "warning"
        })
      }else if(cc == date.getFullYear()){
        if (this.monthvalue > month) {
          // this.yearvalue = null
          // this.monthvalue = null
          this.$message({
            message: "超出当前系统时间",
            type: "warning"
          })
        } else {
          this.condition.month = monthselection
          var year = date.getFullYear()
          this.yearvalue = year + "年"
          officelist(this.condition).then(response => {
            this.officescorelist.tableCoulmn = response.data.tableCoulmn
            this.officescorelist.tableData = response.data.tableData
            this.value2=null
            this.$message({
              message: "查询成功",
              type: "success"
            })
          })
        }
      }else if(cc < date.getFullYear()){
        this.condition.month = monthselection

        this.yearvalue = cc + "年"
        officelist(this.condition).then(response => {
          this.officescorelist.tableCoulmn = response.data.tableCoulmn
          this.officescorelist.tableData = response.data.tableData
          this.value2=null
          this.$message({
            message: "查询成功",
            type: "success"
          })
        })
      }

    },

    yearselection2(yearselection2) {
      var date = new Date()
      var year = date.getFullYear()
      if (this.yearvalue2 > year) {
        this.yearvalue2 = null
        this.monthvalue2 = null
        this.$message({
          message: "超出当前系统时间",
          type: "warning"
        })
      } else {
        this.condition.year = yearselection2
        var month = date.getMonth() + 1
        this.monthvalue2 = month + "月"
        this.condition.month = month.toString()
        getscorelist(this.condition).then(response => {
          this.scorelist = response.data.list
          this.$message({
            message: "模板查询成功",
            type: "success"
          })
        })
      }
    },
    monthselection2(monthselection2) {
      var date = new Date()
      var month = date.getMonth() + 1
      if (this.monthvalue2 > month) {
        this.yearvalue2 = null
        this.monthvalue2 = null
        this.$message({
          message: "超出当前系统时间",
          type: "warning"
        })
      } else {
        this.condition.month = monthselection2
        var year = date.getFullYear()
        this.yearvalue2 = year + "年"
        getscorelist(this.condition).then(response => {
          this.scorelist = response.data.list
          this.$message({
            message: "模板查询成功",
            type: "success"
          })
        })
      }
    },
    //考核评分
    assscore() {
      this.idvalue=[]
      this.value3 = null
      this.scoreVisible = true
      this.scoreloading = true
      var date = new Date()
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      if(this.searchshow){
		this.searchshow = true
      }else{
		this.searchshow = true
      }
      getscorelist({ year: year, month: month,office:this.value2}).then(response => {
        this.scoreloading = false
        this.scorelist = response.data.list
      })
    },
    
    //考核设置
    getasslist() {
      this.selectionitems= []
      this.settingVisible = true
      findsettemplateItemlist().then(response => {
        this.list = response.data.list
      })
    },
    //新增考核项
    addassBtn() {
      var str = parseInt(this.totalscore[2])
      if (str == 100) {
        this.$message({
          message: "当前总分达到100分,无法继续添加",
          type: "warning"
        })
      } else {
        this.addVisible = true
        this.proTaskFrom = []
      }
    },
    //编辑考核项
    editassBtn() {
      if (this.selectionitems.length <=0) {
        this.$message({
          message: "请选择编辑项",
          type: "warning"
        })
      } else {
        this.editVisible = true
        this.proTaskFrom.names= this.selectionitems.name
        this.proTaskFrom.contents =this.selectionitems.content
        this.proTaskFrom.scores = this.selectionitems.score
        this.proTaskFrom.standards = this.selectionitems.standard
      } 
    },
    //删除
    delassBtn() {
      if (this.selectionitems.length <=0) {
        this.$message({
          message: "请选择删除项",
          type: "warning"
        })
      } else {
        del(this.selectionitems.id).then(response => {
          this.getasslist()
          this.$message({
            message: response.msg,
            type: "success"
          })
        }).catch((erroe) => {
          this.getasslist()
        })
      }
    },
    getlist(){
      var date = new Date()
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      this.condition.year = year
      this.condition.month = month
      this.yearvalue = year + '年'
      this.monthvalue = month + '月'
         officelist({ year: year, month: month }).then(response =>{
            this.officescorelist.tableCoulmn = response.data.tableCoulmn
            this.officescorelist.tableData = response.data.tableData
        })
    },
    
    //查询
    handleFilter() {
      var condition = {
        office:this.value2,
        year: this.condition.year,
        month: this.condition.month
      }
      console.log("condition",condition)

      if(condition.year && condition.month) {
          this.listloading = true
          officelist(condition).then(response =>{
            this.listloading = false
            this.officescorelist.tableCoulmn = response.data.tableCoulmn
            this.officescorelist.tableData = response.data.tableData        
        })
      }else{
        this.$message({
              message: "请选择日期",
              type: "warning"
            })
      }
      
    },
    //提交
    addsubmitBtn() {
      var str = parseInt(this.totalscore[2])
      var inputnumber = parseInt(this.proTaskFrom.scores)
      var ifscore =  inputnumber+str
      var remainder = 100 - str
      if(ifscore>100){
         this.$message({
               message: "总分超过100分,当前可分配分数为"+remainder,
               type: "error"
             })
      }else{
      var proTaskFrom = {
        name: this.proTaskFrom.names,
        content: this.proTaskFrom.contents,
        score: this.proTaskFrom.scores,
        standard: this.proTaskFrom.standards 
      }
      console.log("proTaskFrom",proTaskFrom)
      if (proTaskFrom.name != null && proTaskFrom.content != null && proTaskFrom.score != null && proTaskFrom.standard != null) {
        save(proTaskFrom).then(Response => {
          if (response.success == true) {
            this.$message({
              message: response.msg,
              type: "success"
            })
          }
          this.addVisible = false
          this.editVisible = false
          this.getasslist()
        }).catch((error) => {
          this.addVisible = false
          this.editVisible = false
          this.getasslist()
        })
      } else {
        this.$message({
          message: "输入不能为空",
          type: "error"
        })
      }
      }
    },
    //修改提交
    editsubmitBtn(){
      var oldscore = parseInt(this.selectionitems.score)
      var str = parseInt(this.totalscore[2])
      var inputnumber = parseInt(this.proTaskFrom.scores)
       var remainder = (100-str)+oldscore
      if(inputnumber>remainder){
         this.$message({
               message: "总分超过100分,当前可分配分数为"+remainder,
               type: "error"
             })
      }else{
      var proTaskFrom = {
        id: this.proTaskFrom.id,
        name: this.proTaskFrom.names,
        content: this.proTaskFrom.contents,
        score: this.proTaskFrom.scores,
        standard: this.proTaskFrom.standards 
      }
      if (proTaskFrom.name != null && proTaskFrom.content != null && proTaskFrom.score != null && proTaskFrom.standard != null) {
        save(proTaskFrom).then(Response => {
          if (response.success == true) {
            this.$message({
              message: response.msg,
              type: "success"
            })
          }
          this.addVisible = false
          this.editVisible = false
          this.getasslist()
        }).catch((error) => {
          this.addVisible = false
          this.editVisible = false
          this.getasslist()
        })
      } else {
        this.$message({
          message: "输入不能为空",
          type: "error"
        })
      }
      }
    },
    handleCurrentChange(row) {
      if (row) {
        this.selectionitems = row
        this.proTaskFrom.id = row.id
      }

    },
    //评分修改
    editoffice(row){
      this.getarealist1()
      this.idvalue=[]
      //this.value3 = row.officeId
      if(row.sum != null && row.sum != ""){
        this.condition.office = row.officeId
        this.scoreVisible = true
       if(this.searchshow  == true){
         this.searchshow = false
       }else{
          this.searchshow = false
       }
      this.scoreloading = true
      var date = new Date()
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      console.log("row",row)
      geteditscorelist({ year: year, month: month ,"scoreOffice.id":row.officeId,"office":this.value2}).then(response => {
        this.scoreloading = false
        this.scorelist = response.data.list
        this.scorenum=response.data.scorenum
        this.idvalue=response.data.idvalue
      })
      } else{
        // this.$message({
        //     message: "请给单位评分",
        //     type: "warning"
        //   })
        this.scoreVisible = true
        this.assscore()
        if(this.searchshow  == false){
         this.searchshow = true
       }else{
          this.searchshow = true
       }
      }
      
    },
    //请输入
    inputChange(value,maxscore, row,index) {   
      if(parseInt(maxscore)<parseInt(value)){ 
          value=0
          row.num=0
          this.$message({
            message: "打分不能超过基本分!!!",
            type: "error"
          })
      }   
      
     this.scorelist[index].fraction = parseInt(value)
     
      let temp = {
        "item_id": row.id,
        "score": value
      }
      if (this.idvalue.length > 0) {
        let isSame = false
        for (let key in this.idvalue) {
          if (this.idvalue[key].item_id == row.id && this.idvalue[key].score !== value) {
            this.idvalue[key].score = value
            isSame = true
          }
        }
        if (!isSame) {
          this.idvalue.push(temp)
          isSame = false
        }
      } else {
        this.idvalue.push(temp)
      }
    },
    //评分提交
    scoreBtn() {
       let values =[]
       values = this.scorelist.map(item => item.fraction)
         console.log("---",values)
              if(values.indexOf("")>-1 || values.indexOf(NaN)>-1 ) {
                this.$message({
                   message: "请给每一项评分",
                type: "warning"
                })
            } else{
                  if(this.searchshow == true){
                    var condition = {
                    office: this.value3,
                    year: this.condition.year,
                    month: this.condition.month,
                    idvalues: JSON.stringify(this.idvalue)
                  }
                  if (condition.office != null && condition.office != "") {
                    savescore(condition).then(response => {
                      if(response.success == true){
                         this.scoreVisible = false
                            this.$message({
                              message: "评分成功",
                              type: "success"
                            })
                            //this.getlist()
                            this.handleFilter()
                      } 
                    }).catch((erroe) => {
                      this.getlist()
                    })
                   }
                   else {
                    this.$message({
                      message: "请选择单位",
                      type: "warning"
                    })
                  }
                  }else{
                    var  condition = {
                        office:this.condition.office,
                        idvalues: JSON.stringify(this.idvalue)
                    }
                    
                    editsavescore(condition).then(response => {
                      this.scoreVisible = false
                            this.$message({
                              message: "修改评分成功",
                              type: "success"
                            })
                            // this.getlist()
                            // this.value2 = null
                            this.handleFilter()
                    })
                  }
                }
    },
    
    //合计
    getCount(param) {
      
      const { columns, data } = param
      const sums = []
      let values = [] 
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计"
          return
        }
        if (column.property == "score") {
          values = data.map(item => Number(item.score))
        }
        if (column.property == "fraction") {
          values = data.map(item => Number(item.fraction))
        }
        if (column.property == "score" || column.property == "fraction") {
          
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] += "分"
        } else {
          sums[index] = ""
        }
      })
      
      this.totalscore = sums

      return sums
    }
  }
}
</script>
<style scoped lang="scss">
.app-container {
  /deep/ .el-dialog__body {
    max-height: 50em;
  }
  /deep/ .el-tabs__header {
    margin: 0 0 0px;
  }
  .filter-container {
    span {
      color: #636363;
      font-size: 12px;
    }
  }
  > .el-container {
    min-height: calc(100vh - 126px);
    > .el-container {
      // 兼容IE浏览器
      min-height: calc(100vh - 126px);
    }
  }
}
</style>
<style>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>



