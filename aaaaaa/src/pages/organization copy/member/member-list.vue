<template>
  <div id="member">
    <!-- 分組 -->
    <v-layout
      row
      wrap
      align-center
      fill-height
      class="mx-4 mt-4"
    >
      <v-flex
        md11
        xs12
      >
        <v-chip
          class="mr-2"
          @click=" filters.memberGroups = null;reloadTable()"
          :class="{'primarys': filters.memberGroups === null}"
        >
          <v-avatar
            class="primary"
            :class="{'darken-3': filters.memberGroups === null}"
          >{{totalDesserts}}
          </v-avatar>
          {{$t('cocShow.home.whole')}}
        </v-chip>
        <template v-for="item in memberGroups">
          <v-chip
            class="mr-2"
            @click="selectMember('remove',item.memberGroup.id,`chip${item.memberGroup.id}`)"
            :class="{'primarys': item.memberGroup.id === filters.memberGroups}"
            close
            @input="remove(item.memberGroup.id)"
          >
            <v-avatar
              class="primary"
              :class="{'darken-3': item.memberGroup.id === filters.memberGroups}"
            >{{item.memberCount}}
            </v-avatar>
            <v-btn
              color="primary darken-3"
              lat
              icon
              class="position"
              @click="selectMember('dialog3',item.memberGroup)"
              v-if="item.memberGroup.id === filters.memberGroups"
            >
              <v-icon
                small
                dark
              >edit
              </v-icon>
            </v-btn>
            {{item.memberGroup.name}}
          </v-chip>
        </template>
      </v-flex>
      <v-flex md1>
        <v-btn
          color="primary"
          @click="dialog3 = true,formsGroup = {}"
          outline
        >{{$t('chamber.btn.add_item')}}
        </v-btn>
      </v-flex>
    </v-layout>

    <!-- 過濾 -->
    <v-layout
      row
      wrap
      class="mx-4 mt-4"
    >
      <v-menu offset-y>
        <v-btn
          slot="activator"
          color="primary"
          outline
        >
          {{$t('global.batchOperation' )}}
          <v-icon>arrow_drop_down</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile @click="selectMember('dialog4')">
            <v-list-tile-title>{{$t('global.batchEdit')}}</v-list-tile-title>
          </v-list-tile>
          <v-list-tile @click="selectMember('dialog6')">
            <v-list-tile-title>{{$t('global.batchEditMembership')}}</v-list-tile-title>
          </v-list-tile>
          <v-list-tile @click="selectMember('dialog7')">
            <v-list-tile-title>{{$t('global.batchAllow')}}</v-list-tile-title>
          </v-list-tile>
          <v-list-tile @click="deletes()">
            <v-list-tile-title>{{$t('global.batchDelete')}}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
      <v-menu offset-y>
        <v-btn
          slot="activator"
          color="primary"
          outline
        >
          {{$t('global.addMember' )}}
          <v-icon>arrow_drop_down</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile @click="selectMember('dialog5')">
            <v-list-tile-title>{{$t('global.addMember')}}</v-list-tile-title>
          </v-list-tile>
          <v-list-tile :to="{path: `/organization/${$route.params.organizationId}/import`}">
            <v-list-tile-title>{{$t('global.batchImportMember')}}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>

      <v-flex
        xs12
        sm4
        md3
        class="ml-3 mr-3"
      >
        <vue-ctk-date-time-picker
          @input="inputhan(dates)"
          :locale="i18n"
          auto-close
          v-model="dates"
          range-mode
          overlay-background
          color="#2c7a90"
          enable-button-validate
          format="YYYY-MM-DD"
          formatted="YYYY-MM-DD"
          :label="$t('global.expiredAt')"
        ></vue-ctk-date-time-picker>
      </v-flex>
      <v-flex
        md3
        sm4
      >
        <v-text-field
          :label="$t('global.search_text')"
          v-model="filters.search"
          @keyup.enter="reloadTable()"
          append-icon="search"
          px3
          class="px3"
        ></v-text-field>
      </v-flex>
      <v-flex md1>
        <v-tooltip top>
          <v-btn
            flat
            icon
            slot="activator"
            color="purple darken-2"
            @click="refresh()"
          >
            <v-icon size="18">refresh</v-icon>
          </v-btn>
          <span>{{$t('button.reset')}}</span>
        </v-tooltip>
      </v-flex>
    </v-layout>

    <!-- 列表 -->
    <v-data-table
      hide-actions
      v-model="selected"
      :headers="headers"
      :no-data-text="$t('message.no_message')"
      :items="desserts"
      :loading="loading"
      :pagination.sync="pagination"
      :rows-per-page-items="limit"
      :total-items="totalDesserts"
      select-all
      item-key="id"
      class="rtable rtable--flip elevation-1"
    >
      <template
        slot="headers"
        slot-scope="props"
      >
        <tr>
          <th>
            <v-checkbox
              color="primary"
              :input-value="props.all"
              :label="$t('chamber.member.name')"
              :indeterminate="props.indeterminate"
              primary
              hide-details
              @click.native="toggleAll"
            ></v-checkbox>
          </th>
          <th
            class="text-xs-left"
            v-for="header in props.headers"
            :key="header.text"
            :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
            @click="changeSort(header.value)"
          >
            {{ $t(header.text) }}
            <v-icon small>arrow_upward</v-icon>
          </th>
        </tr>
      </template>
      <template
        slot="items"
        slot-scope="props"
      >
        <tr
          :active="props.selected"
          @click="props.selected = !props.selected"
        >
          <td>
            <v-checkbox
              v-if="props.item.joinType !== 'INVITATION'"
              :input-value="props.selected"
              color="primary"
              :name="props.item.name"
              :label="props.item.user.userProfile.name"
              primary
              hide-details
            ></v-checkbox>
            <v-checkbox
              v-else
              color="primary"
              :label="props.item.name"
              :input-value="props.selected"
              primary
              hide-details
            ></v-checkbox>
          </td>
          <td class="text-xs-left">
            <span
              class="success white--text caption px-1 "
              v-if="props.item.status === 'SUCCESS'"
            >{{$t('global.SUCCESS')}}</span>
            <span
              class="error white--text caption px-1 "
              v-if="props.item.status === 'REJECT'"
            >{{$t('user.title.invitation_state_situation.fail')}}</span>
            <span
              class="warning white--text caption px-1 "
              v-if="props.item.status === 'PENDING' && props.item.joinType !== 'INVITATION'"
            >{{$t('chamber.btn.audited' )}}</span>
            <span
              class="warning white--text caption px-1 "
              v-if="props.item.status === 'PENDING' && props.item.joinType === 'INVITATION'"
            >{{$t('global.n_active')}}</span>
          </td>
          <td class="text-xs-left">
            {{props.item.membership.name}}
            <v-btn
              depressed
              small
              style="min-width: 0;height: 20px;"
              color="success"
              class="caption"
              v-if="props.item.active"
            >{{$t('global.effect' )}}
            </v-btn>
            <v-btn
              depressed
              small
              style="min-width: 0;height: 20px;"
              color="error"
              class="caption my-0"
              v-else
              @click="selectMember('active',props.item.id)"
            >{{$t('global.invalid' )}}
            </v-btn>
          </td>
          <td class="text-xs-left">{{ props.item.memberPosition.title }}</td>
          <td class="text-xs-left">{{ props.item.number }}</td>
          <td class="text-xs-left">
            <span v-if="props.item.user !== null"> {{ props.item.user.userProfile.phone }}</span>
          </td>
          <td
            class="text-xs-left"
            style="width:15%;"
          >
            <span v-if="props.item.joinType === 'APPLIY'"> {{ props.item.user.email }}</span>
            <span v-if="props.item.joinType === 'INVITATION'"> {{ props.item.email }}</span>
          </td>
          <td class="text-xs-left">
            <span v-if="props.item.startAt !== null && props.item.expiredAt === null"> {{ $t('global.forever')}}</span>
            <span
              v-if="props.item.startAt !== null && props.item.expiredAt !== null"> {{ props.item.startAt}}</span> </br>
            <span v-if="props.item.expiredAt !== null"> {{ props.item.expiredAt}}</span>
          </td>
          <td class="text-xs-left">
            <v-tooltip top>
              <v-btn
                flat
                icon
                color="purple darken-2"
                slot="activator"
                @click="selectMember('assignment',props.item)"
              >
                <v-icon size="20">swap_horiz</v-icon>
              </v-btn>
              <span>{{$t('chamber.member.more_group')}}</span>
            </v-tooltip>
          </td>
          <td class="text-xs-center">
            <v-tooltip
              top
              v-if=" props.item.user !== null"
            >
              <v-btn
                flat
                icon
                color="primary"
                slot="activator"
                :to="{path: `/organization/${$route.params.organizationId}/member/${props.item.id}/detail`}"
              >
                <v-icon size="18">edit</v-icon>
              </v-btn>
              <span>{{$t('button.edit')}}</span>
            </v-tooltip>

            <v-tooltip top>
              <v-btn
                flat
                icon
                color="error"
                slot="activator"
                @click="selectMember('delete',props.item)"
              >
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

    <!-- 刪除模態框 dialog-->
    <v-layout
      row
      justify-center
    >
      <v-dialog
        v-model="dialog"

        max-width="290"
      >
        <v-card>
          <v-card-title class="headline">{{$t('global.deleteConfirmTitle')}}</v-card-title>
          <v-card-text>{{$t('global.deleteConfirmText')}}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="darken-1"
              flat
              @click.native="dialog = false"
            >{{$t('button.cancel')}}
            </v-btn>
            <v-btn
              color="primary darken-1"
              flat
              @click="deletes()"
            >{{$t('button.confirm')}}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>

    <!-- 確認是否啟用會員模態框 dialog1-->
    <v-layout
      row
      justify-center
    >
      <v-dialog
        v-model="dialog1"

        max-width="290"
      >
        <v-card>
          <v-card-text>{{$t('message.activieMember')}}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="darken-1"
              flat
              @click.native="dialog1 = false"
            >{{$t('button.cancel')}}
            </v-btn>
            <v-btn
              color="primary darken-1"
              flat
              @click="activateMember()"
            >{{$t('button.confirm')}}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>

    <!-- 移动分组模态框 dialog2-->
    <v-layout
      row
      justify-center
    >
      <v-dialog
        v-model="dialog2"
        scrollable
        max-width="300px"
      >
        <v-card>
          <v-card-title>{{$t('chamber.member.more_group')}}</v-card-title>
          <v-divider></v-divider>
          <v-card-text style="height: 300px;">
            <template v-for="item in memberGroups">
              <v-checkbox
                v-model="selectGroups"
                color="indigo"
                :label="item.memberGroup.name"
                :value="item.memberGroup.id"
              ></v-checkbox>
            </template>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn
              flat
              @click.native="dialog2 = false"
            >{{$t('button.cancel')}}
            </v-btn>
            <v-btn
              color="blue darken-1"
              flat
              @click.native="assignmentGroup()"
            >{{$t('button.save')}}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>

    <!-- 添加修改分組模態框 dialog3-->
    <v-layout
      row
      justify-center
    >
      <v-dialog
        v-model="dialog3"
        max-width="500px"
      >
        <v-card>
          <v-card-title>
            <span class="title">{{$t(title)}}</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-form
                ref="form"
                v-model="formGroup"
              >
                <v-layout
                  row
                  wrap
                >
                  <v-flex xs12>
                    <v-text-field
                      color="purple darken-2"
                      v-model="formsGroup.name"
                      maxlength="10"
                      :label="$t('chamber.member.ground_name')"
                      :rules="[rules.required]"
                      clearable
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="darken-1"
              flat
              @click.native="dialog3 = false"
            >{{$t('button.cancel')}}
            </v-btn>
            <v-btn
              color="primary darken-1"
              :disabled="!formGroup"
              :loading="isLoading"
              flat
              @click.native="onGroundSubmit()"
            >{{$t('button.save')}}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>

    <!-- 批量修改職務模態框  dialog4-->
    <v-layout
      row
      justify-center
    >
      <v-dialog
        v-model="dialog4"
        max-width="500px"
      >
        <v-card>
          <v-card-title>
            <span class="title">{{$t('global.member')}}</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-form
                ref="form"
                v-model="formGroup"
              >
                <v-layout
                  row
                  wrap
                >
                  <v-flex xs12>
                    <v-autocomplete
                      v-model="formsPosition.memberPositionId"
                      :no-data-text="$t('message.no_message')"
                      :items="positions"
                      :rules="[rules.required]"
                      color="purple darken-2"
                      :label="$t('global.select_memberShips')"
                      item-text="title"
                      item-value="id"
                    >
                      <template
                        slot="item"
                        slot-scope="data"
                      >
                        <template>
                          <v-list-tile-content>
                            <v-list-tile-title
                              color="#333"
                              v-html="data.item.title"
                            ></v-list-tile-title>
                          </v-list-tile-content>
                        </template>
                      </template>
                    </v-autocomplete>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="darken-1"
              flat
              @click.native="dialog4 = false"
            >{{$t('button.cancel')}}
            </v-btn>
            <v-btn
              color="primary darken-1"
              :disabled="!formGroup"
              :loading="isLoading"
              flat
              @click.native="onPositionSubmit()"
            >{{$t('button.save')}}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>

    <!-- 邀請成員模態框  dialog5-->
    <v-layout
      row
      justify-center
    >
      <v-dialog
        v-model="dialog5"
        max-width="500px"
      >
        <v-card>
          <v-card-title>
            <span class="title">{{$t('global.member')}}</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-form
                ref="form"
                v-model="formGroup"
              >
                <v-layout
                  row
                  wrap
                >
                  <v-flex xs12>
                    <v-text-field
                      color="purple darken-2"
                      v-model="formsInvitations.name"
                      maxlength="10"
                      :label="$t('chamber.payment.orderName')"
                      :rules="[rules.required]"
                      clearable
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field
                      color="purple darken-2"
                      v-model="formsInvitations.introducer"
                      maxlength="10"
                      :label="$t('chamber.member.introducer')"
                      clearable
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field
                      color="purple darken-2"
                      v-model="formsInvitations.email"
                      :label="$t('chamber.placeholder.member.email')"
                      :rules="[rules.required,rules.email]"
                      clearable
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-select
                      color="purple darken-2"
                      v-model="selectPosition"
                      :items="positions"
                      item-text="title"
                      item-value="id"
                      :label="$t('chamber.left.position')"
                      :rules="[rules.required]"
                      persistent-hint
                      single-line
                    ></v-select>
                  </v-flex>
                  <v-flex xs12>
                    <v-select
                      color="purple darken-2"
                      v-model="selectMemberships"
                      :items="memberships"
                      item-text="name"
                      item-value="id"
                      :label="$t('global.examine_memberShips')"
                      :rules="[rules.required]"
                      persistent-hint
                      single-line
                    ></v-select>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="darken-1"
              flat
              @click.native="dialog5 = false"
            >{{$t('button.cancel')}}
            </v-btn>
            <v-btn
              color="primary darken-1"
              :disabled="!formGroup"
              :loading="isLoading"
              flat
              @click.native="onSubmitInvitations()"
            >{{$t('button.save')}}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>

    <!-- 批量修改會籍模態框  dialog6-->
    <v-layout
      row
      justify-center
    >
      <v-dialog
        v-model="dialog6"

        max-width="500px"
      >
        <v-card>
          <v-card-title>
            <span class="title">{{$t('global.member')}}</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-form
                ref="form"
                v-model="formShip"
              >
                <v-layout
                  row
                  wrap
                >
                  <v-flex xs12>
                    <v-autocomplete
                      v-model="membershipId"
                      :items="memberships"
                      :rules="[rules.required]"
                      color="purple darken-2"
                      :label="$t('global.select_memberShips')"
                      item-text="name"
                      item-value="id"
                    >
                      <template
                        slot="item"
                        slot-scope="data"
                      >
                        <template>
                          <v-list-tile-content>
                            <v-list-tile-title
                              color="#333"
                              v-html="data.item.name"
                            ></v-list-tile-title>
                          </v-list-tile-content>
                        </template>
                      </template>
                    </v-autocomplete>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="darken-1"
              flat
              @click.native="dialog6 = false"
            >{{$t('button.cancel')}}
            </v-btn>
            <v-btn
              color="primary darken-1"
              :disabled="!formShip"
              :loading="isLoading"
              flat
              @click.native="onMemberShipSubmit()"
            >{{$t('button.save')}}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>

    <!-- 批量審核模態框  dialog7-->
    <v-layout
      row
      justify-center
    >
      <v-dialog
        v-model="dialog7"

        max-width="500px"
      >
        <v-card>
          <v-card-title>
            <span class="title">{{$t('global.member')}}</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-form
                ref="form"
                v-model="formStatus"
              >
                <v-layout
                  row
                  wrap
                >
                  <v-flex xs12>
                    <v-autocomplete
                      v-model="statusId"
                      :items="[{id: 'SUCCESS',name: $t('chamber.btn.adopt')},{id: 'REJECT',name: $t('chamber.btn.refuse')}]"
                      :rules="[rules.required]"
                      color="purple darken-2"
                      :label="$t('global.memberStatus')"
                      item-text="name"
                      item-value="id"
                    >
                      <template
                        slot="item"
                        slot-scope="data"
                      >
                        <template>
                          <v-list-tile-content>
                            <v-list-tile-title
                              color="#333"
                              v-html="data.item.name"
                            ></v-list-tile-title>
                          </v-list-tile-content>
                        </template>
                      </template>
                    </v-autocomplete>
                  </v-flex>
                  <v-flex
                    xs12
                    v-if="statusId === 'REJECT'"
                  >
                    <v-textarea
                      counter="3000"
                      color="purple darken-2"
                      :label="$t('chamber.know.content')"
                      :rules="[rules.required]"
                      v-model="remark"
                    ></v-textarea>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="darken-1"
              flat
              @click.native="dialog7 = false"
            >{{$t('button.cancel')}}
            </v-btn>
            <v-btn
              color="primary darken-1"
              :disabled="!formStatus"
              :loading="isLoading"
              flat
              @click.native="onStatusSubmit()"
            >{{$t('button.save')}}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>

  </div>
