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
                    <v-chip class="white"><v-subheader class="black--text subtitle">{{ selectedRequestDate }}</v-subheader></v-chip>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs4 sm4 md4 lg4>
                      <v-subheader>PT / COMPANY</v-subheader>
                  </v-flex>                           
                  <v-flex xs8 sm8>
                    <v-autocomplete :disabled="!isUpdate" solo-inverted v-model="selectedRequestCompany" :items="listsCompany" item-text="CompanyName" item-value="IDX_M_Company" label="Company" />
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
                      <v-subheader>NOTE **</v-subheader>
                  </v-flex>                           
                  <v-flex xs7 sm7>   
                    <v-textarea :disabled="!isUpdate" solo-inverted v-model="selectedRemarks" label="Note" />                    
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions class="justify-center" v-if="isUpdate">
            <v-btn @click="updateInformation()"><v-icon left color="lime">save</v-icon>UPDATE INFORMATION</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex xs12 sm12 md12 lg12 x12 mt-2>
        <v-card dark>
          <v-toolbar flat dense>
            <v-toolbar-title>OPNAME BARANG</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn flat @click="addStockDialog =! addStockDialog"><v-icon color="lime" left>add</v-icon>TAMBAH BARANG</v-btn>
              <v-btn flat @click="loadRequest()"><v-icon>refresh</v-icon></v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-card-text>
            <v-data-table :headers="headers" :items="listsRequest" :expand="true">
              <template v-slot:items="props">
                <tr :style="props.item.isOpname ? 'color:yellow' : null">
                  <td class="text-xs-center">
                    <ActionMenu 
                      :id="props.item.IDX_T_InventoryStockOpname"
                      :isLocked="props.item.isLocked"
                      :isVerify="props.item.isVerify"
                      :isRemove="props.item.isCancel"
                      @action="actionMenu"
                    />
                  </td>
                  <td class="text-xs-left">
                    <v-chip flat><v-icon left :color="props.item.OpnameColor">fiber_manual_record</v-icon> {{ props.item.OpnameStatus.toUpperCase() }}</v-chip>
                  </td>
                  <td class="text-xs-center">{{ props.item.InventoryStockCode }}</td>
                  <td class="text-xs-center">{{ props.item.InventoryStockName }}</td>
                  <td class="text-xs-center"><v-chip class="title">{{ props.item.BalanceSaldo }} </v-chip></td>
                  <td class="text-xs-center"><v-chip class="title">{{ props.item.QtySaldo }} </v-chip></td>
                  <td class="text-xs-center"><v-chip class="title">{{ props.item.SelisihSaldo }} </v-chip></td>
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

    <!-- TAMBAH BARANG -->
    <v-dialog v-model="addStockDialog" scrollable fullscreen>
      <v-card>
        <v-toolbar flat dense dark>
          <v-toolbar-title>
            <v-progress-circular v-if="$store.state.loading" :indeterminate="$store.state.loading" background-color="blue" color="lime" width="3"></v-progress-circular> 
            TAMBAH BARANG OPNAME
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn flat @click="sheetDialog =! sheetDialog, $refs.stock.loadList()"><v-icon color="lime" left>add</v-icon>PILIH BARANG</v-btn>
            <v-btn flat @click="addStockDialog =! addStockDialog"><v-icon>clear</v-icon></v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <v-alert color="black" :value="true">
            <v-icon small color="red darken-1">delete</v-icon> Delete barang yang dipilih <br />
            <v-icon small color="white">locked</v-icon> Barang tidak akan diproses, karena sedang dilakukan opname (status locked) <br />
            <v-icon small color="white">block</v-icon> Barang tidak akan diproses, karena tanggal opname terakhir > tanggal opname yang Anda pilih <br />
            <v-icon small color="white">text_fields</v-icon> Barang tidak akan diproses, karena sudah ada dalam batch tersebut
          </v-alert>
          <v-data-table :headers="headersStock" :items="selectedRequest" :expand="true" dark>
            <template v-slot:items="props">
                <tr :style="props.item.isOpname || findDuplicated(props.item.IDX_M_InventoryStock) ? 'color:yellow' : null">
                  <td class="text-xs-center">
                    <v-btn icon @click="remove(props.index)">
                      <v-icon :color="props.item.isOpname ? 'amber darken-1' : 'red darken-1'">{{ props.item.isOpname ? 'delete' : 'delete_forever' }}</v-icon>
                    </v-btn>
                    <v-icon small v-if="props.item.isOpname">locked</v-icon>
                    <v-icon small v-if="diffDate(props.item.LastOpname) > 0">block</v-icon>
                    <v-icon small v-if="findDuplicated(props.item.IDX_M_InventoryStock)">text_fields</v-icon>
                  </td>
                  <td class="text-xs-center">
                    <span v-if="props.item.LastOpname == null"><v-icon color="lime" small left>info_outline</v-icon> BELUM ADA OPNAME</span>
                    <span v-else>{{ $moment(props.item.LastOpname).format('DD MMMM YYYY | HH:mm') }} at {{ diffDate(props.item.LastOpname) }} days</span>
                  </td>
                  <td class="text-xs-center">{{ props.item.InventoryStockCode }}</td>
                  <td class="text-xs-center">{{ props.item.InventoryStockName }}</td>
                  <td class="text-xs-center">
                    <v-text-field v-if="!props.item.isOpname" solo-inverted label="Kuantitas" v-model="props.item.Qty" type="number"></v-text-field>
                    <span v-else>SEDANG OPNAME</span>
                  </td>
                  <td class="text-xs-center">
                    <v-select v-if="!props.item.isOpname" 
                      solo-inverted
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
  </v-container>
