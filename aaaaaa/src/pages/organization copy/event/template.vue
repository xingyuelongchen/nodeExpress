<template>
  <div>
    <div class="activity" v-if="tabbar">
      <template v-if="!loading">
        <!-- 标题 -->
        <div class="title">{{$t('chamber.left.activity')}}</div>
      </template>
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
      <div class="bg"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabbar: true
    };
  }
};
</script>

<style lang="less" scoped>
.activity {
  background: #f6f9fc;

  .bg {
    padding: 0 30px 0 40px;
  }
  .title {
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
}
</style>