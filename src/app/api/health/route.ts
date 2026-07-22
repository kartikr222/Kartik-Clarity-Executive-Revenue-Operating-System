import { createSuccessResponse } from '@/lib/api';
import type { ApiResponse } from '@/types/api';

interface HealthStatus {
  status: string;
  timestamp: string;
  version: string;
}

export async function GET(): Promise<Response> {
  const health: HealthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '0.1.0',
  };

  return Response.json(createSuccessResponse(health));
}
