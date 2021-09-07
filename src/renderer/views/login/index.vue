<template>
    <el-container>
        <el-header style="padding:0;">
            <el-row class="header">
                <el-col class="product-title" :span="8" :offset="8">
                    <div class="title">
                        <p>物资称重管理系统</p>
                    </div>
                </el-col>
                <el-col :span="8" class="btns">
                    <el-button class="btn-minus" size="large" type="text" icon="el-icon-minus" @click="minus"></el-button>
                    <el-button class="btn-close" size="large" type="text" icon="el-icon-close" @click="close()"></el-button>
                </el-col>
            </el-row>
        </el-header>
        <el-main style="margin-top:30px">
            <el-row>
                <el-col :span="18" :offset="3">
                    <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
                        <el-form-item prop="username">
                            <span class="svg-container">
                              <svg-icon icon-class="user" />
                            </span>
                            <el-input name="username" type="text" v-model="loginForm.username" autofocus="true"
                                      autoComplete="on" placeholder="请输入用户名" class="login-input" clearable/>
                        </el-form-item>
                        <el-form-item prop="password">
                            <span class="svg-container password">
                              <svg-icon icon-class="password"></svg-icon>
                            </span>
                            <el-input name="password" @keyup.enter.native="handleLogin" v-model="loginForm.password"
                                      placeholder="请输入密码" class="login-input" show-password></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
                                登录
                            </el-button>
                            <span class="tips" v-show="tips">用户名或密码错误</span>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </el-main>
        <el-footer style="position:fixed;bottom:0;width:100%">
            <div class="footer-container">
                <p>&copy;版权所有</p>
            </div>
        </el-footer>
    </el-container>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      loginWindow: this.$electron.remote.BrowserWindow.fromId(1),
      loading: false,
      tips: false,
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{required: true, message: '请输入用户名', trigger: 'change'}],
        password: [{required: true, message: '请输入密码', trigger: 'change'}]
      }
    }
  },
  methods: {
    handleLogin () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = false
          this.$electron.ipcRenderer.send('toAppIndex')
          // this.$store.dispatch('doLogin', this.loginForm).then(() => {
          //   this.loading = false
          //   this.$electron.ipcRenderer.send('toAppIndex')
          // }).catch(e => {
          //   console.log(e)
          //   this.loading = false
          // })
        } else {
          return false
        }
      })
    },
    minus () {
      this.loginWindow.minimize()
    },
    close () {
      this.loginWindow.close()
    }
  }
}
</script>

<style scoped>
    .header {
        background: #EFF2F6;
        height: 100%;
        -webkit-app-region: drag;
    }
    .product-title {
        height: 100%;
        display: flex;
        align-items: center;
        text-align: center;
    }
    .title {
        text-align: center;
        width: 100%;
    }
    .btns {
        text-align: right;
        height: 30px;
        -webkit-app-region: no-drag;
    }
    .btns>button {
        font-size: 20px;
        padding: 3px 9px;
        color: #000000;
        border-radius: 0;
    }
    .btn-minus:hover {
        background: #fef6fc;
    }
    .btn-close:hover {
        color: #ffffff;
        background: #E81123;
    }
    .svg-container {
        display: inline-block;
        position: absolute;
        z-index: 1;
        font-size: 30px;
    }
    .svg-container.password {
        font-size: 26px;
    }
    .footer-container {
        text-align: center;
        display: flex;
        height: 100%;
        align-items: center;
    }
    .footer-container p {
        width: 100%;
    }
    .tips {
        color: red;
    }
</style>
<style>
    .login-input input.el-input__inner {
        padding-left: 30px;
    }
</style>