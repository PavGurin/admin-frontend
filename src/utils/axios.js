import Axios from 'axios'

const instance = Axios.create({
  baseURL: 'http://localhost:3030/api',
})

export default instance
