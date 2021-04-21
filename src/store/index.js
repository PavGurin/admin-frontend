import Vuex from 'vuex'
import Vue from 'vue'

import films from './films'
// import series from './series'

Vue.use(Vuex)

export default new Vuex.Store({

  modules: {
    films
    // series
  }
})
