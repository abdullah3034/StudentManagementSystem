export interface Student {
    _id?: string;
    studentCode?: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    birthDate: string;
    age?: number;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    district: string;
    contactNumber: string;
    email?: string;
    fullName?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface StudentFormData {
    firstName: string;
    middleName?: string;
    lastName: string;
    birthDate: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    district: string;
    contactNumber: string;
    email?: string;
}
