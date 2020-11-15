import Vue from 'vue'
const env = 'online'
const configList = {
  test: {
    host_API: 'localhost:3000'
  },
  online: {
    host_API: 'https://lzzblog.cn/'
  }
}
const baseConfig = configList[env]
Vue.prototype.host_API = baseConfig.host_API
export default baseConfig
