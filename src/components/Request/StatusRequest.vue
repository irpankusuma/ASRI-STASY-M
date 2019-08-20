<template>
    <v-stepper class="mb-1 grey lighten-1" v-model="stepper">
      <v-stepper-header>
        <v-stepper-step :color="k.StatusColor" v-for="(k,v) in items" :key="v" :step="k.Number" :complete="k.isComplete == 1 ? true : false">
          <span class="subtitle">{{ k.Name.toUpperCase() }}</span>
        </v-stepper-step>
      </v-stepper-header>
    </v-stepper>
</template>

<script>
export default {
  name:'request-status',
  props:{
    id:null
  },
  mounted(){
    this.loadList();
  },
  data(){
    return {
      items:[],
      stepper:0,
    }
  },
  methods:{
    loadList(){
      let id = { IDX_T_OutRequestForm: Number(this.id) }
      this.axios
        .post("ATKManage/ManageRequestDetail_Stepper",id)
        .then(response => {
          this.items = JSON.parse(response.data)['Table'];
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
    },
  }
}
</script>

<style>

</style>
