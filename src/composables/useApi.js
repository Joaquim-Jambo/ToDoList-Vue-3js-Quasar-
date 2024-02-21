import { api } from '../boot/axios'

export default function useApi () {
  // post
  const post = async (url, form) => {
    try {
      const { data } = await api.post(url, form)
      return data
    } catch (error) {
      throw new Error(error)
    }
  }
  // get

  const list = async (url) => {
    try {
      const { data } = await api.get(url)
      return data
    } catch (error) {
      throw new Error(error)
    }
  }
  // update

  const update = async (url, form) => {
    try {
      const { data } = await api.put(`${url}/${form.id}`, form)
      return data
    } catch (error) {
      throw new Error(error)
    }
  }
  // delete
  const remove = async (url, id) => {
    try {
      const { data } = await api.delete(`${url}/${id}`)
      return data
    } catch (error) {
      throw new Error(error)
    }
  }
  return {
    list, post, update, remove
  }
}
