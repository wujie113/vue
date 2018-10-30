
<template>
  <el-checkbox-group v-model="value" :min="min" :max="max">
    <el-checkbox v-for="item in optionlists" :key="item.value" v-bind="$attrs" :label="item.label" :value="item.value" />
  </el-checkbox-group>

</template> 
<script>
  import { getdictList } from "@/components/rm/dict/dict.js"
  export default {
    name: "RmDictCheckbox",
    props: {
      title: {
        required: true,
        type: String
      },
      type: {
        required: true,
        type: String
      }, min: {
        required: true,
        type: Number,
        default: 0
      }, max: {
        required: true,
        type: Number,
        default: 1
      }
    },
    data() {
      return {
        optionlists: [],
        value: ""
      }
    },
    computed: {},
    created() {
      this.getDictList()
    },
    methods: {
      getDictList() {
        getdictList(this.type).then(response => {
          this.optionlists = response.data.list
          console.log(" this.optionlists ", this.optionlists)
        })
      },
      handleChange(val) {
        this.$emit("update:name", val)
      }
    }
  }
</script>

<style scoped>
  .pagination-container {
    background: #fff;
    padding: 32px 16px;
  }
  .pagination-container.hidden {
    display: none;
  }
</style>
