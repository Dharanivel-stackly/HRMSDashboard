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

async function handleMockApiRequest(
  server: ViteServer,
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void
) {
  try {
    if (!req.url || !req.method) {
      next()
      return
    }

    const url = new URL(req.url, 'http://localhost')
    if (!url.pathname.startsWith('/api/')) {
      next()
      return
    }

    const routePath = url.pathname.replace(/^\/api/, '') || '/'
    const isMockRoute =
      routePath.startsWith('/attendance') ||
      routePath.startsWith('/users') ||
      routePath.startsWith('/auth')
    if (!isMockRoute) {
      next()
      return
    }

    const { executeMockApiRequest } = await server.ssrLoadModule('/src/lib/mock/mockApiRouter.ts')

    const query = Object.fromEntries(url.searchParams.entries())
    const body = req.method === 'GET' || req.method === 'HEAD' ? undefined : await readJsonBody(req)

    const mockResponse = await executeMockApiRequest({
      method: req.method,
      path: routePath,
      query,
      body,
      headers: {
        authorization: req.headers.authorization ?? '',
      },
    })

    if (mockResponse.status === 404) {
      next()
      return
    }

    sendJson(res, mockResponse.status, mockResponse.body)
  } catch (error) {
    console.error('[mock-api] request failed:', error)
    sendJson(res, 500, { success: false, message: 'Mock API handler failed' })
  }
}

function attachMockMiddleware(server: ViteServer) {
  server.middlewares.use((req, res, next) => {
    void handleMockApiRequest(server, req, res, next)
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
      if (!useMockApi) return
      attachMockMiddleware(server)
    },
    configurePreviewServer(server) {
      if (!useMockApi) return
      attachMockMiddleware(server)
    },
  }
}
