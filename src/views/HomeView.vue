<template>
  <div class="home">
    <div class="container">
      <h1 class="title">图片压缩工具</h1>
      <div class="main-content">
        <image-uploader />
        <div class="compress-section">
          <compress-options />
          <image-preview />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ImageUploader from '@/components/ImageUploader.vue'
import CompressOptions from '@/components/CompressOptions.vue'
import ImagePreview from '@/components/ImagePreview.vue'

export default {
  name: 'HomeView',
  components: {
    ImageUploader,
    CompressOptions,
    ImagePreview
  }
}
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
  padding: 20px;
  background-color: #f5f7fa;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    
    .title {
      text-align: center;
      margin-bottom: 30px;
      color: #303133;
    }

    .main-content {
      display: flex;
      gap: 20px;
      
      .compress-section {
        flex: 1;
      }
    }
  }
}
</style> 