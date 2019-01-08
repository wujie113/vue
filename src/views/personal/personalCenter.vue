<template>
  <div class="app-container">
    <el-row :gutter="5" v-loading="loading">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <div class="panel">
          <div class="panelHeading">个人中心</div>
          <div class="source panel-body">
            <div style="width: 40%;margin-top: 5%;">
              <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="头像">
                  <div class="item_bock head_p" @click.stop="uploadHeadImg">
                    <div class="head_img" v-if="imageUrl">
                      <img :src="imageUrl"/>
                    </div>
                    <div class="setting_right" @click.stop="uploadHeadImg">
                      <!--<div class="caption">更改头像</div>-->
                      <el-button type="primary" icon="upload">{{ imageUrl ? '修改' : '设置'}}头像</el-button>
                    </div>
                    <input type="file" accept="image/*" @change="aaaa" class="hiddenInput"/>
                  </div>
                </el-form-item>
                <el-form-item label="单位">
                  {{ unit }}
                </el-form-item>
                <el-form-item label="岗位">
                  {{ postlabel }}
                  <!--<el-select v-model="form.post" placeholder="请选择">-->
                    <!--<el-option v-for="item in postArray" :key="item.id" :label="item.name" :value="item.id">-->
                    <!--</el-option>-->
                  <!--</el-select>-->
                </el-form-item>
                <el-form-item label="账号">
                  {{ name }}
                  <!--<el-input v-model="form.loginName" disabled="disabled" />-->
                </el-form-item>
                <el-form-item label="姓名">
                  {{ nickname }}
                </el-form-item>
                <el-form-item label="手机号码">
                  {{ phone }}
                  <!--<el-input type="text" v-model="form.mobile" />-->
                </el-form-item>
                <el-form-item label="性别">
                  {{ gender }}
                <!--<el-select v-model="form.gender" placeholder="请选择性别" clearable class="filter-item">-->
                  <!--<el-option label="男" value="M"></el-option>-->
                  <!--<el-option label="女" value="F"></el-option>-->
                <!--</el-select>-->
                </el-form-item>
                <el-form-item label="状态">
                  正常
                </el-form-item>
                <el-form-item label="邮箱">
                  {{ email }}
                  <!--<el-input v-model="form.email" />-->
                </el-form-item>
              </el-form>              
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import PanThumb from '@/components/PanThumb'
  import 'babel-polyfill'
  import { getToken } from '@/utils/auth'
  import { mapGetters } from 'vuex'
  import { file } from "@/api/imgUplodFile"

  export default {
    name: "personalCenter",
    components: { PanThumb },
    data() {
      return {
        // uploadaction: process.env.BASE_API + "/api/res/sluice/import?token=" + getToken(),
        // uploaddata: {
        //   bizId: 10001,
        //   bizType: "sz"
        // },
        imageUrl:"",
        addForm: {
          headImg: ''
        },
        editHeadImgUrl: '',
        imaegUrlId: '',
        imageData: {
          deviceType: '',
          id: ''
        },
        url: "",
        imagecropperShow: false,
        params: {
          token: '',
        },
        headers: {
          smail: '*_~'
        },
        loading: false,
        unit: "这是单位名称",
        postArray: [],
        form: {
          post: "",
          loginName: "",
          name: "",
          sort: "",
          mobile: "",
          gender: "M",
          state: "",
          email: "",
        }
      }
    },
    computed: {
      ...mapGetters([
        'name',
        'avatar',
        'postlabel',
        'gender',
        'email',
        'phone',
        'id',
        'nickname',
      ])
    },
    created() {
      // this.loading = true
      console.log('个人中心')
      this.imageUrl = this.avatar
      this.url = process.env.BASE_API + "/c/common/fileRecord/uploadFile/"
      this.params.token = getToken()
    },
    methods: {
      
      uploadHeadImg() {
        // this.$el.querySelector('.hiddenInput').click()
      },
      aaaa(e) {
        let $target = e.target || e.srcElement
        let $file = $target.files[0]
        var reader = new FileReader()
        reader.onload = (data) => {
          let res = data.target || data.srcElement
          this.imageUrl = res.result
          this.$store.dispatch('changeAvatar', res.result)
        }
        const arr = []
        const imgObj = {
          raw: $file
        }
        arr.push(imgObj)
        const imgParams =  "&bizType=img" + "&bizId=" + this.id
        file(imgParams, arr).then(res => {
          this.$message({
            type: "success",
            message: "头像修改成功!"
          })
          reader.readAsDataURL($file)

        }).catch(errorRes => {
          this.$message({
            type: "wraning",
            message: "失败!"
          })
        })
      },
    }
  }
</script>

<style scoped lang="scss">
  .item_bock {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height:94px;
    width: 260px;
    background: #fff;
  }
  .head_p {
    height:159px;
  }
  .head_img{
    /*height: 90px;*/
  }
  .head_img img{
    width: 150px;
    height: 150px;
    border-radius: 100%;

  }
  .setting_right{
    display: flex;
    height: 37px;
    justify-content: flex-end;
    align-items: center;
    position: relative;
  }
  .hiddenInput{
    /*display: none;*/
    opacity: 0;
    position: absolute;
    right: 12px;
    display: inline-block;
    width: 80px;
  }
  .caption {
    color: #8F8F8F;
    font-size: 26px;
    height: 37px;
  }
  .app-container {
  .panel {
    margin-bottom: 0;
    /*min-height: 86vh;*/
    overflow: auto;
    background-color: #fff;
    border: 1px solid transparent;
    border-color: #ddd;
    border-radius: 4px;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
    .panelHeading {
      color: #333;
      background-color: #f5f5f5;
      border-color: #ddd;
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 39px;
      padding: 8px 15px;
      border-bottom: 1px solid transparent;
      border-top-left-radius: 3px;
      border-top-right-radius: 3px;
      .svg-icon {
        margin: 0 5px;
      }
      .btn-group {
        position: relative;
        // display: inline-block;
        vertical-align: middle;
        float: right;
      }
    }
    .source {
      padding: 10px;
    }
    .panel-body {
      overflow: auto;
      height: calc(100vh - 165px);
      .el-form-item:nth-of-type(1) {
        display: flex;
        align-items: center;
        /deep/ div.el-form-item__content {
          margin-left: 0px!important;
          display: flex;
          align-items: center;
        }
      }
      /deep/ .el-select {
        display: block;
      }
    }
  }

}
</style>
