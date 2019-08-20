<template>
  <v-container fluid>
    <v-tabs color="grey darken-1" dark icons-and-text centered v-model="tabs" grow slider-color="lime" height="40" >
      <v-tab href="#general">Information</v-tab>
      <v-tab href="#history" @click="loadHistory()">History</v-tab>
      <v-tab href="#detail">Detail Info</v-tab>

      <v-tab-item value="general">
        <v-card>
          <v-card-text>
            <v-layout row wrap>
              <!-- 1 -->
              <v-flex xs6>
                <v-flex xs12>
                  <v-text-field box label="Type" v-model="items.AssetTypeName" disabled></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field box label="Type Model" v-model="items.AssetTypeName" disabled></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field box label="Size" v-model="items.AssetSizeName" disabled></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field box label="Brand" v-model="items.AssetBrandName" disabled></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field box label="Color" v-model="items.AssetColorName" disabled></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-textarea box label="Remarks" v-model="items.Remarks" disabled></v-textarea>
                </v-flex>
              </v-flex>

              <!-- 2 -->
              <v-flex xs6>
                <v-flex xs12>
                  <v-text-field box label="Purchase Order Number" v-model="items.PONo" disabled></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field box label="PO Date" :value="items.PODate == null ? '' : $moment(items.PODate).format('DD-MM-YYYY')" disabled></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field box label="Material" v-model="items.MaterialCode" disabled></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field box label="Vendor" v-model="items.AssetVendorName" disabled></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field box label="Currency" v-model="items.Currency" disabled></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field box label="Unit Price" v-model="items.UnitPrice" disabled></v-text-field>
                </v-flex>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item value="history">
        <v-expansion-panel popout v-model="panel" expand>
          <v-expansion-panel-content>
            <template v-slot:header>
              <div>History User</div>
            </template>
            <DataTable :items="listsUser" :headers="headersUser" :body="bodyUser" :clientside="true" />
          </v-expansion-panel-content>
          <v-expansion-panel-content>
            <template v-slot:header>
              <div>History Location</div>
            </template>
            <DataTable :items="listsLocation" :headers="headersLocation" :body="bodyLocation" :clientside="true" />
          </v-expansion-panel-content>
          <v-expansion-panel-content>
            <template v-slot:header>
              <div>History Status</div>
            </template>
            <DataTable :items="listsStatus" :headers="headersStatus" :body="bodyStatus" :clientside="true" />
          </v-expansion-panel-content>
          <v-expansion-panel-content>
            <template v-slot:header>
              <div>History Company</div>
            </template>
            <DataTable :items="listsCompany" :headers="headersCompany" :body="bodyCompany" :clientside="true" />
          </v-expansion-panel-content>
          <v-expansion-panel-content>
            <template v-slot:header>
              <div>History Management</div>
            </template>
            <DataTable :items="listsManagement" :headers="headersManagement" :body="bodyManagement" :clientside="true" />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-tab-item>
      <v-tab-item value="detail">
        <v-card>
          <v-card-text>
            <v-layout row wrap>
              <!-- 1 -->
              <v-flex xs6>
                <v-flex xs12>
                  <v-text-field box label="Last AssetID" v-model="items.LastAssetID" disabled></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-textarea box label="Spesification" v-model="items.Spesification" disabled></v-textarea>
                </v-flex>
                <v-flex xs12>
                  <v-textarea box label="Serial Number" v-model="items.SerialNumber" disabled></v-textarea>
                </v-flex>
              </v-flex>

              <!-- 2 -->
              <v-flex xs6>
                <v-flex xs12>
                  <v-text-field box label="Asset Type" v-model="items.AssetType" disabled></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field box label="Asset Date" :value="items.AssetDate == null ? '' : $moment(items.AssetDate).format('DD-MM-YYYY')" disabled></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field box label="Receive Date" :value="items.ReceiveDate == null ? '' : $moment(items.ReceiveDate).format('DD-MM-YYYY')" disabled></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field box label="Delivery Date" :value="items.DeliveryDate == null ? '' : $moment(items.DeliveryDate).format('DD-MM-YYYY')" disabled></v-text-field>
                </v-flex>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script>
import DataTable from "@/components/Core/DataTable"; // required

