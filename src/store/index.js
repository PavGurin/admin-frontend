import Vuex from 'vuex'
import Vue from 'vue'

import films from './films'

Vue.use(Vuex)

export default new Vuex.Store({

  modules: {
    films
  }
})
