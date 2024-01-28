import * as clientExports from '@koishijs/client'
import { Context, send, receive, root, loading, message } from "@koishijs/client";
import { Get } from 'cosmokit'
import { g, exposeNames, exposeTo, exposeTypesMapping, Suffix, SUFFIX } from "./consts";
import { addSuffix } from "./utils";

type addSuffixTo<T, P extends string> = {
  [K in keyof T as K extends string ? `${K}${P}` : never]: T[K]
}

type Suffixed = addSuffixTo<{ [K in typeof exposeNames[number]]: exposeTypesMapping[K] }, Suffix>

declare global {
  type global = typeof globalThis & { [K in keyof Suffixed]: Suffixed[K] }
}

type Names = typeof exposeNames[number]
type Mapping = { [K in Names | string]: Get<exposeTypesMapping, K> | any }

export function createExposer(ctx: Context, remover: (name: string) => boolean): {
  expose<K extends Names>(exposeName: K): { [K in typeof exposeNames[number]]: exposeTypesMapping[K] }[K]
} {
  const app = root
  const effects: string[] = []

  ctx.effect(() => () => effects.forEach(remover))

  function expose<K extends keyof Mapping>(exposeName: K): Mapping[K] {
    effects.push(exposeName)
    switch (exposeName) {
      case 'app':
        return app
      case 'ctx':
        return ctx
      case 'send':
        return send
      case 'receive':
        return receive
      case 'importer':
        if (app['loader'])
          return (name: string) => app['loader']?.import(name)
        return
      case 'clientExports':
        return clientExports
    }
  }

  return { expose }
}

export default (ctx: Context) => {
  const root = g[exposeTo]
  const exposer = createExposer(
    ctx,
    (name: string) => delete root[addSuffix(SUFFIX, name)]
  )
  for (const exposeName of exposeNames) {
    root[addSuffix(SUFFIX, exposeName)] = exposer.expose(exposeName)
  }
}
