---
layout: home
title: Home
permalink: /
---

你好,我是 **Yiyue** 👋 —— 一个 vibe coding 爱好者,喜欢用代码把脑子里的想法变成能跑起来的东西。

这个博客用来记录我在技术上的探索、做过的项目,以及一些生活里的随笔。如果你也喜欢折腾、喜欢从 0 到 1 把东西做出来的那种感觉,应该能在这儿找到一点共鸣。

## 我在做什么

- **折腾各种小项目** —— 从 AI 应用到 3D 打印,想到什么做什么。我享受的不是把一件事研究到极致,而是快速把想法做出来、看着它跑起来的那个瞬间。

- **自部署模型基础设施** —— 喜欢把工具握在自己手里。相比于直接调云端 API,我更愿意花时间研究怎么让本地/自托管的模型跑得更顺、更好用。

- **用 vibe coding 的方式做东西** —— 让思考的粒度变粗:少纠结某一行怎么写,多想想"我到底想要什么、这个方向对不对"。工具越强,想清楚要做什么就越重要。

- **把过程写下来** —— 踩过的坑、想明白的事,记下来既是给自己复盘,也希望对路过的人有点用。

## 最近在折腾

<div class="experience-list">
  <div class="experience-item">
    <div class="experience-details">
      <div class="experience-title">🚀 这个博客</div>
      <div class="experience-subtitle">Jekyll + GitHub Pages,极简、免费、纯静态,内容即文件</div>
      <div class="experience-date">2026 · 进行中</div>
    </div>
  </div>
  <div class="experience-item">
    <div class="experience-details">
      <div class="experience-title">🧩 3D 打印小玩意</div>
      <div class="experience-subtitle">做点触觉小物件,用来在写代码时消耗手、避免刷手机走神</div>
      <div class="experience-date">设计中</div>
    </div>
  </div>
  <div class="experience-item">
    <div class="experience-details">
      <div class="experience-title">🤖 自部署模型实验台</div>
      <div class="experience-subtitle">测不同模型在实际任务里的表现,攒一套顺手的本地工作流</div>
      <div class="experience-date">持续折腾</div>
    </div>
  </div>
</div>

## 一点小信念

> 刷了太多信息流之后,人会越来越难把一个想法完整地想完。写东西是一种反向的动作 —— 它逼你把模糊的感觉,一点点拉扯成能读的文字。这个过程本身,比结果更有价值。

## 最近写的

<div class="home-recent">
  {% for post in site.posts limit: 5 %}
  <div class="blog-post-card">
    <h3 class="blog-post-card-title">
      <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
    </h3>
    <div class="blog-post-card-meta">
      <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%Y年%-m月%-d日" }}</time>
      {% if post.categories %}<span class="tag-badge">{{ post.categories | first }}</span>{% endif %}
    </div>
    {% if post.excerpt %}
    <p class="blog-post-card-excerpt">{{ post.excerpt | strip_html | truncatewords: 30 }}</p>
    {% endif %}
  </div>
  {% endfor %}
</div>

<p style="margin-top:1rem">
  <a href="{{ '/blog' | relative_url }}">全部技术文章 →</a>&nbsp;&nbsp;
  <a href="{{ '/life' | relative_url }}">全部随笔 →</a>
</p>

## 📫 联系我

- Email: your-email[@]example.com
- GitHub: [@BeverlyShi](https://github.com/BeverlyShi)

<p style="color:var(--muted,#6b7280);font-size:0.9rem;margin-top:0.5rem"><em>（上面的邮箱是占位的,告诉我你想公开哪个,我帮你换上。）</em></p>
