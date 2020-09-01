<template>
  <div class="connector-chooser-root">
    <h1>Choose your connector</h1>
    <div class="connectors">
      <connector-chooser-card v-for="connector of connectorsAvailable" :key="connector.name"
        @click="setConnector(connector.connector)"
        :needOauth="connector.needOauth"
        :icon='connector.icon'
        :text="connector.text"/>
    </div>
  </div>
</template>

<script>
import ConnectorChooserCardVue from '../components/ConnectorChooserCard.vue'
import ConnectorSpotifyCloud from '../services/connectors/SpotifyCloud'
import ConnectorSpotifyDesktop from '../services/connectors/SpotifyDesktop'
import Connector from '../services/Connector'
import os from 'os'
export default {
  components: {
    connectorChooserCard: ConnectorChooserCardVue
  },
  data() {
    return  {
      connectors: [{
        text: 'Spotify Desktop',
        icon: 'fab fa-spotify',
        condition: os.platform() !== "win32",
        connector: ConnectorSpotifyDesktop ,
      }, {
        text: 'Spotify Cloud',
        icon: 'fab fa-spotify',
        condition: true,
        connector: ConnectorSpotifyCloud ,
        needOauth: true
      }]
    }
  },
  computed: {
    connectorsAvailable() {
      return this.connectors.filter(connector => connector.condition)
    }
  },
  mounted() {
  },
  methods: {
    /** @param {import('../services/Connector').ConnectorFunction */
    async setConnector(connector) {
      await Connector.setConnector(connector)
      this.$router.push({name: 'main'})
    }
  }
}
</script>

<style lang="scss" scoped>
.connector-chooser-root {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h1 {
    font-size: 1.2em;
  }
  .connectors {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>