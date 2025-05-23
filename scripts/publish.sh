#!/bin/sh

set -e

# 自动生成
pnpm gen

# 进入包目录
cd packages/docs-aid-editor

# 自动升级版本号，默认是 patch（可以用 minor 或 major）
npm version patch --no-git-tag-version

# 回到原目录
npm publish
cd -


echo "✅ Publish completed"