import useApi from 'src/composables/useApi.js'

export default function todoService () {
  const { list, post, remove, update } = useApi()
  return {
    list, post, remove, update
  }
}
