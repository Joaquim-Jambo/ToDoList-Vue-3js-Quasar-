import { boot } from 'quasar/wrappers'
import axios from 'axios'

// configurar a nossa api para quando nós colocar app em produção não dar trabalho
const api = axios.create({ baseURL: process.env.API_URL })

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios

  app.config.globalProperties.$api = api
})

export { axios, api }
