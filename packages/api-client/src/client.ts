// ============================================================================
// API CLIENT - Typed HTTP client for Adagio API
// ============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export interface ApiClientConfig {
  baseUrl?: string;
}

export class ApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ApiClient {
  private baseUrl: string;

  constructor(config: ApiClientConfig = {}) {
    this.baseUrl = config.baseUrl || API_BASE_URL;
  }

  // ------------------------------------------------------------------
  // PRIVATE METHODS
  // ------------------------------------------------------------------

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options?.headers as Record<string, string> || {}),
    };

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // Include cookies for better-auth session
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new ApiError((error as { message?: string }).message || 'API request failed', response.status);
    }

    return response.json() as Promise<T>;
  }

  // ------------------------------------------------------------------
  // GENERIC METHODS
  // ------------------------------------------------------------------

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint);
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  // ------------------------------------------------------------------
  // API ENDPOINTS (excluding auth - handled by better-auth)
  // ------------------------------------------------------------------

  // Theory endpoints
  async analyzeProgression(progression: string[]) {
    return this.post('/theory/analyze', { progression });
  }

  async getCircleOfFifths(note?: string) {
    return this.get('/theory/circle-of-fifths' + (note ? `?note=${note}` : ''));
  }

  // Library endpoints
  async getLibrary() {
    return this.get('/library');
  }

  async saveLibraryItem(item: unknown) {
    return this.post('/library/save', item);
  }

  async deleteLibraryItem(id: string) {
    return this.delete(`/library/${id}`);
  }

  // Progress endpoints
  async saveProgression(data: { progression: string[]; masteryLevel: number }) {
    return this.post('/progress/save', data);
  }

  async getProgress() {
    return this.get('/progress');
  }

  // User endpoints
  async updateProfile(data: { name?: string; preferences?: unknown }) {
    return this.patch('/users/me', data);
  }
}

// ============================================================================
// FACTORY
// ============================================================================

let apiClientInstance: ApiClient | null = null;

export function createApiClient(config?: ApiClientConfig): ApiClient {
  if (!apiClientInstance) {
    apiClientInstance = new ApiClient(config);
  }
  return apiClientInstance;
}

// Default instance
export const apiClient = createApiClient();
