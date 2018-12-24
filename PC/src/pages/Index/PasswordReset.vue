<template>
  <div class="hello">
    <div class="listtitle">编辑密码</div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position='left' label-width="100px" class="demo-ruleForm newaddInfoC">
      <el-form-item label="旧密码" prop="passWord">
        <el-input type="password" v-model="ruleForm.passWord" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassWord">
        <el-input type="password" v-model="ruleForm.newPassWord" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="checknewPass">
        <el-input type="password" v-model="ruleForm.checknewPass" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="submitForm('ruleForm')">保存</el-button>
        <router-link class="el-button" to="/home">取消</router-link>
      </el-form-item>
    </el-form>
    
  </div>
</template>

<script>
export default {
  data () {
    var validatenewPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入新密码'));
        } else if (value === this.ruleForm.passWord) {
          callback(new Error('新旧密码不能相同!'));
        }  else {
          if (this.ruleForm.checknewPass !== '') {
            this.$refs.ruleForm.validateField('checknewPass');
          }
          callback();
        }
    };
    var validatenewPass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入新密码'));
        } else if (value !== this.ruleForm.newPassWord) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
    };
    return {
      ruleForm: {
          loginAccount:JSON.parse(localStorage.fst).loginAccount,
          passWord: '',
          newPassWord:'',
          checknewPass: '',
      },
      rules: {
          passWord: [
            { required: true, message: '请输入旧密码', trigger: 'blur' }
          ],
          newPassWord: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
            { validator: validatenewPass, trigger: 'blur' },
            { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
          ],
          checknewPass: [
            { required: true, message: '请再次输入新密码', trigger: 'blur' },
            { validator: validatenewPass2, trigger: 'blur' },
            { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
          ],
        }
      }
  },
  created(){
    let self = this;
  },
  mounted () {  
    let self = this;
    // self._ajax(self,'/api/', {}, function (data) {

    // })
  },
  methods: {
    submitForm(formName) {
      this._submitForm(formName,this,'/get/system/updatePassword',this.ruleForm,'/login')
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
