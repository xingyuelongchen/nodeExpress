<template>
  <div>
    <v-layout row wrap align-center fill-height class="mx-4 mt-2">
      <v-flex md3 sm6>
        <v-text-field :label="$t('global.search_text')" v-model="filters.search" @keyup.enter="reloadTable()"
                      prepend-icon="search" px3 class="px3"></v-text-field>
      </v-flex>
      <v-flex md1 sm2 offset-sm4 offset-md8>
        <v-btn color="primary" :to="{path: `/organization/${$route.params.organizationId}/emails`}">
          {{$t('chamber.left.email')}}
        </v-btn>
      </v-flex>
    </v-layout>
    <v-data-table hide-actions :headers="headers" :items="desserts" :no-data-text="$t('message.no_message')"
                  :pagination.sync="pagination" :rows-per-page-items="limit" :total-items="totalDesserts"
                  :loading="loading" class="rtable rtable--flip elevation-1">
      <template slot="items" slot-scope="props">
        <td>{{props.item.subject}}</td>
        <td>{{props.item.fromName}}</td>
        <td>{{props.item.number}}</td>
        <td class="text-xs-center">{{props.item.createdAt | time}}</td>
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

  </div>
</template>
<script>

  export default {
    data() {
      return {
        loading: true,
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
        limit: [9],
        headers: [
          {
            text: this.$t('chamber.member.send_email_title'),
            align: 'left',
            value: 'subject',
            sortable: false
          },
          {
            text: this.$t('chamber.member.fromName'),
            align: 'left',
            sortable: false,
            value: 'fromName'
          },
          {
            text: this.$t('chamber.member.from_number'),
            align: 'left',
            value: 'number'
          },
          {
            text: this.$t('chamber.know.time'),
            align: 'left',
            sortable: false,
            value: 'type'
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
      reloadTable() {
        this.loading = true
        if (this.filters.search === null) {
          delete this.filters.search
        }
        this.$http
          .get('manager/mass_emails', {
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
      handleInput(value) {
        this.pagination.page = value
        this.$router.push({
          path: `/organization/${this.$route.params.organizationId}/recording`,
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
