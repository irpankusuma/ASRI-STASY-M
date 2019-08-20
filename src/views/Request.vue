<template>
  <v-container fluid>
    <PageToolbar
      :header="'ASRI-STASY'"
      :subheader="'MY-REQUEST'"
      :isLoading="$store.state.loading"
    />
    
    <v-toolbar dark>
      <v-toolbar-items>
        <v-btn @click="newRequestDialog =! newRequestDialog" v-if="isNew"><v-icon left color="lime">add</v-icon>PERMINTAAN BARU</v-btn>
      </v-toolbar-items>
      <Search @search="actionSearch" />
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn @click="filterDialog =! filterDialog"><v-icon :color="filterDialog ? 'red' : 'cyan'">{{ filterDialog ? 'clear' : 'search' }}</v-icon></v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-card dark>
      <v-card-text>
        <v-data-table :headers="headers" :items="lists" :expand="true">
          <template v-slot:items="props">
            <tr>
              <td class="text-xs-center">
                <ActionMenu v-if="props.item.isUpdate == 1 || props.item.isReceive == 1 || props.item.isDraft == 1"
                  :id="props.item.IDX_T_OutRequestForm"
                  :isUpdate="props.item.isUpdate"
                  :isReceive="props.item.isReceive"
                  :isDraft="props.item.isDraft"
                  @action="actionMenu"
                />
              </td>
              <td class="text-xs-left">
                <v-chip flat><v-icon left :color="props.item.RequestConditionColor">fiber_manual_record</v-icon> {{ props.item.RequestCondition.toUpperCase() }}</v-chip>
              </td>
              <td class="text-xs-left">{{ props.item.AssetID }} 
                <v-btn flat round small @click="openViewRequestDetail(props.item.IDX_T_OutRequestForm)">{{ props.item.OutRequestFormNo }}</v-btn>
              </td>
              <td class="text-xs-center">{{ $moment(props.item.OutRequestFormDate).format('DD MMMM YYYY') }}</td>
              <td class="text-xs-center">{{ props.item.RequestName }}</td>
              <td class="text-xs-center">{{ props.item.HeadName }}</td>
              <td class="text-xs-center">{{ props.item.ReceivedName }}</td>
              <td class="text-xs-center">{{ props.item.ReceivedDateTime ? $moment(props.item.ReceivedDateTime).format('DD MMMM YYYY') : '' }}</td>
              <td class="text-xs-center">{{ props.item.CanceledName }}</td>
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
        <v-autocomplete outline v-model="selectedAdvanceCanceledBy" :items="listsCanceledBy" append-icon="cancel" label="Dibatalkan oleh" item-text="Name" item-value="NIK" multiple chips deletable-chips></v-autocomplete>
        <v-autocomplete outline v-model="selectedAdvanceApprover" :items="listsApprover" append-icon="face" label="Approver" item-text="Name" item-value="NIK" multiple chips deletable-chips></v-autocomplete>
        <v-autocomplete outline v-model="selectedAdvanceGeneralStatus" append-icon="plus_one" :items="listsStatusGeneral" chips color="blue-grey lighten-2" label="Status" item-text="StatusName" item-value="IDX_M_Status" multiple clearable deletable-chips></v-autocomplete>
      </v-container>
      <v-layout row wrap>
        <v-container grid-list-xs>
          <center>
            <v-btn dark small @click="loadLists()" fab><v-icon>search</v-icon></v-btn>  
          </center>
        </v-container>
      </v-layout>
    </v-navigation-drawer> 

    <!-- NEW REQUEST -->
    <v-dialog lazy
      v-model="newRequestDialog"
      scrollable fullscreen 
      persistent :overlay="false"
      max-width="500px"
      transition="bottom-dialog-transition"
    >
      <v-card>
        <v-toolbar dense flat dark class="cyan darken-3">
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
            EDIT PERMINTAAN
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn flat small @click="editRequestDialog =! editRequestDialog"><v-icon>clear</v-icon></v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <EditRequest @close="closeEditRequest" :id="selectedId" ref="erequest"  />
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
          <ViewRequestDetail :id="selectedId" ref="vdetail" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import PageToolbar from "@/components/Toolbar/PageToolbar"; // required
