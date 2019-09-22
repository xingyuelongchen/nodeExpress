<template>
  <div>
    <v-layout row wrap align-center fill-height class="mx-4 mt-2">
      <v-flex md3 sm6>
        <v-text-field :label="$t('global.search_text')" v-model="filters.search" @keyup.enter="reloadTable()"
                      prepend-icon="search" px3 class="px3"></v-text-field>
      </v-flex>
      <v-flex md1 sm2 offset-sm4 offset-md8>
        <v-btn color="primary" @click="dialog1 = true; title= 'chamber.btn.add_position'">
          {{$t('chamber.btn.add_position')}}
        </v-btn>
      </v-flex>
    </v-layout>
    <v-data-table hide-actions :headers="headers" :items="desserts" :no-data-text="$t('message.no_message')"
                  :pagination.sync="pagination" :rows-per-page-items="limit" :total-items="totalDesserts"
                  :loading="loading" class="rtable rtable--flip elevation-1">
      <template slot="items" slot-scope="props">
        <td>{{ props.item.title }}</td>
        <td class="text-xs-left">{{ props.item.description }}</td>
        <td class="text-xs-left">{{ props.item.createdAt | time }}</td>
        <td class="text-md-center text-xs-left">
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
      <v-dialog v-model="dialog1"  max-width="500px">
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
                    <v-textarea counter="3000" color="purple darken-2" :label="$t('chamber.know.content')"
                                :rules="[rules.required]" v-model="forms.description"></v-textarea>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="darken-1" flat @click.native="dialog1 = false,forms={}">{{$t('button.cancel')}}</v-btn>
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
  import {mapMutations} from 'vuex'
  import {error} from 'util'

  export default {
    data() {
      return {
        countries: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        loading: true,
        dialog: false,
        dialog1: false,
        form: false,
        isLoading: false,
        snackbarText: null,
        snackbar: false,
        itemId: null,
        title: 'chamber.btn.add_position',
        filters: {
          search: null,
          'organization.id': this.$route.params.organizationId,
          isDefault: false,
          page: 0,
          size: 9
        },
        forms: {
          isDefault: false,
          description: null,
          title: null
        },
        totalDesserts: 0,
        totalPages: 0,
        pagination: {
          sortBy: 'createdAt'
        },
        rules: {
          required: v => !!v || this.$t('validation.required')
        },
        limit: [9],
        headers: [
          {
            text: this.$t('chamber.position.title'),
            align: 'left',
            sortable: false,
            value: 'title'
          },
          {
            text: this.$t('chamber.position.description'),
            value: 'description',
            sortable: false
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
      reloadTable() {
        this.loading = true
        if (this.filters.search === null) {
          delete this.filters.search
        }
        this.$http
          .get('manager/member_positions', {
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
      change(id) {
        this.dialog = true
        this.itemId = id
      },
      deletes() {
        this.$http
          .delete(`manager/member_positions/${this.itemId}`, {
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
          delete this.forms.lastModifiedAt
          delete this.forms.createdAt
          delete this.forms.remark
          message = 'update_message'
        }
        this.$http
          .post('manager/member_positions', this.$serialize(this.forms), {
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
            this.forms = {}
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
      edieDialog(data) {
        this.forms = data
        this.dialog1 = true
        this.title = 'chamber.btn.edit_position'
      },
      handleInput(value) {
        this.pagination.page = value
        this.$router.push({
          path: `/organization/${this.$route.params.organizationId}/positions`,
          query: {
            page: value
          }
        })
        this.filters.page = value - 1
        this.reloadTable()
      },
    }
  }
</script>
