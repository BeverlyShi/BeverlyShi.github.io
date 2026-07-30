source "https://rubygems.org"

# GitHub Pages 用这个 gem 保证本地构建与线上一致
gem "github-pages", group: :jekyll_plugins

# 本地预览用到的插件
group :jekyll_plugins do
  gem "jekyll-seo-tag"
  gem "jekyll-feed"
end

# Windows / 部分环境需要
gem "webrick", "~> 1.7"

# Ruby 3.4+ 把这些从默认标准库移出，Jekyll 3.x 本地构建需要显式声明
gem "csv"
gem "base64"
gem "bigdecimal"

# 锁定较新的兼容依赖
gem "tzinfo-data", platforms: [:mingw, :mswin, :x64_mingw, :jruby]
