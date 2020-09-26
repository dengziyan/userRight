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
      <el-form-item label="用户名称" prop="realName">
        <el-input
          v-model="queryParams.realName"
          placeholder="请输入用户名称"
          clearable
          size="small"
          style="width: 180px"
          @keyup.enter.native="handleQuery"
          @clear="clearParams('realName')"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="mobilePhone">
        <el-input
          v-model="queryParams.mobilePhone"
          placeholder="请输入手机号码"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
          @clear="clearParams('mobilePhone')"
        />
      </el-form-item>
      <el-form-item label="状态" prop="enabled">
        <el-select v-model="queryParams.enabled" placeholder="用户状态" clearable  @clear="clearParams('enabled')" size="small" style="width: 110px">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
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
      <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
      <el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate">修改
      </el-button>
      <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">删除
      </el-button>
      <el-button type="info" icon="el-icon-upload2" size="mini" @click="handleImport">导入</el-button>
      <el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
      <!--          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>-->
    </el-row>
    <!-- 表格-->
    <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="账号" align="center" prop="account" :show-overflow-tooltip="true" />
      <el-table-column label="姓名" align="center" prop="realName" :show-overflow-tooltip="true" />
      <el-table-column label="性别" align="center" prop="gender">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.gender == 'F' ? '女' : '男' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" align="center" prop="email" :show-overflow-tooltip="true" />
      <el-table-column label="手机号码" align="center" prop="mobilePhone" width="120" :show-overflow-tooltip="true" />
      <el-table-column label="创建时间" align="center" prop="createDate" width="160" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否启用">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enabled"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatusChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="最后登录" align="center" prop="lastLoginTime" width="160" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.lastLoginTime) }}</span>
        </template>
      </el-table-column>
      <!--  每行的操作按钮-->
      <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button
            v-if="scope.row.id !== 1"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-key" @click="handleResetPwd(scope.row)">重置
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      :page-sizes="[5,15,20]"
      @pagination="getList"
    />
    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url"
        :disabled="upload.isUploading"
        :http-request="handleFileUpload"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div slot="tip" class="el-upload__tip" style="color:red">提示：仅允许导入“xls”或“xlsx”格式文件！
          <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加资源或编辑资源弹出的对话框   -->
    <el-dialog :title="isEdit?'编辑用户':'添加用户'" :visible.sync="dialogVisible" width="60%">
      <el-form :model="user" ref="www" label-width="150px" :rules="rules" size="small">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户账号" prop="account">
              <el-input v-model="user.account" placeholder="请输入用户账号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="mobilePhone">
              <el-input v-model="user.mobilePhone" placeholder="请输入手机号码" maxlength="11" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="user.id == undefined" label="用户姓名" prop="realName">
              <el-input v-model="user.realName" placeholder="请输入用户姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="user.id == undefined" label="用户密码" prop="password">
              <el-input v-model="user.password" placeholder="请输入用户密码" type="password" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="user.email" placeholder="请输入邮箱" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="user.enabled">
                <el-radio v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictValue">
                  {{ dict.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户性别">
              <el-select v-model="user.gender" placeholder="请选择">
                <el-option
                  v-for="dict in sexOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色">
              <el-select v-model="user.roleIds" multiple placeholder="请选择">
                <el-option
                  v-for="item in roleOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.enabled == 1"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { listUser, delUser, addUser, updateUser, exportUser, resetUserPwd, importTemplates, batchAddUser,changeUserStatus
} from '@/api/authoraty/user'
import { getToken } from '@/utils/auth'
import fileDownload from 'js-file-download'
import moment from 'moment'
import { listRole } from '@/api/authoraty/role'

// 用于复制给user
const defaultUser = {
  account: '',
  accountNonExpired: 0,
  accountNonLocked: 1,
  avatarUrl: '',
  mobilePhone: '',
  email: '',
  userName: null,
  gender: '',
  password: '',
  userTag: '',
  deleteStatus: 0,
  enabled: 1,
  realName: '',
  roleIds: null
};
export default {
  name: 'User',
  // components: { Treeselect },
  data() {
    return {
      dialogVisible: false,
      isEdit: false,
      user: Object.assign({}, defaultUser), // user为对话框中:model
      defaultRoleId: null,
      loading: true, // 遮罩层
      ids: [], // 多选时选中数组
      single: true, // 非单个禁用
      multiple: true, // 非多个禁用
      showSearch: true, // 显示搜索条件
      total: 0, // 总条数
      userList: null, // 用户表格数据
      open: false, // 是否显示弹出层
      initPassword: undefined, // 默认密码
      dateRange: [], // 日期范围
      statusOptions: [{ dictLabel: '启用', dictValue: 1 }, { dictLabel: '停用', dictValue: 0 }], // 状态数据字典
      sexOptions: [{ dictLabel: '男', dictValue: 'M' }, { dictLabel: '女', dictValue: 'F' }], // 性别状态字典
      roleOptions: [], // 角色选项
      form: {}, // 表单参数
      // 用户导入参数
      upload: {
        open: false, // 是否显示弹出层（用户导入）
        title: '', // 弹出层标题（用户导入）
        isUploading: false, // 是否禁用上传
        updateSupport: 0, // 是否更新已经存在的用户数据
        headers: { Authorization: getToken() }, // 设置上传的请求头部
        url: process.env.VUE_APP_BASE_API + '/sys/user/import' // 上传的地址
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 5,
        account: undefined,
        realName: undefined,
        mobilePhone: undefined,
        enabled: undefined
      },
      // 表单校验
      rules: {
        account: [
          { required: true, message: '用户账号不能为空', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        realName: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' }
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
        mobilePhone: [
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
  computed: {
    newEnable() {
      return this.queryParams.enabled
    }
  },
  watch: {
    newEnable() {
      this.getList()
    }
  },
  created() {
    this.getList();
    this.getRoleList(); // 获取角色
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
    // 获取到角色
    getRoleList(){
      listRole().then(response=>{
        let roleList = response.data.rows ;
        for(let i=0;i<roleList.length;i++) {
          let role = roleList[i];
          this.roleOptions.push({ label: role.roleName,value:role.id});
        }
        this.defaultRoleId = roleList[0].id;
      })
    },
    // 置空参数
    clearParams(val) {
      if (val === 'enabled') {
        this.queryParams.enabled = undefined
      }
      if (val === 'phone') {
        this.queryParams.mobilePhone = undefined
      }
      if (val === 'account') {
        this.queryParams.account = undefined
      }
      if (val === 'date') {
        this.dateRange = []
      }
    },

    // 用户状态修改
    handleStatusChange(row) {
      const type = row.enabled === 1 ? { label: '启用', value: 'enable' } : { label: '停用', value: 'disable' }
      this.$confirm(
        '确认要"' + type.label + '""' + row.account + '"用户吗?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(function() {
        changeUserStatus(row.id, type.value).then(response => {
          this.getList()
        })
      }).catch(function() {
        row.enabled = row.enabled === 0 ? 1 : 0
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 按添加按钮，弹出对话框
    handleAdd() {
      this.dialogVisible = true;
      this.isEdit = false;
      this.user = Object.assign({},defaultUser); // 默认值为空
    },
    // 按修改键弹出对话框（传入当前行的数据）
    handleUpdate(row) {
      this.dialogVisible = true;
      this.isEdit = true;
      this.user = Object.assign({},row);
    },
    // 对话框按确定键之后的方法
    handleDialogConfirm() {
      this.$confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.isEdit) { // 更新资源数据（即编辑修改）
          updateUser(this.user.id,this.user).then(response => {
            this.$message({
              message: '修改成功！',
              type: 'success'
            });
            this.dialogVisible =false;
            this.getList();
          })
        } else { // 插入一条资源数据（即添加）
          addUser(this.user).then(response => {
            this.$message({
              message: '添加成功！',
              type: 'success'
            });
            this.dialogVisible =false;
            this.getList();
          })
        }
      })
    },
    /** 重置密码按钮操作 */
    handleResetPwd(row) {
      this.$prompt('请输入"' + row.account + '"的新密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(({ value }) => {
          resetUserPwd(row.id, value).then((response) => {
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
          // eslint-disable-next-line eqeqeq
          if (this.form.id != undefined) {
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
      const userIds = row.id || this.ids
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
      this.$confirm('是否确认导出所有用户数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          exportUser().then(res => {
            console.log(res)
            const sysDate = moment(new Date()).format('YYYY-MM-DDHHmm')
            console.log(sysDate)
            fileDownload(res, sysDate + '用户信息表.xlsx')
          })
            .catch(err => {
              console.log(err)
            })
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
      importTemplates().then(res => {
        fileDownload(res, '批量用户导入模板.xlsx')
      })
        .catch(err => {
          console.log(err)
        })
    },
    handleFileUpload(val) {
      const formData = new FormData()
      formData.append('file', val.file)
      console.log(val)
      batchAddUser(formData).then(res => {
        val.onSuccess()
      }).catch(res => {
        val.onError()
      })
    },
    // 文件上传成功处理
    handleFileSuccess() {
      this.upload.open = false
      this.upload.isUploading = false
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
.el-row button {
  float: left;
}
</style>
