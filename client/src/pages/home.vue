<template>
  <f7-page>
    <f7-navbar>
      <f7-nav-left>
        <f7-link icon-if-ios="f7:menu" icon-if-md="material:menu" panel-open="left"></f7-link>
      </f7-nav-left>
      <f7-nav-title>成绩记录</f7-nav-title>
    </f7-navbar>

    <f7-toolbar tabbar>
      <f7-link data-route-tab-id="tab1" href="/" tab-link-active icon-ios="f7:info_fill" ></f7-link>
      <f7-link data-route-tab-id="tab2" href="/tab2/" icon-ios="f7:persons_fill" ></f7-link>
      <f7-link data-route-tab-id="tab3" href="/tab3/" icon-ios="f7:money_yen_fill" ></f7-link>
    </f7-toolbar>
    <f7-tabs tabs-routable>
      <f7-tab id="tab1" tab-active></f7-tab>
      <f7-tab id="tab2" ></f7-tab>
      <f7-tab id="tab3" ></f7-tab>
    </f7-tabs>

  </f7-page>
</template>
<script>
  export default {}
</script>
