<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-icon-wrapper icon-people">
          <!--          <svg-icon icon-class="peoples" class-name="card-panel-icon" />-->
          <i class="el-icon-user-solid card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            系统用户数
          </div>
          <count-to :start-val="0" :end-val="currUserCount" :duration="2300" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('messages')">
        <div class="card-panel-icon-wrapper icon-message">
          <!--          <svg-icon icon-class="message" class-name="card-panel-icon" />-->
          <i class="el-icon-s-data card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            固定资产数
          </div>
          <count-to :start-val="0" :end-val="currFACount" :duration="2300" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper icon-money">
          <!--          <svg-icon icon-class="money" class-name="card-panel-icon" />-->
          <i class="el-icon-s-order card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            已处理订单数
          </div>
          <count-to :start-val="0" :end-val="currOrderCount" :duration="2300" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-shopping">
          <!--          <svg-icon icon-class="shopping" class-name="card-panel-icon" />-->
          <i class="el-icon-s-grid card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            当前在线人数
          </div>
          <count-to :start-val="0" :end-val=currOnlineCount :duration="2300" class="card-panel-num" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import { getOnlineCount, getUserViewsCount } from '@/api/user'
import { getFaCount } from '@/api/fa'
import { getOrderCountByStatus } from '@/api/order'

export default {
  components: {
    CountTo
  },
  props: {

  },
  data() {
    return {
      currUserCount: 0,
      currFACount: 0,
      currOrderCount: 0,
      currOnlineCount: 0
    }
  },
  created() {
    this.getAllData()
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    },
    getAllData() {
      this.getUserCount()
      this.getFACount()
      this.getOrderCount()
      this.getOnlineCount()
    },
    getUserCount() {
      getUserViewsCount().then(resp => { this.currUserCount = resp.data })
    },
    getFACount() {
      getFaCount().then(resp => { this.currFACount = resp.data })
    },
    getOrderCount() {
      getOrderCountByStatus(2).then(resp => { this.currOrderCount = resp.data })
    },
    getOnlineCount() {
      getOnlineCount().then(resp => { this.currOnlineCount = resp.data })
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
