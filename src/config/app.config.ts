import { environment } from './environment'

export const appConfig = {
  name: environment.appName,
  description: 'One Enterprise Cloud Platform',
  version: '1.0.0',

  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [10, 20, 50, 100],
  },

  dateFormat: 'MMM dd, yyyy',
  dateTimeFormat: 'MMM dd, yyyy HH:mm',

  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    acceptedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
    acceptedDocumentTypes: ['application/pdf', 'application/msword'],
  },
} as const
