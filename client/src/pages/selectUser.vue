<template>
  <f7-page>
    <f7-navbar title="牌友列表" back-link="返回"></f7-navbar>
    <f7-block>
      <f7-list>
        <f7-list-item checkbox v-for="item in friendsList" :key="item.id"  :title="item.name" :checked="item.checked" @change="item.checked = $event.target.checked"
                      :myid="item.id" :mydata="item.name">
          <f7-icon slot="media" f7="person"></f7-icon>
        </f7-list-item>
      </f7-list>
    </f7-block>

    <f7-block>
      <f7-row>
        <f7-col>
          <f7-button @click="OkButtonClick">确认</f7-button>
        </f7-col>
      </f7-row>
    </f7-block>

  </f7-page>

</template>

<script>
  export default {
    name: 'selectUser',
    data() {
      return {
        friendsList: []
      };
    },
    mounted() {
      this.$http.get('/api/getFriends')
        .then(response => {
          console.log(response.body);
          this.friendsList = response.body.data;

          this.friendsList.forEach((item) => {
            item.checked = false;
          });
        }, response => {
          // error callback
          console.log('/api/getFriends error: ' + response.body);
        });
    },
    methods: {
      OkButtonClick(e) {
        let para = JSON.parse(sessionStorage.getItem('editGamePara'));

        let tmpUsers = [];

        this.friendsList.forEach((item) => {
          if (item.checked) {
            let obj = {};
            obj.userid = item.id;
            obj.name = item.name;
            obj.score = "";
            tmpUsers.push(obj);
          }
        });

        console.log("tmpusers");
        console.log(tmpUsers);
        console.log(para);

        para.users = tmpUsers;

        let paraStr = JSON.stringify(para);
        console.log('para = ' + paraStr);
        sessionStorage.setItem('editGamePara', paraStr);

        const app = this.$f7;
        app.router.back({force:true,ignoreCache:true});
        //app.router.back("/editGame/",{force:true,ignoreCache:true});
      }
    }
  };
</script>

<style scoped>

</style>
