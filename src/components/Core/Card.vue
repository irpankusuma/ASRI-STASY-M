<template>
  <v-layout row wrap>
    <v-toolbar dense flat v-if="title" dark>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
    </v-toolbar>
    <v-flex v-bind="{ [`xs${card.Flex}`]: true }" v-for="card in items" :key="card.Label">
      <v-card :to="card.Href" dark>
        <v-card-text class="grey--text text-xs-center">
          <v-layout column>
            <v-flex xs6>
              <v-icon large :color="card.Color" class="mt-3">{{ card.Icon != null ? card.Icon : v_icon }}</v-icon>    
            </v-flex>
            <v-flex xs6>
              <span class="body-2">{{ card.Label }}</span>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    name: 'cs-card',
    props: {
      title:null,
      items: {
        type: [Array,Object],
        required: true
      }
    },
    data(){
      return {
        v_urlImg: 'https://apps.alam-sutera.com/SharedAsset/general/type.png',
        v_icon: 'info',
      }
    }
  }    
</script>