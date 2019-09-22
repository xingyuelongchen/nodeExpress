<template>
  <v-app id="users">
<!-- 个人中心 侧边栏 -->
    <v-navigation-drawer :clipped="$vuetify.breakpoint.lgAndUp" v-model="drawer" fixed app>
      <v-toolbar flat class="transparent">
        <v-list class="pa-0">
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img v-if="ptofile.avatar"
                   :src="`${$fileUrl}/public/uploads/o/company/user/${this.$route.params.userId}/${ptofile.avatar}`"></img>
              <v-avatar v-else color="grey">
                <v-icon dark>account_circle</v-icon>
              </v-avatar>
            </v-list-tile-avatar>

            <div class="text-no-wrap text-truncate" style="width: 60%">
              <v-list-tile-title> {{ptofile.email}} </v-list-tile-title>
            </div>

            <v-list-tile-action>
              <v-btn icon @click.stop="show = true">
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
                  {{ $t(item.name)}}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile v-for="(child, i) in item.children" :key="i">
              <v-list-tile-action v-if="child.icon">
                <v-icon>{{ child.icon}}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ $t(item.name)}}
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
        <v-btn flat small class=" white--text" to="/">YOOV
        </v-btn>
      </v-toolbar-title>
      <v-text-field flat solo-inverted hide-details prepend-inner-icon="search" @keyup.enter="searchOrg(search)"
                    :label="$t('global.search_text')" class="hidden-sm-and-down"></v-text-field>
      <v-spacer></v-spacer>
      <!-- <v-btn icon>

        <v-icon>apps</v-icon>
      </v-btn> -->
      <v-menu offset-y light transition="scale-transition">
        <v-btn slot="activator" light icon>
          <v-icon color="#fff">apps</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile :to="`/users/${this.userId}/home`">
            <v-list-tile-title> {{$t('navbar.user_center')}}
            </v-list-tile-title>
          </v-list-tile>
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
        <router-view class="router-view" data-app></router-view>
      </div>
    </v-content>

    <v-snackbar v-model="snackbarSetting.snackbar" :timeout="3000" top="top" :color="snackbarSetting.color">
      {{snackbarSetting.text}}
      <v-btn flat @click="snackbarSetting.snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
    <my-upload field="file" ref="file" :width="100" :height="100" @crop-success="cropSuccess" v-model="show"
               img-format="png"></my-upload>
    <!-- 添加密碼模態框 -->
    <v-layout row justify-center>
      <v-dialog v-model="dialog1" persistent max-width="400px">
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
            <v-btn color="darken-1" flat @click.native="dialog1 = false">{{$t('button.cancel')}}</v-btn>
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
  import {userRouter} from '@/router'
  import {mapState, mapMutations} from 'vuex'
  import myUpload from './../components/image-crop-upload/upload-2'

  export default {
    metaInfo() {
      return {
        title: this.ptofile.name,
        titleTemplate: '%s - 企業管理和推廣平台',
        htmlAttrs: {
          lang: 'hk',
          amp: undefined // "amp" has no value
        }
      }
    },
    components: {
      'my-upload': myUpload
    },
    data() {
      return {
        dialog1: false,
        userId: sessionStorage.getItem('userId'),
        show: false,
        form: true,
        show1: false,
        show2: false,
        show3: false,
        dialog: false,
        isLoading: false,
        loading: false,
        drawer: null,
        imgDataUrl: null,
        dialogm1: null,
        icon: 'home',
        ptofile: {
          email: null,
          avatar: null
        },
        items: userRouter[0].children,
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
      ...mapState(['snackbarSetting', 'imagesToUpload'])

    },
    mounted() {
      this.readUsers()
      this.readProfile()
    },
    methods: {
      ...mapMutations(['snackbarStateChange', 'iscustomerLoginChange']),
      changLang(key) {
        localStorage.setItem('i18n', key)
        this.$i18n.locale = key
      },
      route(url, icon) {
        this.$router.push({
          path: `/users/${this.$route.params.userId}/${url}`
        });
        this.icon = icon
      },
      goTo(url) {
        this.$router.push({
          path: url
        })
      },
      searchOrg() {
        if(this.search !== null){
          location.href = `/company-list?search=${this.search}`
        }
      },
      readUsers() {
        this.loading = true
        this.$http.get(`user/users/${this.$route.params.userId}`).then(res => {
          this.ptofile.email = res.data.email
          sessionStorage.setItem('email', res.data.email)
          this.loading = false
        })
      },
      back() {
        this.$router.back()
      },
      readProfile() {
        this.loading = true;
        this.$http
          .get(`user/user/${this.$route.params.userId}/profiles`)
          .then(res => {
            if (res.data.content.length > 0) {
              this.ptofile = res.data.content[0]
            }
            this.loading = false
          })
      },
      cropSuccess(imgDataUrl, field) {
        this.imgDataUrl = imgDataUrl
        setTimeout(() => {
          this.upload()
        }, 100)
      },
      upload() {

        let formData = new FormData()
        for (let i = 0, len = this.imagesToUpload.length; i < len; i++) {
          formData.append(
            this.imagesToUpload[i].key,
            this.imagesToUpload[i].value,
            `covers${i}.png`
          )
        }
        formData.append(`user.id`, this.$route.params.userId)
        formData.append(`size`, 10)
        this.$http
          .post(
            `user/user/${this.$route.params.userId}/profiles/update_image`,
            formData
          )
          .then(res => {
            this.snackbarStateChange({
              color: 'success',
              text: '更新封面圖成功',
              snackbar: true
            })
            this.ptofile = res.data
            this.$store.commit('clearImagesToUpload')
            this.$store.commit('clearFilesToUpload')
            this.isLoading = false
          })
          .catch(error => {
            this.snackbarStateChange({
              color: 'error',
              text: error.data.message,
              snackbar: true
            })
            this.isLoading = false
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
            .put('user/users', this.$serialize(this.updatePassword))
            .then(res => {
              this.snackbarStateChange({
                color: 'success',
                text: this.$t(`message.update_message`),
                snackbar: true
              })
              this.dialog1 = false
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
      logout() {
        localStorage.clear()
        window.location.href = `https://id.yoov.com/logout`;

        this.$router.push({path: '/'})
        this.iscustomerLoginChange(false)
        this.snackbarStateChange({
          color: 'success',
          text: this.$t(`退出成功`),
          snackbar: true
        })
      }
    }
  }
</script>
