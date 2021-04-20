import axios from '@/utils/axios'

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
      return axios
        .get('/list')
        .then(it => it.data)
        .then(list => {
          commit('setList', list)
        })
    },

    aasda () {
      const json = '[{"name":"567890567","status":{"1080-1-1.mp4":"CONVERTING"}},{"name":"7046-","status":"PENDING"},{"name":"6980-два с половиной","status":"PENDING"},{"name":"6970-персона","status":"PENDING"},{"name":"6963-экспансия","status":"PENDING"},{"name":"6952-ходячие","status":"PENDING"},{"name":"6944-люцифер","status":"PENDING"},{"name":"5380-I Know This Much Is True (2020)","status":{"1080-1-1.mp4":"CONVERTING","1080-1-2.mp4":"CONVERTING","1080-1-3.mp4":"CONVERTING","1080-1-4.mp4":"CONVERTING","1080-1-5.mp4":"CONVERTING","1080-1-6.mp4":"CONVERTING"}},{"name":"5379-Britannia (2017)","status":{"1080-1-1.mp4":"CONVERTING","1080-1-2.mp4":"CONVERTING","1080-1-3.mp4":"CONVERTING","1080-1-4.mp4":"CONVERTING","1080-1-5.mp4":"CONVERTING","1080-1-6.mp4":"CONVERTING","1080-1-7.mp4":"CONVERTING","1080-1-8.mp4":"CONVERTING","1080-1-9.mp4":"CONVERTING"}},{"name":"5378-Incorporated (2016)","status":{"1080-1-1.mp4":"CONVERTING","1080-1-2.mp4":"CONVERTING","1080-1-3.mp4":"CONVERTING","1080-1-4.mp4":"CONVERTING","1080-1-5.mp4":"CONVERTING","1080-1-6.mp4":"CONVERTING","1080-1-7.mp4":"CONVERTING","1080-1-8.mp4":"CONVERTING","1080-1-9.mp4":"CONVERTING"}},{"name":"5328-Speed Kills (2018)","status":"DONE"}]'

      return Promise.resolve(JSON.parse(json))
    }
  }

}
