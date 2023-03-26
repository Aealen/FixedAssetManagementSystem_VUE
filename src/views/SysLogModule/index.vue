<template>
  <div>
    <el-table
      v-loading="tableLoading"
      :data="tableData"
      border

      style="width: 100%"
    >
      <el-table-column
        prop="id"
        label="ID"
        width="50"
      />
      <el-table-column
        prop="position"
        label="模块"
        width="180"
      />
      <el-table-column
        prop="operator"
        label="操作员"
        width="100"
      />
      <el-table-column
        prop="content"
        label="日志内容"
        width="1000"
      />
      <el-table-column
        prop="time"
        label="生成时间"
      />
    </el-table>
    <el-pagination
      :page-size="pageParams.perPage"
      :pager-count="5"
      layout="prev, pager, next"
      :total="sumCount"
      :current-page="pageParams.currPage"
      @current-change="handleChangePage"
    />
  </div>

</template>

<script>
import { getAllLogs, getAllLogsByPage, getLogsCount } from '@/api/syslogs'

export default {
  name: 'Syslog',
  data() {
    return {
      tableData: [],
      tableLoading: true,
      pageParams: {
        keyword: null,
        currPage: 1,
        perPage: 12
      },
      sumCount: 0

    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    getLogs() {
      getAllLogs().then(resp => {
        if (resp.code === 200) {
          this.tableData = resp.data
          this.tableLoading = false
        }
      })
    },
    fetchData() {
      this.tableLoading = true
      getLogsCount().then(response => {
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
    handleChangePage(val) {
      getAllLogsByPage(
        val,
        this.pageParams.perPage
      ).then(resp => {
        if (resp.code !== 200) {
          this.$message.error(resp.msg)
        }
        this.tableData = resp.data
        this.tableLoading = false
      }).catch(err => {
        this.tableLoading = false
      })
    }
  }

}
</script>

<style scoped>

</style>
