class Response {
  name?: string;
  status: number;
  error?: string;
  message: string;
}

export class ResponsePayload {
  response?: Response;
}
