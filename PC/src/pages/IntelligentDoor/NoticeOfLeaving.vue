<template>
  <div class="hello">
    <div class="listtitle">离岗通知</div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position='left' label-width="100px" class="demo-ruleForm newaddInfoC">
      <el-form-item label="通知形式" prop="noticeForm">
        <template>
          <el-radio v-model="ruleForm.noticeForm" label="1">微信公众号</el-radio>
        </template>
      </el-form-item>
      <!-- <el-form-item label="通知类型" prop="noticeType">
        <template>
          <el-radio v-model="ruleForm.noticeType" label="1">辅导员</el-radio>
          <el-radio v-model="ruleForm.noticeType" label="2">宿管</el-radio>
        </template>
      </el-form-item> -->
      <el-form-item label="通知内容" prop="noticeName">
        <el-input type="textarea" v-model="ruleForm.noticeName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="submitForm('ruleForm')">保存</el-button>
        <router-link class="el-button" to="/IntelligentDoor/PatrolOndutyTask">取消</router-link>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      
      ruleForm: {
          makeId:'',
          noticeForm:'1',
          noticeType: '1',
          noticeName: ''
      },
      rules: {
          noticeForm: [
            { required: true, message: '请选择通知形式', trigger: 'change' }
          ],
          noticeType:[
            // { required: true, message: '请选择通知类型', trigger: 'change' }
          ],
          noticeName: [
            { required: true, message: '请输入通知内容', trigger: 'blur' },
            { max: 100, message: '长度不超过100 个字符', trigger: 'blur' }
          ],
        }
      }
  },
  created(){
    let self = this;
  },
  mounted () {  
    let self = this;
    this.ruleForm.makeId = this.getUrl(location.href).id;
    self._ajax(self,'/get/door/getAbsencesNotice ', {'makeId':self.ruleForm.makeId}, function (data) {
      self.ruleForm.noticeName =  data.data.noticeName;
      // self.ruleForm.noticeType = (data.data.noticeType !== null) ? data.data.noticeType : '1';
    })
  },
  methods: {
    submitForm(formName) {
      this._submitForm(formName,this,'/get/door/addAbsencesNotice',this.ruleForm,'/IntelligentDoor/PatrolOndutyTask')
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
