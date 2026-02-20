import { NextResponse } from 'next/server';

interface IResponse {
  success: boolean;
  status: number;
  message: string;
  data: object | object[] | null;
  timestamp: string;
  error: unknown | null;
}

const statusMap: Record<string, number> = {
  ok: 200,
  created: 201,
  accepted: 202,
  noContent: 204,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  conflict: 409,
  internalError: 500,
  serviceUnavailable: 503,
};

interface IApiResponse {
  [key: string]: (
    message?: string | null,
    data?: object | object[] | null,
    error?: unknown
  ) => ReturnType<typeof NextResponse.json>;
}

const response: IApiResponse = new Proxy(
  {},
  {
    get: (_, method: string) => {
      return (
        message: string | null = null,
        data: object | object[] | null = null,
        error: unknown = null
      ) => {
        const status = statusMap[method] || 500;
        const success = status < 400;

        const payload: IResponse = {
          success,
          status,
          message:
            message ||
            (success ? 'Request successful' : 'Something went wrong'),
          data: success ? data : null,
          error: !success ? error : null,
          timestamp: new Date().toISOString(),
        };

        return NextResponse.json(payload, { status });
      };
    },
  }
);

export { response };
