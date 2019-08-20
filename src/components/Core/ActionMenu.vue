<template>
  <div>
    <v-menu bottom :left="left" :right="right">
      <v-btn icon slot="activator" flat><v-icon :color="color">more_vert</v-icon></v-btn>
      <v-list dense>
        <!-- for dynamic array then go -->
        <v-list-tile v-for="(k, v) in items" :key="v" @click="submit(k.code)" :to="(k.to != null) || (k.to != undefined) ? k.to + ($aid.isArray(idx) ? idx[1] : idx) : null">
          <v-list-tile-title><v-icon v-if="k.icon != null" :color="k.color">{{ k.icon }}</v-icon> {{ k.text }}</v-list-tile-title>
        </v-list-tile>

        <!-- Default Master -->
        <v-list-tile @click="submit('isGoto')" v-if="isGoto">
          <v-list-tile-title><v-icon small color="blue" left>public</v-icon> Show</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="submit('isUpdate')" v-if="isUpdate" :to="isUpdateTo != null ? isUpdateTo + this.id : null">
          <v-list-tile-title><v-icon small color="green" left>mode_edit</v-icon> Edit</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="submit('isEnable')" v-if="isEnable != null">
          <v-list-tile-title v-if="isEnable"><v-icon small color="green">visibility</v-icon> Enable</v-list-tile-title>
          <v-list-tile-title v-if="!isEnable"><v-icon small color="red">visibility_off</v-icon> Disable</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="submit('isDelete')" v-if="!skip ? isDelete && isEnable : isDelete">
          <v-list-tile-title><v-icon small color="black">delete</v-icon> Delete</v-list-tile-title>
        </v-list-tile>

        <!-- New Fitur isAssign*, isChange*, isReturn -->
        <!-- <v-list-tile @click="submit('isAssignUser')" v-if="isAssignUser">
          <v-list-tile-title>
            <v-icon color="green">supervisor_account</v-icon> Assign User
          </v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="submit('isAssignLocation')" v-if="isAssignLocation">
          <v-list-tile-title>
            <v-icon color="yellow darken-2">add_location</v-icon> Assign Location
          </v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="submit('isAssignStatus')" v-if="isAssignStatus">
          <v-list-tile-title>
            <v-icon color="blue darken-1">compare_arrows</v-icon> Assign Status
          </v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="submit('isChangeCompany')" v-if="isChangeCompany">
          <v-list-tile-title>
            <v-icon color="red darken-1">business</v-icon> Change Company
          </v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="submit('isChangeManagement')" v-if="isChangeManagement">
          <v-list-tile-title>
            <v-icon color="black">device_hub</v-icon> Change Management
          </v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="submit('isReturn')" v-if="isReturn">
          <v-list-tile-title>
            <v-icon color="black">delete</v-icon> Delete
          </v-list-tile-title>
        </v-list-tile> -->

        <!-- Master => MasterUser => HRIS -->
        <!-- <v-list-tile @click="submit('isHRIS')" v-if="isHRIS">
          <v-list-tile-title>
            <v-icon color="black">how_to_reg</v-icon> Update HRIS
          </v-list-tile-title>
        </v-list-tile> -->

        <!-- My Request -->
        <v-list-tile @click="submit('isRequest')" v-if="isRequest">
          <v-list-tile-title><v-icon small color="cyan" left>send</v-icon> Send Request</v-list-tile-title>
        </v-list-tile>
        <!-- Draft -->
        <v-list-tile @click="submit('isDraft')" v-if="isDraft">
          <v-list-tile-title v-if="isDraft"><v-icon small color="lime" left>drafts</v-icon> Draft</v-list-tile-title>
        </v-list-tile>

        <v-list-tile @click="submit('isApprove')" v-if="isApprove != null">
          <v-list-tile-title v-if="isApprove"><v-icon small color="green" left>verified_user</v-icon> Approve</v-list-tile-title>
          <v-list-tile-title v-if="!isApprove"><v-icon small color="red" left>clear</v-icon>Cancel Approve</v-list-tile-title>
        </v-list-tile>

        <v-list-tile @click="submit('isReject')" v-if="isReject != null">
          <v-list-tile-title v-if="isReject"><v-icon small color="black" left>highlight_off</v-icon> Reject</v-list-tile-title>
          <v-list-tile-title v-if="!isReject"><v-icon small color="red" left>clear</v-icon> Cancel Reject</v-list-tile-title>
        </v-list-tile>

        <v-list-tile @click="submit('isCancel')" v-if="isCancel">
          <v-list-tile-title><v-icon small color="black" left>cancel</v-icon>Cancel</v-list-tile-title>
        </v-list-tile>

        <v-list-tile @click="submit('isReceive')" v-if="isReceive">
          <v-list-tile-title><v-icon small color="blue darken-1" left>local_shipping</v-icon>Receive</v-list-tile-title>
        </v-list-tile>

        <!-- OPNAME -->
        <v-list-tile @click="submit('isLocked')" v-if="isLocked">
          <v-list-tile-title><v-icon small color="red darken-1" left>lock</v-icon>Locked</v-list-tile-title>
        </v-list-tile>

        <v-list-tile @click="submit('isVerify')" v-if="isVerify">
          <v-list-tile-title><v-icon small color="green darken-1" left>done</v-icon>Verify</v-list-tile-title>
        </v-list-tile>

        <v-list-tile @click="submit('isRemove')" v-if="isRemove">
          <v-list-tile-title><v-icon small color="black" left>remove_circle</v-icon>Remove</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
export default {
  name: 'cs-action-menu',
  props: {
    id: null,
    items: null,
    color: null,
    left: true,
    right: false,
    divider: false,
    isUpdateTo: null,

    /** Default Master */
    isUpdate: false,
    isDelete: false,
    isEnable: false,
    isGoto: true,
    isReadOnly: false,
    skip: false,

    /** Fitur */
    // isAssignUser:null,
    // isAssignLocation:null,
    // isAssignStatus:null,
    // isChangeCompany:null,
    // isChangeManagement:null,
    // isReturn:null,

    /** Master => Master User */
    // isHRIS:null,

    /** My Request */
    isApprove:false,
    isRequest:false,
    isDraft:false,
    isReject:false,
    isCancel:false,
    isReceive:false,
    isLocked:false,
    isVerify:false,
    isRemove:false,
  },
  watch: {
    id(){
      this.id;
    }
  },
  methods: {
    submit(code){
      this.$emit('action',{id:this.id,code:code});
    }
  }
}
</script>

<style>

</style>
