export interface IUser {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    note: Object;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
}