<template>
  <v-card>
    <v-card-title>
      <v-subheader class="title pl-2">{{ title }}</v-subheader>
      <v-spacer></v-spacer>
      <v-subheader v-if="charts != null">
        <v-btn flat @click="legend =! legend">
          <span>LEGEND</span>
          <v-icon right :color="legend ? 'green lighten-2' : 'red'">{{ legend ? 'visibility' : 'visibility_off' }}</v-icon>
        </v-btn>
      </v-subheader>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <pie-chart v-if="charts != null" :data="charts" :legend="legend" width="auto" height="300px" :download="true"></pie-chart>     
      <v-text-field outline label="Search" v-model="search" prepend-icon="search" hide-details></v-text-field>
      <v-data-table :headers="headers" :items="items" class="elevation-0" :search="search">
        <template v-slot:items="props">
          <td v-for="(k,i) in body" :key="i" :class="k.class">
            <span v-if="k.type == 'number'">{{ numberWithCommas(get(props.item,k.value)) }}</span>
            <span v-else>{{ get(props.item,k.value) }}</span>
          </td>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name:'report-graph',
  props:{
    title:null,
    headers:null,
    body:null,
    items:null,
    charts:null
  },
  data(){
    return {
      legend:false,
      search:null
    }
  },
  methods:{
    get(arr,elm){
      elm = elm.replace(/\[(\w+)\]/g, '.$1');
      elm = elm.replace(/^\./, '');
      let el = elm.split('.');

      for (let i = 0, n = el.length; i < n; ++i) {
          let k = el[i];
          if (k in arr) {
              arr = arr[k];
          } else {
              return;
          }
          return arr;
      }
    },
    numberWithCommas(number) {
      if (number == undefined || number == null) number = 0;
      var parts = number.toString().split(".");
      return (
          parts[0].replace(/\B(?=(\d{3})+(?=$))/g, ",") +
          (parts[1] ? "." + parts[1] : "")
      );
    },
  }
}
</script>

<style>

</style>
