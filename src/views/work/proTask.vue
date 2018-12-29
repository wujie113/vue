<template>
  <div class="app-container">
    <el-container v-loading="listLoading">
      <el-container>
        <el-header height="125px">
          <div class="topTitle">工单列表</div>
          <div class="filter-container">
            <el-input
              placeholder="输入问题描述"
              v-model="listQuery.description"
              style="width: 200px;"
              class="filter-item"
              @keyup.enter.native="handleFilter"
            />
            <el-select  v-model="listQuery.status" placeholder="请选择列别"  @change="selectChang" clearable style="width: 120px" class="filter-item">
              <el-option  v-for="item in importanceOptions" :key="item.key" :label="item.label"    :value="item.key"/>
            </el-select>
            <el-button
              class="filter-item"
              type="primary"
              icon="el-icon-search"
              @click="handleFilter"
            >查询</el-button>
            <el-button type="primary" icon="el-icon-plus" @click="create">新增</el-button>
          </div>
        </el-header>
        <el-main>
          <el-table :data="list" row-key="id" stripe border style="width: 100%">
            <el-table-column label width="80">
              <template slot-scope="scope">
                <span title="时时事事11111" class="city">市</span> 
                <!-- <span title="督查" style="color: #ffa727;" @change="governor">督</span> -->
                <el-button
                  title="督办记录"
                  style="color: #ffa727;border:none ;"
                  @click="governor(scope.row)"
                >督</el-button>
              </template>
            </el-table-column> 
            <el-table-column type="index" label="序号" width="50"/>
            <el-table-column prop="description" label="问题描述"/>
            <el-table-column prop="username" label="发起人"/>
            <el-table-column prop="date" label="发起时间"/>
            <el-table-column prop="status" label="工单状态"/> 
            <el-table-column prop="taskcontent" label="任务描述"/>
            <el-table-column prop="id" label="操作" width="150">
              <template slot-scope="scope">
                <el-button type="text" title="曝光" @click="baoguangBtn(scope.row)">
                  <svg-icon icon-class="puguangColor"/>
                </el-button>
                <el-button type="text" title="督办" @click="edit(scope.row)">
                  <svg-icon icon-class="jianduColor"/>
                </el-button>
                <el-button type="text" title="删除" @click="del(scope.row)">
                  <svg-icon icon-class="deleteColor"/>
                </el-button>
                <el-button type="text" title="详情" @click="showdetail(scope.row)">
                  <svg-icon icon-class="editColor"/>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!---->
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="listQuery.pageNo"
            :limit.sync="listQuery.pageSize"
            @pagination="getList"
          />
          
        </el-main>

         <Layer
          title="工单详情"
          v-model="workflowdetail.visible"
          :dialog="false"
          class="layer-1"
          width="500"
          :animation="2"
          :maskLayer="false"
          :shade="false"
          height="700"
          :closeBack="closelayer" 
        >
          <el-button type="primary" @click="printBtn" class="printBtn">打印</el-button>
          <!--需要打印的区域-->
          <div id="printWrap">
            <div class="splitBox" v-for="(child, wrapindex) in prodetail.list" :key="wrapindex">
              <div class="work-order-details-list-title">{{child.title}}</div>
              <el-form :model="form" abel-width="80px" size="mini">
                <el-form-item
                  v-for="(filed, index2) in child.list"
                  :key="index2"
                  :label="filed.name"
                >{{filed.value}}</el-form-item>
              </el-form>
              <!--图片路径-->
              <viewer :images=" child.medium" class="clearfix">
                <img :src="img.url" :key="index" v-for="(img, index) in child.medium">
              </viewer>
              <!-- 分割线 -->
              <div class="work-order-details-list-split" v-if="wrapindex !== prodetail.list.length - 1"></div>
            </div>
            <div style="border-bottom: 1px solid #ddd;"></div>
          </div>

          <div class="customerBtn">
            <el-button
              v-for="(child, index) in prodetail.handel.btnlist"
              :key="index"
              type="primary"
              @click="operation(child)"
            >{{child.name}}</el-button>
          </div>
        </Layer>

  
       
        <Layer
          title="转派工单"
          v-model="workflowsend.visible"
          :dialog="false"
          class="layer-1"
          width="400"
          :animation="2"
          :maskLayer="false"
          :shade="false"
          height="400"
          :confirmBack="dosend"
          confirm="确定"
          cancel="取消"
        >
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="选择部门">
              <el-select
                v-model="workflowsend.form.officeid"
                placeholder="请选择部门"
                @change="officechange"
                clearable
                class="filter-item"
              >
                <el-option
                  v-for="item in workflowsend.officelist"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="选择人员" v-if="workflowsend.isperson=='true'">
              <el-select
                v-model="workflowsend.form.receiveUserId"
                placeholder="请选择人员"
                clearable
                style="width: 90px"
                class="filter-item"
              >
                <el-option
                  v-for="item in workflowsend.userlist"
                  :key="item.name"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="comment" label="备注">
              <el-input v-model="workflowsend.form.comment" :rows="4" type="textarea"/>
            </el-form-item>
           
           <el-upload
                    v-model="workflowsend.form.annex"
                    class="upload-demo"
                    style="text-align: left;"
                    :multiple="true"
                    ref="upload"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :file-list="fileList"
                    :auto-upload="false"
                    :data="uploaddata"
                    >
                    <i class="el-icon-ali-icon-test"></i>附件上传
                  </el-upload>
          </el-form>
        </Layer>


        <Layer
          title="工单退回"
          v-model="workflowback.visible"
          :dialog="false"
          class="layer-1"
          width="400"
          :animation="2"
          :maskLayer="false"
          :shade="false"
          height="300"
          :confirmBack="doback"
          confirm="确定"
          cancel="取消"
        >
          <el-form ref="workflowbackform" :model="workflowback.form" label-width="80px">
            <el-form-item prop="comment" label="退回原由">
              <el-input v-model="workflowsend.form.comment" :rows="4" type="textarea"/>
            </el-form-item>
          </el-form>
        </Layer>
       <Layer :title="worknotofficeopetion.title" v-model="worknotofficeopetion.visible"  :dialog="false" class="layer-1"  
                width="400" :animation="2"  :maskLayer="false"  :shade="false"   height="300"  :confirmBack="doworknotofficeopetionhandel"   :confirm="worknotofficeopetion.confirm"
               cancel="取消"> 
            <el-form ref="workendhandelform"  label-width="80px">  
                <el-form-item prop="comment" :label="worknotofficeopetion.label">
                  <el-input v-model="workflowsend.form.comment" :placeholder="worknotofficeopetion.placeholder" :rows="4" type="textarea"/>
                </el-form-item>
              </el-form>
       </Layer>



      </el-container>
    </el-container>

    <!-- 工单弹窗 -->
          <el-dialog :visible.sync="visibleOrder" title="生成工单" :modal-append-to-body="false">
               <el-form ref="proTaskFrom" :model="proTaskFrom" abel-width="80px" size="mini">
             
           <!--    <el-form-item prop="area" label="所属区划">
                <rm-area-select v-model="proTaskFrom.area" />
              </el-form-item> -->
              <el-form-item label="接单单位">                                
                   <el-select v-model="proTaskFrom.dept" placeholder="请选择单位" clearable class="filter-item">
                      <el-option v-for="item in lowerofficeList" :key="item.id" :label="item.label" :value="item.id" />
                  </el-select>
              </el-form-item>
              
              <el-form-item label="相关部门">
                  <el-select v-model="proTaskFrom.unit" placeholder="请选择部门" clearable class="filter-item">
                      <el-option v-for="item in synergOfficeList" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
              </el-form-item>

              <el-form-item label="办结时间">
                 <el-date-picker v-model="proTaskFrom.handleTime" type="date" placeholder="Pick a date" style="width: 100%;"/>
              </el-form-item>
              <el-form-item label="问题描述">
                <el-input type="textarea" v-model="proTaskFrom.description" placeholder="请输入问题描述" rows="5"></el-input>
              </el-form-item>
              <el-form-item label="任务描述">
                <el-input type="textarea" v-model="proTaskFrom.taskcontent" placeholder="请输入任务描述" rows="5"></el-input>
              </el-form-item>
            </el-form> 
              <el-upload
                    class="upload-demo"
                    style="text-align: left;"
                    :multiple="true"
                    ref="upload"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :file-list="fileList"
                    :auto-upload="false">
                    <i class="el-icon-ali-icon-test"></i>附件上传
                  </el-upload>
          <div slot="footer" class="dialog-footer">
            <el-button @click="visibleOrder = false">取 消</el-button>
            <el-button @click="save()" type="primary">确 定</el-button>
          </div>
          </el-dialog>
 <!-- 工单弹窗  end-->
    <!--曝光弹窗-->
    <el-dialog :visible.sync="exposureVisible" title="曝光" :modal-append-to-body="false" width="75%">
      <el-container v-loading="exposureLoading">

        <el-aside>
          <left-tree
            titleName="组织部门"
            :dataArray="exposuredataArray"
            @areaData="selectNode"
            :isShowTabbar="isShowTabbar"
            :showCheckbox="isshowCheckbox"
            :panelMinHeight="panelMinHeight"
            :panelbodyHeight="panelbodyHeight"
            @checkBoxBtn="checkBoxBtn"
            v-model="refLeftTree"
          />
        </el-aside>

        <el-container>
          <el-header height="200px">
            <div style="" class="topTitle">
              接收列表
            </div>
            <div class="filter-container container-scroll" style="height: 157px;overflow-y: auto;">
              <span class="command-user" v-for="(item, index) in receivedPersionNodes" :key="index">
                {{ item.label }}
                <i class="el-icon-ali-guanbi" @click="deleteNode(index)"></i>
              </span>

            </div>
          </el-header>
          <el-main style="padding-top:0;position: relative;">
            <div style="" class="topTitle">
              曝光详情
            </div>
            <div class="filter-container container-scroll" style="height: 276px;overflow-y: auto;">
              <el-form ref="exposureForm" :model="exposureForm" label-width="50px">
                <el-form-item label="标题">
                  <el-input v-model="exposureForm.title" placeholder="请输入曝光标题"></el-input>
                </el-form-item>
                <el-form-item label="详情">
                  <el-input type="textarea" v-model="exposureForm.content" rows="5" placeholder="请输入曝光详情"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-upload
                    class="upload-demo"
                    style="text-align: left;"
                    :multiple="true"
                    ref="upload"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :file-list="fileList"
                    :auto-upload="false">
                    <i class="el-icon-ali-icon-test"></i>附件上传
                  </el-upload>
                  <!--<el-upload-->
                    <!--ref="upload"-->
                    <!--style="text-align: left;"-->
                    <!--class="upload-demo"-->
                    <!--action="https://jsonplaceholder.typicode.com/posts/"-->
                    <!--:file-list="fileList3">-->
                    <!--<i class="el-icon-ali-icon-test"></i>附件上传-->
                    <!--&lt;!&ndash;<span class="uplodText">附件上传</span>&ndash;&gt;-->
                    <!--&lt;!&ndash;<div slot="tip" class="el-upload__tip" style="line-height: 13px;">只能上传jpg/png文件，且不超过500kb</div>&ndash;&gt;-->
                  <!--</el-upload>-->
                </el-form-item>
              </el-form>
              <div class="command-mian-body-image">
                <el-button type="primary" @click="submitBtn">确定</el-button>
              </div>
            </div>
          </el-main>
        </el-container>
      </el-container>
    </el-dialog>

    <!-- 督办弹窗 -->
    <el-dialog :visible.sync="urgepopup" title="督办工单" :modal-append-to-body="false">
      <el-form :model="submiturge" ref="submiturge" label-width="80px">
        <el-form-item label="督办内容">
          <el-input type="textarea" v-model="submiturge.content" placeholder="请输入督办内容" rows="5"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="confirmBtn" type="primary">确 认</el-button>
      </div>
    </el-dialog>

    <!-- 督办列表 -->
    <el-dialog :visible.sync="dbwindows" title="督办记录" :modal-append-to-body="false" width="500px">
      <div class="splitBox">
        <el-form v-for="(items, index) in dblist" abel-width="80px" size="mini" :key="index">
          <el-form-item label="督办内容">{{items.content}}</el-form-item>
          <el-form-item label="发 起 人">{{items.username}}</el-form-item>
          <el-form-item label="督办时间">{{items.date | formatDate}}</el-form-item>
          <!-- 分割线 -->
          <div class="work-order-details-list-split"></div>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template> 
