export function getEnv(env, Astro, name) {
  const value = env[name] ?? Astro.locals?.runtime?.env?.[name]
  
  // 处理 TEXT_FIRST 变量
  if (name === 'TEXT_FIRST') {
    const canReadTextFirst = value !== undefined && value !== null
    
    // 如果读取不到，默认为 false
    if (!canReadTextFirst) {
      return 'false'
    } else {
      // 确保返回字符串格式，便于后续 === 'true' 比较
      return String(value).toLowerCase() === 'true' ? 'true' : 'false'
    }
  }
  
  // 处理 HEALTH_INFO 变量
  if (name === 'HEALTH_INFO') {
    const canReadHealthInfo = value !== undefined && value !== null
    
    // 如果读取不到，默认为 false
    if (!canReadHealthInfo) {
      return 'false'
    } else {
      // 确保返回字符串格式，便于后续 === 'true' 比较
      return String(value).toLowerCase() === 'true' ? 'true' : 'false'
    }
  }
  
  return value
}
