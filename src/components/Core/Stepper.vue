<template>
  <v-stepper class="mb-1" v-model="step">
    <v-stepper-header>
      <v-stepper-step v-for="(k,v) in lists" :key="v" :step="k.Number == undefined ? 1 : k.Number" :complete="k.isComplete == 1 ? true : false">{{ k.Name }}</v-stepper-step>
    </v-stepper-header>
  </v-stepper>
</template>

<script>
export default {
  name:'stepper',
  props:{ 
    id:null
  },
  mounted(){
    this.loadList();
  },
  data(){
    return {
      lists:[],
      step:0,
    }
  },
  methods:{
    loadList(){
      var id = { IDX_T_OutRequestForm: Number(this.id)};
      this.axios
        .post("ATKRequest/ManageRequestDetail_Stepper", id)
        .then(response => {
          this.lists = JSON.parse(response.data)['Table'];
        })
        .catch(error => {
          this.showAlert("ERROR  : " + error.statusText, "error");
        });
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
  },
}
</script>

<style>

</style>
