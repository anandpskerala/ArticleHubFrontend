export interface User {
    id: string
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dob: Date;
    password: string;
    interests: string[];
    createdAt: Date;
    updatedAt: Date;
}

export interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    interests: string[]
}