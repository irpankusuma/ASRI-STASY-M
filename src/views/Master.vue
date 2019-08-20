<template>
  <v-container fluid>
    <PageToolbar
      :header="'INVENTORYMAS'"
      :subheader="'MASTER'"
      :isLoading="$store.state.loading"
    />
    <v-layout column>
      <v-flex xs12 pb-1>
        <Card :items="admins" title="Admin" />  
      </v-flex>
      <v-flex xs12 pb-1>
        <Card :items="generals" title="General Setting" />  
      </v-flex>
      <v-flex xs12>
        <Card :items="others" title="Other Setting" v-if="others.length > 0" />  
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import PageToolbar from "@/components/Toolbar/PageToolbar"; // required
import Card from "@/components/Core/Card"; // required

export default {
  name:'dashboard',
  components:{
    PageToolbar,Card
  },
  created(){
    this.loadList();
  },
  data(){
    return {
      admins:[],
      generals:[],
      others:[],
      selectedAdvanceKeyword:null,

    }
  },
  methods:{
    loadList(){
      var id = { 
        Keyword: this.selectedAdvanceKeyword,
        Session_ID: this.$session.get('SESSION_ID')
      };
      this.axios
        .post("Master/loadMaster", id)
        .then(response => {
          this.generals = JSON.parse(response.data)['Table'] 
          this.admins = JSON.parse(response.data)['Table1']
          this.others = JSON.parse(response.data)['Table2']
        }).catch(error => this.showAlert("ERROR  : " + error.statusText, "error"));
    },

    //client
    showAlert(message, code) {
      let data = {
        color:code,
        message: message,
        alert:true
      };
      this.$store.commit('snackbar',data);
    },// DEFAULT
    client(url, id, callback) {
      this.axios
        .post(url, id)
        .then((res) => {
          for (var i in res["Table"]) {
            this.showAlert(
              res["Table"][i].StatusMessage,
              res["Table"][i].StatusCSS
            );
          }
          if (typeof callback === 'function') {
            callback(res);
          }
        })
        .catch((error) => {
          this.showAlert("ERROR  : " + error.statusText, "error");
        });
    },
  }
}
</script>

<style>

</style>
