<template>
  <div class="hello">
    <div class="listtitle">{{ruleForm.id ? '编辑用户' : '新增用户'}}</div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position='left' label-width="100px" class="demo-ruleForm newaddInfoC">
      <el-form-item label="姓名" prop="loginName">
        <el-input v-model="ruleForm.loginName"></el-input>
      </el-form-item>
      <el-form-item label="账号" prop="loginAccount">
        <el-input v-model="ruleForm.loginAccount"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="ruleForm.phone"></el-input>
      </el-form-item>
      <el-form-item label="角色" prop="roleStrlist">
        <el-select
          v-model="ruleForm.roleStrlist"
          multiple
          collapse-tags
          placeholder="请选择角色">
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="ruleForm.status" placeholder="请选择状态">
          <el-option label="有效" value="1"></el-option>
          <el-option label="无效" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="submitForm('ruleForm')">保存</el-button>
        <router-link class="el-button" to="/SystemManage/EmployeeManage">取消</router-link>
      </el-form-item>
    </el-form>
    
  </div>
</template>

<script>
export default {
  data () {
    var validatePhone = (rule, value, callback) => {
        var reg = /^[1][0-9]{10}$/;
        if (value === '') {
          callback(new Error('请输入手机号'));
        } else if (!reg.test(value) ) {
          callback(new Error('请输入正确的手机号!'));
        }  else {
          callback();
        }
    };
    return {
      roleList:[],
      roleNameStr:[],
      ruleForm: {
          loginName: '',
          loginAccount:'',
          phone:'',
          roleStrlist:[],
          status: '1',
      },
      rules: {
          loginName: [
            { required: true, message: '请输入姓名', trigger: 'blur' },
            { max: 10, message: '姓名不超过 10 个字符', trigger: 'blur' }
          ],
          loginAccount: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            { max: 20, message: '姓名不超过 20 个字符', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { validator: validatePhone, trigger: 'blur' },
          ],
          pass: [
            { required: true, message: '请输入密码', trigger: 'blur' },
          ],
          roleStrlist: [
            { required: true, message: '请选择角色', trigger: 'change' }
          ],
          status: [
            { required: true, message: '请选择状态', trigger: 'change' }
          ],
          desc: [
            // { required: true, message: '请输入角色描述', trigger: 'blur' },
            { max: 50, message: '描述不超过 50 个字符', trigger: 'blur' }
          ],
        }
      }
  },
  created(){
    let self = this;
  },
  mounted () {  
    let self = this;
    this.ruleForm.id = this.getUrl(location.href).id;
    
    if(this.ruleForm.id && sessionStorage.detail){
      let role = JSON.parse(sessionStorage.detail);
      // sessionStorage.removeItem('detail')
      self.ruleForm.loginName = role.loginName;
      self.ruleForm.loginAccount = role.loginAccount;
      self.ruleForm.phone = role.phone;
      self.ruleForm.status = role.loginStatus;
      self.roleNameStr = role.roleNameStr;

      
    }
    self._ajax(self,'/get/system/roleList', {}, function (data) {
      self.roleList = data.data;

      let roleStrlist = [];
      if(self.roleNameStr.length > 0){
        let newlist = (self.roleNameStr).split(',');
        for(let i = 0;i<self.roleList.length;i++){
          if(newlist.indexOf(self.roleList[i].roleName) !== -1){
            roleStrlist.push(self.roleList[i].id);
          }
        }
      }
      self.ruleForm.roleStrlist = roleStrlist;
    })
    
  },
  methods: {
    submitForm(formName) {
      let self = this;
      this.ruleForm.roleStr = String(self.ruleForm.roleStrlist)
      this._submitForm(formName,this,'/get/system/addOrEditAccount',this.ruleForm,'/SystemManage/EmployeeManage')
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
