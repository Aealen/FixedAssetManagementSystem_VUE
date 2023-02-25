<template>
  <div>
    <el-drawer
      title="详细信息"
      :visible.sync="showOrderDrawer"
      :before-close="handleClose"
    >
      <el-descriptions class="margin-top" :column="4" border>
        <el-descriptions-item span="4">
          <template slot="label">
            <i class="el-icon-user" />
            订单描述
          </template>
          <span>{{ currOrderData.orderDesc }}</span>
        </el-descriptions-item>
        <el-descriptions-item span="4">
          <template slot="label">
            <i class="el-icon-user" />
            涉及资产
          </template>
          <span>{{ currOrderData.faName }}</span>
        </el-descriptions-item>
        <el-descriptions-item span="4">
          <template slot="label">
            <i class="el-icon-user" />
            资产型号
          </template>
          <span>{{ currOrderData.faModel }}</span>
        </el-descriptions-item>
        <el-descriptions-item span="4">
          <template slot="label">
            <i class="el-icon-user" />
            单价
          </template>
          <span>{{ currOrderData.faPrice }}</span>
        </el-descriptions-item>

        <el-descriptions-item span="4">
          <template slot="label">
            <i class="el-icon-user" />
            资产类型
          </template>
          <span>{{ currOrderData.faTid }}.{{ currOrderData.faTypeName }}</span>
        </el-descriptions-item>

        <el-descriptions-item span="4">
          <template slot="label">
            <i class="el-icon-user" />
            所属部门
          </template>
          <span>{{ currOrderData.faDid }}.{{ currOrderData.faDeptName }}</span>
        </el-descriptions-item>

        <el-descriptions-item span="4">
          <template slot="label">
            <i class="el-icon-user" />
            负责人
          </template>
          <span>{{ currOrderData.orderCustodianId }}.{{ currOrderData.orderCustodian }}</span>
        </el-descriptions-item>
        <el-descriptions-item span="4">
          <template slot="label">
            <i class="el-icon-user" />
            报修人
          </template>
          <span>{{ currOrderData.orderReporterId }}.{{ currOrderData.orderReporter }}</span>
        </el-descriptions-item>
        <el-descriptions-item span="4">
          <template slot="label">
            <i class="el-icon-user" />
            报修时间
          </template>
          <span>{{ currOrderData.orderUpTime }}</span>
        </el-descriptions-item>

      </el-descriptions>

    </el-drawer>

  </div>
</template>

<script>
import { getOrderByID } from '@/api/order'

export default {
  name: 'OrderInfoDraw',
  props: {
    showOrderDrawer: {
      type: Boolean,
      default: false
    },
    orderID: {
      type: Number,
      default: 0
    }

  },
  data() {
    return {
      currOrderData: []
    }
  },

  updated() {
    this.getData()
  },
  methods: {
    getData() {
      getOrderByID(this.orderID).then(resp => {
        if (resp.code !== 200) {
          this.$message.error(resp.msg)
        }
        this.currOrderData = resp.data
        // this.listLoading = false
      }).catch(err => {
        console.log(err)
        // this.listLoading = false
      })
    },
    handleClose(done) {
      this.$emit('closeOrderInfoDraw')
    }
  }
}
</script>

<style scoped>

</style>
