<template>
  <v-container fluid>
    <Capture ref="capture" :html="html" />

    <center>
      <v-btn class="white" light @click="capture()"><v-icon left>photo_camera</v-icon> Capture all</v-btn>
    </center>

    <v-layout row wrap pr-2 ref="qrcode">
      <v-card v-for="(k,v) in items" :key="v" color="white">
        <v-card-text>
          <qriously :value="k.AssetID" :size="164" foreground="black" />
        </v-card-text>
      </v-card>  
    </v-layout>
  </v-container>
</template>

<script>
import Capture from "@/components/Core/Capture";

export default {  
  name:'print-qr',
  components:{
    Capture
  },
  props:{
    items:null
  },
  mounted(){
    this.html = this.$refs.qrcode;
  },
  data(){
    return {
      html:null,
    }
  },
  methods:{
    capture(){
      this.$refs.capture.capture();
    }
  }
}
</script>

<style>

</style>
