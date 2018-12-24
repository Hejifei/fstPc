<template>
  <div class="hello">
    <div class="listtitle">节假日管理</div>
    <el-form :model="ruleForm"  ref="ruleForm" label-position='left' label-width="100px" class="demo-ruleForm newaddInfoC">
      <el-form-item label="节假日" prop="name">
        <div id="calendar"></div>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="submitForm('ruleForm')" style="margin-left:250px;">保存</el-button>
        <!-- <router-link class="el-button" to="/home">取消</router-link> -->
      </el-form-item>
    </el-form>
    
  </div>
</template>

<script>
export default {
  data () {
    return {
      ruleForm: {
        year: '2018',
        month:'07',
        strKeyword:'',
        dayslist:[],
      },
      querydata:{
        year: '',
        month: '',
      }
    }
  },
  created(){
    let self = this;
  },
  mounted () {  
    let today = new Date();
    this.querydata.year = today.getFullYear();
    this.querydata.month = this.size2(today.getMonth() + 1);
    this.querylist(new Date());
  },
  methods: {
    querylist(newday){
      let self = this;
      this.ruleForm.year = newday.getFullYear();
      this.ruleForm.month = this.size2(newday.getMonth() + 1);
      self._ajax(self,'/get/system/getHoliday', self.querydata, function (data) {
        // let data = {data:['2018-07-01','2018-07-02','2018-07-03',]}
        self.ruleForm.dayslist = data.data;
        let restdaysarr = [];
        if(data.data.length !== 0){
          restdaysarr = data.data.reduce((sum,val)=>{
            sum['D'+Number(val.substring(8))]=0;
            return sum;
          },{})
        }

        self.createcal({
          date: newday,
          width: 568,
          height: 400,
          rate: 0.69,
          week: true, // 是否开启单双休
          week_walue: "2018/7/21", // 双休对应的周六
          isclick: true,
          configDay: {}, // 系统配置
          calRest:self.calRest,//右击选择休息
          calSelect:self.calSelect,//顶部选择日期
          calnoRest:self.calnoRest,//右击取消休息
          datelist:restdaysarr//0休息 1加班 {'D30':'0'}
        });
      })
    },
    submitForm(formName) {
      this.ruleForm.strKeyword = String(this.ruleForm.dayslist);
      // console.log(this.ruleForm)
      // this.ruleForm.strKeyword ='';
      // this.ruleForm.dayslist = [];
      //  console.log(this.ruleForm)
      this._submitForm(formName,this,'/get/system/addHoliday',this.ruleForm,'/SystemManage/Holidays')
    },
    calRest(date){
      // 选择休息
      let self = this;
      self.ruleForm.dayslist.push(date)
    },
    calnoRest(date){
      // 取消休息
      let self = this;
      // console.log(date)
      // console.log(self.ruleForm.dayslist)
      // console.log(self.ruleForm.dayslist.indexOf(date))
      if(self.ruleForm.dayslist.indexOf(date) !== -1){
        (self.ruleForm.dayslist).splice((self.ruleForm.dayslist).findIndex(item => item === date), 1)
      }
      // console.log(self.ruleForm.dayslist)
    },
    calSelect(options){
      let day = options.date
      this.querydata.year = day.getFullYear();
      this.querydata.month = this.size2(day.getMonth() + 1);
      this.querylist(day);
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* @import '../../assets/css/calendar.css'; */
</style>
