<template>
  <v-container fluid>
    <v-layout column>
      <v-flex xs12 v-if="users">
        <v-autocomplete outline v-bind:items="users" v-model="v_selectedUser" label="Selected User" item-text="Name" item-value="NIK"></v-autocomplete>
      </v-flex>
      <v-flex xs12>
        <v-data-table :headers="headers" :items="items" :search="v_filter" flat>
          <template slot="items" slot-scope="props">                 
            <td class="text-xs-left">{{ props.item.Form_Name }}</td>            
            <td class="text-xs-left"><v-switch slot="activator" v-model="props.item.isRead" color="cyan lighten-2"></v-switch></td>
            <td class="text-xs-left"><v-switch slot="activator" :disabled="props.item.isReadOnly" v-model="props.item.isInsert" color="cyan lighten-2"></v-switch></td>
            <td class="text-xs-left"><v-switch slot="activator" :disabled="props.item.isReadOnly" v-model="props.item.isUpdate" color="cyan lighten-2"></v-switch></td>
            <td class="text-xs-left"><v-switch slot="activator" :disabled="props.item.isReadOnly" v-model="props.item.isDelete" color="cyan lighten-2"></v-switch></td>                
          </template>
        </v-data-table>
      </v-flex>
      <v-flex xs12>
        <center>
          <v-tooltip bottom>
            <span>Save</span>                                   
            <v-btn dark slot="activator" @click="fn_close()" v-show="!isInsert">
              <v-icon left color="red">clear</v-icon>CANCEL</v-btn>
          </v-tooltip>              
          <v-tooltip bottom>
            <span>Save</span>                                   
            <v-btn dark slot="activator" @click="open = false, fn_go()" v-show="isInsert">
              <v-icon left color="cyan">save</v-icon>SIMPAN</v-btn>
          </v-tooltip>  
          <v-tooltip bottom>
            <span>Update</span>                                   
            <v-btn dark slot="activator" @click="open = false, fn_go()" v-show="!isInsert">
              <v-icon left color="cyan">save</v-icon>UPDATE</v-btn>
          </v-tooltip>  
        </center>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'cs-role',
  props: {
    isInsert: true,
    id: null,
    users: null,
    items: null
  },
  data(){
    return {
      open: true,
      v_selectedUser: null,
      v_filter: null,
      headers: [
        { text: "Form", align: "left", sortable: true, value:'Form_Name' },
        { text: "Read", value: "isRead", align: "left", sortable: true },
        { text: "Insert", value: "isInsert", align: "left", sortable: true },
        { text: "Update", value: "isUpdate", align: "left", sortable: true },
        { text: "Delete", value: "isDelete", align: "left", sortable: true }
      ],
    }
  },
  methods: {
    fn_close(){
      this.$emit('close',false);
    },
    fn_go(){
      let rudi = [];
      let id;
      for (var i in this.items) {
        var el = this.items[i];
        if(el.isRead == true){
          el.isRead = 1
        }
        else if(el.isRead == false){
          el.isRead = 0
        }
        else if(el.isUpdate == true){
          el.isUpdate = 1
        }
        else if(el.isUpdate == false){
          el.isUpdate = 0
        }
        else if(el.isDelete == true){
          el.isDelete = 1
        }
        else if(el.isDelete == false){
          el.isDelete = 0
        }
        else if(el.isInsert == true){
          el.isInsert = 1
        }
        else if(el.isInsert == false){
          el.isInsert = 0
        }
        rudi.push({
          i: el.IDX_M_Forms,
          r: el.isRead,
          u: el.isUpdate,
          d: el.isDelete,
          n: el.isInsert
        });
      }
      
      if(this.isInsert){
        id = JSON.stringify({
          IDX_M_Users: this.v_selectedUser,
          UserAccess: rudi,
          Session_ID: this.$session.get('SESSION_ID')
        });
      }else{
        id = JSON.stringify({
          IDX_M_Users: this.id,
          UserAccess: rudi,
          Session_ID: this.$session.get('SESSION_ID')
        });
      }

      this.$emit('submit',id);
    }
  }
}
</script>

<style>

</style>
