const path = require('path');
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@use "@/assets/styles/main.scss" as *;`,
        sassOptions: {
          includePaths: [path.resolve(__dirname, 'src/assets/styles')]
        }
      }
    }
  }
})
