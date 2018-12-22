<template>
  <div class="app-container">
    <el-container v-loading="listLoading">
      <el-container>
        <el-header height="125px">
          <div class="topTitle">投诉列表</div>
          <div class="filter-container">
            <div v-if="marks" style="display: inline-block;">
              <el-input
                placeholder="请输入问题描述"
                v-model="listQuery.description"
                style="width: 200px;"
                class="filter-item"
                @keyup.enter.native="handleFilter"
              />
              <rm-dict
                class="filter-item"
                title="请选择类型"
                placeholder="请选择类型"
                type="work_complan"
                v-model="listQuery.type"
              />
              <el-button
                class="filter-item"
                type="primary"
                icon="el-icon-search"
                @click="handleFilter"
              >查询</el-button>
            </div>
            <el-button
              class="filter-item"
              type="primary"
              :icon="isMapShow ? 'el-icon-menu' : 'el-icon-location'"
              @click="changeMap"
            >切换到{{ isMapShow ? '列表':'地图' }}视图</el-button>
          </div>
        </el-header>
        <el-main>
          <div v-show="!isMapShow" class="complaintBox">
            <div class="widget-divBox">
              <div class="noData-divBox" v-show="lists.length <= 0">
                <div>
                  <img src="../../../static/img/empty.png" alt="无数据记录">
                  <p>无数据记录</p>
                </div>
              </div>
              <div class="widget-div" v-for="(list, index) in lists" :key="index">
                <div class="widget-divContent clearfix">
                  <div class="widget-divContent-main">
                    <div class="widget-divContent-main-title">
                      <span>
                        {{ list.typename }}（
                        <span
                          class="unProcessed"
                        >{{list.status == '0' ? '未处理' : '已处理'}}</span>）
                      </span>
                      <span>{{ list.reportDate }}</span>
                    </div>
                    <p
                      class="widget-divContent-main-content"
                      :title="list.description"
                    >{{ list.description }}</p>
                    <div class="widget-divContent-main-imgs clearfix">
                      <ul class="widget-divContent-main-imgsGroup clearfix">
                        <li class v-for="(img, index) in list.imageurl" :key="index">
                          <viewer :images="list.imageurl">
                            <img :src="img.url" :key="index">
                          </viewer>
                          <!-- <img v-preview="img.url" :src="img.url" :alt="img.title" :key="index" preview-title-enable="true" preview-nav-enable="true"> -->
                        </li>
                      </ul>
                    </div>
                    <el-row :gutter="10">
                      <el-col
                        :xs="12"
                        :sm="12"
                        :md="15"
                        :lg="17"
                        :xl="18"
                        class="hidden-sm-and-down"
                      >
                        <div class="grid-content bg-purple">
                          <span>
                            <a href="javascript:void(0)" title="经纬度">
                              <svg-icon icon-class="location"/>
                            </a>
                            {{ list.lng }},{{ list.lat }}
                          </span>
                          <span>
                            <a href="javascript:void(0)" title="上报人">
                              <svg-icon icon-class="user1"/>
                            </a>
                            {{ list.report }}
                          </span>
                          <span>
                            <a href="javascript:void(0)" title="所属区域">
                              <svg-icon icon-class="areaColor"/>
                            </a>
                            {{ list['area.id'] }}
                          </span>
                        </div>
                      </el-col>
                      <el-col :xs="12" :sm="12" :md="9" :lg="7" :xl="6">
                        <div class="grid-content bg-purple-light">  
                           <a href="javascript:void(0)" title="生成工单" @click="list.protaskId != null&&list.protaskId!='' ? null : addOrder(list.id)">
                                <svg-icon :icon-class="list.protaskId != null&&list.protaskId!='' ? 'addLightColor' : 'addColor'" />
                          </a>
                          <a
                            href="javascript:void(0)"
                            title="定位"
                            @click="showFeature(list.id,'tousu',list.lng,list.lat)"
                          >
                            <svg-icon icon-class="locationColor"/>
                          </a>
                          <a href="javascript:void(0)" title="详情" @click="detailBtn(list.id)">
                            <svg-icon icon-class="detailColor"/>
                          </a>
                          <a href="javascript:void(0)" title="回复" @click="replayBtn(list.id)">
                            <svg-icon icon-class="replayColor"/>
                          </a>
                        </div>
                      </el-col>
                    </el-row>
                    <!-- <div class="widget-divContent-main-footer">
                    </div>-->
                  </div>
                </div>
              </div>
            </div>
            <pagination
              v-show="total>0"
              :total="total"
              :page.sync="listQuery.pageNo"
              :limit.sync="listQuery.pageSize"
              @pagination="getList"
            />
          </div>
          <div class="mapBox" v-if="isMapShow">
            <rm-map v-model="map" :clientHeight="clientHeight" />
          </div>
        </el-main>
      </el-container>
    </el-container>
    <!-- 详情弹窗 -->
    <el-dialog :visible.sync="visible" title="投诉详情" :modal-append-to-body="false">
      <el-form :model="form" abel-width="80px" size="mini">
        <el-form-item label="问题类型">{{form.typename}}</el-form-item>
        <el-form-item label="纬度经度">{{form.lat}},{{form.lng}}</el-form-item>
        <el-form-item label="上报人">{{form.report}}</el-form-item>
        <el-form-item label="上报电话">{{form.reportPhone}}</el-form-item>
        <el-form-item label="上报时间">{{form.reportDate}}</el-form-item>
        <el-form-item label="问题描述">{{form.description}}</el-form-item>
      </el-form>
      <viewer :images="slide1" class="clearfix">
        <img :src="img.url" :key="index" v-for="(img, index) in slide1">
      </viewer>
      <div class="work-order-details-list-split" v-if="prodetail.list!=null&&prodetail.list.length >0"></div>
      
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
              <viewer :images="child.prictureUrls" class="clearfix">
                <img :src="img" :key="index" v-for="(img, index) in child.prictureUrls">
              </viewer>
              <!-- 分割线 -->
              <div class="work-order-details-list-split" v-if="wrapindex !== prodetail.list.length - 1"></div>
       </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible = false">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 回复弹窗 -->
    <el-dialog :visible.sync="replayDialogVisible" title="投诉回复" :modal-append-to-body="false">
      <el-form :model="form2" ref="form2" label-width="80px">
        <el-form-item label="回复详情">
          <el-input type="textarea" v-model="form2.desc" placeholder="请输入回复内容" rows="5"></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="checked" @change="handleChecked">无效投诉</el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="replayDialogVisible = false">取 消</el-button>
        <el-button @click="saveReplay" type="primary">提 交</el-button>
      </div>
    </el-dialog>

    <!-- 工单弹窗 -->
    <el-dialog :visible.sync="visibleOrder" title="生成工单" :modal-append-to-body="false">
      <el-form ref="proTaskFrom" :model="proTaskFrom" abel-width="80px" size="mini">
        <el-form-item label="接单单位">
          <el-select v-model="proTaskFrom.dept" placeholder="请选择单位" clearable class="filter-item">
            <el-option
              v-for="item in lowerofficeList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="相关部门">
          <el-select v-model="proTaskFrom.unit" placeholder="请选择部门" clearable class="filter-item">
            <el-option
              v-for="item in synergOfficeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="办结时间">
          <el-date-picker
            v-model="proTaskFrom.handleTime"
            type="date"
            placeholder="Pick a date"
            style="width: 100%;"
          />
        </el-form-item>
        <el-form-item label="问题描述">
                <el-input type="textarea" v-model="proTaskFrom.description" placeholder="请输入问题描述" rows="5"></el-input>
       </el-form-item>
              <el-form-item label="任务描述">
                <el-input type="textarea" v-model="proTaskFrom.taskcontent" placeholder="请输入任务描述" rows="5"></el-input>
              </el-form-item>
      </el-form>
      <el-upload
        :action="doUpload"
        list-type="picture-card"
        :auto-upload="false"
        :on-preview="handlePictureCardPreview"
        accept
        ref="upload"
        :file-list="fileList"
        :before-remove="removefile"
        :data="uploaddata"
        :on-success="handleSuccess"
        :on-remove="handleRemove"
        class="elUpload"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visibleOrder = false">取 消</el-button>
        <el-button @click="save()" type="primary">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 工单弹窗  end-->
  </div>
