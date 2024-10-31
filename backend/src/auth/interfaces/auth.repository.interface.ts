import { User, UserDocument } from "../../schemas/user.schema";
import { UserData } from "../dto/auth.dto";

export interface IAuthRepository {
    findByEmail(email: string): Promise<UserDocument | null>;
    findById(id: string): Promise<UserDocument | null>;
    create(userData: UserData): Promise<UserDocument>;
    updateUsername(userId: string, name: string): Promise<UserDocument>;
    removeSocialProvider(userId: string, provider: string): Promise<UserDocument>;
} 