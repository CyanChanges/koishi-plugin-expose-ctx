import { Context, send, receive } from "@koishijs/client";
import { Awaitable } from 'cosmokit'

export const g = typeof window !== 'undefined' ? window : globalThis ?? global

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

export const exposeNames = [
  "ctx",
  "app",
  'coreExports',
  'importer',
] as const satisfies string[]

export type exposeTypesMapping = {
  ctx: Context,
  app: Context,
  coreExports: typeof import('@koishijs/core'),
  importer: (name: string) => Awaitable<any> | undefined
}
