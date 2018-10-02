<template>
  <f7-page infinite @infinite="onInfiniteScroll">
    <f7-block-title>对战列表</f7-block-title>
    <f7-block>
      <f7-row>
        <f7-col>
          <f7-button @click="addGame">增加对战</f7-button>
        </f7-col>
      </f7-row>
    </f7-block>
    <f7-block >
      <f7-list media-list>
        <!-- :link="/editGame/ + item.id + '/'" -->
        <f7-list-item swipeout v-for="item in gameList" link="#" :key="item.id"  :title="item.gamedate" :text="item.win+'   '+item.lost"  @swipeout:deleted="onDeleted" :myid="item.id" @click="gameItemClick">
          <f7-icon slot="media" f7="money_dollar_fill"></f7-icon>
          <f7-swipeout-actions right>
            <f7-swipeout-button delete confirm-text="确认删除此对局吗?">删除</f7-swipeout-button>
          </f7-swipeout-actions>
        </f7-list-item>
      </f7-list>
    </f7-block>
  </f7-page>
</template>

<script>
  export default {
  name: 'games',
  data() {
    return {
      gameList: [],
      loadRecNum : 9,
      loadRecOffset : 0,
      loadIsEnd : false,
      loading : false,
    };
  },
  mounted() {
    let para = {};
    para.limit = this.loadRecNum;
    para.offset = this.loadRecOffset;

    this.$http.post('/api/getGamesLimit',para)
      .then(response => {
        console.log(response.body);
        let data = response.body.data;

        let tmpLen = data.length;
        if (tmpLen < this.loadRecNum) {
          this.loadIsEnd = true;
        }
        this.loadRecOffset += tmpLen;

        this.gameList = data;
      }, response => {
        // error callback
        console.log('/api/gameList error: ' + response.body);
      });

  },
  methods: {
    onDeleted(e) {
      const app = this.$f7;
      let id = parseInt(e.target.getAttribute('myid'));

      let para = {};
      para.id = id;

      this.$http.post('/api/deleteGame', para)
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
            return;
          }
        }, response => {
          // error callback
          console.log('/api/deleteFriend error: ' + response.body);
        });
    },
    gameItemClick(e) {
      console.log("gameItemClick");
      console.log(e);

      const getMyId = (function f(e) {
        let id = e.getAttribute('myid');
        if (id == null) {
          return f(e.parentElement);
        } else {
          return id;
        }
      });

      let id = getMyId(e.target);

      let para = {};
      para.id = parseInt(id);

      const app = this.$f7;

      this.$http.post('/api/getGameDetail', para)
        .then(response => {
          let ret = response.body.error;
          let data = response.body.data;

          if (parseInt(ret) == 0) {
            para.users = data;

            console.log(para);
            let paraStr = JSON.stringify(para);
            sessionStorage.setItem('editGamePara', paraStr);

            app.router.navigate('/editGame/');
          }
          else {
            app.toast.create({
              icon: '<i class="f7-icons">help</i>',
              text: data,
              position: 'center',
              closeTimeout: 2000,
            })
              .open();
          }
        })
    },
    addGame() {
      const app = this.$f7;
      let para = {};
      para.id = -1;
      para.users = [];
      let paraStr = JSON.stringify(para);
      console.log('para = ' + paraStr);
      sessionStorage.setItem('editGamePara', paraStr);
      app.router.navigate('/editGame/');

    },
    onInfiniteScroll(e) {
      console.log("onInfiniteScroll");

      if (this.loading) {
        return;
      }

      if (this.loadIsEnd) {
        return;
      }

      this.loading = true;

      let _this = this;

      let para = {};
      para.limit = this.loadRecNum;
      para.offset = this.loadRecOffset;

      console.log(para);

      this.$http.post('/api/getGamesLimit',para).then(response => {
        _this.loading = false;
        let data = response.body.data;

        let tmpLen = data.length;
        if (tmpLen < _this.loadRecNum) {
          _this.loadIsEnd = true;
        }
        _this.loadRecOffset += tmpLen;

        console.log(data);

        data.forEach((item) => {
          _this.gameList.push(item);
        });



        if (_this.loadIsEnd) {
          //_this.$f7.detachInfiniteScroll(_this.$$('.infinite'))
          _this.$$('.infinite-scroll-preloader').remove()
        }
      });
    }
  }
};
</script>

