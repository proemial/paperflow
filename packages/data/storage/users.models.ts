
export type UserInfo = 'name' | 'nickname' | 'picture' | 'org' | 'email';
export type UserStats = 'logins' | 'questions' | 'posts' | 'comments' | 'reads';

export type User = {
    id: string,
    createdAt: string,
    updatedAt: string,
    info: {
        [key in UserInfo]?: string
    },
    stats?: {
        [key in UserStats]?: number
    },
    authorOf?: string[],
}

export type UserEventType = 'login' | 'question' | 'post' | 'comment' | 'read';

export type UserEvent = {
    event: UserEventType,
    id: string,
    info: {
        [key in UserInfo]?: string
    },
    waitlistEmail?: string,
}

export type TemporaryDummyEvent = {event: 'foo' | 'bar'};
