<template>
  <f7-page>
    <f7-navbar :title="username + '  的记录'" back-link="返回"></f7-navbar>
    <f7-block>
      <f7-list accordion-list>>
        <f7-list-item accordion-item v-for="item in personGames" :key="item.id" :title="item.yearmonth"
                      :after="item.score" :myid="item.id" @click="loadData">
          <f7-icon slot="media" f7="person"></f7-icon>

          <f7-accordion-content>
            <f7-card>
            <f7-list>
              <f7-list-item v-for="game in gameList[item.id]" :key="game.gamedate" :title="game.gamedate" :after="game.score" link="#" :myid="game.id" @click="itemClick">
                <f7-icon slot="media" f7="money_dollar_fill"></f7-icon>
              </f7-list-item>
            </f7-list>
            </f7-card>
          </f7-accordion-content>


        </f7-list-item>
      </f7-list>
    </f7-block>
  </f7-page>
</template>

<script>
  let xwutily = require('../xwutility');

  export default {
    name: 'personGamesByMonth',
    data() {
      return {
        personGames: [],
        username: "",
        userid: 0,
        gameList: [],
      };
    },
    mounted() {
      console.log("persongamesbymonth");

      let para = JSON.parse(sessionStorage.getItem('personGamePara'));

      console.log(para);


      this.userid = para.id;
      this.username = para.name;

      let obj = {};
      obj.id = this.userid;

      this.$http.post('/api/getPersonMonthGame',obj)
        .then(response => {
          console.log(response.body);
          this.personGames = response.body.data;

          this.personGames.forEach((item) => {
            this.gameList.push(null);

          });
        }, response => {
          // error callback
          console.log('/api/getPersonGames error: ' + response.body);
        });
    },
    methods: {
      loadData(e) {
        console.log("loaddata");
        let id = xwutily.getParaById(e.target,"myid");
        console.log(id);

        if (this.gameList[id] != null) {
          return;
        }

        let para = this.personGames[id];
        para.userid = this.userid;
        console.log(para);

        this.$http.post('/api/getPersonMonthDetailGame',para).then(response => {
          let ret = response.body.error;
          let data = response.body.data;
          console.log(data);
          if (parseInt(ret) == 0) {
            this.gameList.splice(para.id,1,data);
            let event = new Event("click");
            e.target.dispatchEvent(event);
            e.target.dispatchEvent(event);
          }
        });
      },
      itemClick(e) {

        let id = xwutily.getParaById(e.target,"myid");

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

