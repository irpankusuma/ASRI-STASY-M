<template>
  <div>
    <v-toolbar color="primary" flat>
      <v-toolbar-items>
        <v-btn @click="newAsset()" v-if="isNew"><v-icon left color="lime">add</v-icon>NEW ASSET</v-btn>
        <v-btn v-if="isReturn && selected.length > 0 ? true : false" @click="returnDialog =! returnDialog"><v-icon left color="lime">lens</v-icon>RETURN {{ '('+selected.length+')' }}</v-btn>
        <v-btn @click="printQRDialog =! printQRDialog" v-if="selected.length > 0"><v-icon left color="lime">center_focus_strong</v-icon>QR PRINT {{ '('+selected.length+')' }}</v-btn>
      </v-toolbar-items>
      <Search @search="actionSearch" />
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <FilterData :items="filterItems" :total="totalRecords" @filter="actionFilter" /> 
        <v-btn @click="print =! print"><v-icon left color="cyan">print</v-icon>PRINT</v-btn>
        <v-btn @click="$refs.assetFilter.toggle()"><v-icon color="cyan">search</v-icon></v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-card>
      <v-card-text>
        <v-data-table v-model="selected" :headers="headers" :items="lists" 
          select-all item-key="IDX_M_Asset" :expand="true">
          <template v-slot:items="props">
            <tr>
              <td><v-checkbox v-model="props.selected" color="lime" hide-details></v-checkbox></td>
              <td class="text-xs-center" @click="props.expanded = !props.expanded, IDX_M_Asset = props.item.IDX_M_Asset">
                <v-tooltip bottom>
                  <v-btn small icon outline :class="!props.item.isEnable ? 'green lighten-1' : 'red'" slot="activator">
                    <v-icon small>{{ !props.expanded ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
                  </v-btn>
                  <span>EXPAND ({{ !props.item.isEnable ? 'ENABLED' : 'DISABLED' }})</span>  
                </v-tooltip>
              </td>
              <td class="text-xs-center">
                <ActionMenu 
                  :id="props.item.IDX_M_Asset"
                  :isEnable="props.item.isEnable"
                  :isDelete="props.item.isDelete"
                  :isAssignLocation="props.item.isAssignLocation"
                  :isAssignStatus="props.item.isAssignStatus"
                  :isAssignUser="props.item.isAssignUser"
                  :isChangeCompany="props.item.isChangeCompany"
                  :isChangeManagement="props.item.isChangeManagement"
                  @action="actionMenu"
                />
              </td>
              <td class="text-xs-center">
                <v-tooltip right>
                  <v-icon slot="activator">{{ props.item.AssetTypeIcon }}</v-icon>
                  <span>{{ props.item.AssetType }}</span>
                </v-tooltip>
              </td>
              <td class="text-xs-center">{{ props.item.AssetID }} 
                <v-btn small icon v-if="props.item.isUpdate" @click="openEditAsset(props.item)"><v-icon small color="lime">edit</v-icon></v-btn>
              </td>
              <td class="text-xs-center">{{ props.item.CurrentAssetUser }}</td>
              <td class="text-xs-center">{{ props.item.AssetTypeModelName }}</td>
              <td class="text-xs-center">{{ props.item.CurrentAssetStatus }}</td>
              <td class="text-xs-center">{{ props.item.CurrentAssetLocation }}</td>
            </tr>
          </template>
          <template v-slot:expand="props">
            <v-card flat>
              <v-toolbar flat dense>
                <qriously :value="props.item.AssetID" :size="48" foreground="white" />
                <v-toolbar-title>
                  <v-subheader>{{ props.item.AssetID }} 
                    <v-chip small outline :color="!props.item.isEnable ? 'green lighten-1' : 'red'">
                      {{ props.item.Status }}    
                    </v-chip>
                  </v-subheader>
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                  <v-btn v-if="props.item.isConnectedASBSPO">
                    <v-icon left color="green lighten-2">visibility</v-icon>CHECK PO
                  </v-btn>
                  <v-btn v-if="props.item.isReturn">
                    <v-icon left color="lime">lens</v-icon>RETURNED
                  </v-btn>
                  <v-btn v-if="props.item.isUpdate" @click="openEditAsset(props.item)">
                    <v-icon left color="lime">edit</v-icon>EDIT
                  </v-btn>
                </v-toolbar-items>
              </v-toolbar>
              <v-card-text>
                <v-layout row wrap>
                  <DetailAsset ref="historyAsset" :id="IDX_M_Asset" :items="lists[0]" />
                </v-layout>
              </v-card-text>
            </v-card>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- ADVANCE FILTER -->
    <AssetFilter 
      ref="assetFilter"
      :assign="listsAssign" 
      :statuses="listsStatus"
      :users="listsUser"
      :locations="listsLocation"
      :department="listsDeparment"
      :brands="listsBrand"
      :type="listsType"
      :company="listsCompany"
      :assettype="listsAssetType"
      @search="actionAssetFilter"
    />

    <!-- PRINT -->
    <v-dialog v-model="print" fullscreen transition="dialog-bottom-transition" :overlay="false">            
      <Print :IDX="$session.get('SESSION_ID')" :type="'PrintOut_LaporanAsset'" param="Session_ID" @send-filter="print = false" />
    </v-dialog>

    <!-- ASSIGN UPDATE -->
    <v-dialog v-model="assignUserDialog" width="750" transition="dialog-bottom-transition" :overlay="false">            
      <AssignAsset title="Assign User" :items="listsUser" 
        itemText="AssetUserName" itemValue="IDX_M_AssetUser" 
        :assetID="AssetID" :idx="IDX_M_Asset" 
        @save="saveAssignUser"
      />
    </v-dialog>
    
    <v-dialog v-model="assignLocationDialog" width="750" transition="dialog-bottom-transition" :overlay="false">            
      <AssignAsset title="Assign Location" :items="listsLocation" 
        itemText="AssetLocationName" itemValue="IDX_M_AssetLocation" 
        :assetID="AssetID" :idx="IDX_M_Asset" 
        @save="saveAssignLocation"
      />
    </v-dialog>

    <v-dialog v-model="assignStatusDialog" width="750" transition="dialog-bottom-transition" :overlay="false">            
      <ChangeAsset title="Assign Status" :items="listsStatus" 
        itemText="AssetStatusName" itemValue="IDX_M_AssetStatus" 
        :assetID="AssetID" :idx="IDX_M_Asset" 
        @save="saveAssignStatus"
      />
    </v-dialog>

    <v-dialog v-model="changeCompanyDialog" width="750" transition="dialog-bottom-transition" :overlay="false">            
      <ChangeAsset title="Change Company" :items="listsCompany" 
        itemText="CompanyName" itemValue="IDX_M_Company" 
        :assetID="AssetID" :idx="IDX_M_Asset" 
        @save="saveChangeCompany"
      />
    </v-dialog>

    <v-dialog v-model="changeManagementDialog" width="750" transition="dialog-bottom-transition" :overlay="false">            
      <ChangeAsset title="Change Management" :items="listsManagement" 
        itemText="AssetManagementName" itemValue="IDX_M_AssetManagement" 
        :assetID="AssetID" :idx="IDX_M_Asset" 
        @save="saveChangeManagement"
      />
    </v-dialog>

    <!-- RETURN -->
    <v-dialog v-model="returnDialog" width="750" transition="dialog-bottom-transition" :overlay="false">            
      <v-toolbar flat dense>
        <v-toolbar-title>Return Asset</v-toolbar-title>
      </v-toolbar>
      <v-card>
        <v-card-text>
          <v-textarea label="Remarks" outline v-model="remarks"></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn dark @click="saveReturn()">RETURN NOW</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- EDIT ASSET -->
    <v-dialog v-model="editDialog" scrollable fullscreen persistent :overlay="false" transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar flat dense>
          <v-toolbar-title>
            <v-progress-circular :indeterminate="$store.state.loading" background-color="blue" color="lime" width="3"></v-progress-circular> 
            <v-tooltip bottom>
              <v-icon slot="activator">{{ AssetTypeIcon }}</v-icon>
              <span>{{ AssetType }}</span>
            </v-tooltip> Edit Asset {{ AssetID }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn @click="editDialog =! editDialog"><v-icon>clear</v-icon></v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <EditAsset ref="editAsset" :id="IDX_M_Asset" @close="closeEditAsset" />
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- PRINT QR DIALOG -->
    <v-dialog v-model="printQRDialog" scrollable fullscreen persistent :overlay="false" transition="dialog-bottom-transition">
      <v-card color="white">
        <v-toolbar flat dense>
          <v-toolbar-title>
            <v-progress-circular :indeterminate="$store.state.loading" background-color="blue" color="lime" width="3"></v-progress-circular> 
            PRINT QR ({{ selected.length }})
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn @click="printQRDialog =! printQRDialog"><v-icon>clear</v-icon></v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <PrintQR :items="selected" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import ActionMenu from "@/components/Core/ActionMenu"; // required
import Print from "@/components/Core/Print"; // required
import FilterData from "@/components/Core/Filter"; // required
import AssignAsset from "@/components/Asset/AssignAsset"; // required
import ChangeAsset from "@/components/Asset/ChangeAsset"; // required
import Search from "@/components/Core/Search"; // required
import AssetFilter from "@/components/Asset/AssetFilter"; // required
import EditAsset from "@/components/Asset/ManageEditAsset"; // required
import DetailAsset from "@/components/Asset/ManageDetailAsset"; // required
import PrintQR from "@/components/Asset/PrintQR"; // required


export default {
  name:'lists-asset',
  components:{
    ActionMenu,
    Print,FilterData,
    AssignAsset,
    ChangeAsset,
    Search,
    AssetFilter,
    EditAsset,
    DetailAsset,
    PrintQR
  },
  created(){
    this.loadManagement();
  },
  watch:{
    pagination: {
      handler () {
        this.loadList();
      },
      deep: true
    },
  },
  data(){
    return {
      lists:[],
      listsUser:[],
      listsLocation:[],
      listsStatus:[],
      listsCompany:[],
      listsManagement:[],
      listsAssign:[],
      listsDeparment:[],
      listsBrand:[],
      listsType:[],
      listsAssetType:[],
      selected:[],
      remarks:null,
      
      IDX_M_AssetManagement:null,
      IDX_M_Asset:null,
      AssetID:null,
      AssetTypeIcon:null,
      AssetType:null,
      currentPage:1,
      maxPage:100,
      pageSize:50,
      totalRecords:0,
      pagination:{},

      //filter
      selectedKeyword:null,
      selectedAssign:null,
      selectedStatus:[],
      selectedUser:[],
      selectedLocation:[],
      selectedDepartment:null,
      selectedBrand:null,
      selectedType:null,
      selectedCompany:[],
      selectedTimePeriod:0,
      selectedAssetType:[],

      //security
      isNew:false,
      isReturn:false,

      //dialog
      print:false,
      returnDialog:false,
      assignUserDialog:false,
      assignStatusDialog:false,
      assignLocationDialog:false,
      changeCompanyDialog:false,
      changeManagementDialog:false,
      editDialog:false,
      printQRDialog:false,

      //datatable
      headers:[
        { text:null,class:'text-xs-center',sort:false, value:null },
        { text:'Action',class:'text-xs-center',sort:false, value:null },
        { text:'Type',value:'AssetTypeIcon',class:'text-xs-center',sort:true },
        { text:'Asset ID',value:'AssetID',class:'text-xs-center',sort:true },
        { text:'User',value:'CurrentAssetUser',class:'text-xs-center',sort:true },
        { text:'Model',value:'AssetTypeModelName',class:'text-xs-center',sort:true },
        { text:'Status',value:'CurrentAssetStatus',class:'text-xs-center',sort:true },
        { text:'Location',value:'CurrentAssetLocation',class:'text-xs-center',sort:true },
      ],
      filterItems:[
        { text: 'All Data', value: 0, select: true },
        { text: 'Last Created', value: 1, select: false },
        { text: 'Last Modified', value: 2, select: false }
      ],
    }
  },
  methods:{
    showAlert(message, code) {
      let data = {
        color:code,
        message: message,
        alert:true
      };
      this.$store.commit('snackbar',data);
    },
    loadManagement() {
      var id = { NIK: this.$session.get('NIK') };

      this.axios
        .post("ManageAsset/loadAssetAdminAccess_ByNIK", id)
        .then(res => {
          this.IDX_M_AssetManagement = res['Table'][0].IDX_M_AssetManagement;
          setTimeout(() => {
            this.loadAdditional();
            this.loadList();
          }, 500);
        })
        .catch(error => {
          this.showAlert("ERROR  : " + error.statusText, "error");
        });
    },
    loadList() {
      var id = {
        Session_ID: this.$session.get('SESSION_ID'),
        Keyword: this.selectedKeyword,
        IDX_M_AssetManagement: this.IDX_M_AssetManagement,
        ReturnAsset:this.selectedAssign,
        IDX_M_AssetStatus:this.selectedStatus.toString(),
        IDX_M_AssetUser:this.selectedUser.toString(),
        IDX_M_AssetLocation:this.selectedLocation.toString(),
        DepartmentName:this.selectedDepartment,
        IDX_M_AssetBrand:this.selectedBrand,
        IDX_M_AssetType:this.selectedType,
        IDX_M_Company:this.selectedCompany.toString(),
        AssetType:this.selectedAssetType.toString(),
        TimePeriod: this.selectedTimePeriod,
        // CurrentPage: this.currentPage,
        // MaxPage: this.maxPage,
        // PageSize: this.PageSize
      };

      this.axios
        .post("ManageAsset/loadAsset", id)
        .then(res => {
          this.lists = res['Table'];
          let table1 = res['Table1'][0];
          this.currentPage = table1.CurrentPage;
          this.maxPage = table1.MaxPage;
          this.totalRecords = table1.TotalRecords;

          // //security
          this.isNew = table1.isNew;
          this.isReturn = table1.isReturn;
        })
        .catch(error => {
          this.showAlert("ERROR  : " + error.statusText, "error");
        });
    },
    loadAdditional() {
      var id = {
        Session_ID: this.$session.get('SESSION_ID')
      };

      this.axios
        .post("ManageAsset/loadAdditionalList", id)
        .then(res => {
          this.listsType = res['Table'];
          this.listsLocation = res['Table2'];
          this.listsStatus = res['Table3'];
          this.listsUser = res['Table4'];
          this.listsBrand = res['Table6'];
          this.listsManagement = res['Table7'];
          this.listsDeparment = res['Table8'];
          this.listsCompany = res['Table10'];
          this.listsAssign = res['Table11'];
          this.listsAssetType = res['Table15'];
        })
        .catch(error => {
          this.showAlert("ERROR  : " + error.statusText, "error");
        });
    },
    actionFilter(p){
      this.selectedTimePeriod = p.value;
      setTimeout(() => {
        this.loadList();
      }, 500);
    },
    actionSearch(p){
      this.selectedKeyword = p.Keyword;
      setTimeout(() => {
        this.loadList();
      }, 500);
    },
    actionAssetFilter(p){
      this.selectedAssign=p.selectedAssign
      this.selectedStatus=p.selectedStatus.toString()
      this.selectedUser=p.selectedUser.toString()
      this.selectedLocation=p.selectedLocation.toString()
      this.selectedDepartment=p.selectedDepartment
      this.selectedBrand=p.selectedBrand
      this.selectedType=p.selectedType
      this.selectedCompany=p.selectedCompany.toString()
      this.selectedAssetType=p.selectedAssetType.toString()

      setTimeout(() => {
        this.loadList();
      }, 500);
    },
    actionMenu(p){
      let id = p.id;
      let code = p.code;
      let item = this.lists.filter(k => { return k.IDX_M_Asset == id });
      this.IDX_M_Asset = id;
      this.AssetID = item[0].AssetID;

      switch (code) {
        case 'isEnable':
          this.toggleStatus(id);
        break;
        case 'isAssignUser':
          this.assignUserDialog = this.assignUserDialog =! this.assignUserDialog;
        break;
        case 'isAssignLocation':
          this.assignLocationDialog = this.assignLocationDialog =! this.assignLocationDialog;
        break;
        case 'isAssignStatus':
          this.assignStatusDialog = this.assignStatusDialog =! this.assignStatusDialog;
        break;
        case 'isChangeCompany':
          this.changeCompanyDialog = this.changeCompanyDialog =! this.changeCompanyDialog;
        break;
        case 'isChangeManagement':
          this.changeManagementDialog = this.changeManagementDialog =! this.changeManagementDialog;
        break;
      }
    },
    toggleStatus(v){
      let item = this.lists.filter(k => { return k.IDX_M_Asset == v });
      return item[0].isEnable ? this.enable(v) : this.disable(v);
    },
    disable(v){
      let id = JSON.stringify({
        IDX_M_Asset:v,
        Session_ID: this.$session.get('SESSION_ID')
      });
			this.client("ManageAsset/disableAsset",id,() => this.loadList());
		},
		enable(v){
      let id = JSON.stringify({
        IDX_M_Asset:v,
        Session_ID: this.$session.get('SESSION_ID')
      });
			this.client("ManageAsset/enableAsset",id,() => this.loadList());
    },
    saveAssignUser(p){
      let id = {
        Session_ID: this.$session.get('SESSION_ID'),
        IDX_M_Asset: p.idx,
        IDX_M_AssetUser: p.selected,
        Date: p.date,
        Remarks: p.remarks
      }
      this.client("ManageAsset/assignAssetUser",id,() => {
        this.assignUserDialog = false;
        this.loadList();
      });
    },
    saveAssignLocation(p){
      let id = {
        Session_ID: this.$session.get('SESSION_ID'),
        IDX_M_Asset: p.idx,
        IDX_M_AssetLocation: p.selected,
        Date: p.date,
        Remarks: p.remarks
      }
      this.client("ManageAsset/assignAssetLocation",id,() => {
        this.assignLocationDialog = false;
        this.loadList();
      });
    },
    saveAssignStatus(p){
      let id = {
        Session_ID: this.$session.get('SESSION_ID'),
        IDX_M_Asset: p.idx,
        IDX_M_AssetStatus: p.selected,
        Remarks: p.remarks
      }
      this.client("ManageAsset/assignAssetStatus",id,() => {
        this.assignStatusDialog = false;
        this.loadList();
      });
    },
    saveChangeCompany(p){
      let id = {
        Session_ID: this.$session.get('SESSION_ID'),
        IDX_M_Asset: p.idx,
        IDX_M_Company: p.selected,
        Remarks: p.remarks
      }
      this.client("ManageAsset/changeAssetCompany",id,() => {
        this.changeCompanyDialog = false;
        this.loadList();
      });
    },
    saveChangeManagement(p){
      let id = {
        Session_ID: this.$session.get('SESSION_ID'),
        IDX_M_Asset: p.idx,
        IDX_M_AssetManagement: p.selected,
        Remarks: p.remarks
      }
      this.client("ManageAsset/changeAssetManagement",id,() => {
        this.changeManagementDialog = false;
        this.loadList();
      });
    },
    saveReturn(){
      let selected = [];
      this.selected.filter(k => {
        if(k.isReturn == 0){ selected.push(k.IDX_M_Asset)}
      })
      let id = JSON.stringify({
        Session_ID: this.$session.get('SESSION_ID'),
        IDX_M_Asset: selected.toString(),
        Remarks: this.remarks
      });
      console.log(this.selected);
      this.client("ManageAsset/returnAssetUserMultiple",id,() => this.loadList());
    },
    newAsset(){
      this.$emit('new',true);
    },
    openEditAsset(array){
      this.IDX_M_Asset = array.IDX_M_Asset;
      this.AssetID = array.AssetID;
      this.AssetTypeIcon = array.AssetTypeIcon;
      this.AssetType = array.AssetType;
      this.editDialog = true;
      this.$refs.editAsset.loadAdditional();
      this.$refs.editAsset.loadList(array.IDX_M_Asset);
      this.$refs.editAsset.tabs = 0;
    },
    closeEditAsset(p){
      this.editDialog = p;
      this.loadList();
    },
    
    // DEFAULT
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
    }
  }
}
</script>

<style>

</style>
