export interface User {
  id: number;
  user_id: string;
  name: string;
  email: string;
  details: any;
  add_json: any;
  is_active: boolean;
  is_enabled: boolean;
  status: string;
  created_at: Date;
  updated_at: Date;
}
