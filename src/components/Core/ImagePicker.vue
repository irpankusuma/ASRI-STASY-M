<template>
  <v-container fluid>
    <v-layout>
      <v-flex v-for="(k,v) in imageData" :key="v" xs4 d-flex>
        <v-badge right overlap class="mr-3 mb-3">
          <span slot="badge"><v-btn icon color="red" dark small @click="remove(i)"><v-icon>clear</v-icon></v-btn></span>
          <v-hover>
            <v-card flat tile class="d-flex" slot-scope="{ hover }" :class="`elevation-${hover ? 12 : 4}`" @click="openImage(k.url)">
              <v-img :src="k.url" :lazy-src="k.url" aspect-ratio="1" class="grey lighten-2">
                <template v-slot:placeholder>
                  <v-layout fill-height align-center justify-center ma-0>
                    <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                  </v-layout>
                </template>
              </v-img>
            </v-card>
          </v-hover>
        </v-badge>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12>
        <v-text-field solo-inverted :label="multiple ? 'Select image multiple' : 'Select image'" @click='pick' v-model='imageName' append-icon='attach_file'></v-text-field>
        <input type="file" style="display: none" ref="image" accept="image/*" @change="onPicked" id="imageFile" v-bind="{ [`multiple`] : multiple }">
      </v-flex>
      <v-divider></v-divider>
      <v-flex xs12>
        <center>
          <v-btn fab small @click="save()" dark><v-icon color="cyan">save</v-icon></v-btn>
          <v-btn fab small @click="clear()"><v-icon>clear</v-icon></v-btn>  
        </center>
      </v-flex>
    </v-layout>
    <v-dialog v-model="open" scrollable :overlay="false" max-width="500px" transition="dialog-transition">
      <v-img :src="imageUrl" />
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  props:{
    refname:null,
    unique:null,
    multiple:false,
  },
  data(){
    return {
      imageName:null,
      imageUrl:'',
      imageData:[],
      uuid: this.$uuid.v1(),
      open:false
    }
  },
  computed: {
    avatarSize () {
      return `${this.slider}px`
    }
  },
  methods:{
    pick(){
      this.$refs.image.click()
    },
    openImage(image){
      this.imageUrl = image;
      this.open = this.open =! this.open;
    },
    buildName(name){
      const unique = this.unique != null ? this.unique : this.uuid
      let newname = "img-"+unique;
      let length  = name.lastIndexOf('.');
      let ext = name.substring(length,100);
      let filename = newname+ext;
      filename = filename.replace(/([~!@#$%^&*()_+=`{}\[\]\|\\:;'<>,\/? ])+/g, '-');

      return filename;
    },
    onPicked(e){
      const files = e.target.files
      if(files.length > 0){
        for(let i=0;i<files.length;i++){
          let x = files[i].name;
          if(x.lastIndexOf('.') <= 0) { return }
          const fr = new FileReader()    
          fr.readAsDataURL(files[i])
          fr.addEventListener('load',() => {
            this.imageData.push({
              name: x,
              savename: this.buildName(x),
              file: files[i],
              url: fr.result
            })
          });
        }
      }
    },
    clear(){
      this.imageData = [];
    },
    remove(v){
      this.imageData.splice(v,1)
    },
    save(){
      if(this.imageData.length == 0){
        this.showAlert('Please select image','error');
        return false;
      }
      this.$emit('save',this.imageData);
    },
    showAlert(message, code) {
      let data = {
        color:code,
        message: message,
        alert:true
      };
      this.$store.commit('alert',data);
    },
  }
}
</script>

<style>

</style>
