---
title: "为什么我又想写博客了"
date: 2026-05-30
categories: [life]
tags: [随笔, 写作]
excerpt: "一篇中英双语的随笔 —— 顺便演示一下这个博客的语言切换功能。"
math: false
---

<div class="lang-switcher">
  <button class="lang-btn active" data-lang="zh">中文</button>
  <button class="lang-btn" data-lang="en">English</button>
</div>

<div class="lang-content" lang="zh" markdown="1">

刷了太多信息流之后,我发现自己越来越难把一个想法完整地想完。碎片进来,碎片出去,什么都没留下。

写博客是一种反向的动作。它逼你把一个模糊的感觉,一点点拉扯成一段能读的文字。这个过程本身,比写出来的结果更有价值。

所以又开了这个博客。不为别的,就为了给自己留一个能慢下来、把事情想清楚的地方。

</div>

<div class="lang-content" lang="en" style="display:none" markdown="1">

After scrolling through too many feeds, I realized I'd lost the ability to think a thought all the way through. Fragments in, fragments out, nothing left behind.

Writing a blog is the opposite motion. It forces you to pull a vague feeling, bit by bit, into something readable. That process itself is worth more than the finished text.

So here's the blog again. For no other reason than to give myself a place to slow down and actually think things through.

</div>

<script>
  (function () {
    var btns = document.querySelectorAll('.lang-btn');
    var blocks = document.querySelectorAll('.lang-content');
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var lang = this.getAttribute('data-lang');
        btns.forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');
        blocks.forEach(function (block) {
          block.style.display = block.getAttribute('lang') === lang ? '' : 'none';
        });
      });
    });
  })();
</script>
