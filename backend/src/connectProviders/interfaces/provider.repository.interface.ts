import { UserDocument } from "../../schemas/user.schema";

export interface IProviderRepository {
    findUserById(userId: string): Promise<UserDocument | null>;
    updateSocialAccessToken(userId: string, provider: string, accessToken: string): Promise<UserDocument>;
    removeSocialAccessToken(userId: string, provider: string): Promise<UserDocument>;
} 