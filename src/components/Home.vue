<template>
  <div>
    <el-container class="home-container">
      <!-- 头部 -->
      <el-header>
        <div>
          <span>员工管理系统</span>
        </div>
        <div style="margin-left: 800px;">编号：
          <el-tag type="success">{{empId}}</el-tag>
        </div>
        <div style="margin-left: -10px;">姓名：
           <el-tag type="primary">{{name}}</el-tag>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
      </el-header>
      <el-container>
        <!-- 左侧导航栏 -->
        <el-aside width="200px">
          <el-menu
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409EFF"
            router
            unique-opened
            :default-active="activePath"
          >
            <el-menu-item
              v-for="item in menulist"
              :key="item.operationId"
              :index="'/'+item.path"
              @click="saveNavState('/'+item.path)"
            >
              <template slot="title">
                <i class="el-icon-s-grid"></i>
                <span>{{item.authName}}</span>
              </template>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <!-- 右侧主体区 -->
        <el-main>
          <!-- 占位符 -->
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //左侧权限数据
      menulist: [],
      //被激活的链接地址
      activePath: "",
      empId:window.sessionStorage.getItem("empId"),
      name:window.sessionStorage.getItem("chineseName")
    };
  },
  created() {
    this.activePath = window.sessionStorage.getItem("activePath");
    this.getRights();
  },
  methods: {
    //退出:sessionStorage
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    //获取左侧权限
    async getRights() {
      const { data: res } = await this.$http.get(
        "employee/getOperationsByEmployee/" +
          window.sessionStorage.getItem("empId")
      );
      if (res.status !== 200) {
        return this.$message.error("获取权限操作失败！");
      } else {
        this.$message.success(res.msg);
        this.menulist = res.obj;
      }
    },
    //保存链接的激活状态
    saveNavState(activePath) {
      console.log("hello")
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    }
  }
};
</script>
<style lang="less" scoped>
.home-container {
  height: 817.33px;
  margin: 0;
  padding: 0;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
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
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
</style>