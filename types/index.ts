export type GameCategory = 'Games' | 'Voucher' | 'Entertainment' | 'Pulsa & PLN';

export type TransactionStatus = 'pending' | 'processing' | 'success' | 'failed' | 'refunded';

export type UserTier = 'public' | 'member' | 'vip' | 'reseller';

export interface StandardResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  meta?: any;
  errors?: any;
}

export interface GameProvider {
  id: number;
  game_id: number;
  provider_code: string;
  provider_category_id?: string;
}

export interface Nominal {
  id: number;
  game_id: number;
  provider_id: number;
  name: string;
  description?: string;
  base_price: number;
  price_public: number;
  price_member: number;
  price_vip: number;
  price_reseller: number;
  margin_percent?: number;
  margin_flat?: number;
  provider_product_code: string;
  seller_product_code?: string;
  is_active: boolean;
  sort_order: number;
}

export interface Game {
  id: number;
  name: string;
  slug: string;
  category: GameCategory;
  publisher?: string;
  description?: string;
  image_url: string;
  banner_url?: string;
  is_active: boolean;
  is_popular: boolean;
  sort_order: number;
  has_zone_id: boolean;
  user_id_label: string;
  zone_id_label: string;
  nickname_check_code?: string;
  nominals?: Nominal[];
  game_providers?: GameProvider[];
  created_at?: string;
  updated_at?: string;
}

export interface PaymentMethod {
  id: number;
  code: string;
  name: string;
  category: 'qris' | 'ewallet' | 'virtual_account' | 'retail' | 'balance';
  description?: string;
  image_url?: string;
  fee_flat: number;
  fee_percent: number;
  fixed_fee?: number;
  percent_fee?: number;
  is_active: boolean;
}

export interface Transaction {
  id: number;
  invoice_number: string;
  source: 'web' | 'h2h' | 'admin';
  user_id?: number;
  customer_id: string;
  server_id?: string;
  customer_phone?: string;
  customer_email?: string;
  nickname?: string;
  game_id: number;
  nominal_id: number;
  provider_id: number;
  base_price: number;
  selling_price: number;
  admin_fee: number;
  total_amount: number;
  profit: number;
  status: TransactionStatus;
  payment_method: string;
  payment_reference?: string;
  payment_verified_at?: string;
  checkout_url?: string;
  qr_url?: string;
  payment_instructions?: string;
  ref_id?: string;
  provider_order_id?: string;
  provider_status?: string;
  provider_message?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  game?: Game;
  nominal?: Nominal;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone_number?: string;
  balance: number;
  role: 'superadmin' | 'admin' | 'operator' | 'member' | 'reseller';
  tier: UserTier;
  api_key?: string;
  webhook_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface Deposit {
  id: number;
  invoice_number: string;
  user_id: number;
  amount: number;
  unique_code: number;
  admin_fee?: number;
  total_amount: number;
  payment_type?: 'instant' | 'manual';
  payment_method: string;
  payment_reference?: string;
  tripay_reference?: string;
  checkout_url?: string;
  qr_url?: string;
  payment_instructions?: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  notes?: string;
  created_at: string;
  user?: User;
}

export interface BalanceMutation {
  id: number;
  user_id: number;
  type: 'debit' | 'credit';
  amount: number;
  balance_before: number;
  balance_after: number;
  reference_type: string;
  reference_id: string;
  description: string;
  created_at: string;
}

export interface CheckNicknameRequest {
  game_code: string;
  user_id: string;
  server_id?: string;
}

export interface CheckNicknameResponse {
  nickname: string;
  game_code?: string;
  user_id?: string;
  server_id?: string;
}

export interface CreateOrderPayload {
  game_id: number;
  nominal_id: number;
  customer_id: string;
  server_id?: string;
  customer_phone?: string;
  customer_email?: string;
  nickname?: string;
  payment_method: string;
  user_id?: number;
}
