<template>
  <div id="app">
    <h1>This is my server</h1>
    <color-picker v-if="connected"
                  :color="color"
                  :sucker-hide="true"
                  @changeColor="changeColor"
    />
    <p>{{state}} state</p>
    <p>{{color}} color</p>
    <p>{{timeCompute}} Last ping</p>
    <button @click="toggleOn">Toggle</button>
  </div>
</template>

<script>
  import 'minireset.css'
  import moment from 'moment'
  import colorPicker from '@caohenghu/vue-colorpicker'

  export default {
    name: 'app',
    components: {
      colorPicker
    },
    data() {

      return {
        state: {},
        connection: false,
        connected: false,
        loaded: false,
        lastPing: 'none',
        color: '#fff',
        suckerCanvas: null,
        suckerArea: [],
        isSucking: false
      }
    },
    methods: {

      toggleOn() {
        this.state.on = !this.state.on
        this.connection.send(JSON.stringify({type: 'update', state: this.state}))
        console.log('sent new on state', this.state)
      },
      changeColor(color) {

        const rgb = {r: color.rgba.r, g: color.rgba.g, b: color.rgba.b}
        this.state.color = rgb
        if (this.connected && this.state.timeStamp) {
          console.log(this.state, 'color changed')
          this.connection.send(JSON.stringify({type: 'update', state: this.state}))
        }

      },
      openSucker(isOpen) {
        if (isOpen) {
          // ... canvas be created
          // this.suckerCanvas = canvas
          // this.suckerArea = [x1, y1, x2, y2]
        } else {
          // this.suckerCanvas && this.suckerCanvas.remove
        }
      }

    },
    computed: {
      timeCompute() {
        console.log('computing time')
        if (moment(this.lastPing).isValid()) {
          return moment(this.lastPing).fromNow()
        } else {
          return 'Lamp Not Online'
        }


      }
    },
    mounted() {
      const url = 'ws://localhost:3030'
      this.connection = new WebSocket(url)
      this.connection.onopen = () => {
        //connection.send('hey')thi
        this.connected = true
        this.connection.onerror = error => {
          console.log(`WebSocket error: ${error}`)
        }
        this.connection.onmessage = e => {
          //   console.log(e.data)
          let data = JSON.parse(e.data)
          if (data.type === 'update') {
            this.state = data.state
            this.color = JSON.stringify(this.state.color)
            console.log(this.state, 'state on update')
          }
          if (data.type === 'lampPing') {
            this.lastPing = data.time;
          }
        }
        //...
      }
    }

  }
</script>

<style lang="scss">

</style>
