<template>
  <div>
    <!-- TOOLBAR -->
    <v-toolbar dense app color="primary" extended extension-height="0" :scroll-off-screen="true">
      <!-- BACK BUTTON  -->
      <v-btn v-if="backButton" dark flat icon @click="$router.go(-1)">
        <v-icon large>chevron_left</v-icon>
      </v-btn>
      <v-progress-circular v-if="isLoading" :indeterminate="isLoading" background-color="blue" color="lime" width="3"></v-progress-circular> 
      <Toggle v-show="session != null || session != undefined" v-else />
      <!-- /BACK BUTTON  -->
      <!-- TITLE -->
      <v-toolbar-title dark class="text-uppercase">
        <span class="white--text">{{ isLoading ? 'PLEASE' : header }}</span>
        <span class="font-weight-light white--text">{{ isLoading ? 'WAIT' : ' '+subheader}}</span>
      </v-toolbar-title>
      <!-- /TITLE -->
      <!-- SEARCH -->
      <v-spacer></v-spacer>
      <v-text-field
        v-show="showSearch"
        class="my-auto"
        dense
        solo-inverted
        label="Search..."
        id="id"
        v-model="Keyword"
        clearable
        @keyup.enter.native="searchList()"
        append-icon="search"
        @click:append="searchList()"
      ></v-text-field>
      <v-toolbar-items v-if="searchBar">
        <v-btn flat
          v-if="showSearch==false"
          @click.native="showSearch=true"
          small
          color="success"
        >
          <v-icon>search</v-icon>
        </v-btn>
        <v-btn v-else @click.native="showSearch=false" flat small color="red">
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar-items>
      <!-- /SEARCH -->
      <!-- USER CARD -->
      <v-menu bottom left offset-y transition="slide-x-transition" v-if="user!=null">
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon flat color="cyan">
            <v-icon color="cyan">account_circle</v-icon>
          </v-btn>
        </template>
        <v-card dark width="250">
          <v-card-text class="text-xs-center">
            <v-avatar size="60" color="lime">
              <v-icon large color="black">face</v-icon>
            </v-avatar>
          </v-card-text>
          <v-card-text class="text-xs-center">
            <h4>{{$session.get("FULLNAME")}}<br>({{$session.get("NIK")}})</h4>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn block color="red" dark @click="logout()">
              <v-icon left>input</v-icon>&nbsp; Logout
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
      <!-- /USER CARD -->
    </v-toolbar>
    <!-- /TOOLBAR -->
  </div>
</template>



<script>
import Toggle from '@/components/Core/Toggle';

export default {
  components:{
    Toggle
  },
  props: {
    header: null, //string
    subheader: null, //string
    isLoading: null, //bool
    backButton: true, // bool
    searchBar: false, // bool
    scrollOff: true // bool
  },
  data() {
    return {
      Keyword: null,
      showSearch: false,
      user: this.$session.get("SESSION_ID"),
      nik: this.$session.get("NIK"),
      session: this.$session.get('SESSION_ID'),
    };
  },
  methods: {
    logout() {
      location.reload();
      this.$session.clear();
    },
    searchList() {
      this.$emit("search", this.Keyword);
    }
  }
};
</script>