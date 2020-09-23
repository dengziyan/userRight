<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="20" :xs="24">
        <!-- 搜索框-->
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px" :data="form">
          <el-form-item label="用户名称" prop="userName">
            <el-input v-model="queryParams.userName" placeholder="请输入用户名称" clearable size="small" style="width: 240px" @keyup.enter.native="handleQuery"/>
          </el-form-item>
          <el-form-item label="手机号码" prop="phonenumber">
            <el-input v-model="queryParams.phonenumber" placeholder="请输入手机号码" clearable size="small" style="width: 240px" @keyup.enter.native="handleQuery"/>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="用户状态" clearable size="small" style="width: 240px">
              <el-option v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue"/>
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker v-model="dateRange" size="small" style="width: 240px" value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- 各个操作按钮 -->
        <el-row :gutter="10" class="mb8">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
            <el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate">修改</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">删除</el-button>
            <el-button type="info" icon="el-icon-upload2" size="mini" @click="handleImport">导入</el-button>
            <el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
<!--          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>-->
        </el-row>
        <!-- 表格-->
        <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" align="center"/>
          <el-table-column label="编号" align="center" prop="id"/>
          <el-table-column label="账号" align="center" prop="account"/>
          <el-table-column label="姓名" align="center" prop="realName"/>
          <el-table-column label="性别" align="center" prop="gender"/>
          <el-table-column label="邮箱" align="center" prop="email"/>
          <el-table-column label="手机号码" align="center" prop="mobilePhone" width="120"/>
          <el-table-column label="创建时间" align="center" prop="createDate" width="160">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createDate) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="最后登录" align="center" prop="lastLoginTime" width="160">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.lastLoginTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" >修改</el-button>
              <el-button v-if="scope.row.userId !== 1" size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
              <el-button size="mini" type="text" icon="el-icon-key" @click="handleResetPwd(scope.row)">重置
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList"/>
      </el-col>
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户账号" prop="account">
              <el-input v-model="form.account" placeholder="请输入用户账号"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="mobilePhone">
              <el-input v-model="form.mobilePhone" placeholder="请输入手机号码" maxlength="11"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.userId == undefined" label="用户密码" prop="password">
              <el-input v-model="form.password" placeholder="请输入用户密码" type="password"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="form.id == undefined" label="用户姓名" prop="realName">
              <el-input v-model="form.realName" placeholder="请输入用户姓名"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色">
              <el-select v-model="form.roleIds" multiple placeholder="请选择">
                <el-option v-for="item in roleOptions" :key="item.roleId" :label="item.roleName" :value="item.roleId" :disabled="item.status == 1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!--  ？密码需要显示吗        -->
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户性别">
              <el-select v-model="form.gender" placeholder="请选择">
                <el-option v-for="(dict) in sexOptions" :key="dict" :label="dict"
                           :value="dict"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio v-for="dict in statusOptions" :key="dict" :label="dict" :value="dict">
<!--                  {{dict.dictValue}}-->
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload ref="upload" :limit="1" accept=".xlsx, .xls" :headers="upload.headers"
                 :action="upload.url + '?updateSupport=' + upload.updateSupport" :disabled="upload.isUploading"
                 :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :auto-upload="false" drag>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <el-checkbox v-model="upload.updateSupport"/>
          是否更新已经存在的用户数据
          <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listUser,
  getUser,
  delUser,
  addUser,
  updateUser,
  exportUser,
  resetUserPwd,
  changeUserStatus,
  importTemplate
} from '@/api/authoraty/user'
import { getToken } from '@/utils/auth'

