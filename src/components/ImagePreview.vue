<template>
  <div class="image-preview">
    <h3>预览</h3>
    <div class="preview-container">
      <div class="preview-item">
        <h4>原图</h4>
        <div class="image-container">
          <el-image :src="originalImage" fit="contain">
            <div slot="placeholder" class="placeholder">
              请先上传图片
            </div>
          </el-image>
        </div>
      </div>
      <div class="preview-item">
        <h4>压缩后</h4>
        <div class="image-container">
          <el-image :src="compressedImage" fit="contain">
            <div slot="placeholder" class="placeholder">
              等待压缩
            </div>
          </el-image>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImagePreview',
  data() {
    return {
      originalImage: '',
      compressedImage: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.image-preview {
  background: white;
  padding: 20px;
  border-radius: 4px;

  h3 {
    margin-bottom: 20px;
  }

  .preview-container {
    display: flex;
    gap: 20px;

    .preview-item {
      flex: 1;
      
      h4 {
        margin-bottom: 10px;
      }

      .image-container {
        height: 300px;
        border: 1px dashed #dcdfe6;
        display: flex;
        align-items: center;
        justify-content: center;

        .placeholder {
          color: #909399;
        }
      }
    }
  }
}
</style> 