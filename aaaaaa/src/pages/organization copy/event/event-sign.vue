<template>
  <div id="sign">

    <!-- 過濾 -->
    <v-layout row wrap class="mx-4 mt-4">
      <v-flex md1 class="mr-3">
        <v-select @change="change(select)" v-model="select" :items="items" item-text="abbr" item-value="id"
                  label="Select" persistent-hint return-object single-line></v-select>
      </v-flex>
      <v-flex md1 class="mr-3">
        <v-select @change="change(select1)" v-model="select1" :items="items1" item-text="abbr" item-value="id"
                  label="Select" persistent-hint return-object single-line></v-select>
      </v-flex>

      <v-flex md3 sm4>
        <v-text-field :label="$t('global.search_text')" v-model="filters.search" @keyup.enter="reloadTable()"
                      prepend-icon="search" px3 class="px3"></v-text-field>
      </v-flex>
      <v-flex xs12 sm4 md3>
        <v-text-field :label="$t('global.hasArrivedCode')" v-model="checkTicket.referenceNumber"
                      @keyup.enter="checkTickets()" prepend-icon="search" px3 class="px3"></v-text-field>
      </v-flex>

    </v-layout>

    <v-layout row wrap>
      <v-flex xs12 class="mx-3">
        <v-btn color="success" :loading="isLoading" @click="checkup('SUCCESS')">{{$t('chamber.btn.adopt')}}</v-btn>
        <v-btn color="error" :loading="isLoading" @click="checkup('REFUSE')">{{$t('chamber.btn.refuse')}}</v-btn>
        <v-btn color="primary" @click="exportSign()">{{$t('chamber.btn.export')}}</v-btn>
      </v-flex>
    </v-layout>

    <!-- 列表 -->
    <v-data-table hide-actions v-model="selected" :headers="headers" :no-data-text="$t('message.no_message')"
                  :items="desserts" :loading="loading" :pagination.sync="pagination" :rows-per-page-items="limit"
                  :total-items="totalDesserts" select-all class="rtable rtable--flip elevation-1">
      <template slot="headers" slot-scope="props">
        <tr>
          <th>
            <v-checkbox color="primary" :input-value="props.all" :label="$t('chamber.member.name')"
                        :indeterminate="props.indeterminate" primary hide-details
                        @click.native="toggleAll"></v-checkbox>
          </th>
          <th class="text-xs-left" v-for="header in props.headers" :key="header.text"
              :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
              @click="changeSort(header.value)">
            {{ $t(header.text) }}
            <v-icon small>arrow_upward</v-icon>
          </th>
        </tr>
      </template>
      <template slot="items" slot-scope="props">
        <tr :active="props.selected">
          <td style="position: relative">
            <v-checkbox color="primary" :input-value="props.selected" :disabled="props.item.statusType !== 'PENDING'"
                        @click="props.selected = !props.selected" :label="props.item.order.contact" primary
                        hide-details></v-checkbox>
          </td>
          <td class="text-xs-left">
            {{props.item.order.phone}}
          </td>
          <td class="text-xs-left">{{ props.item.order.email }}</td>
          <td class="text-xs-left">
            <span v-if="props.item.statusType === 'PENDING'" class="warning--text">{{$t('chamber.btn.audited') }}</span>
            <span v-if="props.item.statusType === 'SUCCESS'" class="success--text">{{$t('global.SUCCESS') }}</span>
            <span v-if="props.item.statusType === 'REFUSE'" class="error--text">{{$t('chamber.btn.refuse') }}</span>
          </td>
          <td class="text-xs-left">
            <span class="pt-4" v-if="props.item.eventTicket.price === 0"> {{$t('global.freeTicket')}}</span>
            <span class="pt-4" v-else> {{$t('global.chargeTicket')}}</span>
            <p class="error--text">$HK {{props.item.eventTicket.price}}</p>
          </td>
          <td class="text-xs-left">
            {{props.item.referenceNumber}}
          </td>
          <td class="text-xs-left">
            <span v-if="props.item.hasArrived" class="success--text"> {{ $t('global.hasArrived')}}</span>
            <span v-else class="error--text"> {{ $t('global.nhasArrived')}}</span>
          </td>
          <td class="text-xs-left">
            {{props.item.order.createdAt | time}}
          </td>
          <td class="text-md-center text-xs-left">
            <v-tooltip top>
              <v-btn flat icon color="error" slot="activator" @click="deleteAttendeess()">
                <v-icon size="18">close</v-icon>
              </v-btn>
              <span>{{$t('button.delete')}}</span>
            </v-tooltip>
          </td>
        </tr>
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

  </div>
