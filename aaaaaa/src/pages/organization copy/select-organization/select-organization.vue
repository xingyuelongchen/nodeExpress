<template>
  <v-container grid-list-xl text-xs-center>
    <v-card v-if="isApproved" class="pa-4 pb-100 mt-80">
      <div class="card-header card-header-icon card-header-rose">
        <div class="card-icon">
          <i class="material-icons">
            <font style="vertical-align: inherit;">
              <font style="vertical-align: inherit;">home</font>
            </font>
          </i>
        </div>
        <h4 class="text-lg-left">
          <font class="headline" style="vertical-align: inherit;">
            <font style="vertical-align: inherit;">{{$t('chamber.select.my_coc')}}
            </font>
          </font>
          <span class="ml-3">
            <span class="error--text font-weight-regular"> {{$t('chamber.prompt.title')}}: </span>
            <span class="font-weight-regular ml-2">{{$t('chamber.prompt.add_coc_text')}}</span>
          </span>
          <v-btn small color="primary" style="float:right" to="/organizations/create">{{$t('chamber.btn.add_coc')}}
          </v-btn>
        </h4>
      </div>
      <v-divider class="mt-4 py-1"></v-divider>

      <v-data-table :headers="headers" :items="organizations" :no-data-text="$t('message.no_message')"
                    :loading="loading" hide-actions class="rtable rtable--flip elevation-1">
        <template slot="items" slot-scope="props">
          <td class="py-3 text-xs-left">
            <img :src="`${$fileUrl}/public/uploads/o/company/organization/${props.item.id}/${props.item.logo}`"
                 width="50">
          </td>
          <td class="text-xs-left">{{ props.item.name }}</td>
          <td class="text-xs-left">{{ props.item.contacts }}</td>
          <td class="text-xs-left">{{ props.item.phone }}</td>
          <td class="text-xs-left">{{ props.item.location.name }}</td>
          <td class="text-xs-left">{{ props.item.industry.name }}</td>
          <td class="text-xs-center">
            <v-tooltip top>
              <v-btn flat icon color="purple darken-2" slot="activator" @click="selectChamber(props.item)">
                <v-icon size="18">visibility</v-icon>
              </v-btn>
              <span>{{$t('global.see_coc')}}</span>
            </v-tooltip>
            <v-tooltip top>
              <v-btn flat icon color="primary" slot="activator" :to="`/organizations/${props.item.id}/edit`">
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

    </v-card>

    <v-card v-else class="pa-4 pb-100 mt-80 text-xs-center">
      <div class="px-5 mb-3">
        <v-icon color="primary" size="100">block</v-icon>
      </div>
      <p>{{$t('chamber.prompt.settled_success' )}}</p>
      <div>
        <v-btn color="primary" @click="isApproved = true">返回企業管理</v-btn>
      </div>
    </v-card>
    <!-- 刪除模態框 -->
    <v-layout row justify-center>
      <v-dialog v-model="dialog" persistent max-width="290">
        <v-card>
          <v-card-title class="headline">{{$t('global.deleteConfirmTitle')}}</v-card-title>
          <v-card-text class="text-xs-left">{{$t('global.confirmedDeleteCoc')}}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="darken-1" flat @click.native="dialog = false">{{$t('button.cancel')}}</v-btn>
            <v-btn color="primary darken-1" flat @click="deletes()">{{$t('button.confirm')}}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-container>
</template>

<script>
  import {mapMutations} from 'vuex'

  export default {
    data() {
      return {
        loading: false,
        dialog: false,
        isApproved: true,
        organizations: [],
        headers: [
          {
            text: this.$t('chamber.create.logo'),
            align: 'left',
            sortable: false,
            value: 'name'
          },
          {
            text: this.$t('chamber.select.information'),
            align: 'left',
            sortable: false,
            value: 'name'
          },
          {
            text: this.$t('chamber.select.contacts'),
            value: 'calories',
            sortable: false
          },
          {
            text: this.$t('chamber.select.phone'),
            value: 'calories',
            sortable: false
          },
          {
            text: this.$t('chamber.create.region'),
            value: 'region',
            sortable: false
          },
          {
            text: this.$t('chamber.create.industry'),
            value: 'region',
            sortable: false
          },
          {
            text: this.$t('chamber.select.operation'),
            value: 'calories',
            align: 'center',
            sortable: false
          }
        ]
      }
    },
    mounted() {
      this.readOrganization()
    },
    methods: {
      ...mapMutations(['snackbarStateChange']),
      readOrganization() {
        this.loading = true
        this.$http.get('public/organizations/user').then(res => {
          this.organizations = res.data.content
          this.loading = false
        })
      },
      change(id) {
        this.dialog = true
        this.itemId = id
      },
      deletes() {
        this.$http
          .delete(`manager/organizations/${this.itemId}`, {
            headers: {
              'X-TENANT-ID': this.itemId
            }
          })
          .then(res => {
            this.snackbarStateChange({
              color: 'success',
              text: this.$t('message.delete_success'),
              snackbar: true
            })
            this.dialog = false
            this.readOrganization()
          })
          .catch(error => {
            this.snackbarStateChange({
              color: 'error',
              text: error.data.message,
              snackbar: true
            })
          })
      },
      selectChamber(coc) {
        if (coc.isApproved) {
          this.$router.push({
            path: `/organization/${coc.id}/dashboard`
          })
        } else {
          this.isApproved = false
        }
      }
    }
  }
</script>
<style lang='scss'>
  // @media only screen and (min-width: 1904px) {
  //     .container {
  //         max-width: 1200px !important;
  //     }
  // }

  .card-icon {
    border-radius: 3px;
    background-color: #999;
    padding: 15px;
    margin-top: -45px;
    margin-right: 15px;
    float: left;
    background: linear-gradient(60deg, #2c7a90, #CFD8DC);
    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.14),
    0 7px 10px -5px rgba(30, 77, 233, 0.4);

    i {
      width: 33px;
      height: 33px;
      text-align: center;
      line-height: 33px;
      color: #fff;
    }
  }

  .card-title {
    margin-top: 15px;
    color: #3c4858;
  }

  .pb-100 {
    padding-bottom: 200px !important;
  }

  .mt-80 {
    margin-top: 80px;
  }

  .elevation-1 {
    margin-top: 20px;
    box-shadow: none !important;

    table thead th {
      background: #CFD8DC;
    }

    table thead tr {
      border-color: #fff !important;
    }

    table tbody td {
      background-color: #f2f4f8;
    }

    table tbody tr {
      border-color: #fff !important;
    }
  }
</style>

