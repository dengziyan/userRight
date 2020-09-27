<template>
  <div class="app-container">
    <!-- 搜索框-->
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="账号" prop="account">
        <el-input
          v-model="queryParams.account"
          placeholder="请输入用户账号"
          clearable
          size="small"
          style="width: 180px"
          @keyup.enter.native="handleQuery"
          @clear="clearParams('account')"
        />
      </el-form-item>
      <el-form-item label="登录地点" prop="loginLocation">
        <el-cascader
          :options="options"
          v-model="selectedOptions"
          placeholder="请输入地点"
          clearable
          filterable
          size="small"
          :props="{ checkStrictly: true }"

          style="width: 250px"
          @change="handleChange">
        </el-cascader>
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格   -->
    <el-table v-loading="loading" style="width: 100%;" :data="list">
      <el-table-column label="会话编号" align="center" prop="id" :show-overflow-tooltip="true"/>
      <el-table-column label="登录名称" align="center" prop="userName" :show-overflow-tooltip="true"/>
      <el-table-column label="主机" align="center" prop="loginIp" :show-overflow-tooltip="true"/>
      <el-table-column label="登录地点" align="center" prop="loginLocation" :show-overflow-tooltip="true"/>
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
  </div>
</template>

<script>
import { Onlinelist, forceLogout } from '@/api/system/online'
import { regionData, CodeToText } from 'element-china-area-data'

export default {
  name: 'Online',
  data() {
    return {
      loading: true, // 遮罩层
      showSearch: true,
      list: [], // 表格数据
      queryParams: { // 查询参数
        account: undefined,
        loginLocation: undefined
      },
      options: regionData,
      selectedOptions: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /* 查询登录日志列表 */
    getList() {
      this.loading = true
      Onlinelist(this.queryParams).then(response => {
        this.list = response.data
        this.loading = false
      })
    },
    handleChange(value) {
      let loc = ''
      for (let i = 0; i < value.length; i++) {
        console.log(1)
        if (i === value.length - 1) {
          loc += CodeToText[value[i]]
        } else {
          loc += CodeToText[value[i]] + '/'
        }
      }
      this.queryParams.loginLocation = loc || undefined
      this.handleQuery()
      this.options=regionData
    },
    // 置空参数
    clearParams(val) {
      if (val === 'loginLocation') {
        this.queryParams.loginLocation = undefined
      }
      if (val === 'account') {
        this.queryParams.account = undefined
      }
      this.getList()
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },

    /** 强退按钮操作 */
    handleForceLogout(row) {
      this.$confirm('是否强退账号为"' + row.userName + '"的用户?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return forceLogout(row.userName)
      }).then(() => {
        this.getList()
      }).catch(function() {
      })
    }
  }
}
</script>

