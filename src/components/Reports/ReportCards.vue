<template>
  <v-layout row wrap>
    <v-flex xs12 md4 lg4 v-for="(k,i) in items" :key="i">
      <v-card>
        <v-card-title :class="k.color">
          <v-layout>
            <v-flex xs12 align-end flexbox>
              <span class="title white--text">{{ k.text}}</span>
            </v-flex>
          </v-layout>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text style="min-height:120px">
          <p class="text-xs-center display-3">
            <span>
              <v-tooltip bottom>
                <span slot="activator">{{ minifiedText(numberWithCommas(k.value)) }}</span>
                <span>{{ k.value }}</span>
              </v-tooltip>
            </span>
          </p>
        </v-card-text> 
        <v-divider></v-divider>  
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name:'report-cards',
  props:{
    items:null
  },
  data() {
    return {
    
    };
  },
  methods:{
    numberWithCommas(number) {
      if (number == undefined || number == null) number = 0;
      var parts = number.toString().split(".");
      return (
          parts[0].replace(/\B(?=(\d{3})+(?=$))/g, ",") +
          (parts[1] ? "." + parts[1] : "")
      );
    },
    minifiedText(string){
      let length = string.length;
      if(length > 6){
        return string.substring(0,6)+'...';
      } else {
        return string;
      }
    }
  }
};
</script>