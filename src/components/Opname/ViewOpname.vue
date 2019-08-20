<template>
  <v-container fluid>
    <v-layout column>
      <v-flex xs12 sm12 md12 lg12 x12>
        <v-card dark>
          <v-toolbar flat dense>
            <v-toolbar-title>INFORMASI</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn flat @click="loadList()"><v-icon>refresh</v-icon></v-btn>
              <v-btn flat @click="showInfo =! showInfo"><v-icon>{{ showInfo ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</v-icon></v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-card-text v-if="showInfo">
            <v-layout row>
              <v-flex sm6>
                <v-layout row>
                  <v-flex xs4 sm4 md4 lg4>
                      <v-subheader>TANGGAL OPNAME</v-subheader>
                  </v-flex>                           
                  <v-flex xs8 sm8>                                                    
                    <v-chip class="white"><v-subheader class="black--text subtitle">{{ selectedRequestDate.toUpperCase() }}</v-subheader></v-chip>                        
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs4 sm4 md4 lg4>
                      <v-subheader>PT / COMPANY</v-subheader>
                  </v-flex>                           
                  <v-flex xs8 sm8>
                    <v-chip class="white"><v-subheader class="black--text subtitle">{{ selectedRequestCompany }}</v-subheader></v-chip> 
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex sm6>
                <v-layout row>
                  <v-flex xs4 sm4 md4 lg4>
                      <v-subheader>BATCH NO</v-subheader>
                  </v-flex>                           
                  <v-flex xs7 sm7>  
                    <v-chip class="white"><v-subheader class="black--text subtitle">{{ selectedFormNo }}</v-subheader></v-chip>                                                  
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs4 sm4 md4 lg4>
                      <v-subheader>DIBUAT OLEH</v-subheader>
                  </v-flex>                           
                  <v-flex xs7 sm7>                                    
                    <v-chip class="white"><v-subheader class="black--text subtitle">{{ selectedRequestUser }}</v-subheader></v-chip> 
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs4 sm4 md4 lg4>
                      <v-subheader>Note **</v-subheader>
                  </v-flex>                           
                  <v-flex xs7 sm7>                                                    
                    <v-subheader class="black--text subtitle">{{ selectedRemarks }}</v-subheader>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12 sm12 md12 lg12 x12 mt-2>
        <v-card dark>
          <v-toolbar flat dense>
            <v-toolbar-title>OPNAME BARANG</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn flat @click="loadRequest()"><v-icon>refresh</v-icon></v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-card-text>
            <v-data-table :headers="headers" :items="listsRequest" :expand="true">
              <template v-slot:items="props">
                <tr :style="props.item.isOpname ? 'color:yellow' : null">
                  <td class="text-xs-left">
                    <v-chip flat><v-icon left :color="props.item.OpnameColor">fiber_manual_record</v-icon> {{ props.item.OpnameStatus.toUpperCase() }}</v-chip>
                  </td>
                  <td class="text-xs-center">{{ props.item.InventoryStockCode }}</td>
                  <td class="text-xs-center">{{ props.item.InventoryStockName }}</td>
                  <td class="text-xs-center"><v-chip class="title">{{ props.item.BalanceSaldo }}</v-chip></td>
                  <td class="text-xs-center"><v-chip class="title">{{ props.item.QtySaldo }}</v-chip></td>
                  <td class="text-xs-center"><v-chip class="title">{{ props.item.SelisihSaldo }}</v-chip></td>
                  <td class="text-xs-center">{{ props.item.InventoryUOMName }}</td>
                  <td class="text-xs-center">
                    <v-avatar size="25" v-if="props.item.ImageURL">
                      <img :src="props.item.ImageURL">
                    </v-avatar>
                  </td>
                  <td class="text-xs-center">{{ props.item.Remarks }}</td>
                </tr>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import ActionMenu from '@/components/Core/ActionMenu'
import StatusRequest from '@/components/Request/StatusRequest'
import { isNullOrUndefined } from 'util';

export default {
  name:'edit-barang-keluar',
  props:{
    id:null
  },
  mounted(){
    // this.loadAdditionalList();
    setTimeout(() => this.loadList(), 100);
    setTimeout(() => this.loadRequest(), 200);
  },
  components:{
    ActionMenu,StatusRequest
  },
  data(){
    return {
      lists:[],
      listsRequest:[],
      selectedFormNo:null,
      selectedRequestDate: this.$moment(new Date()).format("DD MMMM YYYY | HH:mm"),
      selectedRequestCompany: null,
      selectedRequestUser: null,
      selectedRequestCondition: null,
      selectedRemarks:null,
      selectedReceivedRemarks:null,
      
      //view
      selectedAdvanceOpnameDate:null,
      selectedAdvanceCompany:null,
      selectedAdvanceBatchNo:null,
      selectedAdvanceCreatedBy:null,
      selectedAdvanceRemarks:null,
      
      showInfo:true,
      headers:[
        { text:'Status',align:'left',sortable:true,value:'OpnameStatus' },
        { text:'Kode Barang',align:'center',sortable:true,value:'InventoryStockCode' },
        { text:'Nama Barang',align:'center',sortable:true,value:'InventoryStockName' },
        { text:'Balance',align:'center',sortable:true,value:'BalanceSaldo' },
        { text:'Qty',align:'center',sortable:true,value:'QtySaldo' },
        { text:'Selisih',align:'center',sortable:true,value:'SelisihSaldo' },
        { text:'Unit',align:'center',sortable:true,value:'InventoryUOMName' },
        { text:'Image',align:'center',sortable:true,value:'ImageURL' },
        { text:'Note',align:'center',sortable:true,value:'Remarks' },
      ],
    }
  },
  methods:{
    init(id){
      // this.loadAdditionalList()
      setTimeout(() => this.loadList(id), 100);
      setTimeout(() => this.loadRequest(id), 200);
    },
    actionMenu(p){
      let code = p.code;
      let id = p.id;
      let arr = this.listsRequest.filter(k => { return k.IDX_T_OutRequestFormInventory == id })
      let is = arr[0].isDisable;
      
      switch (code){
        case 'isUpdate':
          this.editStockDialog = this.editStockDialog =! this.editStockDialog;
          this.editedStockName = arr[0].InventoryStockName;
          this.editedStockCode = arr[0].InventoryStockCode;
          this.editedQty = arr[0].Qty;
          this.editedNote = arr[0].Remarks;
          this.editedIDX_M_InventoryStock = arr[0].IDX_M_InventoryStock;
          this.editedIDX_T_OutRequestFormInventory = arr[0].IDX_T_OutRequestFormInventory;
          this.editedIDX_M_InventoryUoM = arr[0].IDX_M_InventoryUoM;
        break;
        case 'isEnable':
          this.toDisableEnable(id,is ? false : true);
        break;
        case 'isDelete':
          this.toDelete(id);
        break;
      }
    },
    loadList(v){
      let i = v == null ? this.id : v;
      let id = {
        Session_ID: this.$session.get('SESSION_ID'),
        IDX_T_InventoryStockOpnameHeader: i
      }

      this.axios
        .post("Stock/loadOpname_ByIDXOpname",id)
        .then(response => {
          let r = JSON.parse(response.data)['Table'][0];
          this.selectedRequestUser = r.RequestName;
          this.selectedFormNo = r.BatchNo;
          this.selectedRequestDate = this.$moment(r.OpnameDate).format('DD MMMM YYYY');
          this.selectedRequestCompany = r.CompanyName;
          this.selectedRequestDepartmentHead = r.HeadApprovalName;
          this.selectedReceivedBy = r.RequestedBy;
          this.selectedRemarks = r.Remarks;
        }).catch(error => this.showAlert("ERROR  : " + error.statusText, "error"));
    },
    loadRequest(v){
      let i = v == null ? this.id : v;
      let id = {
        Session_ID: this.$session.get('SESSION_ID'),
        Keyword:null,
        IDX_M_OpnameStatus:null,
        IDX_M_InventoryStock:null,
        IDX_T_InventoryStockOpnameHeader: i,
        // CurrentPage:1,
        // PageSize:999,
        // MaxPage:0
      }

      this.axios
        .post("Stock/loadOpnameDetail_By_IDXOpname",id)
        .then(response => this.listsRequest = JSON.parse(response.data)['Table'])
        .catch(error => this.showAlert("ERROR  : " + error.statusText, "error"));
    },
    loadAdditionalList(){
      this.axios
        .post("ATKRequest/loadRequestAdditionalList", {})
        .then(response => {
          this.listsUoM = JSON.parse(response.data)['Table'];
          this.listHRList = JSON.parse(response.data)['Table1'];
          this.listsCompany = JSON.parse(response.data)['Table2'];
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
        .then((r) => {
          let res = JSON.parse(r.data);
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
