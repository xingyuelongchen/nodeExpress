<template>
  <!-- 活动管理首页 -->
  <div>
    <div class="activity" v-if="create">
      <template v-if="!loading">
        <!-- 标题 -->
        <div class="title">{{$t('chamber.left.activity')}}</div>
        <!-- 搜索栏 -->
        <div class="search bg">
          <div>
            <div>
              <el-input
                size="small"
                :placeholder="$t('chamber.know.search')"
                suffix-icon="el-icon-search"
                v-model="search"
              ></el-input>
            </div>
            <div>
              <el-date-picker
                size="small"
                v-model="dataTime"
                type="date"
                :placeholder="$t('input.datatime')"
              ></el-date-picker>
            </div>
            <div>
              <el-select size="small" v-model="select" :placeholder="$t('input.status')">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="addActivity">{{$t('chamber.btn.add_activity')}}</div>
        </div>
        <!-- 内容表格 -->
        <div class="content bg">
          <div class="contentTitle">
            <div>{{$t('input.tableTitle.title')}}</div>
            <div>{{$t('input.tableTitle.qrcode')}}</div>
            <div>{{$t('input.tableTitle.sigin' )}}</div>
            <div>{{$t('input.tableTitle.time')}}</div>
            <div>{{$t('input.tableTitle.manage')}}</div>
          </div>
          <div class="contentText infinite-list" style="overflow:auto">
            <div class="item infinite-list-item" v-for="i in 4" :key="i">
              <div>
                <div class="contentTextTitle" v-text="'海滩别墅+水上世界+海钓潜水+烧烤派对'"></div>
                <div class="start">{{ $t('global.soon')}}</div>
                <!-- <div class="play">{{ $t('global.conduct')}}</div>
                <div class="end">{{ $t('global.end')}}</div>-->
                <div class="time">2019-08-30 18:00 - 2019-08-30 23:00</div>
              </div>
              <div>
                <el-image
                  style="width: 80px; height: 80px"
                  src="../../../static/img/code.png"
                  fit="fill"
                  lazy
                ></el-image>
              </div>
              <div>2 / 15</div>
              <div>2019-08-08 10:54</div>
              <div>
                <el-link type="primary">{{$t('button.edit')}}</el-link>
                <el-link>{{$t('button.delete')}}</el-link>
              </div>
            </div>
          </div>
        </div>
      </template>
      <!-- 加载器 -->
      <div class="text-xs-center" v-else>
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>
      <!--End 加载器 -->
    </div>
    <div class="activity" v-else>
      <div class="title">
        <div>
          <span class="my-icon icon-left"></span>
          {{$t('chamber.btn.add_activity')}}
        </div>
        <div>
          <button>{{$t('button.cancel')}}</button>
          <button>{{$t('button.save')}}</button>
        </div>
      </div>
      <div class="bg create">
        <div class="activity-info-create">
          <div class="activity-info">
            <div>
              <!-- 活动名称 -->
              <div class="input-item-w">
                <span>{{$t('chamber.activity.name')}}</span>
                <el-input :placeholder="$t('chamber.activity.name')" v-model="form.name"></el-input>
              </div>
              <div class="flex">
                <!-- 开始时间 -->
                <div class="input-item-m">
                  <span>{{$t('user.user_education.start')}}</span>
                  <el-date-picker
                    v-model="form.timestart"
                    type="datetime"
                    :placeholder="$t('user.user_education.input_start')"
                    default-time="0:00:00"
                  ></el-date-picker>
                </div>
                <div class="input-item-m">
                  <!-- 结束时间 -->
                  <span>{{$t('chamber.activity.endTimedAt')}}</span>
                  <el-date-picker
                    v-model="form.timeend"
                    type="datetime"
                    :placeholder="$t('chamber.activity.endTimedAt')"
                    default-time="0:00:00"
                  ></el-date-picker>
                </div>
              </div>
              <!-- 活动地点 -->
              <div class="input-item-w">
                <span>{{$t('chamber.activity.address')}}</span>
                <el-input :placeholder="$t('chamber.activity.address')" v-model="form.name"></el-input>
              </div>
            </div>
            <div>
              <div class="input-item-w">
                <span>{{$t('chamber.activity.address')}}</span>
                <el-input :placeholder="$t('chamber.activity.address')" v-model="form.name"></el-input>
              </div>
              <div class="input-item-w">
                <span>{{$t('chamber.activity.signUpEndTimedAt')}}</span>
                <el-date-picker
                  v-model="form.signend"
                  type="datetime"
                  :placeholder="$t('chamber.activity.signUpEndTimedAt')"
                  default-time="0:00:00"
                ></el-date-picker>
              </div>
              <div class="input-item-w">
                <span>{{$t('chamber.activity.address')}}</span>
                <el-input :placeholder="$t('chamber.activity.address')" v-model="form.name"></el-input>
              </div>
            </div>
          </div>
          <!-- 添加活动图片 -->
          <div class="up-img">
            <div class="up-title">内容图</div>
            <div class="up-title-doc">图片尺寸为：不限制图片尺寸，图片大小 &lt;5M</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: null,
      dataTime: null,
      select: null,
      options: [],
      loading: false,
      create: false,
      form: {
        name: null,
        timestart: null,
        timeend: null,
        signend: null
      }
    };
  }
};
</script>

