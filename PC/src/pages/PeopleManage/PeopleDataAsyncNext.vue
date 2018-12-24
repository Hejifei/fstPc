<template>
  <div class="hello">
    <div class="listtitle">人员数据同步</div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position='left' label-width="100px" class="demo-ruleForm newaddInfoC">
      <el-form-item label="任务名" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="任务类型" prop="type">
        <el-select v-model="ruleForm.type" placeholder="选择任务类型">
          <el-option
            v-for="item in tasklit"
            :key="item.value"
            :label="item.desc"
            :value="item.code">
          </el-option>
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
      <el-form-item label=" "  prop='faceDbIds'>
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
      <el-form-item label="人员分组"  prop="personIds">
        <!-- <el-select v-model="queryinfo.group" placeholder="选择分组" class="right15">
          <el-option label="group1" value="group1"></el-option>
        </el-select>
        <el-input v-model="queryinfo.personname" placeholder="输入人员名" class="right15"></el-input>
        <el-button round @click="querylist">查询</el-button> -->

        <div class="addtransferC" style="padding-left:0;">
          <el-transfer
            style="text-align: left; display: inline-block"
            v-model="ruleForm.personIds"
            filterable
            :left-default-checked="[]"
            :right-default-checked="[]"
            :titles="['未添加对象', '已添加对象']"
            :button-texts="['删除数据同步对象','添加到数据同步对象']"
            :format="{
              noChecked: '${total}',
              hasChecked: '${checked}/${total}'
            }"
            :data="personlist">
            <el-button class="transfer-footer" slot="left-footer" size="small">操作</el-button>
            <el-button class="transfer-footer" slot="right-footer" size="small">操作</el-button>
          </el-transfer>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="submitForm('ruleForm')">保存</el-button>
        <router-link class="el-button" to="/PeopleManage/PeopleDataAsync">取消</router-link>
      </el-form-item>
    </el-form>
    
  </div>
</template>

<script>
export default {
  data () {
    
    return {
      tasklit:[],
      personlist:[],
      scenelist:[],
      librarylist:[],
      euipmentlist:[],
      selectedList:[],
      ruleForm: {
        name:'',
        type:'',
        scene:'',
        equipment:'',
        faceDbIds:[],
        personIds:[],
      },
      rules: {
        name: [
          { required: true, message: '请输入任务名', trigger: 'blur' },
        ],
        type: [
          { required: true, message: '请选择任务类型', trigger: 'change' }
        ],
        scene: [
          { required: true, message: '请选择场景', trigger: 'change' }
        ],
        equipment: [
          { required: true, message: '请选择设备', trigger: 'change' }
        ],
        faceDbIds: [
          { required: true, message: '请添加人脸库', trigger: 'change' }
        ],
        personIds: [
          { required: true, message: '请添加人员', trigger: 'change' }
        ],
        
        }
      }
  },
  created(){
    let self = this;
  },
  mounted () {
    let self = this;
    //获取所有任务类型
    self._ajax(self,'/syncTask/type/all', {}, function (data) {
      self.tasklit = data.data;
    })
    //场景列表
    self._ajax(self,'/sense/all', {}, function (data) {
      self.scenelist = data.data;
    })
    let personlist = [];
    //人员列表
    self._ajax(self,'/person/all', {}, function (data) {
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
    self.personlist = personlist;
  },
  methods: {
    submitForm(formName) {
      this._submitForm(formName,this,'/syncTask/add',this.ruleForm,'/PeopleManage/PeopleDataAsync')
    },
    sceneChange(){
      // 根据场景获取设备
      let self= this;
      self.ruleForm.equipment = '';
      self._ajax(self,'/device/monitor/getBySenseId', {senseId:self.ruleForm.scene}, function (data) {
        self.euipmentlist = data.data;
      })
    },
    handleChange(value, direction, movedKeys) {
      // 下发库添加方法
      for(let i in movedKeys){
        let newadd = this.librarylist.filter(obj => obj.key === movedKeys[i]);
        if(newadd.length > 0 &&  direction === 'right'){
          this.selectedList.push(newadd[0])
        }else if( direction === 'left'){
          this.selectedList.splice(this.selectedList.findIndex(item => item.key === movedKeys[i]),1);
        }
      };
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
        self.librarylist  = librarylist.concat(self.selectedList);
      })
    },
    
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
