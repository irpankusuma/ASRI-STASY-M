<template>
  <v-container fluid>
    <v-text-field v-model="search" label="Pencarian" outline append-icon="search"></v-text-field>
      <v-data-table :headers="headers" :items="items" :search="search">
        <template slot="items" slot-scope="props">
          <tr>
            <td class="text-xs-left">
              <v-tooltip bottom>
                <v-btn fab dark small slot="activator" @click="select(props.item.NIK)"><v-icon color="green">check</v-icon></v-btn>
                <span>Pilih {{ props.item.FULLNAME }}</span>
              </v-tooltip>
            </td>
            <td class="text-xs-center">{{ props.item.NIK }}</td>
            <td class="text-xs-center">{{ props.item.FULLNAME }}</td>
            <td class="text-xs-center">{{ props.item.POS_NAME }}</td>
            <td class="text-xs-center">{{ props.item.DEPARTMENT_NAME }}</td>
            <td class="text-xs-center">{{ props.item.DIVISION_NAME }}</td>
            <!-- <td class="text-xs-center">{{ props.item.DIRECTORATE_NAME }}</td> -->
          </tr>
        </template>
      </v-data-table>
  </v-container>
</template>

<script>
export default {
  name:'get-depthead',
  props:{
    items:null
  },
  data(){
    return {
      search:null,
      headers: [
        { text:null,align:'center',sortable:false,value:null },
        { text:'NIK',align:'center',sortable:true,value:'NIK' },
        { text:'Nama Lengkap',align:'center',sortable:true,value:'FULLNAME' },
        { text:'Posisi',align:'center',sortable:true,value:'POS_NAME' },
        { text:'Department',align:'center',sortable:true,value:'DEPARTMENT_NAME' },
        { text:'Division',align:'center',sortable:false,value:'DIVISION_NAME' },
        // { text:'Directorate',align:'center',sortable:true,value:'DIRECTORATE_NAME' },
      ],
    }
  },
  methods:{
    select(v){
      this.$emit('select',v);
    }
  }
}
</script>

<style>

</style>
