<template>
  <f7-page>
    <f7-block-title>牌友列表</f7-block-title>
    <f7-block>
      <f7-row>
        <f7-col>
          <f7-button @click="addUser">增加</f7-button>
        </f7-col>
      </f7-row>
    </f7-block>
    <f7-block>
      <f7-list>
        <f7-list-item swipeout v-for="item in friendsList" :key="item.id" link="#" :title="item.name"
                      :after="item.score" @swipeout:deleted="onDeleted" :myid="item.id" :mydata="item.name" @click="friendItemClick">
          <f7-icon slot="media" f7="person"></f7-icon>
          <f7-swipeout-actions right>
            <f7-swipeout-button overswipe color="green" @click="editData" :mydata="item.name" :myid="item.id">编辑
            </f7-swipeout-button>
            <f7-swipeout-button delete confirm-text="确认删除此朋友吗?">删除</f7-swipeout-button>
          </f7-swipeout-actions>
        </f7-list-item>
      </f7-list>
    </f7-block>
  </f7-page>
</template>

<script>


  export default {
    name: 'friends',
    data() {
      return {
        friendsList: []
      };
    },
    mounted() {
      console.log('Device is ready!');
      this.$http.get('/api/getFriends')
        .then(response => {
          console.log(response.body);
          this.friendsList = response.body.data;
        }, response => {
          // error callback
          console.log('/api/getFriends error: ' + response.body);
        });

    },
    methods: {
      onDeleted(e) {
        const app = this.$f7;
        let name = e.target.getAttribute('mydata');
        let id = parseInt(e.target.getAttribute('myid'));

        if (id == 0) {
          app.toast.create({
            icon: '<i class="f7-icons">info</i>',
            text: name + '不能删除！',
            position: 'center',
            closeTimeout: 2000,
          })
            .open();
          app.router.back();
          //app.router.back('/tab2/', { force: true });
          return;
        }
        let para = {};
        para.id = id;
        para.name = name;

        this.$http.post('/api/deleteFriend', para)
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
      editData(e) {
        console.log(e);
        let name = e.target.getAttribute('mydata');
        let id = e.target.getAttribute('myid');
        console.log(id);
        console.log(name);

        let para = {};
        para.id = parseInt(id);
        para.name = name;
        let paraStr = JSON.stringify(para);
        console.log('para = ' + paraStr);
        sessionStorage.setItem('editFriendsPara', paraStr);

        const app = this.$f7;

        app.router.navigate('/editFriends/');

      },
      addUser() {
        const app = this.$f7;
        let para = {};
        para.id = -1;
        para.name = '';
        let paraStr = JSON.stringify(para);
        console.log('para = ' + paraStr);
        sessionStorage.setItem('editFriendsPara', paraStr);
        app.router.navigate('/editFriends/');

      },
      friendItemClick(e) {
        console.log("gameItemClick");
        console.log(e);

        const getMyId = (function f(e) {
          if (e == null) {
            return null;
          }
          let id = e.getAttribute('myid');
          if (id == null) {
            return f(e.parentElement);
          } else {
            return id;
          }
        });

        const getMyName = (function f(e) {
          if (e == null) {
            return null;
          }
          let id = e.getAttribute('mydata');
          if (id == null) {
            return f(e.parentElement);
          } else {
            return id;
          }
        });

        let id = getMyId(e.target);
        let name=getMyName(e.target);

        let para = {};
        para.id = parseInt(id);
        para.name = name;
        let paraStr = JSON.stringify(para);
        sessionStorage.setItem('personGamePara', paraStr);

        const app = this.$f7;

        app.router.navigate('/personGamesByMonth/');


      }
    }
  };
</script>

<style scoped>

</style>
