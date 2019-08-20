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
              <v-btn color="blue" icon @click="loadList()"><v-icon>refresh</v-icon></v-btn>
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
                      <v-btn light fab small slot="activator" @click="deptHeadDialog =! deptHeadDialog"><v-icon>search</v-icon></v-btn>  
                      <span>Cari Approver</span>
                    </v-tooltip>
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
                    <v-textarea v-model="selectedRemarks" solo-inverted></v-textarea>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn dark @click="updateInfo()"><v-icon color="lime" left>save</v-icon> UPDATE INFORMASI</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex xs12 sm12 md12 lg12 x12 mt-2>
        <v-card dark>
          <v-toolbar flat dense>
            <v-toolbar-title>PERMINTAAN BARANG</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn color="blue" icon @click="loadRequest()"><v-icon>refresh</v-icon></v-btn>
              <v-btn small outline @click="addStockDialog =! addStockDialog"><v-icon left color="yellow">add</v-icon> TAMBAH BARANG</v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-card-text>
            <v-data-table :headers="headers" :items="listsRequest" :expand="true">
              <template v-slot:items="props">
                <tr :style="props.item.isOpname ? 'color:yellow' : null">
                  <td class="text-xs-center">
                    <ActionMenu
                      :id="props.item.IDX_T_OutRequestFormInventory"
                      :isUpdate="props.item.isUpdate"
                      :isEnable="props.item.isEnable"
                      :skip="true"
                      :isDelete="props.item.isDelete"
                      @action="actionMenu"
                    />
                  </td>
                  <td class="text-xs-center">
                    <v-badge left overlap v-if="!props.item.isDisable">
                      <v-icon small color="red darken-1">visibility_off</v-icon>
                    </v-badge>{{ props.item.InventoryStockCode }}
                  </td>
                  <td class="text-xs-center">{{ props.item.InventoryStockName }}</td>
                  <td class="text-xs-center">{{ props.item.Qty }}</td>
                  <td class="text-xs-center">{{ props.item.InventoryUoMName }}</td>
                  <td class="text-xs-center">{{ props.item.Remarks }}</td>
                </tr>
              </template>
            </v-data-table>
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn @click="toCancel()"><v-icon color="red" left>cancel</v-icon>BATAL REQUEST</v-btn>
            <v-btn @click="toRequest()"><v-icon color="cyan" left>send</v-icon>KIRIM REQUEST</v-btn>
          </v-card-actions>
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
            <v-btn small outline @click="openChooseStock()"><v-icon left color="yellow">add</v-icon> TAMBAH BARANG</v-btn>
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
    <v-dialog v-model="deptHeadDialog" :overlay="false" max-width="80%">
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

    <v-dialog v-model="editStockDialog" persistent :overlay="false" max-width="60%">
      <v-card dark>
        <v-toolbar flat dense dark>
          <v-toolbar-title>EDIT BARANG</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn flat fab small @click.stop="editStockDialog =! editStockDialog"><v-icon>close</v-icon></v-btn>
        </v-toolbar> 
        <v-card-text>
          <v-layout row wrap>
            <v-flex xs12>
              <v-chip><v-subheader class="title">{{ editedStockCode +' - '+editedStockName }}</v-subheader></v-chip>
              <v-text-field solo-inverted label="Kuantitas" v-model="editedQty" type="number"></v-text-field>
              <v-select solo-inverted
                :items="filteredUoM(editedIDX_M_InventoryStock)"
                v-model="editedIDX_M_InventoryUoM"
                item-text="InventoryUOMName"
                item-value="IDX_M_InventoryUOM"
                label="Pilih Unit"
              ></v-select>
              <v-textarea solo-inverted label="Note" v-model="editedNote" />
            </v-flex>
          </v-layout>
        </v-card-text> 
        <v-card-actions class="justify-center">
          <v-btn dark @click="toUpdateStock()"><v-icon color="green" left>save</v-icon>UPDATE</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import GetDeptHead from '@/components/Request/GetDeptHead'
import ChooseStock from '@/components/Request/ChooseStock'
import ActionMenu from '@/components/Core/ActionMenu'
import StatusRequest from '@/components/Request/StatusRequest'
import { isNullOrUndefined } from 'util';

