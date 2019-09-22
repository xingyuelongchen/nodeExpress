<template>
  <div>
    <v-layout row wrap align-center fill-height class="mx-4 mt-2">
      <v-flex md3 xs8>
        <v-text-field :label="$t('global.search_text')" v-model="filters.search" @keyup.enter="reloadTable()"
                      prepend-icon="search" px3 class="px3"></v-text-field>
      </v-flex>
      <v-flex>
        <v-btn class="pull-right" color="primary"
               @click="dialog1 = true;title='chamber.btn.add_course';imgDataUrl = null">{{$t('chamber.btn.add_course')}}
        </v-btn>
      </v-flex>
    </v-layout>
    <v-data-table hide-actions :headers="headers" :items="desserts" :no-data-text="$t('message.no_message')"
                  :pagination.sync="pagination" :rows-per-page-items="limit" :total-items="totalDesserts"
                  :loading="loading" class="rtable rtable--flip elevation-1">
      <template slot="items" slot-scope="props">
        <td class="text-xs-left py-2">
          <v-img class="hidden-xs-only"
                 :src="`${$fileUrl}/public/uploads/o/company/slideShow/${props.item.id}/${props.item.key}`"
                 lazy-src="https://picsum.photos/510/300?random" aspect-ratio="1.7"></v-img>
          <img class="hidden-sm-and-up" :src="`${$fileUrl}${props.item.key}`" style="padding:5px" width="80">
        </td>
        <td class="text-no-wrap  text-truncate">{{ props.item.title }}</td>
        <td class="text-xs-left"><a :href="`${props.item.url}`" target="_blank">{{ props.item.url }}</a></td>
        <td class="text-xs-left">{{ props.item.createdAt | time}}</td>
        <td class="text-xs-left">{{ props.item.order}}</td>
        <td class="text-xs-center">
          <v-tooltip top>
            <v-btn flat icon color="primary" slot="activator" @click="edieDialog(props.item)">
              <v-icon size="18">edit</v-icon>
            </v-btn>
            <span>{{$t('button.edit')}}</span>
          </v-tooltip>
          <v-tooltip top>
            <v-btn flat icon color="error" slot="activator" @click.native="change(props.item.id)">
              <v-icon size="18">close</v-icon>
            </v-btn>
            <span>{{$t('button.delete')}}</span>
          </v-tooltip>

        </td>
      </template>
      <template slot="footer">
        <td
          :colspan="headers.length +1"
          class="px-0"
        >
          <v-pagination
            circle
            class="pull-right my-2"
            :total-visible="7"
            @input="handleInput"
            v-model="filters.page+1"
            :length="totalPages"
          ></v-pagination>
        </td>
      </template>
    </v-data-table>

    <!-- 刪除模態框 -->
    <v-layout row justify-center>
      <v-dialog v-model="dialog" max-width="290">
        <v-card>
          <v-card-title class="headline">{{$t('global.deleteConfirmTitle')}}</v-card-title>
          <v-card-text>{{$t('global.deleteConfirmText')}}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="darken-1" flat @click.native="dialog = false">{{$t('button.cancel')}}</v-btn>
            <v-btn color="primary darken-1" flat @click="deletes()">{{$t('button.confirm')}}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>

    <!-- 添加修改模態框 -->
    <v-layout row justify-center>
      <v-dialog v-model="dialog1"  max-width="800px">
        <v-card>
          <v-card-title>
            <span class="title">{{$t(title)}}</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-form ref="form" v-model="form">
                <v-layout row wrap>
                  <v-flex xs12>
                    <v-text-field color="purple darken-2" v-model="forms.title" :label="$t('chamber.know.title')"
                                  :hint="$t('chamber.placeholder.course.title')" :rules="[rules.required]"
                                  clearable></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-layout row wrap>
                      <v-flex xs6>
                        <v-text-field color="purple darken-2" v-model="forms.url"
                                      :label="$t('chamber.know.link_address')"
                                      :hint="$t('chamber.placeholder.course.link_address')" :rules="[rules.required, rules.website]"
                                      clearable></v-text-field>
                      </v-flex>
                      <v-flex xs6>
                        <v-text-field color="purple darken-2" v-model="forms.order" :label="$t('chamber.know.sort')"
                                      :hint="$t('chamber.placeholder.course.sort')" :rules="[rules.required]"
                                      clearable></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex xs12>
                    <v-layout row wrap>
                      <v-flex xs12 md4>
                        <p class=" text-xs-left mb-2">{{$t('chamber.create.news_cover')}}</p>
                        <div class="fileinput fileinput-new text-center" data-provides="fileinput">
                          <div class="fileinput-new thumbnail">
                            <img v-if="imgDataUrl === null" src="./../../../../static/img/image_placeholder.jpg"
                                 style="width:100%" alt="...">
                            <img v-else :src="imgDataUrl" style="width:100%" alt="...">
                          </div>
                          <div class="fileinput-preview fileinput-exists thumbnail" style=""></div>
                          <div class="text-xs-center">
                            <v-btn round color="primary" dark @click="show = !show">{{$t('chamber.btn.file_update')}}
                            </v-btn>
                          </div>
                          <my-upload field="file" ref="file" :width="1200" :height="440" @crop-success="cropSuccess"
                                     v-model="show" img-format="png"></my-upload>
                        </div>
                      </v-flex>
                      <v-flex md4 class="ml-4">
                        <p class="mt-4  text-xs-left ">{{$t('chamber.prompt.title')}}</p>
                        <p class=" text-xs-left ">{{$t('chamber.prompt.update_file_size_text')}}</p>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="darken-1" flat @click.native="dialog1 = false;forms={type:'PLSTFORM'}">
              {{$t('button.cancel')}}
            </v-btn>
            <v-btn color="primary darken-1" :disabled="!form" :loading="isLoading" flat @click.native="onSubmit()">
              {{$t('button.save')}}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>

  </div>
