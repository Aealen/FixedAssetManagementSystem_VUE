<template>
  <div>

    <div style="margin-left: 20px">
      新增类型：
      <el-input v-model="addTypeName" style="width: 430px;margin-right: 20px" />
      <el-button type="primary" @click="addtype">提交</el-button>
    </div>
    <el-divider />

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
          {{ scope.row.tid }}
        </template>
      </el-table-column>
      <el-table-column label="类别名" width="180">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>

      <el-table-column align="center" prop="created_at" label="操作" width="350">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" @click="showEditDialog=true;editId=scope.row.tid;editContent=scope.row.name" />
          <el-button type="danger" icon="el-icon-delete" @click="delType(scope.row)" />

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

    <el-dialog
      title="编辑类型名"
      :visible.sync="showEditDialog"
      width="30%"
    >
      <el-input v-model="editContent" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleDialogClose">取 消</el-button>
        <el-button type="primary" @click="editType">确 定</el-button>
      </span>
    </el-dialog>

  </div>

</template>

<script>
import { addType, getAllTypeByPage, getTypeCount, updateTypeInfo } from '@/api/fa'

export default {
  name: 'Index',
  data() {
    return {
      list: null,
      typeOptions: null,
      listLoading: false,
      sumCount: 0,
      showEditDialog: false,
      editContent: '',
      editId: null,
      addTypeName: null,
      pageParams: {
        keyword: null,
        currPage: 1,
        perPage: 10
      }
    }
  },
  created() {
    this.getDatas()
  },
  methods: {
    getDatas() {
      getTypeCount().then(res => {
        if (res.code === 200) {
          this.handleChangePage(this.pageParams.currPage)
          this.sumCount = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleChangePage(val) {
      getAllTypeByPage({ keyword: this.pageParams.keyword, page: val, perPage: this.pageParams.perPage }).then(resp => {
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
    refreshPage() {
      this.getDatas()
      this.pageParams.currPage = 1
      this.$forceUpdate()

    },
    addtype() {
      addType(this.addTypeName).then(resp => {
        if (resp.code === 200) {
          this.$message.success('添加成功')
          this.refreshPage()
        }
      })
    },
    handleDialogClose() {
      this.showEditDialog = false
      this.getDatas()
      this.$forceUpdate()
    },
    delType(row) {
      this.$confirm('此操作将删除该类型项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateTypeInfo({ tid: row.tid, name: row.name, delFlag: 1 }).then(resp => {
          if (resp.code === 200) {
            this.refreshPage()
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
          message: '已取消删除'
        })
      })
    },
    editType() {
      updateTypeInfo({ tid: this.editId, name: this.editContent, delFlag: 0 }).then(resp => {
        if (resp.code === 200) {
          this.refreshPage()
          this.handleDialogClose()
          this.$message({
            type: 'success',
            message: '编辑成功!'
          })
        } else {
          this.$message({
            type: 'error',
            message: resp.msg
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
