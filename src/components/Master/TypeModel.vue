<template>
  <v-container fluid>
    <PageToolbar
      :header="'INVENTORYMAS'"
      :subheader="'MODEL'"
      :isLoading="$store.state.loading"
      :backButton="true"
    />
    
    <v-toolbar dark>
      <v-toolbar-items>
        <v-btn @click="newRequestDialog =! newRequestDialog" v-if="isNew"><v-icon left color="lime">add</v-icon>MODEL BARU</v-btn>
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
            <tr :style="props.item.isEnable ? 'color:yellow' : null">
              <td class="text-xs-center">
                <ActionMenu
                  :id="props.item.IDX_M_InventoryTypeModel"
                  :isUpdate="props.item.isUpdate"
                  :isEnable="props.item.isEnable"
                  :skip="true"
                  :isDelete="props.item.isDelete"
                  @action="actionMenu"
                />
              </td>
              <td class="text-xs-left">{{ props.item.InventoryTypeName }}</td>
              <td class="text-xs-left">{{ props.item.InventoryTypeModelName }}</td>
              <td class="text-xs-left">{{ props.item.Count }}</td>
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
        <v-autocomplete clearable outline v-model="selectedIDX_M_InventoryType" :items="additionals" item-text="InventoryTypeName" item-value="IDX_M_InventoryType" label="Type" />
      </v-container>
      <v-layout row wrap>
        <v-container grid-list-xs>
          <center>
            <v-btn dark small @click="loadList()" fab><v-icon>search</v-icon></v-btn>  
          </center>
        </v-container>
      </v-layout>
    </v-navigation-drawer>

    <!-- EDIT REQUEST -->
    <v-dialog lazy
      v-model="editRequestDialog"
      scrollable 
      persistent :overlay="false"
      max-width="500px"
      transition="bottom-dialog-transition"
    >
      <v-card dark>
        <v-toolbar dense flat dark>
          <v-toolbar-title>
            <v-progress-circular v-if="$store.state.loading" :indeterminate="$store.state.loading" background-color="blue" color="lime" width="3"></v-progress-circular> 
            EDIT MODEL
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn flat small @click="editRequestDialog =! editRequestDialog"><v-icon>clear</v-icon></v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <v-autocomplete solo-inverted v-model="editedIDXType" :items="additionals" item-text="InventoryTypeName" item-value="IDX_M_InventoryType" label="Type" />
          <v-text-field v-model="editedName" label="TypeModel" solo-inverted />
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="justify-center">
          <v-btn @click="toUpdate()"><v-icon left color="cyan">save</v-icon>UPDATE</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- NEW REQUEST -->
    <v-dialog lazy
      v-model="newRequestDialog"
      scrollable 
      persistent :overlay="false"
      max-width="500px"
      transition="bottom-dialog-transition"
    >
      <v-card dark>
        <v-toolbar dense flat dark>
          <v-toolbar-title>
            <v-progress-circular v-if="$store.state.loading" :indeterminate="$store.state.loading" background-color="blue" color="lime" width="3"></v-progress-circular> 
            MODEL BARU
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn flat small @click="newRequestDialog =! newRequestDialog"><v-icon>clear</v-icon></v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <v-autocomplete solo-inverted v-model="inputedIDXType" :items="additionals" item-text="InventoryTypeName" item-value="IDX_M_InventoryType" label="Type" />
          <v-text-field v-model="inputedTypeModelName" label="Model" solo-inverted />
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="justify-center">
          <v-btn @click="toSave()"><v-icon left color="cyan">save</v-icon>SIMPAN</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import PageToolbar from "@/components/Toolbar/PageToolbar"; // required
import ActionMenu from "@/components/Core/ActionMenu"; // required
import Search from "@/components/Core/Search"; // required

