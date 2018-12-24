<template>
  <div class="hello">
    <div class="listtitle">人员数据同步</div>
    <div class="listSearchC">
      <el-input
        placeholder="姓名"
        v-model="querydata.name"
        clearable>
      </el-input>
      <el-button round @click="querylist">查询</el-button>
    </div>
    <div class="listtableC">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          prop="personName"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机号">
        </el-table-column>
        <el-table-column
          prop="faceDbName"
          label="下发库">
        </el-table-column>
        <el-table-column
          prop="deviceName"
          label="设备名">
        </el-table-column>
        <el-table-column
          prop="senseName"
          label="场景">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态">
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
      querydata:{
        id:'',
        name:'',
        pageIndex: 1,
        pageSize:10,
        pagetotal:0
      },
      tableData: [],
      
    }
  },
  created(){
    let self = this;
  },
  mounted () {  
    let self = this;
    this.querydata.id = this.getUrl(location.href).id;
    if(this.querydata.id === undefined){
      // 没有id返回列表页
      self.$router.push({path:'/PeopleDataAsync'});
    }
    // 页面加载获取第一列数据
    this.querylist();
  },
  methods: {
    querylist(){
      let self = this;
      self._ajax(self,'/syncTask/view', self.querydata, function (data) {
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
    
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
