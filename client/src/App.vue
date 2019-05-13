<template>
  <div id="app">
    <h1>This is my server</h1>
    <p>{{state}}</p>
    <button @click="toggleOn">Toggle</button>
  </div>
</template>

<script>
  import 'minireset.css'

  export default {
    name: 'app',
    data() {
      return {
        state: {},
        connection: false,
        loaded: false
      }
    },
    methods: {

      toggleOn() {
        this.state.on = !this.state.on
        this.connection.send(JSON.stringify({type: 'update', state: this.state}))
      }
    },
    mounted() {
      const url = 'ws://localhost:3030'
      this.connection = new WebSocket(url)
      this.connection.onopen = () => {
        //connection.send('hey')
        this.connection.onerror = error => {
          console.log(`WebSocket error: ${error}`)
        }
        this.connection.onmessage = e => {
          //   console.log(e.data)
          let data = JSON.parse(e.data)
          if (data.type === 'update') {
            this.state = data.state
          }
        }
        //...
      }
    }

  }
</script>

<style lang="scss">

</style>
