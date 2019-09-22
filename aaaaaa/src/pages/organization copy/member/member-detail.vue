<template>
  <div id="member-detail">
    <v-container grid-list-xl text-xs-center>
      <div class="text-xs-center" v-if="loading">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>
      <template v-else>
        <v-layout row wrap class="my-5 mx-2">
          <v-flex sm2>
            <v-avatar :size="100" color="grey lighten-4">
              <img v-if="members.user.userProfile.avatar !== null"
                   :src="`${$fileUrl}${members.user.userProfile.avatar}`" alt="avatar">
              <img v-else src="https://dummyimage.com/80x80/ddd/fff" alt="avatar">
            </v-avatar>
          </v-flex>
          <v-flex class="text-xs-left">
            <div class="mt-2">
              <span class="title">{{members.user.userProfile.name}}</span>
              <span class="ml-3" v-if="members.user.userProfile.englishName !== null">{{$t('global.EnglishName')}}: {{members.user.userProfile.englishName}}</span>
              <span class="white--text px-1"
                    :class="{'error':members.status === 'REJECT','success':members.status === 'SUCCESS','deep-orange darken-1':members.status === 'PENDING'}">{{$t(`global.${members.status}`)}}</span>
            </div>
            <div class="mt-2">
              <span>{{$t('chamber.member.number')}}: {{members.number}}</span> |
              <span>{{$t('chamber.member.post')}}: {{members.membership.name}}</span>
            </div>
            <div class="mt-2">
              <span>{{$t('global.apply_position')}}: {{members.memberPosition.title}} |</span>
              <span v-if=" members.memberGroups.length > 0">{{$t('chamber.member.ground_name')}}: <span
                v-for=" item in members.memberGroups">{{item.name}} |</span></span>
              <span v-if="members.introducer !== null">{{$t('global.introducer')}}: {{members.introducer}} |</span>
              <span v-if="members.joinAt !== null"> {{$t('global.joinAt')}}: {{members.joinAt}}</span>
            </div>
            <p class="mt-2 primary--text">
              <v-btn small color="primary" class="mx-0" @click="openDialog()">{{$t('button.edit')}}</v-btn>
              {{$t('global.examineShow')}}
            </p>
            <p class="mt-2 error--text" v-if="members.status === 'REJECT'">
              {{$t('global.rejection_reasons')}}: <span>{{members.remark}}</span>
            </p>
          </v-flex>
        </v-layout>
        <v-layout column class="mx-2">
          <v-tabs centered color="pink darken-4" dark icons-and-text>
            <v-tabs-slider color="yellow"></v-tabs-slider>
            <v-tab href="#tab-1">
              {{$t('chamber.member.information')}}
              <v-icon>account_circle</v-icon>
            </v-tab>

            <v-tab href="#tab-2">
              {{$t('chamber.member.experience')}}
              <v-icon>explicit</v-icon>
            </v-tab>

            <v-tab href="#tab-3">
              {{$t('global.company')}}
              <v-icon>business</v-icon>
            </v-tab>

            <v-tab href="#tab-4">
              {{$t('chamber.member.background')}}
              <v-icon>layers</v-icon>
            </v-tab>
            <v-tab href="#tab-5" @click="reloadActivity()">
              {{$t('global.activityRecord')}}
              <v-icon>local_activity</v-icon>
            </v-tab>
            <v-tab href="#tab-6" @click="reloadPayment()">
              {{$t('global.payRecord')}}
              <v-icon>payment</v-icon>
            </v-tab>
            <!-- //用户信息 -->
            <v-tab-item id="tab-1">
              <v-layout align-center justify-center row fill-height class="my-5">
                <v-flex xs12 md4 lg3>
                  <v-card class="py-3">
                    <v-list dense>
                      <v-list-tile>
                        <v-list-tile-content>{{$t('user.user_baseinfo.name')}}:</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{members.user.userProfile.name}}</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content>{{$t('user.user_baseinfo.genders')}}:</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{$t(`global.${members.user.userProfile.gender}`)}}
                        </v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content>{{$t('user.user_baseinfo.age')}}:</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{members.user.userProfile.age}}</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content>{{$t('user.user_baseinfo.location')}}:</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{members.user.userProfile.country.name}}
                        </v-list-tile-content>
                      </v-list-tile>

                    </v-list>
                  </v-card>
                </v-flex>
                <v-flex xs12 md4 lg3>
                  <v-card class="py-3">
                    <v-list dense>
                      <v-list-tile>
                        <v-list-tile-content>{{$t('user.user_baseinfo.phone')}}:</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{members.user.userProfile.phone}}</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content>{{$t('user.user_baseinfo.email')}}:</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{members.user.userProfile.email}}</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content>{{$t('global.id_type')}}:</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{$t(`global.${members.user.userProfile.idtype}`)}}
                        </v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content>{{$t('global.id_number')}}:</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{members.user.userProfile.idnumber}}
                        </v-list-tile-content>
                      </v-list-tile>

                    </v-list>
                  </v-card>
                </v-flex>

              </v-layout>
            </v-tab-item>

            <!-- 工作经验 -->
            <v-tab-item id="tab-2">
              <template v-if="userExperiences.length > 0">
                <v-data-table :headers="headers2" :items="userExperiences" :no-data-text="$t('message.no_message')"
                              :rows-per-page-items="limit" class="rtable rtable--flip elevation-1">
                  <template slot="items" slot-scope="props">
                    <td class="text-xs-left">{{ props.item.startedDate | time }} - {{ props.item.endedDate | time }}
                    </td>
                    <td class="text-xs-left">{{ props.item.companyName}}</td>
                    <td class="text-xs-left">{{ props.item.position }}</td>
                    <td class="text-xs-center">
                      <a @click="props.expanded = !props.expanded">{{$t('chamber.btn.see')}}</a>
                    </td>
                  </template>
                  <template slot="expand" slot-scope="props">
                    <v-card flat class="text-xs-left">
                      <v-card-text>{{$t('user.user_experience.job_description')}}: {{ props.item.description}}
                      </v-card-text>
                    </v-card>
                  </template>
                </v-data-table>
              </template>
              <template v-else>
                <div class="my-5">
                  <v-icon color="pink darken-4" size="100">explicit</v-icon>
                  <p class="my-5 py-2">{{$t('user.user_baseinfo.user_no_experience_add')}}</p>
                </div>
              </template>
            </v-tab-item>

            <!-- 公司 -->
            <v-tab-item id="tab-3">
              <template v-if="userCompanies.length > 0">
                <v-data-table :headers="headers3" :items="userCompanies" :no-data-text="$t('message.no_message')"
                              :rows-per-page-items="limit" class="rtable rtable--flip elevation-1">
                  <template slot="items" slot-scope="props">
                    <td class="text-xs-left">{{ props.item.companyName }}</td>
                    <td class="text-xs-left">{{ props.item.userCompanyCategory.name}}</td>
                    <td class="text-xs-left">{{ props.item.mobile }}</td>
                    <td class="text-xs-left">{{ props.item.companyEmail}}</td>
                    <td class="text-xs-center">
                      <a @click="props.expanded = !props.expanded">{{$t('chamber.btn.see')}}</a>
                    </td>

                  </template>
                  <template slot="expand" slot-scope="props">
                    <v-card flat class="text-xs-left">
                      <v-card-text>{{$t('user.user_company.address' )}}: {{ props.item.address}}</v-card-text>
                      <v-card-text>{{$t('user.user_company.scope_experience')}}: {{ props.item.scopeOfOperation}}
                      </v-card-text>
                    </v-card>
                  </template>
                </v-data-table>

              </template>
              <template v-else>
                <div class="my-5">
                  <v-icon color="pink darken-4" size="100">business</v-icon>
                  <p class="my-5 py-2">{{$t('user.user_company.user_no_user_company')}}</p>
                </div>
              </template>
            </v-tab-item>

            <!-- 教育背景 -->
            <v-tab-item id="tab-4">
              <template v-if="userEducations.length > 0">
                <v-data-table :headers="headers4" :items="userEducations" :no-data-text="$t('message.no_message')"
                              :rows-per-page-items="limit" class="rtable rtable--flip elevation-1">
                  <template slot="items" slot-scope="props">
                    <td class="text-xs-left">{{ props.item.startDate }} - {{ props.item.endDate }}</td>
                    <td class="text-xs-left">{{ props.item.schoolName}}</td>
                    <td class="text-xs-left">{{ props.item.subject }}</td>
                    <td class="text-xs-centter">
                      {{$t(`user.user_education.education_level.${props.item.educationLevel}`)}}
                    </td>
                  </template>
                  <template slot="expand" slot-scope="props">
                    <v-card flat>
                      <v-card-text>{{$t('user.user_experience.job_description')}}: {{ props.item.description}}
                      </v-card-text>
                    </v-card>
                  </template>
                </v-data-table>
              </template>
              <template v-else>
                <div class="my-5">
                  <v-icon color="pink darken-4" size="100">layers</v-icon>
                  <p class="my-5 py-2">{{$t('user.user_baseinfo.user_no_education_add')}}</p>
                </div>
              </template>
            </v-tab-item>

            <!-- 活动 -->
            <v-tab-item id="tab-5">
              <template>
                <v-data-table :headers="headers" :no-data-text="$t('message.no_message')" :items="desserts"
                              :loading="loading1" :pagination.sync="pagination" :total-items="totalDesserts"
                              :rows-per-page-items="limit" class="rtable rtable--flip elevation-1">
                  <template slot="items" slot-scope="props">
                    <td class="text-xs-left px-2 py-1">
                      <v-img style="width:100px;float:left" class="mr-2 hidden-xs-only"
                             :src="`${$fileUrl}${props.item.event.eventFiles[0].key}`"
                             lazy-src="https://picsum.photos/510/300?random"></v-img>
                      <img style="width:80px;float:left" class="mr-2 hidden-sm-and-up"
                           :src="`${$fileUrl}${props.item.event.eventFiles[0].key}`"
                           lazy-src="https://picsum.photos/510/300?random"></img>
                      <p> {{ props.item.event.title }} <span class="white--text caption px-1"
                                                             :class="{ 'success': props.item.timeStatus==='global.conduct', 'error': props.item.timeStatus==='global.soon','orange darken-1': props.item.timeStatus==='global.end'  }">{{$t(props.item.timeStatus)}}</span>
                      </p>
                      <div> {{$t('chamber.activity.time')}}: {{ props.item.event.startedAt | time}} - {{
                        props.item.event.endedAt | time}}
                      </div>
                    </td>
                    <td class="text-xs-left">
                      {{props.item.order.orderLineItems[0].title}}
                    </td>
                    <td class="text-xs-left">
                      <span class="pt-4" v-if="props.item.order.orderLineItems[0].price === 0"> {{$t('global.freeTicket')}}</span>
                      <span class="pt-4" v-else> {{$t('global.chargeTicket')}}</span>
                      <p class="error--text">$HK {{props.item.order.orderLineItems[0].price}}</p>
                    </td>
                    <td class="text-xs-center">
                      <span v-if="props.item.statusType === 'PENDING'" class="warning--text">{{$t('chamber.btn.audited') }}</span>
                      <span v-if="props.item.statusType === 'SUCCESS'"
                            class="success--text">{{$t('global.SUCCESS') }}</span>
                      <span v-if="props.item.statusType === 'REFUSE'"
                            class="error--text">{{$t('chamber.btn.refuse') }}</span>
                    </td>
                  </template>
                  <template slot="pageText" slot-scope="props">
                    Lignes {{ props.pageStart }} - {{ props.pageStop }} de {{ props.itemsLength }}
                  </template>
                </v-data-table>
              </template>
            </v-tab-item>

            <!-- 支付 -->
            <v-tab-item id="tab-6">
              <template>
                <v-data-table :headers="headers1" :no-data-text="$t('message.no_message')" :items="desserts1"
                              :loading="loading1" :pagination.sync="pagination1" :total-items="totalDesserts1"
                              :rows-per-page-items="limit" class="rtable rtable--flip elevation-1">
                  <template slot="items" slot-scope="props">
                    <td class="text-xs-left">
                      {{ props.item.id }}
                    </td>
                    <td class="text-xs-left">
                      {{ props.item.name }}
                    </td>
                    <td class="text-xs-left">
                      {{ props.item.email }}
                    </td>
                    <td class="text-xs-left">
                      {{ $t(`global.${props.item.subjectType}`) }}
                    </td>
                    <td class="text-xs-left">
                      {{ props.item.gateway }}
                    </td>
                    <td class="text-xs-left error--text">
                      $HK {{ props.item.amount }}
                    </td>
                    <td class="text-xs-center error--text">
                      <span v-if="props.item.status === 'SUCCESS'"
                            class="success--text">{{$t('global.alreadyPaid')}}</span>
                      <span v-if="props.item.status === 'PENDING' && props.item.isActive" class="success--text">{{$t('global.alreadyPaid')}}</span>
                      <span v-if="props.item.status === 'PENDING' && !props.item.isActive" class="warning--text">{{$t('global.nPaid')}}</span>
                      <span v-if="props.item.status === 'ERROR'" class="error--text">{{$t('global.ERROR')}}</span>
                    </td>
                  </template>
                  <template slot="pageText" slot-scope="props">
                    Lignes {{ props.pageStart }} - {{ props.pageStop }} de {{ props.itemsLength }}
                  </template>
                </v-data-table>
              </template>
            </v-tab-item>

          </v-tabs>
        </v-layout>
      </template>
    </v-container>
    <!-- 編輯會員模態框  dialog-->
    <v-layout row justify-center>
      <v-dialog v-model="dialog" persistent max-width="500px">
        <v-card>
          <v-card-title>
            <span class="title">{{$t('chamber.btn.set_member')}}</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-form ref="form" v-model="valid">
                <v-layout row wrap>
                  <v-flex v-if="members.status === 'PENDING'">
                    <v-select color="purple darken-2" v-model="selectStatus"
                              :items="[{id: 'SUCCESS',name:$t('chamber.btn.adopt') },{id: 'REJECT',name:$t('chamber.btn.refuse') }]"
                              item-text="name" item-value="id" :label="$t('global.auditSettings')"
                              :rules="[rules.required]" persistent-hint single-line></v-select>
                    <!-- <v-autocomplete v-model="form.status" :items="[{id: 'SUCCESS',name:$t('chamber.btn.adopt') },{id: 'REJECT',name:$t('chamber.btn.refuse') }]" :rules="[rules.required]" color="purple darken-2" :label="$t('global.auditSettings')" item-text="name" item-value="id">
                      <template slot="item" slot-scope="data">
                        <template>
                          <v-list-tile-content>
                            <v-list-tile-title color="#333" v-html="data.item.name"></v-list-tile-title>
                          </v-list-tile-content>
                        </template>
                      </template>
                    </v-autocomplete> -->
                  </v-flex>
                  <v-flex xs12>
                    <v-select color="purple darken-2" v-model="selectPosition" :items="positions" item-text="title"
                              item-value="id" :label="$t('global.examine_positiion')" :rules="[rules.required]"
                              persistent-hint single-line></v-select>
                  </v-flex>
                  <v-flex xs12>
                    <v-select color="purple darken-2" v-model="selectMemberships" :items="memberships" item-text="name"
                              item-value="id" :label="$t('global.examine_memberShips')" :rules="[rules.required]"
                              persistent-hint single-line></v-select>
                  </v-flex>
                  <v-flex xs12 v-if="members.status !== 'REJECT' || selectStatus !== 'REJECT'">
                    <v-dialog ref="dialog" v-model="menu" :return-value.sync="form.joinAt" persistent lazy full-width
                              width="290px">
                      <v-text-field slot="activator" v-model="form.joinAt" :label="$t('global.joinAt')"
                                    readonly></v-text-field>
                      <v-date-picker v-model="form.joinAt" scrollable>
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                        <v-btn flat color="primary" @click="$refs.dialog.save(form.joinAt)">OK</v-btn>
                      </v-date-picker>
                    </v-dialog>
                  </v-flex>
                  <v-flex xs12 v-if="members.active">
                    <v-dialog ref="dialog1" v-model="menu1" :return-value.sync="form.expiredAt" persistent lazy
                              full-width width="290px">
                      <v-text-field slot="activator" v-model="form.expiredAt" :label="$t('global.endTimedAt')"
                                    readonly></v-text-field>
                      <v-date-picker v-model="form.expiredAt" scrollable>
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="menu1 = false">Cancel</v-btn>
                        <v-btn flat color="primary" @click="$refs.dialog1.save(form.expiredAt)">OK</v-btn>
                      </v-date-picker>
                    </v-dialog>
                  </v-flex>
                  <v-flex v-if="selectStatus === 'REJECT' && members.status === 'PENDING'">
                    <v-textarea name="input-7-1" color="purple darken-2" :rules="[rules.required]" v-model="form.remark"
                                :label="$t('global.rejection_reasons')" hint="Hint text"></v-textarea>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="darken-1" flat @click.native="dialog = false">{{$t('button.cancel')}}</v-btn>
            <v-btn color="primary darken-1" :disabled="!valid" :loading="isLoading" flat @click.native="onSubmit()">
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
        pagination: {
          sortBy: 'createdAt'
        },
        pagination1: {
          sortBy: 'id',
          sortBy: 'amount'
        },
        form: {
          role: 'enterprise',
          expiredAt: null,
          joinType: null,
          status: null,
          joinAt: null,
          organizationId: this.$route.params.organizationId
        },
        menu: false,
        menu1: false,
        selectStatus: null,
        valid: true,
        isLoading: false,
        dialog: false,
        loading: false,
        loading1: false,
        members: {
          user: {
            userProfile: {
              name: null
            }
          }
        },
        rules: {
          required: v => !!v || this.$t('validation.required'),
          email: v => (v || '').match(/@/) || this.$t('validation.email')
        },
        limit: [8],
        totalDesserts: 0,
        totalDesserts1: 0,
        selectPosition: null,
        selectMemberships: null,
        positions: [],
        memberships: [],
        userExperiences: [],
        userCompanies: [],
        userEducations: [],
        headers: [
          {
            text: this.$t('chamber.activity.name'),
            value: 'name',
            sortable: false
          },
          {
            text: this.$t('chamber.activity.type'),
            value: 'type',
            sortable: false
          },
          {
            text: this.$t('chamber.activity.price'),
            value: 'price',
            sortable: false
          },
          {
            text: this.$t('chamber.activity.status'),
            value: 'status',
            sortable: false
          }
        ],
        headers1: [
          {
            text: this.$t('chamber.payment.orderNumber'),
            value: 'orderNumber',
            sortable: false
          },
          {
            text: this.$t('chamber.payment.orderName'),
            value: 'orderName',
            sortable: false
          },
          {
            text: this.$t('chamber.payment.email'),
            value: 'email',
            sortable: false
          },
          {
            text: this.$t('chamber.payment.type'),
            value: 'method',
            sortable: false
          },
          {
            text: this.$t('chamber.payment.method'),
            value: 'method',
            sortable: false
          },
          {
            text: this.$t('chamber.payment.money'),
            value: 'method',
            sortable: false
          },
          {
            text: this.$t('chamber.payment.status'),
            value: 'status',
            sortable: false
          }
        ],
        headers2: [
          {
            text: `${this.$t('user.user_education.start')} - ${this.$t('user.user_education.end')}`,
            align: 'left',
            sortable: false,
            value: 'title'
          },
          {
            text: this.$t('user.user_company.company_name'),
            value: 'coc',
            sortable: false
          },
          {
            text: this.$t('user.user_experience.position'),
            value: 'coc',
            sortable: false
          },
          {
            text: this.$t('user.user_experience.job_description'),
            value: 'coc',
            sortable: false
          }
        ],
        headers3: [
          {
            text: this.$t('user.user_company.company_name'),
            align: 'left',
            sortable: false,
            value: 'title'
          },
          {
            text: this.$t('user.home.industry'),
            value: 'coc',
            sortable: false
          },
          {
            text: this.$t('user.user_company.tel'),
            value: 'coc',
            sortable: false
          },
          {
            text: this.$t('chamber.member.email'),
            value: 'email',
            sortable: false
          },
          {
            text: this.$t('user.user_education.job_description'),
            value: 'lastModifiedAt',
            sortable: false
          }
        ],
        headers4: [
          {
            text: `${this.$t('user.user_education.start')} - ${this.$t('user.user_education.end')}`,
            align: 'left',
            sortable: false,
            value: 'title'
          },
          {
            text: this.$t('user.user_education.school'),
            value: 'coc',
            sortable: false
          },
          {
            text: this.$t('user.user_education.major'),
            value: 'coc',
            sortable: false
          },
          {
            text: this.$t('user.user_education.education_levels'),
            value: 'coc',
            sortable: false
          }

        ],
        currentDate: this.$moment(new Date()),
        desserts: [],
        desserts1: [],
        currentItem: 'tab-Web',
        filters: {
          page: 0,
          size: 8,
          organizationId: this.$route.params.organizationId
        },
        filters1: {
          page: 0,
          size: 8,
          organizationId: this.$route.params.organizationId
        }
      }
    },
    watch: {
      pagination: {
        handler() {
          if (this.filters.page !== this.pagination.page - 1) {
            this.filters.page = this.pagination.page - 1
            this.desserts.length = 0
            this.reloadActivity()
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
      },
      pagination1: {
        handler() {
          if (this.filters1.page !== this.pagination1.page - 1) {
            this.filters1.page = this.pagination1.page - 1
            this.desserts1.length = 0
            this.reloadPayment()
          } else {
            const sortBy = this.pagination1.sortBy
            this.desserts1 = this.desserts1.sort((a, b) => {
              const sortA = a[sortBy]
              const sortB = b[sortBy]
              if (this.pagination1.descending) {
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
    methods: {
      addItem(item) {
        const removed = this.items.splice(0, 1)
        this.items.push(...this.more.splice(this.more.indexOf(item), 1))
        this.more.push(...removed)
        this.$nextTick(() => {
          this.currentItem = 'tab-' + item
        })
      }
    },
    mounted() {
      this.readFindMembers()
    },
    methods: {
      ...mapMutations(['snackbarStateChange']),

      readFindMembers() {
        this.loading = true
        this.$http
          .get(`manager/members/${this.$route.params.memberId}`, {
            headers: {
              'X-TENANT-ID': this.$route.params.organizationId
            }
          })
          .then(res => {
            this.loading = false
            this.members = res.data
            this.userExperiences = this.members.user.userExperiences
            this.userCompanies = this.members.user.userCompanies
            this.userEducations = this.members.user.userEducations
            this.form.joinAt = this.members.joinAt
            this.form.expiredAt = this.members.expiredAt
            this.form['memberId'] = this.members.id
            this.form.joinType = this.members.joinType
            this.form.isPay = this.members.isPay
            this.form.active = this.members.active
            this.form.status = this.members.status
            this.selectStatus = this.form.status
            this.selectMemberships = this.members.membership.id
            this.selectPosition = this.members.memberPosition.id
            // this.filters.organizationId = this.members.user.id
            // this.filters1.organizationId = this.members.user.id
          })
      },
      //獲取職務
      reloadPositions() {
        this.$http
          .get('manager/member_positions', {
            params: {
              'organization.id': this.$route.params.organizationId,
              isDefault: false
            },
            headers: {
              'X-TENANT-ID': this.$route.params.organizationId
            }
          })
          .then(res => {
            this.positions = res.data.content
          })
      },
      //獲取會籍
      reloadMemberships() {
        this.$http
          .get('manager/memberships', {
            params: {
              'organization.id': this.$route.params.organizationId,
              isDefault: false
            },
            headers: {
              'X-TENANT-ID': this.$route.params.organizationId
            }
          })
          .then(res => {
            this.memberships = res.data.content
          })
      },
      reloadActivity() {
        if (this.desserts.length === 0) {
          this.loading1 = true
          this.$http
            .get('manager/event_attendees', {
              params: this.filters, headers: {
                'X-TENANT-ID': this.$route.params.organizationId
              }
            })
            .then(res => {
              this.desserts = res.data.content
              this.totalDesserts = res.data.totalElements
              this.desserts.forEach(val => {
                if (
                  this.currentDate > val.event.startedAt &&
                  this.currentDate < val.event.endedAt
                ) {
                  val['timeStatus'] = 'global.conduct'
                } else if (
                  this.currentDate > val.event.startedAt &&
                  this.currentDate > val.event.endedAt
                ) {
                  val['timeStatus'] = 'global.end'
                } else if (this.currentDate < val.event.startedAt) {
                  val['timeStatus'] = 'global.soon'
                }
              })
              this.loading1 = false
            })
        }
      },
      reloadPayment() {
        if (this.desserts1.length === 0) {
          this.loading1 = true
          this.$http
            .get('manager/transactions', {
              params: this.filters1,
              headers: {
                'X-TENANT-ID': this.$route.params.organizationId
              }
            })
            .then(res => {
              this.desserts1 = res.data.content
              this.totalDesserts1 = res.data.totalElements
              this.loading1 = false
            })
        }
      },
      //提交
      onSubmit() {
        if (this.form.joinAt === null) {
          this.form.joinAt = ''
        }
        this.form['memberPositionId'] = this.selectPosition
        this.form['membershipId'] = this.selectMemberships
        this.form['status'] = this.selectStatus
        if (this.members.status === 'PENDING') {
          this.updateMember(`manager/members/allow`)
        } else {
          this.updateMember(`manager/members`)
        }
      },
      updateMember(url) {
        this.isLoading = true
        if (this.form.expiredAt === null) {
          this.form.expiredAt = ''
        }
        this.$http
          .put(url, this.$serialize(this.form), {
            headers: {
              'X-TENANT-ID': this.$route.params.organizationId
            }
          })
          .then(res => {
            if (url === 'manager/members/allow') {
              this.assignmentGroup()
            }
            this.snackbarStateChange({
              color: 'success',
              text: this.$t(`message.update_message`),
              snackbar: true
            })
            this.readFindMembers()
            this.dialog = false
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
      //移動分組
      async assignmentGroup() {
        let data = await this.$http
          .get(
            'manager/member_groups',
            this.$serialize({
              'organization.id': this.$route.params.organizationId,
              isDefault: true
            }),
            {
              headers: {
                'X-TENANT-ID': this.$route.params.organizationId
              }
            }
          )
          .then(res => {
            return res.data.content
          })
        await this.$http
          .put(
            'manager/member_groups',
            this.$serialize({
              memberId: this.members.id,
              organizationId: this.$route.params.organizationId,
              memberGroupIds: data[0].memberGroup.id
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
          .catch(error => {
            this.isLoading = false
            this.snackbarStateChange({
              color: 'error',
              text: error.data.message,
              snackbar: true
            })
          })
      },
      openDialog() {
        this.dialog = true
        if (this.positions.length === 0) this.reloadPositions()
        if (this.memberships.length === 0) this.reloadMemberships()
      }
    }
  }
</script>
<style lang="scss">
  .container {
    max-width: 100% !important;
  }
</style>


