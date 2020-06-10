<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="~@/assets/heima.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="danger" @click="logout">退出</el-button>
    </el-header>
    <!-- 主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="$route.path">
          <!-- 一级菜单 -->
          <el-submenu v-for="item in menuList" :key="item.id" :index="item.id + ''">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item v-for="subItem in item.children" :key="subItem.id" :index="'/' + subItem.path">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 内容主体 -->
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      menuList: [],
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false
    };
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push('/login');
    },
    async getMenuList() {
      const result = await this.$http.getMenus();
      if (result.meta.status !== 200) return this.$message.error(result.meta.msg);
      this.menuList = result.data;
    },
    toggleCollapse() {
      // 点击按钮切换菜单的折叠与展开
      this.isCollapse = !this.isCollapse;
    }
  },
  created() {
    this.getMenuList();
  },
  components: {}
};
</script>

<style scoped lang="scss">
.home-container {
  height: 100%;
  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    font-size: 20px;
    > div {
      display: flex;
      align-items: center;
      span {
        margin-left: 15px;
      }
    }
  }
  .el-aside {
    background-color: #333744;
    .toggle-button {
      background-color: #4a5064;
      font-size: 10px;
      line-height: 24px;
      color: #fff;
      text-align: center;
      letter-spacing: 0.2em;
      cursor: pointer;
    }
    .el-menu {
      border-right: none
    }
  }
  .el-main {
    background-color: #eaedf1;
  }
  .iconfont {
    margin-right: 10px;
  }
}
</style>
