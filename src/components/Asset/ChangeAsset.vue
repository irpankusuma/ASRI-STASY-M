<template>
  <div>
    <v-toolbar dense flat>
      <v-toolbar-title class="white--text">{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-chip disabled>{{ assetID }}</v-chip>
    </v-toolbar>
    <v-card>
      <v-card-text>
        <v-autocomplete outline :items="items" chips clearable required v-model="selected" label="Choose" 
          :item-text="itemText" :item-value="itemValue"></v-autocomplete>
        <v-textarea v-model="remarks" label="Remarks" outline></v-textarea>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn dark class="white--text" @click="save()">Save</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  name:'change-asset',
  props:{
    title:null,
    idx:null,
    assetID:null,
    items:null,
    itemText:null,
    itemValue:null
  },
  data(){
    return {
      selected:null,
      remarks:null,
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
    save(){
      if(this.selected){
        this.$emit('save',{
          idx: this.idx,
          selected: this.selected,
          remarks: this.remarks
        });
      } else {
        this.showAlert('Required Field Choose','error');
      }
    },
  }
}
</script>
