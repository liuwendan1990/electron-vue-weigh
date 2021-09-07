<template>
  <el-container class="container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>个人资料</span>
        <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
      </div>
      <!-- <div v-for="o in 4" :key="o" class="text item">
        {{'列表内容 ' + o }}
      </div> -->
      <div class="box-content">
        <div class="text-align">图片</div>
        <ul class="list-group">
          <li class="list-group-item">
            <i class="el-icon-edit"></i>
            <b class="font-normal">登录名称：</b>
            <p class="pull-right">admin</p>
          </li>
          <li class="list-group-item">
            <i class="el-icon-edit"></i>
            <b class="font-normal">登录名称：</b>
            <p class="pull-right">admin</p>
          </li>
        </ul>
      </div>
    </el-card>
  </el-container>
</template>

<script>
  export default {
    name: ''
  }
</script>

<style scoped>
  .container {
    padding: 20px;
  }
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 480px;
  }
  .box-content {
    clear: both;
  }
  
  .list-group-item {
    display: block;
    border: 1px solid #e7eaec;
    border-width: 1px 0;
    margin-bottom: -1px;
    padding: 10px 15px;
    /* position: relative; */
  }

  .list-group-item .pull-right{
    float: right;
  }
  .text-center {
    text-align: center;
  }
</style>