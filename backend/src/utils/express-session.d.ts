
import 'express-session';
import { UserDocument } from './schemas/user.schema';

declare module 'express' {
    interface Request {
        session: session.Session & Partial<session.SessionData>;
        user?: any;
    }
}