<script> 

import Pagination from '@/components/Pagination'
import { getList, del, get ,sav,subcontent,save,urgelist} from '@/api/work/proTask.js'
import RmDict from '@/components/rm/dict'

import { getToken } from '@/utils/auth' 
import RmOrgSelect from "@/components/rm/orgselect"
import RmUserSelect from "@/components/rm/userselect"
import RmAreaSelect from "@/components/rm/areaselect"
// 引入打印插件
import Print from 'print-js'
import LeftTree from '../setting/components/leftTree'
import { findOrgtreesandusers, saveExposure } from "@/api/res/management.js"
import { file } from "@/api/imgUplodFile"

import { getorgtrees,getSynergOffice,getLoweroffice,findOfficeUserstree} from '@/api/res/management.js'
 
import { officelist,send ,back,beginhandel,endhandel,audit} from "@/api/work/workflow.js"
 

import { officeuserlist} from "@/api/core/user.js"
export default {
  components: { Pagination, RmDict, RmOrgSelect, RmUserSelect, RmAreaSelect, LeftTree },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    formatDate: function(value) {
      let date = new Date(value);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? "0" + MM : MM;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      return y + "-" + MM + "-" + d;
    }
  },
  data() {
    return {
      uploadParams: {
        bizId:"",
        bizType:"R"
      },
      synergOfficeList : null,
      lowerofficeList : null,
      lowerofficeList : null,
      visibleOrder:false,
      exposureForm: {
        title: "",
        content: "",
        userDataId: "",//曝光里面已勾选的用户ID
        bizId: ""
      },
      uploaddata: {
        bizId: null,
        bizType: "proTask"
      },
      exposureLoading: false,
      refLeftTree: null,// 用于接收 LeftTree组件里面的this.$refs.tree
      fileList: [],
      receivedPersionNodes: [],
      visible: false, 
      listLoading: false,
      panelMinHeight: 62,
      panelbodyHeight: 62,
      exposuredataArray: [],
      doUpload: process.env.BASE_FILE_API + "?token=" + getToken(),
      isShowTabbar: false,
      isshowCheckbox: true,
      exposureVisible: false,
      visible: false,
      urgepopup: false,
      dbwindows: false,
      dblist: null,
      proTaskFrom: {
        reportId: null,
        lng: null,
        lat: null,
        type: null,
        source: 'proTask',
        area: null,
        dept: null,
        unit: null,
        handleTime: null,
        description: null,
        taskcontent: null,
        launchTime: null,
        receivePesrson: null,
        receiveTime: null,
        dealDept: null,
        dealStatus: null,
        dealDate: null
      },
      formProTask: {
        reportId: null,
        lng: null,
        lat: null,
        type: null,
        source: 'proTask',
        area: null,
        dept: null,
        unit: null,
        handleTime: null,
        description: null,
        taskcontent: null,
        launchTime: null,
        receivePesrson: null,
        receiveTime: null,
        dealDept: null,
        dealStatus: null,
        dealDate: null
      },
      form: {},
      list: null,
      total: 0,
      slide1: [],
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        importance: null,
        search: null,
        type: null, 
        status: "TODO"
      },  
      gdid: {
        id: ""
      },
      submiturge: {
        content: ""
      },
      prodetail: {
        list:null,
        handel:{
          btnlist:null
        }
      }, 
      workflowdetail:{
          visible:false,
          row:null
      },
      workflowsend: {
          visible: false,
          officelist: null,
          isperson: false,
          userlist: null,
          form: {
            actid: null,
            officeid: null,
            receiveUserId: null,
            comment: null,
            isaudit:null,
          }
      },
      workflowback: {
          visible: false
      },
      workhandelend: {
          visible: false
      },
      worknotofficeopetion:{
        btn:null,
        visible:false,
        title:null,
        placeholder:null,
        label:null,
        confirm:null
      },
      importanceOptions: [{ label: "待处理", key: "TODO" }, { label: "处理中", key: "DOING" }, { label: "复核中", key: "AUDIT" }, { label: "已完结", key: "DONE" }] 
    }
  },
  created() {
    this.getList()
  },
  methods: {
    loadLeftTreeData() {
      findOrgtreesandusers().then((res) => {
        this.exposuredataArray = res.data.list
        this.exposureLoading = false
      }).catch((errorRes) => {
        this.exposureLoading = false
      })
    },
    //---------------------------------------------------展示详情---------------------------------------------------------------------
    //市

    //督
    governor(row) {
      console.log("row::::", row);
      this.dbwindows = true;
      urgelist(row.id).then(response => {
        this.dblist = response.data.list;
        console.log("this.dblist", this.dblist);
      });
    },
    //---------------------------------------------------事件处理---------------------------------------------------------------------
    //督办弹窗
    edit(row) {
      this.urgepopup = true;
      this.gdid.id = row.id;
      this.submiturge.content = null;
    },
    //督办内容提交
    confirmBtn() {
      var submiturge = this.submiturge.content;
      if (submiturge == null) {
        this.$message({
          message: "输入不能为空"
        });
      } else {
        var data = Object.assign(this.gdid, this.submiturge);
        subcontent(data).then(response => {
          this.urgepopup = false;
          this.$message({
            message: "督办成功",
            type: "success"
          });
        });
      }
    }, 
    baoguangBtn(row) {
      // 显示曝光弹窗
      this.exposureForm.bizId = row.id
      this.exposureVisible = true
      this.loadLeftTreeData()
      this.fileList = []
      this.exposureLoading = true
      this.receivedPersionNodes = []
      this.receivedPersionKeys = []
      this.exposureForm.title = ""
      this.exposureForm.content = ""
    }, 
    selectNode(data) {
      console.log('点击树形data',data)
    },
    save() { 
          save(this.proTaskFrom).then(response => {
          if (this.$refs.upload.uploadFiles !== undefined && this.$refs.upload.uploadFiles.length > 0) {
            // 附件上传到服务器
            const imgParams =  "&bizType=" +  this.uploaddata.bizType +  "&bizId=" + response.data.id;
            file(imgParams, this.$refs.upload.uploadFiles).then(res => {
              this.visibleOrder = false;
            }).catch(errorRes => {
              this.visibleOrder = false;
            });
          }
          this.visibleOrder = false
          this.$message({
            type: "success",
            message: "提交成功!"
          })
          this.getList();
        }).catch(errorRes => {
            this.visibleOrder = false;
            this.getList();   
        });  
    },
    handleSuccess() {
      this.fileList = [];
      this.getList();
    },
   handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisibleImg = true;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    selectChang(data){
      console.log('data,',data)
      this.listQuery.status = data
      this.listQuery.pageNo = 1
      this.getList()
    },
    gdhandlePictureCardPreview(){
      this.gd.dialogImageUrl = file.url;
      this.gd.dialogVisibleImg = true;
    },
    // 点击小正方形
    checkBoxBtn(a, b) {
      console.log(a, b)
      this.receivedPersionNodes = []
      this.receivedPersionKeys = []

      b.checkedNodes.map((item, index) => {
        if (item.type === 'u') {
          this.receivedPersionNodes.push(item)
          this.receivedPersionKeys.push(item.id)
        }
      })

      this.exposureForm.userDataId = this.receivedPersionKeys.join(",")
    },
    // 点击人员进行,删除,去掉树勾选
    deleteNode(index) {
      this.receivedPersionNodes.splice(index, 1)
      this.receivedPersionKeys.splice(index, 1)
      this.exposureForm.userDataId = this.receivedPersionKeys.join(",")

      this.refLeftTree.setCheckedKeys(this.receivedPersionKeys)
    },
    // 曝光保存
    submitBtn() {
      const saveParams = {
        userData: this.exposureForm.userDataId,
        title: this.exposureForm.title,
        content: this.exposureForm.content,
        bizId: this.exposureForm.bizId
      };
      console.log("saveParams", saveParams);
      saveExposure(saveParams)
        .then(res => {
          this.uploadParams.bizId = res.data.id;
          // 附件上传到服务器
          const imgParams =
            "&bizType=" +
            this.uploadParams.bizType +
            "&bizId=" +
            this.uploadParams.bizId;
          file(imgParams, this.$refs.upload.uploadFiles)
            .then(res => {
              console.log("file----res", res);
              this.exposureVisible = false;
            })
            .catch(errorRes => {
              this.exposureVisible = false;
            });
          // file()
        })
        .catch(errorRes => {
          this.exposureVisible = false;
        });
    },
    // 打印指定区域
    printBtn() {
      Print({
        printable: 'printWrap',//要打印区域的元素ID
        type: 'html',
        // 继承原来的所有样式
        targetStyles: ['*']
      })
    },
    getList() {
      this.listLoading = true
      console.log("this.listQuery::::", this.listQuery)
      getList(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.list
        this.total = response.data.count
      })

      
      //相关部门数据
      getSynergOffice().then(response => {
        //console.log('相关部门数据：',response.data);
        this.synergOfficeList = response.data.list
      });
      getLoweroffice().then(response => {
       // console.log('接单单位数据：',response.data);
       this.lowerofficeList = response.data.list
      });
    }, 
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    showdetail(row) {  
      if(row!=undefined&&row!=null)
      this.workflowdetail.row=row;  
      this.gdid.id =  this.workflowdetail.row.id
     //  this.workflowdetail.visible = ""
     // this.workflowsend.form = ""
      get(this.workflowdetail.row.id).then(response => {
        this.workflowdetail.visible = true
        this.prodetail = response.data 
        console.log(this.prodetail)
        if(this.prodetail!=null&&this.prodetail.handel!=undefined&&this.prodetail.handel.actid!=undefined){
            this.workflowsend.form.actid=this.prodetail.handel.actid;
            this.uploaddata.bizId = this.workflowsend.form.actid
        }
      })
    }, 
     closelayer() { 
      this.workflowdetail.visible=false;
      if(this.worknotofficeopetion.isworknotofficeopetion)this.getList(); 
    },
    operation(btn) {  
       this.worknotofficeopetion.btn=btn; 
       if(btn.id=="send"){
         this.workflowsend.isperson=btn.isPerson;
         this.send(btn);
       }  
       if(btn.id=="back"||btn.id=="handeled"||btn.id=="pass"||btn.id=='unpass'){
         this.worknotofficeopetionhandel(btn);
       }   
       if(btn.id=="handel"){
          this.dobeginhandel()
       }
    },
    create() {
       // this.v.proTaskFrom = true
        this.visibleOrder = true;
        this.proTaskFrom = {}
         this.fileList=[]
    },
	  officechange(data){ 
	      if(data!=""){
	         this.userlistload(data);
	      }
	  },
    userlistload(data){
        this.workflowsend.form.receiveUserId=null;
        officeuserlist(data).then(response => { 
          console.log("response.data.list:::",response.data.list);
          if(response.data.list!=undefined){
             this.workflowsend.userlist= response.data.list;
          }else{
            this.workflowsend.userlist=null;
          }
        }) 
    }, 

    /***流程操作部分 start ****** */ 
    worknotofficeopetionhandel(btn){ 
         this.worknotofficeopetion.visible=true;
         if(btn.id=="back"){ 
           this.workflowsend.form.comment = ""
           this.worknotofficeopetion.title="退回工单"
           this.worknotofficeopetion.placeholder="请输入内容"
           this.worknotofficeopetion.label="退回详情"
           this.worknotofficeopetion.confirm="确认" 
         }
         if(btn.id=="handeled"){
            this.workflowsend.form.comment = ""
           this.worknotofficeopetion.title="处理完成操作"
           this.worknotofficeopetion.placeholder="请输入内容"
           this.worknotofficeopetion.label="处理详情"
           this.worknotofficeopetion.confirm="确认" 
         }
         if(btn.id=="pass"){
            this.workflowsend.form.comment = ""
              this.worknotofficeopetion.title="复核通过"
              this.worknotofficeopetion.placeholder="请输入内容"
              this.worknotofficeopetion.label="内容"
              this.worknotofficeopetion.confirm="确认" 
              this.workflowsend.form.isaudit="1";
         }
         if(btn.id=='unpass'){
              this.worknotofficeopetion.title="复核不通过"
              this.worknotofficeopetion.placeholder="请输入内容"
              this.worknotofficeopetion.label="内容"
              this.worknotofficeopetion.confirm="确认" 
              this.workflowsend.form.isaudit="0";
         } 
    },
    doworknotofficeopetionhandel(){
       const btn=this.worknotofficeopetion.btn 
         if(btn.id=="back"){
           this.doback();
         }
         if(btn.id=="handeled"){
             this.doendhandel();
         }
         if(btn.id=="pass"){
            this.doauditandel();
         }
         if(btn.id=='unpass'){
           this.doauditandel();
         }  
        this.worknotofficeopetion.visible=false;  
        this.worknotofficeopetion.isworknotofficeopetion=true;
    },
    send(btn){
      this.workflowsend.visible=true; 
       this.workflowsend.form.officeid =""
      this. workflowsend.form.comment=""
       this.workflowsend.form.annex=""
       this.fileList= []
      officelist().then(response => {
        if(response.data.list!=undefined&&response.data.list.length>0){
          this.workflowsend.officelist = response.data.list;  
          this.officechange(this.workflowsend.officelist[0].id);
        }
      }) 
    },

    dosend(btn){ 
      this.workflowsend.visible=false; 
      this.worknotofficeopetion.isworknotofficeopetion=true;
      send(this.workflowsend.form).then(response => {      
          const imgParams = "&bizType=" + this.uploaddata.bizType +"&bizId=" + this.workflowsend.form.actid;
          if(this.$refs.upload.uploadFiles!=undefined&&this.$refs.upload.uploadFiles.length>0){
            file(imgParams, this.$refs.upload.uploadFiles).then(res => { 
              this.visibleOrder = false
              this.showdetail();
            })
            .catch(errorRes => {
              this.exposureVisible = false;
            }); 
            this.$message({
                type: "success",
                message: "派单成功!"
            }) 
            this.showdetail(); 
            this.visibleOrder = false
          }else{
            this.visibleOrder = false
            this.showdetail();
             this.$message({
              type: "success",
              message: "派单成功!"
            }) 
          } 
        })  
    }, 
    doback() {
      back(this.workflowsend.form).then(response => {
        this.$message({
          type: "success",
          message: "退回成功!"
        });
        this.workflowback.visible = false;
        this.showdetail();
      });
    },
    dobeginhandel(btn){ 
      beginhandel({actid:this.workflowsend.form.actid}).then(response => { 
       this.$message({
          type: "success",
          message: "状态更新成功!"
        })
       this.showdetail();
      }) 
    },
    endhandel(){
      this.workhandelend.visible=true;
    }, 
    doendhandel(btn){
      endhandel(this.workflowsend.form).then(response => { 
       this.$message({
          type: "success",
          message: "处理完成!"
        })
       this.showdetail();
      }) 
    },
    doauditandel(){
      console.log("审核操作完成:::");
        audit(this.workflowsend.form).then(response => { 
        this.$message({
          type: "success",
          message: "审核操作完成!"
        })
        this.showdetail();
      }) 
    },
    /***流程操作部分 end ****** */
    del(row) {
      var self = this;
      console.log(row.id);
      del(row.id)
        .then(response => {
          //删除列表数据
          const index = this.list.indexOf(row); //找到要删除数据在list中的位置
          this.list.splice(index, 1); //通过splice 删除数据
          //  this.getList()
          this.$message({
            type: "success",
            message: "删除成功!"
          });
      
      }).catch(error => {
        this.listLoading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
/*打印按钮*/
.printBtn {
  position: absolute;
  right: 20px;
}
/*layout弹窗里面的自定义按钮*/
.customerBtn {
  position: absolute;
  bottom: 25px;
  left: 50%;
  transform: translate(-50%);
}
.command-user {
  margin: 5px 8px;
  height: 34px;
  min-width: 74px;
  font-weight: 500;
  border-radius: 3px;
  padding: 5px 10px;
  line-height: 24px;
  display: inline-block;
  color: #fff;
  font-size: 14px;
  text-align: center;
  background-color: #279cf5;
  float: left;
  i {
    font-size: 15px;
    cursor: pointer;
  }
  i:hover {
    color: #d9534f;
  }
}
.command-mian-body-image {
  position: absolute;
  bottom: 20px;
  right: 20px;
}

.app-container > .el-container {
  min-height: calc(100vh - 126px)
}
.app-container {
  /deep/ .el-dialog__body {
    max-height: 650px;
  }
  .city {
    color: #35acf2;
  }
  .country {
    color: #3dc87e;
  }
  /deep/ .el-form-item--mini.el-form-item {
    margin-bottom: 0px;
  }  
    /*滚动条样式*/
  .container-scroll::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 4px;
    /*高宽分别对应横竖滚动条的尺寸*/
    height: 4px;
  }
  .container-scroll::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: rgba(0, 0, 0, 0.2);
  }
  .container-scroll::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 0;
    background: rgba(0, 0, 0, 0.1);
  }
  .work-order-details-list-title {
    color: #279cf5;
    margin-bottom: 15px;
    padding-left: 10px;
    border-left: 2px solid #279cf5;
    height: 14px;
    line-height: 14px;
  }
  .work-order-details-list-split {
    border-top: 10px #f0f3f5 solid;
    margin: -1px -20px 0 -20px;
    padding: 0px 20px 0px 20px;
  }
  .splitBox:not(:first-of-type) {
    padding-top: 10px;
    padding-bottom: 10px;
  }
  /deep/ .el-dialog__body {
    img {
      width: 24%;
      max-height: 15em;
      margin: 0.5em 0.2em 0 0;
      float: left;
    }
    video,
    audio {
      width: 49%;
      max-height: 15em;
      margin: 0.5em 0.2em 0 0;
      float: left;
    }
  }
}
</style>
