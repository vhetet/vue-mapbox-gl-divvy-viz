<template>
  <StationContainer />
</template>

<script>
import StationContainer from "./components/divvy-station-container.vue";

export default {
  name: 'App',
  components: {
    StationContainer
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
}

.destination {
    width: 20px;
    height: 20px;
    border: solid black 2px;
    border-radius: 50%;
}
</style>
