export interface Product {
    _id: string;
    category: string;
    title: string;
    price: number;
    description: string;
    image: string | null;
}

export type ProductWithoutId = Omit<Product, '_id'>;

export interface Category {
    _id: string;
    title: string;
    description: string;
}