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
          {{scope.row.id}}
        </template>
      </el-table-column>
      <el-table-column label="昵称" width="140">
        <template slot-scope="scope">
          {{ scope.row.nickname }}
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="140" align="center">
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
          {{ scope.row.deptId}}.{{ scope.row.deptName}}
        </template>
      </el-table-column>
      <el-table-column label="用户权限" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.roleId}}.{{ scope.row.roleName}}
        </template>
      </el-table-column>
      <el-table-column label="上次登陆" width="190" align="center">
        <template slot-scope="scope">
          {{ scope.row.loginTime}}
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="Status" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="Display_time" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.display_time }}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :page-size="pageParams.perPage"
      :pager-count="5"
      layout="prev, pager, next"
      :total="this.sumCount"
      :current-page="pageParams.currPage"
      @current-change="handleChangePage"
    />
  </div>
</template>

<script>
import { getList } from '@/api/table'
import { getUserViewsCount, getUserViewsByPage } from '@/api/user'
import request from '@/utils/request'

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
  data() {
    return {
      list: null,
      pageParams: {
        keyword: null,
        currPage: 1,
        perPage: 10
      },
      sumCount: 0,
      listLoading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {

    fetchData() {
      this.listLoading = true
      getUserViewsCount().then(response => {
        console.log(response)

        if (response.code !== 200) {
          this.$message.error(response.msg)
        }
        this.handleChangePage(this.pageParams.currPage)

        this.sumCount = response.data
      }).catch(error => {
        this.$message.error(error)
      })
    },
    handleChangePage(val) {
      request({
        url: '/user/queryUserByPage',
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
    }
  }
}
</script>
