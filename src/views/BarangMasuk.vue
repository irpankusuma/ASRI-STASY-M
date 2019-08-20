<template>
  <v-container fluid>
    <PageToolbar
      :header="'ASRI-STASY'"
      :subheader="'BARANG-MASUK'"
      :isLoading="$store.state.loading"
    />
    
    <v-toolbar dark>
      <v-toolbar-items>
        <v-btn @click="newRequestDialog =! newRequestDialog" v-if="isNew"><v-icon left color="lime">add</v-icon>PERMINTAAN BARU</v-btn>
      </v-toolbar-items>
      <Search @search="actionSearch" />
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn icon @click="loadList()"><v-icon>refresh</v-icon></v-btn>
        <v-btn @click="filterDialog =! filterDialog"><v-icon :color="filterDialog ? 'red' : 'cyan'">{{ filterDialog ? 'clear' : 'search' }}</v-icon></v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-card dark>
      <v-card-text>
        <v-data-table :headers="headers" :items="lists" :expand="true">
          <template v-slot:items="props">
            <tr>
              <!-- <td class="text-xs-center">
                <ActionMenu
                  :id="props.item.IDX_T_InRequestForm"
                  :isUpdate="props.item.isUpdate"
                  @action="actionMenu"
                />
              </td> -->
              <td class="text-xs-left">
                <v-chip flat><v-icon left color="black">fiber_manual_record</v-icon> {{ props.item.TotalStock }}</v-chip>
                <v-chip flat><v-icon left color="black">fiber_manual_record</v-icon> {{ props.item.TotalQty }}</v-chip>
              </td>
              <td class="text-xs-left">{{ props.item.AssetID }} 
                <v-btn flat round small @click="openViewRequestDetail(props.item.IDX_T_InRequestForm)"><v-icon left color="cyan">launch</v-icon>{{ props.item.InRequestFormNo }}</v-btn>
              </td>
              <td class="text-xs-center">{{ props.item.PONo }}</td>
              <td class="text-xs-center">{{ $moment(props.item.InRequestFormDate).format('DD MMMM YYYY') }}</td>
              <td class="text-xs-center">{{ props.item.RequestedBy }} - {{ props.item.RequestName }}</td>
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
        <v-autocomplete outline v-model="selectedAdvanceRequester" :items="listsRequester" append-icon="cancel" label="Requested By" item-text="Name" item-value="NIK" multiple chips deletable-chips></v-autocomplete>
        <v-autocomplete outline v-model="selectedAdvanceCompany" :items="listsCompany" append-icon="face" label="Company" item-text="CompanyName" item-value="IDX_M_Company" multiple chips deletable-chips></v-autocomplete>
      </v-container>
      <v-layout row wrap>
        <v-container grid-list-xs>
          <center>
            <v-btn dark small @click="loadList()" fab><v-icon>search</v-icon></v-btn>  
          </center>
        </v-container>
      </v-layout>
    </v-navigation-drawer> 

    <!-- EDIT REQUEST -->
    <v-dialog lazy
      v-model="editRequestDialog"
      scrollable fullscreen 
      persistent :overlay="false"
      max-width="500px"
      transition="bottom-dialog-transition"
    >
      <v-card>
        <v-toolbar dense flat dark>
          <v-toolbar-title>
            <v-progress-circular v-if="$store.state.loading" :indeterminate="$store.state.loading" background-color="blue" color="lime" width="3"></v-progress-circular> 
            EDIT BARANG MASUK
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn flat small @click="editRequestDialog =! editRequestDialog"><v-icon>clear</v-icon></v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <EditApprove @close="closeEditApprove" :id="selectedId" ref="eapprove" />
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- NEW REQUEST -->
    <v-dialog lazy
      v-model="newRequestDialog"
      scrollable fullscreen 
      persistent :overlay="false"
      max-width="500px"
      transition="bottom-dialog-transition"
    >
      <v-card>
        <v-toolbar dense flat dark>
          <v-toolbar-title>
            <v-progress-circular v-if="$store.state.loading" :indeterminate="$store.state.loading" background-color="blue" color="lime" width="3"></v-progress-circular> 
            PERMINTAAN BARU
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn flat small @click="newRequestDialog =! newRequestDialog"><v-icon>clear</v-icon></v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <NewRequest lazy @close="closeNewRequest" />
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- VIEW REQUEST DETAIL -->
    <v-dialog lazy
      v-model="viewRequestDetailDialog"
      scrollable fullscreen 
      persistent :overlay="false"
      max-width="500px"
      transition="bottom-dialog-transition"
    >
      <v-card>
        <v-toolbar dense flat dark>
          <v-toolbar-title>
            <v-progress-circular v-if="$store.state.loading" :indeterminate="$store.state.loading" background-color="blue" color="lime" width="3"></v-progress-circular> 
            LIHAT PERMINTAAN
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn flat small @click="viewRequestDetailDialog =! viewRequestDetailDialog"><v-icon>clear</v-icon></v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <ViewBarangMasuk :id="selectedId" ref="vbarangmasuk" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import PageToolbar from "@/components/Toolbar/PageToolbar"; // required
import ActionMenu from "@/components/Core/ActionMenu"; // required
import Search from "@/components/Core/Search"; // required
import EditApprove from "@/components/Approve/EditApprove"
import NewRequest from "@/components/BarangMasuk/NewRequest"
import ViewBarangMasuk from "@/components/BarangMasuk/ViewBarangMasuk"

