<template>
  <div class="hello">
    <div class="listtitle" v-if="view === 'true'">查看通知任务</div>
    <div class="listtitle" v-if="view === undefined && ruleForm.taskId === undefined">新增通知任务</div>
    <div class="listtitle" v-if="view === undefined && ruleForm.taskId !== undefined">编辑通知任务</div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position='left' label-width="100px" class="demo-ruleForm newaddInfoC">
      <el-form-item label="任务名称" prop="noticeName">
        <el-input v-model="ruleForm.noticeName" :disabled='view === "true" ? true : false'></el-input>
      </el-form-item>
      <el-form-item label="任务描述" prop="noticeDesc">
        <el-input type="textarea" v-model="ruleForm.noticeDesc" :disabled='view === "true" ? true : false'></el-input>
      </el-form-item>
      <el-form-item label="通知类型" prop="noticType">
        <template >
          <el-radio v-model="ruleForm.noticType" label="1" value='1' :disabled='ruleForm.taskId === undefined ? false : true'>普通通知</el-radio>
          <el-radio v-model="ruleForm.noticType" label="2" value='2' :disabled='ruleForm.taskId === undefined ? false : true'>定时通知</el-radio>
        </template>
      </el-form-item>
      <el-form-item label="任务执行时间" prop='executionTime' v-if="ruleForm.noticType === '2'">
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
      <el-form-item label="通知日期" prop="timerange">
        <el-date-picker
          v-model="ruleForm.noticeStart_unform"
          type="date"
          :picker-options="pickerOptions0"
          :disabled='view === "true" ? true : false'
          placeholder="开始时间">
        </el-date-picker>
        ~
        <el-date-picker
          v-model="ruleForm.noticEnd_unform"
          type="date"
          :picker-options="pickerOptions0"
          :disabled='view === "true" ? true : false'
          placeholder="结束时间">
        </el-date-picker>
      </el-form-item>
      
      <el-form-item label="场景" prop="noticSensid">
        <el-select v-model="ruleForm.noticSensid" placeholder="请选择场景" :disabled='view === "true" ? true : false'>
          <el-option v-for="senseson in senseAll" :key="senseson.id" :label="senseson.name" :value="senseson.id">{{senseson.name}}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="人员分组">
        <el-select v-model="queryinfo.groupId" placeholder="选择分组" class="right15" :disabled='view === "true" ? true : false'>
          <el-option v-for="group in grouplist" :key="group.id" :label="group.name" :value="group.id"></el-option>
        </el-select>
        <el-input v-model="queryinfo.personName" placeholder="输入人员名" class="right15" :disabled='view === "true" ? true : false'></el-input>
        <el-button round @click="querylist" :disabled='view === "true" ? true : false'>查询</el-button>
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
            :button-texts="['删除对象','添加对象']"
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
      <el-form-item label="通知内容" prop="noticText">
        <el-input type="textarea" v-model="ruleForm.noticText"  :disabled='view === "true" ? true : false'></el-input>
      </el-form-item>
      <el-form-item label="显示照片" prop="noticPicture">
        <el-upload
          class="avatar-uploader"
          :action='imgaction'
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :disabled='view === "true" ? true : false'
          :before-upload="beforeAvatarUpload">
          <img v-if="ruleForm.noticPicture" :src="APIURL+'/'+ruleForm.noticPicture" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="音频文件" prop="noticVido">
        <el-upload
          class="upload-demo"
           v-if="view !== 'true'"
          :action="videoupload"
          :before-remove="beforeRemove"
          multiple
          :before-upload="beforevideoUpload"
          :limit="1"
          :on-exceed="handleExceed"
          :on-success='handlevideoSuccess'
          :file-list="fileList">
          <el-button size="small" type="primary" v-if="view !== 'true'">点击上传</el-button>
          <div slot="tip" class="el-upload__tip" v-if="view !== 'true'">只能上传音乐</div>
        </el-upload>
        <ul class="el-upload-list el-upload-list--text" v-if="view === 'true'">
          <li tabindex="0" class="el-upload-list__item is-success" v-for="(file,index) in fileList" :key="index">
            <a class="el-upload-list__item-name" v-if="file.url !== undefined" :href="APIURL+'/'+file.url" target="_black">
              <i class="el-icon-document"></i>{{file.name}}
            </a>
            <a class="el-upload-list__item-name" v-if="file.url === undefined" :href="APIURL+'/'+file.name" target="_black">
              <i class="el-icon-document"></i>{{file.name}}
            </a>
          </li>
        </ul>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="submitForm('ruleForm')" :disabled='view === "true" ? true : false'>保存</el-button>
        <router-link class="el-button" to="/noticeManage/NoticeTask">取消</router-link>
      </el-form-item>
    </el-form>
    
  </div>
</template>

