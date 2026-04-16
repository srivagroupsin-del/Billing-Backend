export type Status = "active" | "inactive" | "blocked";

export interface Product {
  id: number;

  product_name: string;
  model?: string;
  series?: string;
  alternative_name?: string;

  mrp?: number;

  description: string;
  info: string;
  note?: string;
  system_note?: string;

  base_image: string;

  is_active: number;
  is_enabled: number;
  status: Status;

  created_at: Date;
  updated_at: Date;
}
