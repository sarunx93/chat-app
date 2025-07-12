export type ImageFileType = {
  file: File | null
  url: string
}


export type UserType = {
  avatar: string,
  blocked: string[],
  email:string,
  id: string,
  username: string
}

export type ChatType = {
  chatId: string,
  isSeen: boolean,
  lastMessage: string,
  receiverId: string,
  updatedAt: number
  user: UserType
}