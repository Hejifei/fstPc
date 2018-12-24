<template>
  <div class="hello">
    <div class="listtitle">新增设备</div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position='left' label-width="100px" class="demo-ruleForm newaddInfoC">
      <el-form-item label="设备名称" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="型号" prop="model">
        <el-input v-model="ruleForm.model"></el-input>
      </el-form-item>
      <el-form-item label="IP地址" prop="ip">
        <el-input v-model="ruleForm.ip"></el-input>
      </el-form-item>
      <el-form-item label="同步端口" prop="syncPort">
        <el-input v-model="ruleForm.syncPort"></el-input>
      </el-form-item>
      <el-form-item label="管理端口" prop="adminPort">
        <el-input v-model="ruleForm.adminPort"></el-input>
      </el-form-item>
      <el-form-item label="报警端口" prop="alarmPort">
        <el-input v-model="ruleForm.alarmPort"></el-input>
      </el-form-item>
      <el-form-item label="报警用户" prop="alarmUsername">
        <el-input v-model="ruleForm.alarmUsername"></el-input>
      </el-form-item>
      <el-form-item label="报警密码" prop="alarmPassword">
        <el-input v-model="ruleForm.alarmPassword"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="ruleForm.type" placeholder="请选择类型">
          <el-option label="工控机" value="1"></el-option>
          <el-option label="展示机" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="场景" prop="senseId">
        <el-select v-model="ruleForm.senseId" placeholder="请选择场景">
          <el-option v-for="(scene,index) in scenelist" :key="index" :label="scene.name" :value="scene.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="管理员账号" prop="adminUsername">
        <el-input v-model="ruleForm.adminUsername"></el-input>
      </el-form-item>
      <el-form-item label="管理员密码" prop="adminPassword">
        <el-input v-model="ruleForm.adminPassword"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="ruleForm.remark"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="submitForm('ruleForm')">保存</el-button>
        <router-link class="el-button" to="/passManage/EquipmentManage">取消</router-link>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
export default {
  data () {
    let self = this;
    const validateidIp = (rule, value, callback)=>{
      var ip = this.ruleForm.ip;
      var reg =  /^([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/; 
      if(reg.test(ip)){
        callback();
      }else{
        callback(new Error('IP地址格式错误！'));
      }    
    };
    const validateport = (rule, value, callback)=>{
      var syncPort = this.ruleForm.syncPort;
      var reg=/^(\d)+$/g;
      if(reg.test(syncPort)&&parseInt(syncPort)<=65535&&parseInt(syncPort)>=0){
        callback();
      }else{
        callback(new Error('端口号格式错误！'));
      }    
    }; 
    return {
      scenelist:[],
      ruleForm: {
          id:'',
          name: '',
          model: '',
          type:'',
          ip:'',
          senseId:'',
          remark:'',
          alarmPort:'',
          alarmUsername:'',
          alarmPassword:'',
          adminPort:'',
          syncPort:'',
          adminUsername:'',
          adminPassword:'',
      },
      rules: {
          name: [
            { required: true, message: '请输入设备名称', trigger: 'blur' },
          ],
          model: [
            { required: true, message: '请选择型号', trigger: 'change' }
          ],
          ip: [
            { required: true, message: '请输入IP地址', trigger: 'blur' },
            { validator: validateidIp, trigger: 'blur' },
          ],
          syncPort: [
            { required: true, message: '请输入人员同步服务器端口号', trigger: 'blur' },
            { validator: validateport, trigger: 'blur' },
          ],
          alarmPort: [
            { required: true, message: '请输入报警端口', trigger: 'blur' },
          ],
          alarmUsername: [
            { required: true, message: '请输入报警用户', trigger: 'blur' }
          ],
          alarmPassword: [
            { required: true, message: '请输入报警密码', trigger: 'blur' }
          ],
          type:[
            { required: true, message: '请选择类型', trigger: 'change' }
          ],
          adminPort: [
            { required: true, message: '请输入管理服务器端口号', trigger: 'blur' },
          ],
          
          senseId: [
            // { required: true, message: '请选择场景', trigger: 'change' }
          ],
          adminUsername: [
            { required: true, message: '请输入管理服务器用户名', trigger: 'blur' }
          ],
          adminPassword: [
            { required: true, message: '请输入管理服务器密码', trigger: 'blur' }
          ],
          // remark: [
          //   { required: true, message: '请填写活动形式', trigger: 'blur' }
          // ],

        }
      }
  },
  created(){
    let self = this;
  },
  mounted () {
    let self = this;
    //场景列表
    self._ajax(self,'/sense/all', {}, function (data) {
      self.scenelist = data.data;
    })
    this.ruleForm.id = this.getUrl(location.href).id;
    if(this.ruleForm.id === undefined){
      // 新增
    }else{
      //编辑
      self._ajax(self,'/device/view', {id:this.ruleForm.id}, function (data) {
        self.ruleForm = data.data;
        // let newdeviceIds=[];
        
      })
    }
  },
  methods: {
    submitForm(formName) {
      if(this.ruleForm.id === undefined){
        //增
        this._submitForm(formName,this,'/device/add',this.ruleForm,'/passManage/EquipmentManage')
      }else{
        //改
        this._submitForm(formName,this,'/device/edit',this.ruleForm,'/passManage/EquipmentManage')
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
