<template>
  <f7-page>
    <f7-navbar :title="username + '  的记录'" back-link="返回"></f7-navbar>
    <f7-block>
      <f7-list>
        <f7-list-item v-for="item in personGames" :key="item.id" link="#" :title="item.gamedate"
                      :after="item.score" :myid="item.id" :mydata="item.name" @click="itemClick">
          <f7-icon slot="media" f7="person"></f7-icon>
        </f7-list-item>
      </f7-list>
    </f7-block>
  </f7-page>
</template>

<script>
  export default {
    name: 'personGames',
    data() {
      return {
        personGames: [],
        username: "",
        userid: 0,
      };
    },
    mounted() {
      console.log("persongames");

      let para = JSON.parse(sessionStorage.getItem('personGamePara'));

      console.log(para);


      this.userid = para.id;
      this.username = para.name;

      var obj = {};
      obj.id = this.userid;

      this.$http.post('/api/getPersonGames',obj)
        .then(response => {
          console.log(response.body);
          this.personGames = response.body.data;
        }, response => {
          // error callback
          console.log('/api/getPersonGames error: ' + response.body);
        });
    },
    methods: {
      itemClick(e) {

        let xwulity = require('../xwutility');

        let id = xwulity.getParaById(e.target,"myid");

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
      }
    }
  };
</script>

<style scoped>

</style>
