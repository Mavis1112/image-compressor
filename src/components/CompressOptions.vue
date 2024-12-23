<template>
  <div class="compress-options">
    <h3>压缩选项</h3>
    <el-form label-width="120px">
      <el-form-item label="压缩质量">
        <el-slider v-model="quality" :min="0" :max="100" />
      </el-form-item>
      <el-form-item label="最大宽度">
        <el-input-number v-model="maxWidth" :min="100" :max="5000" />
      </el-form-item>
      <el-form-item label="最大高度">
        <el-input-number v-model="maxHeight" :min="100" :max="5000" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CompressOptions',
  data() {
    return {
      quality: 80,
      maxWidth: 1920,
      maxHeight: 1080
    }
  }
}
</script>

<style lang="scss" scoped>
.compress-options {
  background: white;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
  
  h3 {
    margin-bottom: 20px;
  }
}
</style> 