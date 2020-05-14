<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>个人信息</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert title="请查阅个人信息，如有错误请尽快修改" type="success" center show-icon :closable="false"></el-alert>

      <div>
        <!-- 步骤条 -->
        <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
          <el-step title="基本信息"></el-step>
          <el-step title="联系方式"></el-step>
          <el-step title="部门信息"></el-step>
          <el-step title="学校信息"></el-step>
          <el-step title="其他信息"></el-step>
        </el-steps>

        <el-form
          :model="employeeInformation"
          :rules="employeeRules"
          ref="employeeFormRef"
          label-width="150px"
        >
          <el-tabs v-model="activeIndex" :tab-position="'left'" style="height: 300px;">
            <el-tab-pane label="基本信息" name="0">
              <el-tooltip effect="dark" content="编辑信息" placement="top">
                <i class="el-icon-edit" style=" margin-left: 10px;" @click="jibenEdit"></i>
              </el-tooltip>
              <el-form-item label="编号:">
                <el-input v-model="employeeInformation.empId" disabled style="width:200px"></el-input>
              </el-form-item>
              <el-form-item label="姓名:">
                <el-input v-model="employeeInformation.chineseName" disabled style="width:200px"></el-input>
              </el-form-item>
              <el-form-item label="性别:">
                <el-select
                  v-model="employeeInformation.gender"
                  :disabled="jibenDisabled"
                  style="width:200px"
                >
                  <el-option
                    v-for="item in genderOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="生日:">
                <el-date-picker
                  style="width:200px"
                  v-model="employeeInformation.birthday"
                  :disabled="jibenDisabled"
                  type="date"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="联系方式" name="1">
              <el-tooltip effect="dark" content="编辑信息" placement="top">
                <i class="el-icon-edit" style=" margin-left: 10px;" @click="lianxiEdit"></i>
              </el-tooltip>
              <el-form-item label="电话:" prop="phone">
                <el-input
                  v-model="employeeInformation.phone"
                  :disabled="lianxiDisabled"
                  style="width:200px"
                ></el-input>
              </el-form-item>
              <el-form-item label="邮箱:" prop="email">
                <el-input
                  v-model="employeeInformation.email"
                  :disabled="lianxiDisabled"
                  style="width:200px"
                ></el-input>
              </el-form-item>
              <el-form-item label="地址:">
                <el-cascader
                  :options="cityData"
                  v-model="employeeInformation.address"
                  :disabled="lianxiDisabled"
                  style="width:200px"
                ></el-cascader>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="部门信息" name="2">
              <el-alert
                title="此信息不可修改,如有错误请联系管理员进行修改"
                type="warning"
                center
                show-icon
                :closable="false"
              ></el-alert>
              <el-form-item label="入职日期:">
                <el-input
                  v-model="employeeInformation.hireDate"
                  disabled
                  style="width:200px; margin-top:10px"
                ></el-input>
              </el-form-item>
              <el-form-item label="部门:">
                <el-input v-model="employeeInformation.department" disabled style="width:200px"></el-input>
              </el-form-item>
              <el-form-item label="职位:">
                <el-input v-model="employeeInformation.grade" disabled style="width:200px"></el-input>
              </el-form-item>
              <el-form-item label="工作地:">
                <el-input
                  v-model="employeeInformation.workingLocation"
                  disabled
                  style="width:200px"
                ></el-input>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="学校信息" name="3">
              <el-tooltip effect="dark" content="编辑信息" placement="top">
                <i class="el-icon-edit" style=" margin-left: 10px;" @click="schoolEdit"></i>
              </el-tooltip>
              <el-form-item label="学校:" prop="school">
                <el-input
                  v-model="employeeInformation.school"
                  :disabled="schoolDisabled"
                  style="width:200px"
                ></el-input>
              </el-form-item>
              <el-form-item label="专业:" prop="marjor">
                <el-input
                  v-model="employeeInformation.marjor"
                  :disabled="schoolDisabled"
                  style="width:200px"
                ></el-input>
              </el-form-item>
              <el-form-item label="学位:">
                <el-select
                  v-model="employeeInformation.degree"
                  :disabled="schoolDisabled"
                  style="width:200px"
                >
                  <el-option
                    v-for="item in degreeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="毕业时间:">
                <el-date-picker
                  style="width:200px"
                  v-model="employeeInformation.graduationTime"
                  :disabled="schoolDisabled"
                  type="date"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="其他信息" name="4">
              <el-upload
                action="file/upload"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <el-avatar v-if="imageUrl" style="margin-left:70px" :size="200" :src="imageUrl"></el-avatar>
                <i v-else class="el-icon-plus avatar-uploader-icon; avatar-uploader"></i>
              </el-upload>
              <el-button type="primary" @click="openUpdatePassword" style="margin-left: 120px;margin-top: 40px;">修改密码</el-button>
            </el-tab-pane>
          </el-tabs>
        </el-form>
      </div>
    </el-card>

    <el-dialog
      title="密码修改中。。。。。"
      :visible.sync="updatePasswordDialogVisible"
      width="40%"
      :before-close="updatePasswordCancel"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="新密码" prop="password">
          <el-input v-model="ruleForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="ensurePassword">
          <el-input v-model="ruleForm.ensurePassword" type="password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updatePasswordCancel">取 消</el-button>
        <el-button type="primary" @click="updatePasswordEnsure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash";
