<template>
  <div>
    <v-layout row wrap align-center fill-height class="mx-4 mt-2">
      <v-flex md3 sm6>
        <v-text-field :label="$t('global.search_text')" v-model="filters.search" @keyup.enter="reloadTable()"
                      prepend-icon="search" px3 class="px3"></v-text-field>
      </v-flex>
      <v-flex md1 sm2 offset-sm4 offset-md8>
        <v-btn color="primary" :to="`/organization/${$route.params.organizationId}/create/events`">
          {{$t('chamber.btn.add_activity')}}
        </v-btn>
      </v-flex>
    </v-layout>
    <v-data-table hide-actions :headers="headers" :items="desserts" :no-data-text="$t('message.no_message')"
                  :pagination.sync="pagination" :rows-per-page-items="limit" :total-items="totalDesserts"
                  :loading="loading" class="rtable rtable--flip elevation-1">
      <template slot="items" slot-scope="props">
        <td class="text-xs-left px-2 py-1">
         <template v-if="props.item.eventFiles.length > 0">
           <v-img class="hidden-xs-only"
                  :src="`${$fileUrl}/public/uploads/o/company/event/${props.item.id}/${props.item.eventFiles[0].key}`"
                  lazy-src="https://picsum.photos/510/300?random" aspect-ratio="1.7"></v-img>
           <img class="hidden-sm-and-up"
                :src="`${$fileUrl}/public/uploads/o/company/event/${props.item.id}/${props.item.eventFiles[0].key}`"
                style="padding:5px"
                width="80">
         </template>
        </td>
        <td>
          <p class="mt-3 xsmy-0">
            <router-link
              :to="{path: '/company/activity-detail',query:{id:$route.params.organizationId,actId:props.item.id}}"
              target="_blank">{{ props.item.title }}
            </router-link>
            <span class="white--text caption px-1"
                  :class="{ 'success': props.item.timeStatus==='global.conduct', 'error': props.item.timeStatus==='global.soon','orange darken-1': props.item.timeStatus==='global.end'  }">{{$t(props.item.timeStatus)}}</span>
          </p>
          <p> {{$t('chamber.activity.time')}}: {{ props.item.startedAt | time}} - {{ props.item.endedAt | time}}</p>
        </td>
        <td class="text-xs-left">
          {{ props.item.totalNumber }} / {{ props.item.personnelNumber }}
          <router-link v-if="props.item.totalNumber !== 0" class="hidden-sm-and-up"
                       :to="`/organization/${$route.params.organizationId}/sign/${props.item.id}/list`">
            {{$t('chamber.left.list')}}
          </router-link>

          <p v-if="props.item.totalNumber !== 0" class="hidden-sm-and-down">
            <router-link :to="`/organization/${$route.params.organizationId}/sign/${props.item.id}/list`">
              {{$t('chamber.left.list')}}
            </router-link>
          </p>
        </td>
        <td class="text-xs-left">{{ props.item.createdAt | time}}</td>
        <td class="text-md-center text-xs-left">
          <v-tooltip top>
            <v-btn flat icon color="primary" slot="activator"
                   :to="`/organization/${$route.params.organizationId}/edit/${props.item.id}/events`">
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

  </div>
</template>
<script>
  import {mapMutations} from 'vuex'

  export default {
    data() {
      return {
        countries: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        loading: true,
        dialog: false,
        dialog1: false,
        form: false,
        currentDate: this.$moment(new Date()),
        isLoading: false,
        snackbarText: null,
        snackbar: false,
        itemId: null,
        title: 'chamber.btn.add_know',
        filters: {
          search: null,
          'organization.id': this.$route.params.organizationId,
          page: 0,
          size: 6
        },
        forms: {
          type: 'NOTICE',
          content: null,
          title: null
        },
        totalDesserts: 0,
        totalPages: 0,
        pagination: {
          sortBy: 'createdAt'
        },
        rules: {
          required: v => !!v || 'This field is required'
        },
        limit: [6],
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
            text: this.$t('global.sign'),
            align: 'left',
            sortable: false,
            value: 'sign'
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
          .get('manager/events', {
            params: this.filters,
            headers: {
              'X-TENANT-ID': this.$route.params.organizationId
            }
          })
          .then(res => {
            this.desserts = res.data.content
            this.desserts.forEach(val => {
              val['totalNumber'] = 0
              val.eventTickets.forEach(value => {
                val['totalNumber'] =
                  val['totalNumber'] + value.vendition
              })
              if (
                this.currentDate > val.startedAt &&
                this.currentDate < val.endedAt
              ) {
                val['timeStatus'] = 'global.conduct'
              } else if (
                this.currentDate > val.startedAt &&
                this.currentDate > val.endedAt
              ) {
                val['timeStatus'] = 'global.end'
              } else if (this.currentDate < val.startedAt) {
                val['timeStatus'] = 'global.soon'
              }
            })
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
          .delete(`manager/events/${this.itemId}`, {
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
          message = 'update_message'
        }

        this.$http
          .post('`manager/organization_rules', this.$serialize(this.forms), {
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
      handleInput(value) {
        this.pagination.page = value
        this.$router.push({
          path: `/organization/${this.$route.params.organizationId}/events`,
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
