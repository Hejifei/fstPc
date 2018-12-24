<template>
  <div class="hello">
    <div class="listtitle">数据库备份</div>
    <div class="listSearchC">
      <el-row>
        <el-col>
          <router-link to="/SystemManage/databaseTaskAdd" class="el-button">定时</router-link>
          <el-button @click="copyDB">手动备份</el-button>
          <el-button class="exportbtn" @click="insertIn"><img src="../../assets/img/icons/content_import.png"/> 导入文件</el-button>
          <!-- <el-button class="exportbtn" @click="exportout"><img src="../../assets/img/icons/content_export.png"/> 导出</el-button> -->
          
          <el-upload
            style="display:none;"
            class="upload-demo"
            :action="this.APIURL+'/get/system/importDb'"
            :on-preview="handlePreview"
            accept='.sql'
            multiple
            :beforeUpload='checkfiletype'
            :limit="3"
            :on-success='imageChange'
            :file-list="fileList">
            <el-button id='insertBtn'>导入</el-button>
          </el-upload>
        </el-col>
        
        <!-- <el-col :span="2" class="rowright"></el-col> -->
      </el-row>
    </div>
    <div class="listtableC">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        >
        <el-table-column
          prop="name"
          label="文件名">
        </el-table-column>
        <el-table-column
          label="文件大小">
          <template slot-scope="scope">
            {{scope.row.size}} kb
          </template>
        </el-table-column>
        <el-table-column label="操作"  width=280>
          <template slot-scope="scope">
            <el-button class="redbtn" size="mini" @click="recovery(scope.row.name)">恢复</el-button>
            <el-button class="greybtn" size="mini" @click="handleDelete(scope.row.name)">删除</el-button>
            <el-button class="blackbtn" size="mini" @click="exportout(scope.row.name)">导出文件</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      formatTime:this.Format,
      fileList:[],
      delIds:[],
      querydata:{
        name:'',
        state:'',
      },
      tableData: [],
      dialogVisible: false,
    }
  },
  watch: {
  },
  created(){
    let self = this;
  },
  mounted () {  
    let self = this;
    // 页面加载获取第一列数据
    this.querylist();
  },
  methods: {
    querylist(){
      let self = this;
      self._ajax(self,'/get/system/getDbFile', {}, function (data) {
        self.tableData = data.data;
      })
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.querylist();
    },
    handleSelectionChange(val) {
      // 获取列表选中项id
      this.delIds = val.map((val)=>val.id);
    },
    copyDB(){
      // 手动备份
      let self = this;
      self._ajax(self,'/get/system/getCopyDb', {}, function (data) {
        self.$message({
          type: 'success',
          message: data.desc
        });
        self.querylist();
      })
    },
    insertIn(){
      document.getElementById('insertBtn').click();
      // 导入
      // let self = this;
      // self._ajax(self,'api', {}, function (data) {
      //   self.$message({
      //     type: 'success',
      //     message: data.desc
      //   });
      //   self.querylist();
      // })
    },
    exportout(name){
      // 导出
      let self = this;
      self._ajax(self,'/get/system/exportDb', {name:name}, function (data) {
        window.open(self.APIURL +'/'+data.data)
        // self.$message({
        //   type: 'success',
        //   message: data.desc
        // });
      })
    },
    handleDelete(name){
      //删除接口
      this.Delete(this,'/get/system/deleteDb',{fileName:name});
    },
    recovery(name){
      // 恢复
      let self = this;
      self._ajax(self,'/get/system/reviewDb', {fileName:name}, function (data) {
        self.$message({
          type: 'success',
          message: data.desc
        });
        self.querylist();
      })
    },
    handlePreview(file) {
        // console.log(file);
    },
    imageChange(response, file, fileList){
      this.$message({
        type: 'success',
        message: response.desc
      });
      this.querylist();
    },
    checkfiletype(file){
      // 显示上传的文件类型为.sql
      let filetype = file.name.substring(file.name.lastIndexOf('.')+1) === 'sql';
      if(filetype){
      }else{
        this.$message.error('请导入正确的数据库文件!');
      }
      return filetype;
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-upload-list,.el-upload-list__item,.el-upload-list__item-name,.el-upload-list__item-status-label{display:none !important;}
</style>
