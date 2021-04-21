import axios from '@/utils/axios'

export default {
  state: {
    seriesList: {}
  },
  mutations: {
    setList (state, value) {
      state.seriesList = value
    }
  },
  methods: {
    getList ({commit}) {
      return axios
        .get('/list')
        .then(it => it.data)
        .then(list => {
          commit('setList', list)
        })
    }
  }
}
