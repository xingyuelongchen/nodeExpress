<template>
  <div>
    <v-layout row wrap align-center fill-height class="mx-4 mt-2">
      <v-flex md3 sm6>
        <v-text-field
          :label="$t('global.search_text')"
          v-model="filters.search"
          @keyup.enter="reloadTable()"
          prepend-icon="search"
          px3
          class="px3"
        ></v-text-field>
      </v-flex>
      <v-flex md1 sm2 offset-sm4 offset-md8>
        <v-btn color="primary" @click="openDialog()">{{$t('chamber.btn.add_notice')}}</v-btn>
      </v-flex>
    </v-layout>
    <v-data-table
      hide-actions
      :headers="headers"
      :items="desserts"
      :no-data-text="$t('message.no_message')"
      :pagination.sync="pagination"
      :rows-per-page-items="limit"
      :total-items="totalDesserts"
      :loading="loading"
      class="rtable rtable--flip elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td>
          <router-link
            :to="{path: '/company/notice-detail',query:{id:props.item.organization.id,noticeId:props.item.id}}"
            target="_blank"
          >{{ props.item.title }}</router-link>
        </td>
        <td class="text-xs-left">{{ props.item.organization.name}}</td>
        <td class="text-xs-left">{{ props.item.createdAt | time }}</td>
        <td class="text-xs-left">{{ props.item.lastModifiedAt | time }}</td>
        <td class="text-xs-center">
          <v-tooltip top>
            <v-btn
              :loading="replayLoading"
              flat
              icon
              color="purple darken-2"
              slot="activator"
              @click="replay(props.item.id)"
            >
              <v-icon size="18">replay</v-icon>
            </v-btn>
            <span>{{$t('button.replay')}}</span>
          </v-tooltip>
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

    <!-- 添加修改模態框 -->
    <v-layout row justify-center>
      <v-dialog v-model="dialog1" max-width="800px">
        <v-card>
          <v-card-title>
            <span class="title">{{$t(title)}}</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-form ref="form" v-model="form">
                <v-layout row wrap>
                  <v-flex xs12>
                    <v-text-field
                      color="purple darken-2"
                      v-model="forms.title"
                      :label="$t('chamber.know.title')"
                      :rules="[rules.required]"
                      clearable
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12>
                    <div class="grey--text">{{$t('chamber.know.jurisdiction')}}</div>
                    <v-radio-group v-model="forms.browseRight" :rules="[rules.required]" row>
                      <v-radio :label="$t('global.true_public')" color="primary" value="PUBLIC"></v-radio>
                      <v-radio
                        :label="$t('global.false_public')"
                        color="purple darken-2"
                        value="PRIVATE"
                      ></v-radio>
                      <v-radio :label="$t('global.APPOINT')" color="red" value="APPOINT"></v-radio>
                    </v-radio-group>
                  </v-flex>

                  <v-flex xs12 v-if="forms.browseRight === 'APPOINT'">
                    <v-flex xs12 class="px-0">
                      <v-flex xs12 class="px-0">
                        <v-autocomplete
                          v-model="friends1"
                          :disabled="isUpdating"
                          :items="memberships"
                          :rules="[rules.required]"
                          :no-data-text="$t('message.no_message')"
                          box
                          chips
                          color="primary"
                          :label="$t('global.select_memberShips')"
                          item-text="name"
                          item-value="id"
                          multiple
                        >
                          <template slot="selection" color="purple darken-2" slot-scope="data1">
                            <v-chip
                              :selected="data1.selected"
                              close
                              class="chip--select-multi"
                              @input="removeMemberships(data1.item.id)"
                            >
                              <v-avatar
                                class="primary white--text"
                              >{{ data1.item.name.slice(0, 1).toUpperCase() }}</v-avatar>
                              {{ data1.item.name }}
                            </v-chip>
                          </template>
                          <template slot="item" slot-scope="data1">
                            <template>
                              <v-list-tile-content>
                                <v-list-tile-title color="#333" v-html="data1.item.name"></v-list-tile-title>
                              </v-list-tile-content>
                            </template>
                          </template>
                        </v-autocomplete>
                      </v-flex>
                    </v-flex>
                  </v-flex>

                  <v-flex xs12 v-if="forms.browseRight === 'APPOINT'">
                    <v-flex xs12 class="px-0">
                      <v-flex xs12 class="px-0">
                        <v-autocomplete
                          v-model="friends"
                          :disabled="isUpdating"
                          :items="memberGroups"
                          :rules="[rules.required]"
                          :no-data-text="$t('message.no_message')"
                          :hint="$t('global.groups_text')"
                          box
                          chips
                          color="purple darken-2"
                          :label="$t('chamber.member.select_item')"
                          item-text="name"
                          item-value="id"
                          multiple
                        >
                          <template slot="selection" color="purple darken-2" slot-scope="data">
                            <v-chip
                              :selected="data.selected"
                              close
                              class="chip--select-multi"
                              @input="remove(data.item.id)"
                            >
                              <v-avatar
                                class="purple white--text"
                              >{{ data.item.name.slice(0, 1).toUpperCase() }}</v-avatar>
                              {{ data.item.name }}
                            </v-chip>
                          </template>
                          <template slot="item" slot-scope="data">
                            <template>
                              <v-list-tile-content>
                                <v-list-tile-title color="#333" v-html="data.item.name"></v-list-tile-title>
                              </v-list-tile-content>
                            </template>
                          </template>
                        </v-autocomplete>
                        <p class="error--text caption">{{$t('global.groups_text')}}</p>
                      </v-flex>
                    </v-flex>
                  </v-flex>
                  <v-flex xs12 class="text-xs-left">
                    <p>{{$t('chamber.know.content')}}</p>
                    <quill-editor
                      ref="myTextEditor"
                      :rules="[rules.required]"
                      v-model="forms.content"
                      :options="editorOption"
                    ></quill-editor>
                  </v-flex>

                  <v-flex xs12>
                    <v-checkbox
                      color="purple darken-2"
                      :label="$t('global.isSendEmail')"
                      v-model="forms.isSendEmail"
                    ></v-checkbox>
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
              @click.native="dialog1 = false;forms={}"
            >{{$t('button.cancel')}}</v-btn>
            <v-btn
              color="primary darken-1"
              :disabled="!form || !forms.content"
              :loading="isLoading"
              flat
              @click.native="onSubmit()"
            >{{$t('button.save')}}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </div>
