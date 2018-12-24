<template>
  <div class="hello">
    <div class="listtitle">定时任务</div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position='left' label-width="100px" class="demo-ruleForm newaddInfoC">
      <el-form-item label="任务名称" prop="checkName">
        <el-input v-model="ruleForm.checkName"></el-input>
      </el-form-item>
      <el-form-item label="任务描述" prop="checkDesc">
        <el-input type="textarea" v-model="ruleForm.checkDesc"></el-input>
      </el-form-item>
      <el-form-item label="执行时间" prop='executionTime'>
        <el-select v-model='timeobs.second' placeholder="秒" class="smallsel">
          <el-option v-for="second in secondslist" :key="second.value" :label="second.value" :value="second.value"></el-option>
        </el-select>
        <el-select v-model='timeobs.minutes' placeholder="分" class="smallsel">
          <el-option v-for="minute in minuteslist" :key="minute.value" :label="minute.value" :value="minute.value"></el-option>
        </el-select>
        <el-select v-model='timeobs.hour' placeholder="时" class="smallsel">
          <el-option v-for="hour in hourlist" :key="hour.value" :label="hour.value" :value="hour.value"></el-option>
        </el-select>
        <el-select v-model='timeobs.day' placeholder="日" class="smallsel" :clearable='true'>
          <el-option v-for="day in daylist" :key="day.value" :label="day.value" :value="day.value"></el-option>
        </el-select>
        <el-select v-model='timeobs.month' placeholder="月" class="smallsel" :clearable='true'>
          <el-option v-for="month in monthlist" :key="month.value" :label="month.name" :value="month.value"></el-option>
        </el-select>
        <el-select v-model='timeobs.week' placeholder="周" class="smallsel" :clearable='true'>
          <el-option v-for="week in weeklist" :key="week.value" :label="week.name" :value="week.value"></el-option>
        </el-select>
        <el-select
          v-model="timeobs.year"
          multiple
          collapse-tags
          class="smallsel"
          placeholder="年">
          <el-option
            v-for="year in yearList"
            :key="year.value"
            :label="year.value"
            :value="year.value">
          </el-option>
        </el-select>
        <!-- <el-date-picker class="smallsel"  v-model="timeobs.year"  type="year" placeholder="选择年"></el-date-picker> -->
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="submitForm('ruleForm')">保存</el-button>
        <router-link class="el-button" to="/SystemManage/DatabaseManage">取消</router-link>
      </el-form-item>
    </el-form>
    
  </div>
</template>

<script>
export default {
  data () {
    
    //验证时段不能为空
    const validateTime = (rule, value, callback) => {
        if (this.timeobs.second === '' && this.timeobs.minutes === '' && this.timeobs.hour === ''
         && this.timeobs.day === ''
          && this.timeobs.month === ''
           && this.timeobs.week === ''
            && this.timeobs.year.length === 0) {
          callback(new Error('请选择时段'));
        } else {
          callback();
        }
      };
    const secondslist = _ =>{
      const data = [];
      for(let i = 0;i<60;i++){
        data.push({value:i})
      }
      return data;
    }
    const minuteslist= _ =>{
      const data = [];
      for(let i = 0;i<60;i++){
        data.push({value:i})
      }
      return data;
    }
    const hourlist= _ =>{
      const data = [];
      for(let i = 0;i<24;i++){
        data.push({value:i})
      }
      return data;
    }
    const daylist= _ =>{
      const data = [];
      for(let i = 1;i<32;i++){
        data.push({value:i})
      }
      return data;
    }
    const monthlist= _ =>{
      const data = [
        {'name':'一月','value':'1'},
        {'name':'二月','value':'2'},
        {'name':'三月','value':'3'},
        {'name':'四月','value':'4'},
        {'name':'五月','value':'5'},
        {'name':'六月','value':'6'},
        {'name':'七月','value':'7'},
        {'name':'八月','value':'8'},
        {'name':'九月','value':'9'},
        {'name':'十月','value':'10'},
        {'name':'十一月','value':'11'},
        {'name':'十二月','value':'12'},
      ];
      // for(let i = 1;i<13;i++){
      //   data.push({value:i})
      // }
      return data;
    }
    const weeklist= _ =>{
      const data = [
        {'name':'周一','value':'1'},
        {'name':'周二','value':'2'},
        {'name':'周三','value':'3'},
        {'name':'周四','value':'4'},
        {'name':'周五','value':'5'},
        {'name':'周六','value':'6'},
        {'name':'周日','value':'7'},
      ];
      // for(let i = 1;i<8;i++){
      //   data.push({value:i})
      // }
      return data;
    }
    const yearList= _ =>{
      const data = [];
      for(let i = 2018;i<2108;i++){
        data.push({'value':i})
      }
      return data;
    }
    return {
      value6: '',
      secondslist:secondslist(),
      minuteslist:minuteslist(),
      hourlist:hourlist(),
      daylist:daylist(),
      monthlist:monthlist(),
      weeklist:weeklist(),
      yearList:yearList(),
      timeobs:{
        second:'',
        minutes:'',
        hour:'',
        day:'',
        month:'',
        week:'',
        year:[],
      },
      ruleForm: {
        checkName:'',
        checkDesc:'',
        executionTime: '',
        days:'',
      },
      rules: {
          checkName: [
            { required: true, message: '请输入姓名', trigger: 'blur' },
            { max: 10, message: '名字不超过 10 个字符', trigger: 'blur' }
          ],
          checkDesc: [
            { required: true, message: '请填写任务描述', trigger: 'blur' },
            { max: 50, message: '长度不超过50 个字符', trigger: 'blur' }
          ],
          executionTime: [
            { validator: validateTime, trigger: 'blur' },
          ],
        }
      }
  },
  created(){
    let self = this;
  },
  mounted () {  
    let self = this;
    self._ajax(self,'/get/system/dbTaskView', {}, function (data) {
      self.ruleForm = data.data;
      // let timestr= "1;2;3;4;5;6;2018,2019,2020,2021,2022,2023,2024";
      let timestr = data.data.executionTime;
      let backlist = timestr.split('*').join('').split(';');
      let [second,minutes,hour,day,month,week,...year]=backlist;
      self.timeobs.second=second;
      self.timeobs.minutes=minutes;
      self.timeobs.hour=hour;
      self.timeobs.day=day;
      self.timeobs.month=month;
      self.timeobs.week=week;
      if(year[0] === ''){
        self.timeobs.year=[];
      }else{
        self.timeobs.year=String(year).split(',').map((val)=>Number(val));
      }
    })
    

  },
  methods: {
    submitForm(formName) {
      let self = this;
      let timeList = [];
      for(let i in self.timeobs){
        if(i !== 'year'){
          timeList.push(self.timeobs[i] === '' ? '*' : self.timeobs[i])
        }
      }
      // 将选择的年份排序
      let year = self.timeobs.year;
      // console.log(year)
      let i, j, temp, len = year.length
      for (i = 1; i < len; i++) {
        temp = year[i]
        j = i
        while (j > 0 && temp < year[j -1]) { // 判定一下temp如果小于前面的项
          year[j]  = year[j - 1] // 则把所有大于temp的项整体往后移动一位
          j--
        }
        year[j] = temp // 把temp放在往后移动0到多个项后的空缺位置
      }
      let timestr = String(timeList).split(',').join(';')+';'+String(year);
      self.ruleForm.executionTime = timestr;
      this._submitForm(formName,this,'/get/system/dbTask',this.ruleForm,'/SystemManage/DatabaseManage')
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
