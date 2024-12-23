<template>
  <div class="uploader-container" :class="{ 'has-image': !!previewUrl }">
    <!-- 上传区域 -->
    <div
      class="upload-area"
      @drop.prevent="handleDrop"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      :class="{ 
        'is-dragging': isDragging,
        'hidden': !!previewUrl 
      }"
    >
      <input
        type="file"
        ref="fileInput"
        :accept="acceptTypes.join(',')"
        @change="handleFileChange"
        class="file-input"
      >
      
      <div class="upload-content">
        <i class="el-icon-upload"></i>
        <div class="upload-text">
          <p>将图片拖到此处，或</p>
          <el-button type="primary" @click="triggerFileInput">
            点击选择图片
          </el-button>
        </div>
        <p class="upload-tip">
          支持 {{ acceptTypes.join(', ') }} 格式，最大 {{ maxSize }}MB
        </p>
      </div>
    </div>

    <!-- 预览区域 -->
    <div v-if="previewUrl" class="preview-area">
      <div class="preview-content">
        <div class="preview-image">
          <img :src="previewUrl" alt="预览图片">
        </div>
        
        <div class="image-info">
          <div class="info-item">
            <span class="label">文件名：</span>
            <el-tooltip 
              :content="currentFile.name" 
              placement="top" 
              :disabled="!isFileNameOverflow"
            >
              <span class="value filename" ref="filename">{{ currentFile.name }}</span>
            </el-tooltip>
          </div>
          <div class="info-item">
            <span class="label">大小：</span>
            <span class="value">{{ formatFileSize(currentFile.size) }}</span>
          </div>
        </div>

        <div class="preview-actions">
          <el-button type="primary" @click="triggerFileInput">
            重新选择
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImageUploader',
  
  props: {
    acceptTypes: {
      type: Array,
      default: () => ['image/jpeg', 'image/png']
    },
    maxSize: {
      type: Number,
      default: 10
    }
  },
  
  data() {
    return {
      isDragging: false,
      previewUrl: '',
      currentFile: null,
      isFileNameOverflow: false
    }
  },
  
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click()
    },
    
    handleDrop(e) {
      this.isDragging = false
      const file = e.dataTransfer.files[0]
      this.processFile(file)
    },
    
    handleFileChange(e) {
      const file = e.target.files[0]
      this.processFile(file)
    },
    
    processFile(file) {
      if (!file) return
      
      // 验证文件类型
      if (!this.acceptTypes.includes(file.type)) {
        this.$emit('file-error', '不支持的文件类型')
        return
      }
      
      // 验证文件大小
      if (file.size > this.maxSize * 1024 * 1024) {
        this.$emit('file-error', `文件大小不能超过 ${this.maxSize}MB`)
        return
      }
      
      // 创建预览
      this.previewUrl = URL.createObjectURL(file)
      this.currentFile = file
      
      // 发送文件
      this.$emit('file-selected', file)
      
      // 在下一个 tick 检查文件名是否溢出
      this.$nextTick(() => {
        this.checkFileNameOverflow()
      })
    },
    
    formatFileSize(bytes) {
      if (bytes === 0) return '0 B'
      const k = 1024
      const sizes = ['B', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
    },
    
    checkFileNameOverflow() {
      if (this.$refs.filename) {
        const element = this.$refs.filename
        this.isFileNameOverflow = element.scrollWidth > element.clientWidth
      }
    }
  },
  
  watch: {
    'currentFile.name'() {
      this.$nextTick(() => {
        this.checkFileNameOverflow()
      })
    }
  },
  
  beforeDestroy() {
    // 清理预览URL
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl)
    }
  }
}
</script>

<style lang="scss" scoped>
.uploader-container {
  width: 100%;
  height: 100%;
  min-height: 400px;
  
  .upload-area {
    height: 100%;
    min-height: 400px;
    border: 2px dashed var(--border-color);
    border-radius: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s ease;
    cursor: pointer;
    
    &.is-dragging {
      border-color: var(--primary-color);
      background-color: var(--background-hover);
    }
    
    &.hidden {
      display: none;
    }
    
    .file-input {
      display: none;
    }
    
    .upload-content {
      text-align: center;
      color: var(--text-secondary);
      
      i {
        font-size: 48px;
        margin-bottom: 16px;
      }
      
      .upload-text {
        margin-bottom: 16px;
        
        p {
          margin-bottom: 12px;
        }
      }
      
      .upload-tip {
        font-size: 12px;
        color: var(--text-secondary);
      }
    }
  }
  
  .preview-area {
    height: 100%;
    min-height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    
    .preview-content {
      width: 100%;
      max-width: 800px;
      display: flex;
      flex-direction: column;
      gap: 24px;
      
      .preview-image {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: var(--background-secondary);
        border-radius: 8px;
        padding: 16px;
        
        img {
          max-width: 100%;
          max-height: 600px;
          width: auto;
          height: auto;
          object-fit: contain;
        }
      }
      
      .image-info {
        width: 100%;
        max-width: 400px;
        margin: 0 auto;
        
        .info-item {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
          color: var(--text-secondary);
          
          .label {
            flex-shrink: 0;
            margin-right: 8px;
          }
          
          .value {
            flex: 1;
            min-width: 0;
            
            &.filename {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }
      }
      
      .preview-actions {
        text-align: center;
      }
    }
  }
}
</style> 