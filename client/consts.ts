import { Context, send, receive } from "@koishijs/client";
import { Awaitable } from 'cosmokit'


export const g = window ?? globalThis ?? global

export const exposeTo = 'globalThis'

interface ExampleUsage {
  name: string,
  arguments: [string, string?][],
  example?: string,
  description?: string
}

export const ctxExamples = [
  { name: "ctx.emit", arguments: [['name']] },
] satisfies ExampleUsage[]

export const SUFFIX = 'client'

export type Suffix = 'Client'

export const exposeNames = [
  "ctx",
  "app",
  "send",
  "receive",
  'importer'
] as const satisfies string[]

export type exposeTypesMapping = {
  ctx: Context,
  app: Context,
  send: typeof send
  receive: typeof receive,
  importer?: (name: string) => Awaitable<any> | undefined
}
