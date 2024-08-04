export function getEnv(env, Astro, name) {
  return env[name] ?? Astro.locals?.runtime?.env?.[name]
}
