<template>
  <f7-page @page:beforeout="onPageBeforeOut">
    <f7-navbar title="游戏" back-link="返回" back-link-url="/tab3/'"></f7-navbar>
    <f7-block>
      <f7-row>
        <f7-col>
          <f7-button v-if="id == -1" @click="addPlayerClick" color="green">玩家</f7-button>
        </f7-col>
      </f7-row>
    </f7-block>
    <f7-card>
    <f7-list inline-labels no-hairlines-md>
      <f7-list-item>
        <f7-label>日期</f7-label>
        <f7-input type="date" :value="gameDate" @input="gameDate = $event.target.value"
                  placeholder="game date" :readonly="id != -1"></f7-input>
      </f7-list-item>

      <f7-list-item v-for="item in playerList" :key="item.userid" :title="item.name" :myid="item.userid" :mydata="item.name">
        <f7-icon slot="media" f7="person"></f7-icon>

        <f7-input slot="after" type="text" :value="item.score" @input="item.score = $event.target.value" placeholder="0"
                  size="5" @focus="onScoreFocus" @blur="onScoreBlur" :readonly="id != -1"></f7-input>
      </f7-list-item>
    </f7-list>
    </f7-card>
    <f7-block>
      <f7-row>
        <f7-col>
          <f7-button v-if="id == -1" @click="OkButtonClick">确认</f7-button>
        </f7-col>
      </f7-row>
    </f7-block>

    <f7-sheet class="demo-sheet" :opened="sheetOpened" @sheet:closed="sheetOpened = false">
      <!-- Scrollable sheet content -->
      <f7-page-content>
        <f7-block >
          <f7-row>
            <f7-col>
              <f7-button fill color="blue" round @click="sheetButtonClick">1</f7-button>
            </f7-col>
            <f7-col>
              <f7-button fill color="blue" round @click="sheetButtonClick">2</f7-button>
            </f7-col>
            <f7-col>
              <f7-button fill color="blue" round @click="sheetButtonClick">3</f7-button>
            </f7-col>
          </f7-row>
        </f7-block>

        <f7-block >
          <f7-row>
            <f7-col>
              <f7-button fill color="blue" round @click="sheetButtonClick">4</f7-button>
            </f7-col>
            <f7-col>
              <f7-button fill color="blue" round @click="sheetButtonClick">5</f7-button>
            </f7-col>
            <f7-col>
              <f7-button fill color="blue" round @click="sheetButtonClick">6</f7-button>
            </f7-col>
          </f7-row>
        </f7-block>

        <f7-block >
          <f7-row>
            <f7-col>
              <f7-button fill color="blue" round @click="sheetButtonClick">7</f7-button>
            </f7-col>
            <f7-col>
              <f7-button fill color="blue" round @click="sheetButtonClick">8</f7-button>
            </f7-col>
            <f7-col>
              <f7-button fill color="blue" round @click="sheetButtonClick">9</f7-button>
            </f7-col>
          </f7-row>
        </f7-block>

        <f7-block >
          <f7-row>
            <f7-col>
              <f7-button fill color="blue" round @click="sheetButtonClick">0</f7-button>
            </f7-col>
            <f7-col>
              <f7-button fill color="green" round @click="sheetNegButtonClick">±</f7-button>
            </f7-col>
            <f7-col>
              <f7-button fill color="red" round @click="sheetDelButtonClick">Del</f7-button>
            </f7-col>
          </f7-row>
        </f7-block>
      </f7-page-content>
    </f7-sheet>
  </f7-page>
</template>

<script>
  Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
      'M+': this.getMonth() + 1, //月份
      'd+': this.getDate(), //日
      'h+': this.getHours(), //小时
      'm+': this.getMinutes(), //分
      's+': this.getSeconds(), //秒
      'q+': Math.floor((this.getMonth() + 3) / 3), //季度
      'S': this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
    }
    return fmt;
  };

  export default {
    name: 'editGame',
    data() {
      return {
        id: -1,
        gameDate: '',
        playerList: [],
        sheetOpened: false,
        editTarget: null
      };
    },
    mounted() {
      console.log('editgame mounted');
      let para = JSON.parse(sessionStorage.getItem('editGamePara'));
      console.log(para);
      this.id = para.id;
      this.playerList = para.users;
      console.log(this.playerList);
      this.gameDate = new Date().Format('yyyy-MM-dd');
    },
    methods: {
      OkButtonClick(e) {
        let app = this.$f7;
        let para = {};
        para.id = this.id;
        para.users = this.playerList;
        para.date = this.gameDate;

        this.$http.post('/api/addGame', para)
          .then(response => {
            console.log(response.body);
            let ret = response.body.error;
            let msg = response.body.msg;
            if (parseInt(ret) == 0) {
              app.toast.create({
                icon: '<i class="f7-icons">info</i>',
                text: msg,
                position: 'center',
                closeTimeout: 2000,
              })
                .open();
              app.router.back();
              // app.router.back('/tab3/',{force:true});
              return;
            }
          }, response => {
            // error callback
            console.log('/api/addGame error: ' + response.body);
          });
      },

      addPlayerClick(e) {
        const app = this.$f7;
        let para = {};
        para.id = this.id;
        para.users = this.playerList;
        let paraStr = JSON.stringify(para);
        console.log('para = ' + paraStr);
        sessionStorage.setItem('editGamePara', paraStr);
        app.router.navigate('/selectUser/');

      },
      onScoreFocus(e) {
        this.editTarget = e.target;
        this.sheetOpened = false;
        console.log(e);

      },
      onScoreBlur(e) {
      },
      onPageBeforeOut() {
        const self = this;
        // Close opened sheets on page out
        self.$f7.sheet.close();
      },
      sheetButtonClick(e) {
        if (this.editTarget == null) {
          return;
        }

        let t = e.target.text;
        let v = this.editTarget.value;
        if (parseInt(v) == 0) {
          this.editTarget.value = t;
        } else {
          this.editTarget.value = this.editTarget.value + t;
        }
        let event = new InputEvent('input');
        this.editTarget.dispatchEvent(event);

      },
      sheetNegButtonClick(e) {
        if (this.editTarget == null) {
          return;
        }
        let v = parseInt(this.editTarget.value);
        if (v == 0) {
          return;
        }
          v = -v;
          this.editTarget.value = v.toString();
        let event = new InputEvent('input');
        this.editTarget.dispatchEvent(event);
      },
      sheetDelButtonClick(e) {
        if (this.editTarget == null) {
          return;
        }
        let v = parseInt(this.editTarget.value);
        if (v == 0) {
          return;
        } else if ((v < 10) && (v > -10)) {
          v = 0;
          this.editTarget.value = v.toString();

        } else {
          this.editTarget.value = this.editTarget.value.substring(0,this.editTarget.value.length - 1);
        }
        let event = new InputEvent('input');
        this.editTarget.dispatchEvent(event);
      }

    }
  };
</script>

<style scoped>

</style>