import ActionMenu from "@/components/Core/ActionMenu"; // required
import Search from "@/components/Core/Search"; // required
import NewRequest from "@/components/Request/NewRequest"
import EditRequest from "@/components/Request/EditRequest"
import ViewRequestDetail from "@/views/ViewRequestDetail"

export default {
  name:'request',
  components:{
    PageToolbar,ActionMenu,Search,NewRequest,EditRequest,ViewRequestDetail
  },
  created(){
    this.loadList();
  },
  watch:{
    selectedAdvanceApprover(){
      this.loadList();
    },
    selectedAdvanceApprover2(){
      this.loadList();
    },
    selectedAdvanceCanceledBy(){
      this.loadList();
    },
    selectedAdvanceGeneralStatus(){
      this.loadList();
    },
  },
  data(){
    return {
      headers: [
        { text:'AKSI',align:'center',sortable:false,value:null },
        { text:'STATUS',align:'center',sortable:true,value:'RequestCondition' },
        { text:'FORM NO',align:'center',sortable:true,value:'OutRequestFormNo' },
        { text:'TANGGAL PERMINTAAN',align:'center',sortable:true,value:'OutRequestFormDate' },
        { text:'DIMINTA OLEH',align:'center',sortable:true,value:'RequestName' },
        { text:'APPROVER',align:'center',sortable:true,value:'HeadName' },
        { text:'DITERIMA OLEH',align:'center',sortable:true,value:'ReceivedName' },
        { text:'WAKTU TERIMA',align:'center',sortable:true,value:'ReceivedDateTime' },
        { text:'DIBATALKAN OLEH',align:'center',sortable:true,value:'CanceledName' },
      ],
      lists:[],
      listsApprover:[], // list head yang nge-approve
      listsHeadApproval:[], // lists status approval 0/1
      listsGAApproval:[],   // lists status approval 0/1
      listsCanceledBy:[],
      listsStatusGeneral:[],
      listsHRIS:[],

      selectedAdvanceApprover:[],
      selectedAdvanceApprover2:[],
      selectedAdvanceCanceledBy:[],
      selectedAdvanceGeneralStatus:[],
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
      this.$refs.vdetail.init(id);
    },
    closeNewRequest(p){
      this.newRequestDialog = p;
      this.loadList();
    },
    closeEditRequest(p){
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
          this.editRequestDialog = true;
          this.selectedId = id;
          this.$refs.erequest.init(id);
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
        Requester:this.$session.get('SESSION_ID'),
        Approver:this.selectedAdvanceApprover.toString(),
        Canceler:this.selectedAdvanceCanceledBy.toString(),
        Status:this.selectedAdvanceGeneralStatus.toString(),
        //sort and pagination
        SortBy:this.selectedSortBy,
        SortSequence:this.selectedSequence,
        PageSize: this.pageSize,
        MaxPage: this.maxPage,
        CurrentPage: this.currentPage
      };
      this.axios
        .post("ATKRequest/loadRequest", id)
        .then(response => {
          this.lists = JSON.parse(response.data)['Table'];
          this.totalRecords = JSON.parse(response.data)['Table1'][0].TotalRecords;
          this.maxPage = JSON.parse(response.data)['Table1'][0].MaxPage;
          this.isNew = JSON.parse(response.data)['Table1'][0].isNew;
        })
        .then(() => setTimeout(() => this.loadFilter(), 1000))
        .catch(error => {
          this.showAlert("ERROR  : " + error.statusText, "error");
        });
    },
    loadFilter(){
      this.axios
        .post("ATKRequest/loadRequestFilterList", {})
        .then(response => {
          this.listsApprover = JSON.parse(response.data)['Table'];
          this.listsCanceledBy = JSON.parse(response.data)['Table3'];
          this.listsStatusGeneral = JSON.parse(response.data)['Table6'];
          this.listsHRIS = JSON.parse(response.data)['Table8'];
        })
        .catch(error => {
          this.showAlert("ERROR  : " + error.statusText, "error");
        });
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
