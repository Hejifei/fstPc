<template>
  <div class="hello">
    <div class="listtitle">访客授权</div>
    <div class="listSearchC">
      <el-input
        placeholder="输入访客姓名、手机号"
        v-model="querydata.nameorphone"
        clearable>
      </el-input>
      <el-button round @click="querylist">查询</el-button>
    </div>
    <div class="listtableC">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        >
        <el-table-column label="访客姓名">
          <template slot-scope="scope">{{ifnull(scope.row.name)}}</template>
        </el-table-column>
        <el-table-column label="联系方式" width='130'>
          <template slot-scope="scope">{{ifnull(scope.row.phone)}}</template>
        </el-table-column>
        <el-table-column label="开始时间" width='180'>
          <template slot-scope="scope">{{ifnull(FormatTable(scope.row.beginDate))}}</template>
        </el-table-column>
        <el-table-column label="结束时间" width='180'>
          <template slot-scope="scope">{{ifnull(FormatTable(scope.row.endDate))}}</template>
        </el-table-column>
        <el-table-column title='reason'
          :show-overflow-tooltip='true'
          label="来访事由">
          <template slot-scope="scope">{{ifnull(scope.row.reason)}}</template>
        </el-table-column>
        <el-table-column label="被访人">
          <template slot-scope="scope">{{ifnull(scope.row.bname)}}</template>
        </el-table-column>
        <el-table-column label="预约状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status === '0'">审批中</span>
            <span v-if="scope.row.status === '1'">通过</span>
            <span v-if="scope.row.status === '2'">拒绝</span>
            <span v-if="scope.row.status === '3'">下发成功</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width=180>
          <template slot-scope="scope">
            <el-popover
              placement="bottom"
              title="下发人脸库"
              width="200"
              trigger="click"
              :content='popcontent'>
              <el-button slot="reference" class="redbtn" size="mini" @click="authDetail(scope.row.id)">查看</el-button>
            </el-popover>
            <!-- <router-link :to="'/VistorManage/AuthorizeDetail?id='+scope.row.id" class="el-button el-button--mini redbtn">查看</router-link> -->
            <router-link v-if="scope.row.status === '1'" :to="'/VistorManage/Authorize?id='+scope.row.id" class="el-button el-button--mini greybtn">授权</router-link>
            <el-button  v-if="scope.row.status !== '1'" type="info" size="mini" class="disablebtn" disabled>已授权</el-button>
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
        nameorphone:'',
        pageIndex: 1,
        pageSize:10,
        pagetotal:0
      },
      tableData: [],
      popcontent:'暂无人脸库'
    }
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
      self._ajax(self,'/get/visitor/authorizationList', self.querydata, function (data) {
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
    authorize(id){
      //暂停
      var self = this;
      // this.Delete(self,'url',id);
    },
    authDetail(id){
      let self = this;
      self._ajax(self,'/get/visitor/searchById', {'id':id}, function (data) {
        if(data.data.length === 0){
          self.popcontent = '暂无人脸库！';
        }else{
          let popcontent = '';
          for(let i in data.data){
            if(Number(i)=== Number(data.data.length -1)){
              popcontent += data.data[i].name
            }else{
              popcontent += data.data[i].name+'、'
            }
          }
          self.popcontent = popcontent;
        }

      })
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
