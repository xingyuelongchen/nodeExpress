<template>
  <v-stepper v-model="e1">
    <v-stepper-header>
      <v-stepper-step :complete="e1 > 1" step="1">{{$t('chamber.left.smtpSetting')}} 1</v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step :complete="e1 > 2" step="2">{{$t('chamber.left.email')}} 2</v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step step="3">{{$t('message.store_message')}} 3</v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1">
        <v-form ref="form" v-model="form">
          <v-container grid-list-xl text-xs-center>
            <v-layout row wrap>
              <v-flex xl6 md8 offset-xl3 offset-md2 xs12>
                <v-flex xs12>
                  <v-text-field color="purple darken-2" v-model="formSetting.fromName" :rules="[rules.required]"
                                :label="$t('chamber.member.from_name')" clearable></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field color="purple darken-2" v-model="formSetting.fromEmail"
                                :rules="[rules.required,rules.email]" :label="$t('chamber.member.from_email')"
                                clearable></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field color="purple darken-2" v-model="formSetting.host" :rules="[rules.required]"
                                :label="$t('chamber.member.host')" clearable></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field color="purple darken-2" v-model="formSetting.port" :rules="[rules.required]"
                                :label="$t('chamber.member.port')" clearable></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field color="purple darken-2" v-model="formSetting.username" :rules="[rules.required]"
                                :label="$t('chamber.member.username')" clearable></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field color="purple darken-2" v-model="formSetting.password"
                                :append-icon="show1 ? 'visibility_off' : 'visibility'" type="password"
                                :rules="[rules.required]" :label="$t('chamber.member.password')"
                                :type="show1 ? 'text' : 'password'" counter
                                @click:append="show1 = !show1"></v-text-field>
                </v-flex>
                <v-spacer></v-spacer>
                <v-btn color="primary darken-1" :disabled="!form" :loading="isLoading" flat
                       @click.native="onSubmitSetting()">{{$t('button.save')}}
                </v-btn>
              </v-flex>
            </v-layout>
            </v-card>
          </v-container>
        </v-form>

      </v-stepper-content>

      <v-stepper-content step="2">
        <v-form ref="form" v-model="form1">
          <v-container grid-list-xl text-xs-center>
            <v-layout row wrap>
              <v-flex xl6 md8 offset-xl3 offset-md2 xs12>
                <v-flex xs12>
                  <v-text-field color="purple darken-2" v-model="forms.subject" :rules="[rules.required]"
                                :label="$t('chamber.member.send_email_title')" clearable></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field color="purple darken-2" v-model="forms.fromName" :rules="[rules.required]"
                                :label="$t('chamber.member.from_name')" clearable></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field color="purple darken-2" v-model="forms.fromEmail" :rules="[rules.required,rules.email]"
                                :label="$t('chamber.member.from_email')" clearable></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-autocomplete v-model="friends" :disabled="isUpdating" :items="memberGroups"
                                  :no-data-text="$t('message.no_message')" :hint="$t('global.groups_text')" box chips
                                  color="purple darken-2" :label="$t('chamber.member.select_item')" item-text="name"
                                  item-value="id" multiple>
                    <template slot="selection" color="purple darken-2" slot-scope="data">
                      <v-chip :selected="data.selected" close class="chip--select-multi" @input="remove(data.item.id)">
                        <v-avatar class="purple white--text">
                          {{ data.item.name.slice(0, 1).toUpperCase() }}
                        </v-avatar>
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
                  <p class="error--text caption text-xs-left">{{$t('global.groups_text')}}</p>
                </v-flex>
                <v-flex xs12 class="text-xs-left">
                  <p class="text-xs-left">{{$t('chamber.know.content')}}</p>
                  <quill-editor ref="myTextEditor" :rules="[rules.required]" v-model="forms.content"
                                :options="editorOption">
                  </quill-editor>
                </v-flex>
                <v-spacer></v-spacer>
                <v-btn color="darken-1" flat @click="e1 =1">{{$t('button.cancel')}}</v-btn>
                <v-btn color="primary darken-1" :disabled="!form1 || !forms.content" :loading="isLoading" flat
                       @click.native="onSubmit()">{{$t('button.save')}}
                </v-btn>
              </v-flex>
            </v-layout>
            </v-card>
          </v-container>
        </v-form>

      </v-stepper-content>

      <v-stepper-content step="3">
        <div class="my-5 text-xs-center">
          <v-icon size="100" color="primary">check_circle</v-icon>
          <p class="title">{{$t('message.store_message')}}</p>
          <v-btn color="primary" @click="e1 = 2;forms =  {
                subject: null,
                recipientEmail: null,
                content: null,
                fromEmail: null,
                fromName: null,
                status: 'SEND',
                memberGroupIds: [],
                'organization.id': $route.params.organizationId
            }">
            {{$t('global.continue')}}
          </v-btn>
        </div>

      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
  import Vue from 'vue'
  import {mapMutations} from 'vuex'
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'

  import {quillEditor} from 'vue-quill-editor'

  export default {
    components: {
      quillEditor
    },
    data() {
      return {
        e1: 0,
        form: false,
        form1: false,
        isLoading: false,
        show1: false,
        memberGroups: [],
        friends: [],
        editorOption: {
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
              [{header: 1}, {header: 2}],
              [{list: 'ordered'}, {list: 'bullet'}],
              [{direction: 'rtl'}],
              [{size: ['small', false, 'large', 'huge']}],
              [{header: [1, 2, 3, 4, 5, 6, false]}],
              [{font: []}],
              [{color: []}, {background: []}],
              ['link', 'image']
            ],
            syntax: {
              highlight: text => hljs.highlightAuto(text).value
            }
          },
          placeholder: this.$t('chamber.know.content')

        },
        isUpdating: false,
        forms: {
          subject: null,
          recipientEmail: null,
          content: null,
          fromEmail: null,
          fromName: null,
          status: 'SEND',
          memberGroupIds: [],
          'organization.id': this.$route.params.organizationId
        },
        formSetting: {
          username: null,
          host: null,
          port: null,
          fromEmail: null,
          fromName: null,
          password: null,
          active: true,
          isAuth: true,
          'organization.id': this.$route.params.organizationId
        },
        rules: {
          email: v => (v || '').match(/@/) || this.$t('validation.email'),
          required: v => !!v || this.$t('validation.required'),
        }
      }
    },
    mounted() {
      this.reloadGroups()
      this.reloadSettings()
    },
    methods: {
      ...mapMutations(['snackbarStateChange']),
      reloadGroups() {
        this.$http
          .get('manager/member_groups', {
            params: {
              'organization.id': this.$route.params.organizationId,
              isDefault: false
            },
            headers: {
              'X-TENANT-ID': this.$route.params.organizationId
            }
          })
          .then(res => {
            this.memberGroups = res.data.map(val => {
              return val.memberGroup
            })
          })
      },
      reloadSettings() {
        this.$http
          .get('manager/email_relays', {
            params: {
              'organization.id': this.$route.params.organizationId
            },
            headers: {
              'X-TENANT-ID': this.$route.params.organizationId
            }
          })
          .then(res => {
            if (res.data.content.length > 0) {
              this.formSetting = res.data.content[0]
              this.e1 = 2
              this.formSetting[
                'organization.id'
                ] = this.$route.params.organizationId
              delete this.formSetting.createdAt
              delete this.formSetting.lastModifiedAt
            }
          })
      },
      onSubmit() {
        this.isLoading = true
        let params = new URLSearchParams()
        if (this.friends.length > 0) {
          params.append(`memberGroupIds`, this.friends.join(','))
        } else {
          params.append(`memberGroupIds`, '')
        }
        params.append('organization.id', this.$route.params.organizationId)
        params.append('status', 'SEND')
        params.append('subject', this.forms.subject)
        params.append('fromEmail', this.forms.fromEmail)
        params.append('fromName', this.forms.fromName)
        params.append('content', this.forms.content)
        this.$http
          .post('manager/mass_emails', params, {
            headers: {
              'X-TENANT-ID': this.$route.params.organizationId
            }
          })
          .then(res => {
            this.snackbarStateChange({
              color: 'success',
              text: this.$t(`message.store_message`),
              snackbar: true
            })
            this.e1 = 3
            this.friends = []
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
      onSubmitSetting() {
        this.isLoading = true
        let message =
          this.formSetting.id === undefined
            ? 'store_message'
            : 'update_message'
        this.$http
          .post('manager/email_relays', this.$serialize(this.formSetting), {
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
            this.e1 = 2
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
      remove(item) {
        let index = this.friends.findIndex(o => {
          return o === item
        })
        if (index >= 0) this.friends.splice(index, 1)
      }
    }
  }
</script>
