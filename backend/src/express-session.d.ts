
import 'express-session';

declare module 'express-session' {
    interface Session {
        user: { email: string, id: string }; // Adjust this according to your session structure
    }

    interface SessionData {
        user?: { email: string, id: string }; // Adjust this according to your session structure
    }
}

declare module 'express' {
    interface Request {
        session: session.Session & Partial<session.SessionData>;
    }
}
