<template>
  <v-container fluid>
    <PageToolbar
      :header="'ASRI-STASY'"
      :subheader="'COLOR'"
      :isLoading="$store.state.loading"
      :backButton="true"
    />
    
    <v-toolbar dark>
      <v-toolbar-items>
        <v-btn @click="newRequestDialog =! newRequestDialog" v-if="isNew"><v-icon left color="lime">add</v-icon>Color BARU</v-btn>
      </v-toolbar-items>
      <Search @search="actionSearch" />
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn @click="loadList()"><v-icon>refresh</v-icon></v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-card dark>
      <v-card-text>
        <v-data-table :headers="headers" :items="lists" :expand="true">
          <template v-slot:items="props">
            <tr :style="props.item.isEnable ? 'color:yellow' : null">
              <td class="text-xs-center">
                <ActionMenu
                  :id="props.item.IDX_M_InventoryColor"
                  :isUpdate="props.item.isUpdate"
                  :isEnable="props.item.isEnable"
                  :skip="true"
                  :isDelete="props.item.isDelete"
                  @action="actionMenu"
                />
              </td>
              <td class="text-xs-left">{{ props.item.InventoryColorName }}</td>
              <td class="text-xs-left">{{ props.item.Count }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

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
            EDIT Color
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn flat small @click="editRequestDialog =! editRequestDialog"><v-icon>clear</v-icon></v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <v-text-field v-model="editedName" label="Color" solo-inverted />
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
            Color BARU
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn flat small @click="newRequestDialog =! newRequestDialog"><v-icon>clear</v-icon></v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <v-text-field v-model="inputedColorName" label="Color" solo-inverted />
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
  data(){
    return {
      headers: [
        { text:'ACTION',align:'center',sortable:false,value:null },
        { text:'NAME',align:'left',sortable:true,value:'InventoryColorName' },
        { text:'COUNT',align:'left',sortable:true,value:'Count' },
      ],
      lists:[],
      additionals:[],
      selectedKeyword:null,
      inputedColorName:null,
      editedIDX:null,
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
      let arr = this.lists.filter(k => { return k.IDX_M_InventoryColor == id })
      
      switch (code){
        case 'isUpdate':
          this.editRequestDialog = true;
          this.editedIDX = id;
          this.editedName = arr[0].InventoryColorName;
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
        InventoryColorName: this.inputedColorName
      }

      this.client("Master/saveColor",id,() => {
        this.loadList(); 
        this.newRequestDialog = false;
      });
    },
    toUpdate(p){
      let id = {
        Session_ID: this.$session.get('SESSION_ID'),
        IDX_M_InventoryColor: this.editedIDX,
        InventoryColorName: this.editedName
      }

      this.client("Master/updateColor",id,() => {
        this.loadList(); 
        this.editRequestDialog = false;
      });
    },
    toEnable(a,b){
      let id = {
        Session_ID: this.$session.get('SESSION_ID'),
        IDX_M_InventoryColor:b
      }
      this.client(a ? "Master/enableColor" : "Master/disableColor",id,() => this.loadList());
    },
    toDelete(i){
      let id = {
        Session_ID: this.$session.get('SESSION_ID'),
        IDX_M_InventoryColor:i
      }
      this.client("Master/deleteColor",id,() => this.loadList());
    },
    close(p){
      this.newRequestDialog = p;
      this.editRequestDialog = p;
      this.loadList();
    },
    loadList(){
      var id = { 
        Keyword:this.selectedKeyword,
        PageSize: this.pageSize,
        CurrentPage: this.currentPage,
        Session_ID: this.$session.get('SESSION_ID')
      };
      this.axios
        .post("Master/loadColor", id)
        .then(response => {
          this.lists = JSON.parse(response.data)['Table'];
          this.totalRecords = JSON.parse(response.data)['Table1'][0].TotalRecords;
          this.maxPage = JSON.parse(response.data)['Table1'][0].MaxPage;
          this.isNew = JSON.parse(response.data)['Table1'][0].isNew;
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