</template>
<style lang="scss">
  .ctk-date-time-picker .field .field-input {
    border: none !important;
    border-bottom: 1px solid rgba(0, 0, 0, 0.42) !important;
    height: 48px !important;
    border-radius: 0 !important;
  }

  table.v-table thead th:not(:first-child),
  table.v-table tbody td:not(:first-child) {
    padding: 0 4px !important;
  }

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
  import {mapMutations} from "vuex";

  export default {
    data() {
      return {
        pagination: {
          sortBy: "number",
          sortBy: "expiredAt"
        },
        selectPosition: null,
        selectMemberships: null,
        i18n: localStorage.getItem("i18n") === "EN" ? "en-us" : "zh-cn",
        all: false,
        dates: null,
        dates: null,
        menu: false,
        selectActivateMemberId: null,
        membershipId: null,
        positionId: null,
        statusId: null,
        remark: null,
        dialog: false,
        dialog1: false,
        dialog3: false,
        dialog4: false,
        dialog5: false,
        dialog6: false,
        dialog7: false,
        isLoading: false,
        formGroup: false,
        formShip: true,
        formStatus: true,
        chip1: [],
        dialog2: false,
        loading: false,
        title: "chamber.btn.add_item",
        limit: [10],
        totalPages: 0,
        totalDesserts: 0,
        selected: [],
        selectGroups: [],
        memberGroups: [],
        positions: [],
        memberships: [],
        filters: {
          search: null,
          memberGroups: null,
          "organization.id": this.$route.params.organizationId,
          page: 0,
          size: 9
        },
        formsGroup: {
          name: null,
          isActive: true,
          "organization.id": this.$route.params.organizationId,
          isDefault: false
        },
        formsPosition: {
          memberIds: null,
          organizationId: this.$route.params.organizationId,
          memberPositionId: null
        },
        formsInvitations: {
          name: null,
          introducer: null,
          "organization.id": this.$route.params.organizationId,
          email: null,
          statement1: true,
          statement2: true,
          statement3: true,
          isPay: false,
          role: "enterprise",
          status: "PENDING",
          joinType: "INVITATION",
          active: false
        },
        headers: [
          {
            text: "chamber.member.status",
            value: "status",
            sortable: false
          },
          {
            text: "chamber.member.post",
            value: "name",
            sortable: false
          },
          {
            text: "chamber.member.position",
            value: "position",
            sortable: false
          },
          {
            text: "chamber.member.number",
            value: "number",
            sortable: true
          },
          {
            text: "chamber.member.phone",
            value: "phone",
            sortable: true
          },
          {
            text: "chamber.member.email",
            value: "email",
            sortable: false
          },
          {
            text: "chamber.member.position_end_time",
            value: "expiredAt"
          },
          {
            text: "chamber.member.more_group",
            value: "group",
            sortable: false
          },
          {
            text: "chamber.member.operation",
            value: "operation",
            sortable: false
          }
        ],
        desserts: [],
        rules: {
          required: v => !!v || this.$t("validation.required"),
          email: v => (v || "").match(/@/) || this.$t("validation.email")
        }
      };
    },
    watch: {
      pagination: {
        handler() {
          const sortBy = this.pagination.sortBy;
          this.desserts = this.desserts.sort((a, b) => {
            const sortA = a[sortBy];
            const sortB = b[sortBy];
            if (this.pagination.descending) {
              if (sortA < sortB) return 1;
              if (sortA > sortB) return -1;
              return 0;
            } else {
              if (sortA < sortB) return -1;
              if (sortA > sortB) return 1;
              return 0;
            }
          });
        },
        deep: true
      }
    },
    mounted() {
      this.filters.page =
        this.$route.query.page !== undefined
          ? Number(this.$route.query.page) - 1
          : 0
      this.reloadTable();
      this.reloadMemberGroups();
    },
    methods: {
      ...mapMutations(["snackbarStateChange"]),
      toggleAll() {
        if (this.selected.length) this.selected = [];
        else this.selected = this.desserts.slice();
      },
      changeSort(column) {
        if (this.pagination.sortBy === column) {
          this.pagination.descending = !this.pagination.descending;
        } else {
          this.pagination.sortBy = column;
          this.pagination.descending = false;
        }
      },
      refresh() {
        this.filters.search = null;
        this.dates = null;
        delete this.filters.memberGroups;
        delete this.filters["startTime"];
        delete this.filters["endTime"];
        this.reloadTable();
      },
      //獲取member列表
      reloadTable() {
        this.loading = true;
        if (this.filters.search === null) {
          delete this.filters.search;
        }
        this.$http
          .get("manager/members", {
            params: this.filters,
            headers: {
              'X-TENANT-ID': this.$route.params.organizationId
            }
          })
          .then(res => {
            this.desserts = res.data.content;
            this.totalPages = res.data.totalPages;
            this.totalDesserts = res.data.totalElements;
            this.loading = false;
          });
      },
      //獲取会员分组列表
      reloadMemberGroups() {
        this.$http
          .get("manager/member_groups", {
            params: {
              "organization.id": this.$route.params.organizationId
            },
            headers: {
              'X-TENANT-ID': this.$route.params.organizationId
            }
          })
          .then(res => {
            this.memberGroups = res.data;
          });
      },
      //獲取職務
      reloadPositions() {
        this.$http
          .get("manager/member_positions", {
            params: {
              "organization.id": this.$route.params.organizationId,
              isDefault: false
            },
            headers: {
              'X-TENANT-ID': this.$route.params.organizationId
            }
          })
          .then(res => {
            this.positions = res.data.content;
          });
      },
      //獲取會籍
      reloadMemberships() {
        this.$http
          .get("manager/memberships", {
            params: {
              "organization.id": this.$route.params.organizationId,
              isDefault: false
            },
            headers: {
              'X-TENANT-ID': this.$route.params.organizationId
            }
          })
          .then(res => {
            this.memberships = res.data.content;
          });
      },
      //选择模态框
      selectMember(type, id, ref) {
        switch (type) {
          case "active":
            this.dialog1 = true;
            this.selectActivateMemberId = id;
            break;
          case "assignment":
            this.dialog2 = true;
            this.selectActivateMemberId = id.id;
            this.selectGroups =
              id.memberGroups.length > 0
                ? id.memberGroups.map(item => {
                  return item.id;
                })
                : [];
            break;
          case "delete":
            this.dialog = true;
            break;
          case "remove":
            this.filters.memberGroups = id;
            this.reloadTable();
            break;
          case "dialog3":
            this.dialog3 = true;
            if (id !== undefined) {
              this.formsGroup = id;
            }
            break;
          case "dialog4":
            this.dialog4 = true;
            if (this.positions.length === 0) {
              this.reloadPositions();
            }
            break;
          case "dialog5":
            this.dialog5 = true;
            if (this.positions.length === 0) {
              this.reloadPositions();
            }
            if (this.memberships.length === 0) {
              this.reloadMemberships();
            }
            break;
          case "dialog6":
            this.dialog6 = true;
            if (this.memberships.length === 0) {
              this.reloadMemberships();
            }
            break;
          case "dialog7":
            if (this.selected.length > 0) {
              let i = this.selected.findIndex(val => {
                return val.joinType === "INVITATION";
              });
              if (i >= 0) {
                this.snackbarStateChange({
                  color: "error",
                  text: "不能審核邀請會員",
                  snackbar: true
                });
                return;
              } else {
                let index = this.selected.findIndex(val => {
                  return val.status === "PENDING";
                });
                if (index === -1) {
                  this.snackbarStateChange({
                    color: "error",
                    text: "不能重複審核會員",
                    snackbar: true
                  });
                  return;
                } else {
                  this.dialog7 = true;
                }
              }
            } else {
              this.snackbarStateChange({
                color: "warning",
                text: this.$t("message.editMember"),
                snackbar: true
              });
            }

            break;
        }
      },
      //啟用會員
      activateMember() {
        this.loading = true;
        this.$http
          .put(
            "manager/members/activate_member",
            this.$serialize({
              organizationId: this.$route.params.organizationId,
              memberId: this.selectActivateMemberId
            }),
            {
              headers: {
                'X-TENANT-ID': this.$route.params.organizationId
              }
            }
          )
          .then(res => {
            this.snackbarStateChange({
              color: "success",
              text: this.$t(`message.update_message`),
              snackbar: true
            });
            this.reloadTable();
            this.dialog1 = false;
            this.loading = false;
            this.selectActivateMemberId = null;
          })
          .catch(error => {
            this.loading = false;
            this.snackbarStateChange({
              color: "error",
              text: error.data.message,
              snackbar: true
            });
          });
      },
      //移動分組
      assignmentGroup() {
        this.loading = true;
        let params = new URLSearchParams();
        params.append(`memberGroupIds`, this.selectGroups.join(","));
        params.append("memberId", this.selectActivateMemberId);
        params.append("organizationId", this.$route.params.organizationId);
        this.$http
          .put("manager/member_groups", params, {
            headers: {
              'X-TENANT-ID': this.$route.params.organizationId
            }
          })
          .then(res => {
            this.snackbarStateChange({
              color: "success",
              text: this.$t(`message.update_message`),
              snackbar: true
            });
            this.reloadMemberGroups();
            this.reloadTable();
            this.dialog2 = false;
            this.loading = false;
            this.selectActivateMemberId = null;
          })
          .catch(error => {
            this.loading = false;
            this.snackbarStateChange({
              color: "error",
              text: error.data.message,
              snackbar: true
            });
          });
      },
      // 删除会员
      deletes() {
        if (this.selected.length > 0) {
          let arr = this.selected.map(item => {
            return item.id;
          });
          this.$http
            .delete(`manager/members/batch_delete/${arr.join(",")}`, {
              headers: {
                'X-TENANT-ID': this.$route.params.organizationId
              }
            })
            .then(res => {
              this.snackbarStateChange({
                color: "success",
                text: this.$t("message.delete_success"),
                snackbar: true
              });
              this.dialog = false;
              this.selected = [];
              this.reloadTable();
            })
            .catch(error => {
              this.snackbarStateChange({
                color: "error",
                text: error.data.message,
                snackbar: true
              });
            });
        } else {
          this.snackbarStateChange({
            color: "warning",
            text: this.$t("message.deleteMember"),
            snackbar: true
          });
        }
      },
      // 刪除分組
      remove(id) {
        this.$http
          .delete(`manager/member_groups/${id}`, {
            headers: {
              'X-TENANT-ID': this.$route.params.organizationId
            }
          })
          .then(res => {
            this.snackbarStateChange({
              color: "success",
              text: this.$t("message.delete_success"),
              snackbar: true
            });
            this.reloadMemberGroups();
          })
          .catch(error => {
            this.snackbarStateChange({
              color: "error",
              text: error.data.message,
              snackbar: true
            });
          });
      },
      //添加修改分組
      onGroundSubmit() {
        this.isLoading = true;
        let message;
        if (this.formsGroup.id === undefined) {
          this.formsGroup["organization.id"] = this.$route.params.organizationId;
          message = "store_message";
        } else {
          delete this.formsGroup.lastModifiedAt;
          delete this.formsGroup.createdAt;
          delete this.formsGroup.position;
          this.formsGroup["organization.id"] = this.$route.params.organizationId;
          message = "update_message";
        }
        this.$http
          .post("manager/member_groups", this.$serialize(this.formsGroup), {
            headers: {
              'X-TENANT-ID': this.$route.params.organizationId
            }
          })
          .then(res => {
            this.snackbarStateChange({
              color: "success",
              text: this.$t(`message.${message}`),
              snackbar: true
            });
            this.reloadMemberGroups();
            this.dialog3 = false;
            this.isLoading = false;
          })
          .catch(error => {
            this.isLoading = false;
            this.snackbarStateChange({
              color: "error",
              text: error.data.message,
              snackbar: true
            });
          });
      },
      //批量修改職務
      onPositionSubmit() {
        if (this.selected.length > 0) {
          let arr = this.selected.map(item => {
            return item.id;
          });
          this.formsPosition.memberIds = arr.join(",");
          this.isLoading = true;
          this.$http
            .put("manager/members/batch_update", this.$serialize(this.formsPosition), {
              headers: {
                'X-TENANT-ID': this.$route.params.organizationId
              }
            })
            .then(res => {
              this.snackbarStateChange({
                color: "success",
                text: this.$t(`message.update_message`),
                snackbar: true
              });
              this.reloadTable();
              this.dialog4 = false;
              this.isLoading = false;
            })
            .catch(error => {
              this.isLoading = false;
              this.snackbarStateChange({
                color: "error",
                text: error.data.message,
                snackbar: true
              });
            });
        } else {
          this.snackbarStateChange({
            color: "warning",
            text: this.$t("message.deleteMember"),
            snackbar: true
          });
        }
      },
      //批量修改會籍
      onMemberShipSubmit() {
        if (this.selected.length > 0) {
          let arr = this.selected.map(item => {
            return item.id;
          });

          this.isLoading = true;
          this.$http
            .put(
              "manager/members/batch_update_membership",
              this.$serialize({
                memberIds: arr.join(","),
                organizationId: this.$route.params.organizationId,
                membershipId: this.membershipId
              }),
              {
                headers: {
                  'X-TENANT-ID': this.$route.params.organizationId
                }
              }
            )
            .then(res => {
              this.snackbarStateChange({
                color: "success",
                text: this.$t(`message.update_message`),
                snackbar: true
              });
              this.reloadTable();
              this.dialog6 = false;
              this.isLoading = false;
            })
            .catch(error => {
              this.isLoading = false;
              this.snackbarStateChange({
                color: "error",
                text: error.data.message,
                snackbar: true
              });
            });
        } else {
          this.snackbarStateChange({
            color: "warning",
            text: this.$t("message.deleteMember"),
            snackbar: true
          });
        }
      },
      //批量審核
      onStatusSubmit() {
        if (this.selected.length > 0) {
          let arr = this.selected.map(item => {
            return item.id;
          });
          let obj = {
            memberIds: arr.join(","),
            organizationId: this.$route.params.organizationId,
            active: false,
            isPay: false,
            joinType: "APPLIY",
            role: "enterprise",
            status: this.statusId
          };
          if (this.membershipId !== null) {
            obj["membershipId"] = this.membershipId;
          }
          if (this.remark !== null) {
            obj["remark"] = this.remark;
          }
          this.isLoading = true;
          this.$http
            .put("manager/members/batch_allow", this.$serialize(obj), {
              headers: {
                'X-TENANT-ID': this.$route.params.organizationId
              }
            })
            .then(res => {
              this.snackbarStateChange({
                color: "success",
                text: this.$t(`message.update_message`),
                snackbar: true
              });
              this.reloadTable();
              this.dialog7 = false;
              this.isLoading = false;
            })
            .catch(error => {
              this.isLoading = false;
              this.snackbarStateChange({
                color: "error",
                text: error.data.message,
                snackbar: true
              });
            });
        } else {
          this.snackbarStateChange({
            color: "warning",
            text: this.$t("message.deleteMember"),
            snackbar: true
          });
        }
      },
      // 邀請成員
      onSubmitInvitations() {
        if (this.formsInvitations.introducer === null) {
          delete this.formsInvitations.introducer;
        }
        this.isLoading = true;
        this.formsInvitations["memberPosition.id"] = this.selectPosition;
        this.formsInvitations["membership.id"] = this.selectMemberships;
        this.$http
          .post("manager/members", this.$serialize(this.formsInvitations), {
            headers: {
              'X-TENANT-ID': this.$route.params.organizationId
            }
          })
          .then(res => {
            this.snackbarStateChange({
              color: "success",
              text: this.$t(`message.update_message`),
              snackbar: true
            });
            this.reloadTable();
            this.formsInvitations = {
              name: null,
              introducer: null,
              "organization.id": this.$route.params.organizationId,
              email: null,
              statement1: true,
              statement2: true,
              statement3: true,
              isPay: false,
              role: "enterprise",
              status: "PENDING",
              joinType: "INVITATION",
              active: false
            };
            this.selectPosition = null;
            this.selectMemberships = null;
            this.dialog5 = false;
            this.isLoading = false;
          })
          .catch(error => {
            this.isLoading = false;
            this.snackbarStateChange({
              color: "error",
              text: error.data.message,
              snackbar: true
            });
          });
      },
      inputhan(date) {
        if (date.end !== null) {
          this.filters["startTime"] = date.start;
          this.filters["endTime"] = date.end;
          this.reloadTable();
        }
      },
      handleInput(value) {
        this.pagination.page = value
        this.$router.push({
          path: `/organization/${this.$route.params.organizationId}/member_list`,
          query: {
            page: value
          }
        })
        this.filters.page = value - 1
        this.reloadTable()
      },
    }
  };
</script>
