<template>
  <div>
    <v-layout row wrap fill-height class="mx-4 mt-2">
      <v-flex xs12>
        <v-text-field style="width: 320px;float: left" :label="$t('global.search_text')" v-model="filters.search"
                      @keyup.enter="reloadTable()"
                      prepend-icon="search" px3 class="px3"></v-text-field>
        <v-btn class="pull-right" style="float: right" color="primary" @click="open">{{$t('chamber.btn.add_know')}}
        </v-btn>
      </v-flex>

    </v-layout>
    <v-data-table hide-actions :headers="headers" :items="desserts" :no-data-text="$t('message.no_message')"
                  :pagination.sync="pagination" :rows-per-page-items="limit" :total-items="totalDesserts"
                  :loading="loading" class="rtable rtable--flip elevation-1">
      <template slot="items" slot-scope="props">
        <!--<td>-->
        <!--<router-link :to="{path: '/company/products-detail',query:{id:props.item.organization.id,ruleId:props.item.id}}"-->
        <!--target="_blank">{{ props.item.title }}-->
        <!--</router-link>-->
        <!--</td>-->
        <td class="text-xs-left">{{ props.item.sku }}</td>
        <td class="text-xs-left">{{ props.item.name }}</td>
        <td class="text-xs-left">$HK {{ props.item.price}}</td>
        <td class="text-xs-left">$HK {{ props.item.compareAtPrice}}</td>
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
                    <v-text-field type="text"
                                  color="purple darken-2" v-model="forms.sku" label="sku"
                                  :rules="[rules.required]" clearable></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field color="purple darken-2" v-model="forms.name" :label="$t('chamber.know.title')"
                                  :rules="[rules.required]" clearable></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-select
                      v-model="forms.productCategoryIds"
                      :items="categories"
                      return-object
                      item-text="name"
                      item-value="id"
                      chips
                      multiple
                      :no-data-text="$t('message.no_message')"
                      :label="$t('chamber.know.categories')"
                    ></v-select>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field
                      :label="$t('chamber.know.price')"
                      :rules="[rules.required]"
                      type="number"
                      :min="0"
                      v-model="forms.price"
                      color="purple darken-2"
                      prefix="$HK"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field
                      :label="$t('chamber.know.compareAtPrice')"
                      :rules="[rules.required]"
                      type="number"
                      v-model="forms.compareAtPrice"
                      :min="0"
                      color="purple darken-2"
                      prefix="$HK"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-layout row wrap>
                      <v-flex xs12>
                        <p class=" text-xs-left mb-2">{{$t('chamber.create.news_cover')}}</p>
                        <v-layout row>
                          <v-flex md2 v-for="(item,i)  in imagesToUpload" :key="i">
                            <div class="fileinput fileinput-new text-center" style="position: relative"
                                 data-provides="fileinput">
                              <v-btn flat icon @click="removeImg(i)" style="position: absolute;    right: -25px;
    top: -30px;" color="pink">
                                <v-icon>close</v-icon>
                              </v-btn>

                              <div class="fileinput-new thumbnail">
                                <img v-if="item.createImgUrl === null"
                                     src="./../../../../static/img/image_placeholder.jpg"
                                     style="width:100%" alt="...">
                                <img v-else :src="item.createImgUrl" style="width:100%" alt="...">
                              </div>
                              <div class="fileinput-preview fileinput-exists thumbnail" style=""></div>
                            </div>
                          </v-flex>
                        </v-layout>
                        <div class="text-xs-center">
                          <v-btn round color="primary" dark @click="show = !show">{{$t('chamber.btn.file_update')}}
                          </v-btn>
                        </div>
                        <my-upload field="file" ref="file" :width="600" :height="400"
                                   @imagesToUpload="cropSuccess"
                                   v-model="show" :multiple="true" img-format="png"></my-upload>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex xs12 class="text-xs-left">
                    <p>簡介</p>
                    <quill-editor ref="myTextEditor" :rules="[rules.required]" v-model="forms.description"
                                  :options="editorOption">
                    </quill-editor>
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
            <v-btn color="darken-1" flat @click.native="dialog1 = false;forms={type: 'STATUTES'}">
              {{$t('button.cancel')}}
            </v-btn>
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
  import {mapMutations} from 'vuex'
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  import {quillEditor} from 'vue-quill-editor'
  import myUpload from './../../../components/image-crop-upload/upload-2'

  export default {
    components: {
      quillEditor,
      'my-upload': myUpload
    },
    data() {
      return {
        countries: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        loading: true,
        dialog: false,
        dialog1: false,
        categories: [],
        imagesToUpload: [],
        imgDataUrl: null,
        form: false,
        isLoading: false,
        snackbarText: null,
        snackbar: false,
        show: false,
        itemId: null,
        title: 'chamber.btn.add_know',
        filters: {
          search: null,
          'organization.id': this.$route.params.organizationId,
          page: 0,
          size: 9
        },
        editorOption: {
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],
              [{list: 'ordered'}, {list: 'bullet'}],
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
        forms: {
          content: null,
          description: null,
          compareAtPrice: null,
          sku: null,
          onSale: true,
          productCategoryIds: null,
          price: null,
          name: null
        },
        totalDesserts: 0,
        totalPages: 0,
        pagination: {
          sortBy: 'createdAt'
        },
        rules: {
          required: v => !!v || this.$t('validation.required')
        },
        limit: [10],
        headers: [
          {
            text: 'sku',
            align: 'left',
            sortable: false,
          }, {
            text: this.$t('chamber.know.title'),
            align: 'left',
            sortable: false,
            value: 'title'
          },

          {text: this.$t('chamber.know.price'), value: 'createdAt'},
          {text: this.$t('chamber.know.compareAtPrice'), value: 'compareAtPrice'},
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
    mounted() {
      this.filters.page =
        this.$route.query.page !== undefined
          ? Number(this.$route.query.page) - 1
          : 0
      this.reloadTable()
      this.reloadCategories()
    },
    methods: {
      ...mapMutations(['snackbarStateChange']),
      async reloadTable() {
        this.loading = true
        if (this.filters.search === null) {
          delete this.filters.search
        }
        await this.$http
          .get(`manager/products`, {
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
      reloadCategories() {
        this.$http.get('public/productCategory/category').then(res => {
          this.categories = res.data.content
        })
      },
      open() {
        this.dialog1 = true;
        this.title = 'chamber.btn.add_know';
        this.imagesToUpload = [];
      },
      change(id) {
        this.dialog = true
        this.itemId = id
      },
      deletes() {
        this.$http
          .delete(`manager/products/${this.itemId}`, {
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
      deletesImage(productImageId) {
        this.$http
          .delete(`manager/products/${productImageId}/destroy/upload_product_image`, {
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
      removeImg(i) {
        if (this.imagesToUpload[i].id) {
          this.deletesImage(this.imagesToUpload[i].id)
        }
        this.imagesToUpload.splice(i, 1)
      },
      async onSubmit() {
        this.isLoading = true
        let message
        let methoed;
        let url;
        this.forms.productCategoryIds = this.forms.productCategoryIds.map(o => {
          return o.id
        });
        if (this.forms.id === undefined) {
          message = 'store_message'
          methoed = 'post'
          url = 'manager/products'
        } else {
          delete this.forms.organization
          delete this.forms.createdAt
          delete this.forms.categories
          // delete this.forms.productImage
          message = 'update_message'
          methoed = 'put'
          url = `manager/products/${this.forms.id}`
        }

        let formData = new FormData();
        if (this.imagesToUpload.length > 0) {
          for (let i = 0, len = this.imagesToUpload.length; i < len; i++) {
            if (this.imagesToUpload[i].value !== undefined) {
              formData.append(
                this.imagesToUpload[i].key,
                this.imagesToUpload[i].value,
                `${this.imagesToUpload[i].key}.png`
              );
            }
          }
        }
        Object.keys(this.forms).forEach(key => {
          formData.append(
            key,
            this.forms[key]
          );
        });
        await this.$http.post(url, formData, {
          headers: {
            'X-TENANT-ID': this.$route.params.organizationId,
          }
        }).then(async res => {
          this.snackbarStateChange({
            color: 'success',
            text: this.$t(`message.${message}`),
            snackbar: true
          });
          this.imagesToUpload = [];
          this.$store.commit('clearImagesToUpload')
          this.$store.commit('clearFilesToUpload')
          await this.reloadTable()
          this.dialog1 = false;
          this.isLoading = false;
          this.forms = {
            type: 'STATUTES'
          }
        })
          .catch(error => {
            this.isLoading = false
            this.snackbarStateChange({
              color: 'error',
              text: error,
              snackbar: true
            })
          })
      },
      cropSuccess(data) {
        this.imagesToUpload.push(data)
      },
      edieDialog(data) {
        this.imagesToUpload = [];
        this.forms = data
        this.forms.productCategoryIds = data.categories
        if (data.productImage.length > 0) {
          data.productImage.forEach((val) => {
            this.imagesToUpload.push({createImgUrl: `${this.$fileUrl}/public/uploads/o/${val.path}`, id: val.id})
          })
        }
        this.dialog1 = true
        this.title = 'chamber.btn.edit_know'
      },
      handleInput(value) {
        this.pagination.page = value
        this.$router.push({
          path: `/organization/${this.$route.params.organizationId}/rules`,
          query: {
            page: value
          }
        });
        this.filters.page = value - 1
        this.reloadTable()
      }
    }
  }
</script>
