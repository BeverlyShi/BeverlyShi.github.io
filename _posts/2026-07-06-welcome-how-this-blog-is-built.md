---
title: "第一篇:这个博客是怎么搭起来的"
date: 2026-07-06
categories: [tech]
tags: [jekyll, 建站]
excerpt: "用 Jekyll + GitHub Pages 搭一个极简博客的全过程,以及为什么我选了这套方案。"
math: true
---

这是这个博客的第一篇文章。既然是技术博客,那就先聊聊它自己是怎么来的。

## 技术选型

我用的是 **Jekyll + GitHub Pages**,原因很简单:

- **纯静态,零成本**:GitHub Pages 免费托管,自带 HTTPS,不用自己买服务器。
- **写作即 Markdown**:新建一个 `.md` 文件就是一篇文章,专注写内容。
- **好维护**:没有数据库、没有后端,内容就是文件,想备份直接 `git clone`。

## 目录结构

```text
blog/
├── _config.yml        # 站点配置
├── _includes/         # 可复用的 HTML 片段(导航、页脚)
├── _layouts/          # 页面模板(首页、文章、普通页)
├── _sass/             # 样式(变量、布局、响应式)
├── _posts/            # 文章都放这里
├── assets/            # CSS / JS
├── index.md           # 首页
├── blog.html          # 技术文章列表
├── life.html          # 随笔列表
└── about.md           # 关于页
```

## 写一篇新文章

在 `_posts/` 下新建 `YYYY-MM-DD-标题.md`,开头写好 front matter:

```yaml
---
title: "标题"
date: 2026-07-06
categories: [tech]
tags: [标签]
excerpt: "摘要"
---
```

`categories` 写 `tech` 就会出现在 Blog 页,写 `life` 就会出现在 Life 页。

## 数学公式也支持

在 front matter 里加 `math: true`,就能写公式了,比如 $e^{i\pi} + 1 = 0$,或者独立成行的:

$$
\int_{-\infty}^{\infty} e^{-x^2} \, dx = \sqrt{\pi}
$$

就先写到这。之后这里会慢慢填上更多东西。
