<template>
  <v-app>
    <!-- DILAOG ALERT AND SNACKBAR -->
    <v-dialog v-model="$store.state.alert" hide-overlay width="300">
      <v-card :color="$store.state.color" light>
        <v-card-text>
					<v-layout row>
						<v-flex xs2>
							<v-icon left>information</v-icon><br>		
						</v-flex>
						<v-flex xs8>
							<span class="subheading">{{ $store.state.message }}</span>
						</v-flex>
					</v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="$store.state.snackbar" top multi-line :color="$store.state.color" :timeout="$store.state.timeout">
      {{$store.state.message}}
      <v-btn flat dark @click.native="$store.commit('snackbar',null)">Close</v-btn>
    </v-snackbar>

    <!-- MENU  -->
    <v-navigation-drawer
      dark
      v-if="showMenu"
      persistent
      :mini-variant="true"
      :clipped="false"
      v-model="drawer"
      enable-resize-watcher
      permanent
      fixed
      app
      flat
      :touchless="true"
    >
      <Menu />
    </v-navigation-drawer>

    <v-content>
      <router-view />
    </v-content>
    <v-footer class="pa-3">
      <v-spacer></v-spacer>
      <div
        class="caption"
      >&copy;{{ new Date().getFullYear() }}. P.T Alam Sutera, Tbk. Developed by ICT ADID. Ver.1.00</div>
    </v-footer>
  </v-app>
</template>

<script>
import Menu from '@/components/Navigation/Navigation';
export default {
  components: {
    Menu
  },
  data() {
    return {
      drawer: true
    };
  },
  computed: {
    showMenu() {
      return this.$store.state.showMenu;
    }
  },
};
</script>


