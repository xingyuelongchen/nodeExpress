<template>
  <div class="plarform">
    <!-- 头部 -->
    <v-layout
      row
      wrap
      class="hidden-sm-and-down header-menu my-0 mx-0 "
    >
      <v-flex
        xs12
        class="white"
      >
        <v-toolbar class="elevation-0 white box-container v-toolbar__content1">

          <v-toolbar-side-icon
            class="hidden-md-and-up header-menu my-0 mx-0"
            @click.stop="drawer = !drawer"
            fad
          >
          </v-toolbar-side-icon>
          <v-toolbar-title
            class="mr-4 hidden-sm-and-down"
            @click="goTo('')"
          >
            <img
              src="./../../static/img/logo/logo.png"
              width="160"
              class="mt-3"
              contain
              lazy-src="./static/img/logo/logo.png"
              style="cursor: pointer"
            >
            </img>
          </v-toolbar-title>

          <v-toolbar-items class="hidden-sm-and-down">
            <v-btn
              class="subheading"
              flat
              @click="goTo('company-list')"
            >{{ $t("navbar.coc_list") }}
            </v-btn>
            <!-- 产品列表 -->
            <!-- <v-btn
              class="subheading"
              flat
              @click="goTo('product-list')"
            >{{ $t("navbar.product_list") }}
            </v-btn>
            -->
            <v-btn
              class="subheading"
              flat
              @click="goTo('news-list')"
            >{{ $t("navbar.news_list") }}
            </v-btn>
             <v-btn
              class="subheading"
              flat
              @click="goTo('activity-list')"
            >{{ $t("navbar.activity_list") }}
            </v-btn>
            
          </v-toolbar-items>

          <v-spacer></v-spacer>
          <v-toolbar-items
            class="hidden-sm-and-down"
            v-if="!isAuthenticated"
          >
            <v-btn
              class="subheading"
              flat
              @click="login('/implicit/callback')"
            >{{ $t("navbar.login") }}
            </v-btn>
            <!-- <v-btn
              class="subheading"
              flat
              @click="login('/enterprise/callback')"
            >{{ $t("navbar.cocLogin") }}
            </v-btn> -->
          </v-toolbar-items>

          <v-toolbar-items
            class="hidden-sm-and-down"
            v-else
          >
            <v-menu
              offset-y
              class="hidden-sm-and-down"
              v-if="iscustomerLogin"
            >
              <v-btn
                flat
                class="subheading"
                slot="activator"
              >
                {{$t('navbar.user_center')}}
              </v-btn>
              <v-list>
                <v-list-tile :to="`/users/${this.userId}/home`">
                  <v-list-tile-title>
                    {{$t('navbar.user_center')}}
                  </v-list-tile-title>
                </v-list-tile>
                
                <v-list-tile @click="logout()">
                  <v-list-tile-title>
                    {{$t('navbar.logout')}}
                  </v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
            <v-menu
              offset-y
              class="hidden-sm-and-down"
              v-if="isOrganizationLogin"
            >
              <v-btn
                flat
                class="subheading"
                slot="activator"
              >
                {{$t('navbar.back_coc_center')}}
              </v-btn>
              <v-list>
                <v-list-tile @click="readOrganization()">
                  <v-list-tile-title>
                    {{$t('navbar.back_coc_center')}}
                  </v-list-tile-title>
                </v-list-tile>
                <!--<v-list-tile @click="openDialog()">-->
                  <!--<v-list-tile-title>-->
                    <!--{{$t('navbar.base_info')}}-->
                  <!--</v-list-tile-title>-->
                <!--</v-list-tile>-->
                <!--<v-list-tile @click="dialog1 = true">-->
                  <!--<v-list-tile-title>-->
                    <!--{{$t('navbar.modify')}}-->
                  <!--</v-list-tile-title>-->
                <!--</v-list-tile>-->
                <v-list-tile @click="logout()">
                  <v-list-tile-title>
                    {{$t('navbar.logout')}}
                  </v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
          </v-toolbar-items>

          <v-menu
            offset-y
            class="hidden-sm-and-down"
          >
            <v-btn
              flat
              class="subheading typeface"
              slot="activator"
              :class="[i18nIcon]"
            >
              <!-- {{$t(`lang.${$i18n.locale}`)}} -->
            
            </v-btn>
            <v-list>
              <v-list-tile @click="changLang('CN')">
                <v-list-tile-title>
                  {{$t('lang.CN')}}
                </v-list-tile-title>
              </v-list-tile>
              <v-list-tile @click="changLang('EN')">
                <v-list-tile-title>
                  {{$t('lang.EN')}}
                </v-list-tile-title>
              </v-list-tile>
              <v-list-tile @click="changLang('HK')">
                <v-list-tile-title>
                  {{$t('lang.HK')}}
                </v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-flex>
    </v-layout>
    <!-- pc -->

    <!-- phone -->
    <v-toolbar
      color="primary"
      dark
      class="hidden-md-and-up"
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <img
        src="./../../static/img/logo/phone_logo.png"
        @click="goTo('')"
        lazy-src="./static/img/logo/logo.png"
        contain
        style="cursor: pointer;width: 50px"
      >
      </img>
      <v-spacer></v-spacer>
      <v-btn
        icon
        @click="searchDialog = !searchDialog"
      >
        <v-icon>search</v-icon>
      </v-btn>
    </v-toolbar>
    <!-- phone -->

    <!-- 小屏menu -->
    <v-layout
      wraps
      style="background: #fff;"
    >
      <v-navigation-drawer
        v-model="drawer"
        absolute
        temporary
      >
        <v-toolbar flat>
          <v-list class="primary">
            <v-list-tile>
              <v-list-tile-title class="title text-xs-center white--text">
                Connected
              </v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-toolbar>

        <v-divider></v-divider>

        <v-list
          class="pt-1"
          dense
        >

          <v-list-tile
            v-for="item in items"
            :key="item.title"
            @click="goTo(item.path)"
          >
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{ $t(item.title) }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile
            v-if="!isAuthenticated"
            @click="goTo('implicit/callback')"
          >
            <v-list-tile-action>
              <v-icon>perm_identity</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{ $t('auth.login') }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <!-- <v-list-tile
            v-if="!isAuthenticated"
            @click="goTo('enterprise/callback')"
          >
            <v-list-tile-action>
              <v-icon>account_box</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{ $t('navbar.cocLogin') }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile> -->

          <v-list v-if="iscustomerLogin">
            <v-list-group
              prepend-icon="perm_identity"
              no-action
            >
              <v-list-tile slot="activator">
                <v-list-tile-content>
                  <v-list-tile-title> {{$t('navbar.user_center')}}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>

              <v-list-tile
                :key="$t('navbar.user_center')"
                :to="`/users/${this.userId}/home`"
              >
                <v-list-tile-content>
                  <v-list-tile-title> {{$t('navbar.user_center')}}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              <!--<v-list-tile-->
                <!--:key="$t('navbar.modify')"-->
                <!--@click="dialog1 = true"-->
              <!--&gt;-->
                <!--<v-list-tile-content>-->
                  <!--<v-list-tile-title> {{$t('navbar.modify')}}</v-list-tile-title>-->
                <!--</v-list-tile-content>-->
              <!--</v-list-tile>-->
              <v-list-tile
                :key="$t('navbar.logout')"
                @click="logout()"
              >
                <v-list-tile-content>
                  <v-list-tile-title> {{$t('navbar.logout')}}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list-group>
          </v-list>

          <v-list v-if="isOrganizationLogin">
            <v-list-group
              prepend-icon="account_box"
              no-action
            >
              <v-list-tile slot="activator">
                <v-list-tile-content>
                  <v-list-tile-title> {{$t('navbar.back_coc_center')}}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>

              <v-list-tile
                :key="$t('navbar.back_coc_center')"
                @click="readOrganization()"
              >
                <v-list-tile-content>
                  <v-list-tile-title> {{$t('navbar.back_coc_center')}}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              <!--<v-list-tile-->
                <!--:key="$t('navbar.base_info')"-->
                <!--@click="openDialog()"-->
              <!--&gt;-->
                <!--<v-list-tile-content>-->
                  <!--<v-list-tile-title> {{$t('navbar.base_info')}}</v-list-tile-title>-->
                <!--</v-list-tile-content>-->
              <!--</v-list-tile>-->
              <!--<v-list-tile @click="dialog1 = true">-->
                <!--<v-list-tile-title>-->
                  <!--{{$t('navbar.modify')}}-->
                <!--</v-list-tile-title>-->
              <!--</v-list-tile>-->
              <v-list-tile
                :key="$t('navbar.logout')"
                @click="logout()"
              >
                <v-list-tile-content>
                  <v-list-tile-title> {{$t('navbar.logout')}}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list-group>
          </v-list>

          <v-list>
            <v-list-group
              :key="$t(`lang.${$i18n.locale}`)"
              prepend-icon="language"
              no-action
            >
              <v-list-tile slot="activator">
                <v-list-tile-content>
                  <v-list-tile-title> {{$t(`lang.${$i18n.locale}`)}}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>

              <v-list-tile
                :key="$t('lang.CN')"
                @click="changLang('CN')"
              >
                <v-list-tile-content>
                  <v-list-tile-title> {{$t('lang.CN')}}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile
                :key="$t('lang.EN')"
                @click="changLang('EN')"
              >
                <v-list-tile-content>
                  <v-list-tile-title> {{$t('lang.EN')}}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile
                :key="$t('lang.HK')"
                @click="changLang('HK')"
              >
                <v-list-tile-content>
                  <v-list-tile-title> {{$t('lang.HK')}}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list-group>
          </v-list>
        </v-list>

      </v-navigation-drawer>
    </v-layout>
    <!-- 头部 -->

    <!-- 搜索栏 -->
    <div
      class="hidden-sm-and-down"
      v-show="$route.meta.isShowSearch"
    >

      <v-img src="./../../../static/img/search_bg.png" class="search_bg">
        <!-- 搜索框开始  -->
        <v-layout
          align-center
          justify-center
          row
          fill-height
        >
          <v-flex
            xl6
            lg6
            md8
            sm8
            xs8
            class="my-2"
          >
            <v-btn :class="{'hover':$route.path === item.url&& current,'active':searchUrl === item.url}"  class="searchTab" v-for="(item,k) in searchList" :key="k" @click="changeTab(item)">{{$t(item.name)}}</v-btn>
            <v-card class="px-4 searchcolumn">


              <v-card-actions>
                <v-text-field
                  v-model="search"
                  @keyup.enter="searchOrg(search)"
                  :label="$t('global.search_text')"
                ></v-text-field>
                <v-btn
                  @click="searchOrg"
                  color="primary"
                  class="mb-2"

                ><v-icon medium>search</v-icon>{{ $t("navbar.search") }}
                </v-btn>
              </v-card-actions>
              <template>
                <div class="hot" style="display:none" >
                  <v-btn flat color="primary">Primary</v-btn>
                  <v-btn flat color="primary">Primary</v-btn>
                  <v-btn flat color="primary">Primary</v-btn>
                  <v-btn flat color="primary">Primary</v-btn>
                </div>
              </template>
            </v-card>

          </v-flex>
        </v-layout>
        <!-- 搜索框结束  -->
      </v-img>
    </div>

    <v-dialog
      v-model="searchDialog"
      hide-overlay
      fullscreen
      full-width
      width="300"
    >
      <v-card dark>
        <v-card-actions>
          <v-btn
            @click="searchDialog =false"
            icon
          >
            <v-icon>clear</v-icon>
          </v-btn>
        </v-card-actions>
        <v-card-actions>
          <v-text-field
            v-model="search"
            @keyup.enter="searchOrg(search)"
            :label="$t('global.search_text')"
            prepend-icon="search"
          ></v-text-field>
          <v-btn
            @click="searchOrg"
            color="primary"
            class="mb-2"
          >{{ $t("navbar.search") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 搜索栏 -->

    <!-- 主体 -->
    <main style="min-height: 320px;">
      <v-app style="background-color: #fff;">
        <v-content>
            <div :class="{'box-container':this.$route.path != '/'}">
              <router-view></router-view>
            </div>
        </v-content>
      </v-app>
    </main>
    <!-- 主体 -->
    <!-- footer -->

    <v-footer
      dark
      class="primary"
      height="auto"
    >
      <v-layout
        row
        wrap
        class=" pt-3"
      >
        <v-flex
          xl8
          offset-xl2
          lg10
          offset-lg1
          md10
          offset-md1
          sm10
          offset-sm1
          xs10
          offset-xs1
        >
          <v-card
            flat
            tile
            class="primary text-xs-left box-container"
          >
            <div style="text-align:center">
              <img
              src="./../../static/img/trans_logo.png"
              width="160"
              class="mt-3"
              contain
              style="cursor: pointer"
              lazy-src="./static/img/logo/logo.png"
            >
            </img>
            </div>
          </v-card>
        </v-flex>



        <v-flex
          xl8
          offset-xl2
          lg10
          offset-lg1
          md10
          offset-md1
          sm10
          offset-sm1
          xs10
          offset-xs1

        >
          <v-card
            flat
            tile
            class="primary text-xs-left box-container"
          >
            <!-- <div style="text-align:center;margin-bottom:36px;"> -->
            <div style="text-align:center;">
              <v-btn
                flat
                class="subheading"
                to="/supplement/service_agreement"
              >{{ $t("global.Service") }}
              </v-btn>
              <v-btn
                flat
                class="subheading"
                to="/supplement/abouts"
              >{{ $t("global.abouts") }}
              </v-btn>
              <v-btn
                flat
                class="subheading"
                to="/supplement/contacts"
              >{{ $t("global.contacts") }}
              </v-btn>
            </div>
          </v-card>
          <v-flex 
         xl8
          offset-xl2
          lg10
          offset-lg1
          md10
          offset-md1
          sm10
          offset-sm1
          xs10
          offset-xs1
         class="text-xs-center py-2 copyright">
          Copyright © 2019 YOOV. All Rights Reserved. Version V1.1.3
        </v-flex> 
        </v-flex>
        <!-- <v-flex xs12>
          <v-divider></v-divider>
        </v-flex>
        <v-flex 
         xl8
          offset-xl2
          lg10
          offset-lg1
          md10
          offset-md1
          sm10
          offset-sm1
          xs10
          offset-xs1
         class="text-xs-center py-2 copyright">
          Copyright © 2019 YOOV. All Rights Reserved. Version V1.1.3
        </v-flex> -->

      </v-layout>
    </v-footer>
    <!-- 修改企業模態框 -->
    <v-layout
      row
      justify-center
    >
      <v-dialog
        v-model="dialog"
        persistent
        max-width="400px"
      >
        <v-card>
          <v-card-title>
            <span class="title">{{$t('navbar.base_info')}}</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-form
                ref="form"
                v-model="form"
              >
                <v-layout
                  row
                  wrap
                >
                  <v-flex xs12>
                    <v-text-field
                      color="purple darken-2"
                      v-model="enterprises.firstName"
                      :label="$t('chamber.create.firstName')"
                      :rules="[rules.required]"
                      clearable
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field
                      color="purple darken-2"
                      v-model="enterprises.lastName"
                      :label="$t('chamber.create.lastName')"
                      :rules="[rules.required]"
                      clearable
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field
                      color="purple darken-2"
                      v-model="enterprises.mobile"
                      :label="$t('chamber.member.phone')"
                      :rules="[rules.required]"
                      clearable
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="darken-1"
              flat
              @click.native="dialog = false"
            >{{$t('button.cancel')}}
            </v-btn>
            <v-btn
              color="primary darken-1"
              :disabled="!form"
              :loading="isLoading"
              flat
              @click.native="onSubmit1()"
            >{{$t('button.save')}}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>

    <!-- 添加密碼模態框 -->
    <v-layout
      row
      justify-center
    >
      <v-dialog
        v-model="dialog1"
        persistent
        max-width="400px"
      >
        <v-card>
          <v-card-title>
            <span class="title">{{$t('navbar.revise_password')}}</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-form
                ref="form"
                v-model="form"
              >
                <v-layout
                  row
                  wrap
                >
                  <v-flex xs12>
                    <v-text-field
                      v-model="updatePassword.oldPassword"
                      :append-icon="show1 ? 'visibility_off' : 'visibility'"
                      :rules="[rules.required, rules.min]"
                      :type="show1 ? 'text' : 'password'"
                      name="input-10-1"
                      :label="$t('auth.oldPassword')"
                      hint="At least 6 characters"
                      counter
                      @click:append="show1 = !show1"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field
                      v-model="updatePassword.newPassword"
                      :append-icon="show2 ? 'visibility_off' : 'visibility'"
                      :rules="[rules.required, rules.min]"
                      :type="show2 ? 'text' : 'password'"
                      name="input-10-1"
                      :label="$t('auth.password')"
                      hint="At least 6 characters"
                      counter
                      @click:append="show2 = !show2"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field
                      v-model="updatePassword.confirmPassword"
                      :append-icon="show3 ? 'visibility_off' : 'visibility'"
                      :rules="[rules.required, rules.min]"
                      :type="show3 ? 'text' : 'password'"
                      name="input-10-1"
                      :label="$t('auth.verifyPassword')"
                      hint="At least 6 characters"
                      counter
                      @click:append="show3 = !show3"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="darken-1"
              flat
              @click.native="dialog1 = false"
            >{{$t('button.cancel')}}
            </v-btn>
            <v-btn
              color="primary darken-1"
              :disabled="!form"
              :loading="isLoading"
              flat
              @click.native="onSubmit()"
            >{{$t('button.save')}}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>

    <v-snackbar
      v-model="snackbarSetting.snackbar"
      :timeout="3000"
      top="top"
      :color="snackbarSetting.color"
    >
      {{snackbarSetting.text}}
      <v-btn
        flat
        @click="snackbarSetting.snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>

  </div>

</template>


<script>
  import {mapState, mapMutations} from "vuex";

  export default {
    metaInfo() {
      return {
        title: "企業廣場",
        titleTemplate: "%s - 企業管理和推廣平台",
        htmlAttrs: {
          lang: "hk",
          amp: undefined // "amp" has no value
        },
        meta: [
          {
            name: "keywords",
            content: "企業廣場"
          },
          {
            name: "description",
            content: 'A platform that consolidates all the career planning and job seeking tools a young talent need; latest career news, companies information, interviewing tips, on/off campus career events and job opportunities.'
          },
        ]
      };
    },
    data() {
      return {
        lang:null,
        current:true,
        loading: false, //控制搜索框
        model: null, //搜索框绑定数据
        search: null, //搜索框值
        drawer: null,
        dialog: false,
        dialog1: false,
        show1: false,
        show2: false,
        show3: false,
        searchDialog: false,
        isLoading: false,
        form: true,
        isAuthenticated: false,
        searchList: [
          {
            url: '/company-list',
            name: 'global.search_company'
          },
          // 产品列表
          // { 
          //   url: '/product-list',
          //   name: 'global.search_product'
          // },
          {
            url: '/activity-list',
            name: 'global.search_event'
          }
        ],
        items: [
          {
            title: "navbar.coc_list",
            icon: "dashboard",
            path: "company-list"
          },
          {
            title: "navbar.activity_list",
            icon: "local_activity",
            path: "activity-list"
          },
          {
            title: "navbar.news_list",
            icon: "fiber_new",
            path: "news-list"
          },
          // {
          //   title: "navbar.product_list",
          //   icon: "fiber_new",
          //   path: "product-list"
          // }
        ],
        userId: sessionStorage.getItem("userId"),
        rules: {
          required: v => !!v || this.$t('validation.required'),
          min: value => value >= 6 || `${this.$t('validation.min')}6`
        },
        updatePassword: {
          userId: sessionStorage.getItem("userId"),
          oldPassword: null,
          newPassword: null,
          confirmPassword: null
        },
        enterprises: {
          userId: sessionStorage.getItem("userId"),
          firstName: null,
          lastName: null,
          mobile: null,
          email: null
        }
      };
    },
    computed: {
      ...mapState(["snackbarSetting", "isOrganizationLogin", "iscustomerLogin","searchUrl"]),
      i18nIcon(){
        return this.lang||localStorage.getItem('i18n')||'HK';
      }
    },
    async mounted() {
      this.search  = this.$route.query.search;
    //v-app在router-view出現無法收回menu的情況
      document.onclick = e => {
        if (!!e.target.className && e.target.className.indexOf("v-overlay") != -1) {
          this.drawer = false;
        } else {
          return;
        }
      };
      if (await this.$auth.isAuthenticated()) {
        this.isAuthenticated = true;
        if (sessionStorage.getItem("role") === "user") {
          this.iscustomerLoginChange(true);
        } else {
          this.isOrganizationLoginChange(true);
        }
      }
    },
    methods: {
      ...mapMutations([
        "snackbarStateChange",
        "iscustomerLoginChange",
        "isOrganizationLoginChange",
        "setSearchUrl"
      ]),
      changLang(key) {
        localStorage.setItem("i18n", key);
        this.$i18n.locale = key;
        this.lang = key;
      },
      changeTab(item){
        this.setSearchUrl(item.url);
        this.current=false;
        
         
      },
      goTo(path) {
        if (path === "implicit/callback") {
          this.login(`/${path}`);
        } else if (path === "enterprise/callback") {
          this.login(`/${path}`);
        } else {
          this.$router.push(`/${path}`);
        }
      },
      searchOrg() {

        if(this.search !== null && this.searchUrl!==null){

          location.href = `${this.searchUrl}?search=${this.search}`

        }else if (this.search !== null && this.searchUrl == null) {

          location.href = `${this.$route.path}?search=${this.search}`
        }else{

        }

        this.searchDialog = false;
      },
      login(callback) {
        this.$auth.loginRedirect(callback);
      },
      logout() {
        localStorage.clear();
        sessionStorage.clear();

        this.iscustomerLoginChange(false);
        this.isOrganizationLoginChange(false);
        this.isAuthenticated = false;
        window.location.href = `https://id.yoov.com/logout`;

        this.snackbarStateChange({
          color: "success",
          text: this.$t(`退出成功`),
          snackbar: true
        });
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
      readEnterprises() {
        this.$http
          .get(`public/user/${this.userId}/enterprises`, {
            params: {"user.id": this.userId},
          })
          .then(res => {
            // if (res.data.content.length > 0) {
              this.readOrganization();
          //   } else {
          //     this.$router.push({
          //       path: `/organizations/${this.userId}/settled`
          //     });
          //   }
          });
      },
      readOrganization() {
        // 
        // this.$http.get(`public/organizations/user`).then(res => {
        this.$http.get(`user/organizations`).then(res => {
          if (res.data.content.length > 0) {
            this.$router.push({
              path: `/organizations/select`
            });
          } else {
            this.$router.push({
              path: `/organizations/create`
            });
          }
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
            .put("manager/users", this.$serialize(this.updatePassword), {
              headers: {
                'X-TENANT-ID': this.userId
              }
            })
            .then(res => {
              this.snackbarStateChange({
                color: "success",
                text: this.$t(`message.update_message`),
                snackbar: true
              });
              this.dialog1 = false;
              this.isAuthenticated = false;
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
                'X-TENANT-ID': this.userId
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
      }
    }
  };
</script>


<style>
.home-page{
  background: #fff;
}
.search_bg{
  height:440px;
}
  .plarform .v-input__control{
    height: 30px;
  }
.searchTab:nth-of-type(1){
  margin-left: 0 !important;
}
.typeface{
      background-position: center;
      padding-left: 32px;
      }
.typeface.HK{
      background-image: url(https://enterprise.yoov.com/static/img/繁体.png);
}
.typeface.CN{
      background-image: url(https://enterprise.yoov.com/static/img/简体.png);
}
.typeface.EN{
      background-image: url(https://enterprise.yoov.com/static/img/英文.png);
  }
.searchTab{
  margin:0 2px !important;
  -webkit-border-radius: 10px  10px 0px 0px!important;
  -moz-border-radius:   10px  10px 0px 0px!important;
  border-radius:  10px  10px 0px 0px!important;
  color:#fff !important;
  background-color: #286667!important;
  margin-right: 10px!important;
 
  text-align: center;
  height: 40px;
}
.searchTab.active{
    color:#286667 !important;
    background: #fff !important;

}
  .hot .v-btn{
    font-size: 12px;
    height: auto;
    padding:5px 14px;
    background:#eef6f6;
    color:#eef6f6;
  }
.searchTab.hover{
    background-color: #fff!important;
  color: #286667 !important;
  }
  .searchcolumn{
    border-top-left-radius: 0;
    padding:40px!important;
    -webkit-border-radius: 0px  10px 10px 10px;
    -moz-border-radius:   0px  10px 10px 10px;
    border-radius:  0px 10px 10px 10px;
  }

.searchcolumn .v-btn.mb-2{
  margin-left: 40px;
  width: 140px;
  height: 40px;
  font-size: 18px;
  -webkit-border-radius: 6px  6px 6px 6px;
  -moz-border-radius:   6px  6px 6px 6px;
  border-radius:  6px  6px 6px 6px;
}
.searchcolumn .v-input{
  padding-top:0;
}

</style>
