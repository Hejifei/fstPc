<template>
  <div class="hello">
    <div class="listtitle" v-if="view === 'true'">查看在岗巡查</div>
    <div class="listtitle" v-if="view === undefined && ruleForm.taskId === undefined">新增在岗巡查</div>
    <div class="listtitle" v-if="view === undefined && ruleForm.taskId !== undefined">编辑在岗巡查</div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position='left' label-width="100px" class="demo-ruleForm newaddInfoC">
      <el-form-item label="任务名称" prop="makeName">
        <el-input v-model="ruleForm.makeName" :disabled='view === "true" ? true : false'></el-input>
      </el-form-item>
      <el-form-item label="任务描述" prop="makeDesc">
        <el-input type="textarea" v-model="ruleForm.makeDesc" :disabled='view === "true" ? true : false'></el-input>
      </el-form-item>
      <el-form-item label="任务类型" prop="makeType">
        <template>
          <el-radio v-model="ruleForm.makeType" label="1" value='1' :disabled='ruleForm.taskId === undefined ? false : true'>在岗巡查</el-radio>
          <el-radio v-model="ruleForm.makeType" label="2" value='2' :disabled='ruleForm.taskId === undefined ? false : true'>签到</el-radio>
        </template>
      </el-form-item>
      <el-form-item label="任务频次" prop="executionType">
        <template>
          <el-radio v-model="ruleForm.executionType" label="1" value='1' :disabled='view === "true" ? true : false'>每天</el-radio>
          <el-radio v-model="ruleForm.executionType" label="2" value='2' :disabled='view === "true" ? true : false'>一次</el-radio>
        </template>
      </el-form-item>
      <el-form-item label="任务执行时间" prop='executionTime'>
        <el-select v-model='timeobs.second' placeholder="秒" class="smallsel" :disabled='view === "true" ? true : false'>
          <el-option v-for="second in secondslist" :key="second.value" :label="second.value" :value="second.value"></el-option>
        </el-select>
        <el-select v-model='timeobs.minutes' placeholder="分" class="smallsel" :disabled='view === "true" ? true : false'>
          <el-option v-for="minute in minuteslist" :key="minute.value" :label="minute.value" :value="minute.value"></el-option>
        </el-select>
        <el-select v-model='timeobs.hour' placeholder="时" class="smallsel" :disabled='view === "true" ? true : false'>
          <el-option v-for="hour in hourlist" :key="hour.value" :label="hour.value" :value="hour.value"></el-option>
        </el-select>
        <el-select v-model='timeobs.day' placeholder="日" class="smallsel" :disabled='view === "true" ? true : false'>
          <el-option v-for="day in daylist" :key="day.value" :label="day.value" :value="day.value"></el-option>
        </el-select>
        <el-select v-model='timeobs.month' placeholder="月" class="smallsel" :disabled='view === "true" ? true : false'>
          <el-option v-for="month in monthlist" :key="month.value" :label="month.name" :value="month.value"></el-option>
        </el-select>
        <el-select v-model='timeobs.week' placeholder="周" class="smallsel" :disabled='view === "true" ? true : false'>
          <el-option v-for="week in weeklist" :key="week.value" :label="week.name" :value="week.value"></el-option>
        </el-select>
        <el-select
          v-model="timeobs.year"
          multiple
          collapse-tags
          class="smallsel"
          :disabled='view === "true" ? true : false'
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
      <!-- <el-form-item label="巡查周天" prop="checkWeekList">
        <div>
          <el-checkbox-group v-model="ruleForm.checkWeekList" class="specialcheckbox">
            <el-checkbox-button v-for="day in days" :label="day" :key="day"  :disabled='view === "true" ? true : false'>{{day}}</el-checkbox-button>
          </el-checkbox-group>
        </div>
      </el-form-item> -->
      <el-form-item label="巡查(签到)日期" prop="timerange">
        <el-date-picker
          v-model="ruleForm.makeStart_unform"
          type="date"
          :disabled='view === "true" ? true : false'
          placeholder="开始时间">
        </el-date-picker>
        ~
        <el-date-picker
          v-model="ruleForm.makeEnd_unform"
          type="date"
          :disabled='view === "true" ? true : false'
          placeholder="结束时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="巡查时间" prop="makeOptionEnd_unform" v-if="ruleForm.makeType === '2'">
        <el-time-picker
          v-model="ruleForm.makeOptionStart_unform"
          :picker-options="{
            selectableRange: '00:00:00 - 23:59:59'
          }"
          :disabled='view === "true" ? true : false'
          placeholder="巡查开始时间">
        </el-time-picker>
        ~
        <el-time-picker
          v-model="ruleForm.makeOptionEnd_unform"
          :picker-options="{
            selectableRange: '00:00:00 - 23:59:59'
          }"
          :disabled='view === "true" ? true : false'
          placeholder="巡查结束时间">
        </el-time-picker>    
      </el-form-item>
      <el-form-item label="巡查时间点" prop="makeOption_unform" v-if="ruleForm.makeType === '1'">
        <el-time-picker
          v-model="ruleForm.makeOption_unform"
          :picker-options="{
            selectableRange: '00:00:00 - 23:59:59'
          }"
          :disabled='view === "true" ? true : false'
          placeholder="巡岗时间点">
        </el-time-picker>
      </el-form-item>
      <el-form-item label="场景" prop="senId">
        <el-select v-model="ruleForm.senId" placeholder="请选择场景" @change="sendChange" :disabled='view === "true" ? true : false'>
          <el-option v-for="senseson in senseAll" :key="senseson.id" :label="senseson.name" :value="senseson.id">{{senseson.name}}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备" prop="diveodIdList">
        <el-checkbox-group v-model="ruleForm.diveodIdList" class="checkboxC">
          <p v-if="diveodList.length === 0">请先选择场景</p>
          <el-checkbox v-for="diveod in diveodList" :key="diveod.id" :label="diveod.id" :value='diveod.id'  :disabled='view === "true" ? true : false'>{{diveod.deviceName}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="人员分组">
        <el-select v-model="queryinfo.groupId" placeholder="选择分组" class="right15"  :disabled='view === "true" ? true : false'>
          <el-option v-for="group in grouplist" :key="group.id" :label="group.name" :value="group.id"></el-option>
        </el-select>
        <el-input v-model="queryinfo.personName" placeholder="输入人员名" class="right15"  :disabled='view === "true" ? true : false'></el-input>
        <el-button round @click="querylist"  :disabled='view === "true" ? true : false'>查询</el-button>
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
            :button-texts="['删除对象','添加到对象']"
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
        <el-button type="success" @click="submitForm('ruleForm')"  :disabled='view === "true" ? true : false'>保存</el-button>
        <router-link class="el-button" to="/IntelligentDoor/PatrolOndutyTask">取消</router-link>
      </el-form-item>
    </el-form>
    
  </div>
</template>

<script>
export default {
  data () {
    //验证时段不能为空
    const validateTimerange = (rule, value, callback) => {
        if (this.ruleForm.makeStart_unform === '' || this.ruleForm.makeEnd_unform === '') {
          callback(new Error('请选择巡查(签到)日期'));
        }else if(this.ruleForm.makeStartt_unform === '' && this.ruleForm.makeEnd_unform !== '' || this.ruleForm.makeStart_unform !== '' && this.ruleForm.makeEnd_unform === ''){
          callback(new Error('你必须同时选择开始和结束时间！'));
        }else if(this.ruleForm.makeStart_unform - this.ruleForm.makeEnd_unform >0){
          callback(new Error('开始时间不能晚于结束时间！'));
        } else {
          callback();
        }
    };
    const validateDayTimerange = (rule, value, callback) => {
        if (this.ruleForm.makeOptionStart_unform === '' || this.ruleForm.makeOptionStart_unform === '') {
          callback(new Error('请选择巡查时间'));
        }else if(this.ruleForm.makeOptionStart_unform - this.ruleForm.makeOptionEnd_unform >0){
          callback(new Error('巡查开始时间不能晚于结束时间！'));
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
      view:'',
      days:['星期一','星期二','星期三','星期四','星期五','星期六','星期日'],
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
      senseAll:[],
      grouplist:[],
      peoplelist:[],
      selectedList:[],
      diveodList:[],
      queryinfo:{
        groupId:'',
        personName:'',
      },
      ruleForm: {
          taskId:'',
          makeName: '',
          makeDesc: '',
          executionType:'1',
          makeType:'1',
          executionTime:'',
          checkWeekList:[],
          makeWeek:'',
          makeOptionStart:'',
          makeOptionStart_unform:'',
          makeOptionEnd:'',
          makeOptionEnd_unform:'',
          makeStart:'',
          makeStart_unform:'',
          makeEnd:'',
          makeEnd_unform:'',
          makeOption:'',
          makeOption_unform:'',
          senId:'',
          diveodId:'',
          diveodIdList:[],
          personList:[],
          personId:'',
      },
      rules: {
          makeName: [
            { required: true, message: '请输入任务名称', trigger: 'blur' },
            { max: 10, message: '名称不超过 10 个字符', trigger: 'blur' }
          ],
          makeDesc: [
            { max: 50, message: '长度不超过50 个字符', trigger: 'blur' }
          ],
          executionType:[
             { required: true, message: '请选择任务频次', trigger: 'change' }
          ],
          makeType:[
             { required: true, message: '请选择任务类型', trigger: 'change' }
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
          makeOptionEnd_unform:[
            {  required: true,validator: validateDayTimerange, trigger: 'blur' },
          ],
          makeOption_unform:[
            { required: true, message: '请选择巡岗时间点', trigger: 'change' }
          ],
          senId: [
            { required: true, message: '请选择场景', trigger: 'change' }
          ],
          diveodIdList:[
            { required: true, message: '请选择设备', trigger: 'change' }
          ],
          personList: [
            { required: true, message: '请添加巡查对象', trigger: 'change' },
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
    this.view = this.getUrl(location.href).view;
    // 场景选项获取
    self._ajax(self,'/get/door/getAll', {}, function (data) {
      self.senseAll = data.data;
      if(self.ruleForm.taskId !== undefined){
        self._ajax(self,'/get/door/checkMakeInfo', {'taskId':self.ruleForm.taskId}, function (data) {
          // self.grouplist = data.data;
          self.ruleForm.makeName = data.data.makeName;
          self.ruleForm.makeDesc = data.data.makeDesc;
          self.ruleForm.makeType = data.data.makeType;
          self.ruleForm.executionType = data.data.executionType;
          self.ruleForm.senId= String(data.data.sendId)
          self.sendChange()
          // self.ruleForm.checkWeekList=self.wekdaychangeRe(data.data.makeWeek.split(','));
          self.ruleForm.diveodIdList = data.data.devieList.map(val=>val.id);
          self.ruleForm.makeStart_unform = (new Date(data.data.makeStart));
          self.ruleForm.makeEnd_unform = (new Date(data.data.makeEnd));
          self.ruleForm.makeOptionStart_unform = (new Date(data.data.makeOptionStart));
          self.ruleForm.makeOptionEnd_unform = (new Date(data.data.makeOptionEnd));
          self.ruleForm.makeOption_unform = (new Date(data.data.makeOption));
          
          let peoplelist =[];
          let peoplesellist = [];
          for(let i in data.data.personList){
            peoplelist.push({
                key: data.data.personList[i].id,
                label: data.data.personList[i].name,
                gender: data.data.personList[i].gender,
                phone: data.data.personList[i].phone,
                disabled: self.view === 'true'
              })
            peoplesellist.push(data.data.personList[i].id);
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
    })
    // 人员分组选项
    self._ajax(self,'/get/notice/attendanceGroup', {}, function (data) {
      self.grouplist = data.data;
    })
    
  },
  methods: {
    submitForm(formName) {
      let self = this;
      self.ruleForm.executionTime = self.execution_timt2str(self.timeobs);
      // 人员的list转string
      this.ruleForm.personId = String(this.ruleForm.personList);
      this.ruleForm.diveodId = String(this.ruleForm.diveodIdList);
      // this.ruleForm.makeWeek = String(this.wekdaychange_t2n(this.ruleForm.checkWeekList));
      self.ruleForm.makeStart = self.formatTime(self.ruleForm.makeStart_unform,1);
      self.ruleForm.makeEnd = self.formatTime(self.ruleForm.makeEnd_unform,2);
      self.ruleForm.makeOptionStart = self.format_hms(self.ruleForm.makeOptionStart_unform);
      self.ruleForm.makeOptionEnd = self.format_hms(self.ruleForm.makeOptionEnd_unform);
      self.ruleForm.makeOption = self.format_hms(self.ruleForm.makeOption_unform);
      this._submitForm(formName,this,'/get/door/addPatrol',this.ruleForm,'/IntelligentDoor/PatrolOndutyTask');
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
    sendChange(){
      let self = this;
      self._ajax(self,'/get/door/getAlldevices', {'senseId':self.ruleForm.senId}, function (data) {
        self.diveodList = data.data;
      })
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
