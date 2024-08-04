export function onRequest(context, next) {
  context.locals.SITE_URL = `${import.meta.env.SITE ?? ''}${import.meta.env.BASE_URL}`
  return next()
};
