<template>
  <div class="navbar">
    <a class="logo" href="/">
      <!--<img src="../../../../static/img/logo.png" alt="logo">-->
      <img src="../../../../static/img/apd.png" alt="logo" style="width: 70px;">

    </a>
    <span class="breadcrumb"> | </span>
    <span class="systemName">蕉城区智慧河长管理系统</span>
    <!-- <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/> -->
    <!-- 快捷导航(标签栏导航) -->
    <!-- <breadcrumb class="breadcrumb-container"/> -->
    <iframe width="420" scrolling="no" height="50" frameborder="0" allowtransparency="true" src="//i.tianqi.com/index.php?c=code&id=12&color=%23FFFFFF& icon=1&num=1&site=12"></iframe>  
    <!-- <iframe name="weather_inc" src="http://i.tianqi.com/index.php?c=code&id=48&color=%23FFFFFF" width="440" height="50" frameborder="0" marginwidth="0" marginheight="0" scrolling="no"></iframe> -->
    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <error-log class="errLog-container right-menu-item"/>

        <!--<el-tooltip :content="$t('navbar.screenfull')" effect="dark" placement="bottom">-->
          <!--<screenfull class="screenfull right-menu-item"/>-->
        <!--</el-tooltip>-->

        <!--<el-tooltip :content="$t('navbar.size')" effect="dark" placement="bottom">-->
          <!--<size-select class="international right-menu-item"/>-->
        <!--</el-tooltip>-->

        <!-- <lang-select class="international right-menu-item"/> -->

        <!--<el-tooltip :content="$t('navbar.theme')" effect="dark" placement="bottom">-->
          <!--<theme-picker class="theme-switch right-menu-item"/>-->
        <!--</el-tooltip>-->
      </template>

      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar">
          <span>你好，{{ name }}</span>
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/personal/personalCenter">
            <el-dropdown-item>
              个人中心
            </el-dropdown-item>
          </router-link>
          <!-- <a target="_blank" href="https://github.com/PanJiaChen/vue-element-admin/">
            <el-dropdown-item>
              {{ $t('navbar.github') }}
            </el-dropdown-item>
          </a> -->
          <el-dropdown-item divided>
            <!-- <span style="display:block;" @click="logout">{{ $t('navbar.logOut') }}</span> -->
            <span style="display:block;" @click="logout">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import LangSelect from '@/components/LangSelect'
import ThemePicker from '@/components/ThemePicker'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    LangSelect,
    ThemePicker
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar',
      'device'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 2000;
  background-image: url('../../../../static/img/tou_di.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  padding: 0 20px;
  .logo {
    float: left;
    height: 50px;
    line-height: 50px;
    img {
      vertical-align: middle;
    }
  }
  .systemName {
    margin-right: 2em;
    font-size: 20px;
    color: #fff;
    font-weight: bolder;
    position: relative;
    float: left;
  }
  .breadcrumb {
    margin: 0 9px;
    font-weight: 700;
    color: #c0c4cc;
    font-size: 22px;
    float: left;
  }
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container{
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus{
     outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international{
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 100%;
          vertical-align: middle;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 20px;
          font-size: 12px;
          color: #fff;
        }
        span {
        color: #fff;
        padding: 0 10px;
      }
      }
    }
  }
}
</style>
