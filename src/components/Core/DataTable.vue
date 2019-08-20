<template>
  <v-container grid-list-xs fluid>
    <v-toolbar flat dense v-if="label == null || isNew == true ? false : true">
      <v-toolbar-title>{{ label }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn v-if="isNew" @click="isAdd"><v-icon color="lime">add</v-icon>ADD NEW</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-card flat>
      <v-card-title v-if="search">
        <v-text-field prepend-icon="search" v-model="searchText" label="Search" outline clearable></v-text-field>
      </v-card-title>
      <v-card-text>
        <v-data-table :headers="headers" :items="items" v-model="selected" :item-key="id"
          :search="searchText"
          v-bind="{ 
              [`select-all`]: select,
              [`hide-actions`]: clientside == true ? false : true
            }">
          <template v-slot:items="props" >
            <td v-if="select" class="text-xs-center">
              <v-checkbox
                v-model="props.selected"
                primary
                hide-details
              ></v-checkbox>
            </td>
            <td v-if="action" class="text-xs-center">
              <cs-action-menu 
                :id="get(props.item,id)"
                :isUpdate="props.item.isUpdate"
                :isUpdateTo="url ? url : null"
                :isEnable="props.item.isEnable"
                :isDisable="props.item.isDisable"
                :isGoto="props.item.isGoto"
                :isHRIS="props.item.isHRIS"
                :skip="skip"
                :isDelete="props.item.isDelete"
                :isReadOnly="props.item.isReadOnly"
                @action="actionMenu"
              />
            </td>
            <td v-for="(k,i) in body" :key="i" :class="k.class">
              <span v-if="k.number">{{ formatPrice(get(props.item,k.value)) }}</span>
              <span v-else-if="k.url">
                <v-btn flat small :to="k.url+get(props.item,id)">{{ get(props.item,k.value) }}</v-btn>
              </span>
              <span v-else-if="k.info">
                <v-badge color="orange">                
                  <v-icon slot="badge" dark v-if="props.item.isEnable">warning</v-icon>                 
                  <span>{{ get(props.item,k.value) }}</span>               
                </v-badge>
              </span>
              <span v-else>
                <span v-if="k.type == 'number'">{{ formatPrice(get(props.item,k.value)) }}</span>
                <span v-else-if="k.type == 'date'">
                  <v-chip v-if="!k.format" small outline class="warning">Please add format date</v-chip>
                  {{ get(props.item,k.value) | moment(k.format) }}
                </span>
                <span v-else>{{ get(props.item,k.value) }}</span>
              </span> 
            </td>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
/**
 headers = [
   {
     text:string,
     value:string,
     class:string,
     sort:bool,
   }
  bodyStatus: [
    { value:'BusinessHourName',class:'text-xs-left', to:'/BusinessHourDetail/' },
    { value:'BusinessHourDescription',class:'text-xs-left', info: true },
  ]

  props:
   - id         :null,
   - oid        :null,
   - isNew      :false,
   - to         :null,
   - headers    :null,
   - loading    :false,
   - items      :null,
   - body       :null,
   - filter     :false,
   - action     :false,
   - skip       :false, 
   - maxPage    :null,
   - total      :null,
   - flat       :false,
   - info       :false,
   - title      :null,
   - headcolor  :null,
   - select     :false

  emitter:
   - action
   - isNew
   - submit
 ];
 */
import CsActionMenu from '@/components/Core/ActionMenu';
import CsSearch from '@/components/Core/Search';

export default {
  name: 'cs-datatable',
  props:{
    // oid:null,
    // isNew:false,
    // filter:false,
    // flat:false,
    // info:false,
    // title:null,
    // headcolor:null,
    
    id:null,
    label:null,
    url:null,
    select:false,
    clientside:false,
    search:false,
    headers:null,
    items:null,
    body:null,
    action:false,
    skip:false, 
    maxPage:null,
    total:null,
  },
  components:{
    'cs-action-menu': CsActionMenu,
    'cs-search': CsSearch,
  },
  watch:{
    pageSize(){
      let id = { PageSize: this.pageSize };
      this.submit(id);
    },
    page(){
      let id = { CurrentPage: this.page };
      this.submit(id);
    },
    selected(){
      //no code
    }
  },
  computed:{
    selectAll:{
      get:function(){
        return this.items ? this.selected.length == this.items.length : false;
      },
      set:function(value){
        let self = this;
        let selected = [];

        if(value){
          this.items.forEach(function(item){
            selected.push(self.get(item,self.id));
          });
        }
        this.selected = selected;
      }
    }
  },
  data(){
    return {
      lastId:[],
      searchText:null,
      pageSize:50,
      currentPage:1,
      page:1,
      pages: [
        { text: "10", value: 10 },
        { text: "25", value: 25 },
        { text: "50", value: 50 },
        { text: "70", value: 70 },
        { text: "90", value: 90 },
        { text: "All", value: 999999 }
      ],
      header_action:[
        { text:'Action',class:'text-xs-center',sort:false }
      ],
      asc:false,
      vm:{},
      selected:[],
    }
  },
  methods:{
    get(arr,elm){
      elm = elm.replace(/\[(\w+)\]/g, '.$1');
      elm = elm.replace(/^\./, '');
      let el = elm.split('.');

      for (let i = 0, n = el.length; i < n; ++i) {
          let k = el[i];
          if (k in arr) {
              arr = arr[k];
          } else {
              return;
          }
          return arr;
      }
    },
    loadSearch(p){
      let id;
      if((this.lastId != null) || (this.lastId != undefined)){
        id = this.$aid.arrayMerge(this.lastId,p)
      }else{
        id = this.lastId = p;
      }
      this.submit(id);
    },
    actionMenu(p){
      let code = p.code;
      let id = p.id;
      let data = [];
      for(let i in this.selected){
        data.push(this.selected[i].get(this.selected[i],this.id));
      }
      this.$emit('action',{code:code,id:id,selected:data});
    },
    go(v){
      let id = { CurrentPage: v };
      //console.log(id);
      this.submit(id);
    },
    sort(v){
      this.asc = this.asc =! this.asc;
      let id = this.asc ? { SortBy: v, SortSequence: 0 } : { SortBy: v, SortSequence: 1 }
      this.submit(id);
    },
    localSort(value){
      let sort = this.items.sort(this.$aid.dynamicSort(value));
      return sort =! sort
    },
    isAdd(){
      this.$emit('isNew',{selected:this.selected});
    },
    submit(id){
      this.$emit('submit',id);
    },

    // CORE
    formatPrice(value) {
      let val = (value / 1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    }
  }
}
</script>

<style>
  
</style>

