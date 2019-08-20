<template>
  <v-container fluid>
    <PageToolbar
      :header="'ASRI-STASY'"
      :subheader="'STOCK-DETAIL'"
      :isLoading="$store.state.loading"
      :backButton="true"
    />
    
    <v-toolbar dark>
      <v-toolbar-items>
        <v-btn @click="newStockDialog =! newStockDialog" v-if="isNew"><v-icon left color="lime">add</v-icon>STOCK BARU</v-btn>
      </v-toolbar-items>
      <Search @search="actionSearch" />
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn @click="loadList()"><v-icon>refresh</v-icon></v-btn>
        <v-btn @click="filterDialog =! filterDialog"><v-icon :color="filterDialog ? 'red' : 'cyan'">{{ filterDialog ? 'clear' : 'search' }}</v-icon></v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-card dark>
      <v-card-text>
        <v-data-table :headers="headers" :items="lists" :expand="true">
          <template v-slot:items="props">
            <tr :style="props.item.isEnable ? 'color:yellow' : ''">
              <td class="text-xs-center">
                <ActionMenu 
                  :id="props.item.IDX_M_InventoryStock"
                  :isUpdate="props.item.isUpdate"
                  :isEnable="props.item.isEnable"
                  :skip="true"
                  :isDelete="props.item.isDelete"
                  @action="actionMenu"
                />
              </td>
              <td class="text-xs-center">{{ props.item.CompanyName }}</td>
              <td class="text-xs-center">{{ props.item.InventoryStockCode }}</td>
              <td class="text-xs-center">{{ props.item.Qty }}</td>
              <td class="text-xs-center">{{ props.item.InventoryTypeName }}</td>
              <td class="text-xs-center">{{ props.item.InventoryTypeModelName }}</td>
              <td class="text-xs-center">{{ props.item.InventoryBrandName }}</td>
              <td class="text-xs-center">{{ props.item.InventoryColorName }}</td>
              <td class="text-xs-center">{{ props.item.InventorySizeName }}</td>
              <td class="text-xs-center">{{ props.item.FirstUnitName }}</td>
              <td class="text-xs-center">{{ props.item.SecondUnitName }}</td>
              <td class="text-xs-center">{{ props.item.ConversionUnit }}</td>
              <td class="text-xs-center">{{ props.item.Remarks }}</td>
              <td class="text-xs-center">
                <v-avatar v-if="props.item.ImageUrl" size="64">
                  <img :src="props.item.ImageUrl">
                </v-avatar>
              </td>
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
        <v-autocomplete outline v-model="selectedAdvanceBrand" :items="listsBrand" label="Brand" item-text="InventoryBrandName" item-value="IDX_M_InventoryBrand" multiple chips deletable-chips></v-autocomplete>
        <v-autocomplete outline v-model="selectedAdvanceColor" :items="listsColor" label="Color" item-text="InventoryColorName" item-value="IDX_M_InventoryColor" multiple chips deletable-chips></v-autocomplete>
        <v-autocomplete outline v-model="selectedAdvanceSize" :items="listsSize" label="Size" item-text="InventorySizeName" item-value="IDX_M_InventorySize" multiple chips deletable-chips></v-autocomplete>
        <v-autocomplete outline v-model="selectedAdvanceModel" :items="listsModel" label="Model" item-text="InventoryTypeModelName" item-value="IDX_M_InventoryTypeModel" multiple chips deletable-chips></v-autocomplete>
        <v-autocomplete outline v-model="selectedAdvanceCompany" :items="listsCompany" label="Company" item-text="CompanyName" item-value="IDX_M_Company" multiple chips deletable-chips></v-autocomplete>
      </v-container>
      <v-layout row wrap>
        <v-container grid-list-xs>
          <center>
            <v-btn dark small @click="loadList()" fab><v-icon>search</v-icon></v-btn>  
          </center>
        </v-container>
      </v-layout>
    </v-navigation-drawer> 

    <!-- NEW STOCK DETAIL -->
    <v-dialog lazy
      v-model="newStockDialog"
      scrollable
      persistent :overlay="false"
      max-width="1200px"
      transition="bottom-dialog-transition"
    >
      <v-card>
        <v-toolbar dark dense flat color="cyan darken-3">
          <v-toolbar-title>
            <v-progress-circular v-if="$store.state.loading" :indeterminate="$store.state.loading" background-color="blue" color="lime" width="3"></v-progress-circular> 
            BUAT STOCK
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn flat small @click="newStockDialog =! newStockDialog"><v-icon>clear</v-icon></v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <NewStock @close="closeNewStock" />
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- EDIT STOCK DETAIL -->
    <v-dialog lazy
      v-model="editStockDialog"
      scrollable
      persistent :overlay="false"
      max-width="1200px"
      transition="bottom-dialog-transition"
    >
      <v-card>
        <v-toolbar dark dense flat color="red darken-3">
          <v-toolbar-title>
            <v-progress-circular v-if="$store.state.loading" :indeterminate="$store.state.loading" background-color="blue" color="lime" width="3"></v-progress-circular> 
            EDIT STOCK <v-chip>{{ editedStockCode }}</v-chip>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn flat small @click="editStockDialog =! editStockDialog"><v-icon>clear</v-icon></v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <v-layout row>
            <v-flex xs12 sm12 md6 lg6 xl6 >
              <v-autocomplete outline v-model="editedIDX_M_InventoryBrand" :items="listsBrand" label="Brand" item-text="InventoryBrandName" item-value="IDX_M_InventoryBrand" chips deletable-chips></v-autocomplete>
              <v-autocomplete outline v-model="editedIDX_M_InventoryColor" :items="listsColor" label="Color" item-text="InventoryColorName" item-value="IDX_M_InventoryColor" chips deletable-chips></v-autocomplete>
              <v-autocomplete outline v-model="editedIDX_M_InventorySize" :items="listsSize" label="Size" item-text="InventorySizeName" item-value="IDX_M_InventorySize" chips deletable-chips></v-autocomplete>
              <v-autocomplete outline v-model="editedIDX_M_InventoryTypeModel" :items="listsModel" label="Model" item-text="InventoryTypeModelName" item-value="IDX_M_InventoryTypeModel" chips deletable-chips></v-autocomplete>
              <v-autocomplete outline v-model="editedIDX_M_Company" :items="listsCompany" label="Company" item-text="CompanyName" item-value="IDX_M_Company" chips deletable-chips></v-autocomplete>
            </v-flex>
            <v-flex xs12 sm12 md6 lg6 xl6 pl-2>
              <v-autocomplete outline v-model="editedFirstUnit" :items="listsUoM" label="Unit (Satuan) Terbesar" item-text="InventoryUOMName" item-value="IDX_M_InventoryUOM" chips deletable-chips></v-autocomplete>
              <v-autocomplete outline v-model="editedSecondUnit" :items="listsUoM" label="Unit (Satuan) Terkecil" item-text="InventoryUOMName" item-value="IDX_M_InventoryUOM" chips deletable-chips></v-autocomplete>
              <v-text-field outline v-model="editedConversionUnit" label="Faktor Pengali" type="number" />
              <v-textarea outline v-model="editedRemarks" label="Remarks" />
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn dark @click="updateStock()"><v-icon color="cyan" left>save</v-icon>SIMPAN PERUBAHAN</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import PageToolbar from "@/components/Toolbar/PageToolbar"; // required
import ActionMenu from "@/components/Core/ActionMenu"; // required
import Search from "@/components/Core/Search"; // required
import NewStock from "@/components/Stock/NewStock"; // required

