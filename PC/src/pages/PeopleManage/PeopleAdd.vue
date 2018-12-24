<template>
  <div class="hello">
    <div class="listtitle">{{pagetitle}}</div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position='left' label-width="100px" class="demo-ruleForm newaddInfoC">
      <el-form-item label="头像" prop="photo">
        <el-upload
          class="avatar-uploader"
          :action='imgaction'
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="ruleForm.photo" :src="imgurl+'/'+ruleForm.photo" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <p>(展示于设备前端)</p>
      </el-form-item>
      <el-form-item label="识别图片" prop="images">
        <el-upload
          
          class="avatars-uploader"
          :action="imgaction"
          list-type="picture-card"
          :limit='5'
          :file-list='fileList'
          :on-success='imageChange'
          :on-remove="handleRemove"
          :on-preview="handlePictureCardPreview">
          
          <i class="el-icon-plus" ></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible" v-if="ruleForm.images.length < 5">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
        <p>（请上传1~5张人脸特征识别图片，建议选取清晰的正脸、左侧脸、右侧脸、低头、抬头）</p>
        <el-button type="primary" @click="imgselshow = !imgselshow">头像选择</el-button>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="身份证" prop="idCard">
        <el-input v-model="ruleForm.idCard"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-select v-model="ruleForm.gender" placeholder="请选择性别">
          <el-option label="男" value="1"></el-option>
          <el-option label="女" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="ruleForm.phone"></el-input>
      </el-form-item>
      <el-form-item label="宿舍房间号" prop="address">
        <el-input v-model="ruleForm.address"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="personType">
        <el-select v-model="ruleForm.personType" placeholder="请选择类型" >
          <el-option v-for="(typeson,index) in typelist" :key="index" :label="typeson.desc" :value="typeson.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分组" prop="groupIds">
        <el-select v-model="ruleForm.groupIds" placeholder="请选择分组">
          <el-option v-for="(groupson,index) in grouplist" :key='index' :label="groupson.name" :value="groupson.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学号" prop="studentNumber">
        <el-input v-model="ruleForm.studentNumber"></el-input>
      </el-form-item>
      <el-form-item label="辅导员" prop="teacherId">
        <el-select v-model="ruleForm.teacherId" placeholder="请选择辅导员">
          <el-option v-for="(teacher,index) in teacherlist" :key="index" :label="teacher.name" :value="teacher.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="场景" prop="scene">
        <el-select v-model="ruleForm.scene" placeholder="请选择场景" @change="sceneChange">
          <el-option v-for="(scene,index) in scenelist" :key="index" :label="scene.name" :value="scene.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备" prop="equipment">
        <el-select v-model="ruleForm.equipment" placeholder="请选择设备"  @change="equipmentChange">
          <el-option v-for="(equipment,index) in euipmentlist" :key="index" :label="equipment.name" :value="equipment.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item  prop='faceDbIds'>
        <div class="addtransferC">
          <el-transfer
            style="text-align: left; display: inline-block"
            v-model="ruleForm.faceDbIds"
            filterable
            :left-default-checked="[]"
            :right-default-checked="[]"
            :titles="['人员下发库', '已添加的库']"
            :button-texts="['删除下发库','添加到下发库']"
            :format="{
              noChecked: '${total}',
              hasChecked: '${checked}/${total}'
            }"
            @change="handleChange"
            :data="librarylist">
            <el-button class="transfer-footer" slot="left-footer" size="small">操作</el-button>
            <el-button class="transfer-footer" slot="right-footer" size="small">操作</el-button>
          </el-transfer>
        </div>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="ruleForm.remark"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="submitForm('ruleForm')">保存</el-button>
        <router-link class="el-button" to="/PeopleManage/PeopleRegistered">取消</router-link>
      </el-form-item>
      <transition name="fade">
        <div v-if="imgselshow" class="imgSelC">
          <div class="imgSel">
            <span class="close"  @click="imgselshow = !imgselshow">x</span>
            <h3 class="imgsel_title">图片选择</h3>
            <div class="imgsel_body">
              <template>
                <!-- <el-radio v-model="radio" label="1">本地上传
                  <el-button type="info" @click="localfileSel">选择文件</el-button>
                </el-radio> -->
                <div label="2">
                  <el-form-item label="场景">
                    <el-select class="aa" v-model="queryPicture.senseId" placeholder="请选择场景" @change="imgsel_sceneChange">
                      <el-option label="请选择场景" value=""></el-option>
                      <el-option v-for="(scene,index) in scenelist" :key="index" :label="scene.name" :value="scene.id"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="设备">
                    <el-select v-model="queryPicture.deviceId"  placeholder="请选择设备"  @change="imgsel_equipmentChange" >
                      <el-option label="请选择设备" value=""></el-option>
                      <el-option v-for="(equipment,index) in imgquery_euipmentlist" :key="index" :label="equipment.name" :value="equipment.id"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="相机">
                    <el-select v-model="queryPicture.cameraId"  placeholder="请选择相机" @change="Picturequery">
                      <el-option label="请选择相机" value=""></el-option>
                      <el-option v-for="(equipment,index) in imgquery_devicelist" :key="index" :label="equipment.name" :value="equipment.id"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </template>
              <div class="imgC">
                <div class="imgbox" v-for="(Picture,index) in queryPictureList" :key="index" :class="{imgboxsel :  ruleForm.images.indexOf(Picture) !== -1}"   @click="headimgsel(Picture,$event)">
                  <img :src="APIURL+'/'+Picture"/>
                </div>
                <div class="noimgtext" v-if="queryPictureList.length === 0">暂无图片</div>
              </div>
              <div class="imgpageC">
                <el-pagination
                  background
                  layout="prev, pager, next"
                  :current-page.sync="queryPicture.pageIndex"
                  :page-size="queryPicture.pageSize"
                  :total="queryPicture.pagetotal"
                  @current-change="handleCurrentChange">
                </el-pagination>
              </div>
              
              <div class="saveC">
                <el-button type="info" @click="imgselshow = !imgselshow">保存</el-button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    let self = this;
    const validateidcard = (rule, value, callback)=>{
      var pId = this.ruleForm.idCard;
      var reg =/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if(reg.test(pId)){
        callback();
      }else{
        callback(new Error('身份证号格式错误！'));
      }    
    }
    
    const validateidcardrepeat = (rule, value, callback)=>{
      if(this.ruleForm.id === undefined || this.getUrl(location.href).unregest === '1' ){
        self._ajax(self,'/person/checkByCard', {card:value,id:this.ruleForm.id}, function (data) {
          if(data.data === true){
            callback();
          }else{
            callback(new Error('身份证号已存在！'));
          }
        })
      }else{
        callback();
      }
    }
    const validatephone = (rule, value, callback)=>{
      var reg = /^[1][0-9]{10}$/;
      if (!reg.test(this.ruleForm.phone)) {
        callback(new Error('请输入正确的手机号'));
      }else {
        callback();
      }
    }
    const validatephonerepeat = (rule, value, callback)=>{
      if(this.ruleForm.id === undefined){
        self._ajax(self,'/person/checkByPhone', {phone:value,id:this.ruleForm.id}, function (data) {
          if(data.data === true){
            callback();
          }else{
            callback(new Error('手机号已存在！'));
          }
        })
      }else{
        callback();
      }
      
    }
    const validateimagelist = (rule, value, callback)=>{
      let imglength = this.ruleForm.images.length + this.ruleForm.imgIds.length;
      // if (imglength === 0) {
      //   callback();
      // }else 
      if(imglength < 1){
        callback(new Error('请上传图片'));
      }else if(imglength >= 1){
        callback();
      }
    }
    return {
      pagetitle:'新增人员',
      fileList:[],
      imgselshow:false,
      unregest:'',
      imgurl:this.APIURL,
      imgaction:this.APIURL+'/person/image/upload',
      dialogImageUrl: '',
      dialogVisible: false,
      typelist:[],
      grouplist:[],
      teacherlist:[],
      scenelist:[],
      euipmentlist:[],
      librarylist:[],
      selectedList:[],
      ruleForm: {
          id:'',
          photo:'',
          images:[],
          imgIds:[],
          name: '',
          gender: '',
          idCard:'',
          phone: '',
          address:'',
          personType:'',
          faceDbIds:[],
          groupIds:'',
          studentNumber:'',
          teacherId:'',
          scene:'',
          equipment:'',
          remark: ''
      },
      rules: {
          photo:[
            { required: true, message: '请上传图片', trigger: 'blur' },
          ],
          images:[
            { validator: validateimagelist, trigger: 'blur' },
            // { required: true, message: '请上传图片', trigger: 'blur' },
            // { min: 1, max: 5, message: '请上传1~5张图片', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur' },
            { max: 20, message: '名称不超过 20 个字符', trigger: 'blur' }
          ],
          gender: [
            { required: true, message: '请选择性别', trigger: 'change' }
          ],
          idCard: [
            { required: true, message: '请输入身份证', trigger: 'blur' },
            { validator: validateidcard, trigger: 'blur' },
            { validator: validateidcardrepeat, trigger: 'blur' },
          ],
          phone: [
            { required: true, message: '请输入手机号码', trigger: 'blur' },
            { validator: validatephone, trigger: 'blur' },
            { validator: validatephonerepeat, trigger: 'blur' },
          ],
          address: [
            { required: true, message: '请输入宿舍房间号', trigger: 'blur' },
          ],
          personType: [
            { required: true, message: '请选择类型', trigger: 'change' }
          ],
          groupIds: [
            { required: true, message: '请选择分组', trigger: 'change' }
          ],
          studentNumber: [
            { required: true, message: '请输入学号', trigger: 'blur' },
          ],
          teacherId: [
            // { required: true, message: '请选择辅导员', trigger: 'change' }
          ],
          scene: [
            // { required: true, message: '请选择场景', trigger: 'change' }
          ],
          equipment: [
            // { required: true, message: '请选择设备', trigger: 'change' }
          ],
          // faceDbIds:[
          //   { vrequired: true, message: '请添加下发库',trigger: 'change' }
          // ],
          // remark: [
          //   { required: true, message: '请填写活动形式', trigger: 'blur' }
          // ],
          
      },
      radio:'',
      val1:'',
      imgquery_euipmentlist:[],
      imgquery_devicelist:[],
      queryPicture:{
        senseId:'',
        deviceId:'',
        cameraId:'',
        pageIndex: 1,
        pageSize:50,
        pagetotal:500
      },
      queryPictureList:[],
    }
  },
  created(){
    let self = this;
  },
  mounted () {  
    let self = this;
    // 人员类型
    self._ajax(self,'/person/type/all', {}, function (data) {
      self.typelist = data.data;
    })
    // 人员分组
    self._ajax(self,'/group/all', {}, function (data) {
      self.grouplist = data.data;
    })
    // 辅导员列表
    self._ajax(self,'/person/teacher/all', {}, function (data) {
      self.teacherlist = data.data;
    })
    //场景列表
    self._ajax(self,'/sense/all', {}, function (data) {
      self.scenelist = data.data;
    })
    this.ruleForm.id = this.getUrl(location.href).id;

    this.unregest = this.getUrl(location.href).unregest;
    let personIds=[];
    if(this.ruleForm.id === undefined){
      // 新增
    }else if(this.unregest === '1'){
      self.pagetitle = '未登记人员管理'
      // 未登记人员信息
      self._ajax(self,'/urperson/view', {id:this.ruleForm.id}, function (data) {
        self.fileList=[{'url':self.imgurl+'/'+data.data.image}]
        self.ruleForm.images=[data.data.image]
        // console.log(self.ruleForm.images)
        // let imglist = [];
        // self.fileList=data.data.images.map((val)=>{
        //   imglist.push(val.id)
        //     return {
        //       id:val.id,
        //       name:val.id,
        //       url:self.imgurl+'/'+val.image
        //     }
        // })
        // self.ruleForm.imgIds = imglist;
      })
    }else{
      self.pagetitle = '查看人员'
      self._ajax(self,'/person/view', {id:this.ruleForm.id}, function (data) {
        self.ruleForm.photo  = data.data.photo;
        self.ruleForm.name = data.data.name;
        self.ruleForm.gender = data.data.gender;
        self.ruleForm.idCard = data.data.idCard;
        self.ruleForm.phone = data.data.phone;
        self.ruleForm.address = data.data.address;
        self.ruleForm.personType = data.data.personType;
        self.ruleForm.faceDbIds = data.data.faceDbIds;
        self.ruleForm.groupIds = data.data.groupIds[0];
        self.ruleForm.studentNumber = data.data.studentNumber;
        self.ruleForm.teacherId = data.data.teacherId;
        self.ruleForm.scene = data.data.scene;
        self.ruleForm.equipment = data.data.equipment;
        self.ruleForm.remark = data.data.remark;

        let imglist = [];
        self.fileList=data.data.images.map((val)=>{
          imglist.push(val.id)
            return {
              id:val.id,
              name:val.id,
              url:self.imgurl+'/'+val.image
            }
        })
        self.ruleForm.imgIds = imglist;

        let librarylist =[];
        let faceDbIds = [];
        for(let i in data.data.faceDbs){
          librarylist.push({
            key: data.data.faceDbs[i].id,
            label: data.data.faceDbs[i].name,
          })
          faceDbIds.push(data.data.faceDbs[i].id)
        }
        self.selectedList = librarylist;
        self.librarylist = librarylist;
        self.ruleForm.faceDbIds = faceDbIds;
      })
    }

    self.Picturequery();
  },
  methods: {
    submitForm(formName) {
      if(this.ruleForm.id === undefined){
        //增
        this._submitForm(formName,this,'/person/add',this.ruleForm,'/PeopleManage/PeopleRegistered')
      }else if(this.unregest !== undefined){
        //未登记人员登记
        this._submitForm(formName,this,'/urperson/add',this.ruleForm,'/PeopleManage/PeopleRegistered')
      }else{
        //改
        this._submitForm(formName,this,'/person/edit',this.ruleForm,'/PeopleManage/PeopleRegistered')
      }
    },
    handleChange(value, direction, movedKeys) {
      // 下发库添加方法
      // this.ruleForm.faceDbIds = value;
      for(let i in movedKeys){
        let newadd = this.librarylist.filter(obj => obj.key === movedKeys[i]);
        if(newadd.length > 0 &&  direction === 'right'){
          this.selectedList.push(newadd[0])
        }else if( direction === 'left'){
          this.selectedList.splice(this.selectedList.findIndex(item => item.key === movedKeys[i]),1);
        }
      }
    },
    handleAvatarSuccess(res, file) {
      // 头像上传成功方法
      this.ruleForm.photo = res.data;
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
    imageChange(response, file, fileList){
      // console.log(111)
      let self = this;
      
      let imgObj = {};
      if(fileList.length >0){
        let imglist =[];
        let idlist=[];
        if(this.unregest === '1'){
          // 未登记人员信息
          for(let i = 0;i<fileList.length;i++){
            if(fileList[i].response){
              imglist.push(fileList[i].response.data);
            }else{
              imglist.push((fileList[i].url).replace(self.imgurl+'/',''))
            }
          }
        }else{
          // 新增或编辑人员信息
          for(let i = 0;i<fileList.length;i++){
            if(fileList[i].response){
              imglist.push(fileList[i].response.data);
            }else{
              idlist.push(fileList[i].name)
            }
          }
        }
        
        self.ruleForm.images=imglist;
        self.ruleForm.imgIds=idlist;
      }
      this.fileList = fileList;
    },
    sceneChange(){
      // 根据场景获取设备
      let self= this;
      self._ajax(self,'/device/monitor/getBySenseId', {senseId:self.ruleForm.scene}, function (data) {
        self.euipmentlist = data.data;
        self.ruleForm.equipment = '';
      })
    },
    equipmentChange(){
      // 根据设备获取人员下发库
      let self= this;
      self._ajax(self,'/device/facedb/getByDeviceId', {deviceId:self.ruleForm.equipment}, function (data) {
        let librarylist =[];
        for(let i in data.data){
          if(self.selectedList.findIndex(item => item.key === data.data[i].id) !== -1){
          }else{
            librarylist.push({
              key: data.data[i].id,
              label: data.data[i].name,
            })
          }
        }
        self.librarylist = librarylist.concat(self.selectedList);
      })
    },
    picturesSel(){
      // 点击选择在线图片
    },
    localfileSel(){
      // 选择本地文件上传
      $('.avatars-uploader .el-upload .el-upload__input').click();
    },
    // imglistSel(){
    //   let self = this;
    //   self.imgselshow = !self.imgselshow;
      
    // },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.Picturequery();
    },
    Picturequery(){
      let self = this;
      // 搜索图片
      self._ajax(self,'/person/snapshot', self.queryPicture , function (data) {
        // let piclist = [];
        // if(data.data.length > 100){
        //   for(let i = 0;i<100;i++){
        //     piclist.push(data.data[i])
        //   }
        // }else{
        //   piclist = data.data;
        // }
        
        self.queryPictureList = data.data.list;
        self.queryPicture.pageSize = data.data.pageSize;
        self.queryPicture.pageIndex = data.data.pageNum;
        self.queryPicture.pagetotal = data.data.total;
      })
    },
    imgsel_sceneChange(){
      // 根据场景获取设备
      let self= this;
      self._ajax(self,'/device/monitor/getBySenseId', {senseId:self.queryPicture.senseId}, function (data) {
        self.imgquery_euipmentlist = data.data;
        self.queryPicture.deviceId = '';
        self.queryPicture.cameraId = '';
      })
    },
    imgsel_equipmentChange(){
      // 根据设备获取人员下发库
      let self= this;
      self._ajax(self,'/device/camera/getByDeviceId', {deviceId:self.queryPicture.deviceId}, function (data) {
        self.imgquery_devicelist = data.data;
        self.queryPicture.cameraId = '';
      })
    },
    headimgsel(imgsrc,event){
      // 头像选择
      let self = this;
      
      let newfileList = self.fileList.filter((val)=>val.id !== undefined);
      var el = event.currentTarget;
      if(el.classList.contains('imgboxsel')){
        // 已选中
        el.className='imgbox';
        self.ruleForm.images.splice(self.ruleForm.images.indexOf(imgsrc,1));
      }else{       
        // 未选中
        if((self.ruleForm.images.length + self.ruleForm.imgIds.length) < 5){
          el.className='imgbox imgboxsel';
          self.ruleForm.images.push(imgsrc);
        }else{
          self.$message({
            message: '最多选择5张图片！',
            type: 'warning'
          });
        };
      }
      self.ruleForm.images.map(val=>{
        newfileList.push({'url':self.imgurl+'/'+val});
      })
      self.fileList = newfileList;
    },
    handleRemove(file, fileList) {
      let self = this;
      // self.ruleForm.images.splice(self.ruleForm.images.indexOf(imgsrc))
      // console.log(self.ruleForm.imgIds)
      // console.log(file, fileList);
      // console.log(self.ruleForm.images)
      let imgids= [];
      let imglist = [];
      for(let i in fileList){
        if(fileList[i].id !== undefined){
          imgids.push(fileList[i].id);
        }else{
          imglist.push(fileList[i].url.replace(self.imgurl+'/',''))
        }
      };
      self.ruleForm.imgIds = imgids;
      self.ruleForm.images = imglist;      
    },
    handlePictureCardPreview(file) {
      // 图片放大查看
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

</style>
