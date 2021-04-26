export default {
  getters: {
    getFilmsList (state, getters, rootState) {
      return rootState.allVideosList.filter(function (video) {
        return typeof video.status === 'string'
      })
    },
  },
}
