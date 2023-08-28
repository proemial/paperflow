
type Conversation = {
    paper: string,
    messages: Message[],
}

type Message = {
    createdAt: string,
    text: string,
    user?: string,
    replies?: Message[],
    visibility?: 'public' | undefined
}
