<template>
  <v-container grid-list-xl text-xs-center>


    <div class="text-xs-center" v-if="loading">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    <div v-else-if="nodata"><div><img src="./../../../../static/img/lazy/logo.png"></div>{{$t('message.no_message')}}</div>
    <template v-else>
      <v-layout row wrap class="my-5 mx-2">
        <v-flex xs3 sm2 md2>
          {{$t('chamber.payment.orderNumber')}}
        </v-flex>
        <v-flex xs3 sm2 md2>
          {{detail.id}}
        </v-flex>
        <v-flex xs3 sm2 md2>
          {{$t('chamber.payment.orderName')}}
        </v-flex>
        <v-flex xs3 sm2 md2>
          {{detail.name}}
        </v-flex>
        <v-flex xs3 sm2 md2>
          {{$t('chamber.payment.email')}}
        </v-flex>
        <v-flex xs9 sm2 md2>
          {{detail.email}}
        </v-flex>
        <v-flex xs3 sm2 md2>
          {{$t('chamber.payment.type')}}
        </v-flex>
        <v-flex xs3 sm2 md2>
          {{$t(`global.${detail.subjectType}`)}}
        </v-flex>
        <v-flex xs3 sm2 md2>
          {{$t('chamber.payment.status')}}
        </v-flex>
        <v-flex xs3 sm2 md2>
          <span v-if="detail.status === 'SUCCESS'" class="success--text">{{$t('global.alreadyPaid')}}</span>
          <span v-if="detail.status === 'PENDING' && !detail.isActive"
                class="orange--text">{{$t('global.nPaid') }}</span>
          <span v-if="detail.status === 'PENDING' && detail.isActive"
                class="orange--text">{{$t('global.alreadyPaid') }}</span>
          <span v-if="detail.status === 'ERROR'" class="error--text">{{$t('global.ERROR')}}</span>
        </v-flex>
        <v-flex xs3 sm2 md2>
          {{$t('chamber.payment.money')}}
        </v-flex>
        <v-flex xs9 sm2 md2 class="error--text">
          $HK {{detail.amount}}
        </v-flex>
        <v-flex xs4 sm2 md2>
          {{$t('chamber.payment.method')}}
        </v-flex>
        <v-flex xs8 sm2 md2>
          {{detail.gateway}}
        </v-flex>
        <v-flex xs4 sm2 md2>
          {{detail.optionString}}
        </v-flex>
        <v-flex xs8 sm2 md2>
          {{detail.optionValue}}
        </v-flex>

      </v-layout>
    </template>

  </v-container>
</template>
<script>
  export default {
    data() {
      return {
        detail: {},
        url: null,
        loading: true,
        nodata:false
      }
    },
    mounted() {
      if (this.$route.params.type === 'apply') {
        this.url = `manager/transactions/${this.$route.params.paymentId}`
      } else if (this.$route.params.type === 'activities') {
        this.url = `manager/transactions/orderId/${this.$route.params.paymentId}`
      } else {
        this.url = `manager/transactions/memberId/${this.$route.params.paymentId}`
      }
      this.readFindDetail(this.url)
    },
    methods: {
      readFindDetail(url) {
        this.$http.get(url, {
          headers: {
            'X-TENANT-ID': this.$route.query.orgid
          }
        }).then(res => {
          this.detail = res.data
          this.loading = false
        }).catch(error => { 
            this.nodata=true
            this.loading = false
          })
      },
      back() {
        this.$router.back()
      }
    }
  }
</script>

<style lang="scss">
  @media only screen and (min-width: 1904px) {
    .container {
      max-width: 1200px !important;
    }
  }


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
</style>

