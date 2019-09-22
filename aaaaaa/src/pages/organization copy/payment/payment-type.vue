<template>
  <div>
    <v-layout row wrap class="mx-4 mt-2">
      <v-flex md3 sm6>
        <v-text-field :label="$t('global.search_text')" v-model="filters.search" @keyup.enter="reloadTable()"
                      prepend-icon="search" px3 class="px3"></v-text-field>
      </v-flex>
    </v-layout>
    <v-data-table :headers="headers" :items="desserts" :no-data-text="$t('message.no_message')"
                  :pagination.sync="pagination" :rows-per-page-items="limit" :total-items="totalDesserts"
                  :loading="loading" class="rtable rtable--flip elevation-1">
      <template slot="items" slot-scope="props">
        <td>
          <span v-if="props.item.payType === 'ONLINE'">Stripe</span>
          <span v-else>{{$t('global.transfer')}}</span>
        </td>
        <td>
          <span v-if="props.item.payType === 'ONLINE'">{{$t('global.payDes1')}}</span>
          <span v-else>{{$t('global.payDes2')}}</span>
        </td>
        <td class="text-xs-left">
          <v-switch v-model="props.item.isActive" @change="setActive(props.item,props.item.isActive)"
                    color="primary"></v-switch>
        </td>
        <td class="text-xs-left">{{ props.item.createdAt | time}}</td>
        <td class="text-md-center text-xs-left">
          <v-btn flat small @click="edieDialog(props.item)">
            <span v-if="props.item.publishableKey === null && props.item.payType === 'ONLINE'" class="error--text">{{$t('global.nbinding' )}}</span>
            <span v-if="props.item.publishableKey !== null && props.item.payType === 'ONLINE'" class="success--text">{{$t('global.binding' )}}</span>
            <span v-if="props.item.cardNumber === null && props.item.payType !== 'ONLINE'" class="error--text">{{$t('global.nbinding' )}}</span>
            <span v-if="props.item.cardNumber !== null && props.item.payType !== 'ONLINE'" class="success--text">{{$t('global.binding' )}}</span>
          </v-btn>
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
                <v-layout row wrap v-if="forms.payType  === 'ONLINE'">
                  <v-flex xs12>
                    <v-text-field color="purple darken-2" v-model="forms.publishableKey" label="publishableKey"
                                  :rules="[rules.required]" clearable></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field color="purple darken-2" v-model="forms.pecretKey" label="pecretKey"
                                  :rules="[rules.required]" clearable></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row wrap v-else>
                  <v-flex xs12>
                    <v-text-field color="purple darken-2" v-model="forms.cardNumber"
                                  :label="$t('chamber.payment.number')" :rules="[rules.required]"
                                  clearable></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field color="purple darken-2" v-model="forms.bankName" :label="$t('chamber.payment.name')"
                                  :rules="[rules.required]" clearable></v-text-field>
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
  </div>
</template>
<script>
  import {mapMutations} from 'vuex'

  export default {
    data() {
      return {
        loading: true,
        dialog: false,
        dialog1: false,
        form: false,
        isLoading: false,
        snackbarText: null,
        snackbar: false,
        itemId: null,
        title: 'chamber.btn.add_card',
        filters: {
          search: null,
          'organization.id': this.$route.params.organizationId,
          page: 0,
          size: 9
        },
        forms: {
          cardNumber: null,
          bankName: null,
          publishableKey: null,
          pecretKey: null,
          isActive: false
        },
        totalDesserts: 0,
        pagination: {
          sortBy: 'createdAt',
          sortBy: 'isActive'
        },
        rules: {
          required: v => !!v || this.$t('validation.required'),
        },
        limit: [10],
        headers: [
          {
            text: this.$t('chamber.payment.method'),
            align: 'left',
            sortable: false,
            value: 'method'
          },
          {
            text: this.$t('user.user_education.job_description'),
            value: 'description',
            sortable: false
          },
          {
            text: this.$t('global.isActive'),
            value: 'isActive'
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
          .get('manager/payment_managements', {
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

          if (this.forms.payType === 'ONLINE') {
            delete this.forms.cardNumber
            delete this.forms.accountHolder
            delete this.forms.bankName
            delete this.forms.depositBank
          } else {
            delete this.forms.pecretKey
            delete this.forms.publishableKey
            delete this.forms.accountHolder
            delete this.forms.depositBank
          }
        }
        this.$http
          .put('manager/payment_managements', this.$serialize(this.forms), {
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
        this.title = 'chamber.btn.edit_card'
      },
      setActive(data, isActive) {
        if (data.payType === 'ONLINE' && data.publishableKey === null) {
          this.snackbarStateChange({
            color: 'error',
            text: '請綁定轉賬信息',
            snackbar: true
          })
          return
        } else if (data.payType !== 'ONLINE' && data.cardNumber === null) {
          this.snackbarStateChange({
            color: 'error',
            text: '請綁定銀行卡信息',
            snackbar: true
          })
          return
        } else {
          this.$http
            .put(
              'manager/payment_managements/set_active',
              this.$serialize({
                organizationId: this.$route.params.organizationId,
                paymentManagementId: data.id,
                flag: isActive
              }),
              {
                headers: {
                  'X-TENANT-ID': this.$route.params.organizationId
                }
              }
            )
            .then(res => {
              this.snackbarStateChange({
                color: 'success',
                text: this.$t(`message.update_message`),
                snackbar: true
              })
              this.isLoading = false
            })
            .catch(err => {
              this.isLoading = false
              this.snackbarStateChange({
                color: 'error',
                text: error.data.message,
                snackbar: true
              })
            })
        }
      }
    }
  }
</script>
