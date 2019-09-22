<template>
  <v-form ref="form" v-model="valid" class="my-5">
    <v-container grid-list-xl text-xs-center>
      <v-card class="pa-4">
        <div class="card-header card-header-icon card-header-rose">
          <div class="card-icon">
            <i class="material-icons">
              <font style="vertical-align: inherit;">
                <font style="vertical-align: inherit;">perm_identity</font>
              </font>
            </i>
          </div>
          <h4 class="card-title text-lg-left">
            <font style="vertical-align: inherit;">{{$t($route.name)}}
            </font>

          </h4>
        </div>
        <v-divider class="my-4" v-if="isSettled"></v-divider>
        <div class="title text-xs-left" v-if="isSettled">
          {{$t('global.settled_coc' )}}
        </div>
        <v-layout row wrap v-if="isSettled">
          <v-flex xs12 sm7>
            <v-layout row wrap>
              <v-flex sm6>
                <v-text-field color="purple darken-2" v-model="enterprises.firstName" :rules="[rules.required]"
                              :label="$t('chamber.create.firstName')"></v-text-field>
              </v-flex>
              <v-flex sm6>
                <v-text-field color="purple darken-2" v-model="enterprises.lastName" :rules="[rules.required]"
                              :label="$t('chamber.create.lastName')"></v-text-field>
              </v-flex>
              <v-flex sm12>
                <v-text-field color="purple darken-2" v-model="enterprises.phone" :rules="[rules.required]"
                              :label="$t('chamber.create.phone')"></v-text-field>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs12 sm5>
            <v-layout row wrap>
              <v-flex xs12 md8>
                <p class=" text-xs-left mb-2">{{$t('chamber.create.certificates')}}</p>
                <div class="fileinput fileinput-new text-center" data-provides="fileinput">
                  <div class="fileinput-new thumbnail">
                    <img v-if="idFrontUrl === null"
                         src="https://demos.creative-tim.com/material-dashboard-pro/assets/img/image_placeholder.jpg"
                         style="width:100%" alt="...">
                    <img v-else :src="idFrontUrl" style="width:100%" alt="...">
                  </div>
                  <div class="fileinput-preview fileinput-exists thumbnail" style=""></div>
                  <div class="text-xs-center">
                    <v-btn round color="primary" dark @click="show1 = !show1">{{$t('chamber.btn.file_update')}}</v-btn>
                  </div>
                  <my-upload field="idFront" ref="file" :width="650" :height="420" @crop-success="cropSuccess"
                             v-model="show1" img-format="png"></my-upload>
                </div>
              </v-flex>
              <v-flex md4>
                <p class="mt-4  text-xs-left">{{$t('chamber.prompt.title')}}</p>
                <p class=" text-xs-left ">{{$t('chamber.prompt.update_certificates_text')}}</p>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>

        <v-layout row wrap v-else>
          <v-flex xs12>
            <v-divider class="my-4"></v-divider>

            <div class="title text-xs-left">
              {{$t('chamber.select.information' )}}
              <span class="body-1">{{$t('chamber.prompt.settled_coc_text')}}</span>
            </div>
          </v-flex>
          <v-flex xs12 sm6 md3>
            <v-text-field color="purple darken-2" v-model="forms.name" :rules="[rules.required]"
                          :label="$t('chamber.create.name')"></v-text-field>
          </v-flex>
          <v-flex xs12 sm6 md3>
            <v-autocomplete v-model="forms['industry.id']" :no-data-text="$t('message.no_message')" :items="industrys"
                            :rules="[rules.required]" color="purple darken-2" :label="$t('chamber.create.industry')"
                            item-text="name" item-value="id">
              <template slot="item" slot-scope="data">
                <template>
                  <v-list-tile-content>
                    <v-list-tile-title color="#333" v-html="data.item.name"></v-list-tile-title>
                  </v-list-tile-content>
                </template>
              </template>
            </v-autocomplete>
          </v-flex>
          <v-flex xs12 sm6 md3>
            <v-autocomplete v-model="forms['location.id']" :items="locations" :rules="[rules.required]"
                            color="purple darken-2" :label="$t('chamber.create.region')" item-text="name"
                            item-value="id">
              <template slot="item" slot-scope="data">
                <template>
                  <v-list-tile-content>
                    <v-list-tile-title color="#333" v-html="data.item.name"></v-list-tile-title>
                  </v-list-tile-content>
                </template>
              </template>
            </v-autocomplete>
          </v-flex>
          <v-flex xs12 sm6 md3>
            <v-autocomplete v-model="forms.scale" :items="scales" :rules="[rules.required]" color="purple darken-2"
                            :label="$t('chamber.create.number')" item-text="name" item-value="id">
              <template slot="item" slot-scope="data">
                <template>
                  <v-list-tile-content>
                    <v-list-tile-title color="#333" v-html="data.item.name"></v-list-tile-title>
                  </v-list-tile-content>
                </template>
              </template>
            </v-autocomplete>
          </v-flex>
          <v-flex xs12 sm6 md3>
            <v-dialog ref="establishedDate" v-model="menu1" :return-value.sync="forms.establishedDate" persistent lazy
                      full-width width="290px">
              <v-text-field slot="activator" v-model="forms.establishedDate" :label="$t('chamber.create.create_time')"
                            :rules="[rules.required]" readonly></v-text-field>
              <v-date-picker v-model="forms.establishedDate" :max="currentDate" scrollable :locale="i18n">
                <v-spacer></v-spacer>
                <v-btn flat color="primary" @click="menu1 = false">{{$t('button.cancel')}}</v-btn>
                <v-btn flat color="primary" @click="$refs.establishedDate.save(forms.establishedDate)">
                  {{$t('button.confirm')}}
                </v-btn>
              </v-date-picker>
            </v-dialog>
          </v-flex>
          <v-flex xs12 sm6 md3>
            <v-text-field v-model="forms.contacts" color="purple darken-2" :rules="[rules.required]"
                          :label="$t('chamber.create.contacts')"></v-text-field>
          </v-flex>
          <v-flex xs12 sm6 md3>
            <v-text-field v-model="forms.phone" color="purple darken-2" :rules="[rules.required]"
                          :label="$t('chamber.create.phone')"></v-text-field>
          </v-flex>
          <v-flex xs12 sm6 md3>
            <v-text-field v-model="forms.email" :rules="emailRules"
                          :label="$t('chamber.create.email')"></v-text-field>
          </v-flex>
          <v-flex xs12 sm6 md6>
            <v-text-field v-model="forms.address" :rules="[rules.required]"
                          :hint="$t('chamber.placeholder.create.address')"
                          :label="$t('chamber.create.address')"></v-text-field>
          </v-flex>
          <v-flex xs12 sm6 md6>
            <v-text-field v-model="forms.purpose" :rules="[rules.required]"
                          :hint="$t('chamber.placeholder.create.purpose')"
                          :label="$t('chamber.create.purpose')"></v-text-field>
          </v-flex>
          <v-flex xs12 v-if="!forms.id">
            <v-divider></v-divider>
          </v-flex>
          <v-flex xs12 v-if="!forms.id">
            <div class="title text-xs-left">
              {{$t('global.apply_group' )}}
              <span class="body-1 ml-2">({{$t('global.memberShips_text')}})</span>
            </div>
          </v-flex>
          <v-flex xs12 v-if="!forms.id">
            <v-layout row wrap>
              <template v-for="(item,i) in forms.memberships">
                <v-flex sm3>
                  <v-text-field v-model="item.name" :rules="[rules.required]"
                                :label="$t('chamber.member.framework_name')"
                                :placeholder="$t('chamber.member.placeholder_name')"></v-text-field>
                </v-flex>
                <v-flex sm3>
                  <v-autocomplete v-if="!item.isForever" v-model="item.period" :items="months"
                                  :disabled="item.isForever" :rules="[rules.required]" :suffix="$t('global.month' )"
                                  color="purple darken-2" :label="$t('global.term')" item-text="name" item-value="id">
                    <template slot="item" slot-scope="data">
                      <template>
                        <v-list-tile-content>
                          <v-list-tile-title color="#333" v-html="data.item.name"></v-list-tile-title>
                        </v-list-tile-content>
                      </template>
                    </template>
                  </v-autocomplete>
                  <v-text-field v-else color="purple darken-2" :disabled="item.isForever"
                                :label="$t('global.forever')"></v-text-field>
                </v-flex>
                <v-flex sm3>
                  <v-text-field v-model="item.amount" :label="$t('global.dues')"
                                :placeholder="$t('chamber.member.placeholder_dues')" :rules="[rules.required]"
                                suffix="$Hk"></v-text-field>
                </v-flex>
                <v-flex sm2>
                  <v-text-field v-model="item.position" :label="$t('chamber.member.sort')" :rules="[rules.required]"
                                :placeholder="$t('chamber.member.placeholder_order')"></v-text-field>
                </v-flex>
                <v-flex sm1>
                  <v-btn flat icon color="#1867c0" @click="deleteItem('memberships',i)" slot="activator">
                    <v-icon size="18">close</v-icon>
                  </v-btn>
                </v-flex>
              </template>

              <v-btn small @click="addItem('memberships',false)">{{$t('chamber.btn.add_options' )}}</v-btn>
              <v-btn small color="primary" @click="addItem('memberships',true)"> {{$t('chamber.btn.add_forever' )}}
              </v-btn>
            </v-layout>
          </v-flex>
          <v-flex xs12 v-if="!forms.id">
            <div class="title mt-3 text-xs-left">
              {{$t('global.apply_position' )}}
              <span class="body-1 ml-2">({{$t('global.position_text')}})</span>
            </div>
          </v-flex>
          <v-flex xs12 v-if="!forms.id">
            <!-- 职务 -->
            <v-layout row wrap>
              <template v-for="(item,i) in forms.memberPositions">
                <v-flex sm3>
                  <v-text-field v-model="item.title" :label="$t('chamber.member.position')" :rules="[rules.required]"
                                :placeholder="$t('chamber.member.placeholder_name')">
                  </v-text-field>
                </v-flex>
                <v-flex sm8>
                  <v-text-field v-model="item.des" :label="$t('chamber.position.description')"
                                :rules="[rules.required]"></v-text-field>
                </v-flex>
                <v-flex sm1>
                  <v-btn flat icon color="#1867c0" @click="deleteItem('position',i)" slot="activator">
                    <v-icon size="18">close</v-icon>
                  </v-btn>
                </v-flex>
              </template>
              <v-btn small color="primary" @click="addItem('position')"> {{$t('chamber.btn.add_position' )}}</v-btn>
            </v-layout>
            <!-- end 职务 -->
          </v-flex>
          <v-flex xs12>
            <v-divider></v-divider>
          </v-flex>
          <!-- A 创建企业图片信息 -->
          <v-flex xs12 sm6 md3>
            <v-layout row wrap>
              <v-flex xs12 md6>
                <p class=" text-xs-left mb-2">{{$t('chamber.create.logo')}}</p>
                <div class="fileinput fileinput-new text-center" data-provides="fileinput">
                  <div class="fileinput-new thumbnail">
                    <img v-if="logoUrl === null" src="./../../../../static/img/image_placeholder.jpg" style="width:100%"
                         alt="...">
                    <img v-else :src="logoUrl" style="width:100%" alt="...">
                  </div>
                  <div class="fileinput-preview fileinput-exists thumbnail" style=""></div>
                  <div class="text-xs-center">
                    <v-btn round color="primary" dark @click="show2 = !show2">{{$t('chamber.btn.file_update')}}</v-btn>
                  </div>
                  <my-upload field="logo" ref="file" :width="100" :height="100" @crop-success="cropSuccess"
                             v-model="show2" img-format="png"></my-upload>
                </div>
              </v-flex>
              <v-flex md6>
                <p class="mt-4  text-xs-left">{{$t('chamber.prompt.title')}}</p>
                <p class=" text-xs-left ">{{$t('chamber.prompt.update_lgo_text')}}</p>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs12 sm6 md5>
            <v-layout row wrap>
              <v-flex xs12 md8>
                <p class=" text-xs-left mb-2">{{$t('chamber.create.cover')}}</p>
                <div class="fileinput fileinput-new text-center" data-provides="fileinput">
                  <div class="fileinput-new thumbnail">
                    <img v-if="coverImageUrl === null" src="./../../../../static/img/image_placeholder.jpg"
                         style="width:100%" alt="...">
                    <img v-else :src="coverImageUrl" style="width:100%" alt="...">
                  </div>
                  <div class="fileinput-preview fileinput-exists thumbnail" style=""></div>
                  <div class="text-xs-center">
                    <v-btn round color="primary" dark @click="show3 = !show3">{{$t('chamber.btn.file_update')}}</v-btn>
                  </div>
                  <my-upload field="coverImage" ref="file" :width="650" :height="420" @crop-success="cropSuccess"
                             v-model="show3" img-format="png"></my-upload>
                </div>
              </v-flex>
              <v-flex md4>
                <p class="mt-4  text-xs-left">{{$t('chamber.prompt.title')}}</p>
                <p class=" text-xs-left ">{{$t('chamber.prompt.update_cover_text')}}</p>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs12 sm6 md4>
            <v-layout row wrap>
              <v-flex xs12 md6>
                <p class=" text-xs-left mb-2">{{$t('chamber.create.aptitude')}}</p>
                <div class="fileinput fileinput-new text-center" data-provides="fileinput">
                  <div class="fileinput-new thumbnail">
                    <img v-if="qualificationUrl === null" src="./../../../../static/img/image_placeholder.jpg"
                         style="width:100%" alt="...">
                    <img v-else :src="qualificationUrl" style="width:100%" alt="...">
                  </div>
                  <div class="fileinput-preview fileinput-exists thumbnail" style=""></div>
                  <div class="text-xs-center">
                    <v-btn round color="primary" dark @click="show4 = !show4">{{$t('chamber.btn.file_update')}}</v-btn>
                  </div>
                  <my-upload field="qualification" ref="file" :width="248" :height="354" @crop-success="cropSuccess"
                             v-model="show4" img-format="png"></my-upload>
                </div>
              </v-flex>
              <v-flex md6>
                <p class="mt-4  text-xs-left">{{$t('chamber.prompt.title')}}</p>
                <p class=" text-xs-left ">{{$t('chamber.prompt.update_aptitude_text')}}</p>
              </v-flex>
            </v-layout>
          </v-flex>
        <!-- end  创建企业图片信息 -->
          <v-flex xs12 class="text-xs-left">
            <p>{{$t('chamber.create.introduction')}}</p>
            <quill-editor ref="myTextEditor" :rules="[rules.required]" v-model="forms.description"
                          :options="editorOption">
            </quill-editor>
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex>
            <v-btn flat @click="back()">{{$t('button.cancel')}}</v-btn>
            <v-btn color="indigo darken-1" :disabled="!valid" :loading="isLoading" flat @click.native="onSubmit()">
              {{$t('button.save')}}
            </v-btn>
          </v-flex>
        </v-layout>

      </v-card>
    </v-container>
  </v-form>
