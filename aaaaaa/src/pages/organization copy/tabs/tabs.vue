<template>
  <div>
    <v-layout row wrap align-center fill-height class="mx-4 mt-2">
      <v-flex md3 sm6>
        <v-text-field :label="$t('global.search_text')" v-model="filters.search" @keyup.enter="reloadTable()"
                      prepend-icon="search" px3 class="px3"></v-text-field>
      </v-flex>
      <v-flex md1 sm2 offset-sm4 offset-md8>
        <v-btn color="primary" @click="dialog1 = true;forms={}" v-if="desserts.length <=1">
          {{$t('chamber.tab.add_tab')}}
        </v-btn>
      </v-flex>
    </v-layout>
    <v-data-table hide-actions :headers="headers" :items="desserts" :no-data-text="$t('message.no_message')"
                  :pagination.sync="pagination" :rows-per-page-items="limit" :total-items="totalDesserts"
                  :loading="loading" class="rtable rtable--flip elevation-1">
      <template slot="items" slot-scope="props">
        <td>{{ props.item.title }}</td>
        <td class="text-xs-left">{{ props.item.createdAt | time}}</td>
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
                    <v-text-field color="purple darken-2" v-model="forms.title " counter="6"
                                  :label="$t('chamber.know.title')"
                                  clearable></v-text-field>
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
  import {mapMutations} from 'vuex'
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  import {quillEditor} from 'vue-quill-editor'

  export default {
    components: {
      quillEditor
    },
    data() {
      return {
        loading: true,
        dialog: false,
        dialog1: false,
        form: true,
        isLoading: false,
        snackbarText: null,
        snackbar: false,
        itemId: null,
        title: 'chamber.tab.add_tab',
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
        totalDesserts: 0,
        pagination: {
          sortBy: 'createdAt'
        },
        rules: {
          required: v => !!v || this.$t('validation.required'),
          // max: v =>  v.length <= 6 || `${this.$t('validation.max')}6`
        },
        limit: [10],
        headers: [
          {
            text: this.$t('chamber.know.title'),
            align: 'left',
            sortable: false,
            value: 'title'
          },
          {text: this.$t('chamber.know.time'), value: 'createdAt'},
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
          if (this.filters.page !== this.pagination.page - 1) {
            this.filters.page = this.pagination.page - 1
            this.reloadTable()
          } else {
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
          }
        },
        deep: true
      }
    },
    mounted() {
      this.reloadTable()
    },
    methods: {
      ...mapMutations(['snackbarStateChange']),
      reloadTable() {
        this.loading = true
        if (this.filters.search === null) {
          delete this.filters.search
        }
        this.$http
          .get('manager/tabs', {
            params: this.filters,
            headers: {
              'X-TENANT-ID': this.$route.params.organizationId
            }
          })
          .then(res => {
            this.desserts = res.data.content
            this.totalDesserts = res.data.totalElements
            this.loading = false
          })
      },
      change(id) {
        this.dialog = true
        this.itemId = id
      },
      deletes() {
        this.$http
          .delete(`manager/tabs/${this.itemId}`, {
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
        this.isLoading = true
        this.forms['organization.id'] = this.$route.params.organizationId
        let message
        if (this.forms.id === undefined) {
          message = 'store_message'
        } else {
          delete this.forms.organization
          delete this.forms.createdAt
          delete this.forms.lastModifiedAt
          message = 'update_message'
        }

        this.$http
          .post('manager/tabs', this.$serialize(this.forms), {
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
        this.forms = data
        this.dialog1 = true
        this.title = 'chamber.tab.edit_tab'
      }
    }
  }
</script>
