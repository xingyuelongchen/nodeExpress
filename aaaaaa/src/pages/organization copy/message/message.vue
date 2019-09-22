<template>
  <div>
    <v-layout row wrap class="mx-4 mt-2">
      <v-flex md3 sm6>
        <v-text-field :label="$t('global.search_text')" v-model="filters.search" @keyup.enter="reloadTable()" prepend-icon="search" px3 class="px3"></v-text-field>
      </v-flex>
    </v-layout>
    <v-data-table hide-actions :headers="headers" :items="desserts" :no-data-text="$t('message.no_message')"  :pagination.sync="pagination" :rows-per-page-items="limit" :total-items="totalDesserts" :loading="loading" class="rtable rtable--flip elevation-1">
      <template slot="items" slot-scope="props">
        <td>{{ props.item.title }}</td>
        <td class="text-xs-left">{{ props.item.contacts }}</td>
        <td class="text-xs-left">{{ props.item.phone }}</td>
        <td class="text-xs-left">{{ props.item.leavingMessagedAt | time}}</td>
        <td class="text-md-center text-xs-left">
          <v-btn flat color="primary darken-1" @click="edieDialog(props.item)">
            <span v-if="!props.item.messageReply">{{$t('chamber.btn.want_reply')}}</span>
            <span v-else>{{$t('global.replies')}}</span>
          </v-btn>
        </td>
      </template>
           <template slot="footer">
        <td :colspan="headers.length +1"class="px-0">
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
      <v-dialog v-model="dialog1" persistent max-width="500px">
        <v-card>
          <v-card-title>
            <span class="title">{{$t(title)}}</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-form ref="form" v-model="form">
                <v-layout row wrap>
                  <v-flex xs12>
                    <v-text-field color="purple darken-2" :disabled="forms.title" v-model="forms.title" :label="$t('chamber.know.title')" :rules="[rules.required]"></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field color="purple darken-2" :disabled="forms.contacts" v-model="forms.contacts" :label="$t('chamber.create.contacts')" :rules="[rules.required]"></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field color="purple darken-2" :disabled="forms.phone" v-model="forms.phone" :label="$t('chamber.create.phone')" :rules="[rules.required]"></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field color="purple darken-2" :disabled="forms.email" v-model="forms.email" :label="$t('chamber.create.email')" :rules="[rules.required]"></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-textarea :disabled="forms.leavingMessage" color="purple darken-2" :label="$t('chamber.know.content')" :rules="[rules.required]" v-model="forms.leavingMessage"></v-textarea>
                  </v-flex>
                  <v-flex xs12>
                    <v-textarea :disabled="forms.messageReply" color="purple darken-2" :label="$t('chamber.member.admin_post')" :rules="[rules.required]" v-model="messageReply"></v-textarea>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="darken-1" flat @click.native="dialog1 = false">{{$t('button.cancel')}}</v-btn>
            <v-btn v-if="!forms.messageReply " color="primary darken-1" :disabled="!form" :loading="isLoading" flat @click.native="onSubmit()">{{$t('button.save')}}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>

  </div>
</template>
<script>
import { mapMutations } from 'vuex'

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
            messageReply: null,
            itemId: null,
            title: 'chamber.btn.add_know',
            filters: {
                search: null,
                'organization.id': this.$route.params.organizationId,
                page: 0,
                size: 9
            },
            forms: {
                id: null,
                contacts: null,
                isActive: true,
                leavingMessage: null,
                title: null,
                phone: null,
                email: null
            },
            totalDesserts: 0,
            totalPages: 0,
            pagination: {
                sortBy: 'createdAt'
            },
            rules: {
                required: v => !!v || this.$t('validation.required'),
            },
            limit: [10],
            headers: [
                {
                    text: this.$t('chamber.know.title'),
                    align: 'left',
                    sortable: false,
                    value: 'title'
                },
                {
                    text: this.$t('chamber.create.contacts'),
                    align: 'left',
                    sortable: false,
                    value: 'contacts'
                },
                {
                    text: this.$t('chamber.create.phone'),
                    align: 'left',
                    sortable: false,
                    value: 'phone'
                },

                { text: this.$t('chamber.know.time'), value: 'createdAt' },
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
                .get('manager/messages', {
                    params: this.filters,
                  headers:{
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
        onSubmit() {
            this.isLoading = true
            this.forms['organization.id'] = this.$route.params.organizationId
            this.forms['messageReply'] = this.messageReply
            let message
            if (this.forms.id === undefined) {
                message = 'store_message'
            } else {
                delete this.forms.organization
                delete this.forms.createdAt
                message = 'update_message'
            }

            this.$http
                .put('manager/messages', this.$serialize(this.forms),{ headers:{
                    'X-TENANT-ID': this.$route.params.organizationId
                  }})
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
            this.messageReply = data.messageReply
            this.dialog1 = true
            this.title = 'chamber.btn.see'
        },
        handleInput(value) {
            this.pagination.page = value
            this.$router.push({
                path: `/organization/${this.$route.params.organizationId}/messages`,
                query: {
                    page: value
                }
            })
             this.filters.page = value-1
            this.reloadTable()
      }
    }
}
</script>
