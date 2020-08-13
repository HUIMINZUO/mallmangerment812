<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <img src="../../assets/heima.png" alt="某某电商后台管理系统" />
          </div>
        </el-col>
        <el-col :span="18" class="middle">
          <!-- <div class="grid-content bg-purple-light"></div> -->
          <h3>某东电商后台管理系统</h3>
        </el-col>
        <el-col :span="2">
          <div class="grid-content bg-purple">
            <a href="#" class="loginout" @click.prevent="handleSignout()">退出系统</a>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside class="aside" width="200px">
        <!-- unique-opened="true"侧边栏导航 -->
        <!-- router:true开启路由模式 -->
        <el-menu :unique-opened="true" :router="true">
          <el-submenu index="users">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <!-- <template slot="title">分组一</template> -->
            <el-menu-item index="1-1">
              <i class="el-icon-location"></i>
              <span>用户列表</span>
            </el-menu-item>
          </el-submenu>
          <!-- 2 -->
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <!-- <template slot="title">分组一</template> -->
            <el-menu-item index="1-1">
              <i class="el-icon-location"></i>
              <span>角色列表</span>
            </el-menu-item>
            <el-menu-item index="1-1">
              <i class="el-icon-location"></i>
              <span>权限列表</span>
            </el-menu-item>
          </el-submenu>
          <!-- 3 -->
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>商品管理</span>
            </template>
            <!-- <template slot="title">分组一</template> -->
            <el-menu-item index="1-1">
              <i class="el-icon-location"></i>
              <span>商品列表</span>
            </el-menu-item>
            <el-menu-item index="1-1">
              <i class="el-icon-location"></i>
              <span>分类参数</span>
            </el-menu-item>
            <el-menu-item index="1-1">
              <i class="el-icon-location"></i>
              <span>商品分类</span>
            </el-menu-item>
          </el-submenu>
          <!-- 4 -->
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>订单管理</span>
            </template>
            <!-- <template slot="title">分组一</template> -->
            <el-menu-item index="1-1">
              <i class="el-icon-location"></i>
              <span>订单列表</span>
            </el-menu-item>
          </el-submenu>
          <!-- 5 -->
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>数据统计</span>
            </template>
            <!-- <template slot="title">分组一</template> -->
            <el-menu-item index="1-1">
              <i class="el-icon-location"></i>
              <span>数据报表</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <!-- 容器 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  // 在newVue之前自动触发
   beforeCreate() {
     const token = localStorage.getItem('token')
     if(!token) {
       // 没有token的话，让用户进行登录操作
       this.$router.push({name: 'login'})
     }
     // 有token的话，继续渲染组件
   },
   methods: {
     handleSignout() {
      //  1、清除token
      localStorage.clear()
      // 2、退出时，提醒用户
      this.$message.success('退出成功')
      // 3、再返回到登录组件
      this.$$router.push({name: 'login'})
     }
   }
  // 获取token
};
</script>

<style>
.container {
  height: 100%;
}
.header {
  background-color: #b3c0d1;
}
.aside {
  background-color: #d3dce6;
}
.main {
  height: 100%;
  background-color: #e9eef3;
}

/* 头部样式 */
.middle {
  text-align: center;
}
.loginout {
  text-decoration: none;
  line-height: 60px;
}
</style>
