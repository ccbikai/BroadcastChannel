# Vercel 部署配置指南

## 问题解决

### TEXT_FIRST 环境变量配置

如果您在 Vercel 部署后发现文本内容仍然显示在媒体下方，请按照以下步骤检查和配置：

#### 1. 环境变量设置

在 Vercel 项目设置中，确保正确设置以下环境变量：

```
TEXT_FIRST=true
```

**重要提示：**
- 值必须是字符串 `true`（小写）
- 不要使用布尔值 `true`
- 不要使用数字 `1` 或 `0`
- 不要使用 `yes` 或 `no`

#### 2. 支持的值

| 输入值 | 转换结果 | 效果 |
|--------|----------|------|
| `true` | `true` | 文本在媒体上方 |
| `TRUE` | `true` | 文本在媒体上方 |
| `True` | `true` | 文本在媒体上方 |
| `false` | `false` | 媒体在文本上方 |
| `FALSE` | `false` | 媒体在文本上方 |
| `False` | `false` | 媒体在文本上方 |
| 其他任何值 | `false` | 媒体在文本上方 |
| 未设置 | `true` | 文本在媒体上方（默认值）|

#### 3. 验证步骤

1. **本地测试**：
   ```bash
   npm run dev
   ```
   访问 `http://localhost:4321/test-text-first` 查看测试结果

2. **检查浏览器控制台**：
   - 打开开发者工具
   - 查看控制台中的 `TEXT_FIRST 变量读取状态` 日志
   - 确认变量值和最终使用值

3. **Vercel 部署验证**：
   - 部署到 Vercel 后访问您的网站
   - 检查浏览器控制台中的日志
   - 确认文本内容显示位置

#### 4. 常见问题

**Q: 为什么设置了 `TEXT_FIRST=true` 但文本还是在下面？**

A: 请检查以下几点：
1. 确保在 Vercel 环境变量中设置的是字符串 `true`
2. 重新部署项目以应用新的环境变量
3. 清除浏览器缓存
4. 检查浏览器控制台中的日志信息

**Q: 如何确认环境变量是否正确读取？**

A: 查看浏览器控制台，应该看到类似以下的日志：
```
TEXT_FIRST 变量读取状态: 成功
TEXT_FIRST 变量值: true
TEXT_FIRST 最终使用值: true (原始值: true)
```

#### 5. 技术实现

代码中的处理逻辑：
```javascript
// 确保返回字符串格式，便于后续 === 'true' 比较
finalValue = String(value).toLowerCase() === 'true' ? 'true' : 'false'

// 在 getPost 函数中的使用
const textFirst = getEnv(import.meta.env, Astro, 'TEXT_FIRST') === 'true'
```

这确保了无论输入什么格式的 `true`，都能正确转换为字符串 `'true'` 并被正确识别。

## 其他必需的环境变量

```
CHANNEL=your_telegram_channel_name
TELEGRAM_HOST=t.me
STATIC_PROXY=/static/
```

## 部署后验证清单

- [ ] 环境变量已正确设置
- [ ] 项目已重新部署
- [ ] 浏览器控制台显示正确的日志
- [ ] 文本内容显示在预期位置
- [ ] 测试页面 `/test-text-first` 显示正确结果