module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        appId: 'com.electron.spotifypreview',
        productName: 'Spotify Preview',
        directories: {
          buildResources: 'buildResources',
          output: 'dist',
        },
        linux: {
          target: ['AppImage'],
          icon: 'icon',
          category: 'Music'
        }
      }
    }
  }
}