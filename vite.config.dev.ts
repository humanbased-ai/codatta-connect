import { defineConfig, HttpProxy, ProxyOptions } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "tailwindcss"
import path from 'path'
import { ClientRequest, IncomingMessage, ServerResponse } from 'http'
import { debug } from 'console'

function proxyDebug(proxy: HttpProxy.Server, _options: ProxyOptions) {
  proxy.on(
    'error',
    (err: Error, _req: IncomingMessage, _res: ServerResponse<IncomingMessage>, _target?: HttpProxy.ProxyTargetUrl) => {
      console.log('proxy error', err)
    }
  )
  proxy.on('proxyReq', (proxyReq: ClientRequest, req: IncomingMessage, _res: ServerResponse<IncomingMessage>) => {
    console.log(
      '[Request]:',
      req.method,
      req.url,
      ' => ',
      `${proxyReq.method} ${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`
    )
  })
  proxy.on('proxyRes', (proxyRes: IncomingMessage, req: IncomingMessage, _res: ServerResponse<IncomingMessage>) => {
    console.log('[Response]:', proxyRes.statusCode, req.url)
  })
}

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./lib"),
    },
  },
  build: {
    emptyOutDir: true,
  },

  server: {
    proxy: {
      '/api': {
        target: 'https://app.codatta.io',
        changeOrigin: true,
        configure: proxyDebug,
      },
    }
  },

  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss],
    },
  }
})