<style scoped lang="less">
.activity {
  background: #f6f9fc;

  .bg {
    padding: 0 30px 0 40px;
  }
  .title {
    height: 85px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: PingFangSC-Semibold;
    font-size: 26px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 1px;
    color: #323235;
    padding: 30px 30px 20px 40px;
    border-bottom: 1px solid #ccc;
    background: #fff;
    > div:first-child {
      .my-icon {
        font-size: 22px;
        font-weight: bold;
        width: 50px;
        display: inline-block;
        border-right: 2px solid #e6e6e6;
        margin-right: 30px;
        &:hover {
          color: #276667;
          cursor: pointer;
        }
      }
    }
    > div:last-child {
      button {
        border-radius: 6px;
        width: 140px;
        height: 34px;
        background: #e2ebef;
        font-size: 16px;
        margin-left: 20px;
        &:hover {
          color: #276667;
        }
      }
    }
  }
  .search {
    height: 34px;
    margin: 20px 0;
    display: flex;
    justify-content: space-between;
    & > div {
      &:last-child {
        width: 140px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        background-color: #276667;
        border-radius: 6px;
        color: #fff;
        &:hover {
          opacity: 0.9;
          cursor: pointer;
        }
      }
      &:first-child {
        display: flex;
        justify-content: flex-start;
        > div {
          margin-right: 20px;
        }
        .el-input,
        .el-select {
          height: 34px;
        }
      }
    }
  }
  .content {
    .contentTitle {
      height: 44px;
      background: #f6f9fc;
      display: flex;
      justify-content: space-between;
      align-items: center;
      text-align: left;
      & > div {
        font-family: PingFangSC-Regular;
        font-size: 16px;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0px;
        color: #838eab;
        &:first-child {
          flex: 6 1 auto;
          min-width: 400px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        &:nth-child(2) {
          flex: 2 1 auto;
          min-width: 120px;
        }
        &:nth-child(3) {
          flex: 1 1 auto;
          min-width: 60px;
        }
        &:nth-child(4) {
          flex: 2 1 auto;
          min-width: 140px;
        }
        &:last-child {
          flex: 1 1 auto;
          min-width: 110px;
        }
      }
    }
    .item {
      height: 120px;
      border-bottom: 1px solid #e6ebf1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      text-align: left;
      & > div {
        font-family: PingFangSC-Regular;
        font-size: 16px;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0px;
        color: #838eab;
        // 表格每一行的样式
        &:first-child {
          flex: 6 1 auto;
          min-width: 400px;
          max-width: 49%;
          .contentTextTitle {
            width: 90%;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-family: PingFangSC-Semibold;
            font-size: 20px;
            font-weight: normal;
            font-stretch: normal;
            letter-spacing: 0px;
            color: #323235;
            overflow: hidden;
          }
          .start {
            margin: 7px 0;
            width: 100px;
            height: 24px;
            text-align: center;
            line-height: 24px;
            background-color: #f0ded2;
            border-radius: 6px;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            font-weight: normal;
            font-stretch: normal;
            letter-spacing: 0px;
            color: #b35820;
          }
          .play {
            margin: 7px 0;

            width: 100px;
            height: 24px;
            text-align: center;
            line-height: 24px;
            background-color: #eaf7f7;
            border-radius: 6px;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            font-weight: normal;
            font-stretch: normal;
            letter-spacing: 0px;
            color: #276667;
          }
          .end {
            margin: 7px 0;
            width: 100px;
            height: 24px;
            text-align: center;
            line-height: 24px;
            background-color: #dfe5ec;
            border-radius: 6px;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            font-weight: normal;
            font-stretch: normal;
            letter-spacing: 0px;
            color: #838eab;
          }
          .time {
            font-family: PingFangSC-Regular;
            font-size: 16px;
            font-weight: normal;
            font-stretch: normal;
            letter-spacing: 0px;
            color: #838eab;
          }
        }
        &:nth-child(2) {
          flex: 2 1 auto;
          min-width: 120px;
        }
        &:nth-child(3) {
          flex: 1 1 auto;
          min-width: 60px;
          font-family: PingFangSC-Regular;
          font-size: 16px;
          font-weight: normal;
          font-stretch: normal;
          letter-spacing: 0px;
          color: #323235;
          text-indent: 5px;
        }
        &:nth-child(4) {
          flex: 2 1 auto;
          min-width: 140px;
          font-family: PingFangSC-Regular;
          font-size: 16px;
          font-weight: normal;
          font-stretch: normal;
          letter-spacing: 0px;
          color: #323235;
        }
        &:last-child {
          flex: 1 1 auto;
          min-width: 110px;
          font-family: PingFangSC-Semibold;
          font-size: 16px;
          font-weight: normal;
          font-stretch: normal;
          letter-spacing: 0px;
          & > a:first-child {
            color: #276667;
          }
          & > a:last-child {
            color: #323235;
            margin-left: 40px;
          }
        }
      }
    }
  }
  .create {
    min-width: 1400px;
    .activity-info-create {
      display: flex;
      align-items: center;

      //  左边 输入框
      & > div:first-child {
        display: flex;
        & > div:first-child {
          // 左边 输入框区域的 左边部分
          width: 460px;
          .flex {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
        }
        & > div:last-child {
          // 左边 输入框区域的 右边部分
          flex: 1 1 auto;
          margin: 0 20px;
          max-width: 220px;
        }
        // 输入框共用部分

        .input-item-m {
          width: 48%;
          //   margin: 0 20px;
        }
        .input-item-w,
        .input-item-m {
          height: 88px;
          display: flex;
          flex-flow: column wrap;
          justify-content: center;
          & > span {
            margin-bottom: 5px;
            margin-top: 15px;
            font-family: PingFangSC-Semibold;
            font-size: 16px;
            font-weight: normal;
            font-stretch: normal;
            letter-spacing: 0px;
            color: #323235;
            text-indent: 15px;
          }
        }
      }

      //   右边图片上传
      & > div:last-child {
        flex: auto;
        background: #fff;
        border-radius: 6px;
        min-width: 620px;
        height: 240px;
        margin-top: 15px;
      }
    }
  }
}
</style>