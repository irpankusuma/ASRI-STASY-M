<template>
  <v-card>
    <v-toolbar flat dense>
      <v-btn icon @click="close()" dark>
        <v-icon>close</v-icon>
      </v-btn>
      <v-toolbar-title>Print</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn dark flat @click="close()">close</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-card-text>
      <iframe
        width="100%"
        height="1000px"
        :src="'https://apps.alam-sutera.com/AsriReport/Report/Common.aspx?param='+ param +'&reportType='+ type +'&idx='+IDX"
        frameborder="0"
        allowfullscreen>
      </iframe>
    </v-card-text>
    </v-card>
</template>

<script>
export default {
  name: 'print',
  props: {
    IDX: null,
    type: null,
    param: null
  },
  methods: {
    close() {
      this.$emit("send-filter", false);
    },
    query(){
        let esc = encodeURIComponent;
        let q = Object.keys(this.params)
            .map(k => esc(k) + '=' + esc(this.params[k]))
            .join('&');
        
        return q;
    }
  }
};
</script>