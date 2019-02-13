<template>
<div>
    <div class="app-container documentation-container clearfix">
      <a class="document-btn" target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/">{{ $t('documentation.documentation') }}</a>
      <a class="document-btn" target="_blank" href="https://github.com/PanJiaChen/vue-element-admin/">{{ $t('documentation.github') }}</a>
      <a class="document-btn" target="_blank" href="https://panjiachen.gitee.io/vue-element-admin-site/zh/">国内文档</a>
      <dropdown-menu :items="articleList" style="float:left;margin-left:50px;" title="系列文章"/>
    </div>
    <video-player class="vjs-custom-skin video-player" :options="playerOptions"></video-player>

</div>

</template>
<script>
import DropdownMenu from '@/components/Share/dropdownMenu'
import 'video.js/dist/video-js.css'
import { videoPlayer } from 'vue-video-player'
import 'videojs-flash'

export default {
  name: 'Documentation',
  components: { DropdownMenu, videoPlayer },
  data() {
    return {
      playerOptions: {
        height: 550,
        sources: [{
          type: "rtmp/mp4",
          src: "rtmp://192.168.3.64:1935/hls/mystream"
        }],
        techOrder: ['flash'],
        autoplay: false,
        controls: true
      },
      articleList: [
        { title: '基础篇', href: 'https://juejin.im/post/59097cd7a22b9d0065fb61d2' },
        { title: '登录权限篇', href: 'https://juejin.im/post/591aa14f570c35006961acac' },
        { title: '实战篇', href: 'https://juejin.im/post/593121aa0ce4630057f70d35' },
        { title: 'vue-admin-template 篇', href: 'https://juejin.im/post/595b4d776fb9a06bbe7dba56' },
        { title: '自行封装 component', href: 'https://segmentfault.com/a/1190000009090836' },
        { title: '优雅的使用 icon', href: 'https://juejin.im/post/59bb864b5188257e7a427c09' },
        { title: 'webpack4（上）', href: 'https://juejin.im/post/59bb864b5188257e7a427c09' },
        { title: 'webpack4（下）', href: 'https://juejin.im/post/5b5d6d6f6fb9a04fea58aabc' }
      ]
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.documentation-container {
  margin: 50px;
  .document-btn {
    float: left;
    margin-left: 50px;
    display: block;
    cursor: pointer;
    background: black;
    color: white;
    height: 60px;
    width: 200px;
    line-height: 60px;
    font-size: 20px;
    text-align: center;
  }
}
</style>
