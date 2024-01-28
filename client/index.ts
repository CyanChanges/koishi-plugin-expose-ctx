import { Context } from '@koishijs/client'
import Page from './page.vue'
import exposer from "./exposer";

export default (ctx: Context) => {
  ctx.plugin(exposer)
  ctx.page({
    name: 'Expose Context',
    path: '/expose-ctx',
    component: Page,
  })
}
