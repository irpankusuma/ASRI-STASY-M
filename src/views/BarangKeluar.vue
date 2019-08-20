<template>
  <v-container fluid>
    <PageToolbar
      :header="'INVENTORYMAS'"
      :subheader="'BARANG-KELUAR'"
      :isLoading="$store.state.loading"
    />
    
    <v-toolbar dark>
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
                <ActionMenu v-if="props.item.isUpdate"
                  :id="props.item.IDX_T_OutRequestForm"
                  :isUpdate="props.item.isUpdate"
                  @action="actionMenu"
                />
              </td>
              <td class="text-xs-left">
                <v-chip flat><v-icon left :color="props.item.RequestConditionColor">fiber_manual_record</v-icon> {{ props.item.RequestCondition.toUpperCase() }}</v-chip>
              </td>
              <td class="text-xs-left">{{ props.item.AssetID }} 
                <v-btn flat round small @click="openViewBarangKeluar(props.item.IDX_T_OutRequestForm)">
                  <v-icon left color="cyan">launch</v-icon>{{ props.item.OutRequestFormNo }}
                </v-btn>
              </td>
              <td class="text-xs-center">{{ $moment(props.item.OutRequestFormDate).format('DD MMMM YYYY | HH:mm') }}</td>
              <td class="text-xs-center">{{ props.item.RequestedBy }} - {{ props.item.RequestName }}</td>
              <td class="text-xs-center">{{ props.item.HeadName }}</td>
              <td class="text-xs-center">{{ props.item.ReceivedName }}</td>
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
        <v-autocomplete outline v-model="selectedAdvanceHeadApproval" :items="listsHead" append-icon="filter_list" label="Approve By" item-text="Name" item-value="NIK" multiple chips deletable-chips></v-autocomplete>
        <v-autocomplete outline v-model="selectedAdvanceGAApproval" :items="listsGA" append-icon="filter_list" label="Admin" item-text="Name" item-value="NIK" multiple chips deletable-chips></v-autocomplete>
        <v-autocomplete outline v-model="selectedAdvanceRequester" :items="listsRequester" append-icon="filter_list" label="Request By" item-text="Name" item-value="NIK" multiple chips deletable-chips></v-autocomplete>
        <v-autocomplete outline v-model="selectedAdvanceCanceler" :items="listsCanceler" append-icon="filter_list" label="Cancel By" item-text="Name" item-value="NIK" multiple chips deletable-chips></v-autocomplete>
        <v-autocomplete outline v-model="selectedAdvanceStatus" :items="listsStatusGeneral" append-icon="filter_list" label="Status" item-text="StatusName" item-value="IDX_M_Status" multiple chips deletable-chips></v-autocomplete>
        <v-autocomplete outline v-model="selectedAdvanceCompany" :items="listsCompany" append-icon="filter_list" label="Company" item-text="CompanyName" item-value="IDX_M_Company" multiple chips deletable-chips></v-autocomplete>
      </v-container>
      <v-layout row wrap>
        <v-container grid-list-xs>
          <center>
            <v-btn dark small @click="loadList()" fab><v-icon>search</v-icon></v-btn>  
          </center>
        </v-container>
      </v-layout>
    </v-navigation-drawer> 

    <!-- REALISASI PERMINTAAN DETAIL -->
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
            <v-btn flat small @click="viewRequestDetailDialog =! viewRequestDetailDialog,loadList()"><v-icon>clear</v-icon></v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <ViewRequestDetail :id="selectedId" ref="vbarangkeluar" />
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- REALISASI PERMINTAAN DETAIL -->
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
            EDIT PERMINTAAN
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn flat small @click="editRequestDialog =! editRequestDialog,loadList()"><v-icon>clear</v-icon></v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <EditRequestDetail @close="closeEditBarangKeluar" :id="selectedId" ref="ebarangkeluar" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import PageToolbar from "@/components/Toolbar/PageToolbar"; // required
import ActionMenu from "@/components/Core/ActionMenu"; // required
import Search from "@/components/Core/Search"; // required
import EditRequestDetail from "@/components/BarangKeluar/EditBarangKeluar"
import ViewRequestDetail from "@/components/BarangKeluar/ViewBarangKeluar"

