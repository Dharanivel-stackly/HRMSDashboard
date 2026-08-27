import { RouterProvider } from 'react-router-dom'
import { router } from '@/routes/routes'
import { AppProviders } from './providers/AppProviders'

export function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  )
}
