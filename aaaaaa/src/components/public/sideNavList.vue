<template>
  <div class="side-nav-list">
    <div class="side-nav-item text-active" :class="{'active':index == item.name}" @click="to(item)">
      <div :class="['my-icon',item.icon]"></div>
      <div>{{$t(item.meta.title)}}</div>
      <div :class="[show?'icon-down':'icon-right','my-icon']" v-if="item.children"></div>
      <div v-else></div>
    </div>
    <div style="overflow:hidden">
      <transition name="fa" mode="out-in">
        <div class="side-nav-item-s" v-show="item.children && show">
          <div
            class="text-active"
            :class="{'active':$route.name == v.name}"
            v-for="(v,k) in item.children"
            :key="k"
            @click.stop="to(item,v)"
          >{{$t(v.meta.title)}}</div>
        </div>
      </transition>
    </div>
  </div>
</template>  
<script>
export default {
  props: {
    value: null,
    index: {
      type: String,
      default: "dashboard",
      required: true
    },
    item: {
      type: Object,
      default: () => [],
      required: true
    }
  },
  data() {
    return {
      show: false,
      isActive: false,
      isAct: false
    };
  },
  watch: {
    value() {
      this.show = !this.show;
      if (!this.isAct) {
        this.show = false;
      }
      this.isAct = false;
    }
  },
  methods: {
    to(e, v) {
      let path = e.path;
      let name = this.$route.name;
      if (v) {
        path += "/" + v.path;
      } else {
        if (e.children) {
          this.isAct = true;
          this.$emit("input", Math.random());
          return;
        }
      }
      if ((!v && name == e.name) || (v && name == v.name)) return;
      path = "/" + path;
      console.log("sideNavList ", path);
      this.$router.push({
        path: `/organization/${this.$route.params.organizationId}${path}`
      });
    }
  }
};
</script> 
<style lang="less" scoped>
.fa-enter,
.fa-leave-to {
  margin-top: -100%;
}
.fa-enter-to,
.fa-leave-enter {
  margin-top: 0;
}
.side-nav-list {
  .side-nav-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    &:hover,
    &.active {
      background: #32b0b320;
    }

    > div {
      height: 50px;
      line-height: 50px;
      box-sizing: border-box;
      flex: 2;
      &:nth-child(2) {
        font-weight: bold;
        border-bottom: 1px solid #e5eaf1;
        border-top: 1px solid #e5eaf1;
      }
      &:first-child {
        text-align: center;
      }
      &:last-child {
        flex: 1;
        text-align: center;
        font-size: 12px;
        border-bottom: 1px solid #e5eaf1;
        border-top: 1px solid #e5eaf1;
      }
    }
    &:first-child {
      > div {
        &:not(:first-child) {
          border-top: none;
        }
      }
    }
  }
  .side-nav-item-s {
    margin-left: 40px;
    transition: all 0.1s;
    > div {
      &:last-child {
        &::after {
          position: absolute;
          bottom: 0;
          left: -1px;
          width: 1px;
          height: 18px;
          background: #fff;
          content: "";
        }
      }
      border-left: 1px solid #e5eaf1;
      /* padding-top: 20px; */
      padding-left: 38px;
      height: 40px;
      position: relative;
      font-family: PingFangSC-Regular;
      font-size: 16px;
      font-weight: normal;
      font-stretch: normal;
      letter-spacing: 0px;
      line-height: 40px;
      &::before {
        position: absolute;
        bottom: 18px;
        left: 0;
        width: 13px;
        height: 1px;
        background: #e5eaf1;
        content: "";
      }
    }
  }
}
.my-icon {
  font-size: 22px;
}
</style>  