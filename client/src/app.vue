<template>
  <!-- App -->
  <f7-app :params="f7params">

    <!-- Statusbar -->
    <f7-statusbar></f7-statusbar>

    <!-- Left Panel -->
    <f7-panel left reveal theme-dark>
      <f7-view url="/panel-left/"></f7-view>
    </f7-panel>

    <!-- Main View -->
    <f7-view id="main-view" url="/" main></f7-view>


    <!-- Login Screen -->
    <f7-login-screen id="login-screen" :opened="loginScreenOpened" @loginscreen:closed="loginScreenOpened = false">
      <f7-view>
        <f7-page login-screen>
          <f7-login-screen-title>Login</f7-login-screen-title>
          <f7-list form>
            <f7-list-item>
              <f7-label>用户名</f7-label>
              <f7-input name="username" placeholder="Username" type="text" @input="username = $event.target.value"> </f7-input>
            </f7-list-item>
            <f7-list-item>
              <f7-label>密码</f7-label>
              <f7-input name="password" type="password" placeholder="Password" @input="password = $event.target.value"></f7-input>
            </f7-list-item>
          </f7-list>
          <f7-list>
            <f7-list-button title="Sign In" @click="signIn"></f7-list-button>
            <f7-block-footer>
              <p>Click Sign In to close Login Screen</p>
            </f7-block-footer>
          </f7-list>
        </f7-page>
      </f7-view>
    </f7-login-screen>

  </f7-app>
</template>

<script>
// Import Routes
import routes from './routes.js';
const xwuility = require('./xwutility');

export default {
  data() {
    return {
      // Framework7 parameters here
      f7params: {
        id: 'io.framework7.testapp', // App bundle ID
        name: 'Framework7', // App name
        theme: 'auto', // Automatic theme detection
        // App routes
        routes: routes,
      },
      loginScreenOpened: false,
      username:"",
      password:"",
    }
  },
  on: {
    pageInit: function (e, page) {
      console.log("init");
    }
  },
  mounted() {
    console.log("home");

    let app = this.$f7;
    let urlStr = app.router.tempDom.baseURI;
    let str = '/?token=';
    let tokenindex = urlStr.indexOf(str);
    if (tokenindex != -1) {
      console.log(tokenindex);
      let abc = urlStr.substr(tokenindex + str.length,urlStr.length);
      if (abc == 'xuwei') {
        let tmpPara = {};
        tmpPara.username = abc;
        sessionStorage.setItem('userInfo',JSON.stringify(tmpPara));
      }
    }

    let para = JSON.parse(sessionStorage.getItem('userInfo'));
    console.log(para);
    if (para == null) {
      let name = xwuility.getCookie('username');
      console.log("cookie:" + name);
      if (name == null) {
        this.loginScreenOpened = true;
      }
    }
  },
  methods: {
    signIn(e) {
      let para = {};
      para.username = this.username;
      para.password = this.password;
      this.$http.post('/api/login',para)
        .then(response => {
          if (parseInt(response.body.error) == 0) {
            this.loginScreenOpened = false;
            let paraStr = JSON.stringify(para);
            sessionStorage.setItem('userInfo', paraStr);

            let expireDays = 1000 * 60 * 60;
            xwuility.setCookie('username',this.username,expireDays);
            let name = xwuility.getCookie('username');
            console.log(name);

          } else {
            let app = this.$f7;
            app.toast.create({
              icon: '<i class="f7-icons">info</i>',
              text: "登录失败",
              position: 'center',
              closeTimeout: 2000,
            })
              .open();
          }
        })
    }
  }
}
</script>
