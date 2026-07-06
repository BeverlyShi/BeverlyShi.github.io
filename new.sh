#!/usr/bin/env bash
# 一键新建文章：./new.sh "文章标题" [tech|life]
# 例：./new.sh "我的第一篇随笔" life
set -e

TITLE="${1:?用法: ./new.sh \"文章标题\" [tech|life]}"
CAT="${2:-tech}"   # 默认归到 tech（Blog 页）；写 life 归到 Life 页

DATE=$(date +%Y-%m-%d)
# 文件名里的 slug：把空格换成短横线，去掉不安全字符
SLUG=$(echo "$TITLE" | tr ' ' '-' | tr -cd 'A-Za-z0-9\-一-龥')
FILE="_posts/${DATE}-${SLUG}.md"

if [ -e "$FILE" ]; then
  echo "已存在：$FILE"; exit 1
fi

cat > "$FILE" <<EOF
---
title: "${TITLE}"
date: ${DATE}
categories: [${CAT}]
tags: []
excerpt: "在这里写一句摘要，会显示在列表页。"
math: false
---

在这里开始写正文，用 Markdown。

## 小标题

正文段落……
EOF

echo "已创建：$FILE"
echo "现在用编辑器打开它开始写吧。"
