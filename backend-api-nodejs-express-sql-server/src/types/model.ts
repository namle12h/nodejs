export interface IcategoryCreate {
    category_name: string;
    description: string;
}

export interface IBrandCreate {
    brand_name: string;
    brand_description?: string;
}

export interface IProductCreate {
  product_name: string;
  price: number;
  discount?: number;
  description?: string;
  stock?: number;
  sku?: string;
  barcode?: string;
  status?: string;
  thumbnail?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  createdBy?: number | null;
  category_id: number; // rõ ràng
  brand_id: number;    // rõ ràng
  images?: { url: string }[];
}



export interface IStaffCreate {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    active: boolean;
    position: string;
    department: string;
    
}   