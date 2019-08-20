<template>
  <v-container fluid>
    <v-stepper v-model="tabs">
      <!-- STEPPER -->
      <v-stepper-header>
        <v-stepper-step step="0" :complete="tabs > 0">General Info</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="1" :complete="tabs > 1">Procurement Info</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="2" :complete="tabs > 2">Assign Asset</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="3" :complete="tabs > 3">Detail Info</v-stepper-step>
      </v-stepper-header>
      
      <!-- STEPPER ITEM -->
      <v-stepper-items>
        <v-stepper-content step="0">
          <v-toolbar flat dense>
            <v-toolbar-title>General Information</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn @click="next(0)"><v-icon left color="cyan">keyboard_arrow_right</v-icon>NEXT</v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-card>
            <v-card-text>
              <v-flex xs12>                                                    
                <v-autocomplete clearable label="Asset Type (*)" required v-model="selectedAssetType"
                    outline item-text="text" item-value="value" :items="listsAssetType"    
                ></v-autocomplete>                                              
              </v-flex>
              <v-flex xs12>                                                    
                <v-autocomplete clearable label="Type (*)" required v-model="selectedType"
                    outline item-text="AssetTypeName" item-value="IDX_M_AssetType" :items="listsType"    
                ></v-autocomplete>                                              
              </v-flex>
              <v-flex xs12>                                                    
                <v-autocomplete clearable label="Type Model (*)" required v-model="selectedTypeModel"
                    :disabled="selectedType == null ? true : false"
                    outline item-text="AssetTypeModelName" item-value="AssetTypeModelName" :items="filteredTypeModel">
                  <template v-slot:append>
                    <v-fade-transition leave-absolute>
                      <v-btn icon class="success" @click="typeModelDialog =! typeModelDialog"><v-icon>add</v-icon></v-btn>
                    </v-fade-transition>
                  </template>
                </v-autocomplete>                                              
              </v-flex>
              <v-flex xs12>                                                    
                <v-autocomplete clearable label="Assign Size (*)" required v-model="selectedSize"
                    outline item-text="AssetSizeName" item-value="AssetSizeName" :items="listsSize">
                  <template v-slot:append>
                    <v-fade-transition leave-absolute>
                      <v-btn icon class="success" @click="sizeDialog =! sizeDialog"><v-icon>add</v-icon></v-btn>
                    </v-fade-transition>
                  </template>    
                </v-autocomplete>                                              
              </v-flex>
              <v-flex xs12>                                                    
                <v-autocomplete clearable label="Assign Brand (*)" required v-model="selectedBrand"
                    outline item-text="AssetBrandName" item-value="AssetBrandName" :items="listsBrand">
                  <template v-slot:append>
                    <v-fade-transition leave-absolute>
                      <v-btn icon class="success" @click="brandDialog =! brandDialog"><v-icon>add</v-icon></v-btn>
                    </v-fade-transition>
                  </template>
                </v-autocomplete>                                              
              </v-flex>
              <v-flex xs12>                                                    
                <v-autocomplete clearable label="Assign Color (*)" required v-model="selectedColor"
                    outline item-text="AssetColorName" item-value="IDX_M_AssetColor" :items="listsColor"    
                ></v-autocomplete>                                              
              </v-flex>
              <v-flex xs12>                                                    
                <v-textarea v-model="selectedRemarks" outline label="Remarks" />
              </v-flex>
            </v-card-text>
          </v-card>
        </v-stepper-content>

        <v-stepper-content step="1">
          <v-toolbar flat dense>
            <v-toolbar-title>PO Information</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn @click="tabs--"><v-icon left color="cyan">keyboard_arrow_left</v-icon>BACK</v-btn>
              <v-btn @click="next(1)"><v-icon left color="cyan">keyboard_arrow_right</v-icon>NEXT</v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-card>
            <v-card-text>
              <v-flex xs12>  
                <v-text-field outline v-model="selectedPO" label="Purchase Order Number">
                  <template v-slot:append>
                    <v-fade-transition leave-absolute>
                      <v-btn icon v-if="selectedPO" class="cyan" @click="checkPO()"><v-icon color="black">search</v-icon></v-btn>
                    </v-fade-transition>
                  </template>
                </v-text-field>                                                  
              </v-flex>
              <v-flex xs12>                                                    
                <v-text-field outline v-model="selectedPODate" label="Purchase Order Date" type="date"></v-text-field>                                                  
              </v-flex>
              <v-flex xs12>                                                    
                <v-text-field outline v-model="selectedAssetDate" label="Asset Date" type="date"></v-text-field>                                                  
              </v-flex>
              <v-flex xs12>                    
                <v-autocomplete clearable label="Material" required v-model="selectedMaterial"
                    outline item-text="Name" item-value="IDX_M_Item" :items="listsMaterial"    
                ></v-autocomplete>                                           
              </v-flex>
              <v-flex xs12>                                                
                <v-autocomplete clearable label="Vendor" required v-model="selectedVendor"
                    outline item-text="Name" item-value="IDX_M_Vendor" :items="listsVendor"    
                ></v-autocomplete>                                           
              </v-flex>
              <v-flex xs12>                                                    
                <v-autocomplete clearable label="Currency" required v-model="selectedCurrency"
                    outline item-text="text" item-value="value" :items="listsCurrency"    
                ></v-autocomplete>                                           
              </v-flex>
              <v-flex xs12>                                                    
                <v-text-field outline v-model="selectedUnitPrice" label="Unit Price" type="number"></v-text-field>                                                 
              </v-flex>
            </v-card-text>
          </v-card>
        </v-stepper-content>

        <v-stepper-content step="2">
          <v-toolbar flat dense>
            <v-toolbar-title>Assign Information</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn @click="tabs--"><v-icon left color="cyan">keyboard_arrow_left</v-icon>BACK</v-btn>
              <v-btn @click="next(2)"><v-icon left color="cyan">keyboard_arrow_right</v-icon>NEXT</v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-card>
            <v-card-text>
              <v-flex xs12>                                                    
                <v-autocomplete clearable label="Assign User (*)" required v-model="selectedUser"
                    outline item-text="AssetUserName" item-value="IDX_M_AssetUser" :items="listsUser"    
                ></v-autocomplete>                                              
              </v-flex>
              <v-flex xs12>                                                    
                <v-autocomplete clearable label="Assign Management (*)" required v-model="selectedManagement"
                    outline item-text="AssetManagementName" item-value="IDX_M_AssetManagement" :items="listsManagement"    
                ></v-autocomplete>                                              
              </v-flex>
              <v-flex xs12>                                                    
                <v-autocomplete clearable label="Assign Company (*)" required v-model="selectedCompany"
                    outline item-text="CompanyName" item-value="IDX_M_Company" :items="listsCompany"    
                ></v-autocomplete>                                              
              </v-flex>
              <v-flex xs12>                                                    
                <v-autocomplete clearable label="Assign Location (*)" required v-model="selectedLocation"
                    outline item-text="AssetLocationName" item-value="IDX_M_AssetLocation" :items="listsLocation"    
                ></v-autocomplete>                                              
              </v-flex>
              <v-flex xs12>                                                    
                <v-autocomplete clearable label="Assign Status (*)" required v-model="selectedStatus"
                    outline item-text="AssetStatusName" item-value="IDX_M_AssetStatus" :items="listsStatus"    
                ></v-autocomplete>                                              
              </v-flex>
            </v-card-text>
          </v-card>
        </v-stepper-content>

        <v-stepper-content step="3">
          <v-toolbar flat dense>
            <v-toolbar-title>Detail Info</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn @click="tabs--"><v-icon left color="cyan">keyboard_arrow_left</v-icon>BACK</v-btn>
              <v-btn @click="save()"><v-icon left color="green lighten-2">save</v-icon>SAVE</v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-card>
            <v-card-text>
              <v-flex xs12>                                                    
                <v-text-field box label="Receive Date" type="date" v-model="selectedReceiveDate"></v-text-field>                                              
              </v-flex>
              <v-flex xs12>                                                    
                <v-text-field box label="Delivery Date" type="date" v-model="selectedDeliveryDate"></v-text-field>                                              
              </v-flex>
              <v-flex xs12>                                                    
                <v-textarea box label="Spesification" type="date" v-model="selectedSpesification"></v-textarea>                                              
              </v-flex>
              <v-flex xs12>                                                    
                <v-textarea box label="Serial Number" type="date" v-model="selectedSerialNumber"></v-textarea>                                              
              </v-flex>
            </v-card-text>
          </v-card>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>

    <!-- NEW MASTER -->
    <v-dialog v-model="typeModelDialog" scrollable persistent :overlay="false" width="500" transition="dialog-transition">
      <v-card>
        <v-toolbar flat dense>
          <v-toolbar-title>Add New Type Model</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn small @click="typeModelDialog =! typeModelDialog" icon><v-icon>clear</v-icon></v-btn>
        </v-toolbar>
        <v-card-text>
          <v-autocomplete clearable label="Type" required v-model="selectedNewType"
              outline item-text="AssetTypeName" item-value="IDX_M_AssetType" :items="listsType"    
          ></v-autocomplete>
          <v-text-field outline v-model="selectedNewTypeModel" label="New Type Model"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small @click="saveNewTypeModel()"><v-icon left small>save</v-icon> SAVE</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="sizeDialog" scrollable persistent :overlay="false" width="500" transition="dialog-transition">
      <v-card>
        <v-toolbar flat dense>
          <v-toolbar-title>Add New Size</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn small @click="sizeDialog =! sizeDialog" icon><v-icon>clear</v-icon></v-btn>
        </v-toolbar>
        <v-card-text>
          <v-text-field outline v-model="selectedNewSize" label="New Size"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small @click="saveNewSize()"><v-icon left small>save</v-icon> SAVE</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="brandDialog" scrollable persistent :overlay="false" width="500" transition="dialog-transition">
      <v-card>
        <v-toolbar flat dense>
          <v-toolbar-title>Add New Brand</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn small @click="brandDialog =! brandDialog" icon><v-icon>clear</v-icon></v-btn>
        </v-toolbar>
        <v-card-text>
          <v-text-field outline v-model="selectedNewBrand" label="New Brand"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small @click="saveNewBrand()"><v-icon left small>save</v-icon> SAVE</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="poDialog" persistent :overlay="false" width="900" transition="dialog-transition">
      <v-card>
        <v-toolbar flat dense>
          <v-toolbar-title>Purchase Order Detail</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn small @click="poDialog =! poDialog" icon><v-icon>clear</v-icon></v-btn>
        </v-toolbar>
        <v-card-text>
          <v-data-table :headers="headers" :items="listsCheckedPO">
            <template slot="items" slot-scope="props">
              <td class="text-xs-center">{{ props.item.MaterialCode }}</td>
              <td class="text-xs-center">{{ props.item.Category }}</td>
              <td class="text-xs-center">{{ props.item.SubCategory }}</td>
              <td class="text-xs-center">{{ props.item.MaterialType }}</td>
              <td class="text-xs-center">{{ numberWithCommas(props.item.UnitPrice) }}</td>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name:'manage-newasset',
  components:{

  },
  props:{

  },
  created(){
    this.loadAdditional();
  },
  data(){
    return {
      //dialog
      typeModelDialog:false,
      sizeDialog:false,
      brandDialog:false,
      poDialog:false,

      //tab
      tabs:0,
      //object
      selectedManagement:null,
      selectedCompany:null,
      selectedUser:null,
      selectedLocation:null,
      selectedStatus:null,
      selectedMaterial:null,
      selectedPO:null,
      selectedPODate:this.$moment(new Date()).format("YYYY-MM-DD"),
      selectedRemarks:null,
      selectedType:null,
      selectedTypeModel:null,
      selectedBrand:null,
      selectedColor:null,
      selectedSize:null,
      selectedVendor:null,
      selectedCurrency:null,
      selectedAssetDate:this.$moment(new Date()).format("YYYY-MM-DD"),
      selectedUnitPrice:null,
      selectedAssetType:null,
      selectedSpesification:null,
      selectedSerialNumber:null,
      selectedReceiveDate:null,
      selectedDeliveryDate:null,

      //new master
      selectedNewTypeModel:null,
      selectedNewType:null,
      selectedNewSize:null,
      selectedNewBrand:null,

      //lists
      listsManagement:[],
      listsCompany:[],
      listsUser:[],
      listsLocation:[],
      listsStatus:[],
      listsMaterial:[],
      listsType:[],
      listsTypeModel:[],
      listsBrand:[],
      listsColor:[],
      listsSize:[],
      listsVendor:[],
      listsCurrency:[],
      listsCheckedPO:[],
      listsAssetType:[],

      headers: [
        { text: 'Material Code', align: 'center', sortable: true, value: 'MaterialCode' },
        { text: 'Category', align: 'center', sortable: true, value: 'Category' },
        { text: 'Sub Category', align: 'center', sortable: true, value: 'SubCategory' },
        { text: 'Material Type', align: 'center', sortable: true, value: 'MaterialType' },
        { text: 'Unit Price', align: 'center', sortable: true, value: 'UnitPrice' },
			],
    }
  },
  computed:{
    filteredTypeModel(){
      return this.listsTypeModel.filter(k => k.IDX_M_AssetType == this.selectedType);
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
    loadAdditional() {
      var id = {
        Session_ID: this.$session.get('SESSION_ID')
      };

      this.axios
        .post("ManageAsset/loadAdditionalList", id)
        .then(res => {
          this.listsType = res['Table'];
          this.listsColor = res['Table1'];
          this.listsLocation = res['Table2'];
          this.listsStatus = res['Table3'];
          this.listsUser = res['Table4'];
          this.listsSize = res['Table5'];
          this.listsBrand = res['Table6'];
          this.listsManagement = res['Table7'];
          this.listsDeparment = res['Table8'];
          this.listsTypeModel = res['Table9'];
          this.listsCompany = res['Table10'];
          this.listsAssign = res['Table11'];
          this.listsMaterial = res['Table12'];
          this.listsVendor = res['Table13'];
          this.listsCurrency = res['Table14'];
          this.listsAssetType = res['Table15'];
        })
        .catch(error => {
          this.showAlert("ERROR  : " + error.statusText, "error");
        });
    },
    save() {
      var id = {
        Session_ID: this.$session.get('SESSION_ID'),
        AssetType: this.selectedAssetType,
        IDX_M_AssetManagement: this.selectedManagement,
        IDX_M_Company: this.selectedCompany,
        IDX_M_AssetType: this.selectedType,
        AssetTypeModelName: this.selectedTypeModel,
        IDX_M_AssetColor: this.selectedColor,
        AssetSizeName: this.selectedSize,
        AssetBrandName: this.selectedBrand,
        IDX_M_Item: this.selectedMaterial,
        IDX_M_Vendor: this.selectedVendor,
        IDX_M_AssetUser: this.selectedUser,
        IDX_M_AssetLocation: this.selectedLocation,
        IDX_M_AssetStatus: this.selectedStatus,
        PONo: this.selectedPO,
        PODate: this.selectedPODate,
        Currency: this.selectedCurrency,
        UnitPrice: this.selectedUnitPrice,
        Remarks: this.selectedRemarks,
        AssetDate: this.selectedAssetDate,
        Spesification: this.selectedSpesification,
        SerialNumber: this.selectedSerialNumber,
        ReceiveDate: this.selectedReceiveDate,
        DeliveryDate: this.selectedDeliveryDate,
      };
      this.client('Asset/saveAsset',id,(res) => this.$emit('close',res['Table'][0].StatusCSS == 'success' ? false : true));
    },
    checkPO(){
      this.poDialog = true;
      var id = { PONo: this.selectedPO };
      this.axios
        .post("Asset/searchASBSPOList", id)
        .then(res => {
          this.listsCheckedPO = res['Table1'];
          this.selectedPODate = this.$moment(this.listsCheckedPO[0].PODate).format('YYYY-MM-DD');
          this.selectedAssetDate = this.selectedPODate;
        })
        .catch(error => {
          this.showAlert("ERROR  : " + error.statusText, "error");
        });
    },
    saveNewTypeModel(){
      let id = {
        Session_ID: this.$session.get('SESSION_ID'),
        IDX_M_AssetType: this.selectedNewType,
        AssetTypeModelName: this.selectedNewTypeModel
      }
      this.client('Master/saveAssetTypeModel',id,() => { 
        this.typeModelDialog = false;
        this.loadAdditional()
      });
    },
    saveNewSize(){
      let id = {
        Session_ID: this.$session.get('SESSION_ID'),
        AssetSizeName: this.selectedNewSize
      }
      this.client('Master/saveAssetSize',id,() => { 
        this.sizeDialog = false;
        this.loadAdditional()
      });
    },
    saveNewBrand(){
      let id = {
        Session_ID: this.$session.get('SESSION_ID'),
        AssetBrandName: this.selectedNewBrand
      }
      this.client('Master/saveAssetBrand',id,() => { 
        this.brandDialog = false;
        this.loadAdditional()
      });
    },
    next(i){
      switch (i) {
        case 0:
          if(
            this.selectedType == null
            || this.selectedTypeModel == null
            || this.selectedSize == null
            || this.selectedBrand == null
            || this.selectedColor == null
            || this.selectedAssetType == null
          ){
            this.showAlert('Please fiil the field with (*)','error');
          } else {
            this.tabs = 1;
          }
        break;
        case 1:
          this.tabs = 2;
        break;
        case 2:
          if(
            this.selectedManagement == null
            || this.selectedCompany == null
            || this.selectedLocation == null
            || this.selectedStatus == null
          ){
            this.showAlert('Please fiil the field with (*)','error');
          } else {
            this.tabs = 3;
          }
        break;
      }
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
    },
    numberWithCommas(number) {
      if (number == undefined || number == null) number = 0;
      var parts = number.toString().split(".");
      return (
          parts[0].replace(/\B(?=(\d{3})+(?=$))/g, ",") +
          (parts[1] ? "." + parts[1] : "")
      );
    }
  }
}
</script>

<style>

</style>
