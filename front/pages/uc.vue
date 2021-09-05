<template>
  <div>
    <h1>用户中心</h1>
    <div ref="drag" class="drag">
      <input type="file" name="file" @change="handleFileChange" />
    </div>
    <div>
      <el-progress
        :text-inside="true"
        :stroke-width="20"
        :percentage="uploadProgress"
      ></el-progress>
    </div>
    <div>
      <el-button @click="uploadFile">上传</el-button>
    </div>
    <div>
      <p>计算hash值：</p>
      <el-progress
        :text-inside="true"
        :stroke-width="20"
        :percentage="hashProgress"
      ></el-progress>
    </div>
    <div class="cube-container" :style="{ width: cubeWidth + 'px' }">
      <div class="cube" v-for="chunk in chunks" :key="chunk.name">
        <div
          :class="{
            upload: chunk.progress > 0 && chunk.progress < 100,
            success: chunk.progress === 100,
            error: chunk.progress < 0
          }"
          :style="{ height: chunk.progress + '%' }"
        >
          <i
            class="el-icon-loading"
            style="color: #f56c87"
            v-if="chunk.progress > 0 && chunk.progress < 100"
          >
          </i>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import sparkMD5 from "spark-md5";

const CHUNK_SIZE = 0.1 * 1024 * 1024;
export default {
  data() {
    return {
      file: null,
      hashProgress: 0,
      hash: "",
      chunks: []
    };
  },
  computed: {
    cubeWidth() {
      return Math.ceil(Math.sqrt(this.chunks.length)) * 16;
    },
    uploadProgress() {
      if (!this.file) {
        return 0;
      }
      const loaded = this.chunks
        .map(item => item.chunk.size * item.progress)
        .reduce((acc, cur) => acc + cur, 0);
      return Number((loaded / this.file.size).toFixed(2));
    }
  },
  mounted() {
    const ret = this.$http.get("/user/info");
    this.bindEvents();
  },
  methods: {
    async uploadFile() {
      // if (!await this.isImage(this.file)) {
      //   alert('文件格式不正确')
      //   return
      // }
      const chunks = this.createFileChunks(this.file);
      // const hash = await this.calculateHashWorker()
      const hash = await this.calculateHashIdle(chunks);
      this.hash = hash;
      const {
        data: { uploaded, uploadList }
      } = await this.$http.post("/checkFile", {
        ext: this.file.name.split(".").pop(),
        hash: this.hash
      });
      if (uploaded) {
        this.$message.success("秒传成功");
        return;
      }
      this.chunks = chunks.map((chunk, index) => {
        const name = hash + "-" + index;
        return {
          hash,
          name,
          index,
          chunk: chunk.file,
          progress: uploadList.includes(name) ? 100 : 0
        };
      });
      await this.uploadChunks(uploadList);
      await this.mergeFile();
    },
    async calculateHashWorker() {
      return new Promise(resolve => {
        this.worker = new Worker("/hash.js");
        this.worker.postMessage({ chunks: this.chunks });
        this.worker.onmessage = e => {
          const { progress, hash } = e.data;
          this.hashProgress = Number(progress.toFixed(2));
          if (hash) {
            resolve(hash);
          }
        };
      });
    },
    async uploadChunks(uploadList) {
      // 转成promise
      const requests = this.chunks
        .filter(chunk => uploadList.indexOf(chunk.name) === -1)
        .map(({ hash, name, chunk, index }) => {
          const form = new FormData();
          form.append("name", name);
          form.append("hash", hash);
          form.append("chunk", chunk);
          return { form, index, error: 0 };
        });
      // .map(({form, index}) => this.$http.post('/uploadFile', form, {
      //   onUploadProgress: progress => {
      //     // this.$set(this.chunks[index], 'progress', Number(((progress.loaded / progress.total) * 100).toFixed(2)))
      //     this.chunks[index].progress = Number(((progress.loaded / progress.total) * 100).toFixed(2))
      //   }
      // }))
      // @todo 异步数量并发量控制
      // await Promise.all(requests)
      await this.sendRequest(requests);
      // const formData = new FormData()
      // formData.append('name', 'file')
      // formData.append('file', this.file)
      // try {
      //   await this.$http.post('/uploadFile', formData, {
      //     onUploadProgress: progress => {
      //       this.percentage = Number(((progress.loaded / progress.total) * 100).toFixed(2))
      //     }
      //   })
      // } catch(err) {
      //   console.log(err)
      // }
    },
    async mergeFile() {
      console.log(this.file);
      this.$http.post("/mergeFile", {
        ext: this.file.name.split(".").pop(),
        hash: this.hash,
        size: CHUNK_SIZE
      });
    },
    async sendRequest(tasks, limit = 4) {
      return new Promise((resolve, reject) => {
        const len = tasks.length;
        let count = 0;
        let isStop = false;       
        const start = async () => {
          if (isStop) {
            return
          }
          const task = tasks.shift();
          if (task) {
            const { form, index } = task;
            try {
              await this.$http.post("/uploadFile", form, {
                onUploadProgress: progress => {
                  // this.$set(this.chunks[index], 'progress', Number(((progress.loaded / progress.total) * 100).toFixed(2)))
                  this.chunks[index].progress = Number(
                    ((progress.loaded / progress.total) * 100).toFixed(2)
                  );
                }
              });
              if (count === len - 1) {
                // 最后一个任务
                resolve();
              } else {
                count++;
                // 启动下一个任务
                start();
              }
            } catch(e) {
              this.chunks[index].progress = -1;
              // 错误尝试，最多3次，如果任然报错，则中断全部上传
              if (task.error < 3) {
                task.error++
                tasks.unshift(task)
                start()
              } else {
                // 错误3次
                isStop = true
                reject()
              }
            }
            
          }
        };
        while (limit > 0) {
          start();
          limit -= 1;
        }
      });
    },
    async calculateHashIdle(chunks) {
      return new Promise(resolve => {
        const spark = new sparkMD5.ArrayBuffer();
        let count = 0;
        const appendToSpark = async file => {
          return new Promise(resolve => {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = e => {
              spark.append(e.target.result);
              resolve();
            };
          });
        };
        const workLoop = async deadline => {
          while (count < chunks.length && deadline.timeRemaining() > 1) {
            await appendToSpark(chunks[count].file);
            count++;
            if (count < chunks.length) {
              this.hashProgress = Number(
                ((100 * count) / chunks.length).toFixed(2)
              );
            } else {
              this.hashProgress = 100;
              resolve(spark.end());
            }
          }
          window.requestIdleCallback(workLoop);
        };
        window.requestIdleCallback(workLoop);
      });
    },
    createFileChunks(file, size = CHUNK_SIZE) {
      const chunks = [];
      let cur = 0;
      while (cur < file.size) {
        chunks.push({ index: cur, file: this.file.slice(cur, cur + size) });
        cur += size;
      }
      return chunks;
    },
    async isImage(file) {
      return (
        (await this.isGif(file)) ||
        (await this.isPng(file)) ||
        (await this.isJpg(file))
      );
    },
    async isGif(file) {
      try {
        const ret = await this.blobToString(file.slice(0, 6));
        return ret === "47 49 46 38 39 61" || ret === "47 49 46 38 37 61";
      } catch (err) {
        console.error(err);
        return false;
      }
    },
    async isPng(file) {
      try {
        const ret = await this.blobToString(file.slice(0, 8));
        return ret === "89 50 4E 47 0D 0A 1A 0A";
      } catch (err) {
        console.error(err);
        return false;
      }
    },
    async isJpg(file) {
      try {
        const len = file.length;
        const start = await this.blobToString(file.slice(0, 2));
        const tail = await this.blobToString(file.slice(-2, len));
        console.log(start, tail, "start -- tail");
        return start === "FF D8" && tail === "FF D9";
      } catch (err) {
        console.error(err);
        return false;
      }
    },
    async blobToString(blob) {
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = () => {
          console.log(reader.result);
          const ret = reader.result
            .split("")
            .map(v => v.charCodeAt())
            .map(v => v.toString(16).toUpperCase())
            .map(v => v.padStart(2, "0"))
            .join(" ");
          // console.log(ret)
          resolve(ret);
        };
        reader.readAsBinaryString(blob);
      });
    },
    handleFileChange(e) {
      const file = e.target.files[0];
      if (!file) return;
      this.file = file;
    },
    bindEvents() {
      const drag = this.$refs.drag;
      drag.addEventListener("dragover", e => {
        drag.style.borderColor = "red";
        e.preventDefault();
      });
      drag.addEventListener("dragleave", e => {
        drag.style.borderColor = "#eee";
        e.preventDefault();
      });
      drag.addEventListener("drop", e => {
        const file = e.dataTransfer.files[0];
        console.log(file);
        drag.style.borderColor = "#eee";
        this.file = file;
        e.preventDefault();
      });
    }
  }
};
</script>
<style lang="less">
.drag {
  height: 100px;
  border: 2px dashed #eee;
  line-height: 100px;
  text-align: center;
}
.cube-container {
  .cube {
    width: 14px;
    height: 14px;
    border: 1px solid #ccc;
    line-height: 14px;
    float: left;
    background-color: #eee;
    .success {
      background-color: green;
    }
    .error {
      background-color: red;
    }
    .upload {
      background-color: hotpink;
    }
  }
}
</style>