export default {
  name:'barang-masuk',
  components:{
    PageToolbar,ActionMenu,Search,EditApprove,ViewBarangMasuk,NewRequest
  },
  created(){
    this.loadList();
  },
  watch:{
    selectedAdvanceRequester(){
      this.loadList();
    },
  },
  data(){
    return {
      headers: [
        // { text:'ACTION',align:'center',sortable:false,value:null },
        { text:'INFORMASI',align:'left',sortable:false,value:'' },
        { text:'FORM NO',align:'left',sortable:true,value:'InRequestFormNo' },
        { text:'PO NUMBER',align:'left',sortable:true,value:'PONo' },
        { text:'DATE REQUEST',align:'center',sortable:true,value:'InRequestFormDate' },
        { text:'REQUESTED BY',align:'center',sortable:true,value:'RequestedBy' },
      ],
      lists:[],
      listsRequester:[],
      listsCompany:[],
      selectedAdvanceRequester:[],
      selectedAdvanceCompany:[],
      selectedAdvanceTimePeriod:0,
      selectedAdvanceDateFrom:'1900-01-01',
      selectedAdvanceDateTo:'3000-01-01',
      selectedSortBy:1,
      selectedSequence:1,
      selectedKeyword:null,
      selectedId:null,

      //pagination
      pageSize:100,
      maxPage:0,
      currentPage:1,
      totalRecords:0,
      isNew:false,

      filterDialog:false,
      newRequestDialog:false,
      editRequestDialog:false,
      viewRequestDetailDialog:false,
    }
  },
  methods:{
    openViewRequestDetail(id){
      this.viewRequestDetailDialog = this.viewRequestDetailDialog =! this.viewRequestDetailDialog;
      this.selectedId = id;
      this.$refs.vbarangmasuk.init(id);
    },
    closeNewRequest(p){
      this.newRequestDialog = p;
      this.loadList();
    },
    closeEditApprove(p){
      this.editRequestDialog = p;
      this.loadList();
    },
    actionSearch(p){
      this.selectedKeyword = p.Keyword;
      setTimeout(() => {
        this.loadList();
      }, 500);
    },
    actionMenu(p){
      let code = p.code;
      let id = p.id;
      let arr = this.lists.filter(k => { return k.IDX_T_InRequestForm == id })
      this.IDX_T_OutRequestForm = id;
      this.OutRequestFormNo = arr[0].InRequestFormNo;

      switch (code){
        case 'isUpdate':
          this.editRequestDialog = true;
          this.selectedId = id;
          this.$refs.eapprove.init(id);
        break;
        case 'isReceive':
          this.toReceived(id);
        break;
        case 'isDraft':
          this.toDraft(id);
        break;
      }
    },
    toReceived(v){
      let id = {
        NIK: this.$session.get('SESSION_ID'),
        ReceivedBy: this.$session.get('SESSION_ID'),
        ReceivedRemarks:null,
        IDX_T_OutRequestForm: v
      }

      this.client("ATKRequest/receivedRequest",id,() => this.loadList());
    },
    toDraft(v){
      let id = {
        NIK: this.$session.get('SESSION_ID'),
        IDX_T_OutRequestForm: v
      }

      this.client("ATKRequest/draftRequest",id,() => this.loadList());
    },
    loadList(){
      var id = { 
        Keyword:this.selectedKeyword,
        Requester:this.selectedAdvanceRequester.toString(),
        //sort and pagination
        TimePeriod:this.selectedAdvanceTimePeriod,
        DateFrom:this.selectedAdvanceDateFrom,
        DateTo:this.selectedAdvanceDateTo,
        SortBy:this.selectedSortBy,
        SortSequence:this.selectedSequence,
        PageSize: this.pageSize,
        MaxPage: this.maxPage,
        CurrentPage: this.currentPage,
        Session_ID: this.$session.get('SESSION_ID')
      };
      this.axios
        .post("ATKManage/loadRequest", id)
        .then(response => {
          this.lists = JSON.parse(response.data)['Table'];
          this.totalRecords = JSON.parse(response.data)['Table1'][0].TotalRecords;
          this.maxPage = JSON.parse(response.data)['Table1'][0].MaxPage;
          this.isNew = JSON.parse(response.data)['Table1'][0].isNew;
        })
        .then(() => setTimeout(() => this.loadFilter(), 1000))
        .catch(error => this.showAlert("ERROR  : " + error.statusText, "error"));
    },
    loadFilter(){
      this.axios
        .post("ATKManage/loadRequestFilterList", {})
        .then(response => {
          this.listsRequester = JSON.parse(response.data)['Table'];
          this.listsCompany = JSON.parse(response.data)['Table2'];
        })
        .catch(error =>this.showAlert("ERROR  : " + error.statusText, "error"));
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
