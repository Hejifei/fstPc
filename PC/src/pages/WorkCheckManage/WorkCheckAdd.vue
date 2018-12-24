<template>
  <div class="hello">
    <div class="listtitle"> {{ruleForm.taskId === undefined ? '新增考勤任务' : '编辑考勤任务'}}</div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position='left' label-width="100px" class="demo-ruleForm newaddInfoC">
      <el-form-item label="任务名称" prop="checkName">
        <el-input v-model="ruleForm.checkName"></el-input>
      </el-form-item>
      <el-form-item label="任务描述" prop="checkDesc">
        <el-input type="textarea" v-model="ruleForm.checkDesc"></el-input>
      </el-form-item>
      <el-form-item label="任务频次" prop="executionType">
        <template>
          <el-radio v-model="ruleForm.executionType" label="1" value='1'>每天</el-radio>
          <el-radio v-model="ruleForm.executionType" label="2" value='2'>一次</el-radio>
        </template>
      </el-form-item>
      <el-form-item label="任务执行时间" prop='executionTime'>
        <el-select v-model='timeobs.second' placeholder="秒" class="smallsel">
          <el-option v-for="second in secondslist" :key="second.value" :label="second.value" :value="second.value"></el-option>
        </el-select>
        <el-select v-model='timeobs.minutes' placeholder="分" class="smallsel">
          <el-option v-for="minute in minuteslist" :key="minute.value" :label="minute.value" :value="minute.value"></el-option>
        </el-select>
        <el-select v-model='timeobs.hour' placeholder="时" class="smallsel">
          <el-option v-for="hour in hourlist" :key="hour.value" :label="hour.value" :value="hour.value"></el-option>
        </el-select>
        <el-select v-model='timeobs.day' placeholder="日" class="smallsel">
          <el-option v-for="day in daylist" :key="day.value" :label="day.value" :value="day.value"></el-option>
        </el-select>
        <el-select v-model='timeobs.month' placeholder="月" class="smallsel">
          <el-option v-for="month in monthlist" :key="month.value" :label="month.name" :value="month.value"></el-option>
        </el-select>
        <el-select v-model='timeobs.week' placeholder="周" class="smallsel">
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
      </el-form-item>
      <div class="grayline"></div>
      <!-- <el-form-item label="考勤周天" prop="checkWeekList">
        <div>
          <el-checkbox-group v-model="ruleForm.checkWeekList" class="specialcheckbox">
            <el-checkbox-button v-for="day in days" :label="day" :key="day" >{{day}}</el-checkbox-button>
          </el-checkbox-group>
        </div>
      </el-form-item> -->
      <el-form-item label="考勤日期" prop="timerange">
        <el-date-picker
          v-model="ruleForm.checkStart_unform"
          type="date"
          placeholder="开始时间">
        </el-date-picker>
        ~
        <el-date-picker
          v-model="ruleForm.checkEnd_unform"
          type="date"
          placeholder="结束时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="上班时间" prop="checkMoring_unform">
        <el-time-picker
          v-model="ruleForm.checkMoring_unform"
          :picker-options="{
            selectableRange: '00:00:00 - 23:59:59'
          }"
          placeholder="上班打卡时间">
        </el-time-picker>    
      </el-form-item>
      <el-form-item label="下班时间" prop="checkAfternoon_unform">
        <el-time-picker
          v-model="ruleForm.checkAfternoon_unform"
          :picker-options="{
            selectableRange: '00:00:00 - 23:59:59'
          }"
          placeholder="下班打卡时间">
        </el-time-picker>    
      </el-form-item>
      <div class="grayline"></div>
      <el-form-item label="人员分组">
        <el-select v-model="queryinfo.groupId" placeholder="选择分组" class="right15">
          <el-option v-for="group in grouplist" :key="group.id" :label="group.name" :value="group.id"></el-option>
        </el-select>
        <el-input v-model="queryinfo.personName" placeholder="输入人员名" class="right15"></el-input>
        <el-button round @click="querylist">查询</el-button>
      </el-form-item>
      <el-form-item label=" " prop="personList">
        <div class="addtransferC">
          <el-transfer
            style="text-align: left; display: inline-block"
            v-model="ruleForm.personList"
            filterable
            :left-default-checked="[]"
            :right-default-checked="[]"
            :titles="['未添加对象', '已添加对象']"
            :button-texts="['删除考勤对象','添加到考勤对象']"
            :format="{
              noChecked: '${total}',
              hasChecked: '${checked}/${total}'
            }"
            @change="handleChange"
            :data="peoplelist">
            <span slot-scope="{ option }">{{ option.label }} ({{ option.phone }})</span>
            <el-button class="transfer-footer" slot="left-footer" size="small">操作</el-button>
            <el-button class="transfer-footer" slot="right-footer" size="small">操作</el-button>
          </el-transfer>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="submitForm('ruleForm')">保存</el-button>
        <router-link class="el-button" to="/WorkCheckManage/WorkCheckTask">取消</router-link>
      </el-form-item>
    </el-form>
    
  </div>
