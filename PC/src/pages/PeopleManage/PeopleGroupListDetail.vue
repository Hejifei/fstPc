<template>
  <div class="hello">
    <div class="listtitle">查看分组</div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position='left' label-width="100px" class="demo-ruleForm newaddInfoC">
      <el-form-item label="分组名" prop="name">
        <el-input v-model="ruleForm.name" disabled></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="desc">
        <el-input type="textarea" v-model="ruleForm.remark"  disabled></el-input>
      </el-form-item>
      <div class="el-form-item addtableC">
        <el-table
          ref="multipleTable"
          :data="ruleForm.tableData"
          tooltip-effect="dark"
          style="width: 100%"
          >
          <el-table-column
            prop="name"
            label="姓名">
          </el-table-column>
          <el-table-column
            prop="gender"
            label="性别">
          </el-table-column>
          <el-table-column
            prop="phone"
            label="手机号">
          </el-table-column>
        </el-table>
        
      </div>
      <el-form-item>
        <router-link class="el-button" to="/PeopleManage/PeopleGroupList">取消</router-link>
      </el-form-item>
    </el-form>
    
  </div>
</template>

<script>
export default {
  data () {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      ruleForm: {
        id:'',
        name: '',
        remark: '',
        tableData:[],
      },
      
      rules: {
          name: [
            { required: true, message: '请输入分组名', trigger: 'blur' },
          ],
          state: [
            { required: true, message: '请选择状态', trigger: 'change' }
          ],
          listadd: [
            { required: true, message: '请选择分组对象', trigger: 'change' },
          ],
          desc: [
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
    this.ruleForm.id = this.getUrl(location.href).id;
    let personIds=[];
    if(this.ruleForm.id === undefined){
      // 没有id返回列表页
      self.$router.push({path:'/PeopleGroupList'});
    }else{
      //编辑
      self._ajax(self,'/group/view', {id:this.ruleForm.id}, function (data) {
        self.ruleForm.name = data.data.name;
        self.ruleForm.remark = data.data.remark;
        self.ruleForm.tableData=data.data.persons;
      })
    }
  },
  methods: {
    getGroupInfo(id) {
      let self = this;
      self._ajax(self,'/api/', self.ruleForm, function (data) {

      })
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
