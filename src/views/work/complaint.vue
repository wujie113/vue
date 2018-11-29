<template>
  <div class="app-container">
    <el-container v-loading="listLoading">
      <el-container>
        <el-header height="125px">
          <div style="" class="topTitle">
            投诉列表
          </div>
          <div class="filter-container">
            <el-input placeholder="请输入问题描述" v-model="listQuery.description" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
            <rm-dict class="filter-item" title="请选择类型" placeholder="请选择类型" type="work_complan" v-model="listQuery.type" />
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
          </div>
        </el-header>
        <el-main>
          <div class="widget-divBox">
            <div class="widget-div" v-for="(list, index) in lists" :key="index">
              <div class="widget-divContent clearfix">
                <div class="widget-divContent-main">
                  <div class="widget-divContent-main-title">
                    <span>
                      {{ list.typename }}（<span class="unProcessed">{{list.status == '0' ? '未处理' : '已处理'}}</span>）
                    </span>
                    <span>
                      {{ list.reportDate }}
                    </span>
                  </div>
                  <p class="widget-divContent-main-content" :title="list.description">{{ list.description }}</p>
                  <div class="widget-divContent-main-imgs clearfix">
                    <ul class="widget-divContent-main-imgsGroup clearfix">
                      <li class="" v-for="(img, index) in list.imageurl" :key="index">
                        <viewer :images="list.imageurl">
                          <img :src="img.url" :key="index">
                        </viewer>
                        <!-- <img v-preview="img.url" :src="img.url" :alt="img.title" :key="index" preview-title-enable="true" preview-nav-enable="true"> -->
                      </li>
                    </ul>
                  </div>
                  <el-row :gutter="10">
                    <el-col :xs="12" :sm="12" :md="15" :lg="17" :xl="18" class="hidden-sm-and-down">
                      <div class="grid-content bg-purple">
                        <span>
                          <a href="javascript:void(0)" title="经纬度">
                            <svg-icon icon-class="location" />
                          </a>
                          {{ list.lng }},{{ list.lat }}
                        </span>
                        <span>
                          <a href="javascript:void(0)" title="上报人">
                            <svg-icon icon-class="user1" />
                          </a>
                          {{ list.report }}
                        </span>
                        <span>
                          <a href="javascript:void(0)" title="所属区域">
                            <svg-icon icon-class="areaColor" />
                          </a>
                          {{ list['area.id'] }}
                        </span>
                      </div>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="9" :lg="7" :xl="6">
                      <div class="grid-content bg-purple-light">
                        <a href="javascript:void(0)" title="生成工单">
                          <svg-icon icon-class="addColor" />
                        </a>
                        <a href="javascript:void(0)" title="定位">
                          <svg-icon icon-class="locationColor" />
                        </a>
                        <a href="javascript:void(0)" title="详情" @click="detailBtn(list.id)">
                          <svg-icon icon-class="detailColor" />
                        </a>
                        <a href="javascript:void(0)" title="回复" @click="replayBtn(list.id)">
                          <svg-icon icon-class="replayColor" />
                        </a>
                      </div>
                    </el-col>
                  </el-row>
                  <!-- <div class="widget-divContent-main-footer">
                  </div> -->
                </div>
              </div>
            </div>
          </div>
          <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />          
        </el-main>
      </el-container>
    </el-container>
    <!-- 详情弹窗 -->
    <el-dialog :visible.sync="visible" title="投诉详情">
      <el-form :model="form" abel-width="80px" size="mini">
        <el-form-item label="问题类型">
          {{form.typename}}
        </el-form-item>
        <el-form-item label="纬度纬度">
          {{form.lat}},{{form.lng}}
        </el-form-item>
        <el-form-item label="上报人">
          {{form.report}}
        </el-form-item>
        <el-form-item label="上报电话">
          {{form.reportPhone}}
        </el-form-item>
        <el-form-item label="上报时间">
          {{form.reportDate}}
        </el-form-item>
        <el-form-item label="问题描述">
          {{form.description}}
        </el-form-item>
      </el-form>
      <viewer :images="slide1">
        <img :src="img.url" :key="index" v-for="(img, index) in slide1">
      </viewer>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible = false">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 回复弹窗 -->
    <el-dialog :visible.sync="replayDialogVisible" title="投诉回复">
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
  </div>
</template> 
<script>
import Pagination from "@/components/Pagination";
import { getList, get, showstatus, addComment } from "@/api/work/complaint.js";
import RmDict from "@/components/rm/dict";
import RmOrgSelect from "@/components/rm/orgselect";
import RmUserSelect from "@/components/rm/userselect";
import RmAreaSelect from "@/components/rm/areaselect";
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
      imgs: [
        {
          url:
            "http://117.40.230.32:10101/file/20181103/154122821368920157eaa041d4397a6c117f5025bc984_thumb.png",
          title: "pic1",
          name: "1111"
        },
        {
          url:
            "http://117.40.230.32:10101/file/20181103/154122821368920157eaa041d4397a6c117f5025bc984_thumb.png",
          title: "pic2",
          name: "22222"
        }
      ],
      imgs2: [
        {
          src:
            "http://117.40.230.32:10101/file/20181103/154122821368920157eaa041d4397a6c117f5025bc984_thumb.png",
          msrc:
            "http://117.40.230.32:10101/file/20181103/154122821368920157eaa041d4397a6c117f5025bc984_thumb.png",
          alt: "picture1",
          title: "Image Caption 1",
          w: 100,
          h: 150
        },
        {
          src:
            "http://117.40.230.32:10101/file/20181103/154122821368920157eaa041d4397a6c117f5025bc984_thumb.png",
          msrc:
            "http://117.40.230.32:10101/file/20181103/154122821368920157eaa041d4397a6c117f5025bc984_thumb.png",
          alt: "picture1",
          title: "Image Caption 1",
          w: 100,
          h: 150
        }
      ],
      visible: false,
      replayDialogVisible: false,
      listLoading: false,
      checked: false,
      slide1: [],
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
      lists: null,
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
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      getList(this.listQuery).then(response => {
        this.listLoading = false;
        this.lists = response.data.list;
        this.total = response.data.count;
      });
    },
    handleFilter() {
      this.listQuery.pageNo = 1;
      this.getList();
    },
    // 点击详情,查看详情
    detailBtn(idx) {
      this.visible = true;
      console.log("idx", idx);
      get(idx).then(response => {
        this.form = response.data;
        const imagelist = this.form.imageurl;
        this.slide1 = imagelist;

        console.log("imagelist", imagelist);
        // imagelist.forEach((value, index) => {
        //   this.slide1.push(
        //     {
        //       url: value.url,
        //       name: value.name,
        //     }
        //   )
        // });
      });
    },
    // 回复弹窗
    replayBtn(id) {
      // 打开弹窗
      this.replayDialogVisible = true;
      // 内容置空
      Object.assign(this.form2, this.$options.data().form2)
      this.checked = false;
      console.log("id", id);
      this.params.idA = id;
      showstatus(id).then(response => {
        if (response.data.comment1) {
          this.form2.desc = response.data.comment1.comment
        } else {
          this.form2.desc = ""
        }

      });
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
      let desc = this.form2.desc;
      this.replayDialogVisible = false;
      let data = Object.assign(this.form2, this.params);
      addComment(data).then(response => {
        this.getList();
        this.$message({
          message: "回复成功",
          type: "success"
        });
      });
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
      this.visible = false;
      //
    },
    del(row) {
      var self = this;
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
.widget-divBox {
  p,
  ul,
  li {
    margin: 0;
    padding: 0;
  }
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
}
</style>