export default {
  name:'manage-editasset',
  components:{
    DataTable
  },
  props:{
    id:null,
    items:null,
  },
  created(){
    
  },
  data(){
    return {
      //dialog

      //tab
      tabs:0,
      panel:[false,false,false,false,false],
      //object

      //lists
      listsManagement:[],
      listsCompany:[],
      listsStatus:[],
      listsLocation:[],
      listsUser:[],

      //headers
      headersStatus: [
        { text: 'Date', align: 'center', sortable: true, value: 'AssetStatusDate' },
        { text: 'Status', align: 'center', sortable: true, value: 'AssetStatusName' },
        { text: 'Remarks', align: 'center', sortable: true, value: 'Remarks' },
      ],
      headersLocation: [
        { text: 'Start Date', align: 'center', sortable: true, value: 'StartDate' },
        { text: 'End Date', align: 'center', sortable: true, value: 'EndDate' },
        { text: 'Location', align: 'center', sortable: true, value: 'AssetLocationName' },
        { text: 'Remarks', align: 'center', sortable: true, value: 'Remarks' },
      ],
      headersUser: [
        { text: 'Start Date', align: 'center', sortable: true, value: 'StartDate' },
        { text: 'End Date', align: 'center', sortable: true, value: 'EndDate' },
        { text: 'NIK', align: 'center', sortable: true, value: 'NIK' },
        { text: 'Name', align: 'center', sortable: true, value: 'Name' },
        { text: 'Position', align: 'center', sortable: true, value: 'PositionName' },
        { text: 'Deparment', align: 'center', sortable: true, value: 'DepartmentName' },
        { text: 'Remarks', align: 'center', sortable: true, value: 'Remarks' },
      ],
      headersManagement: [
        { text: 'Date', align: 'center', sortable: true, value: 'AssetManagementDate' },
        { text: 'Management', align: 'center', sortable: true, value: 'AssetManagementName' },
        { text: 'Remarks', align: 'center', sortable: true, value: 'Remarks' },
      ],
      headersCompany: [
        { text: 'Date', align: 'center', sortable: true, value: 'AssetCompanyDate' },
        { text: 'Company', align: 'center', sortable: true, value: 'CompanyName' },
        { text: 'Remarks', align: 'center', sortable: true, value: 'Remarks' },
      ],

      //body
      bodyStatus: [
        { value:'AssetStatusDate',class:'text-xs-center', type:"date", format:"DD-MM-YYYY" },
        { value:'AssetStatusName',class:'text-xs-center' },
        { value:'Remarks',class:'text-xs-center' },
      ],
      bodyLocation: [
        { value:'StartDate',class:'text-xs-center', type:"date", format:"DD-MM-YYYY" },
        { value:'EndDate',class:'text-xs-center', type:"date", format:"DD-MM-YYYY" },
        { value:'AssetLocationName',class:'text-xs-center' },
        { value:'Remarks',class:'text-xs-center' },
      ],
      bodyUser: [
        { value:'StartDate',class:'text-xs-center', type:"date", format:"DD-MM-YYYY" },
        { value:'EndDate',class:'text-xs-center', type:"date", format:"DD-MM-YYYY" },
        { value:'NIK',class:'text-xs-center' },
        { value:'Name',class:'text-xs-center' },
        { value:'PositionName',class:'text-xs-center' },
        { value:'DepartmentName',class:'text-xs-center' },
        { value:'Remarks',class:'text-xs-center' },
      ],
      bodyManagement: [
        { value:'AssetManagementDate',class:'text-xs-center', type:"date", format:"DD-MM-YYYY" },
        { value:'AssetManagementName',class:'text-xs-center' },
        { value:'Remarks',class:'text-xs-center' },
      ],
      bodyCompany: [
        { value:'AssetCompanyDate',class:'text-xs-center', type:"date", format:"DD-MM-YYYY" },
        { value:'CompanyName',class:'text-xs-center' },
        { value:'Remarks',class:'text-xs-center' },
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
    loadHistory(){
      this.historyUsers();
      this.historyLocation();
      this.historyStatus();
      this.historyManagement();
      this.historyCompany();
    },
    historyUsers() {
      var id = { IDX_M_Asset:this.id };
      this.axios
        .post("ManageAsset/loadAdditionalUser_ByIDXAsset", id)
        .then(res => {
          this.listsUser = res['Table'];
        })
        .catch(error => {
          this.showAlert("ERROR  : " + error.statusText, "error");
        });
    },
    historyLocation() {
      var id = { IDX_M_Asset:this.id };
      this.axios
        .post("ManageAsset/loadAdditionalLocation_ByIDXAsset", id)
        .then(res => {
          this.listsLocation = res['Table'];
        })
        .catch(error => {
          this.showAlert("ERROR  : " + error.statusText, "error");
        });
    },
    historyStatus() {
      var id = { IDX_M_Asset:this.id };
      this.axios
        .post("ManageAsset/loadAdditionalStatus_ByIDXAsset", id)
        .then(res => {
          this.listsStatus = res['Table'];
        })
        .catch(error => {
          this.showAlert("ERROR  : " + error.statusText, "error");
        });
    },
    historyCompany() {
      var id = { IDX_M_Asset:this.id };
      this.axios
        .post("ManageAsset/loadAdditionalCompany_ByIDXAsset", id)
        .then(res => {
          this.listsCompany = res['Table'];
        })
        .catch(error => {
          this.showAlert("ERROR  : " + error.statusText, "error");
        });
    },
    historyManagement() {
      var id = { IDX_M_Asset:this.id };
      this.axios
        .post("ManageAsset/loadAdditionalManagement_ByIDXAsset", id)
        .then(res => {
          this.listsManagement = res['Table'];
        })
        .catch(error => {
          this.showAlert("ERROR  : " + error.statusText, "error");
        });
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
