<template>
  <div class="app-container">
    <!--    搜索框-->
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="登录地址" prop="ipaddr">
        <el-input v-model="queryParams.ipaddr" placeholder="请输入登录地址" clearable size="small" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="用户名称" prop="userName">
        <el-input v-model="queryParams.userName" placeholder="请输入用户名称" clearable size="small" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格   -->
    <el-table v-loading="loading" style="width: 100%;" :data="list">
      <el-table-column label="序号" type="index" align="center">
        <template slot-scope="scope">
          <span>{{(pageNum - 1) * pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="序号" align="center" prop="id" :show-overflow-tooltip="true"/>
      <el-table-column label="登录名称" align="center" prop="userName" :show-overflow-tooltip="true"/>
      <el-table-column label="主机" align="center" prop="loginIp" :show-overflow-tooltip="true"/>
      <el-table-column label="登录地点" align="center" prop="loginIp" :show-overflow-tooltip="true"/>
      <el-table-column label="浏览器" align="center" prop="browser" :show-overflow-tooltip="true"/>
      <el-table-column label="操作系统" align="center" prop="os" :show-overflow-tooltip="true"/>
      <el-table-column label="登录时间" align="center" prop="loginTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.loginTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleForceLogout(scope.row)">强退</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="pageNum" :limit.sync="pageSize" />
  </div>
</template>

<script>
import { list, forceLogout} from "@/api/system/online";

export default {
  name: "Online",
  data() {
    return {
      loading: true, // 遮罩层
      total: 0, // 总条数
      list: [], // 表格数据
      pageNum: 1,
      pageSize: 10,
      queryParams: { // 查询参数
        ipaddr: undefined,
        userName: undefined
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /* 查询登录日志列表 */
    getList() {
      this.loading = true;
      list(this.queryParams).then(response => {
        this.list = response.data;
        console.log(this.list)
        // this.total = response.data.total;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },

    /** 强退按钮操作 */
    handleForceLogout(row) {
      this.$confirm('是否确认强退名称为"' + row.userName + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return forceLogout(row.tokenId);
      }).then(() => {
        this.getList();
        this.msgSuccess("强退成功");
      }).catch(function() {});
    }
  }
};
</script>

