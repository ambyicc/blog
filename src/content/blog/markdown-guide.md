---
title: 写作示例：Markdown 与数学公式
description: 常用 Markdown 语法、代码块、表格和 KaTeX 公式的写法示例。
pubDate: 2026-11-15
tags: ["Markdown", "写作"]
---

这篇文章演示博客支持的常见写法，可以直接拿来做模板。

## 文本与列表

支持 **加粗**、*斜体*、~~删除线~~、`行内代码` 和 [链接](https://astro.build)。

1. 有序列表
2. 第二项
   - 嵌套无序列表
   - 另一项

> 引用块用来放结论或提示。

## 表格

| 语法 | 说明 |
| --- | --- |
| `# 标题` | 生成标题，自动进入右侧目录 |
| ` ```ts ` | 代码块，构建时高亮 |
| `$...$` | 行内数学公式 |

## 数学公式

行内公式：质能方程 $E = mc^2$，以及求和 $\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$。

块级公式：

$$
T(n) = 2T\left(\frac{n}{2}\right) + O(n) = O(n \log n)
$$

## 代码

```cpp
#include <vector>

int main() {
    std::vector<int> nums{3, 1, 2};
    // 代码块右上角有复制按钮
    return 0;
}
```

## 图片

把图片放在 `public/` 下，用根路径引用。注意部署在 `/blog/` 子路径时，路径要写完整：

```md
![示意图](/blog/images/demo.png)
```
