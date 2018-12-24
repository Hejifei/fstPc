<template>
  <div class="hello">
    <div class="listtitle">{{this.ruleForm.id === '' ? '新增分组' : '编辑分组'}}</div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position='left' label-width="100px" class="demo-ruleForm newaddInfoC">
      <el-form-item label="分组名" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <!-- <el-form-item label="状态" prop="state">
        <el-select v-model="ruleForm.state" placeholder="请选择状态">
          <el-option label="有效" value="boy"></el-option>
          <el-option label="无效" value="girl"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="描述" prop="remark">
        <el-input type="textarea" v-model="ruleForm.remark"></el-input>
      </el-form-item>
      <el-form-item label="" prop="personIds">
        <div class="addtransferC">
          <el-transfer
            style="text-align: left; display: inline-block"
            v-model="ruleForm.personIds"
            filterable
            :left-default-checked="[]"
            :right-default-checked="[]"
            :titles="['未分组人员', '已添加对象']"
            :button-texts="['删除','添加到分组对象']"
            :format="{
              noChecked: '${total}',
              hasChecked: '${checked}/${total}'
            }"
            @change="handleChange"
            :data="personlist">
            <el-button class="transfer-footer" slot="left-footer" size="small">操作</el-button>
            <el-button class="transfer-footer" slot="right-footer" size="small">操作</el-button>
          </el-transfer>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="submitForm('ruleForm')">保存</el-button>
        <router-link class="el-button" to="/PeopleManage/PeopleGroupList">取消</router-link>
      </el-form-item>
    </el-form>
    
  </div>
</template>

<script>
export default {
  data () {
    let self = this;
    const validateidnamerepeat = (rule, value, callback)=>{
      if(this.ruleForm.id === undefined){
        self._ajax(self,'/group/checkByName', {groupName:value}, function (data) {
          if(data.data === true){
            callback();
          }else{
            callback(new Error('分组名已存在！'));
          }
        })
      }else{
        callback();
      }
    };
    return {
      personlist:[],
      dialogImageUrl: '',
      dialogVisible: false,
      ruleForm: {
          id:'',
          name: '',
          remark: '',
          personIds:[],
      },
      rules: {
          name: [
            { required: true, message: '请输入分组名', trigger: 'blur' },
            { validator: validateidnamerepeat, trigger: 'blur' },
          ],
          personIds: [
            // { required: true, message: '请选择分组对象', trigger: 'change' },
          ],
          remark: [
            { required: true, message: '请输入描述', trigger: 'blur' }
          ],
          
        }
      }
  },
  created(){
    let self = this;
  },
  mounted () {  
    let self = this;
    let personlist = [];
    //人员列表
    self._ajax(self,'/person/noGroup', {}, function (data) {
      // self.personlist = data.data;
      if(data.data.length >0){
        for(let i = 0;i<data.data.length;i++){
          personlist.push({
            key: data.data[i].id,
            label: data.data[i].name,
          });
        }
      }
    })
    this.ruleForm.id = this.getUrl(location.href).id;
    let personIds=[];
    if(this.ruleForm.id === undefined){
      // 新增
    }else{
      //编辑
      self._ajax(self,'/group/view', {id:this.ruleForm.id}, function (data) {
        self.ruleForm.name = data.data.name;
        self.ruleForm.remark = data.data.remark;
        // self.ruleForm.name = data.data.name;
        // let newdeviceIds=[];
        if(data.data.persons.length >0){
          for(let i = 0;i<data.data.persons.length;i++){
            personlist.push({
              key: data.data.persons[i].id,
              label: `${data.data.persons[i].name} ${data.data.persons[i].phone}`,
            });
            personIds.push(data.data.persons[i].id);
          }
        }
      })
    }
    this.ruleForm.personIds = personIds;
    this.personlist = personlist;
  },
  methods: {
    submitForm(formName) {
      if(this.ruleForm.id === undefined){
        //增
        this._submitForm(formName,this,'/group/add',this.ruleForm,'/PeopleManage/PeopleGroupList')
      }else{
        //改
        this._submitForm(formName,this,'/group/edit',this.ruleForm,'/PeopleManage/PeopleGroupList')
      }
    },
    handleChange(value, direction, movedKeys) {
      console.log(value, direction, movedKeys);
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
