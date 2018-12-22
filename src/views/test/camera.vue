
<template>
  <div class="app-container">
    <video src="rtmp://live.hkstv.hk.lxdns.com/live/hks1"/> 
  </div>
</template> 
  <script> 
 
  export default {
    data() {
      return {
        v: {
          form: false,
          loading: false
        }
      }
    },
    methods: {
      play() {
        console.log('')
      } 
    }
  }
</script>