export default {
  name:'role-setting',
  components:{
    PageToolbar,ActionMenu,Search
  },
  created(){
    this.loadList();
  },
  watch:{
    selectedIDX_M_InventoryType(){ this.loadList() }
  },
  data(){
    return {
      headers: [
        { text:'ACTION',align:'center',sortable:false,value:null },
        { text:'TYPE',align:'left',sortable:true,value:'InventoryTypeName' },
        { text:'NAME',align:'left',sortable:true,value:'InventoryTypeModelName' },
        { text:'COUNT',align:'left',sortable:true,value:'Count' },
      ],
      lists:[],
      additionals:[],
      selectedKeyword:null,
      selectedIDX_M_InventoryType:[],
      inputedTypeModelName:null,
      inputedIDXType:null,
      editedIDX:null,
      editedIDXType:null,
      editedName:null,

      //pagination
      pageSize:100,
      maxPage:0,
      currentPage:1,
      totalRecords:0,
      isNew:false,

      filterDialog:false,
      newRequestDialog:false,
      editRequestDialog:false,
      viewRequestDetailDialog:false,
    }
  },
  methods:{
    actionSearch(p){
      this.selectedKeyword = p.Keyword;
      setTimeout(() => this.loadList(), 500);
    },
    actionMenu(p){
      let code = p.code;
      let id = p.id;
      let arr = this.lists.filter(k => { return k.IDX_M_InventoryTypeModel == id })
      
      switch (code){
        case 'isUpdate':
          this.editRequestDialog = true;
          this.editedIDX = id;
          this.editedIDXType = arr[0].IDX_M_InventoryType;
          this.editedName = arr[0].InventoryTypeModelName;
        break;
        case 'isEnable':
          let is = arr[0].isEnable;
          this.toEnable(is,id);
        break;
        case 'isDelete':
          this.toDelete(id)
        break;
      }
    },
    toSave(p){
      let id = {
        Session_ID: this.$session.get('SESSION_ID'),
        IDX_M_InventoryType: this.inputedIDXType,
        InventoryTypeModelName: this.inputedTypeModelName
      }

      this.client("Master/saveTypeModel",id,() => {
        this.loadList(); 
        this.newRequestDialog = false;
      });
    },
    toUpdate(p){
      let id = {
        Session_ID: this.$session.get('SESSION_ID'),
        IDX_M_InventoryTypeModel: this.editedIDX,
        IDX_M_InventoryType: this.editedIDXType,
        InventoryTypeModelName: this.editedName
      }

      this.client("Master/updateTypeModel",id,() => {
        this.loadList(); 
        this.editRequestDialog = false;
      });
    },
    toEnable(a,b){
      let id = {
        Session_ID: this.$session.get('SESSION_ID'),
        IDX_M_InventoryTypeModel:b
      }
      this.client(a ? "Master/enableTypeModel" : "Master/disableTypeModel",id,() => this.loadList());
    },
    toDelete(i){
      let id = {
        Session_ID: this.$session.get('SESSION_ID'),
        IDX_M_InventoryTypeModel:i
      }
      this.client("Master/deleteTypeModel",id,() => this.loadList());
    },
    close(p){
      this.newRequestDialog = p;
      this.editRequestDialog = p;
      this.loadList();
    },
    loadList(){
      var id = { 
        Keyword:this.selectedKeyword,
        IDX_M_InventoryType: this.selectedIDX_M_InventoryType,
        PageSize: this.pageSize,
        CurrentPage: this.currentPage,
        Session_ID: this.$session.get('SESSION_ID')
      };
      this.axios
        .post("Master/loadTypeModel", id)
        .then(response => {
          this.lists = JSON.parse(response.data)['Table'];
          this.totalRecords = JSON.parse(response.data)['Table1'][0].TotalRecords;
          this.maxPage = JSON.parse(response.data)['Table1'][0].MaxPage;
          this.isNew = JSON.parse(response.data)['Table1'][0].isNew;
        })
        .then(() => this.loadAdditional())
        .catch(error => this.showAlert("ERROR  : " + error.statusText, "error"));
    },
    loadAdditional(){
      var id = { Session_ID: this.$session.get('SESSION_ID') };
      this.axios
        .post("Master/loadAdditionalTypeModel", id)
        .then(response => this.additionals = JSON.parse(response.data)['Table1'])
        .catch(error => this.showAlert("ERROR  : " + error.statusText, "error"));
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
          let r = JSON.parse(res.data)['Table'][0];
          this.showAlert(r.StatusMessage,r.StatusCSS);
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
