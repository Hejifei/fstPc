<template>
  <div class="hello">
    <div class="listtitle">授权操作</div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position='left' label-width="100px" class="demo-ruleForm newaddInfoC">
      <el-form-item label="场景">
        <el-select placeholder="选择场景" class="right15" v-model="sense" @change="senseChange">
          <el-option v-for="senseson in senseAll" :key="senseson.id" :label="senseson.name" :value="senseson.id">{{senseson.name}}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备" prop="equipment">
        <el-select v-model="ruleForm.equipment" placeholder="请选择设备"  @change="equipmentChange">
          <el-option v-for="(equipment,index) in euipmentlist" :key="index" :label="equipment.name" :value="equipment.id"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="设备">
        <el-select placeholder="选择设备" class="right15" v-model="sense" @change="senseChange">
          <el-option v-for="senseson in senseAll" :key="senseson.id" :label="senseson.name" :value="senseson.id">{{senseson.name}}</el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label=" " prop="listadd">
        <div class="addtransferC">
          <el-transfer
            style="text-align: left; display: inline-block"
            v-model="ruleForm.listadd"
            filterable
            :left-default-checked="[]"
            :right-default-checked="[]"
            :titles="['未添加库', '下发库']"
            :button-texts="['删除下发库','添加到下发库']"
            :format="{
              noChecked: '${total}',
              hasChecked: '${checked}/${total}'
            }"
            @change="handleChange"
            :data="deviceslist">
            <!-- <span slot-scope="{ option }">{{ option.key }} - {{ option.label }}</span> -->
            <el-button class="transfer-footer" slot="left-footer" size="small">操作</el-button>
            <el-button class="transfer-footer" slot="right-footer" size="small">操作</el-button>
          </el-transfer>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="submitForm('ruleForm')">保存</el-button>
        <router-link class="el-button" to="/VistorManage/VistorAuthorize">取消</router-link>
      </el-form-item>
    </el-form>
    
  </div>
</template>

<script>
export default {
  data () {
    return {
      senseAll:[],
      sense:[],
      deviceslist:[],
      selectedList:[],
      euipmentlist:[],
      ruleForm: {
        appointmentId:'',
        faceDbIds:'',
        listadd:[],
      },
      rules: {
          // scene: [
          //   { required: true, message: '请选择场景', trigger: 'change' }
          // ],
          listadd: [
            { required: true, message: '请添加设备到下发库', trigger: 'change' }
          ],
      },
    }
  },
  created(){
    let self = this;
  },
  mounted () {  
    let self = this;
    this.ruleForm.appointmentId = this.getUrl(location.href).id;
    self._ajax(self,'/get/door/getAll', {}, function (data) {
      self.senseAll = data.data;
    })
  },
  methods: {
    submitForm(formName) {
      this.ruleForm.faceDbIds = String(this.ruleForm.listadd);
      this._submitForm(formName,this,'/get/visitor/addVisitAuthorization',this.ruleForm,'/VistorManage/VistorAuthorize')
    },
    senseChange(){
      // 场景选择
      let self = this;
      self._ajax(self,'/device/monitor/getBySenseId', {senseId:self.sense}, function (data) {
        self.euipmentlist = data.data;
        self.ruleForm.equipment = '';
      })
    },
    handleChange(value, direction, movedKeys) {
      for(let i in movedKeys){
        let newadd = this.deviceslist.filter(obj => obj.key === movedKeys[i]);
        if(newadd.length > 0 &&  direction === 'right'){
          this.selectedList.push(newadd[0])
        }else if( direction === 'left'){
          this.selectedList.splice(this.selectedList.findIndex(item => item.key === movedKeys[i]),1);
        }
      }
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
        self.deviceslist = librarylist.concat(self.selectedList);
      })
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
