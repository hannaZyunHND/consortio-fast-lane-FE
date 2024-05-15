// vue.config.js
const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig(() => {
  lintOnSave: false
  const apiUrl = process.env.VUE_APP_API_URL;

  return {
    devServer: {
      proxy: {
        '/api': {
          target: apiUrl,
          ws: true,
          changeOrigin: true
        }
      }
    }
  };
});
