import { APIRequestContext, request } from '@playwright/test';

export class APIClient {
  private context: APIRequestContext | null = null;
  private baseURL: string;
  private authToken: string | null = null;

  constructor(baseURL: string = 'http://20.188.112.117:3030') {
    this.baseURL = baseURL;
  }

  async init() {
    this.context = await request.newContext({
      baseURL: this.baseURL,
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
      },
    });
  }

  async dispose() {
    if (this.context) {
      await this.context.dispose();
    }
  }

  setAuthToken(token: string) {
    this.authToken = token;
  }

  private getHeaders(additionalHeaders?: Record<string, string>) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...additionalHeaders,
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  async get(endpoint: string, params?: Record<string, any>) {
    if (!this.context) throw new Error('API client not initialized');

    const url = params ? `${endpoint}?${new URLSearchParams(params)}` : endpoint;

    return await this.context.get(url, {
      headers: this.getHeaders(),
    });
  }

  async post(endpoint: string, data?: any, additionalHeaders?: Record<string, string>) {
    if (!this.context) throw new Error('API client not initialized');

    return await this.context.post(endpoint, {
      headers: this.getHeaders(additionalHeaders),
      data: data || {},
    });
  }

  async put(endpoint: string, data?: any) {
    if (!this.context) throw new Error('API client not initialized');

    return await this.context.put(endpoint, {
      headers: this.getHeaders(),
      data: data || {},
    });
  }

  async delete(endpoint: string) {
    if (!this.context) throw new Error('API client not initialized');

    return await this.context.delete(endpoint, {
      headers: this.getHeaders(),
    });
  }

  async login(email: string, password: string) {
    const response = await this.post('/api/auth/login', {
      grant_type: 'password',
      email,
      password,
    });

    if (response.ok()) {
      const data = await response.json();
      if (data.access_token) {
        this.setAuthToken(data.access_token);
        return data;
      }
    }

    throw new Error(`Login failed: ${response.status()} ${response.statusText()}`);
  }

  async logout() {
    this.authToken = null;
  }

  isAuthenticated(): boolean {
    return this.authToken !== null;
  }
}
