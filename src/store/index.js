import Vuex from 'vuex'
import Vue from 'vue'
import axios from '../utils/axios'
import * as R from 'ramda'

Vue.use(Vuex)

async function initList () {
  const result = await axios
    .get('/list')
    .then(R.prop('data'))
  return result
}

export const store = new Vuex.Store({
  state: {
    filmsList: []
  },
  mutations: {
    setList (state, list) {
      state.filmsList = list
    }
  },
  actions: {
    async getList (context) {
      const data = await initList()
      context.commit('setList', data)
    }
  },
  getters: {
    getEpisodesByStatus: state => id => {
      const status = state.filmsList[id].status
      if (typeof status === 'string') {
        return
      }
      return status
    }
  }
})
