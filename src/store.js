import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    showMenu: false,
    loading: false,
    alert: false,
    snackbar: false,
    message:'',
    color:'info',
    timeout:6000,
    iconImageURL:'https://apps.alam-sutera.com/SharedAsset/general/asset_ict.png',
    uploadUrl: 'http://10.10.0.28/WebServiceATKGA/api/',
    uploadPath: '',
  },
  getters: {
    menuShow: state => (state.showMenu = true),
    disableMenu: state => (state.showMenu = false),
  },
  mutations:{
    toggle(state, value) {
        state.showMenu = value
    },
    loading(state,b){
        state.loading = b;
    },
    alert(state,value){
        if(value != null || value != undefined){
            state.alert = value.alert;
            state.color = value.color;
            state.message = value.message;
        } else {
            state.alert = false;
        }
    },
    snackbar(state,value){
        if(value != null || value != undefined){
            state.snackbar = value.alert;
            state.color = value.color;
            state.message = value.message;
            state.timeout = value.timeout;
        } else{
            state.snackbar = false;
        }
    },
  }
});
