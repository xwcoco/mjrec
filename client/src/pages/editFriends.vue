<template>
  <f7-page>
    <f7-navbar title="牌友" back-link="返回"></f7-navbar>
    <f7-list inline-labels no-hairlines-md>
      <f7-list-item>
        <f7-label>姓名</f7-label>
        <f7-input type="text" :value="name" @input="name = $event.target.value" placeholder="Name"
                  clear-button></f7-input>
      </f7-list-item>
    </f7-list>
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
    name: 'editFriends',
    data() {
      return {
        name: '',
        id: -1
      };
    },
    mounted() {
      let para = JSON.parse(sessionStorage.getItem('editFriendsPara'));
      this.name = para.name;
      this.id = para.id;
      console.log(para);
    },
    methods: {
      OkButtonClick(e) {
        let tmpName = this.name;
        const app = this.$f7;
        if (tmpName.length == 0) {
          app.toast.create({
            icon: '<i class="f7-icons">info</i>',
            text: '姓名不能为空',
            position: 'center',
            closeTimeout: 2000,
          })
            .open();
          return;
        }
        var obj = {};
        obj.id = this.id;
        obj.name = this.name;
        this.$http.post('/api/addFriend', obj)
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
              //app.router.back('/tab2/',{force:true});
              app.router.back();
              return;
            }
          }, response => {
            // error callback
            console.log('/api/addFriend error: ' + response.body);
          });
      }
    }
  };
</script>

<style scoped>

</style>
