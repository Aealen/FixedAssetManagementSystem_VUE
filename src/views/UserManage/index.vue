<template>
  <div class="app-container">
    <el-input
      v-model="pageParams.keyword"
      placeholder="搜索关键字"
      clearable
      style="width: 50%"
    />
    <el-button type="primary" style="width: 100px;" @click="getSearch()">搜索</el-button>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          <!--          {{ scope.$index }}-->
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="昵称" width="180">
        <template slot-scope="scope">
          {{ scope.row.nickname }}
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column label="联系电话" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.phoneNum }}
        </template>
      </el-table-column>
      <el-table-column label="电子邮箱" width="210" align="center">
        <template slot-scope="scope">
          {{ scope.row.email }}
        </template>
      </el-table-column>
      <el-table-column label="所在部门" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.deptId }}.{{ scope.row.deptName }}
        </template>
      </el-table-column>
      <el-table-column label="用户权限" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.roleId }}.{{ scope.row.roleName }}
        </template>
      </el-table-column>
      <el-table-column label="上次登陆" width="190" align="center">
        <template slot-scope="scope">
          {{ scope.row.loginTime }}
        </template>
      </el-table-column>

      <el-table-column align="center" prop="created_at" label="操作" width="350">
        <template slot-scope="scope">
          <el-link class="text_link" type="primary" @click="showUserDrawer=true;currSelUserId=scope.row.id;showUserManagerDrawer()">详细信息</el-link>
          <el-dropdown>
            <el-link class="el-dropdown-link" type="primary">
              操作列表<i class="el-icon-arrow-down el-icon--right" />
            </el-link>

            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item><span @click="resetPassword(scope.row.id)">重置密码</span></el-dropdown-item>
              <el-dropdown-item><span @click="getRoles(scope.row.id);">权限修改</span></el-dropdown-item>
              <el-dropdown-item><span @click="getDepts(scope.row.id);">部门修改</span></el-dropdown-item>
              <el-dropdown-item><span @click="delUser(scope.row.id);">删除用户</span></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :page-size="pageParams.perPage"
      :pager-count="5"
      layout="prev, pager, next"
      :total="sumCount"
      :current-page="pageParams.currPage"
      @current-change="handleChangePage"
    />

    <UserManagerDrawer :user-id="currSelUserId" :show-user-drawer="showUserDrawer" @closeUserManagerDrawer="closeUserMangerDrawer()" />

    <el-dialog
      title="角色选择"
      :visible.sync="showUserRoleDialog"
      width="20%"
    >
      <el-select v-model="selRole" placeholder="请选择">
        <el-option
          v-for="item in roleOptions"
          :key="item.rid"
          :label="item.name"
          :value="item.rid"
        />
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleDialogClose">取 消</el-button>
        <el-button type="primary" @click="setUR();">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="部门选择"
      :visible.sync="showUserDeptDialog"
      width="20%"
    >
      <el-select v-model="selDept" placeholder="请选择">
        <el-option
          v-for="item in deptOptions"
          :key="item.did"
          :label="item.name"
          :value="item.did"
        />
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleDialogClose">取 消</el-button>
        <el-button type="primary" @click="setDept();">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import UserManagerDrawer from '@/components/UserManagerDraw/index'
import { delUser, getUserSearchCount, getUserViewsByPage, getUserViewsCount, resetUserPassword } from '@/api/user'
import { setUserRole } from '@/api/role'
import { getAllDepts, setUserDept } from '@/api/depts'
import request from '@/utils/request'
import { Message } from 'element-ui'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  components: {
    UserManagerDrawer
  },
  data() {
    return {
      list: null,
      pageParams: {
        keyword: '',
        currPage: 1,
        perPage: 10
      },
      sumCount: 0,
      listLoading: true,
      showUserDrawer: false,
      currSelUserId: 0,

      showUserRoleDialog: false,
      roleOptions: null,
      selRole: null,
      selUid: null,

      showUserDeptDialog: false,
      deptOptions: null,
      selDept: null

    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async getSearch() {
      this.listLoading = true
      // 获取搜索结果的条数
      await this.fetchData()

      await getUserSearchCount(this.pageParams.keyword, this.pageParams.currPage, this.pageParams.perPage).then(resp => {
        if (resp.code === 200) {
          this.sumCount = resp.data
        }
      })

      this.listLoading = false
      this.$forceUpdate()
    },
    fetchData() {
      this.listLoading = true
      getUserViewsCount().then(response => {
        // console.log(response)

        if (response.code !== 200) {
          this.$message.error(response.msg)
        }
        this.handleChangePage(this.pageParams.currPage)

        this.sumCount = response.data
      }).catch(error => {
        this.$message.error(error)
      })
    },

    getDepts(uid) {
      getAllDepts()
        .then(resp => {
          if (resp.code === 200) {
            this.deptOptions = resp.data
            this.selUid = uid
            this.showUserDeptDialog = true
          } else {
            this.$message.error(resp.msg)
          }
        })
    },
    setDept() {
      setUserDept(this.selUid, this.selDept).then(resp => {
        if (resp.code === 200) {
          this.showUserDeptDialog = false
          this.$message.success('修改成功!')
          this.fetchData()
          this.$forceUpdate()
        } else {
          this.$message.error(resp.msg)
        }
      })
    },
    setUR() {
      setUserRole(this.selUid, this.selRole).then(resp => {
        if (resp.code === 200) {
          this.showUserRoleDialog = false
          this.$message.success('修改成功!')
          this.fetchData()
          this.$forceUpdate()
        } else {
          this.$message.error(resp.msg)
        }
      })
    },

    getRoles(uid) {
      // 获取所有角色信息
      request({
        url: '/role/getAllRoles',
        method: 'get'
      }).then(resp => {
        if (resp.code === 200) {
          this.roleOptions = resp.data
          this.selUid = uid
          this.showUserRoleDialog = true
        } else {
          this.$message.error(resp.msg)
        }
      })
    },

    handleDialogClose() {
      this.showUserRoleDialog = false
      this.showUserDeptDialog = false
      this.$message({
        type: 'info',
        message: '已取消操作'
      })
    },

    handleChangePage(val) {
      getUserViewsByPage(this.pageParams.keyword, val, this.pageParams.perPage).then(resp => {
        if (resp.code !== 200) {
          this.$message.error(resp.msg)
        }
        this.list = resp.data
        this.listLoading = false
      }).catch(err => {
        console.log(err)
        this.listLoading = false
      })
    },

    resetPassword(uid) {
      // 1.给出提示确认  2.重置密码 3.返回结果
      this.$confirm('此操作将会重置用户密码, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        resetUserPassword(uid).then(resp => {
          if (resp.code === 200) {
            this.$message({
              type: 'success',
              message: '重置密码为: password'
            })
          } else {
            this.$message({
              type: 'error',
              message: resp.msg
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    delUser(uid) {
      this.$confirm('此操作将会删除用户!!!, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delUser(uid).then(resp => {
          if (resp.code === 200) {
            this.fetchData()
            this.$forceUpdate()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          } else {
            this.$message({
              type: 'error',
              message: resp.msg
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    showUserManagerDrawer() {
      this.showUserDrawer
      console.log(this.showUserDrawer)
    },
    closeUserMangerDrawer() {
      console.log('parent:' + this.showUserDrawer)
      this.showUserDrawer = false
      console.log('parent:' + this.showUserDrawer)
    }
  }
}
</script>

<style lang="css" scoped>
.text_link{
  margin-right:20px
}
</style>