export default {
  name: 'User',
  // components: { Treeselect },
  data() {
    return {
      loading: true, // 遮罩层
      ids: [], // 选中数组
      single: true, // 非单个禁用
      multiple: true, // 非多个禁用
      showSearch: true, // 显示搜索条件
      total: 0, // 总条数
      userList: null, // 用户表格数据
      title: '', // 弹出层标题
      deptOptions: undefined, // 部门树选项
      open: false, // 是否显示弹出层
      deptName: undefined, // 部门名称
      initPassword: undefined, // 默认密码
      dateRange: [], // 日期范围
      statusOptions: ['正常', '停用'], // 状态数据字典
      sexOptions: ['男', '女'], // 性别状态字典
      roleOptions: [], // 角色选项
      form: {}, // 表单参数
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 用户导入参数
      upload: {
        open: false, // 是否显示弹出层（用户导入）
        title: '', // 弹出层标题（用户导入）
        isUploading: false, // 是否禁用上传
        updateSupport: 0, // 是否更新已经存在的用户数据
        headers: { Authorization: 'Bearer ' + getToken() }, // 设置上传的请求头部
        url: process.env.VUE_APP_BASE_API + '/authoraty/user/importData' // 上传的地址
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
        phonenumber: undefined,
        status: undefined,
        deptId: undefined
      },
      // 表单校验
      rules: {
        userName: [
          { required: true, message: '用户名称不能为空', trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: '用户昵称不能为空', trigger: 'blur' }
        ],
        deptId: [
          { required: true, message: '归属部门不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '用户密码不能为空', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱地址不能为空', trigger: 'blur' },
          {
            type: 'email',
            message: '\'请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        phonenumber: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true
      listUser(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          this.userList = response.data.rows
          this.total = response.data.total
          this.loading = false
        }
      )
    },
    // /** 查询部门下拉树结构 */
    // getTreeselect() {
    //   treeselect().then((response) => {
    //     this.deptOptions = response.data
    //   })
    // },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.deptId = data.id
      this.getList()
    },
    // 用户状态修改
    handleStatusChange(row) {
      let text = row.status === '0' ? '启用' : '停用'
      this.$confirm(
        '确认要"' + text + '""' + row.userName + '"用户吗?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(function() {
          return changeUserStatus(row.userId, row.status)
        })
        .then(() => {
          this.msgSuccess(text + '成功')
        })
        .catch(function() {
          row.status = row.status === '0' ? '1' : '0'
        })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        userId: undefined,
        deptId: undefined,
        userName: undefined,
        nickName: undefined,
        password: undefined,
        phonenumber: undefined,
        email: undefined,
        sex: undefined,
        status: '0',
        remark: undefined,
        postIds: [],
        roleIds: []
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    resetForm() {
      // this.form.username = ''
      // this.form.phonenumber = ''
      // this.form.status = ''
      // this.dateRange = []
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      // this.getTreeselect();
      this.reset()
      this.open = true
      getUser().then((response) => {
        this.roleOptions = response.roles
        this.title = '添加用户'
        this.form.password = this.initPassword
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      // this.getTreeselect();
      const userId = row.id || this.ids
      getUser(userId).then((response) => {
        this.form = response.data
        this.roleOptions = response.roles
        this.form.postIds = response.postIds
        this.form.roleIds = response.roleIds
        this.open = true
        this.title = '修改用户'
        this.form.password = ''
      })
    },
    /** 重置密码按钮操作 */
    handleResetPwd(row) {
      this.$prompt('请输入"' + row.userName + '"的新密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(({ value }) => {
          resetUserPwd(row.userId, value).then((response) => {
            if (response.code === 200) {
              this.msgSuccess('修改成功，新密码是：' + value)
            }
          })
        })
        .catch(() => {
        })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.userId != undefined) {
            updateUser(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              }
            })
          } else {
            addUser(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess('新增成功')
                this.open = false
                this.getList()
              }
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const userIds = row.userId || this.ids
      this.$confirm(
        '是否确认删除用户编号为"' + userIds + '"的数据项?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(function() {
          return delUser(userIds)
        })
        .then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
        .catch(function() {
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      this.$confirm('是否确认导出所有用户数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          return exportUser(queryParams)
        })
        .then((response) => {
          this.download(response.msg)
        })
        .catch(function() {
        })
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = '用户导入'
      this.upload.open = true
    },
    /** 下载模板操作 */
    importTemplate() {
      importTemplate().then((response) => {
        this.download(response.msg)
      })
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false
      this.upload.isUploading = false
      this.$refs.upload.clearFiles()
      this.$(response.msg, '导入结果', { dangerouslyUseHTMLString: true })
      this.getList()
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit()
    }
  }
}
</script>

<style scoped>
  .el-row button{
    float: left;
  }
</style>
