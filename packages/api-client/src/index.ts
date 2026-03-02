// ============================================================================
// API CLIENT - Typed HTTP client for Adagio API
// ============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = typeof window !== 'undefined'
      ? localStorage.getItem('accessToken')
      : null;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options?.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  }

  // Auth endpoints
  login(email: string, password: string) {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  register(email: string, password: string, name?: string) {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  refreshToken(refreshToken: string) {
    return this.request<{ accessToken: string; expiresIn: number }>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  // Theory endpoints
  getModes(feeling?: string) {
    const query = feeling ? `?feeling=${encodeURIComponent(feeling)}` : '';
    return this.request<{ modes: Mode[] }>(`/theory/modes${query}`);
  }

  getModeBySlug(slug: string) {
    return this.request<{ mode: Mode }>(`/theory/modes/${slug}`);
  }

  getModesForKey(key: string) {
    return this.request<{ modes: ModeWithNotes[] }>(`/theory/keys/${key}/modes`);
  }

  getScales() {
    return this.request<{ scales: Scale[] }>('/theory/scales');
  }

  getChords(root?: string, quality?: string) {
    const params = new URLSearchParams();
    if (root) params.append('root', root);
    if (quality) params.append('quality', quality);
    const query = params.toString() ? `?${params}` : '';
    return this.request<{ chords: Chord[] }>(`/theory/chords${query}`);
  }

  analyzeProgression(data: ProgressionAnalysisRequest) {
    return this.request<ProgressionAnalysis>('/theory/analyze', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  getCircleOfFifths(center?: string) {
    const query = center ? `?center=${center}` : '';
    return this.request<CircleOfFifths>(`/theory/circle-of-fifths${query}`);
  }

  getAxisTheory() {
    return this.request<AxisTheory>('/theory/axis-theory');
  }

  // User endpoints
  getProfile(token: string) {
    return this.request<User>('/users/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  updateProfile(token: string, data: Partial<User>) {
    return this.request<User>('/users/me', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
  }

  getProgressions(token: string) {
    return this.request<{ progressions: SavedProgression[] }>('/users/me/progressions', {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  saveProgression(token: string, data: SaveProgressionRequest) {
    return this.request<SavedProgression>('/users/me/progressions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
  }

  // Library endpoints
  getTechniques(category?: string, difficulty?: string) {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (difficulty) params.append('difficulty', difficulty);
    const query = params.toString() ? `?${params}` : '';
    return this.request<{ techniques: Technique[] }>(`/library/techniques${query}`);
  }

  getTechnique(id: string) {
    return this.request<Technique>(`/library/techniques/${id}`);
  }

  markAsLearned(token: string, techniqueId: string) {
    return this.request<UserProgress>(`/library/techniques/${techniqueId}/learn`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}

// Singleton instance
export const apiClient = new ApiClient();

// Export types
export type {
  Mode,
  Scale,
  Chord,
  ModeWithNotes,
  ProgressionAnalysis,
  ProgressionAnalysisRequest,
  CircleOfFifths,
  AxisTheory,
  User,
  SavedProgression,
  Technique,
  UserProgress,
  AuthResponse,
};

// Import types from @adagio/types
export type {
  NoteName,
  Interval,
  ModeName,
  ChordQuality,
  ProgressionDegree,
  ProgressionChord,
} from '@adagio/types';