</template>
<script>
  import myUpload from './../../../components/image-crop-upload/upload-2'
  import {mapState, mapMutations} from 'vuex'

  export default {
    data() {
      return {
        countries: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        loading: true,
        dialog: false,
        dialog1: false,
        form: false,
        isLoading: false,
        show: false,
        snackbarText: null,
        imgDataUrl: null,
        snackbar: false,
        show: false,
        itemId: null,
        title: 'chamber.btn.add_course',
        filters: {
          search: null,
          'organization.id': this.$route.params.organizationId,
          page: 0,
          pageSize: 9
        },
        forms: {
          url: null,
          order: null,
          title: null,
          type: 'PLSTFORM'
        },
        totalDesserts: 0,
        totalPages: 0,
        pagination: {
          sortBy: 'createdAt',
          sortBy: 'order'
        },
        rules: {
          required: v => !!v || this.$t('validation.required'),
          website: value => {
            const pattern = /^(https?):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
            return pattern.test(value) || 'Invalid website.'
          }
        },
        limit: [10],
        headers: [
          {
            text: this.$t('chamber.position.image'),
            align: 'left',
            sortable: false,
            value: 'image'
          },
          {
            text: this.$t('chamber.know.title'),
            align: 'left',
            sortable: false,
            value: 'title'
          },
          {
            text: this.$t('chamber.know.link_address'),
            value: 'url',
            sortable: false
          },
          {text: this.$t('chamber.know.time'), value: 'createdAt'},
          {text: this.$t('chamber.know.sort'), value: 'order'},
          {
            text: this.$t('chamber.know.operation'),
            value: 'operation',
            sortable: false
          }
        ],
        desserts: []
      }
    },
    watch: {
      pagination: {
        handler() {
          const sortBy = this.pagination.sortBy
          this.desserts = this.desserts.sort((a, b) => {
            const sortA = a[sortBy]
            const sortB = b[sortBy]
            if (this.pagination.descending) {
              if (sortA < sortB) return 1
              if (sortA > sortB) return -1
              return 0
            } else {
              if (sortA < sortB) return -1
              if (sortA > sortB) return 1
              return 0
            }
          })
        },
        deep: true
      }
    },
    computed: {
      ...mapState(['imagesToUpload'])
    },
    mounted() {
      this.filters.page =
        this.$route.query.page !== undefined
          ? Number(this.$route.query.page) - 1
          : 0
      this.reloadTable()
    },
    components: {
      'my-upload': myUpload
    },
    methods: {
      ...mapMutations(['snackbarStateChange']),
      reloadTable() {
        this.loading = true
        if (this.filters.search === null) {
          delete this.filters.search
        }
        this.$http
          .get('manager/slide_shows', {
            params: this.filters,
            headers: {
              'X-TENANT-ID': this.$route.params.organizationId
            }
          })
          .then(res => {
            this.desserts = res.data.content
            this.totalDesserts = res.data.totalElements
            this.totalPages = res.data.totalPages
            this.loading = false
          })
      },
      cropSuccess(imgDataUrl, field) {
        this.imgDataUrl = imgDataUrl
      },
      change(id) {
        this.dialog = true
        this.itemId = id
      },
      deletes() {
        this.$http
          .delete(`manager/slide_shows/${this.itemId}`, {
            headers: {
              'X-TENANT-ID': this.$route.params.organizationId
            }
          })
          .then(res => {
            this.snackbarStateChange({
              color: 'success',
              text: this.$t('message.delete_success'),
              snackbar: true
            })
            this.dialog = false
            this.reloadTable()
          })
          .catch(error => {
            this.snackbarStateChange({
              color: 'error',
              text: error.data.message,
              snackbar: true
            })
          })
      },
      async onSubmit() {
        this.isLoading = true
        this.forms['organization.id'] = this.$route.params.organizationId;
        if (this.forms.id === undefined) {
          if (this.imagesToUpload.length === 0 && !this.forms.id) {
            this.isLoading = false
            this.snackbarStateChange({
              color: 'error',
              text: '請上傳封面圖',
              snackbar: true
            })
          } else {
            await this.addSliderShow()
          }
        } else {
          await this.editSliderShow()
          if (this.imagesToUpload.length > 0) {
            await this.editSliderShowCover()
          }
        }
      },
      //添加及添加封面圖
      async addSliderShow() {
        let formData = new FormData()
        for (let i = 0, len = this.imagesToUpload.length; i < len; i++) {
          formData.append(
            this.imagesToUpload[i].key,
            this.imagesToUpload[i].value,
            `${this.imagesToUpload[i].key}.png`
          )
        }
        Object.keys(this.forms).forEach(k => {
          formData.append(k, this.forms[k])
        })
        await this.$http
          .post('manager/slide_shows', formData, {
            headers: {
              'X-TENANT-ID': this.$route.params.organizationId
            }
          })
          .then(res => {
            this.snackbarStateChange({
              color: 'success',
              text: this.$t(`message.store_message`),
              snackbar: true
            })
            this.reloadTable()
            this.forms = {}
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
      },
      //修改信息
      async editSliderShow() {
        await this.$http
          .put('manager/slide_shows', this.$serialize(this.forms), {
            headers: {
              'X-TENANT-ID': this.$route.params.organizationId
            }
          })
          .then(res => {
            this.snackbarStateChange({
              color: 'success',
              text: this.$t(`message.update_message`),
              snackbar: true
            })
            this.reloadTable()
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
      },
      //修改封面圖
      async editSliderShowCover() {
        let formData = new FormData()
        for (let i = 0, len = this.imagesToUpload.length; i < len; i++) {
          formData.append(
            this.imagesToUpload[i].key,
            this.imagesToUpload[i].value,
            `${this.imagesToUpload[i].key}.png`
          )
        }
        formData.append('slideShowId', this.forms.id)
        await this.$http
          .post('manager/slide_shows/update_image', formData, {
            headers: {
              'X-TENANT-ID': this.$route.params.organizationId
            }
          })
          .then(res => {
            this.snackbarStateChange({
              color: 'success',
              text: this.$t(`message.update_message`),
              snackbar: true
            })
            this.reloadTable()
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
      },
      edieDialog(data) {
        this.forms.title = data.title
        this.forms.url = data.url
        this.forms.order = data.order
        this.forms.id = data.id
        this.imgDataUrl = `${this.$fileUrl}/public/uploads/o/company/slideShow/${data.id}/${data.key}`
        this.dialog1 = true
        this.title = 'chamber.btn.edit_course'
      },
      handleInput(value) {
        this.pagination.page = value
        this.$router.push({
          path: `/organization/${this.$route.params.organizationId}/sliderShow`,
          query: {
            page: value
          }
        })
        this.filters.page = value - 1
        this.reloadTable()
      }
    }
  }
</script>
