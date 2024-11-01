export class CustomException extends Error {
    constructor(
        public readonly message: string,
        public readonly statusCode: number,
    ) {
        super(message);
        this.name = 'CustomException';
    }
} 