export default {
  name:'barang-keluar',
  components:{
    PageToolbar,ActionMenu,Search,ViewRequestDetail,EditRequestDetail
  },
  created(){
    this.loadList();
  },
  watch:{
    selectedAdvanceRequester(){ this.loadList(); },
    selectedAdvanceApprover(){ this.loadList(); },
    selectedAdvanceCanceler(){ this.loadList(); },
    selectedAdvanceHeadApproval(){ this.loadList(); },
    selectedAdvanceGAApproval(){ this.loadList(); },
    selectedAdvanceStatus(){ this.loadList(); },
    selectedAdvanceCompany(){ this.loadList(); },
  },
  data(){
    return {
      headers: [
        { text:'ACTION',align:'center',sortable:false,value:null },
        { text:'STATUS',align:'left',sortable:true,value:'RequestCondition' },
        { text:'FORM NO',align:'left',sortable:true,value:'OutRequestFormNo' },
        { text:'DATE REQUEST',align:'center',sortable:true,value:'OutRequestFormDate' },
        { text:'REQUESTED BY',align:'center',sortable:true,value:'RequestedBy' },
        { text:'APPROVED BY',align:'center',sortable:true,value:'HeadName' },
        { text:'RECEIVED BY',align:'center',sortable:true,value:'ReceivedName' },
      ],
      lists:[],
      listsRequester:[],
      listsHead:[],
      listsGA:[],
      listsCanceler:[],
      listsStatusGeneral:[],
      listsCompany:[],
      
      selectedAdvanceRequester:[],
      selectedAdvanceApprover:[],
      selectedAdvanceCanceler:[],
      selectedAdvanceHeadApproval:[],
      selectedAdvanceGAApproval:[],
      selectedAdvanceStatus:[],
      selectedAdvanceCompany:[],
      selectedAdvanceRequestCondition:0,
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
    closeEditBarangKeluar(p){
      this.editRequestDialog = p;
      this.loadList();
    },
    openEditBarangKeluar(id){
      this.editRequestDialog = this.editRequestDialog =! this.editRequestDialog;
      this.selectedId = id;
      this.$refs.ebarangkeluar.init(id);
    },
    openViewBarangKeluar(id){
      this.viewRequestDetailDialog = this.viewRequestDetailDialog =! this.viewRequestDetailDialog;
      this.selectedId = id;
      this.$refs.vbarangkeluar.init(id);
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
      let arr = this.lists.filter(k => { return k.IDX_T_OutRequestForm == id })
      this.IDX_T_OutRequestForm = id;
      this.OutRequestFormNo = arr[0].OutRequestFormNo;

      switch (code){
        case 'isUpdate':
          this.openEditBarangKeluar(id);
        break;
      }
    },
    loadList(){
      var id = { 
        Keyword:this.selectedKeyword,
        Requester:this.selectedAdvanceRequester.toString(),
        Approver:this.selectedAdvanceApprover.toString(),
        Canceler:this.selectedAdvanceCanceler.toString(),
        HeadApproval:this.selectedAdvanceHeadApproval.toString(),
        GAApproval:this.selectedAdvanceGAApproval.toString(),
        Status:this.selectedAdvanceStatus.toString(),
        IDX_M_Company:this.selectedAdvanceCompany.toString(),
        RequestCondition:this.selectedAdvanceRequestCondition,
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
        .post("ATKManage/loadManageRequest", id)
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
        .post("ATKManage/loadManageRequest_FilterList", {})
        .then(response => {
          this.listsHead = JSON.parse(response.data)['Table'];
          this.listsGA = JSON.parse(response.data)['Table1'];
          this.listsRequester = JSON.parse(response.data)['Table2'];
          this.listsCanceler = JSON.parse(response.data)['Table3'];
          this.listsStatusGA = JSON.parse(response.data)['Table4'];
          this.listsStatusApprover = JSON.parse(response.data)['Table5'];
          this.listsStatusGeneral = JSON.parse(response.data)['Table6'];
          this.listsCompany = JSON.parse(response.data)['Table9'];
        }).catch(error =>this.showAlert("ERROR  : " + error.statusText, "error"));
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
