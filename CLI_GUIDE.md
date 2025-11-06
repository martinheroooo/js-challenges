# JS Challenges CLI 使用指南

## 🚀 快速开始

### 安装依赖

```bash
# 安装项目依赖
npm install

# 或使用 pnpm
pnpm install
```

### 基本命令

```bash
# 查看所有可用命令
npm run cli --help

# 查看题目列表
npm run cli list

# 查看题目统计
npm run cli stats
```

## 📚 完整做题流程

### 1. 查看题目列表

```bash
# 列出所有题目
npm run cli list

# 按难度筛选
npm run cli list -d easy     # 简单题目
npm run cli list -d medium   # 中等题目  
npm run cli list -d hard     # 困难题目

# 按分类筛选
npm run cli list -c promise  # Promise相关题目
npm run cli list -c array    # 数组相关题目

# 按状态筛选
npm run cli list -s created  # 已创建练习的题目
npm run cli list -s pending  # 未开始的题目
```

### 2. 查看题目详情

```bash
# 查看题目详细信息
npm run cli info 1

# 示例输出:
# 📋 题目信息:
# 🏷️  名称: 1-promise-all
# 📁 路径: /path/to/questions/1-promise-all
# 📝 模板: ✅
# 🧪 测试: ✅
# 💻 练习: ⭕ 未创建
```

### 3. 创建练习代码

```bash
# 创建练习代码（从模板复制）
npm run cli create 1

# 强制覆盖已存在的文件
npm run cli create 1 --force

# 示例输出:
# ✅ 练习代码已创建!
# 📁 文件位置: /path/to/playground/1-promise-all.js
# 🎯 下一步:
#    1. 编辑代码: /path/to/playground/1-promise-all.js
#    2. 运行测试: npm run cli test 1
#    3. 监听测试: npm run cli test 1 --watch
```

### 4. 编写解决方案

在 `playground/` 目录下找到对应的文件，编写你的解决方案：

```javascript
// playground/1-promise-all.js
export default function (MyPromise) {
    MyPromise.all = function (promises) {
        // 在这里实现 Promise.all
        return new MyPromise((resolve, reject) => {
            // 你的实现代码
        });
    }
}
```

### 5. 运行测试

```bash
# 运行单次测试
npm run cli test 1

# 监听模式（代码变化时自动重新测试）
npm run cli test 1 --watch

# 示例输出:
# 🧪 运行测试: 1-promise-all
# 📁 测试文件: /path/to/.cache/1-promise-all.test.js
# 
# ✓ should return -1 when the value is not present
# ✓ should take less than 500ms
# 
# Test Files  1 passed (1)
# Tests  2 passed (2)
```

## 🛠️ 高级功能

### 创建新题目

```bash
# 创建新题目
npm run cli new "my-new-problem"

# 指定分类和难度
npm run cli new "array-sum" -c array -d easy

# 示例输出:
# ✅ 新题目模板已创建!
# 📁 位置: /path/to/questions/my-new-problem
# 📝 请编辑以下文件:
#    📖 题目描述: questions/my-new-problem/README.md
#    📄 代码模板: questions/my-new-problem/template.js
#    🧪 测试用例: questions/my-new-problem/test.js
```

### 验证题目结构

```bash
# 验证单个题目
npm run cli validate 1

# 验证所有题目
npm run cli validate

# 示例输出:
# ✅ 1-promise-all
# ✅ 2-array-flat
# ❌ 3-broken-problem
# 
# ❌ 部分题目结构验证失败!
```

### 查看统计信息

```bash
npm run cli stats

# 示例输出:
# 📊 JS Challenges 统计信息
# 
# 📚 总题目数: 100
# ✅ 已创建练习: 25
# ⭕ 待开始: 75
# 📈 完成进度: 25%
# 
# 🎯 难度分布:
#    🟢 简单: 30 题
#    🟡 中等: 50 题
#    🔴 困难: 20 题
# 
# 🔥 推荐题目:
#    1. ⭕ 1-promise-all
#    2. ✅ 2-array-flat
#    3. ⭕ 3-deep-clone
```

### 清理文件

```bash
# 清理缓存文件
npm run cli clean --cache

# 清理所有生成文件（包括练习代码）
npm run cli clean --all
```

## 📁 项目结构

```
js-challenges/
├── questions/              # 题目目录
│   ├── 1-promise-all/
│   │   ├── README.md      # 题目描述
│   │   ├── template.js    # 代码模板
│   │   └── test.js        # 测试用例
│   └── ...
├── playground/            # 练习代码目录
│   ├── 1-promise-all.js  # 你的解决方案
│   └── ...
├── .cache/               # 临时测试文件
├── lib/                  # CLI工具代码
└── package.json
```

## 🎯 最佳实践

### 1. 循序渐进
- 从简单题目开始：`npm run cli list -d easy`
- 逐步挑战中等和困难题目

### 2. 使用监听模式
```bash
# 开启监听模式，边写边测试
npm run cli test 1 --watch
```

### 3. 查看题目详情
```bash
# 做题前先了解题目要求
npm run cli info 1
```

### 4. 定期查看进度
```bash
# 查看整体进度
npm run cli stats
```

## 🔧 故障排除

### 常见问题

1. **题目不存在**
   ```bash
   ❌ 题目 "999" 不存在。请使用 'list' 命令查看所有可用题目。
   ```
   解决：使用 `npm run cli list` 查看可用题目

2. **练习代码未创建**
   ```bash
   ❌ 请先创建练习代码:
      npm run cli create 1
   ```
   解决：先运行 `npm run cli create <id>` 创建练习代码

3. **测试执行失败**
   - 检查代码语法是否正确
   - 确保导出格式符合要求
   - 查看测试用例了解期望的输入输出

### 获取帮助

```bash
# 查看命令帮助
npm run cli --help
npm run cli <command> --help

# 查看题目详情
npm run cli info <id>
```

## 🎉 完成题目后

1. **提交代码**：将你的解决方案提交到版本控制
2. **分享经验**：在项目 Issues 中分享你的解题思路
3. **挑战更多**：继续挑战其他题目

祝你刷题愉快！🚀