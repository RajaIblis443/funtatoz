export interface User{
    id: Number,
    username: string,
    password: string,
    createdAt: Date | String
}

export interface UserRequest{
    username: string,
    password: string
}