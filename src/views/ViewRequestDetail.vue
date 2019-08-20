<template>
  <v-container fluid>
    <v-layout column>
      <v-flex xs12 sm12 md12 lg12 x12>
        <v-card dark>
          <v-toolbar flat dense>
            <v-toolbar-title>INFORMASI</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn icon @click="loadList()"><v-icon>refresh</v-icon></v-btn>
              <v-btn icon outline @click="showInfo =! showInfo"><v-icon>{{ showInfo ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</v-icon></v-btn>
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
                      <v-subheader>PO INFORMATION</v-subheader>
                  </v-flex>                           
                  <v-flex xs8 sm8>                                                    
                    <v-chip class="white"><v-subheader class="black--text subtitle">{{ selectedPONo }} - {{ selectedPODate }}</v-subheader></v-chip>  
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs4 sm4 md4 lg4>
                      <v-subheader>PO PRICE</v-subheader>
                  </v-flex>                           
                  <v-flex xs8 sm8>                                                    
                    <v-chip class="white"><v-subheader class="black--text subtitle">{{ selectedCurrency }} - {{ selectedUnitPrice }}</v-subheader></v-chip>  
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
          </v-toolbar>
          <v-card-text>
            <v-data-table :headers="headers" :items="listsRequest" :expand="true">
              <template v-slot:items="props">
                <tr :style="props.item.isOpname ? 'color:yellow' : null">
                  <td class="text-xs-center">{{ props.item.InventoryStockCode }}</td>
                  <td class="text-xs-center">{{ props.item.InventoryStockName }}</td>
                  <td class="text-xs-center">{{ props.item.Qty }}</td>
                  <td class="text-xs-center">{{ props.item.InventoryUoMName }}</td>
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
import { constants } from 'crypto';

export default {
  name:'edit-request',
  props:{
    id:null
  },
  mounted(){
    this.loadList();
    setTimeout(() => this.loadRequest(), 200);
  },
  components:{
    
  },
  data(){
    return {
      lists:[],
      selectedRequest:[],
      selectedFormNo:null,
      selectedRequestDate: this.$moment(new Date()).format("DD MMMM YYYY"),
      selectedRequestCompany: null,
      selectedRequestUser: null,
      selectedPONo:null,
      selectedPODate:null,
      selectedUnitPrice:null,
      selectedCurrency:null,
      selectedRemarks:null,
      
      items: [],
      listsRequest:[],
      showInfo:true,
      isUpdate:false,
      isCancel:false,
      isRequest:false,

      headers:[
        { text:'Kode Barang',align:'center',sortable:true,value:'InventoryStockCode' },
        { text:'Nama Barang',align:'center',sortable:true,value:'InventoryStockName' },
        { text:'Kuantiti',align:'center',sortable:true,value:'Qty' },
        { text:'Unit',align:'center',sortable:true,value:'InventoryUoMName' },
        { text:'Note',align:'center',sortable:true,value:'Remarks' },
      ]
    }
  },
  methods:{
    init(id){
      this.loadList(id);
      setTimeout(() => this.loadRequest(id), 200);
    },
    loadList(){
      let id = {
        IDX_T_InRequestForm: this.id
      }

      this.axios
        .post("ATKManage/loadRequest_ByIDXRequest",id)
        .then(response => {
          let r = JSON.parse(response.data)['Table'][0];
          this.selectedFormNo = r.InRequestFormNo;
          this.selectedRequestUser = r.RequestName;
          this.selectedRequestDate = this.$moment(r.InRequestFormDate).format('DD MMMM YYYY');
          this.selectedRequestCompany = r.CompanyName;
          this.selectedPONo = r.PONo;
          this.selectedPODate = r.PODate;
          this.selectedUnitPrice = r.UnitPrice;
          this.selectedCurrency = r.selectedCurrency;
          this.selectedRemarks = r.Remarks;
        }).catch(error => this.showAlert("ERROR  : " + error.statusText, "error"));
    },
    loadRequest(){
      let id = {
        Keyword:null,
        Session_ID: this.$session.get('SESSION_ID'),
        IDX_T_InRequestForm: this.id,
        IDX_M_InventoryStock:null,
        // CurrentPage:1,
        // PageSize:999,
        // MaxPage:0
      }

      this.axios
        .post("ATKManage/loadRequestDetail_ByIDXRequest",id)
        .then(response => {this.listsRequest = JSON.parse(response.data)['Table']})
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
