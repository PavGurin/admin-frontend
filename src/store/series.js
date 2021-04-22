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
      const allList = axios
        .get('/list')
        .then(it => it.data)
        .then(list => {
          commit('setList', list)
        })
      for (let film in allList) {
        if (typeof allList[film].status === 'object') {
          let key = allList[film].name
          this.seriesList[key] = this.filmList[film].status
        }
      }
      return this.seriesList
    }
  }
}