</template>
<style lang="scss">
  .filter {
    padding: 20px 20px 0 20px;
  }

  .v-label {
    font-size: 13px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.87);
  }

  .tab {
    position: absolute;
    top: 15px;
    right: 0;
  }

  .primarys {
    background-color: #2c7a90 !important;
    border-color: #2c7a90 !important;
    color: #fff !important;
    position: relative !important;
  }

  .position {
    position: absolute !important;
    top: -9px !important;
    left: -9px;
  }
</style>

<script>
  import {mapMutations} from 'vuex'

  export default {
    data() {
      return {
        pagination: {
          sortBy: 'createdAt'
        },
        items: [
          {id: ' ', abbr: this.$t('cocShow.home.whole')},
          {
            id: '1',
            abbr: this.$t('global.chargeTicket'),
            statusType: 'expenses'
          },
          {
            id: '0',
            abbr: this.$t('global.freeTicket'),
            statusType: 'eventTicketPrice'
          }
        ],
        select: {id: ' ', abbr: this.$t('cocShow.home.whole')},
        items1: [
          {id: ' ', abbr: this.$t('cocShow.home.whole')},
          {
            id: 'SUCCESS',
            abbr: this.$t('global.SUCCESS'),
            statusType: 'statusType'
          },
          {
            id: 'PENDING',
            abbr: this.$t('global.PENDING'),
            statusType: 'statusType'
          },
          {
            id: 'REFUSE',
            abbr: this.$t('global.REFUSE'),
            statusType: 'statusType'
          }
        ],
        select1: {id: ' ', abbr: this.$t('cocShow.home.whole')},

        selectPosition: {},
        all: false,
        isLoading: false,
        loading: false,
        limit: [10],
        totalDesserts: 0,
        totalPages: 0,
        selected: [],
        checkTicket: {
          referenceNumber: null
        },
        filters: {
          search: null,
          memberGroups: null,
          'organization.id': this.$route.params.organizationId,
          'event.id': this.$route.params.signId,
          page: 0,
          size: 9
        },
        headers: [
          {
            text: 'chamber.member.phone',
            value: 'phone',
            sortable: false
          },
          {
            text: 'chamber.member.email',
            value: 'email',
            sortable: false
          },
          {
            text: 'chamber.member.status',
            value: 'status',
            sortable: false
          },
          {
            text: 'global.ticket',
            value: 'ticket',
            sortable: false
          },
          {
            text: 'global.code',
            value: 'ticket'
          },
          {
            text: 'global.ticketState',
            value: 'group',
            sortable: false
          },
          {
            text: 'global.signTime',
            value: 'createdAt',
            sortable: false
          },
          {
            text: 'chamber.member.operation',
            value: 'operation',
            sortable: false
          }
        ],
        desserts: [],
        rules: {
          required: v => !!v || 'This field is required',
          email: v => (v || '').match(/@/) || 'Please enter a valid email'
        }
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
      this.filters.page =
        this.$route.query.page !== undefined
          ? Number(this.$route.query.page) - 1
          : 0
      this.reloadTable()
    },
    methods: {
      ...mapMutations(['snackbarStateChange']),
      toggleAll() {
        if (this.selected.length) this.selected = []
        else this.selected = this.desserts.slice()
      },
      changeSort(column) {
        if (this.pagination.sortBy === column) {
          this.pagination.descending = !this.pagination.descending
        } else {
          this.pagination.sortBy = column
          this.pagination.descending = false
        }
      },
      //獲取名單列表
      reloadTable() {
        this.loading = true
        if (this.filters.search === null) {
          delete this.filters.search
        }
        this.$http
          .get('manager/event_attendees', {
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
      checkTickets() {
        if (this.checkTicket.referenceNumber !== null) {
          this.$http
            .post(
              'manager/event_attendees/inspectTicket',
              this.$serialize(this.checkTicket),
              {
                headers: {
                  'X-TENANT-ID': this.$route.params.organizationId
                }
              }
            )
            .then(res => {
              this.snackbarStateChange({
                color: 'success',
                text: this.$t('message.update_message'),
                snackbar: true
              })
              this.reloadTable()
            })
            .catch(error => {
              this.snackbarStateChange({
                color: 'error',
                text: error.data.message,
                snackbar: true
              })
              this.isLoading = false
            })
        } else {
          this.snackbarStateChange({
            color: 'error',
            text: this.$t('message.re_code'),
            snackbar: true
          })
        }
      },
      //批量修改活动
      checkup(status) {
        if (this.selected.length > 0) {
          this.isLoading = true
          let params = new URLSearchParams()
          let index = this.selected.findIndex(val => {
            return val.statusType === 'PENDING'
          })
          if (index !== -1) {
            this.selected.forEach((value, i) => {
              if (value.statusType === 'PENDING') {
                params.append(`eventAttendeeIds[${i}]`, value.id)
              }
            })
            params.append(
              'organization.id',
              this.$route.params.organizationId
            )
            params.append('status', status)
            this.$http
              .post(`manager/event_attendees/checkup`, params, {
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
                this.isLoading = false
                this.reloadTable()

                this.selected = []
              })
              .catch(error => {
                this.snackbarStateChange({
                  color: 'pink',
                  text: error.data.message,
                  snackbar: true
                })
                this.isLoading = false
              })
          } else {
            this.isLoading = false

            this.snackbarStateChange({
              color: 'pink',
              text: '不能重複審核活動',
              snackbar: true
            })
          }
        } else {
          this.snackbarStateChange({
            color: 'pink',
            text: this.$t('message.editAttendeess'),
            snackbar: true
          })
        }
      },
      //導出
      exportSign() {
        location.href = `https://api.connected.hk/api/v1/event_attendees/poi?eventId=${
          this.$route.params.signId
          }`
        this.snackbarStateChange({
          color: 'primary',
          text: this.$t('message.export_message'),
          snackbar: true
        })
      },
      //刪除
      deleteAttendeess() {
        if (this.selected.length > 0) {
          this.isLoading = true
          let arr = this.selected.map(item => {
            return item.id
          })
          this.$http
            .delete(`event_attendees/${arr.join(',')}`, {
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
              this.isLoading = false
              this.selected = []
              this.reloadTable()
            })
            .catch(error => {
              this.snackbarStateChange({
                color: 'pink',
                text: error.data.message,
                snackbar: true
              })
              this.isLoading = false
            })
        } else {
          this.snackbarStateChange({
            color: 'pink',
            text: this.$t('message.editAttendeess'),
            snackbar: true
          })
        }
      },
      change(data) {
        if (data.statusType === undefined) {
          delete this.filters['expenses']
          delete this.filters['eventTicketPrice']
          delete this.filters['statusType']
          this.reloadTable()
        } else {
          if (data.statusType === 'expenses') {
            delete this.filters['eventTicketPrice']
          }
          if (data.statusType === 'eventTicketPrice') {
            delete this.filters['expenses']
          }
          this.filters[data.statusType] = data.id
          this.reloadTable()
        }
      },
      handleInput(value) {
        this.pagination.page = value
        this.$router.push({
          path: `/organization/${this.$route.params.organizationId}/sign/${this.$route.params.signId}/list`,
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
