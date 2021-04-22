// import axios from '@/utils/axios'

export default {
  state: {
    filmList: []
  },
  mutations: {
    setList (state, value) {
      state.filmList = value
    }
  },
  methods: {
    getList ({commit}) {
      return null
      // return axios
      //   .get('/list')
      //   .then(it => it.data)
      //   .then(list => {
      //     commit('setList', list)
      //   })
    }
  }
}
