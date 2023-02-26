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
      <el-table-column label="订单描述" width="180">
        <template slot-scope="scope">
          {{ scope.row.orderDesc }}
        </template>
      </el-table-column>
      <el-table-column label="资产名" width="100">
        <template slot-scope="scope">
          {{ scope.row.faName }}
        </template>
      </el-table-column>
      <el-table-column label="资产型号" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.faModel }}</span>
        </template>
      </el-table-column>

      <el-table-column label="单价" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.faPrice }}
        </template>
      </el-table-column>
      <el-table-column  label="报修人" width="160" align="center">
        <template slot-scope="scope">
          {{ scope.row.orderReporterId }}. {{ scope.row.orderReporter }}
        </template>
      </el-table-column>
      <el-table-column label="负责人" width="160" align="center">
        <template slot-scope="scope">
          {{ scope.row.orderCustodianId }}. {{ scope.row.orderCustodian }}
        </template>
      </el-table-column>
      <el-table-column label="维修员" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.orderWorker }}. {{ scope.row.orderWorkerNickname }}
        </template>
      </el-table-column>
      <el-table-column label="订单状态" width="130" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.orderStatus===0">未处理</span>
          <span v-if="scope.row.orderStatus===1">未结算</span>
          <span v-if="scope.row.orderStatus===2">已完成</span>
        </template>
      </el-table-column>
      <el-table-column label="发起时间" width="160" align="center">
        <template slot-scope="scope">
          {{ scope.row.orderUpTime }}
        </template>
      </el-table-column>

      <el-table-column align="center" prop="created_at" label="操作" width="250">
        <template slot-scope="scope">
          <el-link class="text_link" type="primary" @click="showOrderDrawer=true;currSelOrderId=scope.row.id;showOrderInfoDraw()">详细信息</el-link>
          <el-dropdown>
            <el-link class="el-dropdown-link" type="primary">
              操作列表<i class="el-icon-arrow-down el-icon--right" />
            </el-link>

            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item><span @click="delFixedAsset(scope.row.id)">删除此项</span></el-dropdown-item>
              <el-dropdown-item><span @click="currOid=scope.row.id;selStatus=scope.row.orderStatus;showStatusDialog=true;">修改状态</span></el-dropdown-item>

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

    <OrderInfoDrawer :order-i-d="currSelOrderId" :show-order-drawer="showOrderDrawer" @closeOrderInfoDraw="closeOrderInfoDraw()" />
    <el-dialog
      title="订单状态更新"
      :visible.sync="showStatusDialog"
      width="20%"
    >
      <el-select v-model="selStatus" placeholder="请选择">
        <el-option
          v-for="item in statusOption"
          :key="item.key"
          :label="item.value"
          :value="item.key"
        />
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleDialogClose">取 消</el-button>
        <el-button type="primary" @click="updateStatus();">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import OrderInfoDrawer from '@/components/OrderInfoDrawer/index'
import {
  delOrder,
  getOrderByPage,
  getOrderByPageAndRole,
  getOrderCount,
  getOrderCountByRole,
  updateOrderStatus
} from '@/api/order'

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
    OrderInfoDrawer
  },
  data() {
    return {
      // 区分报修员和维修员
      list: null,
      pageParams: {
        keyword: null,
        currPage: 1,
        perPage: 10
      },
      sumCount: 0,
      listLoading: true,
      showOrderDrawer: false,
      currSelOrderId: 0,
      showStatusDialog: false,
      selStatus: null,
      currOid: null,
      statusOption: [
        {
          key: 0,
          value: '未处理'
        },
        {
          key: 1,
          value: '未结算'
        },
        {
          key: 2,
          value: '已完成'
        }
      ]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {

    fetchData() {
      this.listLoading = true

      // 区分报修员2 和维修员3 和 负责人4  session中的rid
      getOrderCountByRole(sessionStorage.getItem('rid'), sessionStorage.getItem('uid')).then(response => {
        // console.log(response)
        if (response.code === 200) {
          this.handleChangePage(this.pageParams.currPage)
        }
        console.log('sum:' + response.data)
        this.sumCount = response.data
      }).catch(error => {
        this.$message.error(error)
      })
    },
    delFixedAsset(oid) {
      this.$confirm('继续操作将会删除此项!!!, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delOrder(oid).then(resp => {
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
      getOrderByPageAndRole({
        'keyword': this.pageParams.keyword,
        'page': val,
        'perPage': this.pageParams.perPage,
        'rid': sessionStorage.getItem('rid'),
        'uid': sessionStorage.getItem('uid')
      }
      ).then(resp => {
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
    updateStatus() {
      updateOrderStatus(this.currOid, this.selStatus).then(resp => {
        if (resp.code === 200) {
          this.$message.success('修改成功！')
          this.handleDialogClose()
        }
      })
    },
    async handleDialogClose() {
      this.showStatusDialog = false
      await this.fetchData()
      this.$forceUpdate()
    },
    showOrderInfoDraw() {
      this.showOrderDrawer = true
    },
    async closeOrderInfoDraw() {
      this.showOrderDrawer = false
      await this.fetchData()
      this.$forceUpdate()
    }
  }
}
</script>

<style lang="css" scoped>
.text_link{
  margin-right:20px
}
</style>
