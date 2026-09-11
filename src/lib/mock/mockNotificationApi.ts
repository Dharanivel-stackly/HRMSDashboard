import type { MockHttpRequest, MockHttpResponse } from './mockApi'
import { mockNotificationService } from './mockNotificationService'

export async function executeNotificationMockRequest(
  request: MockHttpRequest
): Promise<MockHttpResponse> {
  if (request.method === 'GET' && request.path === '/notifications') {
    return {
      status: 200,
      body: {
        success: true,
        data: await mockNotificationService.getNotifications(),
        message: 'Notifications fetched successfully',
      },
    }
  }

  if (
    request.method === 'PATCH' &&
    request.path === '/notifications/read-all'
  ) {
    await mockNotificationService.markAllAsRead()

    return {
      status: 200,
      body: {
        success: true,
        data: null,
        message: 'Notifications marked as read',
      },
    }
  }

  return {
    status: 404,
    body: {
      success: false,
      message: `Route not found: ${request.method} ${request.path}`,
    },
  }
}