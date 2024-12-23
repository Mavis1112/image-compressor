<template>
  <div class="preview-container">
    <h3 class="section-title">预览</h3>
    
    <div class="preview-content">
      <!-- 原图预览 -->
      <div class="preview-item">
        <h4 class="preview-title">原图</h4>
        <div class="image-wrapper">
          <el-image
            v-if="originalImageUrl"
            :src="originalImageUrl"
            fit="contain"
          >
            <div slot="error" class="image-error">
              <i class="el-icon-picture-outline"></i>
              <span>加载失败</span>
            </div>
          </el-image>
          <div v-else class="image-placeholder">
            <i class="el-icon-picture-outline"></i>
            <span>请选择图片</span>
          </div>
        </div>
        <div class="image-info" v-if="originalImage">
          <span>大小：{{ formatSize(originalImage.size) }}</span>
        </div>
      </div>
      
      <!-- 压缩后预览 -->
      <div class="preview-item">
        <h4 class="preview-title">压缩后</h4>
        <div class="image-wrapper">
          <el-image
            v-if="compressedImageUrl"
            :src="compressedImageUrl"
            fit="contain"
          >
            <div slot="error" class="image-error">
              <i class="el-icon-picture-outline"></i>
              <span>加载失败</span>
            </div>
          </el-image>
          <div v-else class="image-placeholder">
            <i class="el-icon-picture-outline"></i>
            <span>等待压缩</span>
          </div>
        </div>
        <div class="image-info" v-if="compressedImage">
          <span>大小：{{ formatSize(compressedImage.size) }}</span>
          <span class="compression-ratio">压缩率：{{ compressionRatio }}%</span>
        </div>
      </div>
    </div>
    
    <!-- 下载按钮 -->
    <div class="actions" v-if="compressedImage">
      <el-button type="success" @click="handleDownload" class="download-button">
        下载压缩后的图片
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImagePreview',
  
  props: {
    originalImage: {
      type: File,
      default: null
    },
    compressedImage: {
      type: File,
      default: null
    },
    compressionRatio: {
      type: Number,
      default: 0
    },
    isProcessing: {
      type: Boolean,
      default: false
    }
  },
  
  computed: {
    originalImageUrl() {
      return this.originalImage ? URL.createObjectURL(this.originalImage) : ''
    },
    
    compressedImageUrl() {
      return this.compressedImage ? URL.createObjectURL(this.compressedImage) : ''
    }
  },
  
  methods: {
    formatSize(bytes) {
      if (bytes === 0) return '0 B'
      const k = 1024
      const sizes = ['B', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
    },
    
    handleDownload() {
      this.$emit('download')
    }
  },
  
  // 清理 URL 对象
  beforeDestroy() {
    if (this.originalImageUrl) {
      URL.revokeObjectURL(this.originalImageUrl)
    }
    if (this.compressedImageUrl) {
      URL.revokeObjectURL(this.compressedImageUrl)
    }
  }
}
</script>

<style lang="scss" scoped>
.preview-container {
  .section-title {
    font-size: 24px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 20px;
  }
  
  .preview-content {
    display: grid;
    gap: 20px;
    margin-bottom: 20px;
    
    @media (min-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .preview-item {
      .preview-title {
        font-size: 18px;
        font-weight: 500;
        color: var(--text-secondary);
        margin-bottom: 16px;
      }
      
      .image-wrapper {
        height: 300px;
        border-radius: 12px;
        background-color: var(--background-secondary);
        overflow: hidden;
        transition: all 0.3s ease;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        }
        
        .el-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        
        .image-placeholder,
        .image-error {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--text-tertiary);
          
          i {
            font-size: 48px;
            margin-bottom: 8px;
          }
          
          span {
            font-size: 16px;
          }
        }
      }
      
      .image-info {
        margin-top: 16px;
        display: flex;
        justify-content: space-between;
        color: var(--text-secondary);
        font-size: 14px;
        
        .compression-ratio {
          color: var(--success-color);
          font-weight: 500;
        }
      }
    }
  }
  
  .actions {
    text-align: center;
    
    .download-button {
      height: 44px;
      font-size: 16px;
      font-weight: 500;
      padding: 0 32px;
      
      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      }
    }
  }
}
</style> 