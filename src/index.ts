import { Context, Schema } from 'koishi'
import { resolve } from 'path'
import {} from '@koishijs/plugin-console'
import * as exposer from "./exposer";

export const name = 'expose-ctx'

export interface Config {}

export const inject = ['console']

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  ctx.console.addEntry(process.env.KOISHI_BASE ? [
    process.env.KOISHI_BASE + '/dist/index.js',
    process.env.KOISHI_BASE + '/dist/style.css',
  ] : process.env.KOISHI_ENV === 'browser' ? [
    // @ts-ignore
    import.meta.url.replace(/\/src\/[^/]+$/, '/client/index.ts'),
  ] : {
    dev: resolve(__dirname, '../client/index.ts'),
    prod: resolve(__dirname, '../dist'),
  });
  ctx.plugin(exposer)
}
