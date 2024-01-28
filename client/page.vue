<script setup lang="ts">
import { computed, onActivated, onDeactivated, ref } from 'vue'
import { useContext } from '@koishijs/client'
import { useI18n } from 'vue-i18n'
import zhCN from './locales/page.zh-CN.yml'
import enUS from './locales/page.en-US.yml'
import { addPrefixes, addSuffixes, codeSnippetsJoin } from "./utils";
import { exposeNames, exposeTo, SUFFIX } from "./consts";

const ctx = useContext()

const { t, setLocaleMessage } = useI18n({
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS,
  },
})

if (import.meta.hot) {
  import.meta.hot.accept('./locales/page.zh-CN.yml', (module) => {
    setLocaleMessage('zh-CN', module.default)
  })
  import.meta.hot.accept('./locales/page.en-US.yml', (module) => {
    setLocaleMessage('en-US', module.default)
  })
}

const or1 = t('lang.or1')
const or2 = t('lang.or2')
const snippets = computed(() => addPrefixes(exposeTo + '.', addSuffixes(exposeNames, SUFFIX), false))
const introTitle = computed(() => t("intro.title", [codeSnippetsJoin([exposeTo], or1, or2)]))
const introDesc = computed(() => t("intro.description", [codeSnippetsJoin(
  snippets.value, or1, or2, 2
)]))

const provides = exposeNames
let loadFailed = ref(false)
let rollbackFailed = ref(false)

const loadingTime = 5000
const rollbackTime = 1800

const plugin = {
  apply(ctx) {
    loadFailed.value = false;
    rollbackFailed.value = false;
    ctx.on('fork', () => {
      setTimeoutEffect(ctx, () => loadFailed.value = true, loadingTime)
      setTimeoutEffect(ctx, () => rollbackFailed.value = true, loadingTime + rollbackTime)
      ctx.on('dispose', () => {
        loadFailed.value = false;
        rollbackFailed.value = false;
      })
    })
  }
}
const fork = ctx.plugin(plugin)

function setTimeoutEffect(ctx, fn: () => any, delay: number = 0) {
  ctx.effect(() => {
    let id = setTimeout(fn, delay)
    return () => clearTimeout(id)
  })
}

onActivated(() => ctx.plugin(plugin))

onDeactivated(() => fork.dispose())
</script>

<template>
  <k-layout>
    <div class="container">
      <div class="para">
        <h1>{{ t('title') }}</h1>
        <small>{{ t('description')}}</small>
      </div>
      <div class="para">
        <h2 v-html="introTitle"/>
        <div v-html="introDesc"/>
      </div>
      <div class="para">
        <h3>{{ t('exposes.title') }}</h3>
        <small>{{ t('exposes.tail-desc', [SUFFIX, t('lang.nothing')])}}</small>
        <div class="para" v-for="snippet in snippets"><code>{{ snippet }}</code></div>
      </div>
      <div class="para">
        <h3>{{ t('example-usages.title') }}</h3>
        <div v-if="!loadFailed">{{ t('coming-soon') }}</div>
        <div v-else-if="!rollbackFailed">{{ t('coming-failed', [t('example-usages.title')]) }}</div>
        <div v-else>{{ t('coming-boom') }}</div>
      </div>
    </div>
  </k-layout>
</template>

<style scoped>
.container {
  font-family: "Open Sans", "Noto Sans", sans-serif;
  padding: 0.5em;
}

.para {
  margin: 0.5em;
}
</style>


