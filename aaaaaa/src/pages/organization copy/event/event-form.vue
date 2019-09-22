<template>
  <div id="event-form">
    <v-form ref="form" v-model="valid" class="my-5">
      <v-container grid-list-xl text-xs-center>
        <v-card class="pa-4">
          <div class="card-header card-header-icon card-header-rose">
            <div class="card-icon">
              <v-icon class="white--text">local_activity</v-icon>
            </div>
            <h4 class="card-title text-lg-left">
              <font style="vertical-align: inherit;">
                <font style="vertical-align: inherit;">
                  <router-link :to="`/organization/${$route.params.organizationId}/events`">
                    {{$t('chamber.left.activity')}}
                  </router-link>
                  -
                </font>
              </font>
              <small class="category">
                <font style="vertical-align: inherit;">
                  <font style="vertical-align: inherit;">{{$t($route.name)}} </font>
                </font>
              </small>
            </h4>
          </div>
          <v-layout row wrap>
            <v-flex xs12 sm6 md8>
              <v-text-field color="purple darken-2" :rules="[rules.required]" v-model="eventForm.event.title"
                            :label="$t('chamber.activity.name')"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md4>
              <v-autocomplete v-model="eventCategoryId" :items="categories" :no-data-text="$t('message.no_message')"
                              :rules="[rules.required]" color="purple darken-2" :label="$t('chamber.activity.category')"
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
            <v-flex xs12 sm6 md4>
              <vue-ctk-date-time-picker id="startedAt" format="YYYY-MM-DD HH:mm:ss" formatted="YYYY-MM-DD HH:mm:ss"
                                        v-model="eventForm.event.startedAt" :label="$t('chamber.activity.startTimedAt')"
                                        color="#2c7a90" enable-button-validate></vue-ctk-date-time-picker>
            </v-flex>
            <v-flex xs12 sm6 md4>
              <vue-ctk-date-time-picker id="endedAt" format="YYYY-MM-DD HH:mm:ss" formatted="YYYY-MM-DD HH:mm:ss"
                                        v-model="eventForm.event.endedAt" :label="$t('chamber.activity.endTimedAt')"
                                        color="#2c7a90" enable-button-validate></vue-ctk-date-time-picker>
            </v-flex>
            <v-flex xs12 sm6 md4>
              <vue-ctk-date-time-picker format="YYYY-MM-DD HH:mm:ss" formatted="YYYY-MM-DD HH:mm:ss"
                                        v-model="eventForm.event.releasedAt"
                                        :label="$t('chamber.activity.signUpEndTimedAt')" color="#2c7a90"
                                        enable-button-validate></vue-ctk-date-time-picker>
            </v-flex>
            <v-flex xs12>
              <v-text-field color="purple darken-2" :rules="[rules.required]" v-model="eventForm.event.address"
                            :label="$t('chamber.activity.address')"></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field type="number" :rules="[rules.required]" color="purple darken-2"
                            v-model="eventForm.event.personnelNumber" :label="$t('chamber.activity.scale')"
                            :hint="$t('global.post_activity_text')"></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-layout row wrap>
                <v-flex xs12 md3>
                  <p class=" text-xs-left mb-2">{{$t('chamber.create.news_cover')}}</p>
                  <div class="fileinput fileinput-new text-center" data-provides="fileinput">
                    <div class="fileinput-new thumbnail">
                      <img v-if="imgDataUrl === null" src="./../../../../static/img/image_placeholder.jpg"
                           style="width:100%" alt="...">
                      <img v-else :src="imgDataUrl" style="width:100%" alt="...">
                    </div>
                    <div class="fileinput-preview fileinput-exists thumbnail" style=""></div>
                    <div class="text-xs-center">
                      <v-btn round color="primary" dark @click="show = !show">{{$t('chamber.btn.file_update')}}</v-btn>
                    </div>
                    <my-upload field="file" ref="file" :width="640" :height="400" @crop-success="cropSuccess"
                               v-model="show" img-format="png"></my-upload>
                  </div>
                </v-flex>
                <v-flex md3>
                  <p class="mt-4  text-xs-left ">{{$t('chamber.prompt.title')}}</p>
                  <p class="text-xs-left ">{{$t('chamber.prompt.update_file_size_text')}}</p>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs12>
              <p class=" text-xs-left mb-2">{{$t('global.ticket_information')}}</p>
            </v-flex>
            <v-flex xs12>
              <v-layout row wrap class="px-2">
                <v-flex xs12 md3 class="primary text-xs-left  white--text">
                  {{$t('global.ticket' )}}
                </v-flex>
                <v-flex xs12 md3 class="primary text-xs-left  white--text">
                  {{$t('chamber.activity.price')}}
                </v-flex>
                <v-flex xs12 md2 class="primary text-xs-left white--text">
                  {{$t('chamber.activity.quantity')}}
                </v-flex>
                <v-flex xs12 md3 class="primary text-xs-left white--text">
                  {{$t('global.auditSettings' )}}
                </v-flex>
                <v-flex xs12 md1 class="primary white--text">
                  {{$t('chamber.select.operation' )}}
                </v-flex>
              </v-layout>
              <v-layout row wrap class="px-2 mb-5">
                <template v-for="(item,i) in eventForm.eventTickets">
                  <v-flex xs12 md3>
                    <v-text-field color="purple darken-2" :rules="[rules.required]" v-model="item.name"
                                  :label="$t('global.inputName')"></v-text-field>
                  </v-flex>
                  <v-flex xs12 md3>
                    <v-text-field color="purple darken-2" :disabled="item.price === 0" min="0" v-model="item.price"
                                  type="number" :label="$t('chamber.activity.price')"></v-text-field>
                  </v-flex>
                  <v-flex xs12 md2>
                    <v-text-field color="purple darken-2" :rules="[rules.required]" v-model="item.quantity" min="1"
                                  type="number" :label="$t('chamber.activity.quantity')"></v-text-field>
                  </v-flex>
                  <v-flex xs12 md3>
                    <v-select color="purple darken-2" v-model="item.approvalType"
                              :items="[{id: 'NONE',name:$t('chamber.activity.none') },{id: 'APPROVE',name:$t('chamber.activity.APPROVE') }]"
                              item-text="name" item-value="id" :label="$t('global.auditSettings')"
                              :rules="[rules.required]" persistent-hint single-line></v-select>
                  </v-flex>
                  <v-flex xs12 md1 v-if="!eventForm.id">
                    <v-btn flat icon color="primary" @click="deleteTickets(i)">
                      <v-icon>delete_forever</v-icon>
                    </v-btn>
                  </v-flex>
                </template>
              </v-layout>
              <v-btn small v-if="!eventForm.id" class="mb-5" @click="addTickets(true)">
                {{$t('chamber.activity.addFreeTicket')}}
              </v-btn>
              <v-btn small v-if="!eventForm.id" class="mb-5 primary white--text" @click="addTickets(false)">
                {{$t('chamber.activity.addTicket')}}
              </v-btn>
            </v-flex>

            <v-flex xs12 class="text-xs-left">
              <p>{{$t('chamber.activity.content')}}</p>
              <quill-editor ref="myTextEditor" :rules="[rules.required]" v-model="eventForm.event.description"
                            :options="editorOption">
              </quill-editor>
            </v-flex>

            <v-flex xs12 sm6 md3>
              <v-text-field v-model="eventForm.eventOrganizer.name" :rules="[rules.required]"
                            :label="$t('chamber.activity.sponsor_coc')"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md3>
              <v-text-field v-model="eventForm.eventOrganizer.description" :rules="[rules.required]"
                            :label="$t('chamber.activity.sponsor')"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md3>
              <v-text-field v-model="eventForm.eventOrganizer.phone" :rules="[rules.required]"
                            :label="$t('chamber.create.phone')"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md3>
              <v-text-field v-model="eventForm.eventOrganizer.email" :rules="[rules.required]"
                            :label="$t('chamber.create.email')"></v-text-field>
            </v-flex>
          </v-layout>
          <v-btn flat :to="`/organization/${$route.params.organizationId}/events`">{{$t('button.cancel')}}</v-btn>
          <v-btn color="indigo darken-1" :disabled="!valid || !eventForm.event.description" :loading="isLoading" flat
                 @click.native="onSubmit()">{{$t('button.save')}}
          </v-btn>
        </v-card>
      </v-container>
    </v-form>
  </div>