</template>
<script>
  import myUpload from './../../../components/image-crop-upload/upload-2'
  import {mapState, mapMutations} from 'vuex'
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'

  import {quillEditor} from 'vue-quill-editor'

  export default {
    components: {
      'my-upload': myUpload,
      quillEditor
    },
    data() {
      return {
        isSettled: false,
        isLoading: false,
        logoUrl: null,
        i18n: localStorage.getItem('i18n') === 'EN' ? 'en-us' : 'zh-cn',
        currentDate: this.$moment(new Date()),
        coverImageUrl: null,
        qualificationUrl: null,
        idFrontUrl: null,
        show1: false,
        show2: false,
        show3: false,
        show4: false,
        menu1: false,
        valid: true,
        industrys: [],
        locations: [],
        editorOption: {
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
              [{header: 1}, {header: 2}],
              [{list: 'ordered'}, {list: 'bullet'}],
              [{direction: 'rtl'}],
              [{size: ['small', false, 'large', 'huge']}],
              [{header: [1, 2, 3, 4, 5, 6, false]}],
              [{font: []}],
              [{color: []}, {background: []}],
              ['link', 'image']
            ],
            syntax: {
              highlight: text => hljs.highlightAuto(text).value
            }
          },
          placeholder: this.$t('chamber.placeholder.create.introduction')
        },
        scales: [
          {id: 'BETWEEN30AND50', name: '30 - 50'},
          {id: 'BETWEEN50AND100', name: '50 - 100'},
          {id: 'MORETHAN100', name: '100+'}
        ],
        months: [
          {id: '1', name: '1'},
          {id: '2', name: '2'},
          {id: '3', name: '3'},
          {id: '4', name: '4'},
          {id: '5', name: '5'},
          {id: '6', name: '6'},
          {id: '7', name: '7'},
          {id: '8', name: '8'},
          {id: '9', name: '9'},
          {id: '10', name: '10'},
          {id: '11', name: '11'},
          {id: '12', name: '12'}
        ],
        forms: {
          address: null,
          description: null,
          scale: null,
          email: null,
          establishedDate: null,
          purpose: null,
          name: null,
          phone: null,
          contacts: null,
          memberships: [
            {
              name: null,
              amount: null,
              deleted: true,
              position: null,
              period: null,
              isForever: false
            }
          ],
          memberPositions: [{title: null, des: null}],
          'industry.id': null,
          'country.id': 99,
          'location.id': null
        },
        enterprises: {
          phone: null,
          email: null,
          lastName: null,
          firstName: null
        },
        emailRules: [
          v => !!v || this.$t('validation.required'),
          v => /.+@.+/.test(v) || this.$t('validation.email')
        ],
        rules: {
          email: v => (v || '').match(/@/) || this.$t('validation.email'),
          required: v => !!v || this.$t('validation.required'),
        }
      }
    },
    computed: {
      ...mapState(['imagesToUpload'])
    },
    mounted() {

      this.reloadIndustrys()
      this.reloadLocations()
      if (this.$route.params.organizationId) {
        this.readFindOrganization()
      }
      if (
        this.$route.path ===
        `/organizations/${this.$route.params.userId}/settled`
      ) {
        this.readEnterprises()
      }
    },
    methods: {
      ...mapMutations(['snackbarStateChange']),
      //获取企业
      readEnterprises() {
        this.$http
          .get(`public/user/${this.$route.params.userId}/enterprises`)
          .then(res => {
            if (res.data.content.length > 0) {
              this.isSettled = false
            } else {
              this.isSettled = true
            }
          })
      },
      //商會
      readFindOrganization() {
        this.$http
          .get(`public/organizations/${this.$route.params.organizationId}`)
          .then(res => {
            this.forms = res.data
            this.forms['industry.id'] = res.data.industry.id
            this.forms['country.id'] = 99
            this.forms['location.id'] = res.data.location.id
            this.logoUrl = `${this.$fileUrl}/public/uploads/o/company/organization/${this.$route.params.organizationId}/${this.forms.logo}`
            this.coverImageUrl = `${this.$fileUrl}/public/uploads/o/company/organization/${this.$route.params.organizationId}/${
              this.forms.coverImage
              }`
            this.qualificationUrl = `${this.$fileUrl}/public/uploads/o/company/organization/${this.$route.params.organizationId}/${
              this.forms.qualification
              }`
          })
      },
      //行業
      reloadIndustrys() {
        this.$http.get('public/industrys').then(res => {
          this.industrys = res.data.content
        })
      },
      // 获取地区
      reloadLocations() {
        this.$http.get('public/locations').then(res => {
          this.locations = res.data.content
        })
      },
      cropSuccess(imgDataUrl, field) {
        switch (field) {
          case 'logo':
            this.logoUrl = imgDataUrl
            break
          case 'coverImage':
            this.coverImageUrl = imgDataUrl
            break
          case 'qualification':
            this.qualificationUrl = imgDataUrl
            break
          case 'idFront':
            this.idFrontUrl = imgDataUrl
            break
        }
      },
      onSubmit() {
        this.isLoading = true
        if (this.isSettled) {
          this.onSubmitEnterprises()
        } else {
          //添加
          if (!this.forms.id) {
            if (this.logoUrl === null) {
              this.snackbarStateChange({
                color: 'error',
                text: this.$t('message.file_logo_error'),
                snackbar: true
              })
              return
            } else if (this.coverImageUrl === null) {
              this.snackbarStateChange({
                color: 'error',
                text: this.$t('message.file_cover_error'),
                snackbar: true
              })
              return
            } else {
              let formData = new FormData()
              for (
                let i = 0, len = this.imagesToUpload.length;
                i < len;
                i++
              ) {
                formData.append(
                  this.imagesToUpload[i].key,
                  this.imagesToUpload[i].value,
                  `${this.imagesToUpload[i].key}.png`
                )
              }
              Object.keys(this.forms).forEach(k => {
                if (k === 'memberships') {
                  Object.keys(this.forms[k]).forEach((v, i) => {
                    formData.append(
                      `${k}[${i}].isForever`,
                      this.forms[k][i].isForever
                    )
                    formData.append(
                      `${k}[${i}].position`,
                      this.forms[k][i].position
                    )
                    formData.append(
                      `${k}[${i}].period`,
                      this.forms[k][i].period
                    )
                    formData.append(
                      `${k}[${i}].name`,
                      this.forms[k][i].name
                    )
                    formData.append(
                      `${k}[${i}].amount`,
                      this.forms[k][i].amount
                    )
                  })
                } else if (k === 'memberPositions') {
                  Object.keys(this.forms[k]).forEach((v, i) => {
                    formData.append(
                      `${k}[${i}].title`,
                      this.forms[k][i].title
                    )
                    formData.append(
                      `${k}[${i}].description`,
                      this.forms[k][i].des
                    )
                  })
                } else {
                  formData.append(
                    `organization.${k}`,
                    this.forms[k]
                  )
                }
              })
              this.$http
                .post('public/organizations', formData)
                .then(response => {
                  this.snackbarStateChange({
                    color: 'success',
                    text: '提交成功',
                    snackbar: true
                  })
                  this.$store.commit('clearImagesToUpload')
                  this.$store.commit('clearFilesToUpload')
                  this.isLoading = false
                  this.$router.push({
                    path: `/organizations/select`
                  })
                })
                .catch(error => {
                  this.snackbarStateChange({
                    color: 'error',
                    text: error,
                    snackbar: true
                  })
                  this.isLoading = false
                })
            }
          } else {
            //修改
            let formData = new FormData()
            if (this.imagesToUpload.length > 0) {
              for (
                let i = 0, len = this.imagesToUpload.length;
                i < len;
                i++
              ) {
                formData.append(
                  `${this.imagesToUpload[i].key}s`,
                  this.imagesToUpload[i].value,
                  `${this.imagesToUpload[i].key}.png`
                )
              }
            }
            this.forms['enterprise.id'] = this.forms.enterprise.id
            delete this.forms.enterprise
            delete this.forms.location
            delete this.forms.industry
            Object.keys(this.forms).forEach(k => {
              formData.append(`${k}`, this.forms[k])
            })
            this.$http
              .post('manager/organizations/update_organization', formData, {
                headers: {
                  'X-TENANT-ID': this.$route.params.organizationId
                }
              })
              .then(response => {
                this.snackbarStateChange({
                  color: 'success',
                  text: this.$t('message.update_message'),
                  snackbar: true
                })
                this.$store.commit('clearImagesToUpload')
                this.$store.commit('clearFilesToUpload')
                this.isLoading = false
                this.$router.push({path: `/organizations/select`})
              })
              .catch(error => {
                this.snackbarStateChange({
                  color: 'error',
                  text: error,
                  snackbar: true
                })
                this.isLoading = false
              })
          }
        }
      },
      //入驻
      onSubmitEnterprises() {
        let formData = new FormData()
        if (this.imagesToUpload.length > 0) {
          for (
            let i = 0, len = this.imagesToUpload.length;
            i < len;
            i++
          ) {
            formData.append(
              this.imagesToUpload[i].key,
              this.imagesToUpload[i].value,
              `${this.imagesToUpload[i].key}.png`
            )
          }
        }

        Object.keys(this.enterprises).forEach(k => {
          formData.append(`${k}`, this.enterprises[k])
        })
        this.$http
          .post(`public/user/${this.$route.params.userId}/enterprises`, formData)
          .then(response => {
            this.snackbarStateChange({
              color: 'success',
              text: this.$t('message.store_message'),
              snackbar: true
            })
            this.$store.commit('clearImagesToUpload')
            this.$store.commit('clearFilesToUpload')
            this.isLoading = false
            this.isSettled = false
          })
          .catch(error => {
            this.snackbarStateChange({
              color: 'error',
              text: error,
              snackbar: true
            })
            this.isLoading = false
          })
      },
      //  添加職務會籍
      addItem(type, isForever) {
        switch (type) {
          case 'memberships':
            if (isForever) {
              this.forms.memberships.push({
                name: '',
                amount: '',
                deleted: true,
                position: '',
                period: 0,
                isForever: true
              })
            } else {
              this.forms.memberships.push({
                name: '',
                amount: '',
                deleted: false,
                position: '',
                period: 1,
                isForever: false
              })
            }
            break
          case 'position':
            this.forms.memberPositions.push({title: '', des: ''})
        }
      },
      // 刪除職務會籍
      deleteItem(status, index) {
        switch (status) {
          case 'memberships':
            if (this.forms.memberships.length === 1) {
              this.snackbarStateChange({
                color: 'error',
                text: this.$t('validation.required'),
                snackbar: true
              })
            } else {
              this.forms.memberships.splice(index, 1)
            }
            break
          case 'position':
            if (this.forms.memberPositions.length === 1) {
              this.snackbarStateChange({
                color: 'error',
                text: this.$t('validation.required'),
                snackbar: true
              })
            } else {
              this.forms.memberPositions.splice(index, 1)
            }
        }
      },
      back() {
        this.$router.back()
      }
    }
  }
</script>

<style lang="scss">
  @media only screen and (min-width: 1904px) {
    .container {
      max-width: 1200px !important;
    }
  }

  .fileinput .thumbnail {
    margin-bottom: 10px;
    overflow: hidden;
    text-align: center;
    vertical-align: middle;
    max-width: 250px;
    box-shadow: 0 10px 30px -12px rgba(0, 0, 0, 0.42),
    0 4px 25px 0 rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2);
  }

  .card-icon {
    border-radius: 3px;
    background-color: #999;
    padding: 15px;
    margin-top: -45px;
    margin-right: 15px;
    float: left;
    background: linear-gradient(60deg, #2c7a90, #CFD8DC);
    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.14),
    0 7px 10px -5px rgba(30, 77, 233, 0.4);

    i {
      width: 33px;
      height: 33px;
      text-align: center;
      line-height: 33px;
      color: #fff;
    }
  }

  .card-title {
    margin-top: 15px;
    color: #3c4858;
  }
</style>

