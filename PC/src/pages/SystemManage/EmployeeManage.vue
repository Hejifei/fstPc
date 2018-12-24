<template>
  <div class="hello">
    <div class="listtitle">用户管理</div>
    <div class="listSearchC">
      <el-input
        placeholder="关键字查询"
        v-model="querydata.strKeyword"
        clearable>
      </el-input>
      <el-button round @click="querylist">查询</el-button>
      <el-row>
        <el-col :span="12">
          <router-link to="/SystemManage/EmployeeAdd" class="el-button">新增</router-link>
          <el-button @click="listDelete">删除</el-button> 
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
          prop="loginName"
          label="用户名">
        </el-table-column>
        <el-table-column
          prop="loginAccount"
          label="账号">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机号">
        </el-table-column>
        <el-table-column  label="状态">
          <template slot-scope="scope">
            {{scope.row.loginStatus === '1' ? '有效':'无效'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="roleNameStr"
          :show-overflow-tooltip='true'
          label="角色名称">
        </el-table-column>
        <el-table-column label="操作"  width=180>
          <template slot-scope="scope">
            <el-button class="redbtn"
              size="mini"
              @click="roleEdit(scope.row)">编辑</el-button>
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
        strKeyword:'',
        pageIndex: 1,
        pageSize:10,
        pagetotal:0
      },
      tableData: [],
      dialogVisible: false,
      defaultProps: {
        children: 'children',
        label: 'label'
      }
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
      self._ajax(self,'/get/system/accountList', self.querydata, function (data) {
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
    listDelete(){
      //列表删除
      this.Delete(this,'/get/system/deleteAccount',{idStr:String(this.delIds)});
    },
    handleSelectionChange(val) {
      // 获取列表选中项id
      this.delIds = val.map((val)=>val.id);
    },
    roleEdit(role){
      sessionStorage.detail = JSON.stringify(role)
      this.$router.push({path:'/SystemManage/EmployeeAdd?id='+role.id});
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
