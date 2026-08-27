import {
  Game,
  Nominal,
  Transaction,
  PaymentMethod,
  User,
  Deposit,
  BalanceMutation,
  StandardResponse,
  CheckNicknameResponse,
  CreateOrderPayload
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// Safe Token Storage Helper
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('topup_token');
}

export function setToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('topup_token', token);
  }
}

export function removeToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('topup_token');
  }
}

// Input Sanitization for Security (XSS Prevention & clean inputs)
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

// Custom Fetch Wrapper
async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<StandardResponse<T>> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const json = await res.json();

    if (res.status === 401) {
      // Clear token if unauthorized on auth-required endpoints
      if (endpoint.includes('/member') || endpoint.includes('/auth/me')) {
        removeToken();
      }
    }

    if (!res.ok) {
      return {
        success: false,
        message: json.message || `Error ${res.status}: Failed request`,
        errors: json.errors || json,
      };
    }

    return json;
  } catch (err: any) {
    console.error(`[API Error] ${endpoint}:`, err);
    return {
      success: false,
      message: err.message || 'Koneksi ke server gagal. Pastikan backend server Golang berjalan.',
    };
  }
}

/* ============================================================================
   PUBLIC ENDPOINTS
   ============================================================================ */

export async function fetchPublicGames(): Promise<Game[]> {
  const res = await fetchAPI<Game[]>('/games');
  return res.success && Array.isArray(res.data) ? res.data : [];
}

export async function fetchGameBySlug(slug: string): Promise<Game | null> {
  const sanitizedSlug = encodeURIComponent(slug.trim());
  const res = await fetchAPI<Game>(`/games/${sanitizedSlug}`);
  return res.success && res.data ? res.data : null;
}

export async function fetchNominalsByGame(gameId: number): Promise<Nominal[]> {
  const res = await fetchAPI<Nominal[]>(`/games/id/${gameId}/nominals`);
  return res.success && Array.isArray(res.data) ? res.data : [];
}

export async function checkNickname(
  gameCode: string,
  userId: string,
  serverId?: string
): Promise<{ success: boolean; nickname?: string; message?: string }> {
  const payload = {
    game_code: sanitizeInput(gameCode),
    user_id: sanitizeInput(userId),
    server_id: serverId ? sanitizeInput(serverId) : '',
  };

  const res = await fetchAPI<CheckNicknameResponse | { nickname?: string }>('/games/check-nickname', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (res.success && res.data) {
    const nick = (res.data as any).nickname || (res.data as any).data || '';
    return { success: true, nickname: nick };
  }

  return {
    success: false,
    message: res.message || 'ID Game atau Server ID tidak ditemukan.',
  };
}

export async function fetchPaymentMethods(): Promise<PaymentMethod[]> {
  const res = await fetchAPI<PaymentMethod[]>('/payment-methods');
  return res.success && Array.isArray(res.data) ? res.data : [];
}

export async function fetchRecentTransactions(): Promise<any[]> {
  const res = await fetchAPI<any[]>('/transactions/recent?limit=15');
  return res.success && Array.isArray(res.data) ? res.data : [];
}

export async function fetchTransactionByInvoice(invoice: string): Promise<Transaction | null> {
  const sanitizedInvoice = encodeURIComponent(invoice.trim());
  const res = await fetchAPI<Transaction>(`/transactions/${sanitizedInvoice}`);
  return res.success && res.data ? res.data : null;
}

export async function createTransactionOrder(payload: CreateOrderPayload): Promise<StandardResponse<Transaction>> {
  const safePayload = {
    ...payload,
    customer_id: sanitizeInput(payload.customer_id),
    server_id: payload.server_id ? sanitizeInput(payload.server_id) : '',
    customer_phone: payload.customer_phone ? sanitizeInput(payload.customer_phone) : '',
    customer_email: payload.customer_email ? sanitizeInput(payload.customer_email) : '',
    nickname: payload.nickname ? sanitizeInput(payload.nickname) : '',
  };

  return fetchAPI<Transaction>('/transactions', {
    method: 'POST',
    body: JSON.stringify(safePayload),
  });
}

/* ============================================================================
   AUTH ENDPOINTS
   ============================================================================ */

export async function registerUser(name: string, email: string, password: string, phoneNumber?: string): Promise<StandardResponse<{ user: User; token: string }>> {
  return fetchAPI<{ user: User; token: string }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      password,
      phone_number: phoneNumber ? sanitizeInput(phoneNumber) : '',
    }),
  });
}

export async function loginUser(email: string, password: string): Promise<StandardResponse<{ user: User; token: string }>> {
  return fetchAPI<{ user: User; token: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: sanitizeInput(email),
      password,
    }),
  });
}

export async function fetchUserProfile(): Promise<User | null> {
  const res = await fetchAPI<User>('/auth/me');
  return res.success && res.data ? res.data : null;
}

export async function generateAPIKey(webhookUrl?: string): Promise<StandardResponse<string>> {
  return fetchAPI<string>('/auth/api-key', {
    method: 'POST',
    body: JSON.stringify({ webhook_url: webhookUrl ? sanitizeInput(webhookUrl) : '' }),
  });
}

/* ============================================================================
   MEMBER AUTHENTICATED ENDPOINTS
   ============================================================================ */

export async function fetchUserTransactions(page = 1, limit = 20): Promise<{ items: Transaction[]; total: number }> {
  const res = await fetchAPI<Transaction[]>(`/member/transactions?page=${page}&limit=${limit}`);
  if (res.success && Array.isArray(res.data)) {
    const total = res.meta?.total || res.data.length;
    return { items: res.data, total };
  }
  return { items: [], total: 0 };
}

export async function createMemberDeposit(amount: number, paymentMethod: string): Promise<StandardResponse<Deposit>> {
  return fetchAPI<Deposit>('/member/deposits', {
    method: 'POST',
    body: JSON.stringify({
      amount,
      payment_method: sanitizeInput(paymentMethod),
    }),
  });
}

export async function fetchUserDeposits(page = 1, limit = 20): Promise<{ items: Deposit[]; total: number }> {
  const res = await fetchAPI<Deposit[]>(`/member/deposits?page=${page}&limit=${limit}`);
  if (res.success && Array.isArray(res.data)) {
    const total = res.meta?.total || res.data.length;
    return { items: res.data, total };
  }
  return { items: [], total: 0 };
}

export async function fetchUserMutations(page = 1, limit = 20): Promise<{ items: BalanceMutation[]; total: number }> {
  const res = await fetchAPI<BalanceMutation[]>(`/member/mutations?page=${page}&limit=${limit}`);
  if (res.success && Array.isArray(res.data)) {
    const total = res.meta?.total || res.data.length;
    return { items: res.data, total };
  }
  return { items: [], total: 0 };
}
