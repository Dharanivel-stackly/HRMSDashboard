// @ts-nocheck
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin, PreviewServer, ViteDevServer } from 'vite'
import { loadEnv } from 'vite'

type ViteServer = Pick<ViteDevServer | PreviewServer, 'middlewares' | 'ssrLoadModule'>

function readJsonBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (chunk) => {
      data += chunk
    })
    req.on('end', () => {
      if (!data) {
        resolve(undefined)
        return
      }
      try {
        resolve(JSON.parse(data))
      } catch {
        resolve(undefined)
      }
    })
    req.on('error', reject)
  })
}

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

function attachMockMiddleware(server: ViteServer) {
  server.middlewares.use((req, res, next) => {
    void (async () => {
      try {
        if (!req.url || !req.method) {
          next()
          return
        }

        const url = new URL(req.url, 'http://localhost')
        if (!url.pathname.startsWith('/api/recruitment/')) {
          next()
          return
        }

        const module = await server.ssrLoadModule(
          '/src/lib/mock/mockRecruitmentApiRouter.ts'
        )
        const query = Object.fromEntries(url.searchParams.entries())
        const body =
          req.method === 'GET' || req.method === 'HEAD'
            ? undefined
            : await readJsonBody(req)
        const response = await module.executeMockRequest({
          method: req.method,
          path: url.pathname.replace(/^\/api/, ''),
          query,
          body,
        })

        if (response.status === 404) {
          next()
          return
        }

        sendJson(res, response.status, response.body)
      } catch (error) {
        console.error('[mock-api] recruitment request failed:', error)
        sendJson(res, 500, {
          success: false,
          message: 'Recruitment mock API handler failed',
        })
      }
    })()
  })
}

export function mockApiPlugin(): Plugin {
  let useMockApi = true

  return {
    name: 'mock-api',
    enforce: 'pre',
    config(_, { mode }) {
      const env = loadEnv(mode, process.cwd(), '')
      useMockApi = env.VITE_USE_MOCK_API !== 'false'
    },
    configureServer(server) {
      if (useMockApi) attachMockMiddleware(server)
    },
    configurePreviewServer(server) {
      if (useMockApi) attachMockMiddleware(server)
    },
  }
}
