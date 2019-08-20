<template>
  <v-container fluid>
    <PageToolbar
      :header="'INVENTORYMAS'"
      :subheader="'OPNAME'"
      :isLoading="$store.state.loading"
    />
    
    <v-toolbar dark>
      <v-toolbar-items>
        <v-btn flat @click="newOpnameDialog =! newOpnameDialog"><v-icon left color="lime">add</v-icon>TAMBAH OPNAME</v-btn>
      </v-toolbar-items>
      <Search @search="actionSearch" />
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn flat @click="loadList()"><v-icon>refresh</v-icon></v-btn>
        <v-btn flat @click="filterDialog =! filterDialog"><v-icon :color="filterDialog ? 'red' : 'cyan'">{{ filterDialog ? 'clear' : 'search' }}</v-icon></v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-card dark>
      <v-card-text>
        <v-data-table :headers="headers" :items="lists" :expand="true">
          <template v-slot:items="props">
            <tr>
              <td class="text-xs-center">
                <ActionMenu v-if="props.item.isUpdate || props.item.isLocked || props.item.isVerify || props.item.isCancel"
                  :id="props.item.IDX_T_InventoryStockOpnameHeader"
                  :isUpdate="props.item.isUpdate"
                  :isLocked="props.item.isLocked"
                  :isVerify="props.item.isVerify"
                  :isCancel="props.item.isCancel"
                  @action="actionMenu"
                />
              </td>
              <td class="text-xs-left">
                <v-chip flat><v-icon left color="red darken-1">fiber_manual_record</v-icon> {{ props.item.TotalLock }}</v-chip>
                <v-chip flat><v-icon left color="green">fiber_manual_record</v-icon> {{ props.item.TotalVerify }}</v-chip>
                <!-- <v-chip flat><v-icon left :color="props.item.OpnameStatusColor">fiber_manual_record</v-icon> {{ props.item.OpnameStatus.toUpperCase() }}</v-chip> -->
              </td>
              <td class="text-xs-center">
                <v-btn flat round small @click="openViewOpname(props.item.IDX_T_InventoryStockOpnameHeader)">
                  <v-icon color="cyan" left>launch</v-icon>{{ props.item.BatchNo }}
                </v-btn>
              <td class="text-xs-center">{{ props.item.CompanyName }}</td>
              <td class="text-xs-center">{{ $moment(props.item.OpnameDate).format('DD MMMM YYYY | HH:mm') }}</td>
              <td class="text-xs-center">{{ props.item.Remarks }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- FILTER -->
    <v-navigation-drawer right app v-model="filterDialog" width="380">
      <v-toolbar flat dense>
        <v-toolbar-title>Advance Search</v-toolbar-title>
      </v-toolbar>
      <v-spacer></v-spacer>
      <v-container grid-list-md>
        <v-autocomplete outline v-model="selectedAdvanceCompany" :items="listsCompany" label="Company" item-text="CompanyName" item-value="IDX_M_Company" multiple chips deletable-chips></v-autocomplete>
        <v-autocomplete outline v-model="selectedAdvanceStock" :items="listsStock" label="Stock" item-text="InventoryStockName" item-value="IDX_M_InventoryStock" multiple chips deletable-chips></v-autocomplete>
        <v-autocomplete outline v-model="selectedAdvanceOpnameStatus" :items="listsOpnameStatus" label="Opname Status" item-text="OpnameStatusName" item-value="IDX_M_OpnameStatus" multiple chips deletable-chips></v-autocomplete>
        <v-autocomplete outline v-model="selectedAdvanceTimePeriod" :items="listsPeriod" chips color="blue-grey lighten-2" label="Period" item-text="ItemText" item-value="ItemValue" clearable deletable-chips></v-autocomplete>
        <v-text-field v-if="selectedAdvanceTimePeriod == 99" outline type="date" label="Date From" v-model="selectedAdvanceDateFrom"></v-text-field>
        <v-text-field v-if="selectedAdvanceTimePeriod == 99" outline type="date" label="Date To" v-model="selectedAdvanceDateTo"></v-text-field>
      </v-container>
      <v-layout row wrap>
        <v-container grid-list-xs>
          <center>
            <v-btn dark small @click="loadList()" fab><v-icon>search</v-icon></v-btn>  
          </center>
        </v-container>
      </v-layout>
    </v-navigation-drawer> 

    <!-- ALERT -->
    <v-layout row justify-center>
      <v-dialog v-model="alertDialog" persistent max-width="290">
        <v-card>
          <v-card-title class="headline">ALERT</v-card-title>
          <v-card-text><span v-html="alertMessage"></span></v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn small @click.native="alertDialog = false" dark><v-icon left color="red">clear</v-icon>CANCEL</v-btn>
            <v-btn small @click="toWhat()" @click.native="alertDialog = false" dark><v-icon left color="cyan">save</v-icon>PROSES</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>

    <!-- NEW OPNAME  -->
    <v-dialog lazy
      v-model="newOpnameDialog"
      scrollable fullscreen 
      persistent :overlay="false"
      max-width="500px"
      transition="bottom-dialog-transition"
    >
      <v-card>
        <v-toolbar dense flat dark>
          <v-toolbar-title>
            <v-progress-circular v-if="$store.state.loading" :indeterminate="$store.state.loading" background-color="blue" color="lime" width="3"></v-progress-circular> 
            OPNAME BARU
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn flat small @click="newOpnameDialog =! newOpnameDialog, loadList()"><v-icon>clear</v-icon></v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <NewOpname @close="closeOpname" :id="selectedId" ref="nopname" />
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- EDIT OPNAME  -->
    <v-dialog lazy
      v-model="editOpnameDialog"
      scrollable fullscreen 
      persistent :overlay="false"
      max-width="500px"
      transition="bottom-dialog-transition"
    >
      <v-card>
        <v-toolbar dense flat dark>
          <v-toolbar-title>
            <v-progress-circular v-if="$store.state.loading" :indeterminate="$store.state.loading" background-color="blue" color="lime" width="3"></v-progress-circular> 
            EDIT OPNAME
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn flat small @click="editOpnameDialog =! editOpnameDialog, loadList()"><v-icon>clear</v-icon></v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <EditOpname @close="closeOpname" :id="selectedId" ref="eopname" />
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- VIEW OPNAME  -->
    <v-dialog lazy
      v-model="viewOpnameDialog"
      scrollable fullscreen 
      persistent :overlay="false"
      max-width="500px"
      transition="bottom-dialog-transition"
    >
      <v-card>
        <v-toolbar dense flat dark>
          <v-toolbar-title>
            <v-progress-circular v-if="$store.state.loading" :indeterminate="$store.state.loading" background-color="blue" color="lime" width="3"></v-progress-circular> 
            LIHAT OPNAME
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn flat small @click="viewOpnameDialog =! viewOpnameDialog, loadList()"><v-icon>clear</v-icon></v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <ViewOpname @close="closeOpname" :id="selectedId" ref="vopname" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import PageToolbar from "@/components/Toolbar/PageToolbar"; // required
import ActionMenu from "@/components/Core/ActionMenu"
import Search from "@/components/Core/Search"
import NewOpname from "@/components/Opname/NewOpname"
import EditOpname from "@/components/Opname/EditOpname"
import ViewOpname from "@/components/Opname/ViewOpname"


export default {
  name:'dashboard',
  components:{
    PageToolbar,ActionMenu,Search,NewOpname,EditOpname,ViewOpname
  },
  created(){
    this.loadList();
    this.loadFilterlist();
  },
  watch:{
    selectedAdvanceStock(){
      this.loadList();
    },
    selectedAdvanceOpnameStatus(){
      this.loadList();
    },
    selectedAdvanceCompany(){
      this.loadList();
    }
  },
  data(){
    return {
      lists:[],
      listsStock:[],
      listsCompany:[],
      listsPeriod:[],
      listsUOM:[],
      listsStockFilter:[],
      listsOpnameStatus:[],
      selectedId:null,
      selectedOpname:[],
      selectedIDX_T_InventoryStockHeader:null,
      selectedAdvanceKeyword:null,
      selectedAdvanceStock:[],
      selectedAdvanceCompany:[],
      selectedAdvanceOpnameStatus:[],
      selectedAdvanceTimePeriod:0,
      selectedAdvanceDateFrom:this.$moment(new Date).format('YYYY-MM-DD'),
      selectedAdvanceDateTo:this.$moment('3000-01-01').format('YYYY-MM-DD'),
      selectedAdvanceSortBy:1,
      selectedAdvanceSortSq:1,

      headers:[
        { text:'ACTION',align:'center',sortable:false,value:null },
        { text:'STATUS',align:'left',sortable:false,value:'' },
        { text:'BATCH NO',align:'center',sortable:true,value:'BatchNo' },
        { text:'COMPANY',align:'center',sortable:true,value:'CompanyName' },
        { text:'DATE',align:'center',sortable:true,value:'OpnameDate' },
        { text:'REMARKS',align:'center',sortable:true,value:'Remarks' },
      ],

      //pagination
      CurrentPage:1,
      PageSize:100,
      MaxPage:1,

      filterDialog:false,
      newOpnameDialog:false,
      editOpnameDialog:false,
      viewOpnameDialog:false,
      alertDialog:false,
      alertMessage:null,
      alertCode:null,
    }
  },
  methods:{
    actionSearch(p){
      this.selectedAdvanceKeyword = p.Keyword;
      setTimeout(() => this.loadList(), 500);
    },
    openViewOpname(id){
      this.viewOpnameDialog = this.viewOpnameDialog =! this.viewOpnameDialog;
      this.selectedId = id;
      this.$refs.vopname.init(id);
    },
    closeOpname(p){
      this.newOpnameDialog = p;
      setTimeout(() => this.loadList(), 500);
    },
    actionMenu(p){
      let id = p.id
      let code = p.code;
      let arr = this.lists.filter((k) => k.IDX_T_InventoryStockOpnameHeader == id);
      let r = arr[0];

      switch (code) {
        case 'isUpdate':
          this.selectedId = id;
          this.editOpnameDialog = this.editOpnameDialog =! this.editOpnameDialog;
          this.$refs.eopname.init(id);
          break;
        case 'isLocked':
          this.selectedIDX_T_InventoryStockHeader = id;
          this.alertCode = 'LOCKED';
          this.alertDialog = this.alertDialog =! this.alertDialog;
          this.alertMessage = "All stock within this batch ("+r.BatchNo+") will be locked, EXCEPT stock when has been verified.";
          break;
        case 'isCancel':
          this.selectedIDX_T_InventoryStockHeader = id;
          this.alertCode = 'CANCEL';
          this.alertDialog = this.alertDialog =! this.alertDialog;
          this.alertMessage = "All stock within this batch ("+r.BatchNo+") will be canceled, EXCEPT stock when has been verified.";
          break;
        case 'isVerify':
          this.selectedIDX_T_InventoryStockHeader = id;
          this.alertCode = 'VERIFY';
          this.alertDialog = this.alertDialog =! this.alertDialog;
          this.alertMessage = "All stock within this batch ("+r.BatchNo+") will be verified, EXCEPT stock when has been verified and stock when is draft.";
          break;
        default:
          break;
      }
    },
    toWhat(){
      let id = {
        Session_ID: this.$session.get('SESSION_ID'),
        IDX_T_InventoryStockOpnameHeader: this.selectedIDX_T_InventoryStockHeader
      }
      let url = this.alertCode == "LOCKED" ? "Stock/lockedAllOpname" 
          : this.alertCode == "CANCEL" ? "Stock/cancelAllOpname"
          : "Stock/verifyAllOpname";

      this.client(url,id,() => this.loadList());
    },
    loadList(){
      var id = { 
        Keyword:this.selectedAdvanceKeyword,
        Session_ID: this.$session.get('SESSION_ID'),
        IDX_M_InventoryStock:this.selectedAdvanceStock.toString(),
        IDX_M_OpnameStatus:this.selectedAdvanceOpnameStatus.toString(),
        TimePeriod:this.selectedAdvanceTimePeriod,
        DateFrom:this.selectedAdvanceDateFrom,
        DateTo:this.selectedAdvanceDateTo,
        SortBy:this.selectedAdvanceSortBy,
        SortSequence:this.selectedAdvanceSortSq,
      };
      this.axios
        .post("Stock/loadOpname", id)
        .then(response => this.lists = JSON.parse(response.data)['Table'])
        .catch(error => this.showAlert("ERROR  : " + error.statusText, "error"));
    },
    loadFilterlist(){
      this.axios
        .post("Stock/loadOpnameFilterList",{})
        .then(response => { 
          this.listsStock = JSON.parse(response.data)['Table'];
          this.listsCompany = JSON.parse(response.data)['Table1'];
          this.listsOpnameStatus = JSON.parse(response.data)['Table2'];
          this.listsPeriod = JSON.parse(response.data)['Table3'];
        }).catch(error => this.showAlert("ERROR  : " + error.statusText, "error"));
    },
    toSave(is){
      //is = 0 = draft
      //is = 1 = save

      let id = {
        Session_ID:this.$session.get('SESSION_ID'),
        ItemRequest:r,
        OpnameDate:this.inputOpnameDate,
        Remarks:this.inputRemarks,
      }

      this.client(is ? "" : "",id,() => {
        this.newOpnameDialog = false;
        this.loadList();
      });

    },
    toDelete(id){

    },
    toUpdate(){
      let id = {
        Session_ID:this.$session.get('SESSION_ID'),
        IDX_T_InventoryStockOpname:editedIDX,
        Qty:editedQty,
        IDX_M_InventoryUOM:editedIDXUOM,
        Remarks:editedRemarks
      }
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
