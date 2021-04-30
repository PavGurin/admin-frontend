
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
        let episode = fileName.slice(0, -4).split('-')[2]
        if (season === seasonId + 1 && !episodes.includes(episode)) {
          episodes.push(episode)
        }
      }
      return episodes
    },
    getStatusOfEpisode: (state, getters) => (serialId, seasonId, episodeId) => {
      let series = getters.getSerialsList[serialId]
      return series.status[`1080-` + seasonId + `-` + episodeId + `.mp4`]
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
