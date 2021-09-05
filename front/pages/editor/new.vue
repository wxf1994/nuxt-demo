<template>
  <div class="markdown-editor">
    <div class="write-btn">
      <el-button type="primary" @submit="publish">发布</el-button>
    </div>
    <div class="md-body">
      <el-row>
        <el-col :span="12">
          <textarea ref="mdEdit" class="md-content" :value="content" @input="update"></textarea>
        </el-col>
        <el-col :span="12">
          <div class="md-right" v-html="compileContent"></div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import marked from 'marked'
export default {
  data() {
    return {
      content: ''
    }
  },
  computed: {
    compileContent() {
      return marked(this.content, {})
    }
  },
  mounted() {
    this.timer = null
    this.bindEvents()
  },
  methods: {
    update(e) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.content = e.target.value
      }, 350)
    },
    publish() {

    },
    bindEvents() {
      this.$refs.mdEdit.addEventListener('paste', async e => {
        const files = e.clipboardData.files
        console.log(files)
      })
      this.$refs.mdEdit.addEventListener('drop', async e => {
        const files = e.dataTransfer.files;
        console.log(files)
        e.preventDefault();
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .write-btn {
    padding: 0 27px;
    height: 50px;
    background-color: #fff;
    border-bottom: 1px solid #ddd;
    z-index: 100;
    text-align: right;
    // position: fixed;
    // z-index: 100;
    // right: 30px;
    // top: 10px;
  }
  .md-content {
    height: 100%;
    width: 100%;
    outline: none;
    background-color: #f8f9fa;
    padding: 0;
  }
  .md-right {
    height: 100%;
    width: 100%;
    background-color: #fff;
    padding-left: 20px;
  }
  .md-body {
    height: calc(100vh - 50px);
  }
  .el-row {
    height: 100%;
  }
  .el-col {
    height: 100%;
  }
</style>