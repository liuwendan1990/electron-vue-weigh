<template>
  <div id="app">
    <el-header class="header" style="padding:0;height:50px;">
        <el-menu :default-active="$route.path" class="el-menu-demo" mode="horizontal" @select="handleSelect" router>
            <el-menu-item index="/main/weight">称重管理</el-menu-item>
            <el-submenu index="2" disabled>
                <template slot="title">个人设置</template>
                <el-menu-item index="/main/user">个人信息</el-menu-item>
            </el-submenu>
        </el-menu>
        <div class="img_box">
            <img src="~@/assets/nav.png" alt="物资称重管理系统">
        </div>
    </el-header>
    <el-main class="main">
      <router-view></router-view>
    </el-main>
    <el-footer class="footer" style="height:40px">
      <el-row>
        <el-col :span="3"><div class="grid-content">当前用户：{{this.user.name}}</div></el-col>
        <el-col :span="15"><div class="grid-content">正式版 当前版本：网络版 软件版本号：1.0</div></el-col>
        <el-col :span="6" style="text-align:right"><div class="current-time">当前时间：{{currentTime}}</div></el-col>
      </el-row>
    </el-footer>
  </div>
</template>

<script>
  import { CurentTime } from '@/utils/timeformat'
  import { getToken, removeToken } from '@/utils/auth'
  export default {
    name: 'weigh',
    data () {
      return {
        currentTime: '',
        user: {}
      }
    },
    mounted () {
      // console.log(this.$route.path)
      // 关闭login窗口
      this.$electron.ipcRenderer.send('closeLogin')
      this.user = JSON.parse(localStorage.getItem('userData')) || {}
      this.currentTime = CurentTime(new Date())
      this.timer = setInterval(() => {
        this.currentTime = CurentTime(new Date()) // 修改数据date
      }, 500)
    },
    methods: {
      goTo (path) {
        if (path !== this.$route.path) {
          this.$router.replace(path)
        }
        // this.$router.push('') //push方法是有回退功能的，这里不需要
      },
      // 导航菜单
      handleSelect (key, keyPath) {
        // console.log(this.$route.path)
        console.log(key, keyPath)
      },
      exitLogin (path) {
        this.$confirm('将退出登录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.goTo(path)
          if (getToken()) {
            removeToken()
          }
          this.$electron.ipcRenderer.send('reLogin')
        }).catch(() => {
          this.goTo('/main')
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      }
    },
    destroyed () {
      if (this.timer) { // 注意在vue实例销毁前，清除定时器
        clearInterval(this.timer)
      }
      // 清除客户端缓存
      if (localStorage.getItem('userData')) {
        localStorage.removeItem('userData')
      }
    }
  }
</script>

<style>
  /* CSS 清除默认样式*/
  body, h1, h2, h3, h4, h5, h6, hr, p, blockquote, dl, dt, dd, ul, ol, li, pre, form, fieldset, legend, button, input, textarea, th, td { margin:0; padding:0; }
  body, button, input, select, textarea { font:12px/1.5tahoma, arial, \5b8b\4f53; }
  h1, h2, h3, h4, h5, h6{ font-size:100%; }
  address, cite, dfn, em, var { font-style:normal; }
  code, kbd, pre, samp { font-family:couriernew, courier, monospace; }
  small{ font-size:12px; }
  ul, ol { list-style:none; }
  a { text-decoration:none; }
  a:hover { text-decoration:underline; }
  sup { vertical-align:text-top; }
  sub{ vertical-align:text-bottom; }
  legend { color:#000; }
  fieldset, img { border:0; }
  button, input, select, textarea { font-size:100%; }
  table { border-collapse:collapse; border-spacing:0; }
  html, body {
    width: 100%;
    height: 100%;
  }
  #app {
    width: 100%;
    height: 100%;
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: 400;
    color: #1F2F3D;
    position: relative;
  }
  .header {
    /* position: relative; */
    position: fixed;
    z-index: 100;
    left: 0;
    top: 0;
    right: 0;
  }
  .header .img_box {
    position: absolute;
    right: 22px;
    bottom: -6px;
  }
  .main {
    padding: 0;
  }
  .footer {
    position: fixed;
    z-index: 100;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
    /* width: 100%; */
    font-weight: 500;
    line-height: 39px;
    box-sizing: border-box;
    border-top: 1px solid #DCDFE6;
  }
  .footer .current-time {
    display: inline-block;
    border-left: 2px solid #B6C5D5;
    padding-left: 11px;
  }
</style>
