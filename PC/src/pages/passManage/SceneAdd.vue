<template>
  <div class="hello">
    <div class="listtitle">新增场景</div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position='left' label-width="100px" class="demo-ruleForm newaddInfoC">
      <el-form-item label="场景名称" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="场景描述" prop="remark">
        <el-input type="textarea" v-model="ruleForm.remark"></el-input>
      </el-form-item>
      <el-form-item  prop="deviceIds">
        <div class="addtransferC">
          <el-transfer
            style="text-align: left; display: inline-block"
            v-model="ruleForm.deviceIds"
            filterable
            :left-default-checked="[]"
            :right-default-checked="[]"
            :render-content="renderFunc"
            :titles="['未添加设备', '已添加的设备']"
            :button-texts="['删除','添加']"
            :format="{
              noChecked: '${total}',
              hasChecked: '${checked}/${total}'
            }"
            :data="deviceData">
            <el-button class="transfer-footer" slot="left-footer" size="small">操作</el-button>
            <el-button class="transfer-footer" slot="right-footer" size="small">操作</el-button>
          </el-transfer>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="submitForm('ruleForm')">保存</el-button>
        <router-link class="el-button" to="/passManage/SceneManage">取消</router-link>
      </el-form-item>
    </el-form>
    
  </div>
</template>

<script>
export default {
  data () {
    const validatenamerepeat = (rule, value, callback)=>{
      if(this.ruleForm.id === undefined){
        this._ajax(this,'/sense/checkByName', {senseName:this.ruleForm.name}, function (data) {
          if(data.data === true){
            callback();
          }else{
            callback(new Error('场景名称已存在！'));
          }
        })
      }else{
        callback();
      }
    }
    return {
      deviceData:[],
      deviceVal: [1],
      renderFunc(h, option) {
          return <span>{ option.key } - { option.label }</span>;
      },
      ruleForm: {
          id:'',
          name: '',
          remark: '',
          deviceIds:[],
      },
      rules: {
          name: [
            { required: true, message: '请输入场景名称', trigger: 'blur' },
            { validator: validatenamerepeat, trigger: 'blur' },
          ],
          remark: [
            { required: true, message: '请输入场景描述', trigger: 'blur' },
          ],
          // deviceIds: [
          //   { required: true, message: '请选择设备', trigger: 'change' }
          // ],
        }
      }
  },
  created(){
    let self = this;
  },
  mounted () {  
    let self = this;
    //获取未添加设备
    let transferlist = [];
    self._ajax(self,'/device/unbind', {}, function (data) {
      if(data.data.length >0){
        for(let i = 0;i<data.data.length;i++){
          transferlist.push({
              key: data.data[i].id,
              label: data.data[i].name,
            });
        }
      }
    })
    this.ruleForm.id = this.getUrl(location.href).id;
    let newdeviceIds=[];
    if(this.ruleForm.id === undefined){
      // 新增
    }else{
      //编辑
      self._ajax(self,'/sense/view', {id:this.ruleForm.id}, function (data) {
        self.ruleForm.name = data.data.name;
        self.ruleForm.remark = data.data.remark;
        if(data.data.devices.length >0){
          for(let i = 0;i<data.data.devices.length;i++){
            transferlist.push({
              key: data.data.devices[i].id,
              label: data.data.devices[i].name,
            });
            newdeviceIds.push(data.data.devices[i].id);
          }
        }
        
      })
    }
    self.deviceData = transferlist;
    // self.deviceVal = newdeviceIds;
    self.ruleForm.deviceIds = newdeviceIds;
    console.log(self.ruleForm.deviceIds)
  },
  methods: {
    submitForm(formName) {
      if(this.ruleForm.id === undefined){
        //增
        this._submitForm(formName,this,'/sense/add',this.ruleForm,'/passManage/SceneManage')
      }else{
        //改
        this._submitForm(formName,this,'/sense/edit',this.ruleForm,'/passManage/SceneManage')
      }
    },
    // handleChange(value, direction, movedKeys) {
    //   console.log(value)
    //   // this.ruleForm.deviceIds = value;
    //   console.log(this.ruleForm.deviceIds)
    //   // this.setState({
    //   //   ruleForm:{deviceIds: value,}
    //   // })
    // },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
