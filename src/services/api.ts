import axios from "axios";

const api = axios.create({
  baseURL: 'http://192.168.18.75:3333'
})

export { api }