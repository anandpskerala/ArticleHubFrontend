export interface LoginDataPayload {
    emailOrPhone: string,
    password: string
}

export interface SignupDataPayload {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dob: Date;
    password: string;
    interests: string[];
}