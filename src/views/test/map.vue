<template>
    <div>
        <rm-map v-model="map"></rm-map>
    </div>
</template> 
<script> 

    import RmMap from "@/components/rm/map"
    export default {
        components: { RmMap },
        data() {
            return {
                v: { ctrl: false, tool: false },
                map: null
            }
        },
        mounted() {
            console.log('================',this.map)
        },
        methods: {

        }
    }
</script>
<style>
</style>
