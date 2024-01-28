export function escape(source: string, inline = false) {
  const result = source
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  return inline
    ? result.replace(/"/g, '&quot;')
    : result
}

export function i18nJoin(words: string[], or1: string, or2: string): string {
  if (words.length == 1) return words[0]
  const last = words.reverse().shift()
  const remains = words.toReversed()
  return remains.join(or1) + or2 + last
}

export function codeSnippetsJoin(codes: string[], or1: string, or2: string, maxCnt = Infinity): string {
  codes = codes.slice(0, maxCnt)
  codes = codes.map(el => '<code>' + escape(el) + '</code>')
  if (codes.length == 1) return codes[0]
  const last = codes.reverse().shift()
  const remains = codes.toReversed()
  return remains.join(or1) + or2 + last
}

export function addPrefixes<T extends string[], P extends string, R extends { [K in keyof T]: `${P}${T[K]}` }>(prefix: P, strings: string[], camelCase = true): R {
  if (camelCase)
    return strings.map(addPrefix.bind(null, prefix)) as R
  else
    return strings.map(x => prefix + x) as R
}

export function addSuffixes<T extends string[], S extends string, R extends { [K in keyof T]: `${S}${T[K]}` }>(strings: string[], suffix: S, camelCase = true): R {
  if (camelCase)
    return strings.map(addSuffix.bind(null, suffix)) as R
  else
    return strings.map(x => x + suffix) as R
}

export function addPrefix(prefix: string, str: string) {
  return prefix + str[0].toUpperCase() + str.slice(1)
}

export function addSuffix(suffix: string, str: string) {
  return str + suffix[0].toUpperCase() + suffix.slice(1)
}

