<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>个人空间</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <span class="titleClass">
        <font color="#409EFF">记录自己的工作感受与心得体会亦可反思自己的不足，以便日后进步</font>
        <el-button type="text" @click="openAddDialog" style="margin-left:200px">点我发布</el-button>
      </span>
    </el-card>

    <el-card id="div" v-for="item in bbslist" :key="item.id" style="margin-top:20px">
      <div>
        <span>作者:</span>
        <el-tag effect="plain" type="success">{{item.chineseName}}</el-tag>
        <span style="margin-left:200px">文章标题:</span>
        <el-tag effect="plain" type="warning">{{item.title}}</el-tag>
        <span style="margin-left:200px">发布时间:</span>
        <el-tag effect="plain">{{item.publishTime}}</el-tag>
        <el-tooltip effect="dark" content="删除文章" placement="top">
          <i class="el-icon-delete" style=" margin-left: 100px;" @click="deleted(item.id)"></i>
        </el-tooltip>

        <el-tooltip effect="dark" content="修改文章" placement="top">
          <i class="el-icon-edit" style=" margin-left: 30px;" @click="edit(item.id)"></i>
        </el-tooltip>
      </div>
      <hr style="height:1px;border:none;border-top:1px dashed #0066CC;" />
      <div class="contentClass" v-html="item.content"></div>
    </el-card>

    <!-- 文章发布对话框 -->
    <el-dialog
      title="文章发布中......"
      :visible.sync="dialogVisible"
      width="80%"
      :before-close="handleClose"
    >
      <el-form :model="bbs" :rules="rules" ref="ruleFormRef" label-width="100px">
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="bbs.title"></el-input>
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
          <!-- 图片上传组件辅助-->
          <div>
            <el-upload
              class="avatar-uploader"
              :action="serverUrl"
              name="file"
              :show-file-list="false"
              :on-success="uploadSuccess"
              :on-error="uploadError"
              :before-upload="beforeUpload"
            ></el-upload>
            <el-row v-loading="quillUpdateImg">
              <quill-editor v-model="bbs.content" ref="myQuillEditor" :options="editorOption"></quill-editor>
            </el-row>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="add">发 布</el-button>
      </span>
    </el-dialog>

    <!-- 文章修改对话框 -->
    <el-dialog
      title="文章修改中......"
      :visible.sync="editVisible"
      width="80%"
      :before-close="editHandleClose"
    >
      <el-form :model="bbsEdit" :rules="rules" ref="editFormRef" label-width="100px">
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="bbsEdit.title"></el-input>
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
          <!-- 图片上传组件辅助-->
          <div>
            <el-upload
              class="avatar-uploader"
              :action="serverUrl"
              name="file"
              :show-file-list="false"
              :on-success="uploadSuccess"
              :on-error="uploadError"
              :before-upload="beforeUpload"
            ></el-upload>
            <el-row v-loading="quillUpdateImg">
              <quill-editor v-model="bbsEdit.content" ref="myQuillEditor" :options="editorOption"></quill-editor>
            </el-row>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editHandleClose">取 消</el-button>
        <el-button type="primary" @click="editSure">发 布</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// 工具栏配置
