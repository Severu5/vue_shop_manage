<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 搜索添加区 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input @clear="getUserList" clearable placeholder="请输入内容" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表展示 -->
      <el-table :data="userList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template v-slot:default="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template v-slot:default="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)"></el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeUserById(scope.row.id)"></el-button>
              <el-tooltip :enterable="false" effect="dark" content="分配角色" placement="top">
                <el-button size="mini" type="success" icon="el-icon-setting"></el-button>
              </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Users',
  data () {
    // 验证邮箱规则
    const checkEmail = (rule, value, callback) => {
      // 验证邮箱的正则
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value)) {
        return callback();
      }
      callback(new Error('请输入合法的邮箱'));
    };
    // 验证手机号规则
    const checkMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        return callback();
      }
      callback(new Error('请输入合法的手机号'));
    };
    return {
      queryInfo: {
        // 获取用户列表的请求参数
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      userList: [],
      total: 0,
      // 控制添加用户对话框显示
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户表单的验证规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度为3-10个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度为6-15个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 编辑用户表单的验证规则
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 控制修改用户的对话框显示隐藏
      editDialogVisible: false,
      // 查询到的用户信息对象
      editForm: {}
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const result = await this.$http.getUsers(this.queryInfo);
      if (result.meta.status !== 200) return this.$message.error('获取用户列表失败');
      this.userList = result.data.users;
      this.total = result.data.total;
    },
    handleSizeChange(newPagesize) {
      // 监听 pagezide 改变
      console.log(newPagesize);
      this.queryInfo.pagesize = newPagesize;
      this.getUserList();
    },
    handleCurrentChange(newpage) {
      // 监听页码值改变
      this.queryInfo.pagenum = newpage;
      this.getUserList();
    },
    async userStateChange(userInfo) {
      const result = await this.$http.userStateChange(userInfo);
      if (result.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state;
        return this.$message.error('更新用户状态失败');
      }
      this.$message.success('更新用户状态成功');
    },
    addDialogClosed() {
      // 监听添加用户对话框关闭事件
      this.$refs.addFormRef.resetFields();
    },
    addUser() {
      // 点击确定按钮添加新用户
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        const result = await this.$http.addUser(this.addForm);
        if (result.meta.status !== 201) return this.$message.error('添加用户失败');
        this.$message.success('添加用户成功');
        this.addDialogVisible = false;
        this.getUserList();
      });
    },
    async showEditDialog(id) {
      // 展示编辑用户的对话框
      this.editDialogVisible = true;
      const result = await this.$http.getUserDetail(id);
      if (result.meta.status !== 200) return this.$message.error('获取用户信息失败');
      this.editForm = result.data;
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    editUserInfo() {
      // 修改用户信息并提交
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.error('表单验证失败');
        const result = await this.$http.editUser({
          id: this.editForm.id,
          arg: {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          }
        });
        if (result.meta.status !== 200) return this.$message.error('更新用户信息失败');
        this.editDialogVisible = false;
        this.getUserList();
        this.$message.success('用户信息更新成功');
      });
    },
    async removeUserById(id) {
      // 根据 id 删除对应用户
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err);
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消删除');
      }
      const result = await this.$http.deleteUser(id);
      if (result.meta.status !== 200) return this.$message.error('删除用户失败');
      this.getUserList();
      this.$message.success('删除用户成功');
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
.el-pagination {
  display: flex;
  justify-content: center;
}
</style>
