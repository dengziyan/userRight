<template>
  <div class="app-container">
    <!--    搜索框-->
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="登录ip" prop="ipaddr">
        <el-input
          v-model="queryParams.ipaddr"
          placeholder="请输入登录ip"
          clearable
          style="width: 240px;"
          size="small"
          @keyup.enter.native="handleQuery"
          @clear="clearParams('ipaddr')"
        />
      </el-form-item>
      <el-form-item label="用户名称" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入用户名称"
          clearable
          style="width: 240px;"
          size="small"
          @keyup.enter.native="handleQuery"
          @clear="clearParams('account')"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="操作状态"
          clearable
          size="small"
          style="width: 100px"
          @clear="clearParams('status')"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="登录时间">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
          clearable
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!--    各个操作按钮-->
    <el-row :gutter="10" class="mb8">
      <el-button
        v-for="resource in resources"
        v-if="resource.url==='111'"
        type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">删除
      </el-button>
      <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="!multiple" @click="handleClean">清空</el-button>
      <el-button type="warning" icon="el-icon-download" size="mini" :disabled="!multiple" @click="handleExport">导出</el-button>
      <el-checkbox  v-model="checkAll">导出所有数据</el-checkbox>
    </el-row>

    <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="访问编号" align="center" prop="id" />
      <el-table-column label="用户名称" align="center" prop="userName" :show-overflow-tooltip="true" />
      <el-table-column label="登录IP" align="center" prop="loginIp" width="130" :show-overflow-tooltip="true" />
      <el-table-column label="登录地点" align="center" prop="loginLocation" :show-overflow-tooltip="true" />
      <el-table-column label="浏览器" align="center" prop="browser" :show-overflow-tooltip="true" />
      <el-table-column label="操作系统" align="center" prop="os" :show-overflow-tooltip="true" />
      <el-table-column prop="status" label="操作状态" width="100">
        <template slot-scope="scope">
          <el-tag
            size="medium"
            :type="scope.row.status === 1 ? 'success': 'danger'"
            effect="dark"
            disable-transitions
          >{{ statusOptions[scope.row.status].label }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作信息" align="center" prop="msg" :show-overflow-tooltip="true" />
      <el-table-column label="登录日期" align="center" prop="loginTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.loginTime) }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      :page-sizes="[10,25,50]"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { list, delLogininfor, cleanLogininfor, exportLogininfor } from '@/api/system/logininfor'
import moment from 'moment'
import fileDownload from 'js-file-download'
// import { getLog } from "@/api/logDiary";
import { getUserProfile } from '@/api/authoraty/user'
import { listRoleResources } from '@/api/authoraty/role'

export default {
  name: 'LogDiary',
  data() {
    return {
      loading: true, // 遮罩层
      ids: [], // 选中数组
      multiple: true, // 非多个禁用
      showSearch: true, // 显示搜索条件
      total: 0, // 总条数
      list: [], // 表格数据
      checkAll: false,
      statusOptions: [{ label: '失败', value: 0 }, { label: '成功', value: 1 }], // 类型数据字典
      dateRange: [], // 日期范围
      queryParams: { // 查询参数
        pageNum: 1,
        pageSize: 10,
        ipaddr: undefined,
        userName: undefined,
        status: undefined
      },
      flag: false,
      resources: []
    }
  },
  computed: {

    newStatus() {
      return this.queryParams.status
    }
  },
  watch: {
    newStatus() {
      this.getList()
    }
  },
  created() {
    this.getList(),
      this.getUrl()
  },
  methods: {
  // 查询登录日志列表
    getList() {
      this.loading = true
      list(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.list = response.data.rows
        this.total = response.data.total
        this.loading = false
      },
      )
    },
    getUrl() {
      let roleList = []
      getUserProfile(this.$store.getters.id).then(response => {
        console.log(response.data)
        roleList = response.data
      })
      listRoleResources(roleList).then(response => {
        this.resources = response.data
      })
    },
      /** 搜索按钮操作 */
    handleQuery() {
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 置空参数
    clearParams(val) {
      if (val === 'status') {
        this.queryParams.status = undefined
      }
      if (val === 'account') {
        this.queryParams.account = undefined
      }
      if (val === 'ipaddr') {
        this.queryParams.ipaddr = undefined
      }
      this.getList()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.multiple = !selection.length
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const infoIds = row.id || this.ids
      this.$confirm('是否确认删除访问编号为"' + infoIds + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delLogininfor(infoIds)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {
      })
    },
    /** 清空按钮操作 */
    handleClean() {
      this.$confirm('是否确认清空所有登录日志数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return cleanLogininfor()
      }).then(() => {
        this.getList()
        this.msgSuccess('清空成功')
      }).catch(function() {
      })
    },

    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      if (this.checkAll) {
        queryParams.pageNum = undefined
        queryParams.pageSize = undefined
        queryParams.type = 'all'
      }
      this.$confirm('是否确认导出登录日志数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        exportLogininfor(queryParams).then(res => {
          console.log(res)
          const sysDate = moment(new Date()).format('YYYY-MM-DDHHmm')
          console.log(sysDate)
          fileDownload(res, sysDate + '用户登录日志.xlsx')
        })
      }).catch(function() {
      })
    }
  }
}

</script>
<style scoped>
.el-row button {
  float: left;
}
.el-checkbox{
  margin-left: 10px;
  float: left;
  margin-top: 6px;
}
right-toolbar {
  float: left;
}
</style>

