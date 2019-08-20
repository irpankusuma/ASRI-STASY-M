<template>
  <v-container fluid>
    <v-layout column>
      <v-flex xs12 sm12 md12 lg12 x12>
        <StatusRequest :id="id" ref="step" />
      </v-flex>
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
                      <v-subheader>TANGGAL PERMINTAAN</v-subheader>
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
                <v-layout row>
                  <v-flex xs4 sm4 md4 lg4>
                      <v-subheader>APPROVER</v-subheader>
                  </v-flex>                           
                  <v-flex xs8 sm8>                                                    
                    <v-chip class="white"><v-subheader class="black--text subtitle">{{ selectedRequestDepartmentHead }}</v-subheader></v-chip>  
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex sm6>
                <v-layout row>
                  <v-flex xs4 sm4 md4 lg4>
                      <v-subheader>FORM NO</v-subheader>
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
            <v-toolbar-title>PERMINTAAN BARANG</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn flat @click="loadRequest()"><v-icon>refresh</v-icon></v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-card-text>
            <v-data-table :headers="headers" :items="listsRequest" :expand="true">
              <template v-slot:items="props">
                <tr :style="props.item.isOpname ? 'color:yellow' : null">
                  <td class="text-xs-center">{{ props.item.InventoryStockCode }}</td>
                  <td class="text-xs-center">{{ props.item.InventoryStockName }}</td>
                  <td class="text-xs-center"><v-chip class="title">{{ props.item.Qty }} </v-chip></td>
                  <td class="text-xs-center"><v-chip class="title">{{ props.item.QtyReal }} </v-chip></td>
                  <td class="text-xs-center">{{ props.item.QtyOutPending }}</td>
                  <td class="text-xs-center">{{ props.item.InventoryUOMName }}</td>
                  <td class="text-xs-center">{{ props.item.Remarks }}</td>
                </tr>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <!-- TAMBAH BARANG -->
    <v-dialog v-model="addStockDialog" scrollable fullscreen>
      <v-card>
        <v-toolbar flat dense dark>
          <v-toolbar-title>
            <v-progress-circular v-if="$store.state.loading" :indeterminate="$store.state.loading" background-color="blue" color="lime" width="3"></v-progress-circular> 
            TAMBAH BARANG
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn @click="addStockDialog =! addStockDialog"><v-icon>clear</v-icon></v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <v-data-table :headers="headers" :items="selectedRequest" :expand="true" dark>
            <template v-slot:items="props">
              <tr :style="props.item.isOpname ? 'color:yellow' : null">
                <td class="text-xs-center">
                  <v-btn icon @click="remove(props.index)">
                    <v-icon :color="props.item.isOpname ? 'amber darken-1' : 'red darken-1'">{{ props.item.isOpname ? 'delete' : 'delete_forever' }}</v-icon>
                  </v-btn>
                  <v-icon small v-if="props.item.isOpname">locked</v-icon>
                </td>
                <td class="text-xs-center">{{ props.item.InventoryStockCode }}</td>
                <td class="text-xs-center">{{ props.item.InventoryStockName }}</td>
                <td class="text-xs-center">
                  <v-text-field v-if="!props.item.isOpname" solo-inverted label="Kuantitas" v-model="props.item.Qty" type="number"></v-text-field>
                  <span v-else>SEDANG OPNAME</span>
                </td>
                <td class="text-xs-center">
                  <v-select v-if="!props.item.isOpname" solo-inverted
                      :items="filteredUoM(props.item.IDX_M_InventoryStock)"
                      v-model="props.item.IDX_M_InventoryUoM"
                      item-text="InventoryUOMName"
                      item-value="IDX_M_InventoryUOM"
                      label="Pilih Unit"
                    ></v-select>
                  <span v-else>SEDANG OPNAME</span>
                </td>
                <td class="text-xs-center">
                  <v-textarea v-if="!props.item.isOpname" solo-inverted label="Note" v-model="props.item.Remarks" />
                  <span v-else>SEDANG OPNAME</span>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn dark @click="toSave()"><v-icon color="green" left>save</v-icon>SIMPAN</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
    setTimeout(() => this.loadList(), 100);
    setTimeout(() => this.loadRequest(), 200);
  },
  components:{
    ActionMenu,StatusRequest
  },
  data(){
    return {
      lists:[],
      selectedRequest:[],
      selectedFormNo:null,
      selectedRequestDate: this.$moment(new Date()).format("DD MMMM YYYY | HH:mm"),
      selectedRequestCompany: null,
      selectedRequestUser: null,
      selectedRequestCondition: null,
      selectedRequestDepartmentHead:null,
      selectedRequestDepartmentHead2:null,
      selectedRemarks:null,
      selectedReceivedBy:null,
      selectedReceivedRemarks:null,
      selectedAdvanceStockRealization:[],
      
      items: [],
      listHRList:[],
      listsRequest:[],
      sheetDialog:false,
      addStockDialog:false,
      editStockDialog:false,
      crossceheckRealizationDialog:false,

      receivedDialog:false,
      showInfo:true,
      isUpdate:false,
      isCancel:false,
      isRequest:false,
      isEdit:false,
      isAddRealization:false,
      isApprove:false,
      isClosed:false,
      isReject:false,
      isReceived:false,

      headers:[
        { text:'Kode Barang',align:'center',sortable:true,value:'InventoryStockCode' },
        { text:'Nama Barang',align:'center',sortable:true,value:'InventoryStockName' },
        { text:'Kuantiti',align:'center',sortable:true,value:'Qty' },
        { text:'Realisasi',align:'center',sortable:true,value:'QtyRealization' },
        { text:'Saldo Akhir',align:'center',sortable:true,value:'QtyOutPending' },
        { text:'Unit',align:'center',sortable:true,value:'InventoryUoMName' },
        { text:'Note',align:'center',sortable:true,value:'Remarks' },
      ],
    }
  },
  methods:{
    init(id){
      setTimeout(() => this.loadList(id), 100);
      setTimeout(() => this.loadRequest(id), 200);
    },
    loadList(v){
      let i = v == null ? this.id : v;
      let id = {
        Session_ID: this.$session.get('SESSION_ID'),
        IDX_T_OutRequestForm: i
      }

      this.axios
        .post("ATKManage/loadManageRequest_ByIDXRequest",id)
        .then(response => {
          let r = JSON.parse(response.data)['Table'][0];
          this.selectedRequestUser = r.RequestName;
          this.selectedFormNo = r.OutRequestFormNo;
          this.selectedRequestDate = this.$moment(r.OutRequestFormDate).format('DD MMMM YYYY');
          this.selectedRequestCompany = r.CompanyName;
          this.selectedRequestDepartmentHead = r.HeadApprovalName;
          this.selectedReceivedBy = r.RequestedBy;
          this.selectedRemarks = r.Remarks;
          this.isAddRealization = r.isAddRealization;
          this.isApprove = r.isApprove;
          this.isClosed = r.isClosed;
          this.isReceived = r.isReceived;
          this.isReject = r.isReject;
        }).catch(error => this.showAlert("ERROR  : " + error.statusText, "error"));
    },
    loadRequest(v){
      let i = v == null ? this.id : v;
      let id = {
        Session_ID: this.$session.get('SESSION_ID'),
        IDX_M_InventoryStock:this.selectedAdvanceStockRealization.toString(),
        IDX_T_OutRequestForm: i,
        // CurrentPage:1,
        // PageSize:999,
        // MaxPage:0
      }

      this.axios
        .post("ATKManage/loadManageRequestDetail_ByIDXRequest",id)
        .then(response => this.listsRequest = JSON.parse(response.data)['Table'])
        .catch(error => this.showAlert("ERROR  : " + error.statusText, "error"));
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
