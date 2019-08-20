<template>
  <v-container fluid>
    <v-layout column>
      <v-flex xs12 sm12 md12 lg12 x12>
        <v-card dark>
          <v-toolbar flat dense>
            <v-toolbar-title>INFORMASI</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
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
                    <v-text-field v-model="selectedOpnameDate" type="date" label="Opname Date" solo-inverted />                       
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs4 sm4 md4 lg4>
                      <v-subheader>PT / COMPANY</v-subheader>
                  </v-flex>                           
                  <v-flex xs8 sm8>                                                    
                    <v-autocomplete clearable solo-inverted label="Pilih PT / Company" :items="listsCompany" item-text="CompanyName" item-value="IDX_M_Company" :required="true" v-model="selectedOpnameCompany"></v-autocomplete>                                             
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex sm6>
                <v-layout row>
                  <v-flex xs4 sm4 md4 lg4>
                      <v-subheader>Note **</v-subheader>
                  </v-flex>                           
                  <v-flex xs7 sm7>                                                    
                    <v-textarea solo-inverted v-model="selectedOpnameRemarks"></v-textarea>
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
            <v-toolbar-title>OPNAME BARANG</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn flat @click="openChooseStock()"><v-icon left color="yellow">add</v-icon> PILIH BARANG</v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-card-text>
            <v-alert color="black" :value="true">
              <v-icon small color="red darken-1">delete</v-icon> Delete barang yang dipilih <br />
              <v-icon small>locked</v-icon> Barang tidak akan diproses, karena sedang dilakukan opname (status locked) <br />
              <v-icon small>block</v-icon> Barang tidak akan diproses, karena tanggal opname terakhir > tanggal opname yang Anda pilih <br />
              <v-icon small color="white">text_fields</v-icon> Barang tidak akan diproses, karena sudah ada dalam batch tersebut
            </v-alert>
            <v-data-table :headers="headers" :items="selectedRequest" :expand="true">
              <template v-slot:items="props">
                <tr :style="props.item.isOpname ? 'color:yellow' : null">
                  <td class="text-xs-center">
                    <v-btn icon @click="remove(props.index)">
                      <v-icon :color="props.item.isOpname ? 'amber darken-1' : 'red darken-1'">{{ props.item.isOpname ? 'delete' : 'delete_forever' }}</v-icon>
                    </v-btn>
                    <v-icon small v-if="props.item.isOpname">locked</v-icon>
                    <v-icon small v-if="diffDate(props.item.LastOpname) > 0">block</v-icon>
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
            <v-btn @click="save()"><v-icon color="cyan" left>save</v-icon>SIMPAN</v-btn>
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
          <ChooseStock :vmodel="sheetDialog" @select="selected" ref="stock" :idxCompany="selectedOpnameCompany" />  
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
  name:'new-opname',
  components:{
    GetDeptHead,ChooseStock
  },
  mounted(){
    this.loadAdditionalList()
  },
  data(){
    return {
      listsCompany:[],
      listsUoM:[],
      selectedRequest:[],
      selectedOpnameCompany: null,
      selectedOpnameDate:null,
      selectedOpnameRemarks:null,
      differenceDays:null,

      sheetDialog:false,
      showInfo:true,
      headers:[
        { text:'AKSI',align:'center',sortable:false,value:null },
        { text:'Opname Terakhir',align:'center',sortable:true,value:'LastOpnameDate' },
        { text:'Kode Barang',align:'center',sortable:true,value:'InventoryStockCode' },
        { text:'Nama Barang',align:'center',sortable:true,value:'InventoryStockName' },
        { text:'Opname Kuantiti',align:'center',sortable:true,value:'Qty' },
        { text:'Unit',align:'center',sortable:false,value:null },
        { text:'Note',align:'center',sortable:true,value:'Remarks' },
      ]
    }
  },
  methods:{
    init(){
      this.loadAdditionalList();
    },
    diffDate(opnameDate){
      let now = this.$moment(this.selectedOpnameDate);
      let selected = this.$moment(opnameDate,'YYYY-MM-DD');
      let days = selected.diff(now,'days');
      this.differenceDays = days;
      return days;
    },
    filteredUoM(id){
      return this.listsUoM.filter((k) => k.IDX_M_InventoryStock == id);
    },
    openChooseStock(){
      if(this.selectedOpnameCompany == null || this.selectedOpnameDate == null){
        this.$store.commit('alert',{ color:'warning',message:'Please select company and opname date',alert:true });
      } else {
        this.sheetDialog = this.sheetDialog =! this.sheetDialog;
        this.$refs.stock.loadList();
      }
    },
    selected(p){
      this.selectedRequest = p;
    },
    remove(n){
      let id = this.selectedRequest[n].IDX_M_InventoryStock;
      this.selectedRequest.splice(n,1);
      setTimeout(() => this.$refs.stock.remove(id),300);
    },
    save(){
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
        IDX_M_Company: this.selectedOpnameCompany,
        OpnameDate: this.selectedOpnameDate,
        Remarks: this.selectedOpnameRemarks,
        ItemRequest: r
      }

      this.client("Stock/saveOpname",id,(res) => {
          if(res['Table'][0].StatusCSS == 'success'){
            this.selectedOpnameRemarks = null;
            this.selectedOpnameCompany = null;
            this.selectedOpnameDate = null;
            this.selectedRequest = [];
            this.$emit('close',false)
          }
        });
    },
    loadAdditionalList(){
      this.axios
        .post("Stock/loadOpnameAdditionalList", {})
        .then(response => {
          this.listsUoM = JSON.parse(response.data)['Table'];
          this.listsCompany = JSON.parse(response.data)['Table1'];
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
