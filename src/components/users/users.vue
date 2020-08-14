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
      <el-input placeholder="请输入内容" @clear="loadUserList()" clearable v-model="query" class="inputSelect">
        <el-button @click="searchUser()" slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-button type="primary" round @click="showAddUserDia()">添加用户</el-button>
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
        <el-switch @change="changeMgState(scope.row)" v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949">
        </el-switch>
      </template>
    </el-table-column>
    <el-table-column prop="address" label="操作">
      <template slot-scope="scope">
        <el-button size="mini" plain type="primary" icon="el-icon-edit" circle @click="showEditUserDia(scope.row)"></el-button>
        <el-button size="mini" plain type="danger" icon="el-icon-delete" circle @click="showDelUserMsBox(scope.row.id)"></el-button>
        <el-button size="mini" plain type="success" icon="el-icon-check" circle @click="showSetUserRoleDia(scope.row)"></el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 4、分页 -->
  <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[2, 4, 6, 8]" :page-size="2" layout="total, sizes, prev, pager, next, jumper" :total="total">
  </el-pagination>

  <!-- 对话框 -->
  <!-- 添加用户的对话框 -->
  <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
    <el-form :model="form">
      <el-form-item label="用户名" :label-width="formLabelWidth">
        <el-input v-model="form.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" :label-width="formLabelWidth">
        <el-input v-model="form.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" :label-width="formLabelWidth">
        <el-input v-model="form.email" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="电话" :label-width="formLabelWidth">
        <el-input v-model="form.mobile" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
      <el-button type="primary" @click="saveDocument()">确 定</el-button>
    </div>
  </el-dialog>

  <!-- 编辑用户的对话框 -->
  <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
    <el-form :model="form">
      <el-form-item label="用户名" :label-width="formLabelWidth">
        <el-input disabled v-model="form.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" :label-width="formLabelWidth">
        <el-input v-model="form.email" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="电话" :label-width="formLabelWidth">
        <el-input v-model="form.mobile" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
      <el-button type="primary" @click="editUser()">确 定</el-button>
    </div>
  </el-dialog>

  <!-- 分配角色的对话框 -->
  <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRol">
    <el-form :model="form">
      <el-form-item label="用户名" :label-width="formLabelWidth">
        {{currUsername}}
        <!-- <el-input v-model="form.name" autocomplete="off"></el-input> -->
      </el-form-item>
      <el-form-item label="角色" :label-width="formLabelWidth">
        <!-- 如果select的绑定的数据的值和 option 的 value 一样
        就会显示该 option 的 label 值 -->
        {{currRoleId}}
        <el-select v-model="currRoleId">
          <el-option label="请选择" :value="-1"></el-option>
          <el-option :label="item.roleName" :value="item.id" v-for="(item, i) in roles" :key="i"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisibleRol = false">取 消</el-button>
      <el-button type="primary" @click="setRole()">确 定</el-button>
    </div>
  </el-dialog>
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
      // 添加对话框的属性
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleRol: false,
      // 添加用户的表单数据
      form: {
        username: '',
        password: '',
        emaill: '',
        mobile: ''
      },
      // 分配角色
      currRoleId: -1,
      currUsername: '',
      // 保存所有角色数据
      roles: [],
      // 当前用户ID
      currUsername: -1,
      formLabelWidth: '100px',
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
    // 分配/更改角色，发送请求
    async setRole() {
      const newActorId = await this.$http.put(`users/${this.currUserId}/role`,{rid: this.currRoleId})
      console.log(newActorId)
      // 关闭对话框
      this.dialogFormVisibleRol = false
    },
    // 分配角色,打开对话框
    async showSetUserRoleDia(user) {
      this.currUsername = user.username
      // 获取所有角色
      const actor = await this.$http.get(`roles`)
      console.log(actor)
      this.roles = actor.data.data

      // 接口文档的 key 名称是 role_id,就是 rid
      // 获取当前用户的角色ID -> rid
      const actorId = await this.$http.get(`users/${user.id}`)
      console.log(actorId)
      this.currRoleId = actorId.data.data.rid
      this.dialogFormVisibleRol = true
    },
    // 修改状态
    async changeMgState(user) {
      // 先发送请求
      const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
      console.log(res)
    },
    // 编辑用户，发送请求
    async editUser() {
      // users/:id
      const res = await this.$http.put(`users/${this.form.id}`, this.form)
      console.log(res)
      // 关闭对话框
      this.dialogFormVisibleEdit = false
      // 更新视图
      this.getUserList()
    },
    // 编辑用户，显示对话框
    showEditUserDia(user) {
      // 获取用户数据
      this.form = user
      this.dialogFormVisibleEdit = true
    },
    // 删除用户，打开消息盒子
    showDelUserMsBox(userId) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 发送删除的请求
        // 1、data中找用户的ID
        // 2、把以参数的形式
        const res = await this.$http.delete(`users/${userId}`)
        console.log(res)
        if (res.data.meta.status === 200) {
          this.pagenum = 1
          // 更新视图提示
          this.getUserList()
          // 提示
          this.$message({
            type: 'success',
            message: res.data.meta.msg
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      });
    },
    // 添加用户，发送请求
    async saveDocument() {
      // 2、关闭用户录入对话框
      this.dialogFormVisibleAdd = false
      const res = await this.$http.post(`users`, this.form)
      console.log(res)
      const {
        meta: {
          status,
          msg
        },
        data
      } = res.data
      if (status === 201) {
        // 1、提示用户成功的被添加
        this.$message.success(msg)
        // 3、更新视图
        this.getUserList()
        // 4、清空文本框
        // this.form.username = ""
        this.form = {}
        // for(const key in this.form) {
        //   if(this.form.hasOwnProperty(key)) {
        //     this.form[key] = ""
        //   }
        // }
      } else {
        this.$message.error(msg)
      }
    },
    // 添加用户
    showAddUserDia() {
      // 因为编辑（修改完毕数据之后，再点击添加新用户，就会把编辑的数据映射到创建新用户的对话框内，因此要把它清空
      this.form = {}
      // 当需要添加新的用户的时候就将表格的对话框弹出来
      this.dialogFormVisibleAdd = true
    },
    // 清空搜索框重新获取数据
    loadUserList() {
      this.getUserList()
    },
    // 搜索用户
    searchUser() {
      // 按照input绑定的query参数发请求
      this.getUserList()
    },
    // 分页相关方法
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.getUserList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getUserList()
    },
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
