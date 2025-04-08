export interface Product {
    id: string;
    category_id: number;
    title: string;
    price: number;
    description: string;
    created_at?: string;
    image: string | null;
}

export type ProductWithoutId = Omit<Product, 'id'>;

export interface Category {
    id: string;
    title: string;
    description: string;
}