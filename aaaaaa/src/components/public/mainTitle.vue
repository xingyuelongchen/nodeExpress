<template>
  <!-- 需要显示按钮的，请绑定 v-module 为真值； 按钮会返回input事件 -->
  <div class="main-title">
    <div>
      <span
        v-show="value && btn[0]"
        @click="$emit('input',false)"
        class="my-icon icon-left text-active title"
      ></span>
      <span>{{$t($route.meta.title)}}</span>
    </div>
    <div v-show="value">
      <el-button size="small" @click="event(false)" v-show="btn[0]">{{$t(btn[0])}}</el-button>
      <el-button size="small" @click="event(true)" v-if="btn[1]" type="primary">{{$t(btn[1])}}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: null,
      default: null
    },
    btn: {
      type: Array,
      default: () => ["w_index.cancel", "w_index.send"]
    }
  },
  methods: {
    event(e) {
      this.$emit("input", {
        source: "title",
        event: e
      });
    }
  }
};
</script>

<style lang="less" scoped>
.main-title {
  min-height: 75px;
  max-height: 75px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 0 40px;
  font-family: PingFangSC-Semibold;
  font-size: 26px;
  font-weight: normal;
  font-stretch: normal;
  letter-spacing: 1px;
  color: #323235;
  border-bottom: 1px solid #e6ebf1;
  .title {
    display: inline-block;
    vertical-align: middle;
    width: 50px;
    margin-right: 30px;
    border-right: 1px solid #e6e6e6;
  }
}
</style>