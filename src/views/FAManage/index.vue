<template>
  <div class="app-container">
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
      <el-table-column label="资产名" width="180">
        <template slot-scope="scope">
          {{ scope.row.faName }}
        </template>
      </el-table-column>
      <el-table-column label="型号" width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.faModel }}</span>
        </template>
      </el-table-column>

      <el-table-column label="生产厂商" width="220" align="center">
        <template slot-scope="scope">
          {{ scope.row.faProducer }}
        </template>
      </el-table-column>
      <el-table-column label="单价" width="210" align="center">
        <template slot-scope="scope">
          {{ scope.row.faPrice }}
        </template>
      </el-table-column>
      <el-table-column label="所属分类" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.faTid }}.{{ scope.row.faTypeName }}
        </template>
      </el-table-column>
      <el-table-column label="所属部门" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.faDid }}.{{ scope.row.faDeptName }}
        </template>
      </el-table-column>
      <el-table-column label="负责人" width="190" align="center">
        <template slot-scope="scope">
          {{ scope.row.faCustodianId }}. {{ scope.row.faCustodian }}
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
              <el-dropdown-item><span @click="delFixedAsset(scope.row.id)">删除此项</span></el-dropdown-item>

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
import request from '@/utils/request'
import { delFa, getFaCount } from '@/api/fa'

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
        keyword: null,
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

    fetchData() {
      this.listLoading = true
      getFaCount().then(response => {
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

    handleDialogClose() {
      this.showUserRoleDialog = false
      this.showUserDeptDialog = false
      this.$message({
        type: 'info',
        message: '已取消操作'
      })
    },
    delFixedAsset(fid) {
      this.$confirm('此操作将会删除此项!!!, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delFa(fid).then(resp => {
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
    handleChangePage(val) {
      request({
        url: '/fa/queryFaByPage',
        method: 'post',
        data: {
          'keyword': this.pageParams.keyword,
          'page': val,
          'perPage': this.pageParams.perPage
        }
      }).then(resp => {
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
