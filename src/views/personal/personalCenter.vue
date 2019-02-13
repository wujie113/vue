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
                      <img :src="imageUrl">
                    </div>
                    <div class="setting_right" @click.stop="uploadHeadImg">
                      <!--<div class="caption">更改头像</div>-->
                      <el-button type="primary" icon="upload">{{ imageUrl ? '修改' : '设置'}}头像</el-button>
                    </div>
                    <input type="file" accept="image/*" @change="aaaa" class="hiddenInput">
                  </div>
                </el-form-item>
                <el-form-item label="单位">{{ unit }}</el-form-item>
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
                <el-form-item label="姓名">{{ nickname }}</el-form-item>
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
                <el-form-item label="状态">正常</el-form-item>
                <el-form-item label="邮箱">
                  {{ email }}
                  <!--<el-input v-model="form.email" />-->
                </el-form-item>
              </el-form>
            </div>
          </div>
          <!-- <div class="container">
            <div class="player">
              <video-player
                class="video-player vjs-custom-skin"
                ref="videoPlayer"
                :playsinline="true"
                :options="playerOptions"
                @play="onPlayerPlay($event)"
                @pause="onPlayerPause($event)"
              ></video-player>
            </div>
          </div> -->
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
import { updateavatar } from "@/api/imgUplodFile"
// import { videoPlayer } from 'vue-video-player'
// import 'videojs-flash'
export default {
  name: "personalCenter",
  components: { PanThumb },
  data() {
    return {
      // playerOptions: {
      //   playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
      //   autoplay: false, //如果true,浏览器准备好时开始回放。
      //   muted: false, // 默认情况下将会消除任何音频。
      //   loop: false, // 导致视频一结束就重新开始。
      //   preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
      //   language: 'zh-CN',
      //   aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
      //   fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
      //   sources: [{
      //     type: "application/x-mpegURL",  //如果src是m3u6的地址,  type里面填  application/x-mpegURL
      //     src: "http://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8"
      //   }],
      //   html5: { hls: { withCredentials: false } },
      //   // techOrder: ['flash'], //默认 default : html5
      //   poster: "../../../static/img/bj.jpg", //你的封面地址
      //   width: document.documentElement.clientWidth,
      //   // height: '400',
      //   notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
      //   //  controlBar: {
      //   //   timeDivider: true,
      //   //   durationDisplay: true,
      //   //   remainingTimeDisplay: false,
      //   //   fullscreenToggle: true //全屏按钮
      //   //  }
      // },
      imageUrl: "",
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
    ]),
    player() {
      return this.$refs.videoPlayer.player
    }
  },
  created() {
    // this.loading = true
    console.log('个人中心')
    this.imageUrl = this.avatar
    this.url = process.env.BASE_API + "/c/common/fileRecord/uploadFile/"
    this.params.token = getToken()
  },
  methods: {
    onPlayerPlay(player) {
      alert("play")
    },
    onPlayerPause(player) {
      alert("pause")
    },
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
      const imgParams = "&id=" + this.id 
      updateavatar(imgParams, $file).then(res => {
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
  height: 94px;
  width: 260px;
  background: #fff;
}
.head_p {
  height: 159px;
}
.head_img {
  /*height: 90px;*/
}
.head_img img {
  width: 150px;
  height: 150px;
  border-radius: 100%;
}
.setting_right {
  display: flex;
  height: 37px;
  justify-content: flex-end;
  align-items: center;
  position: relative;
}
.hiddenInput {
  /*display: none;*/
  opacity: 0;
  position: absolute;
  right: 12px;
  display: inline-block;
  width: 80px;
}
.caption {
  color: #8f8f8f;
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
          margin-left: 0px !important;
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
