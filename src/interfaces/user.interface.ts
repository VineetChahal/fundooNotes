export interface IUser {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    note: object;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
}