export default {
  name:'stock-detil',
  components:{
    PageToolbar,ActionMenu,Search,NewStock
  },
  created(){
    this.loadList();
  },
  watch:{
    selectedAdvanceCompany(){ this.loadList();},
    selectedAdvanceBrand(){ this.loadList();},
    selectedAdvanceColor(){ this.loadList();},
    selectedAdvanceSize(){ this.loadList();},
    selectedAdvanceModel(){ this.loadList();},
  },
  data(){
    return {
      headers: [
        { text:'AKSI',align:'center',sortable:false,value:null },
        { text:'COMPANY',align:'center',sortable:true,value:'CompanyName' },
        { text:'KODE BARANG',align:'center',sortable:true,value:'InventoryStockCode' },
        { text:'SALDO',align:'center',sortable:true,value:'Qty' },
        { text:'TYPE',align:'center',sortable:true,value:'InventoryTypeName' },
        { text:'MODEL',align:'center',sortable:true,value:'InventoryTypeModelName' },
        { text:'BRAND',align:'center',sortable:true,value:'InventoryBrandName' },
        { text:'COLOR',align:'center',sortable:true,value:'InventoryColorName' },
        { text:'SIZE',align:'center',sortable:true,value:'InventorySizeName' },
        { text:'UNIT TERBESAR',align:'center',sortable:true,value:'FirstUnit' },
        { text:'UNIT TERKECIL',align:'center',sortable:true,value:'SecondUnit' },
        { text:'FAKTOR',align:'center',sortable:true,value:'ConversionUnit' },
        { text:'REMARKS',align:'center',sortable:true,value:'Remarks' },
        { text:'IMAGE',align:'center',sortable:true,value:'ImageUrl' },
      ],
      lists:[],
      listsBrand:[],
      listsColor:[],
      listsSize:[],
      listsModel:[],
      listsCompany:[],
      listsUoM:[],
      //Stock
      selectedAdvanceCompany:[],
      selectedAdvanceBrand:[],
      selectedAdvanceSize:[],
      selectedAdvanceModel:[],
      selectedAdvanceColor:[],
      selectedAdvanceTimePeriod:0,
      selectedAdvanceDateFrom:'1900-01-01',
      selectedAdvanceDateTo:'3000-01-01',

      //edited
      editedIDX:null,
      editedStockCode:null,
      editedIDX_M_InventoryBrand:null,
      editedIDX_M_InventoryColor:null,
      editedIDX_M_InventorySize:null,
      editedIDX_M_InventoryTypeModel:null,
      editedIDX_M_Company:null,
      editedFirstUnit:null,
      editedSecondUnit:null,
      editedConversionUnit:null,
      editedRemarks:null,
      
      //pagination
      SortBy:1,
      SortSq:0,
      pageSize:100,
      maxPage:0,
      currentPage:1,
      totalRecords:0,
      isNew:true, //hardcode

      newStockDialog:false,
      editStockDialog:false,
      filterDialog:false,
      getShowUrl:null,
    }
  },
  methods:{
    actionSearch(p){
      this.selectedKeyword = p.Keyword;
      setTimeout(() => this.loadList(), 500);
    },
    actionMenu(p){
      let id = p.id;
      let code = p.code;
      let arr = this.lists.filter((k) => k.IDX_M_InventoryStock == id);
      let r = arr[0];
      
      switch (code) {
        case 'isUpdate':
          this.editedIDX = id;
          this.editedStockCode = r.InventoryStockCode;
          this.editedIDX_M_Company = r.IDX_M_Company;
          this.editedIDX_M_InventoryBrand = r.IDX_M_InventoryBrand;
          this.editedIDX_M_InventoryColor = r.IDX_M_InventoryColor;
          this.editedIDX_M_InventorySize = r.IDX_M_InventorySize;
          this.editedIDX_M_InventoryTypeModel  = r.IDX_M_InventoryTypeModel;
          this.editedFirstUnit = r.FirstUnit;
          this.editedSecondUnit = r.SecondUnit;
          this.editedConversionUnit = r.ConversionUnit;
          this.editedRemarks = r.Remarks;
          this.editStockDialog = true;
          break;
        case 'isEnable':
          this.toggle(r.isEnable,id);
          break;
        case 'isDelete':
          this.deleteRow(id);
          break;
        default:
          break;
      }
    },
    updateStock(){
      let id = {
        IDX_M_InventoryStock: this.editedIDX,
        IDX_M_InventoryBrand: this.editedIDX_M_InventoryBrand,
        IDX_M_InventoryColor: this.editedIDX_M_InventoryColor,
        IDX_M_InventorySize: this.editedIDX_M_InventorySize,
        IDX_M_InventoryTypeModel: this.editedIDX_M_InventoryTypeModel,
        IDX_M_Company: this.editedIDX_M_Company,
        FirstUnit: this.editedFirstUnit,
        SecondUnit: this.editedSecondUnit,
        Conversion: this.editedConversionUnit,
        Remarks: this.editedRemarks,
        Session_ID: this.$session.get('SESSION_ID')
      }

      this.client("Stock/updateStock",id,() => {
        this.loadList();
        this.editStockDialog = false;
      });
    },
    toggle(is,i){
      let id = {
        IDX_M_InventoryStock: i,
        Session_ID: this.$session.get('SESSION_ID')
      }

      this.client(is ? "Stock/enableStock" : "Stock/disableStock",id,() => this.loadList());
    },
    deleteRow(i){
      let id = {
        IDX_M_InventoryStock: i,
        Session_ID: this.$session.get('SESSION_ID')
      }

      this.client("Stock/deleteStock",id,() => this.loadList());
    },
    closeNewStock(p){
      this.newStockDialog = p;
      setTimeout(() => this.loadList(), 500);
    },
    loadList(){
      var id = { 
        Keyword:this.selectedKeyword,
        IDX_M_InventoryType:Number(this.$route.params.id),
        IDX_M_InventoryBrand:this.selectedAdvanceBrand.toString(),
        IDX_M_InventoryColor:this.selectedAdvanceColor.toString(),
        IDX_M_InventorySize:this.selectedAdvanceSize.toString(),
        IDX_M_InventoryTypeModel:this.selectedAdvanceModel.toString(),
        TimePeriod:this.selectedAdvanceTimePeriod,
        DateFrom:this.selectedAdvanceDateFrom,
        DateTo:this.selectedAdvanceDateTo,
        //sort and pagination
        SortBy:this.SortBy,
        SortSequence:this.SortSq,
        PageSize:this.pageSize,
        MaxPage:this.maxPage,
        CurrentPage:this.currentPage
      };
      this.axios
        .post("Stock/loadStock_ByIDXType", id)
        .then(response => {
          this.lists = JSON.parse(response.data)['Table'];
          this.totalRecords = JSON.parse(response.data)['Table1'][0].TotalRecords;
          this.maxPage = JSON.parse(response.data)['Table1'][0].MaxPage;
          this.isNew = JSON.parse(response.data)['Table1'][0].isNew;
        })
        .then(() => setTimeout(() => this.loadFilter(), 500))
        .catch(error => this.showAlert("ERROR  : " + error.statusText, "error"));
    },
    loadFilter(){
      this.axios
        .post("Stock/loadAdditionalStock", { Session_ID: this.$session.get('SESSION_ID') })
        .then(response => {
          this.listsBrand = JSON.parse(response.data)['Table']; 
          this.listsColor = JSON.parse(response.data)['Table1']; 
          this.listsSize = JSON.parse(response.data)['Table2']; 
          this.listsModel = JSON.parse(response.data)['Table3'];
          this.listsCompany = JSON.parse(response.data)['Table5']; 
          this.getShowUrl = JSON.parse(response.data)['Table6'][1].value; 
          this.listsUoM = JSON.parse(response.data)['Table7'];

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
