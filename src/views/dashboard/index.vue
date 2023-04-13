<template>
  <!--  <div class="dashboard-container">-->
  <!--    <div class="dashboard-text">name: {{ username }}</div>-->
  <!--  </div>-->

  <div class="dashboard-editor-container">
    <panel-group @handleSetLineChartData="handleSetLineChartData" />
//save
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <el-col>
        <div id="ordertrend" style="width: 100%;height: 600px" />
      </el-col>
    </el-row>

    <!--    <el-row :gutter="32">-->
    <!--      <el-col :xs="24" :sm="24" :lg="8">-->
    <!--        <div class="chart-wrapper">-->
    <!--          <raddar-chart />-->
    <!--        </div>-->
    <!--      </el-col>-->
    <!--      <el-col :xs="24" :sm="24" :lg="8">-->
    <!--        <div class="chart-wrapper">-->
    <!--          <pie-chart />-->
    <!--        </div>-->
    <!--      </el-col>-->
    <!--      <el-col :xs="24" :sm="24" :lg="8">-->
    <!--        <div class="chart-wrapper">-->
    <!--          <bar-chart />-->
    <!--        </div>-->
    <!--      </el-col>-->
    <!--    </el-row>-->

    <!--    <el-row :gutter="8">-->
    <!--&lt;!&ndash;      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">&ndash;&gt;-->
    <!--&lt;!&ndash;        <transaction-table />&ndash;&gt;-->
    <!--&lt;!&ndash;      </el-col>&ndash;&gt;-->
    <!--      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">-->
    <!--        <todo-list />-->
    <!--      </el-col>-->
    <!--      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">-->
    <!--        <box-card />-->
    <!--      </el-col>-->
    <!--    </el-row>-->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import PanelGroup from '@/views/dashboard/admin/components/PanelGroup'
import moment from 'moment'
import { getOrderCountTrend } from '@/api/order'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  components: {
    PanelGroup

  },
  data() {
    return {
      username: null,

      ordertrendChart: null,

      // date show
      dates: null,
      orderCounts: null
      // lineChartData: lineChartData.newVisitis

    }
  },
  mounted() {
    this.username = sessionStorage.getItem('nickname')
    this.ordertrendChart = this.$echarts.init(document.getElementById('ordertrend'))
    this.drawOrderTrend()
    this.getOrderTrendData()
  },
  created() {
  },
  methods: {
    handleSetLineChartData(type) {
      // this.lineChartData = lineChartData[type]
    },
    drawOrderTrend() {
      const option = {
        title: {
          text: '订单七日趋势'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['订单数量']
        },
        xAxis: {
          type: 'category',
          data: this.dates
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '订单数量',
            data: this.orderCounts,
            type: 'line',
            smooth: true
          }
        ]
      }
      this.ordertrendChart.setOption(option)
    },
    getOrderTrendData() {
      getOrderCountTrend().then(resp => {
        this.dates = resp.data[0].reverse()
        this.orderCounts = resp.data[1].reverse()
        this.drawOrderTrend()
        console.log(this.dates)
        console.log(this.orderCounts)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
