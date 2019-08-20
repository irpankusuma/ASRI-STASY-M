<template>
  <v-container grid-list-xs fluid text-xs-center>
    <!-- TOOLBAR -->
    <PageToolbar
      :header="'ASRI-STASY'"
      :subheader="'Login'"
      :backButton="false"
      :isLoading="$store.state.loading"
      :searchBar="false"
    />
    <!-- /TOOLBAR -->
    <!-- LISTS -->
    <v-layout row wrap justify-center>
      <v-flex xs12 md3 lg3>
        <v-card dark flat>
          <v-card-title primary-title>
            <h2 class="mb-3 text-uppercase">
              ASRI-STASY
              <span class="font-weight-light">MANAGE</span>
            </h2>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-text-field solo-inverted label="NIK" prepend-icon="face" v-model="username"></v-text-field>
            <v-text-field
              :append-icon="showPass ? 'visibility' : 'visibility_off'"
              :type="showPass ? 'text' : 'password'"
              solo-inverted
              label="Password"
              prepend-icon="lock"
              v-model="password"
              @keyup.enter.native="login()"
              @click:append="showPass = !showPass"
            ></v-text-field>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :loading="$store.state.loading" :disabled="$store.state.loading" color="cyan" @click="login()">Login</v-btn>
          </v-card-actions>
        </v-card>
        <h3>Need access?
          <v-btn flat small class="success" href="https://apps.alam-sutera.com/ictticket/NewTicket" target="_blank">click here</v-btn>
        </h3>
      </v-flex>
    </v-layout>
    <!-- /LISTS -->
  </v-container>
</template>

<script>
import PageToolbar from "@/components/Toolbar/PageToolbar"; // required
export default {
  components:{
    PageToolbar
  },
  data() {
    return {
      username: null,
      password: null,
      showPass: false
    };
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
    login() {
      var id = {
        NIK: this.username,
        Password: this.password
      };

      if(!this.username || !this.password){
        this.showAlert("Please input username and password.","error");
        return false;
      }

      this.axios
        .post("Home/validateUserLogin", id)
        .then(response => {
          console.log(response.data);
          let data = JSON.parse(response.data)['Table'];
          if(data[0].Session_ID !== ""){
            this.$session.set("SESSION_ID",data[0].Session_ID);
            this.$session.set("FULLNAME",data[0].Name);
            this.$session.set("NIK",data[0].NIK);
            setTimeout(() => this.$router.push("/Dashboard"), 500);
          } else {
            this.showAlert("Login Failed..","error");
          }
        })
        .catch(error => this.showAlert("ERROR  : " + error.statusText, "error"));
    },
  }
};
</script>