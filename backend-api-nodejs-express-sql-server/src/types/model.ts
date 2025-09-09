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
    discount: number;
    description?: string;
    model_year: number;
    stock?: number;
    slug: string;
    thumbnail?: string;
    category: number; // ID của category
    brand: number; // ID của brand
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