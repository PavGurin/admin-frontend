
export default {
  getters: {
    getEpisodesByStatus: (state, getters) => (serialId, seasonId) => {
      let series = getters.getSerialsList[serialId].status
      if (typeof series === 'string') {
        return
      }
      let episodes = []
      for (let fileName in series) {
        let season = parseInt(fileName.split('-')[1])
        let episode = fileName.split('-')[2].split(`.`)[0]
        if (season === seasonId + 1 && !episodes.includes(episode)) {
          episodes.push(episode)
        }
      }
      return episodes
    },
    getSerialsList (state, getters, rootState) {
      return rootState.allVideosList.filter(function (video) {
        return typeof video.status === 'object'
      })
    },
    getSeasonsList: (state, getters) => id => {
      let serialsList = []
      let series = getters.getSerialsList[id].status
      for (let fileName in series) {
        let season = fileName.split('-')[1]
        if (!serialsList.includes(season)) {
          serialsList.push(season)
        }
      }
      return serialsList
    },
  }}