</template>

<script>
export default {
  data () {
    //验证时段不能为空
    const validateTimerange = (rule, value, callback) => {
        if (this.ruleForm.checkStart_unform === '' || this.ruleForm.checkEnd_unform === '') {
          callback(new Error('请选择考勤日期'));
        }else if(this.ruleForm.checkStart_unform === '' && this.ruleForm.checkEnd_unform !== '' || this.ruleForm.checkStart_unform !== '' && this.ruleForm.checkEnd_unform === ''){
          callback(new Error('你必须同时选择开始和结束时间！'));
        }else if(this.ruleForm.checkStart_unform - this.ruleForm.checkEnd_unform >0){
          callback(new Error('开始时间不能晚于结束时间！'));
        } else {
          callback();
        }
    };
    const validateDayTimerange = (rule, value, callback) => {
        if(this.ruleForm.checkMoring_unform - this.ruleForm.checkAfternoon_unform >0){
          callback(new Error('上班时间不能晚于下班时间！'));
        } else {
          callback();
        }
    };
    //验证时段不能为空
    const validateTime = (rule, value, callback) => {
        if (this.timeobs.second === '' && this.timeobs.minutes === '' && this.timeobs.hour === ''
         && this.timeobs.day === ''
          && this.timeobs.month === ''
           && this.timeobs.week === ''
            && this.timeobs.year.length === 0) {
          callback(new Error('请选择任务执行时间'));
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
        data.push({value:i})
      }
      return data;
    }
    return {
      days:['星期一','星期二','星期三','星期四','星期五','星期六','星期日'],
      grouplist:[],
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
      peoplelist:[],
      selectedList:[],
      queryinfo:{
        groupId:'',
        personName:'',
      },
      ruleForm: {
          taskId:'',
          checkName: '',
          checkDesc:'',
          executionType:'1',
          executionTime:'',
          checkWeekList:[],
          checkWeek:'',
          checkStart: '',
          checkStart_unform:'',
          checkEnd:'',
          checkEnd_unform:'',
          checkMoring:'',
          checkMoring_unform:'',
          checkAfternoon:'',
          checkAfternoon_unform:'',
          personList:[],
          personId:'',
      },
      rules: {
          checkName: [
            { required: true, message: '请输入任务名称', trigger: 'blur' },
            { max: 10, message: '名称不超过 10 个字符', trigger: 'blur' }
          ],
          checkDesc: [
            // { required: true, message: '请填写任务描述', trigger: 'blur' },
            { max: 50, message: '长度不超过50 个字符', trigger: 'blur' }
          ],
          executionType:[
             { required: true, message: '请选择任务频次', trigger: 'change' }
          ],
          executionTime: [
            { required: true, message: '请填写任务执行时间', trigger: 'blur' },
            { validator: validateTime, trigger: 'blur' },
          ],
          checkWeekList: [
            // { required: true, message: '请选择周天', trigger: 'change' }
          ],
          timerange:[
            { required: true,validator: validateTimerange, trigger: 'blur' },
          ],
          checkMoring_unform: [
            { required: true, message: '请选择上班时间', trigger: 'change' }
          ],
          checkAfternoon_unform:[
            { required: true, message: '请选择下班时间', trigger: 'change' },
            {  required: true,validator: validateDayTimerange, trigger: 'blur' },
          ],
          personList: [
            { required: true, message: '请添加考勤对象', trigger: 'blur' },
          ],
        }
      }
  },
  created(){
    let self = this;
  },
  mounted () {  
    let self = this;
    this.ruleForm.taskId = this.getUrl(location.href).id;
    if(this.ruleForm.taskId !== undefined){
      self._ajax(self,'/get/notice/checkTaskInfo', {'taskId':this.ruleForm.taskId}, function (data) {
        // self.grouplist = data.data;
        self.ruleForm.checkName = data.data.checkName;
        self.ruleForm.checkDesc = data.data.checkDesc;
        self.ruleForm.executionType = data.data.executionType;
        // self.ruleForm.checkWeekList=self.wekdaychangeRe(data.data.checkWeek.split(','));
        self.ruleForm.checkStart_unform = (new Date(data.data.checkStart));
        self.ruleForm.checkEnd_unform = (new Date(data.data.checkEnd));
        self.ruleForm.checkMoring_unform = (new Date(data.data.checkMoring));
        self.ruleForm.checkAfternoon_unform = (new Date(data.data.checkAfternoon));
        
        let peoplelist =[];
        let peoplesellist = [];
        for(let i in data.data.personList){
          peoplelist.push({
              key: data.data.personList[i].id,
              label: data.data.personList[i].name,
              gender: data.data.personList[i].gender,
              phone: data.data.personList[i].phone,
            })
          peoplesellist.push(data.data.personList[i].id)
        }
        self.selectedList = peoplelist;
        self.peoplelist = peoplelist;
        self.ruleForm.personList = peoplesellist;

        // 任务执行时间赋值
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
    }
    self._ajax(self,'/get/notice/attendanceGroup', {}, function (data) {
      self.grouplist = data.data;
    })
  },
  methods: {
    submitForm(formName) {
      let self = this;
      // 任务时间数据拼接
      self.ruleForm.executionTime = self.execution_timt2str(self.timeobs);
      // 人员的list转string
      this.ruleForm.personId = String(this.ruleForm.personList);

      // this.ruleForm.checkWeek = String(this.wekdaychange_t2n((this.ruleForm.checkWeekList)));
      self.ruleForm.checkStart = self.formatTime(self.ruleForm.checkStart_unform,1);
      self.ruleForm.checkEnd = self.formatTime(self.ruleForm.checkEnd_unform,2);
      self.ruleForm.checkMoring = self.format_hms(self.ruleForm.checkMoring_unform);
      self.ruleForm.checkAfternoon = self.format_hms(self.ruleForm.checkAfternoon_unform)
      this._submitForm(formName,this,'/get/notice/addAttendance',this.ruleForm,'/WorkCheckManage/WorkCheckTask')
    },
    handleChange(value, direction, movedKeys) {
      for(let i in movedKeys){
        let newadd = this.peoplelist.filter(obj => obj.key === movedKeys[i]);
        if(newadd.length > 0 &&  direction === 'right'){
          this.selectedList.push(newadd[0])
        }else if( direction === 'left'){
          this.selectedList.splice(this.selectedList.findIndex(item => item.key === movedKeys[i]),1);
        }
      }
    },
    querylist(){
      let self = this;
      self._ajax(self,'/get/notice/group', self.queryinfo, function (data) {
        let peoplelist =[];
        for(let i in data.data){
          if(self.selectedList.findIndex(item => item.key === data.data[i].id) !== -1){
          }else{
            peoplelist.push({
              key: data.data[i].id,
              label: data.data[i].name,
              gender: data.data[i].gender,
              phone: data.data[i].phone,
            })
          }
        }
        self.peoplelist = peoplelist.concat(self.selectedList);
      })
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
