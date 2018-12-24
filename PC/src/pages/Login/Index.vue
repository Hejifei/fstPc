<template>
  <div class="loginC">
    <div class="loginCenter">
      <form style="display:none;"><input type="password" style="width:0;height:0;"/></form>
      <img src="../../assets/img/login_logo1.png" /> 
      <img src="../../assets/img/logo_title.png" /> 
      <div class="loginfoC">
        <img src="../../assets/img/login_head.png"/>
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm"  class="demo-ruleForm">
          <el-form-item label="账号" prop="loginAccount">
            <el-input v-model.number="ruleForm.loginAccount" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="passWord">
            <el-input type="password" v-model="ruleForm.passWord" auto-complete="off"></el-input>
          </el-form-item>
          <el-button type="info" style="width:100%;" @click="submitForm('ruleForm')">登录</el-button>
          <!-- <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item> -->
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          callback();
        }
    };
    return {
      ruleForm: {
        loginAccount: '',
        passWord: ''
      },
      rules: {
        loginAccount: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        passWord: [
          { validator: validatePass, trigger: 'blur' }
        ]
      }
    }
  },
  created:function(){
    let self = this;
    document.onkeydown = function(e){
      let key = window.event.keyCode;
      if(key === 13){
        self.submitForm('ruleForm');
      }
    }
  },
  methods: {
      submitForm(formName) {
        let self = this;
        // this._submitForm(formName,this,'/get/system/login',this.ruleForm,'/')
        this.$refs[formName].validate((valid) => {
          if (valid) {
            self._ajax(self,'/get/system/login', self.ruleForm, function (data) {
              // 用户信息存储
              let fstinfo = {
                id:data.data.id,
                loginAccount:data.data.loginAccount,
                loginName:data.data.loginName,
                token:data.data.token
              }
              localStorage.fst = JSON.stringify(fstinfo);
              sessionStorage.menuC = JSON.stringify(data.data.resourceList);
              // 成功提示
              self.$message({
                message: data.desc,
                type: 'success'
              });
              // 页面跳转
              self.$router.push({path:'/home'});
            })
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
