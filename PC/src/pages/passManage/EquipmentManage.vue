<template>
  <div class="hello">
    <div class="listtitle">设备管理</div>
    <div class="listSearchC">
      <el-input
        placeholder="设备名称"
        v-model="querydata.name"
        clearable>
      </el-input>
      <el-input
        placeholder="IP地址"
        v-model="querydata.ip"
        clearable>
      </el-input>
      <el-select v-model="querydata.senseId" placeholder="场景">
        <el-option
          label="请选择场景"
          value="">
        </el-option>
        <el-option
          v-for="item in scenelist"
          :key="item.value"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-button round @click="querylist">查询</el-button>
      <el-row>
        <el-col :span="12">
          <router-link to="/passManage/EquipmentAdd" class="el-button">新增</router-link>
          <el-button @click="listDelete">删除</el-button> 
          <el-button @click="syncFaceDB">同步人脸库</el-button> 
          <!-- <el-button @click="syncCamera">同步摄像头信息</el-button>  -->
        </el-col>
        <el-col :span="12" class="rowright"></el-col>
      </el-row>
      
    </div>
    <div class="listtableC">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        >
        <el-table-column
          label="选择"
          type="selection"
          width='50'
          >
        </el-table-column>
        <el-table-column
          prop="name"
          label="设备名称">
        </el-table-column>
        <el-table-column
          prop="ip"
          label="IP地址">
        </el-table-column>
        <el-table-column
          prop="senseName"
          label="场景">
        </el-table-column>
        <el-table-column label="操作" width=230>
          <template slot-scope="scope">
            <router-link :to="'/passManage/EquipmentAdd?id='+scope.row.id" class="el-button el-button--mini redbtn">查看</router-link>
            <a :href="'http://10.10.30.237/ivs/gxsg/resident.html?user='+scope.row.adminName+'&pass='+scope.row.adminPassword" target="_black" class="el-button el-button--mini redbtn">管理</a>
            <el-button class="delbtn"
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :current-page.sync="querydata.pageIndex"
        :page-size="querydata.pageSize"
        :total="querydata.pagetotal"
        @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      delIds:[],
      querydata:{
        name:'',
        ip:'',
        senseId:'',
        pageIndex: 1,
        pageSize:10,
        pagetotal:0
      },
      scenelist: [],
      tableData: [],
    }
  },
  created(){
    let self = this;
  },
  mounted () {  
    let self = this;
    //场景列表
    self._ajax(self,'/sense/all', {}, function (data) {
      self.scenelist = data.data;
    })
    // 页面加载获取第一列数据
    this.querylist();
  },
  methods: {
    querylist(){
      let self = this;
      self._ajax(self,'/device/query', self.querydata, function (data) {
        self.querydata.pagetotal = data.data.total;
        self.querydata.pageSize = data.data.pageSize;
        self.querydata.pageIndex = data.data.pageNum;
        self.tableData = data.data.list;
      })
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.querylist();
    },
    handleDelete(id){
      //删除接口
      var self = this;
      let newarr = new Array();
      newarr.push(id)
      this.Delete(self,'/device/delete',{ids:newarr});
    },
    handleSelectionChange(val) {
      // 获取列表选中项id
      this.delIds = val.map((val)=>val.id);
    },
    listDelete(){
      // 列表页删除
      this.Delete(this,'/device/delete',{ids:this.delIds});
    },
    syncFaceDB(){
      //同步人脸库
      this.listOperation(this,'/device/sync/facedb',{id:this.delIds},'确认同步人脸库？')
    },
    syncCamera(){
      //同步摄像头信息
      this.listOperation(this,'/device/sync/camera',{id:this.delIds},'同步摄像头信息')
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
