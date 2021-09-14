<template>
    <div class="login">
        <el-row class="login_head">
            <el-col :span="8" :offset="16" class="btns">
                <el-button class="btn-minus" size="large" type="text" icon="el-icon-minus" @click="minus"></el-button>
                <el-button class="btn-close" size="large" type="text" icon="el-icon-close" @click="close()"></el-button>
            </el-col>
        </el-row>
        <el-row class="login_main">
            <el-col :span="21" style="text-align:center">
                <img src="~@/assets/nav.png" alt="物资称重管理系统" style="margin:40px 0">
                <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
                    <el-form-item prop="loginName">
                        <span class="svg-container">
                            <svg-icon icon-class="user" />
                        </span>
                        <el-input name="loginName" type="text" v-model="loginForm.loginName" autofocus="true"
                                    autoComplete="on" placeholder="请输入用户名" class="login-input" clearable/>
                    </el-form-item>
                    <el-form-item prop="password">
                        <span class="svg-container password">
                            <svg-icon icon-class="password"></svg-icon>
                        </span>
                        <el-input name="password" @keyup.enter.native="handleLogin" v-model="loginForm.password"
                                    placeholder="请输入密码" class="login-input" show-password></el-input>
                    </el-form-item>
                    <el-form-item style="-webkit-app-region: no-drag;">
                        <el-button type="primary" style="width:100%;margin-top:20px" :loading="loading" @click.native.prevent="handleLogin">
                            登录
                        </el-button>
                        <span class="tips" v-show="tips">用户名或密码错误</span>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <div class="login_foot"></div>
    </div>
</template>

<script>
import {login} from '@/api/sys.js'
export default {
  name: 'login',
  data () {
    return {
      loginWindow: this.$electron.remote.BrowserWindow.fromId(1),
      loading: false,
      tips: false,
      loginForm: {
        loginName: '',
        password: ''
      },
      loginRules: {
        loginName: [{required: true, message: '请输入用户名', trigger: 'change'}],
        password: [{required: true, message: '请输入密码', trigger: 'change'}]
      }
    }
  },
  methods: {
    handleLogin () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          login(this.loginForm.loginName, this.loginForm.password).then(response => {
            console.log(response)
            if (response.code === 0) {
              console.log(response.data)
              // 将user保存到state中
              // this.$store.dispatch('saveUser', response.data)
              console.log(JSON.stringify(response.data))
              localStorage.setItem('userData', JSON.stringify(response.data))
              this.$electron.ipcRenderer.send('toAppIndex')
            } else {
              this.loading = false
            }
          })
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
    .login {
        height: 480px;
        padding-left: 343px;
        padding-right: 8px;
        padding-top: 3px;
        box-sizing: border-box;
        overflow: hidden;
        background: #fff url('~@/assets/login_bg.png') no-repeat left top;
        -webkit-app-region: drag;
    }
    .login_foot {
        position: relative;
        bottom: -18px;
        right: -8px;
        height: 100px;
        background: #fff url('~@/assets/login_bg_bottom.png') no-repeat right bottom;
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
        /* height: 30px; */
        -webkit-app-region: no-drag;
    }
    .btns>button {
        font-size: 16px;
        padding: 4px;
        color: #51596B;
        border-radius: 3px;
    }
    .btn-minus:hover {
        background: #eeeeee;
    }
    .btn-close:hover {
        color: #ffffff;
        background: #FA5151;
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
    .tips {
        color: red;
    }
</style>
<style>
    .login-input input.el-input__inner {
        padding-left: 30px;
        -webkit-app-region: no-drag;
    }
</style>