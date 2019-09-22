<template>
  <!-- 首页顶部导航，侧边导航，主题内容 的布局组件 -->
  <div class="admin-app">
    <el-container style="height:100%">
      <!-- 页面侧边导航 -->
      <el-aside :class="[sideShow?'hidden-md-and-up':'hidden-sm-and-down']" width="200px">
        <div class="side-title text-active" @click="sideShow = !sideShow">
          <span class="my-icon icon-caidan"></span>
        </div>
        <div class="side-content">
          <sideNav
            v-model="sideListShow"
            v-for="(item,i) in sideNavArr "
            :key="i"
            :item="item"
            :index="index"
          />
        </div>
      </el-aside>
      <el-aside :class="[sideShow?'hidden-sm-and-down':'hidden-lg-and-up']" width="80px">
        <div class="side-title text-active" @click="sideShow = !sideShow">
          <span class="my-icon icon-caidan"></span>
        </div>
        <div class="side-content">
          <template v-for="(item,i) in sideNavArr ">
            <el-popover :key="i" placement="right" min-width="100px" trigger="hover">
              <template v-if="item.children">
                <router-link
                  tag="div"
                  class="navListItem text-active"
                  v-for="(v,i) in item.children"
                  :key="i"
                  :to="'/organization/'+$route.params.organizationId+'/'+item.path+'/'+v.path"
                >{{v.meta.title}}</router-link>
              </template>
              <template v-else>
                <router-link
                  class="navListItem text-active"
                  :to="'/organization/'+$route.params.organizationId+'/'+item.path"
                  tag="div"
                >{{ item.meta.title}}</router-link>
              </template>
              <div class="item my-icon icon-dalou" slot="reference"></div>
            </el-popover>
          </template>
        </div>
      </el-aside>
      <!-- End 页面侧边导航 -->

      <el-container>
        <!-- 页面顶部导航 -->
        <el-header
          class="space-between"
          height="60px"
          style="background:#f6f9fc;box-shadow:10px 10px 20px rgba(131, 142, 171, 0.1);"
        >
          <div>企业选择列表</div>
          <div class="login-language">
            <div>登陆注册</div>
            <div>
              <i class="my-icon icon-diqiu" style="vertical-align:bottom;"></i>语言
            </div>
          </div>
        </el-header>
        <!-- 页面主体内容 -->
        <el-main>
          <div class="main">
            <router-view />
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>  
<script>
import { backendRouter } from "./../../router";
export default {
  components: {
    sideNav: () => import("@/components/public/sideNavList.vue")
  },
  data() {
    return {
      sideShow: false,
      sideListShow: true,
      sideNavArr: backendRouter[0].children,
      index: "dashboard"
    };
  },
  beforeRouteUpdate(to, from, next) {
    let arr = this.sideNavArr.filter(e => {
      if (e.children) {
        let a = e.children.filter(v => {
          return v.name == to.name;
        });
        return a.length > 0;
      } else {
        return e.name == to.name;
      }
    });
    // console.log(to, arr);
    this.index = arr[0].name;
    next();
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
      console.log(path);
      this.$router.push({
        path: `/organization/${this.$route.params.organizationId}${path}`
      });
    }
  }
};
</script> 
<style lang="less">
// 页面公用样式

.text-active:hover,
.text-active.active {
  color: #276667 !important;
  cursor: pointer;
}
.el-popover {
  min-width: 60px;
}
.space-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
  > * {
    flex: 1;
  }
}
.el-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  .el-col {
    margin: 20px;
    flex: 1 1 auto;
  }
}

// End
.el-header {
  font-family: PingFangSC-Regular;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  line-height: 35px;
  letter-spacing: 0px;
  color: #838eab;
  .login-language {
    display: flex;
    justify-content: flex-end;
    > div {
      width: 100px;
    }
  }
}

.navListItem {
  width: 100%;
  height: 40px;
  text-align: left;
  line-height: 40px;
}
.admin-app {
  font-family: PingFangSC-Semibold;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  letter-spacing: 0px;
  background: #e4e9f0;
  height: 100vh;
  min-width: 768px;
  color: #323235;
  .el-aside {
    height: 100%;
    background: #fff;
    .side-title {
      height: 60px;
      border-bottom: 1px solid #e5eaf1;
      background: #fff;
      font-size: 18px;
      padding-left: 25px;
      line-height: 60px;
    }
    .side-content {
      .item {
        width: 100%;
        height: 50px;
        text-align: center;
        line-height: 50px;
      }
    }
  }
  .main {
    height: 100%;
    // margin: 20px;
    background-color: #f6f9fc;
    box-shadow: 0px 10px 20px 0px rgba(131, 142, 171, 0.1);
    border-radius: 6px;
    overflow: hidden;
  }
  .s1 {
    transition: all 1s ease-in;
  }
}
</style>  