<template>
  <div>
    <v-list two-line>
      <v-list-tile avatar to="/Dashboard">
        <v-list-tile-avatar>
          <img :src="$store.state.iconImageURL">
        </v-list-tile-avatar>
      </v-list-tile>
    </v-list>
    <v-list>
      <v-list-tile v-for="(item, i) in lists" :key="i" :to="item.URL">
        <v-list-tile-action>
          <v-icon color="green" class="mx-auto my-2">{{ item.ICON }}</v-icon>
          <span wrap v-text="minifiedText(item.FORM)" style="font-size:8px;" class="mx-auto mt-2 white--text"></span>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>
  </div>
</template>

<script>
export default {
  data() {
    return {
      lists:[],
    };
  },
  created() {
    this.loadList();
  },
  methods: {
    showAlert(message, code) {
      let data = {
        color:code,
        message: message,
        alert:true
      };
      this.$store.commit('snackbar',data);
    },
    minifiedText(string){
      let length = string.length;
      if(length > 6){
        return string.substring(0,6)+'...';
      } else {
        return string;
      }
    },
    loadList() {
      var id = {
        Session_ID: this.$session.get("SESSION_ID"),
        IDX_M_Apps: 41
      };

      this.axios
        .post("Home/loadRootMenu", id)
        .then(response => this.lists = JSON.parse(response.data)['Table'])
        .catch(error => this.showAlert(error.message,'error'));
    }
  }
};
</script>

<style scoped>
</style>