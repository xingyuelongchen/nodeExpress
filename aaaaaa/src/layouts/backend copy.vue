<template>
  <v-app id="inspire">

    <v-navigation-drawer :clipped="$vuetify.breakpoint.lgAndUp" v-model="drawer" fixed app>
      <v-toolbar flat class="transparent">
        <v-list class="pa-0">
          <v-list-tile @click="to" avatar>
            <v-list-tile-avatar>
               <img style="cursor:pointer" @click="to" v-if="current.logo"
                    :src="`${$fileUrl}/public/uploads/o/company/organization/${current.id}/${current.logo}`"></img>
               <v-avatar style="cursor:pointer" v-else @click="to" color="grey">
                 <v-icon dark>account_circle</v-icon>
               </v-avatar>
            </v-list-tile-avatar>
            <div class="text-no-wrap text-truncate" style="width: 60%">
              <v-list-tile-title>{{current.name}}</v-list-tile-title>
            </div>

            <v-list-tile-action>
              <v-btn icon @click.stop="openDialog1()">
                <v-icon>chevron_right</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-toolbar>

      <v-list dense>
        <template v-for="item in items">
          <v-layout v-if="item.heading" :key="item.heading" row align-center>
            <v-flex xs6>
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-flex>
            <v-flex xs6 class="text-xs-center">
              <a href="#!" class="body-2 black--text">EDIT</a>
            </v-flex>
          </v-layout>
          <v-list-group v-else-if="item.children" v-model="item.model" :key="item.text"
                        :prepend-icon="item.model ? item.icon : item['icon-alt']" append-icon="">
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ $t(item.name) }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile v-for="(child, i) in item.children" :key="i">
              <v-list-tile-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ $t(item.name) }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
          <v-list-tile v-else :key="item.text" @click="route(item.path,item.icon)">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ $t(item.name) }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
    
    <v-toolbar :clipped-left="$vuetify.breakpoint.lgAndUp" color="#2c7a90" dark app fixed>
      <v-toolbar-title style="width: 300px;text-align:left" class="ml-0 pl-3">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <v-btn flat small class=" white--text" to="/"> YOOV
        </v-btn>
      </v-toolbar-title>
      <!-- 隐藏搜索框 -->
      <!--<v-text-field flat solo-inverted hide-details prepend-inner-icon="search " v-model="search" @keyup.enter="searchOrg(search)"-->
                    <!--:label="$t('global.search_text')" class="hidden-sm-and-down"></v-text-field>-->
      <v-spacer></v-spacer>
      <!-- <v-btn icon>

        <v-icon>apps</v-icon>
      </v-btn> -->
      <v-menu offset-y light transition="scale-transition">
        <v-btn slot="activator" light icon>
          <v-icon color="#fff">apps</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile @click="goTo('/organizations/select')">
            <v-list-tile-title> {{$t('navbar.back_coc_center')}}</v-list-tile-title>
          </v-list-tile>
          <!--<v-list-tile @click="openDialog()">-->
            <!--<v-list-tile-title>-->
              <!--{{$t('navbar.base_info')}}-->
            <!--</v-list-tile-title>-->
          <!--</v-list-tile>-->
          <!--<v-list-tile @click="dialog2 = true">-->
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

      <v-menu offset-y class="hidden-sm-and-down">
        <v-btn flat class="subheading" slot="activator">
          {{$t(`lang.${$i18n.locale}`)}}
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
    <v-content data-app>
      <div class="card" data-app>
        <div class="card-header card-header-success card-header-icon">
          <div class="card-icon">
            <v-icon>{{icon}}</v-icon>
          </div>
          <h4 class="card-title">
            <v-btn v-if="$route.meta.isBack" @click="back()" flat icon color="primary">
              <v-icon>arrow_back</v-icon>
            </v-btn>
            {{$t($route.name)}}
          </h4>
        </div>
        <v-divider class="my-2"></v-divider>

        <router-view class="router-view" data-app></router-view>
      </div>
    </v-content>

    <v-snackbar v-model="snackbarSetting.snackbar" :timeout="3000" top="top" :color="snackbarSetting.color">
      {{snackbarSetting.text}}
      <v-btn flat @click="snackbarSetting.snackbar = false">
        Close
      </v-btn>
    </v-snackbar>

    <v-dialog v-model="dialog1" scrollable max-width="300px">
      <v-card>
        <v-card-title>{{$t('global.selected_coc')}}</v-card-title>
        <v-divider></v-divider>
        <div class="text-xs-center" v-if="loading">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>
        <v-card-text style="height: 300px;" v-else>
          <v-radio-group v-model="dialogm1" column>
            <template v-for="item in organizations">
              <v-radio color="purple darken-1" :label="item.name" :value="item.id"></v-radio>
            </template>
          </v-radio-group>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="darken-1" flat @click.native="dialog1 = false">{{$t('button.cancel')}}</v-btn>
          <v-btn color="blue darken-1" flat @click.native="selectOrganization()">{{$t('button.save')}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 修改企業模態框 -->
    <v-layout row justify-center>
      <v-dialog v-model="dialog" persistent max-width="400px">
        <v-card>
          <v-card-title>
            <span class="title">{{$t('navbar.base_info')}}</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-form ref="form" v-model="form">
                <v-layout row wrap>
                  <v-flex xs12>
                    <v-text-field color="purple darken-2" v-model="enterprises.firstName"
                                  :label="$t('chamber.create.firstName')" :rules="[rules.required]"
                                  clearable></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field color="purple darken-2" v-model="enterprises.lastName"
                                  :label="$t('chamber.create.lastName')" :rules="[rules.required]"
                                  clearable></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field color="purple darken-2" v-model="enterprises.mobile"
                                  :label="$t('chamber.member.phone')" :rules="[rules.required]"
                                  clearable></v-text-field>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="darken-1" flat @click.native="dialog = false">{{$t('button.cancel')}}</v-btn>
            <v-btn color="primary darken-1" :disabled="!form" :loading="isLoading" flat @click.native="onSubmit1()">
              {{$t('button.save')}}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>

    <!-- 添加密碼模態框 -->
    <v-layout row justify-center>
      <v-dialog v-model="dialog2" persistent max-width="400px">
        <v-card>
          <v-card-title>
            <span class="title">{{$t('navbar.revise_password')}}</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-form ref="form" v-model="form">
                <v-layout row wrap>
                  <v-flex xs12>
                    <v-text-field v-model="updatePassword.oldPassword"
                                  :append-icon="show1 ? 'visibility_off' : 'visibility'"
                                  :rules="[rules.required, rules.min]" :type="show1 ? 'text' : 'password'"
                                  name="input-10-1" :label="$t('auth.oldPassword')" hint="At least 6 characters" counter
                                  @click:append="show1 = !show1"></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field v-model="updatePassword.newPassword"
                                  :append-icon="show2 ? 'visibility_off' : 'visibility'"
                                  :rules="[rules.required, rules.min]" :type="show2 ? 'text' : 'password'"
                                  name="input-10-1" :label="$t('auth.password')" hint="At least 6 characters" counter
                                  @click:append="show2 = !show2"></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field v-model="updatePassword.confirmPassword"
                                  :append-icon="show3 ? 'visibility_off' : 'visibility'"
                                  :rules="[rules.required, rules.min]" :type="show3 ? 'text' : 'password'"
                                  name="input-10-1" :label="$t('auth.verifyPassword')" hint="At least 6 characters"
                                  counter @click:append="show3 = !show3"></v-text-field>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="darken-1" flat @click.native="dialog2 = false">{{$t('button.cancel')}}</v-btn>
            <v-btn color="primary darken-1" :disabled="!form" :loading="isLoading" flat @click.native="onSubmit()">
              {{$t('button.save')}}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-app>
</template>


<script>
  import {backendRouter} from '@/router'
  import {mapState, mapMutations} from 'vuex'

  export default {
    metaInfo() {
      return {
        title: this.current.name,
        titleTemplate: '%s - 企業管理和推廣平台',
        htmlAttrs: {
          lang: 'hk',
          amp: undefined // "amp" has no value
        }
      }
    },
    data() {
      return {
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
        icon: 'home',
        organizations: [],
        current: {},
        userId: sessionStorage.getItem('userId'),
        items: backendRouter[0].children,
        enterprises: {
          userId: sessionStorage.getItem('userId'),
          firstName: null,
          lastName: null,
          mobile: null,
          email: null
        },
        rules: {
          required: v => !!v || this.$t('validation.required'),
          min: value => value >= 6 || `${this.$t('validation.min')}6`
        },
        updatePassword: {
          userId: sessionStorage.getItem('userId'),
          oldPassword: null,
          newPassword: null,
          confirmPassword: null
        }
      }
    },
    props: {
      source: String
    },
    computed: {
      ...mapState(['snackbarSetting'])
    },
    mounted() {
      this.readOrganization()
    },
    methods: {
      ...mapMutations(['snackbarStateChange', 'isOrganizationLoginChange']),
      route(url, icon) {
        this.$router.push({
          path: `/organization/${
            this.$route.params.organizationId
            }/${url}`
        })
        this.icon = icon
      },
      to() {
        this.$router.push({path: '/company', query: {code: this.$route.params.organizationId}});
      },
      changLang(key) {
        localStorage.setItem('i18n', key)
        this.$i18n.locale = key
      },
      searchOrg() {
        if(this.search !== null){
          location.href = `/company-list?search=${this.search}`
        }
      },
      back() {
        this.$router.back()
      },
      goTo(url) {
        this.$router.push({
          path: url
        })
      },
      openDialog1() {
        this.dialog1 = true
        if (this.organizations.length === 0) this.readOrganization()
      },
      openDialog() {
        this.dialog = true
        this.$http.get(`public/users/${this.userId}`).then(res => {
          this.enterprises.mobile = res.data.mobile
          this.enterprises.firstName = res.data.firstName
          this.enterprises.lastName = res.data.lastName
          this.enterprises.email = res.data.email
        })
      },
      onSubmit() {
        if (
          this.updatePassword.newPassword !==
          this.updatePassword.confirmPassword
        ) {
          this.snackbarStateChange({
            color: 'error',
            text: '密碼不一致',
            snackbar: true
          })
        } else {
          this.isLoading = true
          this.$http
            .put('users', this.$serialize(this.updatePassword))
            .then(res => {
              this.snackbarStateChange({
                color: 'success',
                text: this.$t(`message.update_message`),
                snackbar: true
              })
              this.dialog = false
              this.isLoading = false
            })
            .catch(error => {
              this.isLoading = false
              this.snackbarStateChange({
                color: 'error',
                text: error.data.message,
                snackbar: true
              })
            })
        }
      },
      onSubmit1() {
        this.isLoading = true
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
              color: 'success',
              text: this.$t(`message.update_message`),
              snackbar: true
            })
            this.dialog = false
            this.isLoading = false
          })
          .catch(error => {
            this.isLoading = false
            this.snackbarStateChange({
              color: 'error',
              text: error.data.message,
              snackbar: true
            })
          })
      },
      readOrganization() {
        this.loading = true
        this.$http
          .get('public/organizations/user', {
            params: {isApproved: true}
          })
          .then(res => {
            this.organizations = res.data.content
            this.loading = false
            let index = this.organizations.findIndex(value => {
              return (
                value.id ===
                Number(this.$route.params.organizationId)
              )
            })
            this.current = this.organizations[index]
            this.dialogm1 = this.current.id
          })
      },
      selectOrganization() {
        this.$router.push({
          path: `/organization/${this.dialogm1}/dashboard`
        })
        let index = this.organizations.findIndex(value => {
          return value.id === this.dialogm1
        })
        this.current = this.organizations[index]
        this.dialogm1 = this.current.id
        this.dialog1 = false
      },
      logout() {
        localStorage.clear()
        sessionStorage.clear()
        this.$router.push({path: '/'})
        this.isOrganizationLoginChange(false)
        window.location.href = `https://id.yoov.com/logout`;

        this.snackbarStateChange({
          color: 'success',
          text: this.$t(`退出成功`),
          snackbar: true
        })
      }
    }
  }
</script>