const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction

  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],
  ["link", "image", "video"],
  ["clean"] // remove formatting button
];
export default {
  data() {
    return {
      //控制修改对话框
      editVisible: false,
      //修改文章的数据
      bbsEdit: {},
      //用于存放bbs列表
      bbslist: [],
      //控制发布对话框
      dialogVisible: false,
      //验证规则
      rules: {
        title: [
          {
            required: true,
            message: "请输入标题",
            trigger: "blur"
          }
        ],
        content: [
          {
            required: true,
            message: "请输入内容",
            trigger: "blur"
          }
        ]
      },
      bbs: {},
      quillUpdateImg: false, // 根据图片上传状态来确定是否显示loading动画，刚开始是false,不显示
      serverUrl: "file/upload", // 这里写你要上传的图片服务器地址
      editorOption: {
        placeholder: "",
        theme: "snow", // or 'bubble'
        modules: {
          toolbar: {
            container: toolbarOptions, // 工具栏
            handlers: {
              image: function(value) {
                if (value) {
                  // 触发input框选择图片文件
                  document.querySelector(".avatar-uploader input").click();
                } else {
                  this.quill.format("image", false);
                }
              }
            }
          }
        }
      } // 富文本编辑器配置
    };
  },
  created() {
    this.getBBS();
  },
  methods: {
    //获取个人动态
    async getBBS() {
      const { data: res } = await this.$http.get(
        "employee/getBBS/" + window.sessionStorage.getItem("empId")
      );
      if (res.status === 200) {
        this.bbslist = res.obj;

      } else {
        return this.$message.error("获取数据失败");
      }
    },
    //删除文章
    async deleted(id) {
      //弹框提示是否删除
      const res = await this.$confirm(
        "此操作将永久删除该段文字, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => {
        return err;
      });
      if (res !== "confirm") {
        return this.$message.info("已取消删除！");
      } else {
        const { data: result } = await this.$http.put(
          "employee/bbsDeteted/" + id
        );
        if (result.status === 200) {
          this.$message.success(result.msg);
          this.getBBS();
        } else {
          return this.$message.error(result.msg);
        }
      }
    },
    //打开添加文章按钮
    openAddDialog() {
      this.dialogVisible = true;
    },
    //发布操作
    add() {
      this.$refs.ruleFormRef.validate(async valid => {
        if (!valid) {
          return;
        } else {
          this.bbs.empId = window.sessionStorage.getItem("empId");
          this.bbs.chineseName = window.sessionStorage.getItem("chineseName");
          const { data: res } = await this.$http.post(
            "employee/addBBS",
            this.bbs
          );
          if (res.status === 200) {
            this.$message.success(res.msg);
            this.bbs.title = "";
            this.bbs.content = "";
            this.dialogVisible = false;
            this.getBBS();
          } else {
            return this.$message.error(res.msg);
          }
        }
      });
    },
    //发布的关闭取消按钮
    handleClose() {
      this.bbs.title = "";
      this.bbs.content = "";
      this.dialogVisible = false;
      this.$refs.ruleFormRef.resetFields();
    },
    //修改取消
    editHandleClose() {
      this.bbsEdit.title = "";
      this.bbsEdit.content = "";
      this.editVisible = false;
      this.$refs.editFormRef.resetFields();
    },
    //打开修改文章对话框
    async edit(id) {
      const { data: res } = await this.$http.get("employee/getBBSById/" + id);
      if (res.status === 200) {
        this.bbsEdit = res.obj;
        this.editVisible = true;
      } else {
        return this.$message.error("获取数据失败！");
      }
    },
    //修改保存按钮
    editSure() {
      console.log(this.bbsEdit);
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return;
        } else {
          const { data: res } = await this.$http.put(
            "employee/updateBBS",
            this.bbsEdit
          );
          if (res.status === 200) {
            this.$message.success(res.msg);
            this.bbsEdit.title = "";
            this.bbsEdit.content = "";
            this.editVisible = false;
            this.getBBS();
          } else {
            return this.$message.error(res.msg);
          }
        }
      });
    },
    // 富文本图片上传前
    beforeUpload() {
      // 显示loading动画
      this.quillUpdateImg = true;
    },
    //上传成功
    uploadSuccess(res, file) {
      // res为图片服务器返回的数据
      // 获取富文本组件实例
      let quill = this.$refs.myQuillEditor.quill;
      // 如果上传成功
      if (res.status === 200 && res.obj.name !== null) {
        // 获取光标所在位置
        let length = quill.getSelection().index;
        // 插入图片  res.obj.name为服务器返回的图片地址
        quill.insertEmbed(length, "image", res.obj.name);
        // 调整光标到最后
        quill.setSelection(length + 1);
      } else {
        this.$message.error("图片插入失败");
      }
      // loading动画消失
      this.quillUpdateImg = false;
    },

    // 富文本图片上传失败
    uploadError() {
      // loading动画消失
      this.quillUpdateImg = false;
      this.$message.error("图片插入失败");
    }
  }
};
</script>
<style lang="less" scoped>
.contentClass {
  //font-style: italic;
  line-height: 30px;
  text-indent: 4%;
}
.titleClass {
  font-weight: bold;
  margin-left: 300px;
}
</style>
