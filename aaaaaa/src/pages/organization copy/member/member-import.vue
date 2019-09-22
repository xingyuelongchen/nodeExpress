<template>
  <div class="import mt-4">
    <v-stepper v-model="e6" vertical>
      <v-stepper-step :complete="e6 > 1" step="1">
        {{$t('global.batchImportMemberText1')}}
        <p class="error--text font-weight-thin">{{$t('global.batchImportMemberText2')}}</p>
      </v-stepper-step>
      <v-stepper-content step="1">
        <v-btn color="primary" @click="exports()">{{$t('global.download')}}</v-btn>
      </v-stepper-content>

      <v-stepper-step :complete="e6 > 2" step="2">{{$t('global.batchImportMemberText3' )}} <span v-if="file.length > 0">{{file[0].name}}</span></v-stepper-step>

      <v-stepper-content step="2">
        <v-btn color="primary">
          <label for="files" role="button" class="file">
            {{$t('global.batchImportMemberText4')}}
          </label>
        </v-btn>
        <input type="file" id="files" multiple="multiple" @change="fileChangeEvent($event)" placeholder="Upload file" name="files" hidden />
      </v-stepper-content>

      <v-stepper-step :complete="e6 > 3" step="3">{{$t('button.upload')}}</v-stepper-step>

      <v-stepper-content step="3">
        <v-btn color="primary" @click="upload()" :loading="isLoading">{{$t('button.upload')}}</v-btn>
      </v-stepper-content>

      <v-stepper-step :complete="e6 > 4" step="4">{{$t('message.file_success')}}</v-stepper-step>

      <v-stepper-content step="4">
        <v-card color="lighten-1" class="mb-5 text-xs-center" height="200px">
          <v-icon size="50" color="primary">check_circle</v-icon>
          <p> {{$t('message.file_success')}}</p>
          <v-btn flat small @click="clear()">{{$t('chamber.btn.continue_invite')}}</v-btn>
          <v-btn flat small color="primary" :to="{path: `/organization/${$route.params.organizationId}/member_list`}">{{$t('button.return')}}</v-btn>
        </v-card>
      </v-stepper-content>

    </v-stepper>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
export default {
    data() {
        return {
            e6: 1,
            isLoading: false,
            file: []
        }
    },
    methods: {
        ...mapMutations(['snackbarStateChange']),
        exports() {
              location.href = `http://127.0.0.1/api/v1/members/export/${
         //   location.href = `https://api.connected.hk/api/v1/members/export/${
                this.$route.params.organizationId
            }`
            this.e6 = 2
        },
        fileChangeEvent(fileInput) {
            this.file = fileInput.target.files
            this.e6 = 3
        },
        upload() {
            this.isLoading = true
            var fd = new FormData()
            fd.append('file', this.file[0], `import.xlsx`)
            fd.append('organizationId', this.$route.params.organizationId)
            let config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                  'X-TENANT-ID': this.$route.params.organizationId

                }
            }
            this.$http
                .post('manager/members/import', fd, config)
                .then(res => {
                    this.snackbarStateChange({
                        color: 'success',
                        text: this.$t(`message.update_message`),
                        snackbar: true
                    })
                    this.e6 = 4
                    this.isLoading = false
                })
                .catch(res => {
                    this.isLoading = false
                    this.snackbarStateChange({
                        color: 'error',
                        text: res.message,
                        snackbar: true
                    })
                })
        },
        clear() {
            this.e6 = 1
            this.file = []
        }
    }
}
</script>
