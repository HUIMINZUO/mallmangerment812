<template>
<!-- 1、面包屑 -->
<!-- 首页>用户管理>用户 列表 -->
<el-tabs type="border-card">
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 2、搜索 -->
  <el-row class="searchRow">
    <el-col>
      <el-input placeholder="请输入内容" v-model="query" class="inputSelect">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-button type="primary" round>添加用户</el-button>
    </el-col>
  </el-row>
  <!-- 3、表格 -->
  <el-table class="tableHead" :data="userList" border style="width: 100%">
    <el-table-column type="index" label="#" width="60"></el-table-column>
    <el-table-column prop="username" label="姓名" width="80"></el-table-column>
    <el-table-column prop="email" label="邮箱"></el-table-column>
    <el-table-column prop="mobile" label="电话"></el-table-column>
    <el-table-column label="创建时间">
      <!-- 
          template 内部要用数据，设置slot-scope属性
         -->
      <!-- 
           slot-scope 的值 userlist 其实就是 el-table 绑定的数据 userlist
           userllist.row -> 数组的每个对象
          -->
      <template slot-scope="userlist">
        {{ userlist.row.crate_time | fmtdate }}
      </template>
    </el-table-column>
    <el-table-column label="用户状态">
      <template slot-scope="scope">
        <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949">
        </el-switch>
      </template>
    </el-table-column>
    <el-table-column prop="address" label="操作"></el-table-column>
  </el-table>
  <!-- 4、分页 -->
</el-tabs>
</template>

<script>
export default {
  data() {
    return {
      query: "",
      // 表格绑定的数据
      userList: [],
      // 分页相关的数据
      total: -1,
      pagenum: 1,
      pagesize: 2,
      // tableData: [
      //   {
      //     date: "2016-05-02",
      //     name: "王小虎",
      //     address: "上海市普陀区金沙江路 1518 弄",
      //   },
      //   {
      //     date: "2016-05-04",
      //     name: "王小虎",
      //     address: "上海市普陀区金沙江路 1517 弄",
      //   }
      // ]
    }
  },
  created() {
    this.getUserList();
  },
  methods: {
    // 获取用户列表的请求
    async getUserList() {
      // 需要授权的 API ，必须在请求头中使用 
      // `Authorization` 字段提供 `token` 令牌
      const AUTH_TOKEN = localStorage.getItem('token')
      this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      );
      console.log(res)
      const {
        meta: {
          status,
          msg
        },
        data: {
          users,
          total
        }
      } = res.data
      if (status === 200) {
        // 1、给表格数据赋值
        this.userList = users
        // 2、给total赋值
        this.total = total
        // 3、成功提示
        this.$message.success(msg)
      } else {
        // 4、失败提示
        this.$message.error(msg)
      }
    }
  }
}
</script>

<style>
.box-card {
  height: 100%;
}

.inputSelect {
  width: 300px;
}

.searchRow {
  margin-top: 20px;
}

.tableHead {
  margin-top: 10px;
}
</style>
