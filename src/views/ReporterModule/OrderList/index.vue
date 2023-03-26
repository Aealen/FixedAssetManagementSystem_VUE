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
      <el-table-column label="报修人" width="145" align="center">
        <template slot-scope="scope">
          {{ scope.row.orderReporterId }}. {{ scope.row.orderReporter }}
        </template>
      </el-table-column>
      <el-table-column label="负责人" width="145" align="center">
        <template slot-scope="scope">
          {{ scope.row.orderCustodianId }}. {{ scope.row.orderCustodian }}
        </template>
      </el-table-column>
      <el-table-column label="维修员" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.orderWorker }}. {{ scope.row.orderWorkerNickname }}
        </template>
      </el-table-column>
      <el-table-column label="订单状态" width="80" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.orderStatus===0">未处理</el-tag>
          <el-tag v-if="scope.row.orderStatus===1" type="warning">未结算</el-tag>
          <el-tag v-if="scope.row.orderStatus===2" type="success">已完成</el-tag>
          <el-tag v-if="scope.row.orderStatus===3" type="danger">待审核</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="发起时间" width="160" align="center">
        <template slot-scope="scope">
          {{ scope.row.orderUpTime }}
        </template>
      </el-table-column>

      <el-table-column align="left" prop="created_at" label="操作" width="355">
        <template slot-scope="scope">
          <el-button type="primary" @click="showOrderDrawer=true;currSelOrderId=scope.row.id;showOrderInfoDraw()">详细信息</el-button>
          <el-button v-if="!currRid===3" type="danger" @click="delFixedAsset(scope.row.id)">删除此项</el-button>
          <el-button v-if="scope.row.orderStatus===0" type="warning" @click="currOid=scope.row.id;selStatus=1;updateStatus()">处理完成</el-button>
          <el-button v-if="scope.row.orderStatus===1&&currRid===2" type="success" @click="currOid=scope.row.id;selStatus=1;showPayDialog=true;">订单结算</el-button>
          <!--          <el-dropdown>-->
          <!--            <el-link class="el-dropdown-link" type="primary">-->
          <!--              操作列表<i class="el-icon-arrow-down el-icon&#45;&#45;right" />-->
          <!--            </el-link>-->
          <!--            <el-dropdown-menu slot="dropdown">-->
          <!--              <el-dropdown-item><span @click="delFixedAsset(scope.row.id)">删除此项</span></el-dropdown-item>-->
          <!--              <el-dropdown-item><span @click="currOid=scope.row.id;selStatus=scope.row.orderStatus;showStatusDialog=true;">处理完成</span></el-dropdown-item>-->

          <!--            </el-dropdown-menu>-->
          <!--          </el-dropdown>-->
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
      title="订单支付"
      :visible.sync="showPayDialog"
      width="20%"
    >
      TODO 余额：xxxx
      确认支付。。。  余额不足 支付失败
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
      currRid: 0,
      sumCount: 0,
      listLoading: true,
      showOrderDrawer: false,
      currSelOrderId: 0,
      showPayDialog: false,
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
    this.currRid = sessionStorage.getItem('rid')
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
        if (sessionStorage.getItem('rid') === '3') {
          // 维修员 删除待审核订单
          this.list = resp.data
          for (const index in this.list) {
            console.log(this.list[index].orderStatus)
            if (this.list[index].orderStatus === 3) {

              // 待审核
              this.list.splice(index, 1)
            }
          }
        } else {
          this.list = resp.data
        }
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
      this.showPayDialog = false
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
