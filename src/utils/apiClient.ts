import aspida, { FetchConfig } from '@aspida/fetch'
import api from '$/api/$api'

const fetchConfig: FetchConfig = {
  throwHttpErrors: false
}

export const apiClient = api(aspida(undefined, fetchConfig))
