<template>
  <div>
    <v-layout row wrap align-center fill-height class="mx-4 mt-2">
      <v-flex md3 sm6>
        <v-text-field :label="$t('global.search_text')" v-model="filters.search" @keyup.enter="reloadTable()"
                      prepend-icon="search" px3 class="px3"></v-text-field>
      </v-flex>
      <v-flex>
        <v-menu offset-y class="pull-right">
          <v-btn slot="activator" color="primary" dark>
            {{$t('global.addMembership' )}}
            <v-icon>arrow_drop_down</v-icon>
          </v-btn>
          <v-list>
            <v-list-tile @click="openDialog(false)">
              <v-list-tile-title>{{$t('chamber.btn.add_options')}}</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="openDialog(true)">
              <v-list-tile-title>{{$t('chamber.btn.add_forever')}}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-flex>
    </v-layout>
    <v-data-table hide-actions :headers="headers" :items="desserts" :no-data-text="$t('message.no_message')"
                  :pagination.sync="pagination" :rows-per-page-items="limit" :total-items="totalDesserts"
                  :loading="loading" class="rtable rtable--flip elevation-1">
      <template slot="items" slot-scope="props">
        <td>{{ props.item.name }}</td>
        <td class="text-xs-left">
          <span class="ml-1" v-if="!props.item.isForever && props.item.period !== 0">{{props.item.period}}</span>
          <span class="ml-1" v-else>{{$t('global.forever')}}</span>
        </td>
        <td class="text-xs-left">{{ props.item.amount }}</td>
        <td class="text-xs-left">{{ props.item.position }}</td>
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
      <v-dialog v-model="dialog1"  max-width="500px">
        <v-card>
          <v-card-title>
            <span class="title">{{$t('chamber.btn.add_framework')}}</span>
            <span class="body-1 mt-2">{{$t('chamber.prompt.add_framework_text')}}</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-form ref="form" v-model="form">
                <v-layout row wrap>
                  <v-flex xs12>
                    <v-text-field color="purple darken-2" v-model="forms.name"
                                  :label="$t('chamber.member.framework_name')" :rules="[rules.required]"
                                  clearable></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-autocomplete v-if="!forms.isForever" :no-data-text="$t('message.no_message')"
                                    :rules="[rules.required]" :items="countries" v-model="forms.period"
                                    :label="`${$t('global.term')}/${$t('global.month')}`" required></v-autocomplete>
                    <v-text-field v-else color="purple darken-2" :disabled="forms.isForever"
                                  :label="$t('global.forever')"></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field color="purple darken-2" type="number" min="1" v-model="forms.amount"
                                  :label="$t('global.dues')" :rules="[rules.required]" clearable></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field color="purple darken-2" type="number" min="1" v-model="forms.position"
                                  :label="$t('chamber.member.sort')" :rules="[rules.required]" clearable></v-text-field>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="darken-1" flat @click.native="dialog1 = false;forms={}">{{$t('button.cancel')}}</v-btn>
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
        filters: {
          search: null,
          'organization.id': this.$route.params.organizationId,
          isDefault: false,
          page: 0,
          size: 9
        },
        forms: {
          name: null,
          amount: null,
          position: null,
          period: null,
          isForever: false,
          isDefault: false
        },
        totalDesserts: 0,
        totalPages: 0,
        pagination: {
          sortBy: 'amount',
          sortBy: 'position',
          sortBy: 'period'
        },
        rules: {
          required: v => !!v || this.$t('validation.required')
        },
        limit: [10],
        headers: [
          {
            text: this.$t('chamber.member.framework_name'),
            align: 'left',
            sortable: false,
            value: 'name'
          },
          {
            text: `${this.$t('global.term')}/${this.$t(
              'global.month'
            )}`,
            value: 'period'
          },
          {text: this.$t('global.dues'), value: 'amount'},
          {text: this.$t('chamber.member.sort'), value: 'position'},
          {
            text: this.$t('chamber.member.operation'),
            value: 'position',
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
          .get('manager/memberships', {
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
          .delete(`manager/memberships/${this.itemId}`, {
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
        let message =
          this.forms.id === undefined ? 'store_message' : 'update_message'
        let method =
          this.forms.id === undefined ? 'post' : 'put'
        this.$http
          [method]('manager/memberships', this.$serialize(this.forms), {
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
              text: error.data.message,
              snackbar: true
            })
          })
      },
      openDialog(isForever) {
        this.forms.isForever = isForever
        this.dialog1 = true
        this.forms.period = isForever ? 0 : 1
      },
      edieDialog(data) {
        delete data.membership
        delete data.createdAt
        delete data.lastModifiedAt
        this.forms = data
        this.dialog1 = true
      },
      handleInput(value) {
        this.pagination.page = value
        this.$router.push({
          path: `/organization/${this.$route.params.organizationId}/memberships`,
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
