<template>
  <div>
    <v-layout row wrap align-center fill-height class="mx-4 mt-2">
      <v-flex md3 sm6>
        <v-text-field :label="$t('global.search_text')" v-model="filters.search" @keyup.enter="reloadTable()"
                      prepend-icon="search" px3 class="px3"></v-text-field>
      </v-flex>
      <v-flex md1 sm2 offset-sm4 offset-md8>
        <v-btn color="primary" @click="openDialog()">{{$t('chamber.btn.add_article')}}</v-btn>
      </v-flex>
    </v-layout>
    <v-data-table hide-actions :headers="headers" :items="desserts" :no-data-text="$t('message.no_message')"
                  :pagination.sync="pagination" :rows-per-page-items="limit" :total-items="totalDesserts"
                  :loading="loading" class="rtable rtable--flip elevation-1">
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">
          <v-img class="hidden-xs-only" v-if="props.item.postImages.length > 0"
                 :src="`${$fileUrl}/public/uploads/o/company/post/${props.item.id}/${props.item.postImages[0].key}`"
                 lazy-src="https://picsum.photos/510/300?random"
                 aspect-ratio="1.7"></v-img>
          <img class="hidden-sm-and-up" v-if="props.item.postImages.length > 0"
               :src="`${$fileUrl}${props.item.postImages[0].key}`" style="padding:5px" width="80">
        </td>
        <td class="text-no-wrap  text-truncate lgwd20">
          <router-link :to="{path: '/company/new-detail',query:{id:props.item.organization.id,newId:props.item.id}}"
                       target="_blank">{{ props.item.title }}
          </router-link>
        </td>
        <td class="text-xs-left">{{ props.item.organization.name}}</td>
        <td class="text-xs-left">{{ props.item.createdAt | time }}</td>
        <td class="text-xs-left">{{ props.item.lastModifiedAt | time }}</td>
        <td class="text-sm-center text-xs-left">
          <v-menu v-model="props.item.isFeatured" :close-on-content-click="false" :nudge-width="200" offset-y>
            <v-btn flat icon color="purple darken-2" @click="props.item.isFeatured = !props.item.isFeatured"
                   slot="activator">
              <v-icon size="18">shared</v-icon>
            </v-btn>
            <v-card>
              <v-divider></v-divider>
              <social-sharing
                :url="`${$fileUrl}/company/new-detail?id=${props.item.organization.id}&newId=${props.item.id}`"
                :title="props.item.title"
                :description="props.item.content"
                quote="Vue is a progressive framework for building user interfaces."
                hashtags="connected"
                twitter-user="connected" inline-template>
                <div class="py-4 px-4">
                  <network network="facebook">
                    Facebook
                  </network>
                  <br>
                  <network network="googleplus">
                    Google +
                  </network>
                  <br>
                  <network network="linkedin">
                    LinkedIn
                  </network>
                  <br>
                  <network network="pinterest">
                    Pinterest
                  </network>
                  <br>
                  <network network="reddit">
                    Reddit
                  </network>
                  <br>
                  <network network="twitter">
                    Twitter
                  </network>
                  <br>
                  <network network="vk">
                    VKontakte
                  </network>
                  <br>
                  <network network="weibo">
                    Weibo
                  </network>
                  <br>
                  <network network="whatsapp">
                    Whatsapp
                  </network>
                </div>
              </social-sharing>
              <v-divider></v-divider>

            </v-card>
          </v-menu>

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
      <v-dialog v-model="dialog" persistent max-width="290">
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
                                  :rules="[rules.required]" clearable></v-text-field>
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
                          <my-upload field="coverImage" ref="file" :width="578" :height="200"
                                     @crop-success="cropSuccess" v-model="show" img-format="png"></my-upload>
                        </div>
                      </v-flex>
                      <v-flex md4 class="ml-4">
                        <p class="mt-4  text-xs-left ">{{$t('chamber.prompt.title')}}</p>
                        <p class=" text-xs-left ">{{$t('chamber.prompt.update_file_size_text')}}</p>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex xs12 class="text-xs-left">
                    <p>{{$t('chamber.know.content')}}</p>
                    <quill-editor ref="myTextEditor" :rules="[rules.required]" v-model="forms.content"
                                  :options="editorOption">
                    </quill-editor>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="darken-1" flat @click.native="dialog1 = false;forms={}">{{$t('button.cancel')}}</v-btn>
            <v-btn color="primary darken-1" :disabled="!form || !forms.content" :loading="isLoading" flat
                   @click.native="onSubmit()">{{$t('button.save')}}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>

  </div>