</template>
<script>
  import myUpload from './../../../components/image-crop-upload/upload-2'
  import {mapState, mapMutations} from 'vuex'
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'

  import {quillEditor} from 'vue-quill-editor'
  import {AxiosRequestConfig} from 'axios'

  export default {
    components: {
      'my-upload': myUpload,
      quillEditor
    },
    data() {
      return {
        valid: true,
        isLoading: false,
        show: false,
        imgDataUrl: null,
        i18n: localStorage.getItem('i18n') === 'EN' ? 'en-us' : 'zh-cn',
        categories: [],
        eventCategoryId: null,
        approvals: ['NONE', 'APPROVE'],
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
          placeholder: this.$t('chamber.know.content')

        },
        eventForm: {
          eventTickets: [],
          eventOrganizer: {
            organizationId: this.$route.params.organizationId,
            email: null,
            name: null,
            phone: null,
            description: null
          },
          event: {
            title: null,
            startedAt: null,
            status: 'PUBLISHED',
            releasedAt: null,
            endedAt: null,
            personnelNumber: null,
            address: null,
            description: null
          }
        },
        rules: {
          required: v => !!v || this.$t('validation.required')
        }
      }
    },
    computed: {
      ...mapState(['imagesToUpload'])
    },
    mounted() {
      this.reloadCategories()
      if (!this.eventForm.id) {
        this.reloadCoc()
      }
      if (this.$route.params.eventId) {
        this.reloadFind()
      }
    },
    methods: {
      ...mapMutations(['snackbarStateChange']),
      reloadFind() {
        this.$http.get(`manager/events/${this.$route.params.eventId}`, {
          headers: {
            'X-TENANT-ID': this.$route.params.organizationId
          }
        }).then(res => {
          this.eventForm.event.title = res.data.title
          this.eventForm.id = res.data.id
          this.eventForm.event.startedAt = res.data.startedAt
          this.eventForm.event.endedAt = res.data.endedAt
          this.eventForm.event.releasedAt = res.data.releasedAt
          this.eventForm.event.status = res.data.status
          this.eventForm.event.personnelNumber = res.data.personnelNumber
          this.eventForm.event.address = res.data.address
          this.eventForm.event.description = res.data.description
          this.eventCategoryId = res.data.eventCategory.id
          delete res.data.eventOrganizer.lastModifiedAt
          delete res.data.eventOrganizer.lastModifiedBy
          delete res.data.eventOrganizer.createdBy
          delete res.data.eventOrganizer.createdAt
          this.eventForm.eventOrganizer = res.data.eventOrganizer
          delete res.data.eventTickets[0].createdBy
          delete res.data.eventTickets[0].createdAt
          delete res.data.eventTickets[0].lastModifiedBy
          delete res.data.eventTickets[0].lastModifiedAt
          this.eventForm.eventTickets = res.data.eventTickets
          this.imgDataUrl = `${this.$fileUrl}/public/uploads/o/company/event/${res.data.id}/${
            res.data.eventFiles[0].key
            }`
        })
      },
      reloadCoc() {
        this.$http
          .get(`manager/organizations/${this.$route.params.organizationId}`, {
            headers: {
              'X-TENANT-ID': this.$route.params.organizationId
            }
          })
          .then(res => {
            this.eventForm.eventOrganizer.phone = res.data.phone
            this.eventForm.eventOrganizer.description =
              res.data.contacts;
            this.eventForm.eventOrganizer.name = res.data.name
            this.eventForm.eventOrganizer.email = res.data.email
          })
      },
      reloadCategories() {
        this.$http.get('public/event_categorys').then(res => {
          this.categories = res.data.content
        })
      },
      cropSuccess(imgDataUrl, field) {
        this.imgDataUrl = imgDataUrl
      },
      //添加門票
      addTickets(isForever) {
        if (isForever) {
          this.eventForm.eventTickets.push({
            name: null,
            price: 0,
            deleted: true,
            quantity: 0,
            approvalType: 'NONE'
          })
        } else {
          this.eventForm.eventTickets.push({
            name: null,
            price: null,
            deleted: false,
            quantity: 0,
            approvalType: 'NONE'
          })
        }
      },
      //刪除門票
      deleteTickets(index) {
        this.eventForm.eventTickets.splice(index, 1)
      },
      onSubmit() {
        if (this.$refs.form.validate()) {
          this.isLoading = true
          //添加
          if (!this.eventForm.id) {
            if (this.imagesToUpload.length === 0) {
              this.snackbarStateChange({
                color: 'error',
                text: this.$t('chamber.placeholder.prompt.update_file_size_text'),
                snackbar: true
              })
              this.isLoading = false
              return
            } else if (this.eventForm.eventTickets.length === 0) {
              this.snackbarStateChange({
                color: 'error',
                text: this.$t('global.selectType'),
                snackbar: true
              })
              this.isLoading = false
              return
            } else {
              this.addEvent(this.eventForm)
            }
          } else {
            this.editEvent()
            if (this.imagesToUpload.length > 0) {
              this.editEventCover()
            }
          }
        }
      },
      //添加活動
      addEvent() {
        let formData = new FormData()
        for (let i = 0, len = this.imagesToUpload.length; i < len; i++) {
          formData.append(
            this.imagesToUpload[i].key,
            this.imagesToUpload[i].value,
            `${this.imagesToUpload[i].key}.png`
          )
        }
        formData.append(`organizationId`, this.$route.params.organizationId)
        formData.append(`eventCategoryId`, this.eventCategoryId)
        Object.keys(this.eventForm).forEach(k => {
          if (k === 'eventTickets') {
            Object.keys(this.eventForm[k]).forEach((v, i) => {
              formData.append(
                `${k}[${i}].name`,
                this.eventForm[k][i].name
              )
              formData.append(
                `${k}[${i}].price`,
                this.eventForm[k][i].price
              )
              formData.append(
                `${k}[${i}].quantity`,
                this.eventForm[k][i].quantity
              )
              formData.append(
                `${k}[${i}].approvalType`,
                this.eventForm[k][i].approvalType
              )
            })
          } else {
            Object.keys(this.eventForm[k]).forEach(i => {
              formData.append(`${k}.${i}`, this.eventForm[k][i])
            })
          }
        })

        this.$http
          .post('manager/events', formData, {
            headers: {
              'X-TENANT-ID': this.$route.params.organizationId
            }
          })
          .then(response => {
            this.snackbarStateChange({
              color: 'success',
              text: this.$t('message.store_message'),
              snackbar: true
            })
            this.$store.commit('clearImagesToUpload')
            this.$store.commit('clearFilesToUpload')
            this.isLoading = false
            this.$router.push({
              path: `/organization/${
                this.$route.params.organizationId
                }/events`
            })
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
      //修改活動
      editEvent() {
        this.eventForm['eventCategoryId'] = this.eventCategoryId
        this.eventForm['event.id'] = this.eventForm.id
        this.eventForm['organizationId'] = this.$route.params.organizationId
        this.$http
          .put('manager/events', this.$serialize(this.eventForm), {
            headers: {
              'X-TENANT-ID': this.$route.params.organizationId
            }
          })
          .then(res => {
            this.snackbarStateChange({
              color: 'success',
              text: this.$t('message.update_message'),
              snackbar: true
            })
            this.$router.push({
              path: `/organization/${
                this.$route.params.organizationId
                }/events`
            })
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
      //修改活動封面圖
      editEventCover() {
        let formData = new FormData()
        for (let i = 0, len = this.imagesToUpload.length; i < len; i++) {
          formData.append(
            this.imagesToUpload[i].key,
            this.imagesToUpload[i].value,
            `${this.imagesToUpload[i].key}.png`
          )
        }
        formData.append(`eventId`, this.eventForm.id)
        this.$http
          .post('manager/event_files', formData, {
            headers: {
              'X-TENANT-ID': this.$route.params.organizationId
            }
          })
          .then(res => {
            this.snackbarStateChange({
              color: 'success',
              text: this.$t('message.update_message'),
              snackbar: true
            })
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

  .ctk-date-time-picker .field .field-input {
    border: none !important;
    border-bottom: 1px solid rgba(0, 0, 0, 0.42) !important;
    height: 48px !important;
    border-radius: 0 !important;
  }

  #CtkDateTimePicker .datetimepicker, #endedAt .datetimepicker, #startedAt .datetimepicker {
    .flex {
      padding: 0;
    }

    .datepicker-button {
      flex: unset !important;
      padding: 0 20px !important;

    }

    .datepicker-buttons-container {
      padding: 5px 10px !important;
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

