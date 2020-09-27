<template>
  <div class="app-container">
    <!-- 搜索框   -->
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="系统模块" prop="title">
        <el-select
          v-model="queryParams.title"
          placeholder="系统模块"
          clearable
          filterable
          size="small"
          style="width: 240px"
          @clear="clearParams('title')"
        >
          <el-option
            v-for="dict in systemOptions"
            :key="dict.value"
            :label="dict.value"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="操作人员" prop="operName">
        <el-input
          v-model="queryParams.operName"
          placeholder="请输入操作人员"
          clearable
          style="width: 240px;"
          size="small"
          @keyup.enter.native="handleQuery"
          @clear="clearParams('operName')"
        />
      </el-form-item>
      <el-form-item label="类型" prop="method">
        <el-select
          v-model="queryParams.method"
          placeholder="操作类型"
          clearable
          size="small"
          style="width: 240px"
          @clear="clearParams('method')"
        >
          <el-option v-for="dict in typeOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
        </el-select>
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
      <el-form-item label="操作时间">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
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
    <!-- 各个操作按钮 -->
    <el-row :gutter="10" class="mb8">
      <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">删除
      </el-button>
      <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="!multiple" @click="handleClean">清空
      </el-button>
      <el-button type="warning" icon="el-icon-download" size="mini" :disabled="!multiple" @click="handleExport">导出
      </el-button>
      <el-checkbox v-model="checkAll">导出所有数据</el-checkbox>
    </el-row>
    <!--表格-->
    <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="日志编号" align="center" prop="id" />
      <el-table-column label="系统模块" align="center" prop="title" :show-overflow-tooltip="true" />
      <el-table-column label="操作类型" align="center" prop="method" :show-overflow-tooltip="true" />
      <el-table-column label="请求方式" align="center" prop="requestMethod" :show-overflow-tooltip="true" />
      <el-table-column label="操作人员" align="center" prop="operName" :show-overflow-tooltip="true" />
      <el-table-column label="主机" align="center" prop="operIp" width="130" :show-overflow-tooltip="true" />
      <el-table-column label="操作地点" align="center" prop="operLocation" :show-overflow-tooltip="true" />
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

      <el-table-column label="操作日期" align="center" prop="operTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.operTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-view" @click="handleView(scope.row,scope.index)">详细
          </el-button>
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

    <!-- 操作日志详细 -->
    <el-dialog title="操作日志详细" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" label-width="100px" size="mini">
        <el-row>
          <el-col :span="12">
            <el-form-item label="操作模块：">{{ form.title }} / {{ typeFormat(form) }}</el-form-item>
            <el-form-item label="操作人员：">{{ form.operName }}</el-form-item>
            <el-form-item label="操作地点：">{{ form.operLocation }}</el-form-item>
            <el-form-item label="请求参数：">{{ form.operParam || [] }}</el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="操作类型：">{{ form.method }}</el-form-item>
            <el-form-item label="主机：">{{ form.operIp }}</el-form-item>
            <el-form-item label="请求地址：">{{ form.operUrl }}</el-form-item>
            <el-form-item label="请求方名称：">{{ form.requestMethod }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="响应参数：">{{ form.jsonResult || [] }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作状态：">
              <div v-if="form.status === 1">正常</div>
              <div v-else-if="form.status === 0">失败</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作时间：">{{ parseTime(form.operTime) }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="form.status === 0" label="异常信息：">{{ form.errorMsg }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { list, delOperlog, cleanOperlog, exportOperlog } from '@/api/system/operlog'
// import { getOpe } from '@/api/opeDiary'
import fileDownload from 'js-file-download'
import moment from 'moment'

export default {
  name: 'OpeDiary',
  data() {
    return {
      loading: true, // 遮罩层
      ids: [], // 选中数组
      multiple: true, // 非多个禁用
      showSearch: true, // 显示搜索条件
      total: 0, // 总条数
      list: [], // 表格数据
      open: false, // 是否显示弹出层
      checkAll: false,
      typeOptions: [], // 类型数据字典
      statusOptions: [{ label: '失败', value: 0 }, { label: '成功', value: 1 }], // 类型数据字典
      systemOptions: [{ value: '系统管理模块' }, { value: '用户登录注册和登出模块' }, { value: '用户个人信息模块' }, { value: '用户管理模块' }, { value: '角色管理模块' }, { value: '菜单管理模块' }, { value: '资源管理模块' }],
      dateRange: [], // 日期范围
      form: {}, // 表单参数
      queryParams: { // 查询参数
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        operName: undefined,
        method: undefined,
        status: undefined
      }
    }
  },
  computed: {
    newTitle() {
      return this.queryParams.title
    },
    newMethod() {
      return this.queryParams.method
    },
    newStatus() {
      return this.queryParams.status
    }
  },
  watch: {
    newTitle() {
      this.getList()
    },
    newStatus() {
      this.getList()
    }, newMethod() {
      this.getList()
    }
  },

  created() {
    this.getList()
  },
  methods: {
    // 查询登录日志
    getList() {
      this.loading = true
      list(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.list = response.data.rows
        this.total = response.data.total
        this.loading = false
      }
      )
    },
    // 置空参数
    clearParams(val) {
      if (val === 'operName') {
        this.queryParams.operName = undefined
      }
      if (val === 'title') {
        this.queryParams.title = undefined
      }
      if (val === 'status') {
        this.queryParams.status = undefined
      }
      if (val === 'method') {
        this.queryParams.method = undefined
      }
      this.getList()
    },
    // 操作日志类型字典翻译
    typeFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.businessType)
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.multiple = !selection.length
    },
    /** 详细按钮操作 */
    handleView(row) {
      this.open = true
      this.form = row
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const operIds = row.id || this.ids
      this.$confirm('是否确认删除日志编号为"' + operIds + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delOperlog(operIds)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {
      })
    },
    /** 清空按钮操作 */
    handleClean() {
      this.$confirm('是否确认清空所有操作日志数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return cleanOperlog()
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
      this.$confirm('是否确认导出所有操作日志数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        exportOperlog(queryParams).then(response => {
          console.log(response)
          const sysDate = moment(new Date()).format('YYYY-MM-DDHHmm')
          console.log(sysDate)
          fileDownload(response, sysDate + '用户操作日志.xlsx')
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

