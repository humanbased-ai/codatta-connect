import axios, { AxiosError, AxiosResponse } from 'axios'

const request = axios.create({
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
    'token': localStorage.getItem('auth')
  }
})

function responseBaseInterceptor(res: AxiosResponse) {
  if (res.data?.success !== true) {
    const error = new AxiosError(
      res.data?.errorMessage,
      res.data?.errorCode,
      res.config,
      res.request,
      res
    )
    return Promise.reject(error)
  } else {
    return res
  }
}

request.interceptors.response.use(
  responseBaseInterceptor,
)

export default request
