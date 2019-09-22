<template>
  <v-app id="inspire" class="page">
    <!-- 头部菜单 -->
    <div class="navTop">
      <div :style="{width:drawer?'230px':'80px'}">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      </div>
      <div style="display:flex;justify-content:space-between;flex:1 1 auto">
        <!-- 企业选择列表 -->
        <div class="navTopList">
          <div class="logo">
            <v-avatar size="40">
              <img src="https://vuetifyjs.com/apple-touch-icon-180x180.png" alt="avatar" />
            </v-avatar>
          </div>
          <div class="name">YOOV Internet Technology Limited</div>
          <div class="icon" @click.stop="event">
            <div class="item">
              <transition name="fa">
                <div v-show="drawer1" class="fa-item" ref="navTopList">
                  <!-- 这里是下来选择企业列表 -->
                  <div class="navTopList">
                    <div class="logo">
                      <v-avatar size="40">
                        <img src="https://vuetifyjs.com/apple-touch-icon-180x180.png" alt="avatar" />
                      </v-avatar>
                    </div>
                    <div class="name">YOOV Internet Technology Limited</div>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>
        <!--End 企业选择列表 -->
        <!-- 语言选择 -->
        <div class="navTopUser">
          <span class="iconLanguage"></span>
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <span class="LanguageText" v-on="on">{{$t(`lang.${$i18n.locale}`)}}</span>
            </template>
            <v-list color="primary">
              <v-list-tile class="luange">
                <div @click="changLang('CN')">{{$t('lang.CN')}}</div>
              </v-list-tile>
              <v-list-tile class="luange">
                <div @click="changLang('EN')">{{$t('lang.EN')}}</div>
              </v-list-tile>
              <v-list-tile class="luange">
                <div @click="changLang('HK')">{{$t('lang.HK')}}</div>
              </v-list-tile>
            </v-list>
          </v-menu>
        </div>
        <!-- End 语言选择 -->
      </div>
    </div>
    <!-- 侧边菜单栏 -->
    <v-navigation-drawer v-model="drawer" fixed class="navSide" style="width:200px;z-index:999">
      <div style="height:60px;border-bottom:1px solid #e5eaf1">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      </div>
      <!-- 侧边栏内容-->
      <side-list v-for="(item,i) in menuArr" v-model="show" :itemArr="item" :key="i"></side-list>
    </v-navigation-drawer>
    <!-- End 侧边菜单栏 -->
    <!-- 中间内容 -->
    <div style="position:absolute;top:60px;display:flex;width:100%;height:92%">
      <div v-show="drawer" style="min-width:200px"></div>
      <div
        style=" flex:1 1 auto;margin: 20px; overflow:hidden;background:#f6f9fc;border-radius:6px;"
      >
        <router-view></router-view>
      </div>
    </div>
    <!-- End 中间内容 -->
  </v-app>
</template>
<script>
import { backendRouter } from "@/router";
import { mapState, mapMutations } from "vuex";

