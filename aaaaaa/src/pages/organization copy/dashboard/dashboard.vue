<template>
  <div id="dashboard">
    <template v-if="!loading">
      <div class="title">企业首页</div>
      <div>
        <v-layout row wrap class="my-5 mx-4">
          <v-flex md6 lg4>
            <v-card class="mx-4 py-2 text-xs-right cardWarp">
              <div class="cardTitle">
                <div>{{$t('chamber.btn.audited')}}</div>
                <div>
                  <router-link
                    :to="`/organization/${$route.params.organizationId}/member_list`"
                  >{{$t('global.handle')}}</router-link>
                </div>
              </div>
              <div class="cardContent">
                <div class="icon"></div>
                <div class="text">
                  <div>{{candidates.member}}</div>
                  <div>{{$t('chamber.home.member' )}}</div>
                </div>
              </div>
            </v-card>
          </v-flex>
          <v-flex md6 lg4>
            <v-card class="mx-4 py-2 text-xs-right cardWarp">
              <div class="cardTitle">
                <div>{{$t('chamber.btn.audited')}}</div>
                <div>
                  <router-link
                    :to="`/organization/${$route.params.organizationId}/events`"
                  >{{$t('global.handle')}}</router-link>
                </div>
              </div>
              <div class="cardContent">
                <div class="icon2"></div>
                <div class="text">
                  <div>{{candidates.event}}</div>
                  <div>{{$t('chamber.home.activity' )}}</div>
                </div>
              </div>
            </v-card>
          </v-flex>
          <v-flex md6 lg4>
            <v-card class="mx-4 py-2 text-xs-right cardWarp">
              <div class="cardTitle">
                <div>{{$t('chamber.btn.audited')}}</div>
                <div>
                  <router-link
                    :to="`/organization/${$route.params.organizationId}/messages`"
                  >{{$t('global.handle')}}</router-link>
                </div>
              </div>
              <div class="cardContent">
                <div class="icon3"></div>
                <div class="text">
                  <div>{{candidates.message}}</div>
                  <div>{{$t('chamber.home.message' )}}</div>
                </div>
              </div>
            </v-card>
          </v-flex>
        </v-layout>
      </div>
    </template>
    <!-- 加载器 -->
    <div class="text-xs-center" v-else>
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    <!--End 加载器 -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      authenticated: false,
      loading: false,
      candidates: {},
      oktaAuth: {}
    };
  },
  mounted() {
    this.readStatistics();
  },
  methods: {
    readStatistics() {
      this.loading = true;
      this.$http
        .get("manager/organizations/waiting_for_processing", {
          headers: {
            "X-TENANT-ID": this.$route.params.organizationId
          },
          params: {
            organizationId: this.$route.params.organizationId
          }
        })

        .then(res => {
          this.candidates = res.data;
          this.loading = false;
        });
    }
  }
};
</script>
<style lang="scss">
  .title {
    font-family: PingFangSC-Semibold;
    font-size: 26px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 1px;
    color: #323235;
    padding: 30px 0 20px 40px;
    border-bottom: 1px solid #ccc;
    background: #fff;
  }
.cardWarp {
  min-height: 200px;
  margin-top: 40px;
  box-sizing: border-box;
  .cardTitle {
    display: flex;
    justify-content: space-between;
    height: 60px;
    width: 100%;
    box-sizing: border-box;
    & > div {
      height: 100%;
      line-height: 60px;
      margin: 0 20px;
      font-family: PingFangSC-Regular;
      font-size: 16px;
      font-weight: normal;
      font-stretch: normal;
      letter-spacing: 0px;
      &:first-child {
        color: #838eab;
      }
      &:last-child {
        color: #32b0b3;
      }
    }
  }
  .cardContent {
    height: 124px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .icon {
      width: 100px;
      height: 100px;
      margin-left: 60px;
      background: url("../../../../static/img/group_1.png");
    }
    .icon2 {
      width: 100px;
      height: 100px;
      margin-left: 60px;
      background: url("../../../../static/img/group_2.png");
    }
    .icon3 {
      width: 100px;
      height: 100px;
      margin-left: 60px;
      background: url("../../../../static/img/group_3.png");
    }
    .text {
      flex: 1 1 auto;
      margin-left: 30px;
      text-align: left;
      & > div {
        font-weight: normal;
        font-stretch: normal;
        color: #323235;
        font-family: PingFangSC-Semibold;
        &:first-child {
          font-size: 40px;
          letter-spacing: 3px;
        }
        &:last-child {
          font-size: 20px;
          letter-spacing: 1px;
        }
      }
    }
  }
}

</style>
