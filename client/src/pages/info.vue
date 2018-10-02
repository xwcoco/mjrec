<template>
  <f7-page>
    <f7-block>
      <f7-card title="总成绩">
        <f7-list>
          <f7-row>
            <f7-col>
              <f7-list-item :title="all_score">

                <f7-icon slot="media" f7="money_yen_fill"></f7-icon>
              </f7-list-item>
            </f7-col>
            <f7-col>
              <f7-gauge
                type="circle"
                :value="all_succ"
                :value-text="all_succ_text"
                value-text-color="#4caf50"
                :valueFontSize="31"
                :valueFontWeight="700"
                :border-width="20"
                border-color="#2196f3"
                border-bg-color="#ffeb3b"
                bg-color="#ffeb3b"
                :label-text="all_num_text"
              ></f7-gauge>
            </f7-col>
          </f7-row>
        </f7-list>
      </f7-card>

      <f7-card title="本月成绩">
        <f7-list>
          <f7-row>
            <f7-col>
              <f7-list-item :title="mon_score">
                <f7-icon slot="media" f7="money_yen_fill"></f7-icon>
              </f7-list-item>
            </f7-col>
            <f7-col>
              <f7-gauge
                type="circle"
                :value="mon_succ"
                :value-text="`${mon_succ * 100}%`"
                value-text-color="#4caf50"
                :valueFontSize="31"
                :valueFontWeight="700"
                :border-width="20"
                border-color="#00FF00"
                border-bg-color="#ffeb3b"
                bg-color="#ffeb3b"
                :label-text="mon_num_text"
              ></f7-gauge>
            </f7-col>
          </f7-row>
        </f7-list>
      </f7-card>

      <f7-card title="上月成绩">
        <f7-list>
          <f7-row>
            <f7-col>
              <f7-list-item :title="lastmon_score">
                <f7-icon slot="media" f7="money_yen_fill"></f7-icon>
              </f7-list-item>
            </f7-col>
            <f7-col>
              <f7-gauge
                type="circle"
                :value="lastmon_succ"
                :value-text="lastmon_succ_text"
                value-text-color="#4caf50"
                :valueFontSize="31"
                :valueFontWeight="700"
                :border-width="20"
                border-color="#00FF00"
                border-bg-color="#ffeb3b"
                bg-color="#ffeb3b"
                :label-text="lastmon_num_text"
              ></f7-gauge>
            </f7-col>
          </f7-row>
        </f7-list>
      </f7-card>

    </f7-block>
  </f7-page>
</template>

<script>
  export default {
    name: 'info',
    data() {
      return {
        all_score: 0,
        all_succ: 0,
        all_succ_text:"0",
        all_num: 0,
        all_win: 0,
        all_num_text: '0 / 0',

        mon_score: 0,
        mon_succ: 0,
        mon_succ_text:"0",
        mon_num : 0,
        mon_win : 0,
        mon_num_text: '0 / 0',

        lastmon_score: 0,
        lastmon_num : 0,
        lastmon_succ_text:"0",
        lastmon_win : 0,
        lastmon_succ: 0,
        lastmon_num_text: '0 / 0'
      };
    },
    mounted() {
      console.log("about");

      var obj = {};
      obj.id = 0;

      this.$http.post('/api/getPersonSummery',obj)
        .then(response => {
          console.log(response.body);
          let para = response.body.data;
          this.all_score = para.all_score;
          this.all_num = para.all_num;
          this.all_win = para.all_winnum;
          if (this.all_num != 0) {
            let tmpvalue = this.all_win / this.all_num;
            tmpvalue = tmpvalue.toFixed(2);
            this.all_succ = tmpvalue;
            this.all_succ_text = (tmpvalue*100).toFixed(0) + "%";
          }
          else {
            this.all_succ = 0;
            this.all_succ_text = "0%";
          }

          this.all_num_text = this.all_win + '  /   ' + this.all_num;

          this.mon_score = para.mon_score;
          this.mon_num = para.mon_num;
          this.mon_win = para.mon_winnum;
          if (this.mon_num != 0) {
            let tmpvalue = this.mon_win / this.mon_num;
            tmpvalue = tmpvalue.toFixed(2);
            this.mon_succ = tmpvalue;
            this.mon_succ_text = (tmpvalue * 100).toFixed(0) + "%";
          }
          else {
            this.mon_succ = 0;
            this.mon_succ_text = "0%";
          }

          this.mon_num_text = this.mon_win + '  /   ' + this.mon_num;

          this.lastmon_score = para.lastmon_score;
          this.lastmon_num = para.lastmon_num;
          this.lastmon_win = para.lastmon_winnum;
          if (this.lastmon_num != 0) {
            let tmpvalue = this.lastmon_win / this.lastmon_num;
            tmpvalue = tmpvalue.toFixed(2);
            this.lastmon_succ = tmpvalue;
            this.lastmon_succ_text = (tmpvalue * 100).toFixed(0)+ "%";
          }
          else {
            this.lastmon_succ = 0;
            this.lastmon_succ_text = "0%";
          }

          this.lastmon_num_text = this.lastmon_win + '  /   ' + this.lastmon_num;


        }, response => {
          // error callback
          console.log('/api/getPersonSummery error: ' + response.body);
        });
    },
  };
</script>

