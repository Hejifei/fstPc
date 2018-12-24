<template>
  <div class="hello">
    <div class="listtitle">{{ruleForm.id ? '编辑角色' : '新增角色'}}</div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position='left' label-width="100px" class="demo-ruleForm newaddInfoC">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="ruleForm.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="roleDesc">
        <el-input type="textarea" v-model="ruleForm.roleDesc"></el-input>
      </el-form-item>
      <!-- <el-form-item label="状态" prop="status">
        <el-select v-model="ruleForm.status" placeholder="请选择状态">
          <el-option label="有效" value="1"></el-option>
          <el-option label="无效" value="0"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button type="success" @click="submitForm('ruleForm')">保存</el-button>
        <router-link class="el-button" to="/SystemManage/RoleManage">取消</router-link>
      </el-form-item>
    </el-form>
    
  </div>
</template>

<script>
export default {
  data () {
    
    return {
      ruleForm: {
          roleName: '',
          status: '1',
          roleDesc: '',
          id:'',
      },
      rules: {
          roleName: [
            { required: true, message: '请输入角色名称', trigger: 'blur' },
            { max: 10, message: '名称不超过 10 个字符', trigger: 'blur' }
          ],
          roleDesc: [
            { max: 50, message: '描述不超过 50 个字符', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '请选择状态', trigger: 'change' }
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
      self.ruleForm.roleName = role.roleName;
      self.ruleForm.status = role.roleStatus;
      self.ruleForm.roleDesc = role.roleDesc;
    }
  },
  methods: {
    submitForm(formName) {
      this._submitForm(formName,this,'/get/system/addOrEditRole',this.ruleForm,'/SystemManage/RoleManage')
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