export default {
 
  metaInfo() {
    return {
      title: this.current.name,
      titleTemplate: "%s - 企業管理和推廣平台",
      htmlAttrs: {
        lang: "hk",
        amp: undefined // "amp" has no value
      }
    };
  },
  data() {
    return {
      show: false, //控制側邊欄所有的展開狀態
      drawer1: false, //控制企業選擇列表
      dialog1: false,
      dialog2: false,
      dialog: false,
      loading: false,
      isLoading: false,
      show2: false,
      show3: false,
      show1: false,
      form: true,
      drawer: null,
      dialogm1: null,
      search: null,
      icon: "home",
      organizations: [],
      current: {},
      userId: sessionStorage.getItem("userId"),
      items: backendRouter[0].children,
      enterprises: {
        userId: sessionStorage.getItem("userId"),
        firstName: null,
        lastName: null,
        mobile: null,
        email: null
      },
      menuArr: [
        {
          title: "side.home",
          path: "dashboard",
          icon: "/"
        },
        {
          title: "side.manage",
          path: "",
          icon: "/",
          children: [
            {
              title: "side.manages.swiper",
              path: "manage/sliderShow"
            },
            {
              title: "side.manages.staff",
              path: "manage/member_list"
            },
            {
              title: "side.manages.notice",
              path: "manage/notice"
            },
            {
              title: "side.manages.message",
              path: "manage/message"
            }
          ]
        },
        {
          title: "side.activity",
          path: "",
          icon: "/",
          children: [
            {
              title: "side.activitys.activity",
              path: "events"
            },
            { title: "side.activitys.sigin", path: "events/sigin" },
            { title: "side.activitys.class", path: "events/class" }
          ]
        },
        {
          title: "side.article",
          path: "",
          icon: "/"
        },
        {
          title: "side.customer",
          path: "",
          icon: "/"
        },
        {
          title: "side.order",
          path: "",
          icon: "/"
        },
        {
          title: "side.setting",
          path: "",
          icon: "/"
        }
      ],
      rules: {
        required: v => !!v || this.$t("validation.required"),
        min: value => value >= 6 || `${this.$t("validation.min")}6`
      },
      updatePassword: {
        userId: sessionStorage.getItem("userId"),
        oldPassword: null,
        newPassword: null,
        confirmPassword: null
      }
    };
  },
  props: {
    source: String
  },
  computed: {
    ...mapState(["snackbarSetting"])
  },
  mounted() {
    this.readOrganization();
  },
  methods: {
    ...mapMutations(["snackbarStateChange", "isOrganizationLoginChange"]),
    route(url, icon) {
      this.$router.push({
        path: `/organization/${this.$route.params.organizationId}/${url}`
      });
      this.icon = icon;
    },
    to() {
      this.$router.push({
        path: "/company",
        query: { code: this.$route.params.organizationId }
      });
    },
    event() {
      this.drawer1 = !this.drawer1;
      let that = this;
      document.addEventListener("click", () => {
        that.drawer1 = false;
      });
    },
    changLang(key) {
      localStorage.setItem("i18n", key);
      this.$i18n.locale = key;
    },
    searchOrg() {
      if (this.search !== null) {
        location.href = `/company-list?search=${this.search}`;
      }
    },
    back() {
      this.$router.back();
    },
    goTo(url) {
      this.$router.push({
        path: url
      });
    },
    openDialog1() {
      this.dialog1 = true;
      if (this.organizations.length === 0) this.readOrganization();
    },
    openDialog() {
      this.dialog = true;
      this.$http.get(`public/users/${this.userId}`).then(res => {
        this.enterprises.mobile = res.data.mobile;
        this.enterprises.firstName = res.data.firstName;
        this.enterprises.lastName = res.data.lastName;
        this.enterprises.email = res.data.email;
      });
    },
    onSubmit() {
      if (
        this.updatePassword.newPassword !== this.updatePassword.confirmPassword
      ) {
        this.snackbarStateChange({
          color: "error",
          text: "密碼不一致",
          snackbar: true
        });
      } else {
        this.isLoading = true;
        this.$http
          .put("users", this.$serialize(this.updatePassword))
          .then(res => {
            this.snackbarStateChange({
              color: "success",
              text: this.$t(`message.update_message`),
              snackbar: true
            });
            this.dialog = false;
            this.isLoading = false;
          })
          .catch(error => {
            this.isLoading = false;
            this.snackbarStateChange({
              color: "error",
              text: error.data.message,
              snackbar: true
            });
          });
      }
    },
    onSubmit1() {
      this.isLoading = true;
      this.$http
        .put(
          `manager/user/${this.userId}/enterprises`,
          this.$serialize(this.enterprises),
          {
            headers: {
              "X-TENANT-ID": this.userId
            }
          }
        )
        .then(res => {
          this.snackbarStateChange({
            color: "success",
            text: this.$t(`message.update_message`),
            snackbar: true
          });
          this.dialog = false;
          this.isLoading = false;
        })
        .catch(error => {
          this.isLoading = false;
          this.snackbarStateChange({
            color: "error",
            text: error.data.message,
            snackbar: true
          });
        });
    },
    readOrganization() {
      this.loading = true;
      this.$http
        .get("public/organizations/user", {
          params: { isApproved: true }
        })
        .then(res => {
          this.organizations = res.data.content;
          this.loading = false;
          let index = this.organizations.findIndex(value => {
            return value.id === Number(this.$route.params.organizationId);
          });
          this.current = this.organizations[index];
          this.dialogm1 = this.current.id;
        });
    },
    selectOrganization() {
      this.$router.push({
        path: `/organization/${this.dialogm1}/dashboard`
      });
      let index = this.organizations.findIndex(value => {
        return value.id === this.dialogm1;
      });
      this.current = this.organizations[index];
      this.dialogm1 = this.current.id;
      this.dialog1 = false;
    },
    logout() {
      localStorage.clear();
      sessionStorage.clear();
      this.$router.push({ path: "/" });
      this.isOrganizationLoginChange(false);
      window.location.href = `https://id.yoov.com/logout`;

      this.snackbarStateChange({
        color: "success",
        text: this.$t(`退出成功`),
        snackbar: true
      });
    }
  }
};
</script>
<style lang="less" scoped>
.fa-item {
  transition: all 0.2s ease-in-out;
}
.fa-enter,
.fa-leave-to {
  margin-top: -100%;
}
.fa-enter-to,
.fa-leave-enter {
  margin-top: 0;
}
.page {
  background: #e4e9f0;
  overflow: hidden;
}
.navTop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 60px;
  background-color: #f6f9fc;
  box-shadow: 0px 10px 20px 0px rgba(131, 142, 171, 0.1);
  display: flex;
  z-index: 999;
  .navTopList {
    width: 490px;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .logo {
      margin: 10px;
    }
    .name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-family: PingFangSC-Regular;
      font-size: 20px;
      font-weight: normal;
      font-stretch: normal;
      letter-spacing: 1px;
      color: #323235;
    }
    .icon {
      width: 40px;
      height: 40px;
      margin-left: 10px;
      position: relative;
      background: url("../../static/img/select.png") no-repeat center;
      cursor: pointer;
      .item {
        top: 50px;
        position: absolute;
        right: 0;
        width: 490px;
        overflow: hidden;
        .navTopList {
          justify-content: flex-start;
        }
        & > div {
          background: #f6f9fc;
        }
      }
    }
  }
  .navTopUser {
    width: 96px;
    margin-right: 40px;
    line-height: 60px;

    .iconLanguage {
      display: inline-block;
      width: 20px;
      height: 20px;
      font-size: 20px;
      vertical-align: text-bottom;
      background: url("../../static/img/icons8-globe_earth.png") no-repeat
        center;
    }
    .LanguageText {
      margin-left: 9px;
      width: 67px;
      height: 16px;
      font-family: PingFangSC-Regular;
      font-size: 16px;
      font-weight: normal;
      font-stretch: normal;
      line-height: 35px;
      letter-spacing: 0px;
      color: #838eab;
      cursor: pointer;
    }
  }
}
</style>