import cityData from "./citydata.js";
export default {
  data() {
    //邮箱的验证规则
    var checkEmail = (rule, value, cb) => {
      const regEamil = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEamil.test(value)) {
        return cb();
      } else {
        cb(new Error("请输入合法的邮箱"));
      }
    };

    //手机号验证规则
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        return cb();
      } else {
        cb(new Error("请输入合法的手机号码"));
      }
    };
    return {
      //控制密码修改对话框
      updatePasswordDialogVisible: false,
      //修改密码
      ruleForm: {
        password: "",
        ensurePassword: ""
      },
      //密码的验证规则
      rules: {
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
      //学位选择
      degreeOptions: [
        {
          value: "大专",
          label: "大专"
        },
        {
          value: "本科",
          label: "本科"
        },
        {
          value: "硕士",
          label: "硕士"
        },
        {
          value: "博士",
          label: "博士"
        }
      ],
      //获取城区地址
      cityData: cityData,
      //头像地址
      imageUrl: "",
      //基本信息的禁用
      jibenDisabled: true,
      //联系方式禁用
      lianxiDisabled: true,
      //学校信息的禁用
      schoolDisabled: true,
      //验证规则
      employeeRules: {
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur"
          },
          {
            validator: checkEmail,
            trigger: "blur"
          }
        ],
        phone: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur"
          },
          {
            validator: checkMobile,
            trigger: "blur"
          }
        ],
        school: [
          {
            required: true,
            message: "请输入学校",
            trigger: "blur"
          }
        ],
        marjor: [
          {
            required: true,
            message: "请输入专业",
            trigger: "blur"
          }
        ]
      },
      //保存员工信息
      employeeInformation: {},
      //克隆的员工信息
      cloneEmployeeInformation: {},
      //激活的索引
      activeIndex: "0",
      //性别选择
      genderOptions: [
        {
          value: "Male",
          label: "Male"
        },
        {
          value: "Female",
          label: "Female"
        }
      ]
    };
  },
  created() {
    this.getEmployeeInformation();
  },
  methods: {
    //获取员工信息
    async getEmployeeInformation() {
      const { data: res } = await this.$http.get(
        "employee/getEmployeeInformation/" +
          window.sessionStorage.getItem("empId")
      );
      if (res.status === 200) {
        //深拷贝对象
        this.cloneEmployeeInformation = _.cloneDeep(res.obj);
        this.employeeInformation = res.obj;
        this.employeeInformation.address = this.employeeInformation.address.split(
          "/"
        );
        //给图片地址赋值
        this.imageUrl = res.obj.url;
      } else {
        return this.$message.error("获取信息失败！");
      }
    },
    //文件上传成功
    handleAvatarSuccess(res, file) {
      this.imageUrl = res.obj.name;
      this.employeeInformation.url = res.obj.name;
      //若之前没保存，上传文件完成时自动保存
      this.jibenEdit();
      this.lianxiEdit();
      this.schoolEdit();
      this.updateEmployeeInformation();
    },
    //文件上传前
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //基本信息的修改
    jibenEdit() {
      if (this.jibenDisabled === true) {
        this.jibenDisabled = false;
      } else if (this.jibenDisabled === false) {
        this.$refs.employeeFormRef.validate(valid => {
          if (!valid) {
            return;
          } else {
            if (
              this.employeeInformation.gender !== null ||
              this.employeeInformation.birthday !== null
            ) {
              if (
                this.cloneEmployeeInformation.chineseName ===
                  this.employeeInformation.chineseName &&
                this.cloneEmployeeInformation.gender ===
                  this.employeeInformation.gender &&
                this.cloneEmployeeInformation.birthday ===
                  this.employeeInformation.birthday
              ) {
                this.jibenDisabled = true;
              } else {
                this.updateEmployeeInformation();
                this.jibenDisabled = true;
              }
            } else {
              return this.$message.error("请将信息填写完整！");
            }
          }
        });
      }
    },
    //联系信息的修改
    lianxiEdit() {
      if (this.lianxiDisabled === true) {
        this.lianxiDisabled = false;
      } else if (this.lianxiDisabled === false) {
        this.$refs.employeeFormRef.validate(valid => {
          if (!valid) {
            return;
          } else {
            if (this.employeeInformation.address.length === 0) {
              return this.$message.error("请将信息填写完整！");
            } else {
              if (
                this.cloneEmployeeInformation.phone ===
                  this.employeeInformation.phone &&
                this.cloneEmployeeInformation.email ===
                  this.employeeInformation.email &&
                this.cloneEmployeeInformation.address ===
                  this.employeeInformation.address.join("/")
              ) {
                this.lianxiDisabled = true;
              } else {
                this.updateEmployeeAndActiveInformation();
                this.lianxiDisabled = true;
              }
            }
          }
        });
      }
    },
    //学校信息的修改
    schoolEdit() {
      if (this.schoolDisabled === true) {
        this.schoolDisabled = false;
      } else if (this.schoolDisabled === false) {
        this.$refs.employeeFormRef.validate(valid => {
          if (!valid) {
            return;
          } else {
            if (
              this.employeeInformation.degree === null ||
              this.employeeInformation.graduationTime === null
            ) {
              return this.$message.error("请将信息填写完整！");
            } else {
              if (
                this.cloneEmployeeInformation.degree ===
                  this.employeeInformation.degree &&
                this.cloneEmployeeInformation.graduationTime ===
                  this.employeeInformation.graduationTime &&
                this.cloneEmployeeInformation.school ===
                  this.employeeInformation.school &&
                this.cloneEmployeeInformation.marjor ===
                  this.employeeInformation.marjor
              ) {
                this.schoolDisabled = true;
              } else {
                this.updateEmployeeInformation();
                this.schoolDisabled = true;
              }
            }
          }
        });
      }
    },
    //员工信息修改包括激活表
    async updateEmployeeAndActiveInformation(){
         this.employeeInformation.address = this.employeeInformation.address.join(
        "/"
      );
      const { data: res } = await this.$http.put(
        "employee/employeeAndActiveUpdate",
        this.employeeInformation
      );
      if (res.status === 200) {
        this.$message.success(res.msg);
        this.cloneEmployeeInformation = this.employeeInformation;
        this.employeeInformation.address = this.employeeInformation.address.split(
          "/"
        );
      } else {
        return this.$message.error(res.msg);
      }
    },
    //员工信息的修改
    async updateEmployeeInformation() {
      this.employeeInformation.address = this.employeeInformation.address.join(
        "/"
      );
      const { data: res } = await this.$http.put(
        "employee/informationUpdate",
        this.employeeInformation
      );
      if (res.status === 200) {
        this.$message.success(res.msg);
        this.cloneEmployeeInformation = this.employeeInformation;
        this.employeeInformation.address = this.employeeInformation.address.split(
          "/"
        );
      } else {
        return this.$message.error(res.msg);
      }
    },
    //打开修改密码对话框
    openUpdatePassword() {
      this.updatePasswordDialogVisible = true;
    },
    //密码修改的确认按钮
    updatePasswordEnsure() {
      this.$refs.ruleFormRef.validate(async valid => {
        if (!valid) {
          return;
        } else {
          if (this.ruleForm.ensurePassword === this.ruleForm.password) {
            const { data: res } = await this.$http.put(
              "employee/updatePassword/"+
              this.ruleForm.password
            );
            if (res.status === 200) {
              this.$message.success(res.msg);
              this.updatePasswordDialogVisible = false;
            } else {
              return this.$message.error(res.msg);
            }
          } else {
            return this.$message.error("密码不一致，请重新输入！");
          }
        }
      });
    },
    //密码修改对话框取消
    updatePasswordCancel() {
      this.ruleForm.password = "",
      this.ruleForm.ensurePassword = "",
      this.$refs.ruleFormRef.resetFields(),
      this.updatePasswordDialogVisible = false;
    }
  }
};
</script>
<style lang='less' scoped>
.avatar-uploader {
  margin-left: 70px;
  font-size: 28px;
  color: #8c939d;
  width: 200px;
  height: 200px;
  line-height: 178px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.buttonClass {
  margin-left: 400px;
}
</style>