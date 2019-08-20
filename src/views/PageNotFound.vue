<template>
  <div>
    <!-- toolbar -->
    <cs-toolbar  header="Desk" subheader="404" :isLoading="$store.state.loading" :backButton="true" />
    <v-container grid-list-xs fluid text-xs-center>
      <v-layout row wrap justify-center>
        <v-flex xs12>
          <!-- <iframe src="AppName/static/T-Rex.html" width="1024" height="400" frameborder="0" align="middle" /> --> 
          <iframe src="/static/T-Rex.html" width="1024" height="400" frameborder="0" align="middle" />
        </v-flex>
        <v-flex xs12>
          
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import PageToolbarVue from '@/components/Toolbar/PageToolbar.vue';

export default {
  name:'page-not-found',
  components:{
    'cs-toolbar': PageToolbarVue
  }
}
</script>

<style>

</style>
