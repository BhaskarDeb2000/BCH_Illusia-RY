export interface Profile {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    address?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface UpdateProfileDto {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    address?: string;
} 