<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>其他成员</el-breadcrumb-item>
    </el-breadcrumb>

    <el-row>
      <el-col :span="8" v-for="item in othersInformation" :key="item.id">
        <el-card>
          <div>
            {{item.chineseName}}
            <hr style="height:1px;border:none;border-top:1px dashed #0066CC;" />
          </div>
          <el-avatar shape="circle" :size="100" :src="item.url"></el-avatar>
          <div>
            <font color="#409EFF">姓名：{{item.chineseName}}</font>
            <br />
            <font color="#409EFF">
              性别：
              <el-tag type="primary" size="mini" v-if="item.gender==='Female'">女生</el-tag>
            </font>
            <br />
            <font color="#409EFF">电话：{{item.phone}}</font>
            <br />
            <font color="#409EFF">邮箱：{{item.email}}</font>
            <br />
            <font color="#409EFF">住址：{{item.address}}</font>
            <br />
            <font color="#409EFF">入职：{{item.hireDate}}</font>
            <br />
            <font color="#409EFF">职位：{{item.department}}/{{item.grade}}</font>
            <br />
            <font color="#409EFF">学校：{{item.school}}</font>
            <br />
            <font color="#409EFF">学位：{{item.degree}}</font>
            <br />
            <font color="#409EFF">
              状态：
              <el-tag type="success" size="mini" v-if="item.isDeleted===1">有效</el-tag>
            </font>
            <br />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //团队其他成员基本信息
      othersInformation: []
    };
  },
  created() {
    this.getOthersInformation();
  },
  methods: {
    //查看本团队其他成员
    async getOthersInformation() {
      const { data: res } = await this.$http.get(
        "employee/getOthersInformation/" +
          window.sessionStorage.getItem("empId")
      );
      if (res.status !== 200) {
        return this.$message.error("获取失败！");
      } else {
        this.othersInformation = res.obj;
        console.log(this.othersInformation);
      }
    }
  }
};
</script>
<style lang='less' scoped>
.el-card {
  width: 350px;
  height: 400px;
  margin-top: 20px;
}
.el-avatar {
  margin-left: 100px;
}
</style>
