<template>
  <v-container fluid>
    <v-layout column>
      <v-flex xs12 sm12 md12 lg12 x12>
        <v-card dark>
          <v-toolbar flat dense>
            <v-toolbar-title>INFORMASI</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
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
                    <v-subheader class="subtitle">{{ selectedRequestDate.toUpperCase() }}</v-subheader>                            
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs4 sm4 md4 lg4>
                      <v-subheader>PT / COMPANY</v-subheader>
                  </v-flex>                           
                  <v-flex xs8 sm8>                                                    
                    <v-autocomplete clearable solo-inverted label="Pilih PT / Company" :items="listsCompany" item-text="CompanyName" item-value="IDX_M_Company" :required="true" v-model="selectedRequestCompany"></v-autocomplete>                                             
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs4 sm4 md4 lg4>
                      <v-subheader>APPROVER</v-subheader>
                  </v-flex>                           
                  <v-flex xs7 sm7>                                                    
                    <v-autocomplete solo-inverted disabled :items="listHRList" item-text="NAMEANDPOS" item-value="NIK" :required="true" v-model="selectedRequestDepartmentHead"></v-autocomplete>                                              
                  </v-flex>
                  <v-flex xs1 sm1>
                    <v-tooltip bottom>
                      <v-btn fab small light slot="activator" @click="deptHeadDialog =! deptHeadDialog"><v-icon>search</v-icon></v-btn>  
                      <span>Cari Approver</span>
                    </v-tooltip>
                  </v-flex>
                </v-layout>
                <!-- <v-layout row>
                  <v-flex xs4 sm4 md4 lg4>
                      <v-subheader>APPROVER 2</v-subheader>
                  </v-flex>                           
                  <v-flex xs7 sm7>                                                    
                    <v-autocomplete outline disabled :items="listHRList" item-text="NAMEANDPOS" item-value="NIK" :required="true" v-model="selectedRequestDepartmentHead2"></v-autocomplete>                                              
                  </v-flex>
                  <v-flex xs1 sm1>
                    <v-tooltip bottom>
                      <v-btn dark fab small slot="activator" @click="deptHeadDialog2 =! deptHeadDialog2"><v-icon>search</v-icon></v-btn>  
                      <span>Cari Approver 2</span>
                    </v-tooltip>
                  </v-flex>
                </v-layout> -->
              </v-flex>
              <v-flex sm6>
                <v-layout row>
                  <v-flex xs4 sm4 md4 lg4>
                      <v-subheader>DIBUAT OLEH</v-subheader>
                  </v-flex>                           
                  <v-flex xs7 sm7>                                                    
                    <v-subheader class="subtitle">{{ selectedRequestUser }}</v-subheader>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs4 sm4 md4 lg4>
                      <v-subheader>Note **</v-subheader>
                  </v-flex>                           
                  <v-flex xs7 sm7>                                                    
                    <v-textarea solo-inverted v-model="selectedRemarks"></v-textarea>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12 sm12 md12 lg12 x12 mt-2>
        <v-card flat dark>
          <v-toolbar flat dense dark>
            <v-toolbar-title>PERMINTAAN BARANG</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn small outline @click="openChooseStock()"><v-icon left color="yellow">add</v-icon> PILIH BARANG</v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-card-text>
            <v-data-table :headers="headers" :items="selectedRequest" :expand="true">
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
            <v-btn @click="save(0)"><v-icon color="lime" left>drafts</v-icon>SIMPAN DRAFT</v-btn>
            <v-btn @click="save(1)"><v-icon color="cyan" left>send</v-icon>KIRIM REQUEST</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>

    <!-- SHEET -->
    <v-dialog v-model="sheetDialog" :overlay="false" max-width="80%">
      <v-card>
        <v-toolbar flat dense dark>
          <v-toolbar-title>
            <v-progress-circular v-if="$store.state.loading" :indeterminate="$store.state.loading" background-color="blue" color="lime" width="3"></v-progress-circular> 
            PILIH BARANG
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn @click="sheetDialog =! sheetDialog"><v-icon>clear</v-icon></v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <ChooseStock :vmodel="sheetDialog" @select="selected" ref="stock" :idxCompany="selectedRequestCompany" />  
        </v-card-text>
      </v-card>
    </v-dialog>
    

    <!-- DIALOG -->
    <v-dialog v-model="deptHeadDialog" persistent :overlay="false" max-width="80%">
      <v-card>
        <v-toolbar flat dense dark>
          <v-toolbar-title>Pilih Approver</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn flat fab small @click.stop="deptHeadDialog =! deptHeadDialog"><v-icon>close</v-icon></v-btn>
        </v-toolbar> 
        <v-card-text>
          <GetDeptHead :items="listHRList" @select="selectDeptHead" />
        </v-card-text> 
      </v-card>
    </v-dialog>

    <v-dialog v-model="deptHeadDialog2" persistent :overlay="false" max-width="80%">
      <v-card>
        <v-toolbar flat dense>
          <v-toolbar-title>Pilih Approver 2</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn flat fab small @click.stop="deptHeadDialog2 =! deptHeadDialog2"><v-icon>close</v-icon></v-btn>
        </v-toolbar> 
        <v-card-text>
          <GetDeptHead :items="listHRList" @select="selectDeptHead2" />
        </v-card-text> 
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import GetDeptHead from '@/components/Request/GetDeptHead'
import ChooseStock from '@/components/Request/ChooseStock'
import { constants } from 'crypto';
import { isUndefined, isNullOrUndefined } from 'util';

