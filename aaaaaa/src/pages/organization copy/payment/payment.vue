<template>
  <div>
    <v-layout row wrap align-center fill-height class="mx-4 mt-2">
      <v-flex md3 sm6>
        <v-text-field :label="$t('global.search_text')" v-model="filters.search" @keyup.enter="reloadTable()"
                      prepend-icon="search" px3 class="px3"></v-text-field>
      </v-flex>
      <v-flex>
        <v-btn color="primary" class="pull-right"
               :to="{path: `/organization/${$route.params.organizationId}/payments_type`}">
          {{$t('chamber.btn.add_card')}}
        </v-btn>
      </v-flex>
    </v-layout>
    <v-data-table hide-actions :headers="headers" :items="desserts" :no-data-text="$t('message.no_message')"
                  :pagination.sync="pagination" :rows-per-page-items="limit" :total-items="totalDesserts"
                  :loading="loading" class="rtable rtable--flip elevation-1">
      <template slot="items" slot-scope="props">
        <td>{{ props.item.id }}</td>
        <td class="text-xs-left">{{ props.item.name }}</td>
        <td class="text-xs-left">{{ props.item.email}}</td>
        <td class="text-xs-left">{{$t(`global.${props.item.subjectType}`)}}</td>
        <td class="text-xs-left">{{props.item.gateway}}</td>
        <td class="text-xs-left error--text">$HK {{props.item.amount}}</td>
        <td class="text-xs-left">
          <span v-if="props.item.status === 'SUCCESS'" class="success--text">{{$t('global.alreadyPaid')}}</span>
          <span v-if="props.item.status === 'PENDING' && props.item.isActive" class="success--text">{{$t('global.alreadyPaid')}}</span>
          <span v-if="props.item.status === 'PENDING' && !props.item.isActive" class="warning--text">{{$t('global.nPaid')}}</span>
          <span v-if="props.item.status === 'ERROR'" class="error--text">{{$t('global.ERROR')}}</span>
          <v-btn depressed small style="min-width: 0;height: 20px;" color="error" class="caption my-0"
                 v-if="props.item.gateway === '銀行卡轉賬' && !props.item.isActive" @click="edieDialog(props.item.id)">
            {{$t('global.nverify' )}}
          </v-btn>
          <v-btn depressed small style="min-width: 0;height: 20px;" color="error" class="caption my-0"
                 v-if="props.item.gateway === '线下转账' && !props.item.isActive" @click="edieDialog(props.item.id)">
            {{$t('global.nverify' )}}
          </v-btn>
          <v-btn depressed small style="min-width: 0;height: 20px;" color="success" class="caption"
                 v-if="props.item.gateway === '銀行卡轉賬' && props.item.isActive">{{$t('global.alreadyPaid' )}}
          </v-btn>
          <v-btn depressed small style="min-width: 0;height: 20px;" color="success" class="caption"
                 v-if="props.item.gateway === '线下转账' && props.item.isActive">{{$t('global.alreadyPaid' )}}
          </v-btn>
        </td>
        <td class="text-md-center text-xs-left">
          <v-tooltip top>
            <v-btn flat icon color="primary" slot="activator"
                   :to="{path: `/organization/${$route.params.organizationId}/order/apply/${props.item.id}/detail`}">
              <v-icon size="20">visibility</v-icon>
            </v-btn>
            <span>{{$t('chamber.btn.see')}}</span>
          </v-tooltip>

        </td>
      </template>
      <template slot="footer">
        <td :colspan="headers.length +1" class="px-0">
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
      <v-dialog v-model="dialog"  max-width="290">
        <v-card>
          <v-card-title class="headline">{{$t('global.verifyText')}}?</v-card-title>
          <v-card-text>{{$t('global.verifyText')}}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="darken-1" flat @click.native="dialog = false">{{$t('button.cancel')}}</v-btn>
            <v-btn color="primary darken-1" flat @click="verify()">{{$t('button.confirm')}}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </div>
</template>
<script>
  import {mapMutations} from 'vuex'

  export default {
    data() {
      return {
        loading: true,
        dialog: false,
        form: false,
        isLoading: false,
        snackbarText: null,
        snackbar: false,
        itemId: null,
        filters: {
          search: null,
          organizationId: this.$route.params.organizationId,
          page: 0,
          size: 9
        },
        totalDesserts: 0,
        totalPages: 0,
        pagination: {
          sortBy: 'id',
          sortBy: 'amount'
        },
        rules: {
          required: v => !!v || 'This field is required'
        },
        limit: [10],
        headers: [
          {
            text: this.$t('chamber.payment.orderNumber'),
            align: 'left',
            value: 'id'
          },
          {
            text: this.$t('chamber.payment.orderName'),
            align: 'left',
            sortable: false,
            value: 'orderName'
          },
          {
            text: this.$t('chamber.payment.email'),
            align: 'left',
            sortable: false,
            value: 'email'
          },
          {
            text: this.$t('chamber.payment.type'),
            align: 'left',
            sortable: false,
            value: 'type'
          },
          {
            text: this.$t('chamber.payment.method'),
            align: 'left',
            sortable: false,
            value: 'method'
          },
          {
            text: this.$t('chamber.payment.money'),
            align: 'left',
            value: 'amount'
          },
          {
            text: this.$t('chamber.payment.status'),
            align: 'left',
            sortable: false,
            value: 'status'
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
          .get('manager/transactions', {
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
      verify(id) {
        this.$http
          .put(`manager/transactions/${this.itemId}`, {
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
      edieDialog(data) {
        this.itemId = data
        this.dialog = true
      },
      handleInput(value) {
        this.pagination.page = value
        this.$router.push({
          path: `/organization/${this.$route.params.organizationId}/payments`,
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
