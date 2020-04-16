<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/pic/logo.png" alt />
      </div>
      <!-- 登录表单区域 -->
      <el-form
        ref="loginFromRef"
        :rules="loginFromRules"
        :model="loginFrom"
        label-width="0px"
        class="login_form"
      >
        <!-- 管理员名称 -->
        <el-form-item prop="username">
          <el-input v-model="loginFrom.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="loginFrom.password"
            prefix-icon="iconfont icon-3702mima"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
          <el-button type="warning" @click="registerDialog = true">注册</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 员工注册区域 -->
    <el-drawer
      title="员工注册"
      :visible.sync="registerDialog"
      :before-close="handleClose"
      direction="rtl"
      ref="drawer"
    >
      <div>
        <el-form
          :model="registerForm"
          :rules="registerRules"
          ref="registerFormRef"
          label-width="100px"
        >
          <el-form-item label="员工账号" prop="empId">
            <el-input class="inputClass" v-model="registerForm.empId"></el-input>
          </el-form-item>
          <el-form-item label="创建昵称" prop="username">
            <el-input class="inputClass" v-model="registerForm.username" @blur="usernameJudge"></el-input>
          </el-form-item>
          <el-form-item label="创建密码" prop="password">
            <el-input class="inputClass" type="password" v-model="registerForm.password"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="ensurePassword">
            <el-input class="inputClass" type="password" v-model="registerForm.ensurePassword"></el-input>
          </el-form-item>
          <el-form-item class="btns">
            <el-button @click="cancelForm">取 消</el-button>
            <el-button
              type="primary"
              @click="$refs.drawer.closeDrawer()"
              :loading="loading"
            >{{ loading ? '提交中...' : '确 定' }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //用来控制注册框的弹出
      registerDialog: false,
      loading: false,
      loginFrom: {
        username: "hello",
        password: "123456"
      },
      //表单验证规则
      loginFromRules: {
        username: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur"
          },
          {
            min: 1,
            max: 10,
            message: "长度在1到10个字符",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入账号密码",
            trigger: "blur"
          },
          {
            min: 6,
            max: 15,
            message: "长度在6到15个字符",
            trigger: "blur"
          }
        ]
      },
      //用户注册表单
      registerForm: {},
      //注册表单的验证规则
      registerRules: {
        empId: [
          {
            required: true,
            message: "请输入邮件发给您的工号",
            trigger: "blur"
          },
          {
            min: 10,
            max: 10,
            message: "工号为10位",
            trigger: "blur"
          }
        ],
        username: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur"
          },
          {
            min: 1,
            max: 10,
            message: "长度在1到10个字符",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入账号密码",
            trigger: "blur"
          },
          {
            min: 6,
            max: 15,
            message: "长度在6到15个字符",
            trigger: "blur"
          }
        ],
        ensurePassword: [
          {
            required: true,
            message: "请再次确认密码",
            trigger: "blur"
          },
          {
            min: 6,
            max: 15,
            message: "密码长度在6到15个字符",
            trigger: "blur"
          }
        ]
      },
      timer: null
    };
  },
  created() {},
  methods: {
    //注册的确定和x按钮
    async handleClose(done) {
      if (this.loading) {
        return;
      }
      const res = await this.$confirm("确定要提交表单吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(err => {
        return err;
      });
      if (res !== "confirm") {
        return this.$message.info("已取消该操作！");
      } else {
        this.$refs.registerFormRef.validate(async valid => {
          if (!valid) {
            return;
          } else {
            if (
              this.registerForm.password === this.registerForm.ensurePassword
            ) {
              const { data: res } = await this.$http.post(
                "employee/register",
                this.registerForm
              );
              if (res.status !== 200) {
                return this.$message.error(res.msg);
              } else {
                this.$message.success(res.msg);
              }
              this.loading = true;
              this.timer = setTimeout(() => {
                done();
                // 动画关闭需要一定的时间
                setTimeout(() => {
                  this.loading = false;
                  //清空表单内容
                  this.$refs.registerFormRef.resetFields();
                }, 400);
              }, 800);
            } else {
              return this.$message.error("密码错误,请再次确认！");
            }
          }
        });
      }
    },
    //判断昵称是否唯一
    async usernameJudge() {
      const { data: res } = await this.$http.get(
        "employee/usernameJudge/" + this.registerForm.username
      );
      if (res.status === 200) {
      } else {
        this.$message.error(res.msg);
        this.registerForm.username = "";
      }
    },
    //重置操作
    resetLoginForm() {
      //清空表单内容
      this.loginFrom.username="";
      this.loginFrom.password=""
    },
    //登录(调用管理员端的登录方法)
   login() {
      // 预验证，先获取引用对象，在调用validate函数
      this.$refs.loginFromRef.validate(async valid => {
        if (!valid) {
          return;
        } else {
          //登录请求
          const { data: result } = await this.$http.post(
            "admin/login",
            this.loginFrom
          );
          if (result.status === 500) {
            return this.$message.error(result.msg);
          } else {
            this.$message.success(result.msg);
             //1.将登录成功之后的token，保存到客户端的sessionStorage中
            //  1.1 项目中除了登录之外的其他API接口，必须在登录之后才能访问
            //  1.2 token 只应该在当前网站打开期间生效，所以将token保存到sessionStorage中
            window.sessionStorage.setItem("token",result.obj.token);
            window.sessionStorage.setItem("empId",result.obj.empId);
            window.sessionStorage.setItem("chineseName",result.obj.name);
            //2.通过编程式导航跳转到后台主页
            this.$router.push("/home");
          }
        }
      });
    },
    //注册弹框的取消事件
    cancelForm() {
      this.loading = false;
      this.registerDialog = false;
      //清空表单内容
      this.$refs.registerFormRef.resetFields();
    }
  }
};
</script>
<style lang='less' scoped>
//scoped表示样式只在该页面生效
.login_container {
  background-color: white;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 310px;
  background-color: #2b4b6b;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.btns {
  display: flex;
  justify-content: flex-end;
  margin-right: 20%;
  margin-top: 20px;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.inputClass {
  width: 80%;
}
</style>