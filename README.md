# Yiyue's Blog

个人博客,基于 [Jekyll](https://jekyllrb.com) + [GitHub Pages](https://pages.github.com),极简学术风设计。

## 本地预览

需要 Ruby ≥ 3.0(macOS 自带的 2.6 太旧,建议用 Homebrew 装新版):

```bash
brew install ruby
# 把新版 ruby 加进 PATH(zsh):
echo 'export PATH="/opt/homebrew/opt/ruby/bin:$PATH"' >> ~/.zshrc && source ~/.zshrc

# 安装依赖并启动
cd blog
bundle install
bundle exec jekyll serve
# 浏览器打开 http://localhost:4000
```

## 部署到 GitHub Pages

1. 在 GitHub 新建一个名为 `你的用户名.github.io` 的仓库。
2. 把 `_config.yml` 里的 `url` 和 `social.github` 换成你的用户名。
3. 推送代码:

   ```bash
   cd blog
   git init
   git add -A
   git commit -m "init blog"
   git branch -M main
   git remote add origin https://github.com/你的用户名/你的用户名.github.io.git
   git push -u origin main
   ```

4. 仓库 Settings → Pages → Source 选 `main` 分支,等一两分钟即可访问 `https://你的用户名.github.io`。

## 写文章

在 `_posts/` 下新建 `YYYY-MM-DD-标题.md`:

```yaml
---
title: "标题"
date: 2026-07-06
categories: [tech]     # tech → Blog 页;life → Life 页
tags: [标签]
excerpt: "列表页摘要"
math: false            # 需要数学公式设 true
---
正文用 Markdown 写。
```

## 自定义

- **名字 / 简介 / 头像 / 社交链接**:改 `_config.yml`。
- **换头像**:把 `img/photo.svg` 换成你自己的图片,并在 `_config.yml` 的 `avatar` 里改路径。
- **配色 / 字体**:改 `_sass/_variables.scss`。
- **导航栏目**:改 `_includes/nav.html`。
