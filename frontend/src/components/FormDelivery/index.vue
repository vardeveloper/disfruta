<template lang="pug" src="./template.pug"></template>
<style lang="scss" scoped src="./style.scss"></style>
<style lang="scss">
.vdp-datepicker {
  width: 100%;
}

.vdp-datepicker input {
  font-family: Arial,Helvetica Neue,Helvetica,sans-serif;
  border: none;
  width: 100%;
  background: none;
  padding: 17px 19px;
  font-size: 14px;
}

.vdp-datepicker__calendar {
  bottom: 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.vdp-datepicker__calendar .cell:hover {
  border-color: #CCC;
}
.vdp-datepicker__calendar .cell.selected {
  background: #EE3224 !important;
  color: #FFF;
}
</style>
<script src="./script.js"></script>
