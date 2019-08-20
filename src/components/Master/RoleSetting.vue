<template>
  <v-container fluid>
    <PageToolbar
      :header="'ASRI-STASY'"
      :subheader="'ROLE-SETTING'"
      :isLoading="$store.state.loading"
      :backButton="true"
    />
    
    <v-toolbar dark>
      <v-toolbar-items>
        <v-btn @click="newRequestDialog =! newRequestDialog" v-if="isNew"><v-icon left color="lime">add</v-icon>USER BARU</v-btn>
      </v-toolbar-items>
      <Search @search="actionSearch" />
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn @click="loadList()"><v-icon>refresh</v-icon></v-btn>
        <!-- <v-btn @click="filterDialog =! filterDialog"><v-icon :color="filterDialog ? 'red' : 'cyan'">{{ filterDialog ? 'clear' : 'search' }}</v-icon></v-btn> -->
      </v-toolbar-items>
    </v-toolbar>
    <v-card dark>
      <v-card-text>
        <v-data-table :headers="headers" :items="lists" :expand="true">
          <template v-slot:items="props">
            <tr>
              <td class="text-xs-center">
                <ActionMenu
                  :id="props.item.NIK"
                  :isUpdate="props.item.isUpdate"
                  @action="actionMenu"
                />
              </td>
              <td class="text-xs-left">{{ props.item.NIK }}</td>
              <td class="text-xs-left">{{ props.item.Name }}</td>
              <td class="text-xs-left">{{ props.item.PositionName }}</td>
              <td class="text-xs-left">{{ props.item.DepartmentName }}</td>
              <td class="text-xs-left">{{ props.item.DivisionName }} - {{ props.item.DirectorateName }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- EDIT REQUEST -->
    <v-dialog lazy
      v-model="editRequestDialog"
      scrollable fullscreen 
      persistent :overlay="false"
      max-width="500px"
      transition="bottom-dialog-transition"
    >
      <v-card dark>
        <v-toolbar dense flat dark>
          <v-toolbar-title>
            <v-progress-circular v-if="$store.state.loading" :indeterminate="$store.state.loading" background-color="blue" color="lime" width="3"></v-progress-circular> 
            EDIT USER
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn flat small @click="editRequestDialog =! editRequestDialog"><v-icon>clear</v-icon></v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <Role :isInsert="false" :id="editedNIK" :items="userRoles" @submit="toUpdate" @close="close" />
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- NEW REQUEST -->
    <v-dialog lazy
      v-model="newRequestDialog"
      scrollable fullscreen 
      persistent :overlay="false"
      max-width="500px"
      transition="bottom-dialog-transition"
    >
      <v-card dark>
        <v-toolbar dense flat dark>
          <v-toolbar-title>
            <v-progress-circular v-if="$store.state.loading" :indeterminate="$store.state.loading" background-color="blue" color="lime" width="3"></v-progress-circular> 
            USER BARU
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn flat small @click="newRequestDialog =! newRequestDialog"><v-icon>clear</v-icon></v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <Role :isInsert="true" :users="listsUser" :items="roles" @close="close" @submit="toSave" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import PageToolbar from "@/components/Toolbar/PageToolbar"; // required
import ActionMenu from "@/components/Core/ActionMenu"; // required
import Search from "@/components/Core/Search"; // required
import Role from "@/components/Core/Role"; // required

export default {
  name:'role-setting',
  components:{
    PageToolbar,ActionMenu,Search,Role
  },
  created(){
    this.loadList();
  },
  watch:{
    selectedAdvanceRequester(){
      this.loadList();
    },
  },
  data(){
    return {
      headers: [
        { text:'ACTION',align:'center',sortable:false,value:null },
        { text:'NIK',align:'left',sortable:true,value:'NIK' },
        { text:'NAME',align:'left',sortable:true,value:'Name' },
        { text:'POSITION',align:'left',sortable:true,value:'PositionName' },
        { text:'DEPARTMENT',align:'left',sortable:true,value:'DepartmentName' },
        { text:'DIVISION',align:'left',sortable:true,value:'DivisionName' },
      ],
      lists:[],
      listsUser:[],
      userRoles:[],
      roles:[],
      selectedKeyword:null,
      inputedNIK:null,
      editedNIK:null,
      roleAccess:[],

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
      let arr = this.lists.filter(k => { return k.NIK == id })
      
      switch (code){
        case 'isUpdate':
          this.editRequestDialog = true;
          this.editedNIK = id;
          this.loadList_ByNIK(id);
        break;
      }
    },
    toSave(p){
      let parse = JSON.parse(p);
      let id = {
        NIK:parse.IDX_M_Users,
        UserAccess:parse.UserAccess,
        Session_ID:parse.Session_ID
      }

      this.client("Master/saveUserSetting",id,() => {
        this.loadList(); 
        this.newRequestDialog = false;
        this.editRequestDialog = false;
      });
    },
    toUpdate(p){
      let parse = JSON.parse(p);
      let id = {
        NIK:parse.IDX_M_Users,
        UserAccess:parse.UserAccess,
        Session_ID:parse.Session_ID
      }

      this.client("Master/updateUserSetting",id,() => { 
        this.loadList(); 
        this.newRequestDialog = false;
        this.editRequestDialog = false;
      });
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
        .post("Master/loadUserSetting", id)
        .then(response => {
          this.lists = JSON.parse(response.data)['Table'];
          this.totalRecords = JSON.parse(response.data)['Table1'][0].TotalRecords;
          this.maxPage = JSON.parse(response.data)['Table1'][0].MaxPage;
          this.isNew = JSON.parse(response.data)['Table1'][0].isNew;
        })
        .then(() => setTimeout(() => this.loadAdditional(), 200))
        .then(() => setTimeout(() => this.loadUserList(), 200))
        .catch(error => this.showAlert("ERROR  : " + error.statusText, "error"));
    },
    loadAdditional(){
      this.axios
        .get("Master/loadAdditionalistUserSetting")
        .then(response => this.roles = JSON.parse(response.data)['Table'])
        .catch(error => this.showAlert("ERROR  : " + error.statusText, "error"));
    },
    loadList_ByNIK(v){
      var id = { NIK:v };
      this.axios
        .post("Master/loadUserUserSettingByNIK", id)
        .then(response => this.userRoles = JSON.parse(response.data)['Table'])
        .catch(error => this.showAlert("ERROR  : " + error.statusText, "error"));
    },
    loadUserList(){
      this.axios
        .get("Master/loadAdditionalistUserSetting_UserLists")
        .then(response => this.listsUser = JSON.parse(response.data)['Table'])
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
