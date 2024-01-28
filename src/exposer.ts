import { Context } from 'koishi'
import { g, exposeNames, exposeTo, exposeTypesMapping } from "./consts";
import * as coreExports from "@koishijs/core";
import * as consoleExports from "@koishijs/console";
import { Get } from "cosmokit";

type Names = typeof exposeNames[number]
type Mapping = { [K in Names | string]: Get<exposeTypesMapping, K> | any }

export function createExposer(ctx: Context, remover: (name: string) => boolean): {
  expose<K extends Names>(exposeName: K): { [K in typeof exposeNames[number]]: exposeTypesMapping[K] }[K]
} {
  const app = ctx.root
  const effects: string[] = []

  ctx.effect(()=>()=>effects.forEach(remover))

  function expose<K extends keyof Mapping>(exposeName: K): Mapping[K] {
    effects.push(exposeName)
    switch (exposeName) {
      case 'app':
        return app
      case 'ctx':
        return ctx
      case 'importer':
        if (app['loader'])
          return (name: string) => app['loader']?.import(name)
        break
      case 'coreExports':
        return coreExports
      case 'consoleExports':
        return consoleExports
    }
  }

  return { expose }
}

export function apply(ctx: Context) {
  const root = g[exposeTo]
  const exposer = createExposer(ctx, (name: string) => delete root[name])
  for (const exposeName of exposeNames) {
    root[exposeName] = exposer.expose(exposeName)
  }
}
