<template>
  <div class="compress-options">
    <el-form label-position="top">
      <el-form-item label="压缩质量">
        <el-slider
          v-model="quality"
          :min="1"
          :max="100"
          :format-tooltip="value => `${value}%`"
          @change="handleOptionsChange"
        />
      </el-form-item>
      
      <el-form-item label="最大宽度">
        <el-input-number
          v-model="maxWidth"
          :min="100"
          :max="8000"
          @change="handleOptionsChange"
        />
      </el-form-item>
      
      <el-form-item label="最大高度">
        <el-input-number
          v-model="maxHeight"
          :min="100"
          :max="8000"
          @change="handleOptionsChange"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CompressOptions',
  
  props: {
    defaultQuality: {
      type: Number,
      default: 80
    },
    defaultMaxWidth: {
      type: Number,
      default: 1920
    },
    defaultMaxHeight: {
      type: Number,
      default: 1920
    }
  },
  
  data() {
    return {
      quality: this.defaultQuality,
      maxWidth: this.defaultMaxWidth,
      maxHeight: this.defaultMaxHeight
    }
  },
  
  methods: {
    handleOptionsChange() {
      this.$emit('options-change', {
        quality: Number(this.quality),
        maxWidth: Number(this.maxWidth),
        maxHeight: Number(this.maxHeight)
      })
      console.log('发送的压缩选项:', {
        quality: this.quality,
        maxWidth: this.maxWidth,
        maxHeight: this.maxHeight
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.compress-options {
  margin-bottom: 32px;
  
  .section-title {
    font-size: 24px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 20px;
  }
  
  .options-form {
    .form-item {
      margin-bottom: 20px;
      
      label {
        display: block;
        font-size: 16px;
        color: var(--text-secondary);
        margin-bottom: 8px;
      }
      
      .quality-control {
        display: flex;
        align-items: center;
        gap: 16px;
        
        .el-slider {
          flex: 1;
        }
        
        .quality-value {
          min-width: 60px;
          color: var(--text-secondary);
          font-size: 16px;
        }
      }
      
      .unit {
        margin-left: 8px;
        color: var(--text-tertiary);
      }
    }
    
    .form-actions {
      display: flex;
      gap: 16px;
      margin-top: 32px;
      
      .compress-button {
        flex: 2;
        height: 44px;
        font-size: 16px;
        font-weight: 500;
        
        &:not(.is-loading):hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        }
      }
      
      .reset-button {
        flex: 1;
        height: 44px;
        font-size: 16px;
      }
    }
  }
}
</style> 