export default {
  name:'new-request',
  components:{
    GetDeptHead,ChooseStock
  },
  mounted(){
    this.loadAdditionalList()
  },
  watch:{
    
  },
  data(){
    return {
      lists:[],
      selectedRequest:[],
      selectedRequestDate: this.$moment(new Date()).format("DD MMMM YYYY"),
      selectedRequestCompany: null,
      selectedRequestUser: this.$session.get('FULLNAME'),
      selectedRequestDepartmentHead:null,
      selectedRequestDepartmentHead2:null,
      selectedRemarks:null,
      
      items: [],
      listsCompany: [],
      listHRList:[],
      listsConversion:[],
      listsUoM:[],
      sheetDialog:false,

      deptHeadDialog:false,
      deptHeadDialog2:false,
      showInfo:true,
      money_format: {
        decimal: '.',
        thousands: ',',
        prefix: '',
        suffix: '',
        precision: 2
      },

      headers:[
        { text:'AKSI',align:'center',sortable:false,value:null },
        { text:'Kode Barang',align:'center',sortable:true,value:'InventoryStockCode' },
        { text:'Nama Barang',align:'center',sortable:true,value:'InventoryStockName' },
        { text:'Kuantiti',align:'center',sortable:true,value:'Qty' },
        { text:'Unit',align:'center',sortable:false,value:null },
        { text:'Note',align:'center',sortable:true,value:'Remarks' },
      ]
    }
  },
  methods:{
    init(){
      this.loadAdditionalList();
    },
    filteredUoM(id){
      return this.listsUoM.filter((k) => k.IDX_M_InventoryStock == id);
    },
    openChooseStock(){
      if(this.selectedRequestCompany == null){
        this.showAlert("Please select company.","error");
      } else {
        this.sheetDialog = this.sheetDialog =! this.sheetDialog;
      }
    },
    selectDeptHead(p){
      this.selectedRequestDepartmentHead = p;
      this.deptHeadDialog = false;
    },
    selectDeptHead2(p){
      this.selectedRequestDepartmentHead2 = p;
      this.deptHeadDialog2 = false;
    },
    selected(p){
      this.selectedRequest = p;
    },
    remove(n){
      let id = this.selectedRequest[n].IDX_M_InventoryStock;
      this.selectedRequest.splice(n,1);
      setTimeout(() => this.$refs.stock.remove(id),300);
    },
    save(n=0){
      let r = [];
      this.selectedRequest = this.selectedRequest.filter((k) => k.isOpname != 1);
      let filterQty = this.selectedRequest.filter(k => isNaN(k.Qty));
      if(filterQty.length > 0){
        this.showAlert("Kuantiti pada barang yang diminta TIDAK boleh kosong atau 0.","error");
        return false;
      }

      let filterUoM = this.selectedRequest.filter(k => isNullOrUndefined(k.IDX_M_InventoryUoM));
      if(filterUoM.length > 0){
        this.showAlert("Unit pada barang yang diminta TIDAK boleh kosong.","error");
        return false;
      }

      for(let i=0;i<this.selectedRequest.length;i++){
        r.push({
          IDX_M_InventoryStock:this.selectedRequest[i].IDX_M_InventoryStock,
          isDefault:this.selectedRequest[i].isDefault,
          Qty:Number(this.selectedRequest[i].Qty),
          IDX_M_InventoryUoM:this.selectedRequest[i].IDX_M_InventoryUoM,
          Remarks:this.selectedRequest[i].Remarks,
        });
      }
      
      let id = {
        NIK: this.$session.get('SESSION_ID'),
        IDX_M_Company: this.selectedRequestCompany,
        HeadApprovedBy: this.selectedRequestDepartmentHead,
        Remarks: this.selectedRemarks,
        ItemRequest: r
      }

      this.client(n == 1 
        ? "ATKRequest/saveRequest_Submit" 
        : "ATKRequest/saveRequest_Draft",id,(res) => {
          if(res['Table'][0].StatusCSS == 'success'){
            this.selectedRemarks = null;
            this.selectedRequestCompany = null;
            this.selectedRequestDepartmentHead = null;
            this.selectedRequest = [];
            this.$emit('close',false)
          }
        });
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
