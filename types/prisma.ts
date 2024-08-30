// types/prisma.ts
import { Prisma, PrismaClient } from '@prisma/client'

export type User = Prisma.UserGetPayload<{}>
export type MessageType = Prisma.MessageGetPayload<{}>
export type Idea = Prisma.IdeaGetPayload<{}>
export type Comment = Prisma.CommentGetPayload<{}>
export type Like = Prisma.LikeGetPayload<{}>
export type UserConnection = Prisma.UserConnectionGetPayload<{}>

export const prisma = new PrismaClient()
