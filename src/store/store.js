import Vuex from 'vuex'
import Vue from 'vue'
import axios from '../utils/axios'
import * as R from 'ramda'
import serials from './serials'
import films from './films'

Vue.use(Vuex)

async function initList () {
  const result = await axios
    .get('/list')
    .then(R.prop('data'))
  return result
}

export const store = new Vuex.Store({
  modules: {
    serials,
    films,
  },
  state: {
    allVideosList: [],
  },
  mutations: {
    setAllVideosList (state, list) {
      state.allVideosList = list
    },
  },
  actions: {
    async getList (context) {
      const data = await initList()
      context.commit('setAllVideosList', data)
    },
  },
})