<script>
export default {
  data () {
    //验证时段不能为空
    const validateTimerange = (rule, value, callback) => {
        if (this.ruleForm.noticeStart_unform === '' || this.ruleForm.noticEnd_unform === '') {
          callback(new Error('请选择通知日期'));
        }else if(this.ruleForm.noticeStart_unform === '' && this.ruleForm.noticEnd_unform !== '' || this.ruleForm.noticeStart_unform !== '' && this.ruleForm.noticEnd_unform === ''){
          callback(new Error('你必须同时选择开始和结束时间！'));
        }else if(this.ruleForm.noticeStart_unform - this.ruleForm.noticEnd_unform >0){
          callback(new Error('开始时间不能晚于结束时间！'));
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
    const validateimgOrdesc = (rule, value, callback) => {
        if (this.ruleForm.noticText !== '' || this.ruleForm.noticPicture !== '' ) {
          callback();
        } else {
          callback(new Error('请输入通知内容或上传显示图片'));
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
      queryinfo:{
        groupId:'',
        personName:'',
      },
      peoplelist:[],
      selectedList:[],
      senseAll:[],
      grouplist:[],
      pickerOptions0: {//限制时间选项为当前时间往后
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
      },


      value6: '',
      
      imgaction:this.APIURL+'/get/common/picture/upload',
      videoupload:this.APIURL+'/get/common/video/upload',
      
      videofilename:'',
      focusState:false,
      dialogImageUrl: '',
      dialogVisible: false,
      fileList:[],
      ruleForm: {
          taskId:'',
          noticeName:'',
          noticeDesc: '',
          noticType:'1',
          executionTime:'',
          noticeStart: '',
          noticeStart_unform:'',
          noticEnd:'',
          noticEnd_unform:'',
          noticSensid:'',
          personList:[],
          personId:'',
          noticText:'',
          noticPicture:'',
          noticVido:'',
      },
      rules: {
          noticeName: [
            { required: true, message: '请输入任务名称', trigger: 'blur' },
            { max: 10, message: '名称长度不超过 10 个字符', trigger: 'blur' }
          ],
          noticeDesc: [
            { max: 50, message: '长度不超过50 个字符', trigger: 'blur' }
          ],
          noticType: [
            { required: true, message: '请选择通知类型', trigger: 'change' }
          ],
          executionTime: [
            { required: true, message: '请填写任务执行时间', trigger: 'blur' },
            { validator: validateTime, trigger: 'blur' },
          ],
          timerange:[
            { required: true,validator: validateTimerange, trigger: 'blur' }
          ],
          noticSensid: [
            { required: true, message: '请选择场景', trigger: 'change' }
          ],
          personList: [
            { required: true, message: '请添加通知对象', trigger: 'change' },
          ],
          
          noticText: [
            // { required: true, message: '请输入通知内容', trigger: 'blur' },
            { max: 50, message: '长度不超过50 个字符', trigger: 'blur' }
          ],
          noticPicture:[
            { validator: validateimgOrdesc, trigger: 'change' }
            // { required: true, message: '请上传图片', trigger: 'blur' },
          ],
          video: [
            { required: true, message: '请选择音频文件', trigger: 'change' }
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
        self._ajax(self,'/get/notice/checkNoticeInfo', {'taskId':self.ruleForm.taskId}, function (data) {
          self.ruleForm.noticeName = data.data.noticeName;
          self.ruleForm.noticeDesc = data.data.noticeDesc;
          self.ruleForm.noticType = data.data.noticType;
          self.ruleForm.noticeStart_unform = new Date(data.data.noticeStart);
          self.ruleForm.noticEnd_unform = new Date(data.data.noticEnd);
          self.ruleForm.noticSensid = String(data.data.sensId);
          self.ruleForm.noticText = data.data.noticText;
          self.ruleForm.noticPicture = data.data.noticPicture;
          self.ruleForm.noticVido = data.data.noticVido;
          if(data.data.noticVido !== ''){
            let videolist = data.data.noticVido.split(';');
            self.fileList = [{'name':videolist[0],'url':videolist[1]}]
            // 点击歌曲名实现下载
            $('.upload-demo .el-upload-list').delegate('li a','click',function(){
              $(this).attr('download',videolist[0]);
              window.open(self.APIURL+'/'+videolist[1])
            })
          }
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
            peoplesellist.push(data.data.personList[i].id)
          }
          self.selectedList = peoplelist;
          self.peoplelist = peoplelist;
          self.ruleForm.personList = peoplesellist;
          

          if(self.ruleForm.noticType === '2'){
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
      // 任务时间数据拼接
      self.ruleForm.executionTime = self.execution_timt2str(self.timeobs);
      // 通知日期时间格式处理
      self.ruleForm.noticeStart = self.formatTime(self.ruleForm.noticeStart_unform,1);
      self.ruleForm.noticEnd = self.formatTime(self.ruleForm.noticEnd_unform,2);
      // 人员的list转string
      this.ruleForm.personId = String(this.ruleForm.personList);
      this._submitForm(formName,this,'/get/notice/addNoticeTask',this.ruleForm,'/noticeManage/NoticeTask')
    },
    handleAvatarSuccess(res, file) {
      this.ruleForm.noticPicture = res.data;
    },
    beforeAvatarUpload(file) {
      const isJPG =  (file.type).indexOf('image') !== '-1'
        || (file.type).indexOf('psg') !== '-1'
        || (file.type).indexOf('bmp') !== '-1'
        || (file.type).indexOf('gif') !== '-1'
        || (file.type).indexOf('tiff') !== '-1';
      const isLt5M = file.size / 1024 / 1024 < 5;

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG，GIF，PSD，BMP，PNG，TIFF 格式!');
      }
      if (!isLt5M) {
        this.$message.error('上传头像图片大小不能超过 5MB!');
      }
      return isJPG && isLt5M;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
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
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    beforevideoUpload(file) {
      const isMP3 = (file.type).indexOf('mp3') !== '-1' || (file.type).indexOf('wma') !== '-1';
      const isLt10M = file.size / 1024 / 1024 < 10;

      if (!isMP3) {
        this.$message.error('上传头像图片只能是 MP3,WMA 格式!');
      }
      if (!isLt10M) {
        this.$message.error('上传头像图片大小不能超过 10MB!');
      }
      return isMP3 && isLt10M;
    },
    handlevideoSuccess(res, file) {
      this.ruleForm.noticVido = res.data;
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