</template>
<script>
import { mapMutations } from "vuex";
import { error } from "util";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";

export default {
  components: {
    quillEditor
  },
  data() {
    return {
      isUpdating: false,
      memberGroups: [],
      memberships: [],
      friends: [],
      friends1: [],
      loading: true,
      dialog: false,
      dialog1: false,
      replayLoading: false,
      form: false,
      isLoading: false,
      snackbarText: null,
      snackbar: false,
      itemId: null,
      title: "chamber.btn.add_notice",
      filters: {
        search: null,
        "organization.id": this.$route.params.organizationId,
        isDefault: false,
        page: 0,
        size: 9
      },
      editorOption: {
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ size: ["small", false, "large", "huge"] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ font: [] }],
            [{ color: [] }, { background: [] }],
            ["link", "image"]
          ],
          syntax: {
            highlight: text => hljs.highlightAuto(text).value
          }
        },
        placeholder: this.$t("chamber.know.content")
      },
      forms: {
        content: null,
        membershipIds: null,
        memberGroupIds: null,
        publishAt: null,
        isSendEmail: false,
        browseRight: null,
        title: null
      },
      i: { ...this.forms },
      totalDesserts: 0,
      totalPages: 0,
      pagination: {
        sortBy: "createdAt",
        sortBy: "lastModifiedAt"
      },
      rules: {
        required: v => !!v || this.$t("validation.required")
      },
      limit: [9],
      headers: [
        {
          text: this.$t("chamber.know.title"),
          align: "left",
          sortable: false,
          value: "title"
        },
        {
          text: this.$t("chamber.know.coc"),
          value: "coc",
          sortable: false
        },
        {
          text: this.$t("cocShow.news.release_time"),
          value: "createdAt"
        },
        {
          text: this.$t("chamber.know.update_time"),
          value: "lastModifiedAt"
        },
        {
          text: this.$t("chamber.know.operation"),
          value: "operation",
          sortable: false
        }
      ],
      desserts: []
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
        : 0;
    this.reloadTable();
  },
  methods: {
    ...mapMutations(["snackbarStateChange"]),
    reloadTable() {
      this.loading = true;
      if (this.filters.search === null) {
        delete this.filters.search;
      }
      this.$http
        .get(
          `manager/organizations/${this.$route.params.organizationId}/announcements`,
          {
            params: this.filters,
            headers: {
              "X-TENANT-ID": this.$route.params.organizationId
            }
          }
        )
        .then(res => {
          this.desserts = res.data.content;
          this.totalDesserts = res.data.totalElements;
          this.totalPages = res.data.totalPages;
          this.loading = false;
        });
    },
    reloadGroups() {
      this.$http
        .get("manager/member_groups", {
          params: {
            "organization.id": this.$route.params.organizationId,
            isDefault: false,
            page: 0,
            size: 3
          },
          headers: {
            "X-TENANT-ID": this.$route.params.organizationId
          }
        })
        .then(res => {
          this.memberGroups = res.data.map(val => {
            return val.memberGroup;
          });
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
            "X-TENANT-ID": this.$route.params.organizationId
          }
        })
        .then(res => {
          this.memberships = res.data.content;
        });
    },
    change(id) {
      this.dialog = true;
      this.itemId = id;
    },
    deletes() {
      this.$http
        .delete(
          `manager/organizations/${this.$route.params.organizationId}/announcements/${this.itemId}`,
          {
            headers: {
              "X-TENANT-ID": this.$route.params.organizationId
            }
          }
        )
        .then(res => {
          this.snackbarStateChange({
            color: "success",
            text: this.$t("message.delete_success"),
            snackbar: true
          });
          this.dialog = false;
          this.reloadTable();
        })
        .catch(error => {
          this.snackbarStateChange({
            color: "error",
            text: error.data.message,
            snackbar: true
          });
        });
    },
    replay(id) {
      this.replayLoading = true;
      this.$http
        .post(
          `manager/organizations/${this.$route.params.organizationId}/announcements/resendEmail`,
          this.$serialize({ announcementId: id }),
          {
            headers: {
              "X-TENANT-ID": this.$route.params.organizationId
            }
          }
        )
        .then(res => {
          this.snackbarStateChange({
            color: "success",
            text: this.$t("message.update_message"),
            snackbar: true
          });
          this.replayLoading = false;
        })
        .catch(error => {
          this.replayLoading = false;
          this.snackbarStateChange({
            color: "error",
            text: error.data.message,
            snackbar: true
          });
        });
    },
    async onSubmit() {
      this.isLoading = true;
      this.forms["organization.id"] = this.$route.params.organizationId;
      let message;
      if (this.forms.id === undefined) {
        message = "store_message";
        this.forms.publishAt = this.$moment(new Date());
      } else {
        delete this.forms.lastModifiedAt;
        delete this.forms.createdAt;
        delete this.forms.organization;
        delete this.forms.memberships;
        delete this.forms.memberGroups;
        message = "update_message";
      }
      if (this.friends.length > 0 && this.forms.browseRight === "APPOINT") {
        this.forms.memberGroupIds = this.friends.join(",");
      } else {
        delete this.forms.memberGroupIds;
        this.friends = [];
      }
      if (this.friends1.length > 0 && this.forms.browseRight === "APPOINT") {
        this.forms.membershipIds = this.friends1.join(",");
      } else {
        delete this.forms.membershipIds;
        this.friends1 = [];
      }
      await this.$http
        .post(
          `manager/organizations/${this.$route.params.organizationId}/announcements`,
          this.$serialize(this.forms),
          {
            headers: {
              "X-TENANT-ID": this.$route.params.organizationId
            }
          }
        )
        .then(res => {
          this.snackbarStateChange({
            color: "success",
            text: this.$t(`message.${message}`),
            snackbar: true
          });
          this.reloadTable();
          this.friends = [];
          this.friends1 = [];
          this.dialog1 = false;
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
    openDialog() {
      this.dialog1 = true;
      if (this.memberGroups.length === 0) {
        this.reloadGroups();
      }
      if (this.memberships.length === 0) {
        this.reloadMemberships();
      }
      this.title = "chamber.btn.add_notice";
      this.forms = {};
    },
    edieDialog(data) {
      this.forms = data;
      if (this.forms.memberGroups) {
        this.friends = this.forms.memberGroups.map(val => {
          return val.id;
        });
      }
      if (this.forms.memberships) {
        this.friends1 = this.forms.memberships.map(val => {
          return val.id;
        });
      }
      this.dialog1 = true;
      this.title = "chamber.btn.edit_notice";
      if (this.memberGroups.length === 0) {
        this.reloadGroups();
      }
      if (this.memberships.length === 0) {
        this.reloadMemberships();
      }
    },
    remove(item) {
      let index = this.friends.findIndex(o => {
        return o === item;
      });
      if (index >= 0) this.friends.splice(index, 1);
    },

    removeMemberships(item) {
      const index = this.friends1.findIndex(o => {
        return o === item;
      });
      if (index >= 0) this.friends1.splice(index, 1);
    },
    handleInput(value) {
      this.pagination.page = value;
      this.$router.push({
        path: `/organization/${this.$route.params.organizationId}/announcements`,
        query: {
          page: value
        }
      });
      this.filters.page = value - 1;
      this.reloadTable();
    }
  }
};
</script>

