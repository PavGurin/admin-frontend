
export default {
  getters: {
    getEpisodesByStatus: (state, getters) => id => {
      const status = getters.getSerialsList[id].status
      if (typeof status === 'string') {
        return
      }
      return status
    },
    getSerialsList (state, getters, rootState) {
      return rootState.allVideosList.filter(function (video) {
        return typeof video.status === 'object'
      })
    },
    getSeasonsList: (state, getters) => id => {
      let serialsList = []
      console.log(getters.getSerialsList[id], id)
      let series = getters.getSerialsList[id].status
      console.log(series)
      for (let fileName in series) {
        console.log(fileName)
        let season = fileName.split('-')[1]
        if (!serialsList.includes(season)) {
          serialsList.push(season)
        }
      }
      console.log(serialsList)
      return serialsList
    },
  }}
