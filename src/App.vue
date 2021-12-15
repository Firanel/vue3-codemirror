<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <codemirror
    doc=""
    capture-tab
    lang="lua"
  />
</template>

<script setup lang="ts">
import Codemirror from './components/Codemirror.vue'
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.codemirror {
  border: 1px solid grey;
}
</style>
