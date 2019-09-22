<template>
  <!-- <div id="app"> -->
  <router-view />
  <!-- </div> -->
</template>

<script>
export default {
  name: "App",
  mounted() {
    if (localStorage.getItem("i18n") !== null) {
      this.$i18n.locale = localStorage.getItem("i18n");
    }
  }
};
</script>

<style lang="scss">

#app {
  font-family: "Noto Sans TC","微软雅黑", Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.fakeItem {
  margin-bottom: 15px;
}
.fakeItem h2,
.fakeItem h3,
.fakeItem p {
  background-color: lightgrey;
  opacity: 0.5;
  height: 1em;
  margin-top: 10px;
}
.fakeItem h2 {
  width: 35%;
}
.fakeItem h3 {
  width: 40%;
}
.fakeItem p {
  width: 60%;
}
.timeline-item {
  background: #fff;
  border-color: #e5e6e9 #dfe0e4 #d0d1d5;
  border-radius: 3px;
  padding: 0 20px;
}

.error-page {
  width: 100%;
  height: 100%;
  background: #f8f8f9;
  .content-con {
    width: 700px;
    height: 600px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -60%);
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
    .text-con {
      position: absolute;
      left: 0px;
      top: 0px;
      h4 {
        position: absolute;
        left: 0px;
        top: 0px;
        font-size: 80px;
        font-weight: 700;
        color: #28ada7;
      }
      h5 {
        position: absolute;
        width: 700px;
        left: 0px;
        top: 100px;
        font-size: 20px;
        font-weight: 700;
        color: #67647d;
      }
    }
    .back-btn-group {
      position: absolute;
      right: 0px;
      bottom: 20px;
    }
  }
}

.clearfix:after {
  content: " ";
  display: block;
  clear: both;
  height: 0;
}
.clearfix {
  zoom: 1;
}

@keyframes placeHolderShimmer {
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
}

.animated-background {
  animation-duration: 1s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: placeHolderShimmer;
  animation-timing-function: linear;
  background: #f6f7f8;
  background: linear-gradient(to right, #eeeeee 8%, #dddddd 18%, #eeeeee 33%);
  background-size: 800px 104px;
  height: 96px;
  position: relative;
}

.background-masker {
  background: #fff;
  position: absolute;
}

/* Every thing below this is just positioning */

.background-masker.header-top,
.background-masker.header-bottom,
.background-masker.subheader-bottom {
  top: 0;
  left: 40px;
  right: 0;
  height: 10px;
}

.background-masker.header-left,
.background-masker.subheader-left,
.background-masker.header-right,
.background-masker.subheader-right {
  top: 10px;
  left: 40px;
  height: 8px;
  width: 10px;
}

.background-masker.header-bottom {
  top: 18px;
  height: 6px;
}

.background-masker.subheader-left,
.background-masker.subheader-right {
  top: 24px;
  height: 6px;
}

.background-masker.header-right,
.background-masker.subheader-right {
  width: auto;
  left: 300px;
  right: 0;
}

.background-masker.subheader-right {
  left: 230px;
}

.background-masker.subheader-bottom {
  top: 30px;
  height: 10px;
}

.background-masker.content-top,
.background-masker.content-second-line,
.background-masker.content-third-line,
.background-masker.content-second-end,
.background-masker.content-third-end,
.background-masker.content-first-end {
  top: 40px;
  left: 0;
  right: 0;
  height: 6px;
}

.background-masker.content-top {
  height: 20px;
}

.background-masker.content-first-end,
.background-masker.content-second-end,
.background-masker.content-third-end {
  width: auto;
  left: 380px;
  right: 0;
  top: 60px;
  height: 8px;
}

.background-masker.content-second-line {
  top: 68px;
}

.background-masker.content-second-end {
  left: 420px;
  top: 74px;
}

.background-masker.content-third-line {
  top: 82px;
}

.background-masker.content-third-end {
  left: 300px;
  top: 88px;
}
/* //蓝色方块 */

.module-tabs {
  margin-bottom: 43px;
  font-size: 0;
  height: 34px;
}
.diamonds {
  color: #1e1e1e;
  display: inline-block;
  line-height: 34px;
  font-weight: 500 !important;
  font-size: 30px !important;
  font-family: 'Noto Sans TC',"PingFangSC-Semibold";
}
.diamonds span {
  font-size: 34px;
  line-height: 34px;
  letter-spacing: 0px;
  color: #f0f0f0;
  margin-left: 22px;
  font-family: "Noto Sans TC","PingFangSC-Semibold";
}
.ql-editor {
  min-height: 200px;
}
.img-responsive {
  display: block;
  max-width: 100%;
  height: auto;
}
.v-pagination__item {
  outline: none !important;
}

.cover-hover .img-content {
  overflow: hidden;
}
.cover-hover .img-content img {
  transition: 0.6s;
  transform: scale(1);
}
.cover-hover img:hover {
  transform: scale(1.1);
}
.hover-card .img-content {
  overflow: hidden;
  max-height: 233.33px;
}
.hover-card .img-content img {
  transition: 0.6s;
  transform: scale(1);
}

.hover-card:hover {
  background: #fff !important;
  box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.1) !important;
}
.hover-card:hover img {
  transform: scale(1.1);
}

