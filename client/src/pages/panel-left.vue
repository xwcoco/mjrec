<template>
  <f7-page>
    <f7-navbar title="菜单"></f7-navbar>
    <f7-block-title></f7-block-title>
    <f7-list>
      <f7-list-item link="/about/" title="About" view="#main-view" panel-close></f7-list-item>
      <f7-list-item link="#" title="增加记录" view="#main-view" panel-close @click="addGame"></f7-list-item>
    </f7-list>
  </f7-page>
</template>
<script>
export default {
  methods: {
    addGame(e) {
      const app = this.$f7;
      let para = {};
      para.id = -1;
      para.users = [];
      let paraStr = JSON.stringify(para);
      console.log('para = ' + paraStr);
      sessionStorage.setItem('editGamePara', paraStr);

      app.panel.close("left");
      app.router.navigate('/editGame/');

    }
  }
}
</script>
