<template>
  <div class="home-container">
    <div class="content-wrapper">
      <!-- 步骤条放在卡片外部 -->
      <el-steps :active="currentStep" :finish-status="isLastStep ? 'success' : 'wait'" align-center class="steps">
        <el-step title="上传图片"></el-step>
        <el-step title="压缩设置"></el-step>
        <el-step title="预览下载"></el-step>
      </el-steps>

      <!-- 主要内容区域添加卡片样式 -->
      <div class="content-card">
        <div class="step-content">
          <!-- 步骤1: 上传 -->
          <div v-show="currentStep === 0" class="step-page">
            <image-uploader
              :accept-types="acceptTypes"
              :max-size="maxFileSize"
              @file-selected="handleFileSelected"
              @file-error="handleFileError"
            />
          </div>

          <!-- 步骤2: 压缩设置 -->
          <div v-show="currentStep === 1" class="step-page">
            <compress-options
              :default-quality="defaultQuality"
              :default-max-width="defaultMaxWidth"
              :default-max-height="defaultMaxHeight"
              @options-change="handleOptionsChange"
            />
          </div>

          <!-- 步骤3: 预览下载 -->
          <div v-show="currentStep === 2" class="step-page">
            <image-preview
              :original-image="originalImage"
              :compressed-image="compressedImage"
              :compression-ratio="compressionRatio"
              :is-processing="isProcessing"
              @download="handleDownload"
            />
          </div>
        </div>

        <div class="step-actions">
          <el-button @click="prevStep" :disabled="currentStep === 0 || isProcessing">
            上一步
          </el-button>
          <el-button 
            type="primary" 
            @click="nextStep"
            :disabled="!canProceed || isProcessing"
            :loading="isProcessing"
          >
            {{ getActionButtonText }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ImageUploader from './components/ImageUploader/index.vue'
import CompressOptions from './components/CompressOptions/index.vue'
import ImagePreview from './components/ImagePreview/index.vue'
import imageCompression from 'browser-image-compression'

export default {
  name: 'HomeView',
  
  components: {
    ImageUploader,
    CompressOptions,
    ImagePreview
  },
  
  data() {
    return {
      // 文件配置
      acceptTypes: ['image/jpeg', 'image/png'],
      maxFileSize: 10, // MB
      
      // 压缩配置
      defaultQuality: 80,
      defaultMaxWidth: 1920,
      defaultMaxHeight: 1080,
      
      // 图片数据
      originalImage: null,
      compressedImage: null,
      compressionRatio: 0,
      
      // 状态
      isProcessing: false,
      
      // 当前压缩选项
      compressionOptions: {
        quality: 80,
        maxWidth: 1920,
        maxHeight: 1920
      },
      
      // 添加步骤相关数据
      currentStep: 0,
    }
  },
  
  computed: {
    canProceed() {
      switch(this.currentStep) {
        case 0:
          return !!this.originalImage
        case 1:
          return true // 压缩设置总是可以继续
        case 2:
          return !!this.compressedImage
        default:
          return false
      }
    },
    
    getActionButtonText() {
      if (this.currentStep === 1 && this.isProcessing) {
        return '压缩中...'
      }
      return this.currentStep === 2 ? '完成' : '下一步'
    },
    
    isLastStep() {
      return this.currentStep === 2
    }
  },
  
  methods: {
    // 添加步骤控制方法
    prevStep() {
      if (this.currentStep > 0) {
        this.currentStep--
      }
    },
    
    async nextStep() {
      if (this.currentStep === 1) {
        // 从压缩设置进入预览时，自动开始压缩
        this.isProcessing = true
        try {
          await this.handleCompressStart()
          this.currentStep++
        } catch (error) {
          this.$message.error('压缩失败：' + error.message)
        } finally {
          this.isProcessing = false
        }
      } else if (this.currentStep < 2) {
        this.currentStep++
      }
    },
    
    // 文件选择处理
    handleFileSelected(file) {
      this.originalImage = file
      this.compressedImage = null
      this.compressionRatio = 0
    },
    
    // 文件错误处理
    handleFileError(error) {
      this.$message.error(error)
    },
    
    // 压缩选项变更
    handleOptionsChange(options) {
      this.compressionOptions = {
        quality: Number(options.quality),
        maxWidth: Number(options.maxWidth),
        maxHeight: Number(options.maxHeight)
      }
      console.log('更新后的压缩选项:', this.compressionOptions)
    },
    
    // 开始压缩
    async handleCompressStart() {
      if (!this.originalImage) {
        this.$message.warning('请先选择图片')
        return
      }
      
      try {
        console.log('使用的压缩质量:', this.compressionOptions.quality)
        console.log('转换后的压缩质量:', this.compressionOptions.quality / 100)
        console.log('原始文件大小:', this.formatFileSize(this.originalImage.size))
        
        const compressedBlob = await imageCompression(
          this.originalImage,
          {
            maxSizeMB: this.maxFileSize,
            maxWidthOrHeight: Math.max(
              this.compressionOptions.maxWidth,
              this.compressionOptions.maxHeight
            ),
            useWebWorker: true,
            quality: this.compressionOptions.quality / 100,
            initialQuality: this.compressionOptions.quality / 100,
          }
        )
        
        const compressedFile = new File(
          [compressedBlob],
          this.originalImage.name,
          {
            type: compressedBlob.type,
            lastModified: new Date().getTime()
          }
        )
        
        console.log('压缩后文件大小:', this.formatFileSize(compressedFile.size))
        
        this.compressedImage = compressedFile
        
        if (this.originalImage.size && compressedFile.size) {
          this.compressionRatio = Math.round(
            (1 - (compressedFile.size / this.originalImage.size)) * 100
          )
          console.log('最终压缩率:', this.compressionRatio + '%')
        }
        
        this.$message.success(`压缩完成，压缩率: ${this.compressionRatio}%`)
      } catch (error) {
        console.error('压缩失败:', error)
        this.$message.error('压缩失败：' + error.message)
        throw error
      }
    },
    
    // 下载处理
    handleDownload() {
      if (!this.compressedImage) {
        this.$message.warning('请先压缩图片')
        return
      }
      
      const link = document.createElement('a')
      link.href = URL.createObjectURL(this.compressedImage)
      link.download = `compressed_${this.originalImage.name}`
      link.click()
      URL.revokeObjectURL(link.href)
    },
    
    // 添加一个工具方法来格式化文件大小
    formatFileSize(bytes) {
      if (bytes === 0) return '0 B'
      const k = 1024
      const sizes = ['B', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
    }
  },
  
  watch: {
    // 监听压缩选项变化
    compressionOptions: {
      deep: true,
      handler(newOptions) {
        console.log('压缩选项已更新:', newOptions)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.home-container {
  min-height: 100vh;
  padding: 16px;
  background-color: var(--background-secondary);
  
  @media (min-width: 768px) {
    padding: 24px;
  }
  
  .content-wrapper {
    max-width: 800px;
    margin: 0 auto;
    
    .steps {
      margin-bottom: 24px;
      padding: 0 12px;
      
      :deep(.el-step__title) {
        font-size: 14px;
        line-height: 28px;
        
        &.is-process {
          font-weight: normal;
        }
      }
    }
    
    .content-card {
      background: var(--background-primary);
      border-radius: 16px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      padding: 32px;
      
      .step-content {
        min-height: 400px;
        margin-bottom: 24px;
      }
      
      .step-page {
        animation: fadeIn 0.3s ease;
        min-height: 400px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      
      .step-actions {
        display: flex;
        justify-content: center;
        gap: 16px;
        padding-top: 24px;
        border-top: 1px solid var(--border-color);
      }
    }
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>