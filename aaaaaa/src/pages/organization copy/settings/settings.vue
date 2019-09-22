<template>
  <v-form ref="form" v-model="form">
    <v-container grid-list-xl text-xs-center>
      <v-layout row wrap>
        <v-flex xl6 md8 offset-xl3 offset-md2 xs12>
          <v-flex xs12>
            <v-layout row wrap>
              <v-flex md3 xs4 style="line-height: 68px;" class="text-xs-right">{{$t('chamber.member.number')}}:</v-flex>
              <v-flex md9 xs8>
                <v-switch v-model="forms.active" @change="changes(forms.active)" :label="$t('global.codeRule')"
                          color="indigo darken-3" hide-details></v-switch>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs12 v-if="forms.active">
            <v-layout row wrap>
              <v-flex md3 xs4 style="line-height: 68px;" class="text-xs-right">{{$t('global.codeRulelable')}}:</v-flex>
              <v-flex md9 xs8>
                <v-layout row wrap>
                  <v-flex md6>
                    <v-text-field color="purple darken-2" :rules="[rules.required]" v-model="forms.start"
                                  placeholder="例如: BA" :label="$t('global.codeRuleStart')"></v-text-field>
                  </v-flex>
                  <v-flex md6>
                    <v-text-field color="purple darken-2" :rules="[rules.required]" v-model="forms.rule"
                                  placeholder="例如: 101" :label="$t('global.codeRulelable')"></v-text-field>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs12 v-if="forms.active">
            <v-layout row wrap>
              <v-flex md9 xs8 offset-xs4 offset-md3>
                <v-layout row wrap>
                  <v-flex md12>
                    <v-text-field color="purple darken-2" :rules="[rules.required]" v-model="forms.untail"
                                  :placeholder="$t('global.mantissaText')"
                                  :label="$t('global.mantissa')"></v-text-field>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs12 v-if="forms.active">
            <v-layout row wrap>
              <v-flex md9 xs8 offset-xs4 offset-md3>
                <v-layout row wrap>
                  <v-flex md12>
                    <v-checkbox :label="$t('global.isChangeDefault')" color="primary"
                                v-model="changeDefault"></v-checkbox>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs12>
            <v-layout row wrap>
              <v-flex xs5 md3 style="line-height: 68px;" class="text-xs-right">{{$t('global.replySetting')}}:</v-flex>
              <v-flex xs7 md9>
                <v-switch v-model="openMessage" @change="updateOpenMessage(openMessage)"
                          :label="$t('global.replySettingText')" color="indigo darken-3" hide-details></v-switch>
              </v-flex>
            </v-layout>
          </v-flex>

          <v-spacer></v-spacer>
          <v-btn color="primary darken-1" :disabled="!form" :loading="isLoading" v-if="forms.active" flat
                 @click.native="onSubmit()">{{$t('button.save')}}
          </v-btn>
        </v-flex>
      </v-layout>
      </v-card>
    </v-container>
  </v-form>
</template>

<script>
  import Vue from 'vue'
  import {mapMutations} from 'vuex'

  export default {
    data() {
      return {
        form: false,
        isLoading: false,
        openMessage: false,
        changeDefault: false,
        forms: {
          active: false,
          start: '',
          rule: '',
          untail: null,
          'organization.id': this.$route.params.organizationId
        },
        rules: {
          email: v => (v || '').match(/@/) || this.$t('validation.email'),
          required: v => !!v || this.$t('validation.required'),
        }
      }
    },
    mounted() {
      this.reloadNumber()
      this._initOrganizations()
    },
    methods: {
      ...mapMutations(['snackbarStateChange']),
      reloadNumber() {
        this.$http
          .get('manager/member_number_rule', {
            params: {
              'organization.id': this.$route.params.organizationId
            },
            headers: {
              'X-TENANT-ID': this.$route.params.organizationId
            }

          })
          .then(res => {
            if (res.data.content.length > 0) {
              this.forms = res.data.content[0]
              this.forms[
                'organization.id'
                ] = this.$route.params.organizationId
              delete this.forms.createdAt
              delete this.forms.lastModifiedAt
            }
          })
      },
      _initOrganizations() {
        this.$http
          .get(`manager/organizations/${this.$route.params.organizationId}`, {
            headers: {
              'X-TENANT-ID': this.$route.params.organizationId
            }
          })
          .then(
            res => {
              this.openMessage = res.data.openMessage
            },
            error => {
            }
          )
      },
      onSubmit() {
        this.isLoading = true
        if (this.changeDefault) {
          this.forms.changeDefault = this.changeDefault
        }
        let message =
          this.forms.id === undefined ? 'store_message' : 'update_message'
        this.$http
          .post('manager/member_number_rule', this.$serialize(this.forms), {
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
            this.isLoading = false
          })
          .catch(error => {
            this.isLoading = false
            this.snackbarStateChange({
              color: 'error',
              text: error,
              snackbar: true
            })
          })
      },
      updateOpenMessage(openMessage) {
        this.$http
          .post(
            'manager/organizations/update_openMessage',
            this.$serialize({
              organizationId: this.$route.params.organizationId,
              openMessage: openMessage
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
              text: error,
              snackbar: true
            })
          })
      },
      changes(isActive) {
        if (this.forms.id && !isActive) {
          this.onSubmit()
        }
      }
    }
  }
</script>