export default {
  name:'edit-request',
  props:{
    id:null
  },
  mounted(){
    this.loadAdditionalList();
    setTimeout(() => this.loadList(), 100);
    setTimeout(() => this.loadRequest(), 200);
  },
  components:{
    GetDeptHead,ChooseStock,ActionMenu,StatusRequest
  },
  data(){
    return {
      lists:[],
      selectedRequest:[],
      selectedFormNo:null,
      selectedRequestDate: this.$moment(new Date()).format("DD MMMM YYYY"),
      selectedRequestCompany: null,
      selectedRequestUser: null,
      selectedRequestDepartmentHead:null,
      selectedRequestDepartmentHead2:null,
      selectedRemarks:null,
      editedStockCode:null,
      editedQty:null,
      editedStockName:null,
      editedNote:null,
      editedIDX_M_InventoryStock:null,
      editedIDX_T_OutRequestFormInventory:null,
      editedIDX_M_InventoryUoM:null,
      
      items: [],
      listsRequest:[],
      listsCompany: [],
      listHRList:[],
      listsConversion:[],
      sheetDialog:false,
      addStockDialog:false,
      editStockDialog:false,

      deptHeadDialog:false,
      deptHeadDialog2:false,
      showInfo:true,
      isUpdate:false,
      isCancel:false,
      isRequest:false,

      headers:[
        { text:'AKSI',align:'center',sortable:false,value:null },
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
      this.loadAdditionalList()
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
    toUpdateStock(){
      let id = {
        IDX_T_OutRequestFormInventory:this.editedIDX_T_OutRequestFormInventory,
        IDX_M_InventoryStock:this.editedIDX_M_InventoryStock,
        IDX_M_InventoryUoM:this.editedIDX_M_InventoryUoM,
        Qty:this.editedQty,
        Remarks:this.editedNote,
        NIK: this.$session.get('SESSION_ID'),
      }
      this.client("ATKRequest/updateRequestDetail",id,() => { 
        this.loadRequest();
        this.editStockDialog = this.editStockDialog =! this.editStockDialog;
      });
    },
    toCancel(){
      let id = {
        NIK: this.$session.get('SESSION_ID'),
        IDX_T_OutRequestForm: this.id
      }

      this.client("ATKRequest/cancelRequest_ByIDXRequest",id,(res) => {
        if(res['Table'][0].StatusCSS == 'success'){
          this.$emit('close',false)
        }
      });
    },
    toRequest(){
      let id = {
        NIK: this.$session.get('SESSION_ID'),
        IDX_T_OutRequestForm: this.id
      }

      this.client("ATKRequest/submitRequest_ByIDXRequest",id,(res) => {
        if(res['Table'][0].StatusCSS == 'success'){
          this.$emit('close',false);
          this.$refs.step.loadList();
        }
      });
    },
    toDelete(v){
      let id = {
        IDX_T_OutRequestFormInventory:v,
        NIK: this.$session.get('SESSION_ID'),
      }

      this.client("ATKRequest/deleteRequestDetail",id,() => this.loadRequest());
    },
    toDisableEnable(v,i){
      let id = {
        IDX_T_OutRequestFormInventory:v,
        NIK: this.$session.get('SESSION_ID'),
      }

      this.client(i ? "ATKRequest/enableRequestDetail" : "ATKRequest/disableRequestDetail",id,() => this.loadRequest());
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
          isDefault:this.selectedRequest[i].isDefault,
          Qty:Number(this.selectedRequest[i].Qty) == null ? 0 : Number(this.selectedRequest[i].Qty),
          IDX_M_InventoryUoM:this.selectedRequest[i].IDX_M_InventoryUoM,
          Remarks:this.selectedRequest[i].Remarks,
        });
      }
      
      let id = {
        NIK: this.$session.get('SESSION_ID'),
        IDX_T_OutRequestForm: this.id,
        ItemRequest: r
      }

      this.client("ATKRequest/saveRequestDetail",id,(res) => {
        if(res['Table'][0].StatusCSS == 'success'){
          this.selectedRequest = [];
          this.addStockDialog = this.addStockDialog =! this.addStockDialog;
          this.loadRequest();
        }
      });
    },
    updateInfo(){
      let id = {
        NIK: this.$session.get('SESSION_ID'),
        IDX_T_OutRequestForm: Number(this.id),
        IDX_M_Company: this.selectedRequestCompany,
        HeadApprovedBy: this.selectedRequestDepartmentHead,
        Remarks: this.selectedRemarks
      }
      this.client('ATKRequest/updateRequest',id,() => this.loadList());
    },
    loadList(v){
      let i = v == null ? this.id : v;
      let id = {
        NIK: this.$session.get('SESSION_ID'),
        IDX_T_OutRequestForm: i
      }

      this.axios
        .post("ATKRequest/loadRequest_ByIDXRequest",id)
        .then(response => {
          let r = JSON.parse(response.data)['Table'][0];
          this.selectedRequestUser = r.RequestName;
          this.selectedFormNo = r.OutRequestFormNo;
          this.selectedRequestDate = this.$moment(r.OutRequestFormDate).format('DD MMMM YYYY');
          this.selectedRequestCompany = r.IDX_M_Company;
          this.selectedRequestDepartmentHead = r.HeadApprovalBy;
          this.selectedRemarks = r.Remarks;
          this.isCancel = r.isCancel;
          this.isRequest = r.isRequest;
        }).catch(error => this.showAlert("ERROR  : " + error.statusText, "error"));
    },
    loadRequest(v){
      let i = v == null ? this.id : v;
      let id = {
        NIK: this.$session.get('SESSION_ID'),
        IDX_T_OutRequestForm: i,
        Keyword:null,
        // CurrentPage:1,
        // PageSize:999,
        // MaxPage:0
      }

      this.axios
        .post("ATKRequest/loadRequestDetail_ByIDXRequest",id)
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
