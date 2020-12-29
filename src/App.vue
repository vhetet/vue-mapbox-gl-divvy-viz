<template>
  <StationInfo />
</template>

<script>
import StationInfo from "./components/divvy-station-info.vue";

export default {
  name: 'App',
  components: {
    StationInfo
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
}
</style>
