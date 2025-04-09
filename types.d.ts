export interface Product {
    id: string;
    title: string;
    price: number;
    description: string;
    image: string | null;
}

export type ProductWithoutId = Omit<Product, 'id'>;

export interface Category {
    id: string;
    title: string;
    description: string;
}