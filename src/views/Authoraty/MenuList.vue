<template>
  <div class="app-container">
    <!--   添加按钮-->
    <el-card class="operate-container" shadow="never">
<!--      <i class="el-icon-tickets" style="margin-top: 5px"></i>-->
<!--      <span style="margin-top: 5px">数据列表</span>-->
      <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
    </el-card>
    <!--  表格    -->
    <div class="table-container">
      <el-table ref="menuTable" style="width: 100%" :data="list" v-loading="listLoading">
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope" v-modle="queryParams.parentId">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="菜单名称" align="center">
          <template slot-scope="scope">{{scope.row.title}}</template>
        </el-table-column>
        <el-table-column label="菜单级数" width="100" align="center">
          <template slot-scope="scope">{{scope.row.level | levelFilter}}</template>
        </el-table-column>
        <el-table-column label="前端名称" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="前端图标" width="100" align="center">
          <template slot-scope="scope"><i :class="'el-icon-'+scope.row.icon" /></template>
        </el-table-column>
        <el-table-column label="是否显示" width="100" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleHiddenChange(scope.$index, scope.row)"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.enabled">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="排序" width="100" align="center">
          <template slot-scope="scope">{{scope.row.sort }}</template>
        </el-table-column>
        <el-table-column label="设置" width="120" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              :disabled="scope.row.menuType | disableNextLevel"
              @click="handleShowNextLevel(scope.$index, scope.row)">查看下级
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleUpdate(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="queryParams.pageSize"
        :page-sizes="[10,25,50]"
        :current-page.sync="queryParams.pageNum"
        :total="total">
      </el-pagination>
    </div>


    <!-- 添加或修改菜单配置对话框 -->
    <el-dialog :title="isEdit?'编辑菜单':'添加菜单'" :visible.sync="dialogVisible" width="60%">
      <el-form :model="menu" ref="www" label-width="150px" :rules="rules" size="small">
        <el-form-item label="菜单名称：" prop="title">
          <el-input v-model="menu.title"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单：">
          <el-select v-model="menu.parentId" placeholder="请选择菜单">
            <el-option
              v-for="item in selectMenuList"
              :key="item.id"
              :label="item.title"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="前端名称：" prop="name">
          <el-input v-model="menu.name"></el-input>
        </el-form-item>
        <el-form-item label="前端图标：" prop="icon">
          <el-input v-model="menu.icon" style="width: 80%"></el-input>
          <svg-icon style="margin-left: 8px" :icon-class="menu.icon"></svg-icon>
        </el-form-item>
        <el-form-item label="是否显示：">
          <el-radio-group v-model="menu.enabled">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>



        <el-form-item label="排序：">
          <el-input v-model="menu.sort"></el-input>
        </el-form-item>
<!--        <el-form-item>-->
<!--          <el-button type="primary" @click="onSubmit('menuFrom')">提交</el-button>-->
<!--          <el-button v-if="!isEdit" @click="resetForm('menuFrom')">重置</el-button>-->
<!--        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import {fetchList, deleteMenu, updateMenu, updateEnable, createMenu, getMenu} from '@/api/authoraty/menu'
import {addRole, updateRole} from "@/api/authoraty/role";
// 用于复制给user
const defaultMenu = {
  deleteStatus: 0,
  enabled: 1,
  level: 0,
  menuType: 0,
  parentId: 0,
  sort: 0,
  name: '',
  icon: '',
  title: ''
};
export default {
  name: "menuList",
  // props: {
  //   isEdit: {
  //     type: Boolean,
  //     default: false
  //   }
  // },
  data() {
    return {
      dialogVisible: false,
      isEdit: false,
      menu: Object.assign({}, defaultMenu), // menu为对话框中:model
      list: [],
      total: null,
      listLoading: true,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        menuType: 0,
        parentId: '0'
      },
      parentId: 0,
      selectMenuList: [],
      rules: {
        title: [
          {required: true, message: '请输入菜单名称', trigger: 'blur'},
          {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
        ],
        name: [
          {required: true, message: '请输入前端名称', trigger: 'blur'},
          {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
        ],
        icon: [
          {required: true, message: '请输入前端图标', trigger: 'blur'},
          {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
        ]
      }
    }
  },
  created() {
    this.resetParentId();
    this.getList();
    if (this.isEdit) {
      getMenu(this.$route.query.id).then(response => {
        this.menu = response.data;
      });
    } else {
      this.menu = Object.assign({}, defaultMenu);
    }
    // this.getSelectMenuList();
  },
  methods: {
    resetParentId(){
      this.queryParams.pageNum = 1
      if (this.$route.query.parentId != null) {
        this.parentId = this.$route.query.parentId
      } else {
        this.parentId = 0;
      }
    },
    // 按添加按钮，弹出对话框
    handleAdd() {
      this.dialogVisible = true;
      this.isEdit = false;
      this.menu = Object.assign({},defaultMenu); // 默认值为空
    },
    // 按修改键弹出对话框（传入当前行的数据）
    handleUpdate(index, row) {
      console.log('row' + row)
      this.dialogVisible = true;
      this.isEdit = true;
      this.menu = Object.assign({},row);
    },
    // 对话框按确定键之后的方法
    handleDialogConfirm() {
      if (this.isEdit) { // 更新资源数据（即编辑修改）
        updateMenu(this.menu.id,this.menu).then(response => {
          this.$message({
            message: '修改成功！',
            type: 'success'
          });
          this.dialogVisible = false
          this.getList()
        })
      } else { // 插入一条资源数据（即添加）
        createMenu(this.menu).then(response => {
          this.$message({
            message: '添加成功！',
            type: 'success'
          });
          this.dialogVisible =false;
          this.getList();
        })
      }
    },
    // 获取列表数据
    getList() {
      this.listLoading = true
      fetchList(this.queryParams).then(response => {
        this.listLoading = false
        this.list = response.data.rows
        this.total = response.data.total
      })
    },
    handleSizeChange(val) {
      this.queryParams.pageNum = 1
      this.queryParams.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getList()
    },
    handleHiddenChange(index, row) {
      updateEnable(row.id, row.enabled).then(response =>{
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 1000
        });
      });
    },
    handleShowNextLevel(index, row) {
      this.queryParams.parentId = row.id
      fetchList(this.queryParams).then(response => {
        this.listLoading = false
        this.list = response.data.rows
        this.total = response.data.total
      })
    },
/*    getSelectMenuList() {
      fetchList(0, {pageSize: 100, pageNum: 1}).then(response => {
        this.selectMenuList = response.data.list;
        this.selectMenuList.unshift({id: 0, title: '无上级菜单'});
      });
    },*/
    // onSubmit(formName) {
    //   this.$refs[formName].validate((valid) => {
    //     if (valid) {
    //       this.$confirm('是否提交数据', '提示', {
    //         confirmButtonText: '确定',
    //         cancelButtonText: '取消',
    //         type: 'warning'
    //       }).then(() => {
    //         if (this.isEdit) {
    //           updateMenu(this.$route.query.id, this.menu).then(response => {
    //             this.$message({
    //               message: '修改成功',
    //               type: 'success',
    //               duration: 1000
    //             });
    //             this.$router.back();
    //           });
    //         } else {
    //           createMenu(this.menu).then(response => {
    //             this.$refs[formName].resetFields();
    //             this.resetForm(formName);
    //             this.$message({
    //               message: '提交成功',
    //               type: 'success',
    //               duration: 1000
    //             });
    //             this.$router.back();
    //           });
    //         }
    //       });
    //
    //     } else {
    //       this.$message({
    //         message: '验证失败',
    //         type: 'error',
    //         duration: 1000
    //       });
    //       return false;
    //     }
    //   });
    // },
    // resetForm(formName) {
    //   this.$refs[formName].resetFields();
    //   this.menu = Object.assign({}, defaultMenu);
    //   this.getSelectMenuList();
    // },
    handleDelete(index, row) {
      this.$confirm('是否要删除该菜单', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMenu(row.id).then(response => {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 1000
          });
          this.getList();
        });
      });
    }
  },
  filters: {
    levelFilter(value) {
      if (value === 0) {
        return '一级'
      } else if (value === 1) {
        return '二级'
      } else if (value === 2) {
        return '三级'
      } else {
        return '四级'
      }
    },
    disableNextLevel(value) {
      if (value === 1) {
        return false
      } else {
        return true
      }
    }
  }
}
</script>

<style scoped>
  .el-card{
    border: 0px;
  }
</style>
