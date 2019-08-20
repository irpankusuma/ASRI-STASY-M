<template>
  <v-container fluid>
    <PageToolbar
      :header="'ASRI-STASY'"
      :subheader="'STOCK'"
      :isLoading="$store.state.loading"
    />
    
    <v-toolbar dark>
      <v-toolbar-items>
        <v-btn @click="newStockDialog =! newStockDialog" v-if="isNew"><v-icon left color="lime">add</v-icon>STOCK BARU</v-btn>
      </v-toolbar-items>
      <Search @search="actionSearch" />
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn @click="loadList()"><v-icon>refresh</v-icon></v-btn>
        <v-btn @click="filterDialog =! filterDialog"><v-icon :color="filterDialog ? 'red' : 'cyan'">{{ filterDialog ? 'clear' : 'search' }}</v-icon></v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-card dark>
      <v-card-text>
        <v-data-table :headers="headers" :items="lists" :expand="true">
          <template v-slot:items="props">
            <tr>
              <td class="text-xs-center">
                <v-btn flat :to="'/stock/'+props.item.IDX_M_InventoryType"><v-icon color="cyan" left>launch</v-icon>DETAIL</v-btn>
              </td>
              <td class="text-xs-center">{{ props.item.IDX_M_InventoryTypeCode }} - {{ props.item.InventoryTypeName }}</td>
              <td class="text-xs-center">{{ props.item.Total }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-navigation-drawer right app v-model="filterDialog" width="380">
      <v-toolbar flat dense>
        <v-toolbar-title>Advance Search</v-toolbar-title>
      </v-toolbar>
      <v-spacer></v-spacer>
      <v-container grid-list-md>
        <v-autocomplete outline v-model="selectedAdvanceIDX_M_InventoryType" :items="listsType" append-icon="cancel" label="Type" item-text="InventoryTypeName" item-value="IDX_M_InventoryType" multiple chips deletable-chips></v-autocomplete>
      </v-container>
      <v-layout row wrap>
        <v-container grid-list-xs>
          <center>
            <v-btn dark small @click="loadLists()" fab><v-icon>search</v-icon></v-btn>  
          </center>
        </v-container>
      </v-layout>
    </v-navigation-drawer> 

    <!-- VIEW REQUEST DETAIL -->
    <v-dialog lazy
      v-model="newStockDialog"
      scrollable
      persistent :overlay="false"
      max-width="1200px"
      transition="bottom-dialog-transition"
    >
      <v-card>
        <v-toolbar dark dense flat color="cyan darken-3">
          <v-toolbar-title>
            <v-progress-circular v-if="$store.state.loading" :indeterminate="$store.state.loading" background-color="blue" color="lime" width="3"></v-progress-circular> 
            BUAT STOCK
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn flat small @click="newStockDialog =! newStockDialog"><v-icon>clear</v-icon></v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <NewStock @close="closeNewStock" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import PageToolbar from "@/components/Toolbar/PageToolbar"; // required
import ActionMenu from "@/components/Core/ActionMenu"; // required
import Search from "@/components/Core/Search"; // required
import NewStock from "@/components/Stock/NewStock"; // required

export default {
  name:'stock',
  components:{
    PageToolbar,ActionMenu,Search,NewStock
  },
  created(){
    this.loadList();
  },
  watch:{
    selectedAdvanceIDX_M_InventoryType(){
      this.loadList();
    },
  },
  data(){
    return {
      headers: [
        { text:'LIHAT',align:'center',sortable:false,value:null },
        { text:'TYPE NAME',align:'center',sortable:true,value:'InventoryTypeName' },
        { text:'TOTAL',align:'center',sortable:true,value:'Total' },
      ],
      lists:[],
      listsType:[],
      //Stock
      selectedAdvanceIDX_M_InventoryType:[],
      selectedAdvanceTimePeriod:0,
      selectedAdvanceDateFrom:'1900-01-01',
      selectedAdvanceDateTo:'3000-01-01',
      
      //pagination
      pageSize:100,
      maxPage:0,
      currentPage:1,
      totalRecords:0,
      isNew:false,

      newStockDialog:false,
      filterDialog:false,
    }
  },
  methods:{
    actionSearch(p){
      this.selectedKeyword = p.Keyword;
      setTimeout(() => this.loadList(), 500);
    },
    closeNewStock(p){
      this.newStockDialog = p;
      setTimeout(() => this.loadList(), 500);
    },
    loadList(){
      var id = { 
        Keyword:this.selectedKeyword,
        IDX_M_InventoryType:this.selectedAdvanceIDX_M_InventoryType.toString(),
        TimePeriod:this.selectedAdvanceTimePeriod,
        DateFrom:this.selectedAdvanceDateFrom,
        DateTo:this.selectedAdvanceDateTo,
        //sort and pagination
        PageSize: this.pageSize,
        MaxPage: this.maxPage,
        CurrentPage: this.currentPage
      };
      this.axios
        .post("Stock/loadStock", id)
        .then(response => {
          this.lists = JSON.parse(response.data)['Table'];
          this.totalRecords = JSON.parse(response.data)['Table1'][0].TotalRecords;
          this.maxPage = JSON.parse(response.data)['Table1'][0].MaxPage;
          this.isNew = JSON.parse(response.data)['Table1'][0].isNew;
        })
        .then(() => setTimeout(() => this.loadFilter(), 500))
        .catch(error => this.showAlert("ERROR  : " + error.statusText, "error"));
    },
    loadFilter(){
      this.axios
        .post("Stock/loadAdditionalStock", { Session_ID: this.$session.get('SESSION_ID') })
        .then(response => {
          this.listsType = JSON.parse(response.data)['Table4'];
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