</template> 
<script>
import Pagination from "@/components/Pagination";
import { getList, get, showstatus, addComment } from "@/api/work/complaint.js";
import RmDict from "@/components/rm/dict";
import { getToken } from "@/utils/auth";
import RmMap from "@/components/rm/map";
import RmOrgSelect from "@/components/rm/orgselect";
import RmUserSelect from "@/components/rm/userselect";
import RmAreaSelect from "@/components/rm/areaselect";
import { save } from "@/api/work/proTask.js";
import {
  getorgtrees,
  getSynergOffice,
  getLoweroffice
} from "@/api/res/management.js";
import { forEach } from "ol";
export default {
  components: {
    Pagination,
    RmDict,
    RmOrgSelect,
    RmUserSelect,
    RmAreaSelect,
    RmMap
  },
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
      main:"",
      clientHeight: 0,
      isMapShow: false,
      marks: true,
      imgs: [],
      imgs2: [],
      visible: false,
      visibleOrder: false,
      replayDialogVisible: false,
      listLoading: false,
      synergOfficeList: null,
      lowerofficeList: null,
      checked: false,
      slide1: [],
      dataArray: [],
      fileList: [],
      map: null,
      doUpload: process.env.BASE_FILE_API + "?token=" + getToken(),
      proTaskFrom: {
        name: null,
        reportId: null,
        source: "complaint",
        isSupervise : '督'
      },
      uploaddata: {
        bizId: null,
        bizType: "complaint"
      },
      form: {
        lat: null,
        lng: null,
        area: { id: null },
        type: null,
        address: null,
        report: null,
        reportPhone: null,
        reportDate: null,
        description: null,
        typename: null
      },
      form2: {
        desc: ""
      },
      params: {
        idA: ""
        // bizId:""
      },
       prodetail: {
        list:null,
        handel:{
          btnlist:null
        }
      }, 
      lists: [],
      total: 0,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        importance: undefined,
        search: undefined,
        description: null,
        type: undefined,
        sort: "+id"
      },
      importanceOptions: [1, 2, 3]
    };
  },
  created() {
    this.getList()
    console.log('--created周期',document.getElementsByClassName('el-main')[0])
    

  },
  mounted(){
    const tempH = this.getHeight(document.getElementsByClassName('app-container')[0]) - 210
    console.log('--mounted周期', tempH)
    this.clientHeight = tempH

    const that = this
    window.onresize = function temp() {
      // that.clientHeight = `${document.documentElement.clientHeight}px`
      that.clientHeight = that.getHeight(document.getElementsByClassName('app-container')[0]) - 210
      // that.clientHeight = that.getHeight(window) - 84
      console.log('window.onresize',that.clientHeight)
    }
  },
  methods: {
    getList() {
      this.listLoading = true;
      getList(this.listQuery).then(response => {
        this.listLoading = false;
        this.lists = response.data.list;
        for (const key in this.lists) {
          // 图片只取前面四张,用于主页面显示
          if (this.lists[key].imageurl) {
            this.lists[key].imageurl = this.lists[key].imageurl.splice(0, 4);
          }
        }
        this.total = response.data.count;
      });
      //相关部门数据
      getSynergOffice().then(response => {
        //console.log('相关部门数据：',response.data);
        this.synergOfficeList = response.data.list;
      });
      getLoweroffice().then(response => {
        // console.log('接单单位数据：',response.data);
        this.lowerofficeList = response.data.list;
      });
    },
    // 点击生成工单
    addOrder(id) {
      /*  */
      this.visibleOrder = true;
      console.log("id", id);
      this.proTaskFrom.reportId = id;
    },
    handleFilter() {
      this.listQuery.pageNo = 1;
      this.getList();
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
    removefile(file) {
      delfiles({ ids: file.id }).then(response => {
        console.log("图片删除成功!!!!!");
      });
    },
    // 点击顶部的按钮 切换到地图
    changeMap() {
      if (this.isMapShow && this.marks) {
        this.isMapShow = false;
        this.marks = true;
      } else if (this.isMapShow && this.marks == false) {
        this.isMapShow = false;
        this.marks = true;
      } else {
        this.isMapShow = true;
        this.marks = true;
      }
    },
    //定位
    showFeature(id, type, lng, lat) {
      
      if (this.isMapShow) {
        this.isMapShow = false;
        this.marks = true;
      } else {
        this.isMapShow = true;
        this.marks = false;
      }
      var lng = lng;
      var lat = lat;
console.log("------------ ",id, type, lng, lat)
var self=this;
setTimeout(() => {
  console.log("self.map",self.map)
   self.map.showFeature({ id: id, gtype: type, name: '投诉', lng: lng, lat: lat })
}, 500);
     
    },
    // 点击详情,查看详情
    detailBtn(idx) {
      this.visible = true;
      get(idx).then(response => {
        this.form = response.data.complaint;
          this.prodetail = response.data; 
        const imagelist = this.form.imageurl;
        this.slide1 = imagelist;
      });
    },
    // 回复弹窗
    replayBtn(id) {
      // 打开弹窗
      this.replayDialogVisible = true;
      // 内容置空
      Object.assign(this.form2, this.$options.data().form2);
      this.checked = false;
      this.params.idA = id;
    },
    // 无效投诉
    handleChecked(val) {
      console.log("val", val);
      if (val) {
        this.form2.desc = "已收到投诉信息！谢谢您的反馈。";
      } else {
        this.form2.desc = "";
      }
    },
    // 回复内容提交
    saveReplay() {
      var desc = this.form2.desc;
      console.log("desc",desc)
      if (desc == null) {
        this.$message({
          message: "输入不能为空"
        });
      } else {
        this.replayDialogVisible = false;
        const data = Object.assign(this.form2, this.params);
        addComment(data).then(response => {
          this.getList();
          this.$message({
            message: "回复成功",
            type: "success"
          });
        });
      }
    },
    // edit(row) {
    //   //console.log(JSON.stringify(row));
    //   this.visible = true;
    //   get(row.id).then(response => {
    //     this.form = response.data;
    //     console.log("form:::", this.form); this.slide1 = [];
    //     const imagelist = this.form.imageurl;
    //     imagelist.forEach((value, index) => {
    //       this.slide1.push(
    //         {
    //           src: value.url,
    //           msrc: value.url,
    //           alt: value.name,
    //           title: value.name,
    //           w: 1200,
    //           h: 900
    //         }
    //       )
    //     });
    //   });
    // },
    save() {
      //console.log('保存:',JSON.stringify(this.form),this.selectUser);
      save(this.proTaskFrom)
        .then(response => {
          // 上传到服务器
          this.uploaddata.bizId = response.data.id;
          console.log("保存:", this.$refs.upload.uploadFiles.length);
          if (
            this.$refs.upload.uploadFiles != undefined &&
            this.$refs.upload.uploadFiles.length > 0
          ) {
            // 上传到服务器
            this.$refs.upload.submit();
          }
          this.visibleOrder = false;
          this.$message({
            type: "success",
            message: "提交成功!"
          });
          this.getList();
        })
        .catch(error => {
          this.listLoading = false;
        });
    },
    del(row) {
      // const self = this
      //console.log(row);
    },
    handleClose() {
      console.log(".......");
    }
  }
};
</script>
<style lang="scss" scoped>
.el-dialog__body {
  img {
    width: 24%;
    max-height: 15em;
    margin: 0.5em 0.2em 0 0;
    float: left;
  }
}
.app-container > .el-container {
  min-height: 86vh;
}
.app-container {
  /deep/ .el-form-item--mini.el-form-item {
    margin-bottom: 0px;
  }
}
.widget-divBox {
  padding: 14px 0 10px 0;
  width: 100%;
  // margin: 0 auto;
  text-align: left;
  .widget-div {
    width: 50%;
    display: inline-block;
    height: auto;
    margin-bottom: 0px;
    padding: 10px 10px 8px 10px;
    .widget-divContent {
      background-color: #fff;
      text-align: left;
      border-radius: 5px;
      width: 100%;
      height: auto;
      padding: 10px;
      position: relative;
      box-shadow: 0px 0px 8px 0px rgba(36, 44, 51, 0.2);
      .widget-divContent-main {
        // display: inline-block;
        height: auto;
        float: left;
        width: 100%;
        .widget-divContent-main-title > span:first-of-type {
          font-size: 16px;
          font-weight: bold;
          .unProcessed {
            // 未处理
            color: #f25c5c;
          }
          .Processing {
            // 处理中
            color: #3dc87e;
          }
          .processed {
            // 已处理
            color: #279cf5;
          }
        }
        .widget-divContent-main-title > span:last-of-type {
          position: absolute;
          right: 15px;
          top: 15px;
          font-size: 14px;
        }
        .widget-divContent-main-content {
          // min-height: 42px;
          padding: 15px 0;
          font-size: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .widget-divContent-main-imgs {
          min-height: 10em;
          .widget-divContent-main-imgsGroup {
            float: left;
            width: 100%;
            li {
              list-style: none;
              width: 25%;
              font-size: 12px;
              position: relative;
              vertical-align: middle;
              padding: 5px 10px 5px 0;
              float: left;
              img {
                border-radius: 5px;
                width: 100%;
                cursor: pointer;
                height: 10em;
              }
            }
          }
        }
        .bg-purple {
          span {
            line-height: 24px;
            color: #888888;
            margin-right: 0.5em;
          }
        }
        .bg-purple-light {
          text-align: right;
          .svg-icon {
            margin: 0 0.4em;
          }
        }

        .widget-divContent-main-footer {
          padding: 0.5em 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .svg-icon {
            cursor: pointer;
          }
        }
        .widget-divContent-main-footer > div:first-of-type span {
          line-height: 24px;
          color: #888888;
          margin-right: 0.5em;
        }
        .widget-divContent-main-footer > div:last-of-type .svg-icon {
          margin: 0.4em;
        }
      }
    }
    .widget-divContent:hover {
      box-shadow: 0px 0px 10px 0px rgba(36, 44, 51, 0.8);
    }
  }
  .noData-divBox {
    padding: 14px 0px 10px 0px;
    width: 88%;
    margin: 0 auto;
    text-align: left;
    div {
      text-align: center;
      margin: 10px auto;
      img {
        margin-top: 30px;
      }
    }
  }
}
</style>

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
  min-height: 86vh;
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