</template>

<script>
import ActionMenu from '@/components/Core/ActionMenu'
import StatusRequest from '@/components/Request/StatusRequest'
import ChooseStock from '@/components/Request/ChooseStock'
import { isNullOrUndefined } from 'util';

export default {
  name:'edit-barang-keluar',
  props:{
    id:null
  },
  mounted(){
    this.loadAdditionalList();
    setTimeout(() => this.loadList(), 100);
    setTimeout(() => this.loadRequest(), 200);
  },
  components:{
    ActionMenu,StatusRequest,ChooseStock
  },
  data(){
    return {
      lists:[],
      listsCompany:[],
      selectedRequest:[],
      selectedFormNo:null,
      selectedRequestDate: null,
      selectedRequestCompany: null,
      selectedRequestUser: null,
      selectedRequestCondition: null,
      selectedRemarks:null,
      selectedReceivedRemarks:null,
      
      items: [],
      listsRequest:[],
      sheetDialog:false,
      addStockDialog:false,
      editStockDialog:false,
      
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
      differenceDays:null,

      headers:[
        { text:'Aksi',align:'center',sortable:false,value:'' },
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

      headersStock:[
        { text:'AKSI',align:'center',sortable:false,value:null },
        { text:'Opname Terakhir',align:'center',sortable:true,value:'LastOpname' },
        { text:'Kode Barang',align:'center',sortable:true,value:'InventoryStockCode' },
        { text:'Nama Barang',align:'center',sortable:true,value:'InventoryStockName' },
        { text:'Opname Kuantiti',align:'center',sortable:true,value:'Qty' },
        { text:'Unit',align:'center',sortable:false,value:null },
        { text:'Note',align:'center',sortable:true,value:'Remarks' },
      ]
    }
  },
  methods:{
    init(id){
      this.loadAdditionalList()
      setTimeout(() => this.loadList(id), 100);
      setTimeout(() => this.loadRequest(id), 200);
    },
    diffDate(opnameDate){
      let now = this.$moment(this.selectedOpnameDate);
      let selected = this.$moment(opnameDate,'YYYY-MM-DD');
      let days = selected.diff(now,'days');
      this.differenceDays = days;
      return days;
    },
    findDuplicated(idx){
      let x = this.listsRequest.filter((k) => k.IDX_M_InventoryStock == idx);
      return x.length > 0 ? true : false;
    },
    actionMenu(p){
      let code = p.code;
      let id = p.id;
      let arr = this.listsRequest.filter(k => { return k.IDX_T_InventoryStockOpname == id })
      let is = arr[0].isDisable;
      
      switch (code){
        case 'isLocked':
          this.toWhat('LOCKED',id);
        break;
        case 'isRemove':
          this.toWhat('CANCEL',id);
        break;
        case 'isVerify':
          this.toWhat('VERIFY',id);
        break;
      }
    },
    filteredUoM(id){
      return this.listsUoM.filter((k) => k.IDX_M_InventoryStock == id);
    },
    remove(n){
      let id = this.selectedRequest[n].IDX_M_InventoryStock;
      this.selectedRequest.splice(n,1);
      setTimeout(() => this.$refs.stock.remove(id),300);
    },
    selected(p){
      this.selectedRequest = p;
    },
    toSave(){
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
          Qty:Number(this.selectedRequest[i].Qty),
          IDX_M_InventoryUOM:this.selectedRequest[i].IDX_M_InventoryUoM
        });
      }
      
      let id = {
        Session_ID: this.$session.get('SESSION_ID'),
        IDX_T_InventoryStockOpnameHeader: this.id,
        ItemRequest: r
      }

      this.client("Stock/loadOpnameDetail_Save",id,(res) => {
          if(res['Table'][0].StatusCSS == 'success'){
            this.selectedRequest = [];
            this.addStockDialog = false;
            this.loadRequest();
            this.$emit('close',false)
          }
        });
    },
    toWhat(code,i){
      let id = {
        Session_ID: this.$session.get('SESSION_ID'),
        IDX_T_InventoryStockOpname: Number(i)
      }
      let url = code == "LOCKED" ? "Stock/loadOpnameDetail_Locked" 
          : code == "CANCEL" ? "Stock/loadOpnameDetail_Cancel"
          : "Stock/loadOpnameDetail_Verify";

      this.client(url,id,() => {
        this.loadRequest();
        this.loadList();
      });
    },
    updateInformation(){
      let id = {
        IDX_T_InventoryStockOpnameHeader: Number(this.id),
        IDX_M_Company: this.selectedRequestCompany,
        Remarks: this.selectedRemarks,
        Session_ID: this.$session.get('SESSION_ID'),
      }
      this.client("Stock/updateOpname",id,() => this.loadList());
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
          this.selectedRequestDate = this.$moment(r.OpnameDate).format('YYYY-MM-DD');
          this.selectedRequestCompany = r.IDX_M_Company;
          this.selectedRemarks = r.Remarks;
          this.isUpdate = r.isUpdate;
          
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
