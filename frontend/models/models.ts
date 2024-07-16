export interface Tag {
    id: string;
    name: string;
    updatedAt?: string;
    createdAt?: string;
}

export interface User {
    isAdmin: boolean;
    email: string;
    expires: number;
    idToken: string;
}

export interface Category {
    id: string;
    name: string;
    description?: string;
    image?: string;
    updatedAt?: string;
    createdAt?: string;
}

export interface Item {
    id?: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    type?: '#ITEM';
    namesearch?: string;
    name: string;
    description?: string;
    tags?: string[];
    category?: string;
    images?: string[];
}