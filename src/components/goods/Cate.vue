<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <tree-table
        class="tree_table"
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border>
        <!-- 是否有效模板 -->
        <template v-slot:isok="scope">
          <i style="color: lightgreen;" v-if="scope.row.cat_deleted === false" class="el-icon-success"></i>
          <i style="color: red;" v-else class="el-icon-error"></i>
        </template>
        <!-- 排序模板 -->
        <template v-slot:order="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作模板 -->
        <template v-slot:opt="">
          <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed">
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- props 用来指定配置对象 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
            clearable>
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Cate',
  data() {
    return {
      // 商品分类的数据列表
      cateList: [],
      // 查询参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 分类数据总数
      total: 0,
      // 为 table 指定列
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 把当前列定义为模板列
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          // 把当前列定义为模板列
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          // 把当前列定义为模板列
          type: 'template',
          template: 'opt'
        }
      ],
      // 控制添加分类对话框的显示隐藏
      addCateDialogVisible: false,
      // 添加分类的表单数据对象
      addCateForm: {
        // 将要添加的分类名称
        cat_name: '',
        // 父级分类的 id
        cat_pid: 0,
        // 当前默认提交的分类等级为一级分类
        cat_level: 0
      },
      // 添加分类验证规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 父级分类数据
      parentCateList: [],
      // 选中的父级分类的 id 数组
      selectedKeys: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      }
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    // 获取商品分类数据
    async getCateList() {
      const result = await this.$http.getCategory(this.queryInfo);
      if (result.meta.status !== 200) return this.$message.error('获取分类数据失败');
      this.cateList = result.data.result;
      this.total = result.data.total;
    },
    // 监听 pagesize 改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCateList();
    },
    // 点击按钮展示添加分类对话框
    showAddCateDialog() {
      this.addCateDialogVisible = true;
      this.getParentCateList();
    },
    // 获取父级分类数据
    async getParentCateList() {
      const result = await this.$http.getCategory({
        type: 2
      });
      if (result.meta.status !== 200) return this.$message.error('获取父级分类数据失败');
      this.parentCateList = result.data;
    },
    // 选择项发生变化触发
    parentCateChange() {
      // 如果 selectedKeys 中的 length 大于 0，已选中了父级分类
      // 若 等于 0  则证明是一级分类
      const len = this.selectedKeys.length;
      if (len > 0) {
        // 父级分类的 Id
        this.addCateForm.cat_pid = this.selectedKeys[len - 1];
        this.addCateForm.cat_level = len;
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = len;
      }
    },
    // 点击按钮添加新的分类
    addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return this.$message.error('表单未填写完整');
        const result = await this.$http.addCategory(this.addCateForm);
        if (result.meta.status !== 201) return this.$message.error('添加分类失败');
        this.$message.success('添加分类成功');
        this.getCateList();
        this.addCateDialogVisible = false;
      })
    },
    // 监听对话框的关闭事件，重置数据
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields();
      this.selectedKeys = [];
      this.addCateForm.cat_level = 0;
      this.addCateForm.cat_pid = 0;
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
.tree_table {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
