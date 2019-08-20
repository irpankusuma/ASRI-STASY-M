<template>
  <v-layout row wrap>
    <v-flex xs8 sm8 md8 lg8 xl8>
      <v-data-table dark class="elevation-1" light :search="selectedKeyword" select-all :headers="headers" :items="lists" v-model="selected" item-key="IDX_M_InventoryStock">
        <template slot="items" slot-scope="props">
          <tr :style="props.item.isOpname ? 'color:yellow' : null">
            <td class="text-xs-center">
              <v-checkbox v-if="!props.item.isOpname" v-model="props.selected"></v-checkbox>
              <v-icon v-else>lock</v-icon>
            </td>
            <td class="text-xs-center">{{ props.item.InventoryStockCode }}</td>
            <td class="text-xs-center">{{ props.item.InventoryStockName }}</td>
            <td class="text-xs-center"><span class="subtitle">{{ props.item.SaldoAkhir }}</span></td>
            <td class="text-xs-center">
              <v-avatar :tile="false" dark size="64">
                <img :src="props.item.ImageUrl" v-if="props.item.ImageUrl">
                <span v-else style="font-size:8px">No Image</span>
              </v-avatar>
            </td>
            <!-- <td class="text-xs-center"><v-chip class="">{{ props.item.SecondUnit }} Box</v-chip></td>
            <td class="text-xs-center"><v-chip class="">{{ props.item.FirstUnit }} Pcs</v-chip></td> -->
          </tr>
        </template>
      </v-data-table>
    </v-flex>
    <v-flex xs4 sm4 md4 lg4 xl4 pl-2>
      <v-card>
        <v-toolbar flat dense dark>
          <v-toolbar-title>FILTER</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-text-field outline label="Keyword" v-model="selectedKeyword"></v-text-field>
          <v-autocomplete outline :items="listsType" v-model="selectedType" label="Type Barang" solo chips deletable-chips
            item-text="InventoryTypeName" item-value="IDX_M_InventoryType" clearable multiple></v-autocomplete>
          <v-autocomplete outline :items="listsColor" v-model="selectedColor" label="Warna Barang" solo chips deletable-chips
            item-text="InventoryColorName" item-value="IDX_M_InventoryColor" clearable multiple></v-autocomplete>
          <v-autocomplete outline :items="listsSize" v-model="selectedSize" label="Ukuran Barang" solo chips deletable-chips
            item-text="InventorySizeName" item-value="IDX_M_InventorySize" clearable multiple></v-autocomplete>
          <v-autocomplete outline :items="listsBrand" v-model="selectedBrand" label="Merk Barang" solo chips deletable-chips
            item-text="InventoryBrandName" item-value="IDX_M_InventoryBrand" clearable multiple></v-autocomplete>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name:'choose-stock',
  props:{
    idxCompany:null
  },
  created(){
    this.loadList();
  },
  watch:{
    selected(){
      // this.$emit('select',this.selected.filter((k) => k.isOpname != 1));
      this.$emit('select',this.selected);
    },
    selectedType(){
      this.loadList();
    },
    selectedTypeModel(){
      this.loadList();
    },
    selectedColor(){
      this.loadList();
    },
    selectedBrand(){
      this.loadList();
    },
    selectedSize(){
      this.loadList();
    },
    idxCompany(){
      this.loadList();
    }
  },
  data(){
    return {
      selectedItem:null,
      selectedQty:0,
      selectedRemarks:null,

      selectedKeyword:null,
      selectedColor:[],
      selectedType:[],
      selectedTypeModel:[],
      selectedBrand:[],
      selectedSize:[],
      selected:[],
      lists:[],
      listsColor:[],
      listsType:[],
      listsSize:[],
      listsBrand:[],
      headers:[
        // { text:'Pilih',align:'center',sortable:false,value:null },
        { text:'Kode Barang',align:'center',sortable:true,value:'InventoryStockCode' },
        { text:'Nama Barang',align:'center',sortable:true,value:'InventoryStockName' },
        { text:'Saldo',align:'center',sortable:true,value:'SaldoAkhir' },
        { text:'Gambar',align:'center',sortable:false,value:null },
        // { text:'Box',align:'center',sortable:false,value:null },
        // { text:'Pcs',align:'center',sortable:false,value:null },
      ],

      filterDialog:true
    }
  },
  methods:{
    remove(idx){
      this.selected.filter((k) => k.IDX_M_InventoryStock !== idx);
    },
    loadList(){
      let id = {
        Keyword:this.selectedKeyword,
        IDX_M_Company:this.idxCompany,
        IDX_M_InventoryColor:this.selectedColor.toString(),
        IDX_M_InventoryType:this.selectedType.toString(),
        IDX_M_InventoryTypeModel:this.selectedTypeModel.toString(),
        IDX_M_InventorySize:this.selectedSize.toString(),
        IDX_M_InventoryBrand:this.selectedBrand.toString()
      };

      this.axios
        .post("SharedComponent/loadStock", id)
        .then(response => {
          this.lists = JSON.parse(response.data)['Table'];
          this.listsColor = JSON.parse(response.data)['Table1'];
          this.listsType = JSON.parse(response.data)['Table2'];
          this.listsBrand = JSON.parse(response.data)['Table4'];
          this.listsSize = JSON.parse(response.data)['Table5'];
        })
        .catch(error => {
          this.showAlert("ERROR  : " + error.statusText, "error");
        });
    }
  }
}
</script>

<style>

</style>
