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

function responseErrorInterceptor(error: AxiosError<{errorMessage:string, errorCode:string | number}>) {
  console.log(error)
  const responseData = error.response?.data
  if (responseData) {
    console.log(responseData, 'responseData')
    const err = new AxiosError(
      responseData.errorMessage,
      error.code,
      error.config,
      error.request,
      error.response
    )
    return Promise.reject(err)
  } else {
    return Promise.reject(error)
  }
}

request.interceptors.response.use(
  responseBaseInterceptor,
  responseErrorInterceptor
)

export default request
