<template>
  <v-layout column>
    <v-flex xs12>
      <v-layout row wrap>
        <v-flex sm6>
          <v-autocomplete chips deletable-chips v-model="selectedCompany" :items="listsCompany" label="Pilih Company" item-text="CompanyName" item-value="IDX_M_Company" outline />
          <v-autocomplete chips deletable-chips v-model="selectedType" :items="listsType" label="Pilih Type" item-text="InventoryTypeName" item-value="IDX_M_InventoryType" outline />
          <v-autocomplete chips deletable-chips :disabled="selectedType == null ? true : false" v-model="selectedModel" :items="filteredModel" label="Pilih Model" item-text="InventoryTypeModelName" item-value="IDX_M_InventoryTypeModel" outline />
          <v-autocomplete chips deletable-chips v-model="selectedSize" :items="listsSize" label="Pilih Size" item-text="InventorySizeName" item-value="IDX_M_InventorySize" outline />
          <v-chip>
            <v-icon left small :color="selectedImageName == null ? 'red' : 'green'">{{ selectedImageName == null ? 'clear' : 'done' }}</v-icon>
            {{ selectedImageName == null ? 'Not attached image' : 'Attached image success : '+ selectedImageName }}
            <v-btn icon @click="deleteAttachedImage()" v-if="selectedImageName !== null"><v-icon small color="red">remove_circle_outline</v-icon></v-btn>
          </v-chip>
          <ImagePicker @save="saveTempImage" ref="imagePicker" />
        </v-flex>
        <v-flex sm6 pl-2>
          <v-autocomplete chips deletable-chips v-model="selectedBrand" :items="listsBrand" label="Pilih Brand" item-text="InventoryBrandName" item-value="IDX_M_InventoryBrand" outline />
          <v-autocomplete chips deletable-chips v-model="selectedColor" :items="listsColor" label="Pilih Color" item-text="InventoryColorName" item-value="IDX_M_InventoryColor" outline />
          <v-autocomplete chips deletable-chips v-model="selectedUnitBesar" :items="listsUoM" label="Pilih Satuan Terbesar" item-text="InventoryUOMName" item-value="IDX_M_InventoryUOM" outline />
          <v-autocomplete chips deletable-chips v-model="selectedUnitKecil" :items="listsUoM" label="Pilih Satuan Terkecil" item-text="InventoryUOMName" item-value="IDX_M_InventoryUOM" outline />
          <v-text-field v-model="selectedFaktorPengali" label="Faktor Pengali Satuan (default 1)" type="number" outline />
          <v-textarea v-model="selectedRemarks" label="Note" outline />
        </v-flex>
      </v-layout>
    </v-flex>
    <v-divider></v-divider>
    <v-flex xs12>
      <center>
        <v-btn dark @click="save()"><v-icon color="cyan" left>save</v-icon>SIMPAN</v-btn>
      </center>
    </v-flex>
  </v-layout>
</template>

<script>
import PageToolbar from "@/components/Toolbar/PageToolbar"; // required
import ImagePicker from "@/components/Core/ImagePicker"; // required
import { isNull } from 'util';

export default {
  name:'new-stock',
  components:{
    PageToolbar,ImagePicker
  },
  created(){
    this.loadAdditional();
  },
  watch:{
    selectedType(){
      this.filteredModel = this.listsModel.filter((k) => k.IDX_M_InventoryType == this.selectedType);
      return this.filteredModel;
    }
  },
  data(){
    return {
      listsType:[],
      listsModel:[],
      listsColor:[],
      listsSize:[],
      listsBrand:[],
      listsCompany:[],
      listsUoM:[],
      filteredModel:[],

      selectedType:null,
      selectedModel:null,
      selectedColor:null,
      selectedSize:null,
      selectedBrand:null,
      selectedCompany:null,
      selectedUnitBesar:null,
      selectedUnitKecil:null,
      selectedFaktorPengali:null,
      selectedImageFile:null,
      selectedImageName:null,
      selectedRemarks:null,

      getShowUrl:null,
      getUploadPath:null,
    }
  },
  methods:{
    loadAdditional(){
      var id = { NIK: this.$session.get('SESSION_ID')};
      this.axios
        .post("Stock/loadAdditionalStock", id)
        .then(response => { 
          this.listsBrand = JSON.parse(response.data)['Table']
          this.listsColor = JSON.parse(response.data)['Table1']
          this.listsSize = JSON.parse(response.data)['Table2']
          this.listsModel = JSON.parse(response.data)['Table3']
          this.listsType = JSON.parse(response.data)['Table4']
          this.listsCompany = JSON.parse(response.data)['Table5']
          this.getUploadPath = JSON.parse(response.data)['Table6'][0].value;
          this.getShowUrl = JSON.parse(response.data)['Table6'][1].value;
          this.listsUoM = JSON.parse(response.data)['Table7']
        }).catch(error => this.showAlert("ERROR  : " + error.statusText, "error"));
    },
    deleteAttachedImage(){
      this.selectedImageFile = null;
      this.selectedImageName = null;
    },
    saveTempImage(data){
      this.selectedImageFile = data[0].file;
      this.selectedImageName = data[0].savename;
    },
    saveImage(){
      let xhr = new XMLHttpRequest();
      xhr.open('POST','http://10.10.0.28/WebServiceATKGA/api/Upload/uploadFile');
      xhr.setRequestHeader('filename',this.selectedImageName);
      xhr.setRequestHeader('path',this.getUploadPath);
      xhr.send(this.selectedImageFile);
    },
    save(){
      if(this.selectedImageName !== null){ this.saveImage(); }
      if(
        isNull(this.selectedCompany) || isNull(this.selectedModel) ||
        isNull(this.selectedUnitBesar) || isNull(this.selectedUnitKecil) || isNull(this.selectedFaktorPengali)
      )
      {
        this.$store.commit('alert',{color:'red',message:'Company, model, unit terbesar, unit terkecil dan faktor pengali is required.',alert:true});
        return false;
      }
      let id = {
        Session_ID: this.$session.get('SESSION_ID'),
        IDX_M_Company:this.selectedCompany,
        IDX_M_InventoryBrand: this.selectedBrand,
        IDX_M_InventoryColor: this.selectedColor,
        IDX_M_InventorySize: this.selectedSize,
        IDX_M_InventoryType: this.selectedType,
        IDX_M_InventoryTypeModel: this.selectedModel,
        ImageUrl:this.selectedImageName,
        FirstUnit:this.selectedUnitBesar,
        SecondUnit:this.selectedUnitKecil,
        Conversion:this.selectedFaktorPengali,
        Remarks:this.selectedRemarks
      }

      this.client("Stock/saveStock",id,(res) => {
        if(JSON.parse(res.data)['Table'][0].StatusCSS == 'success'){
          this.$emit('close',false);
          this.selectedType = null;
          this.selectedModel = null;
          this.selectedColor = null;
          this.selectedSize = null;
          this.selectedBrand = null;
          this.selectedCompany = null;
          this.selectedUnitBesar = null;
          this.selectedUnitKecil = null;
          this.selectedFaktorPengali = null;
          this.selectedImageFile = null;
          this.selectedImageName = null;
          this.selectedRemarks = null;
        }
      });
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
