export type PaymentType = "online" | "offline" | null;

export interface IUser {
    clear(): void;
    inputValueHandler(data: IUserInfo): void;
    getUserInfo(): IUserInfo;
}

export interface IUserInfo {
    payment?: PaymentType;
    email?: string;
    phone?: string;
    address?: string;
}
