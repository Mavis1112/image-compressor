<template>
  <div class="image-uploader">
    <el-upload
      class="uploader"
      drag
      action="#"
      :auto-upload="false"
      :show-file-list="false"
      :on-change="handleFileChange"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        将文件拖到此处，或<em>点击上传</em>
      </div>
      <div class="el-upload__tip" slot="tip">
        支持jpg/png文件
      </div>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: 'ImageUploader',
  methods: {
    handleFileChange(file) {
      console.log('File selected:', file)
      // TODO: 处理文件上传
    }
  }
}
</script>

<style lang="scss" scoped>
.image-uploader {
  width: 360px;
  
  .uploader {
    width: 100%;
  }
}
</style> 