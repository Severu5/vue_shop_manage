<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
        :closable="false">
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类级联选择框 -->
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            :props="cataProps"
            @change="handleChange"></el-cascader>
        </el-col>
      </el-row>

      <!-- tab 标签区 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)">{{item}}</el-tag>
                <!-- 输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加属性</el-button>
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable>{{item}}</el-tag>
                <!-- 输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数的对话框 -->
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加参数的对话框 -->
    <el-dialog
      :title="'编辑'+titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Params',
  data() {
    return {
      // 商品分类数据
      cateList: [],
      cataProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedCateKeys: [],
      // 被激活的标签名称
      activeName: 'many',
      manyTableData: [],
      onlyTableData: [],
      // 控制添加对话框的显示隐藏
      addDialogVisible: false,
      // 添加参数的表单数据对象
      addForm: {
        attr_name: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        attr_name: [{
          required: true, message: '请输入参数名称', trigger: 'blur'
        }]
      },
      // 控制修改对话框的显示隐藏
      editDialogVisible: false,
      // 修改参数的表单数据对象
      editForm: {
        attr_name: ''
      },
      // 修改表单的验证规则对象
      editFormRules: {
        attr_name: [{
          required: true, message: '请输入参数名称', trigger: 'blur'
        }]
      },
      // 控制按钮与文本框切换显示
      inputVisible: false,
      inputValue: ''
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    // 获取所有的商品分类
    async getCateList() {
      const result = await this.$http.getCategory({});
      if (result.meta.status !== 200) return this.$message.error('获取商品分类失败');
      this.cateList = result.data;
    },
    // 级联选择框选中项变化触发
    handleChange() {
      // 证明选择的不是三级分类
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = [];
        this.manyTableData = [];
        this.onlyTableData = [];
        return;
      }
      this.getParamsData();
    },
    // tab 标签点击事件
    handleTabClick() {
      this.getParamsData();
    },
    // 获取参数的列表数据
    async getParamsData() {
      // console.log(this.cateId);
      const result = await this.$http.getParams(this.cateId, {
        sel: this.activeName
      });
      if (result.meta.status !== 200) return this.$message.error('获取参数列表失败');
      result.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : [];
        // 添加一个布尔值控制文本框显示隐藏
        item.inputVisible = false;
        // 添加文本框中输入的值
        item.inputValue = '';
      })
      if (this.activeName === 'many') {
        this.manyTableData = result.data;
      } else {
        this.onlyTableData = result.data;
      }
    },
    // 监听添加对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 添加参数
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请填写参数名称');
        const result = await this.$http.addParams({
          id: this.cateId,
          data: {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }
        });
        if (result.meta.status !== 201) return this.$message.error('添加参数失败');
        this.$message.success('添加参数成功');
        this.addDialogVisible = false;
        this.getParamsData();
      })
    },
    // 点击按钮，展示修改对话框
    async showEditDialog(attrId) {
      const result = await this.$http.getParamsById(this.cateId, attrId, {
        attr_sel: this.activeName
      });
      if (result.meta.status !== 200) return this.$message.error('获取参数失败');
      this.editForm = result.data;
      this.editDialogVisible = true;
    },
    // 监听修改对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 修改参数
    editParams() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请填写参数名称');
        const result = await this.$http.editParams({
          id: this.cateId,
          attrId: this.editForm.attr_id,
          data: {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          }
        });
        if (result.meta.status !== 200) return this.$message.error('修改参数失败');
        this.$message.success('修改参数成功');
        this.editDialogVisible = false;
        this.getParamsData();
      })
    },
    // 根据 id 删除对应的参数
    async removeParams(attrId) {
      const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err);
      if (confirmResult !== 'confirm') return this.$message.info('取消删除');
      const result = await this.$http.deleteParams({
        id: this.cateId,
        attrId
      });
      if (result.meta.status !== 200) return this.$message.error('删除参数失败');
      this.$message.success('删除参数成功');
      this.getParamsData();
    },
    // 文本框失去焦点或按回车键触发事件
    handleInputConfirm(item) {
      if (item.inputValue.trim().length === 0) {
        item.inoutValue = '';
        item.inputVisible = false;
        return;
      }
      item.attr_vals.push(item.inputValue.trim());
      item.inputValue = '';
      item.inputVisible = false;
      this.saveAttrVals(item);
    },
    // 点击按钮，展示文本输入框
    showInput(item) {
      item.inputVisible = true;
      // 让文本框自动获得焦点
      // nextTick 为当页面上元素重新渲染结束之后，才会执行回调函数
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 删除对应的参数
    async handleClose(i, row) {
      row.attr_vals.splice(i, 1);
      this.saveAttrVals(row);
    },
    async saveAttrVals(item) {
      const result = await this.$http.editParams({
        id: this.cateId,
        attrId: item.attr_id,
        data: {
          attr_name: item.attr_name,
          attr_sel: item.attr_sel,
          attr_vals: item.attr_vals.join(' ')
        }
      });
      if (result.meta.status !== 200) return this.$message.error('添加属性失败');
      this.$message.success('修改属性成功');
    }
  },
  computed: {
    // 如果按钮需要被禁用，则返回true
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true;
      }
      return false;
    },
    // 当前选中的三级分类的 id
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2];
      }
      return null;
    },
    // 动态计算标题文本
    titleText() {
      return this.activeName === 'many' ? '动态参数' : '静态属性';
    }
  }
};
</script>

<style scoped lang="scss">
.cat_opt {
  margin: 15px 0;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>
