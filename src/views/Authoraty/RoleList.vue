<template>
  <div class="app-container">
    <!--搜索框   -->
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true">
      <el-form-item label="角色名称" prop="roleName">
        <el-input
          v-model="queryParams.roleName"
          placeholder="请输入角色名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="enabled">
        <el-select v-model="queryParams.enabled" placeholder="角色状态" clearable size="small" style="width: 120px">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
<!--      <el-form-item label="创建时间"-->
<!--        <el-date-picker-->
<!--          v-model="dateRange"-->
<!--          size="small"-->
<!--          style="width: 240px"-->
<!--          value-format="yyyy-MM-dd"-->
<!--          type="daterange"-->
<!--          range-separator="-"-->
<!--          start-placeholder="开始日期"-->
<!--          end-placeholder="结束日期"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!--各个操作按钮-->
    <el-row :gutter="10" class="mb8">
      <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
      <el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate">修改</el-button>
      <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">删除
      </el-button>
      <el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
      <!--      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>-->
    </el-row>
    <!--表格-->
    <el-table v-loading="loading" :data="roleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="角色编号" prop="id" width="120" />
      <el-table-column label="角色名称" prop="roleName" width="150" />
      <el-table-column label="角色描述" prop="roleDesc" width="300" :show-overflow-tooltip="true" />
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
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-circle-check" @click="handleSelectMenu(scope.row)">分配菜单</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
          <el-button size="mini" type="text" icon="el-icon-circle-check" @click="handleSelectResource(scope.$index,scope.row)">分配资源</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="isEdit?'编辑角色':'添加角色'" :visible.sync="dialogVisible" width="60%">
      <el-form :model="role" ref="www" label-width="150px" :rules="rules" size="small">
        <el-form-item label="角色名称" prop="roleName">-->
          <el-input v-model="role.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="role.enabled">
            <el-radio v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictValue">
              {{ dict.dictLabel }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <!--        <el-form-item label="菜单权限" prop="">-->
        <!--          <el-input v-model="form.roleKey" placeholder="请输入权限字符" />-->
        <!--        </el-form-item>-->
        <el-form-item label="角色描述">
          <el-input v-model="role.roleDesc" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配菜单对话框 -->
    <el-dialog :title="title" :visible.sync="openDataScope" width="500px" append-to-body>
      <el-card class="form-container" shadow="never">
        <el-tree
          :data="menuTreeList"
          show-checkbox
          default-expand-all
          node-key="id"
          ref="tree"
          highlight-current
          :props="defaultProps">
        </el-tree>
        <div style="margin-top: 20px" align="center">
          <el-button type="primary" @click="handleSave()">保存</el-button>
          <el-button @click="handleClear()">清空</el-button>
        </div>

      </el-card>
    </el-dialog>
  </div>
</template>

<script>
import {
  listRole,
  getRole,
  delRole,
  addRole,
  updateRole,
  exportRole,
  dataScope,
  changeRoleStatus,
  listMenuByRole
} from '@/api/authoraty/role'
import { treeselect as menuTreeselect, roleMenuTreeselect,fetchTreeList } from '@/api/authoraty/menu'
// import { treeselect as deptTreeselect, roleDeptTreeselect } from "@/api/authoraty/dept";
// 用于复制给user
const defaultUser = {
  roleDesc: '',
  deleteStatus: 0,
  enabled: 1,
  roleName: ''
  // roleIds: null
};
export default {
  name: 'Role',
  data() {
    return {
      menuTreeList: [],
      roleId:null,
      dialogVisible: false,
      isEdit: false,
      role: Object.assign({}, defaultUser), // user为对话框中:model
      defaultRoleId: null,
      enabled: 0,
      loading: true, // 遮罩层
      ids: [], // 选中数组
      single: true, // 非单个禁用
      multiple: true, // 非多个禁用
      showSearch: true, // 显示搜索条件
      total: 0, // 总条数
      roleList: [], // 角色表格数据
      title: '', // 弹出层标题
      open: false, // 是否显示弹出层
      openDataScope: false, // 是否显示弹出层（数据权限）
      dateRange: [], // 日期范围
      statusOptions: [{ dictLabel: '启用', dictValue: 1 }, { dictLabel: '停用', dictValue: 0 }], // 状态数据字典
      dataScopeOptions: [ // 数据范围选项
        {
          value: '1',
          label: '全部数据权限'
        },
        {
          value: '2',
          label: '自定数据权限'
        },
        {
          value: '3',
          label: '本部门数据权限'
        },
        {
          value: '4',
          label: '本部门及以下数据权限'
        },
        {
          value: '5',
          label: '仅本人数据权限'
        }
      ],
      menuOptions: [], // 菜单列表
      queryParams: { // 查询参数
        pageNum: 1,
        pageSize: 10,
        roleName: undefined,
        enabled: undefined
      },
      form: {}, // 表单参数
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      rules: { // 表单校验
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        roleKey: [
          { required: true, message: '权限字符不能为空', trigger: 'blur' }
        ],
        roleSort: [
          { required: true, message: '角色顺序不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    newEnable() {
      return this.queryParams.enabled
    },
    newAccount() {
      return this.queryParams.roleName
    }
  },
  watch: {
    newEnable(val) {
      this.queryParams.enabled = val === '' ? undefined : val
      this.getList()
    },
    newAccount(val) {
      this.queryParams.roleName = val === '' ? undefined : val
    }
  },
  created() {
    this.getList();
    this.treeList();
    this.getRoleMenu(this.roleId);
  },
  methods: {
    /** 查询角色列表 */
    getList() {
      this.loading = true
      listRole(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.roleList = response.data.rows
          this.total = response.data.total
          this.loading = false
        }
      )
    },
    treeList() {
      fetchTreeList().then(response => {
        this.menuTreeList = response.data;
      });
    },
    handleSelectResource(index,row){
      this.$router.push({path:'/allocResource',query:{roleId:row.id}})
    },
    getRoleMenu(roleId){
      listMenuByRole(roleId).then(response=>{
        let menuList = response.data;
        let checkedMenuIds=[];
        if(menuList!=null&&menuList.length>0){
          for(let i=0;i<menuList.length;i++){
            let menu = menuList[i];
            if(menu.parentId!==0){
              checkedMenuIds.push(menu.id);
            }
          }
        }
        this.$refs.tree.setCheckedKeys(checkedMenuIds);
      });
    },
    //  保存分配的菜单
    handleSave() {
      let checkedNodes = this.$refs.tree.getCheckedNodes();
      let checkedMenuIds=new Set();
      if(checkedNodes!=null&&checkedNodes.length>0){
        for(let i=0;i<checkedNodes.length;i++){
          let checkedNode = checkedNodes[i];
          checkedMenuIds.add(checkedNode.id);
          if(checkedNode.parentId!==0){
            checkedMenuIds.add(checkedNode.parentId);
          }
        }
      }
      this.$confirm('是否分配菜单？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        let params = new URLSearchParams();
        params.append("roleId",this.roleId);
        params.append("menuIds",Array.from(checkedMenuIds));
        allocMenu(params).then(response => {
          this.$message({
            message: '分配成功',
            type: 'success',
            duration: 1000
          });
          this.$router.back();
        })
      })
    },
    // 清空保存的菜单
    handleClear() {
      this.$refs.tree.setCheckedKeys([]);
    },
    /** 查询菜单树结构 */
    getMenuTreeselect() {
      menuTreeselect().then(response => {
        this.menuOptions = response.data
      })
    },
    // 所有菜单节点数据
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      const checkedKeys = this.$refs.menu.getHalfCheckedKeys()
      // 半选中的菜单节点
      const halfCheckedKeys = this.$refs.menu.getCheckedKeys()
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
      return checkedKeys
    },
    /** 根据角色ID查询菜单树结构 */
    getRoleMenuTreeselect(roleId) {
      return roleMenuTreeselect(roleId).then(response => {
        this.menuOptions = response.menus
        return response
      })
    },
    // 角色状态修改
    handleStatusChange(row) {
      // console.log(row)
      const type = row.enabled === 1 ? { label: '启用', value: 'enable' } : { label: '停用', value: 'disable' }
      this.$confirm('确认要"' + type.label + '""' + row.roleName + '"角色吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        changeRoleStatus(row.id, type.value).then(response => {
          this.getList()
        })
      }).catch(function() {
        row.enabled = row.enabled === 0 ? 1 : 0
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 取消按钮（数据权限）
    cancelDataScope() {
      this.openDataScope = false
      this.reset()
    },
    // 表单重置
    reset() {
      if (this.$refs.menu !== undefined) {
        this.$refs.menu.setCheckedKeys([])
      }
      this.form = {
        roleId: undefined,
        roleName: undefined,
        enabled: undefined,
        remark: undefined
      }
      this.resetForm('form')
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
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 按添加按钮，弹出对话框
    handleAdd() {
      this.dialogVisible = true;
      this.isEdit = false;
      this.user = Object.assign({},defaultUser); // 默认值为空
    },
    handleSelectMenu(row){
      this.openDataScope = true;
    },
    // 按修改键弹出对话框（传入当前行的数据）
    handleUpdate(row) {
      this.dialogVisible = true;
      this.isEdit = true;
      this.role = Object.assign({},row);
    },
    // 对话框按确定键之后的方法
    handleDialogConfirm() {
      this.$confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.isEdit) { // 更新资源数据（即编辑修改）
          updateRole(this.role.id,this.role).then(response => {
            this.$message({
              message: '修改成功！',
              type: 'success'
            });
            this.dialogVisible =false;
            this.getList();
          })
        } else { // 插入一条资源数据（即添加）
          addRole(this.role).then(response => {
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
    /** 分配数据权限操作 */
    // handleDataScope(row) {
    //   this.reset()
    //   const roleDeptTreeselect = this.getRoleDeptTreeselect(row.roleId)
    //   getRole(row.roleId).then(response => {
    //     this.form = response.data
    //     this.openDataScope = true
    //     this.$nextTick(() => {
    //       roleDeptTreeselect.then(res => {
    //         this.$refs.dept.setCheckedKeys(res.checkedKeys)
    //       })
    //     })
    //     this.title = '分配数据权限'
    //   })
    // },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.roleId != undefined) {
            this.form.menuIds = this.getMenuAllCheckedKeys()
            updateRole(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              }
            })
          } else {
            this.form.menuIds = this.getMenuAllCheckedKeys()
            addRole(this.form).then(response => {
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
    /** 提交按钮（数据权限） */
    submitDataScope: function() {
      if (this.form.roleId != undefined) {
        this.form.deptIds = this.getDeptAllCheckedKeys()
        dataScope(this.form).then(response => {
          if (response.code === 200) {
            this.msgSuccess('修改成功')
            this.openDataScope = false
            this.getList()
          }
        })
      }
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      // console.log(row)
      const roleIds = row.id || this.ids
      this.$confirm('是否确认删除角色编号为"' + roleIds + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delRole(roleIds)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      this.$confirm('是否确认导出所有角色数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return exportRole(queryParams)
      }).then(response => {
        this.download(response.msg)
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
</style>
