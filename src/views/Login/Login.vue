<template>
  <div class="login-container">
    <div class="login-box">
      <div class="title">我的博客</div>
      <el-form :model="loginForm" :rules="loginRules">
        <el-form-item label="账号">
          <el-input v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="loginForm.password"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Login",
    data() {
      const validateUsername = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入用户名'))
        } else {
          callback()
        }
      }
      const validatePassword = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('密码最少6位'))
        } else {
          callback()
        }
      }
      return{
        loginForm:{
          username: '',
          password:''
        },
        loginRules: {
          username: [
            { required: true, trigger: 'blur', validator: validateUsername }
          ],
          password: [
            { required: true, trigger: 'blur', validator: validatePassword }
          ]
        }
      }
    },
    methods: {

    }
  }
</script>

<style scoped>
.login-container {
  width: 100%;
  height: 100vh;
  background: #2c3e50;
  position: relative;
}
.login-box{
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  width: 400px;
  height: 500px;
}
.title {

}
</style>
