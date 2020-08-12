<template>
  <div class="login-wrap">
    <!-- <el-radio-group v-model="labelPosition" size="small">
      <el-radio-button label="top">顶部对齐</el-radio-button>
    </el-radio-group> -->
    <el-form class="login-form" v-model="labelPosition" :label-position="labelPosition" label-width="80px" :model="formdata">
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="formdata.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formdata.password"></el-input>
      </el-form-item>
      <el-button @click="handleLogin()" class="login-btn" type="primary">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      labelPosition: 'top',
      formdata: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    // 登录请求
    async handleLogin() {
      // 希望让异步操作代码看起来像是同步代码
      // ES7 async+await

      const res = await this.$http.post('login', this.formdata)
        // 查看登录成功返回的数据
        // console.log(res);
        const {
          data, meta:{msg,status}
        } = res.data

        // 登录成功的操作
        if(status === 200) {
          // 跳转到home提示登录成功
          // 保存token
          localStorage.setItem('token', data.token)
          this.$router.push({name: 'home'})
          this.$message.success(msg)
        } else {
          this.$message.error(msg)
        }
        // 登录不成功，提示登录失败
      // this.$http.post('login', this.formdata).then(res => {
      //   // 查看登录成功返回的数据
      //   // console.log(res);
      //   const {
      //     data, meta:{msg,status}
      //   } = res.data

      //   // 登录成功的操作
      //   if(status === 200) {
      //     // 跳转到home提示登录成功
      //     this.$router.push({name: 'home'})
      //     this.$message.success(msg)
      //   } else {
      //     this.$message.error(msg)
      //   }
      //   // 登录不成功，提示登录失败
      // })
    }
  }
};
</script>

<style>
.login-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #324152;
}
.login-wrap .login-form {
  width: 400px;
  padding: 30px;
  background-color: #fff;
  border-radius: 5px;
}
.login-wrap .login-form .login-btn {
  width: 100%;
}
</style>