.company-content .top .container {
  padding: 0 !important;
  max-width: 100% !important;
}
@media (min-width: 1264px) {
  .flex.lg-5 {
    max-width: 20% !important;
    float: left;
  }

  .pull-right {
    float: right;
  }
  .v-toolbar__content1 .v-toolbar__content {
    height: 80px !important;
  }
  .box-container {
    width: 1200px !important;
    margin: auto;
  }
  .container {
    padding: 0 !important;
    max-width: 100% !important;
  }
}
.v-toolbar__content1 .v-toolbar__content {
  padding-left: 0;
  padding-right: 0;
}
.logoBox {
  margin-top: -5px;
}
.theme--light .v-btn {
  font-weight: inherit;
}
.header-menu {
  margin-top: -10px !important;
}
/* //超出省略号 */
.three-line-overflow:after {
  content: "...";
  position: absolute;
  bottom: 0px;
  right: 0;
  padding-left: 40px;
  background: -webkit-linear-gradient(left, transparent, #fff 55%);
  background: -o-linear-gradient(right, transparent, #fff 55%);
  background: -moz-linear-gradient(right, transparent, #fff 55%);
  background: linear-gradient(to right, transparent, #fff 55%);
}
.three-line-overflow {
  position: relative;
  line-height: 25px;
  max-height: 50px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 设置行数 */
  -webkit-box-orient: vertical;
}
.line-5-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 5; /* 设置行数 */
  -webkit-box-orient: vertical;
}
.line-3-overflow:after {
  content: "...";
  position: absolute;
  bottom: 0;
  right: 0;
  padding-left: 40px;
  background: -webkit-linear-gradient(left, transparent, #fff 55%);
  background: -o-linear-gradient(right, transparent, #fff 55%);
  background: -moz-linear-gradient(right, transparent, #fff 55%);
  background: linear-gradient(to right, transparent, #fff 55%);
}
.line-3-overflow {
  position: relative;
  line-height: 30px;
  max-height: 60px;
  overflow: hidden;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 设置行数 */
  -webkit-box-orient: vertical;
  line-height: 30px;
}
/* //小蓝点 */
.point {
  float: left;
  width: 10px;
  height: 10px;
  margin: 6px 10px 0 2px;
  border-radius: 5px;
  background-color: #2c7a90;
}
.color-blue {
  color: #2c7a90 !important;
}
.vertical-m {
  vertical-align: middle;
}
.font18 {
  font-size: 18px;
}

.cur-pointer {
  cursor: pointer;
}

.blue.darken-3 {
  background-color: #2c7a90 !important;
}
.card .elevation-1 table thead th:last-child {
  text-align: center !important;
}
// body {
//     background-color: #fafafa;
// }
// .v-content__wrap{
//   background-color: #fafafa;
// }
@media (max-width: 600px) {
  .xsmy-0 {
    margin: 0 !important;
  }
  .card {
    margin: 40px 10px !important;
  }
  .rtable {
    padding: 5px;
  }
  .v-datatable__progress {
    display: none !important;
  }
  .v-btn__content {
    line-height: 0 !important;
  }
  table.v-table thead th:first-child,
  table.v-table tbody td:first-child {
    .v-input__slot {
      height: 44px !important;
      line-height: 44px !important;
    }
  }
  .rtable table {
    /*!
  // IE needs inline-block to position scrolling shadows otherwise use:
  // display: block;
  // max-width: min-content;
  */
    display: inline-block;
    vertical-align: top;
    max-width: 100%;

    overflow-x: auto;

    // optional - looks better for small cell values
    white-space: nowrap;

    border-collapse: collapse;
    border-spacing: 0;
  }

  .rtable table,
  .rtable--flip table tbody {
    // optional - enable iOS momentum scrolling
    -webkit-overflow-scrolling: touch;

    // scrolling shadows
    background: radial-gradient(
          left,
          ellipse,
          rgba(0, 0, 0, 0.2) 0%,
          rgba(0, 0, 0, 0) 75%
        )
        0 center,
      radial-gradient(
          right,
          ellipse,
          rgba(0, 0, 0, 0.2) 0%,
          rgba(0, 0, 0, 0) 75%
        )
        100% center;
    background-size: 10px 100%, 10px 100%;
    background-attachment: scroll, scroll;
    background-repeat: no-repeat;
  }

  // change these gradients from white to your background colour if it differs
  // gradient on the first cells to hide the left shadow
  .rtable table td:first-child,
  .rtable--flip table tbody tr:first-child {
    background-image: linear-gradient(
      to right,
      rgba(255, 255, 255, 1) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    background-repeat: no-repeat;
    background-size: 20px 100%;
  }

  // gradient on the last cells to hide the right shadow
  .rtable table td:last-child,
  .rtable--flip table tbody tr:last-child {
    background-image: linear-gradient(
      to left,
      rgba(255, 255, 255, 1) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    background-repeat: no-repeat;
    background-position: 100% 0;
    background-size: 20px 100%;
  }

  .rtable table th {
    font-size: 11px;
    text-align: left;
    text-transform: uppercase;
    background: #f2f0e6;
  }

  .rtable table th,
  .rtable table td {
    border: 1px solid #d9d7ce;
    height: 44px !important;
    line-height: 44px !important;
  }

  .rtable--flip table {
    display: flex;
    overflow: hidden;
    background: none;
  }

  .rtable--flip table thead {
    display: flex;
    flex-shrink: 0;
    min-width: min-content;
  }

  .rtable--flip tbody {
    display: flex;
    position: relative;
    overflow-x: auto;
    overflow-y: hidden;
  }

  .rtable--flip table tr {
    display: flex;
    flex-direction: column;
    min-width: min-content;
    flex-shrink: 0;
  }

  .rtable--flip table td,
  .rtable--flip table th {
    display: block;
  }

  .rtable--flip table td {
    background-image: none !important;
    // border-collapse is no longer active
    border-left: 0;
  }

  // border-collapse is no longer active
  .rtable--flip table th:not(:last-child),
  .rtable--flip table td:not(:last-child) {
    border-bottom: 0;
  }
  .xspy-0 {
    padding-bottom: 0 !important;
    padding-top: 0 !important;
  }
}
.text-overflow {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  word-wrap: normal;
  height: 36px;
}
.card {
  margin: 0 45px;
  border: 0;
  margin-bottom: 30px;
  margin-top: 60px;
  border-radius: 6px;
  color: #333;
  background: #fff;
  box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 1px 3px 0 rgba(0, 0, 0, 0.12) !important;
  .card-icon {
    border-radius: 3px;
    background: linear-gradient(60deg, #2c7a90, #fafafa);
    padding: 15px;
    margin-top: -20px;
    margin-right: 15px;
    float: left;
    margin-left: 30px;
    i {
      color: #fff;
    }
  }
  .card-title {
    text-align: left;
    font-size: 24px;
    padding-top: 10px;
    margin-top: 15px;
    color: #3c4858;
  }
  .elevation-1 {
    margin-top: 20px;
    box-shadow: none !important;
    table thead th {
      background: #b0bec5;
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
}
@media (max-width: 600px) {
  .v-tabs__icon {
    top: 10px !important;
    color: #fff !important;
  }
  .xsmt-5 {
    margin-top: 5px !important;
  }
  .xspr-10 {
    padding-right: 10px !important;
  }
  .xspl-10 {
    padding-left: 10px !important;
  }
  .xspadding-0,
  .content {
    padding: 0 !important;
  }
  .xspaddingr-0 {
    padding-right: 0 !important;
  }
  .text-overflow {
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    -webkit-line-clamp: 0 !important;
    line-height: 16px !important;
    height: 14px !important;
    display: inherit !important;
    font-size: 12px !important;
  }
  .xsfontSize18 {
    font-size: 18px !important;
  }
  .xsfontSize12 {
    font-size: 12px !important;
  }
  .xspx-3 {
    padding: 0 3px !important;
  }
  .xsml-0 {
    margin-left: 0 !important;
  }
  .xsml-3 {
    margin-left: 3px !important;
  }
}

.container.grid-list-lg .layout:not(:only-child) {
  margin: 0;
}
.home-page .box-container {
  padding: 80px 0 50px 0;
}
.home-page {
  cursor: pointer;
  .xsmt-5 {
    .module-tabs {
      display: flex;
      justify-content: space-between;
      .btn {
        margin-top: 0;
        padding: 0 54px;
        height: 34px;
        -webkit-border-radius: 10px 10px 10px 10px;
        -moz-border-radius: 10px 10px 10px 10px;
        border-radius: 10px 10px 10px 10px;
      }
    }
    .hover-card {
      margin: 0px 10px 30px 10px;
      background-color: #fff !important;
      -webkit-border-radius: 10px 10px 10px 10px;
      -moz-border-radius: 10px 10px 10px 10px;
      border-radius: 10px 10px 10px 10px;
      padding: 11px 12px 1px 12px;
      border: solid 1px #f0f0f0;
    }

    .text {
      .name {
        margin-top: 16px;
        color: #000000;
        font-size: 16px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 185px;
      }
      .price {
        margin-top: 16px;
        margin-bottom: 20px;
        color: #e57d12;
        font-size: 16px;
      }
      .company {
        color: #b4b4b4;
        margin-top: 16px;
        font-size: 14px;
      }
      .brief {
        color: #b4b4b4;
        font-size: 14px;
        line-height: 20px;
      }
    }
  }
}
.company-content {
  cursor: pointer;
  margin-top: 0px;
  border: 1px solid #eee;
  overflow: hidden;
  background: #fff;
  -webkit-border-radius: 10px 10px 10px 10px;
  -moz-border-radius: 10px 10px 10px 10px;
  border-radius: 10px 10px 10px 10px;
  margin-bottom: 30px;
  img {
    transition: 0.6s;
    -webkit-transition: 0.6s;
  }
  :hover {
    img {
      -webkit-transform: scale(1.1);
      transform: scale(1.1);
    }
  }
  .top {
    padding: 15px 20px 0 20px;
    text-align: left;
    position: relative;
    .mt-1 {
      text-align: left;
    }
  }

  .bottom {
    border-top: 1px dashed #e0e0e0;
    .bottom-item {
      position: relative;
      display: block;
      margin-top: 15px;
      float: left;
      text-align: left;
      width: 50%;
      display: flex;
      color: #b4b4b4;
      .fa {
        font-size: 1.3rem;
      }
    }
  }

  .icon {
    width: 140px;
    height: 140px;
    margin: 0 auto;
    img {
      width: 100%;
      height: 100%;
    }
  }

  .indus-stage {
    height: 22px;
    color: #555;
    margin-top: 10px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    word-wrap: normal;
  }

  .name {
    height: 22px;
    margin-top: 13px;
    font-size: 16px;
    color: #000;
    display: inline-block;
  }
  .industry {
    font-size: 14px;
    color: #b4b4b4;
    padding-bottom: 16px;
  }
  .name:hover {
    color: #2c7a90;
  }
  .container {
    .name {
      margin-top: 0;
    }
  }
}

.company-content:hover {
  -webkit-box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.1);
  box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.1);
  -webkit-border-radius: 8px 8px 8px 8px !important;
  -moz-border-radius: 8px 8px 8px 8px !important;
  border-radius: 8px 8px 8px 8px !important;
}
.company {
  .module-tabs {
    margin-bottom: 27px;
  }
}
.activity {
  .text-xs-left {
    .module-tabs {
      padding: 0 10px;
    }
  }
  .text {
    color: #b4b4b4;
    line-height: 30px;
    padding: 16px 30px 15px 20px;
    .activity_name {
      font-size: 16px;
      color: #000;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .img-content {
    -webkit-border-radius: 8px 8px 0px 0px !important;
    -moz-border-radius: 8px 8px 0px 0px !important;
    border-radius: 8px 8px 0px 0px !important;
  }
  .hover-card {
    border: 1px solid #eee;
    padding: 0 !important;
    margin: 0px 10px 30px 10px;
    background-color: #fff !important;
    border-radius: 10px 10px 10px 10px;
  }
  .box-container {
    padding: 80px 0 70px 0;
  }
}
.news {
  padding-bottom: 220px;
  -webkit-border-radius: 8px 8px 8px 8px !important;
  -moz-border-radius: 8px 8px 8px 8px !important;
  border-radius: 8px 8px 8px 8px !important;
  .text-xs-left {
    .module-tabs {
      padding: 0 10px;
    }
  }
  .hover-card {
    padding: 0 !important;
  }
  .img-content {
    width: 590px;
    height: 200px;
    text-align: center;
    img {
      height: 100%;
      width: 100%;
    }
  }
  .news-cover {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 20px 0px 30px 30px;
    text-align: left;
    color: #fff;
    background: rgba(39, 102, 103, 0.5);
    -webkit-border-radius: 8px 8px 8px 8px !important;
    -moz-border-radius: 8px 8px 8px 8px !important;
    border-radius: 8px 8px 8px 8px !important;

    .create_time {
      span {
        color: #fff !important;
      }
    }
    .title {
      position: absolute;
      bottom: 30px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 500px;
    }
  }
  .img-content {
    -webkit-border-radius: 8px 8px 8px 8px !important;
    -moz-border-radius: 8px 8px 8px 8px !important;
    border-radius: 8px 8px 8px 8px !important;
  }
}
.product {
  .text-xs-left {
    .module-tabs {
      padding: 0 10px;
    }
  }
  .hover-card {
    -webkit-border-radius: 8px 8px 8px 8px;
    -moz-border-radius: 8px 8px 8px 8px;
    border-radius: 8px 8px 8px 8px;
  }
}

.v-card > :first-child:not(.v-btn):not(.v-chip) {
  -webkit-border-radius: 0px 0px 0px 0px;
  -moz-border-radius: 0px 0px 0px 0px;
  border-radius: 0px 0px 0px 0px;
}
.v-card > :last-child:not(.v-btn):not(.v-chip) {
  -webkit-border-radius: 0px 0px 0px 0px;
  -moz-border-radius: 0px 0px 0px 0px;
  border-radius: 0px 0px 0px 0px;
}
@media (min-width: 1264px) {
  .mx-lg-5 {
    margin-left: 48px !important;
    margin-right: 48px !important;
  }
}

@media (max-width: 600px) {
  .mx-xs-6 {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
}
// .box-container-p80{
//   padding:190px 0;
// }

// 公共footer
// .v-footer{
//   margin-top: 110px;
// }
.v-footer .copyright {
  color: #FFF;
  // background: #fff;
}

.application a {
  text-decoration: none;
}
/** iPad pro **/
@media only screen and (min-width: 1024px) and (max-width: 1280px) {
}
/** iPad pro **/

/** iPad **/
@media only screen and (min-width: 768px) and (max-width: 1023px) {
  .box-container-p80 {
    padding: 40px 0;
  }
  .product .box-container {
    padding: 40px 0;
  }
  p {
    margin-bottom: 0 !important;
  }
  .company-content .top .container {
    padding: 16px !important;
  }
}
/** iPad **/
/** iPhone **/
@media only screen and (min-width: 320px) and (max-width: 767px) {
  .company-content .top .container {
    padding: 16px !important;
  }
  .home-page .box-container-p80 {
    padding: 20px 0;
  }
  .diamonds {
    margin-right: 0;
  }
  .diamonds,
  .diamonds span {
    font-size: 20px !important;
  }
  .home-page .xsmt-5 .module-tabs .btn {
    padding: 0 16px;
    height: 28px;
  }
  .news .news-cover .title {
    width: 300px;
  }
  .coco-show-home .hover-card {
    border: 1px solid #dddddd;
  }
  .coco-show-home .v-responsive .slide-title {
    font-size: 14px !important;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 280px;
  }
  .v-footer .box-container .subheading {
    margin: 0;
  }
  .product .box-container {
    padding: 20px 0;
  }
  .v-toolbar__content > :first-child.v-btn--icon,
  .v-toolbar__extension > :first-child.v-btn--icon {
    margin-left: 18px;
  }
  .company-content .top {
    padding: 0 !important;
  }
  p {
    margin-bottom: 0 !important;
  }
}
/** iPhone **/
</style>
