
<template>

  <el-select clearable :title="title" :placeholder="placeholder" :value="value" @input="handleInput">
    <el-option v-for="item in optionlists" :key="item.value" v-bind="$attrs" :label="item.label" :value="item.value" />
  </el-select>
</template> 
<script>
import { getdictList } from "@/components/rm/dict/dict.js"
export default {
  name: "RmDict",
  props: {
    value: {
      required: false
    },
    placeholder: {
      required: false,
      type: String,
      default: "--请选择--"
    },
    title: {
      required: false,
      type: String,
      default: "--"
    },
    type: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      optionlists: []
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
    handleInput(val) {
      this.$emit("input", val)
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
