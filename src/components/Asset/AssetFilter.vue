<template>
  <v-navigation-drawer right app v-model="dialog" width="380">
    <v-toolbar flat dense>
      <v-toolbar-title>Advance Search</v-toolbar-title>
    </v-toolbar>
    <v-spacer></v-spacer>
    <v-container grid-list-md>
      <v-autocomplete outline chips deletable-chips clearable :items="assign" v-model="selectedAssign" label="Assign / Unassign" item-text="ReturnName" item-value="IDX_M_Return"></v-autocomplete>  
      <v-autocomplete outline chips deletable-chips clearable multiple :items="assettype" v-model="selectedAssetType" label="H/W or S/W" item-text="text" item-value="value"></v-autocomplete>  
      <v-autocomplete outline chips deletable-chips clearable multiple :items="statuses" item-text="AssetStatusName" item-value="IDX_M_AssetStatus" v-model="selectedStatus" label="Status"></v-autocomplete>  
      <v-autocomplete outline chips deletable-chips clearable multiple :items="users" item-text="AssetUserName" item-value="IDX_M_AssetUser" v-model="selectedUser" label="User"></v-autocomplete>  
      <v-autocomplete outline chips deletable-chips clearable multiple :items="locations" item-text="AssetLocationName" item-value="IDX_M_AssetLocation" v-model="selectedLocation" label="Location"></v-autocomplete>  
      <v-autocomplete outline chips deletable-chips clearable :items="department" item-text="DepartmentName" item-value="DepartmentName" v-model="selectedDepartment" label="Department"></v-autocomplete>  
      <v-autocomplete outline chips deletable-chips clearable :items="brands" item-text="AssetBrandName" item-value="IDX_M_AssetBrand" v-model="selectedBrand" label="Brand"></v-autocomplete>  
      <v-autocomplete outline chips deletable-chips clearable :items="type" item-text="AssetTypeName" item-value="IDX_M_AssetType" v-model="selectedType" label="Type"></v-autocomplete>  
      <v-autocomplete outline chips deletable-chips clearable multiple :items="company" item-text="CompanyName" item-value="IDX_M_Company" v-model="selectedCompany" label="Company"></v-autocomplete>  
    </v-container>
    <v-layout row wrap>
      <v-container grid-list-xs>
        <center>
          <v-btn outline dark @click="toggle()" icon><v-icon>clear</v-icon></v-btn>
          <v-btn outline dark @click="search()" icon><v-icon color="lime">search</v-icon></v-btn>  
        </center>
      </v-container>
    </v-layout>
  </v-navigation-drawer> 
</template>

<script>
export default {
  name:'asset-filter',
  props:{
    assign:null,
    statuses:null,
    users:null,
    locations:null,
    department:null,
    brands:null,
    type:null,
    company:null,
    assettype:null,
  },
  data(){
    return {
      dialog: true,
      selectedAssign:null,
      selectedStatus:[],
      selectedUser:[],
      selectedLocation:[],
      selectedDepartment:null,
      selectedBrand:null,
      selectedType:null,
      selectedCompany:[],
      selectedAssetType:[],
    }
  },
  watch:{
    selectedAssign(){
      this.search()
    },
    selectedStatus(){
      this.search()
    },
    selectedUser(){
      this.search()
    },
    selectedLocation(){
      this.search();
    },
    selectedDepartment(){
      this.search();
    },
    selectedBrand(){
      this.search();
    },
    selectedType(){
      this.search()
    },
    selectedCompany(){
      this.search()
    },
    selectedAssetType(){
      this.search()
    }
  },
  methods:{
    search(){
      let id = {
        selectedAssign:this.selectedAssign,
        selectedStatus:this.selectedStatus.toString(),
        selectedUser:this.selectedUser.toString(),
        selectedLocation:this.selectedLocation.toString(),
        selectedDepartment:this.selectedDepartment,
        selectedBrand:this.selectedBrand,
        selectedType:this.selectedType,
        selectedCompany:this.selectedCompany.toString(),
        selectedAssetType:this.selectedAssetType
      }
      this.$emit('search',id);
    },
    toggle(){
      this.dialog = this.dialog =! this.dialog;
    },
  }
}
</script>

<style>

</style>
