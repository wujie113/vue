<template>
  <div>
    <hamburger
      :toggle-click="toggleSideBar"
      :is-active="sidebar.opened"
      class="hamburgerBox"
    />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :show-timeout="200"
        :default-active="$route.path"
        :collapse="isCollapse"
        mode="vertical"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <sidebar-item
          v-for="route in permission_routers"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div> 

</template>

<script>
  import { mapGetters } from 'vuex'
  import SidebarItem from './SidebarItem'
  import Hamburger from '@/components/Hamburger'

  export default {
    data() {
      return {
        isActive: true
      }
    },
    components: { SidebarItem, Hamburger },
    computed: {
      ...mapGetters([
        'permission_routers',
        'sidebar',
        'hamburger'
      ]),
      isCollapse() {
        return !this.sidebar.opened
      }
    },
    methods: {
      toggleSideBar() {
        this.$store.dispatch('toggleSideBar')
        if (this.isActive) {
          this.isActive = false
        } else {
          this.isActive = true
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .hamburgerBox {
    height: 50px;
    line-height: 50px;
    background-color: #304156;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 16px;
    padding: 0 20px;
  }
  #app .hideSidebar .hamburgerBox {
    padding: 0 6px;
  }
</style>
