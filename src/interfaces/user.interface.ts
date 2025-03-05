export interface User {
    token: string,
    record: {
        id: string,
        username: string,
        name: string,
        email: string,
        avatar: string,
    }
}