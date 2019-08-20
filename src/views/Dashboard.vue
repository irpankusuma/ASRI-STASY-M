<template>
  <v-container fluid>
    <PageToolbar
      :header="'INVENTORYMAS'"
      :subheader="'Dashboard'"
      :isLoading="$store.state.loading"
    />
    <span class="display-1 text-xs-left mb-1">SCORE</span>
    <v-divider class="mb-2 mt-2"></v-divider>
    <ReportCard :items="lists" />

  </v-container>
</template>

<script>
import PageToolbar from "@/components/Toolbar/PageToolbar"; // required
import ReportCard from "@/components/Reports/ReportCards"

export default {
  name:'dashboard',
  components:{
    PageToolbar,ReportCard
  },
  created(){
    this.loadList();
  },
  data(){
    return {
      lists:[],

    }
  },
  methods:{
    loadList(){
      var id = { Session_ID: this.$session.get('SESSION_ID')};
      this.axios
        .post("Home/loadAdminDashboard", id)
        .then(response => this.lists = JSON.parse(response.data)['Table'])
        .catch(error => this.showAlert("ERROR  : " + error.statusText, "error"));
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