</template>
<script>
  import {error} from 'util'
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
        imgDataUrl: null,
        loading: true,
        show: false,
        dialog: false,
        dialog1: false,
        form: false,
        isLoading: false,
        menu: false,
        snackbarText: null,
        snackbar: false,
        itemId: null,
        title: 'chamber.btn.add_article',
        editorOption: {
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
              [{header: 1}, {header: 2}],
              [{list: 'ordered'}, {list: 'bullet'}],
              [{direction: 'rtl'}],
              [{header: [1, 2, 3, 4, 5, 6, false]}],
              [{color: []}, {background: []}],
              ['link', 'image']
            ],
            syntax: {
              highlight: text => hljs.highlightAuto(text).value
            }
          },
          placeholder: this.$t('chamber.know.content')
        },
        filters: {
          search: null,
          'organization.id': this.$route.params.organizationId,
          page: 0,
          size: 9
        },
        forms: {
          content: null,
          title: null
        },
        totalDesserts: 0,
        totalPages: 0,
        pagination: {
          sortBy: 'createdAt',
          sortBy: 'lastModifiedAt'
        },
        rules: {
          required: v => !!v || this.$t('validation.required')
        },
        limit: [9],
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
            text: this.$t('chamber.know.coc'),
            value: 'coc',
            sortable: false
          },
          {
            text: this.$t('cocShow.news.release_time'),
            value: 'createdAt'
          },
          {
            text: this.$t('chamber.know.update_time'),
            value: 'lastModifiedAt'
          },
          {
            text: this.$t('chamber.know.operation'),
            value: 'operation',
            sortable: false
          }
        ],
        desserts: []
      }
    },
    computed: {
      ...mapState(['imagesToUpload'])
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
    mounted() {
      this.filters.page =
        this.$route.query.page !== undefined
          ? Number(this.$route.query.page) - 1
          : 0
      this.reloadTable()
    },
    methods: {
      ...mapMutations(['snackbarStateChange']),
      async reloadTable() {
        this.loading = true
        if (this.filters.search === null) {
          delete this.filters.search
        }
        await this.$http
          .get(`manager/posts`, {
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
          .delete(`manager/posts/${this.itemId}`, {
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
      onSubmit() {
        if (this.imagesToUpload.length === 0 && !this.forms.id) {
          this.snackbarStateChange({
            color: 'error',
            text: '請上傳封面圖',
            snackbar: true
          })
        } else {
          this.isLoading = true
          let message =
            this.forms.id === undefined
              ? 'store_message'
              : 'update_message'
          let formData = new FormData()
            formData.append(
              this.imagesToUpload[this.imagesToUpload.length-1].key,
              this.imagesToUpload[this.imagesToUpload.length-1].value,
              `${this.imagesToUpload[this.imagesToUpload.length-1].key}.png`
            )
          if (this.forms.id !== undefined) {
            formData.append(`post.id`, this.forms.id)
          }
          formData.append(
            `post.organization.id`,
            this.$route.params.organizationId
          )
          formData.append(`post.title`, this.forms.title)
          formData.append(`post.content`, this.forms.content)
          formData.append(`maxSize`, 3)
          formData.append(`isCover`, true)
          this.$http
            .post('manager/posts/save', formData, {
              headers: {
                'X-TENANT-ID': this.$route.params.organizationId
              }
            })
            .then(res => {
              this.snackbarStateChange({
                color: 'success',
                text: this.$t(`message.${message}`),
                snackbar: true
              })
              this.reloadTable()
              this.$store.commit('clearImagesToUpload')
              this.$store.commit('clearFilesToUpload')
              this.isLoading = false
              this.dialog1 = false
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
      },

      openDialog() {
        this.dialog1 = true
        this.title = 'chamber.btn.add_article'
        this.imgDataUrl = null
        this.forms = {}
      },
      edieDialog(data) {
        this.forms.title = data.title
        this.forms.id = data.id
        this.forms.content = data.content
        this.imgDataUrl = `${this.$fileUrl}/public/uploads/o/company/post/${data.id}/${data.postImages[0].key}`
        this.dialog1 = true
        this.title = 'chamber.btn.edit_article'
      },
      handleInput(value) {
        this.pagination.page = value
        this.$router.push({
          path: `/organization/${this.$route.params.organizationId}/post_list`,
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
<style lang="scss">

  .fileinput .thumbnail {
    margin-bottom: 10px;
    overflow: hidden;
    text-align: center;
    vertical-align: middle;
    max-width: 250px;
    box-shadow: 0 10px 30px -12px rgba(0, 0, 0, 0.42),
    0 4px 25px 0 rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2);
    background:#e8e7e8
  }
</style>

