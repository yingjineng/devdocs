# 维护者指南

本文档面向 [DevDocs 维护者](#list-of-maintainers)。

## 合并拉取请求

- PR（拉取请求）在合并前应至少获得一位维护者的批准。

- 添加或更新文档的 PR 应始终在本地构建和测试，并在 GitHub 上合并 PR 之前，通过 `thor docs:upload` 命令上传文档文件。

  该工作流程是必需的，因为本地和生产环境之间存在依赖关系。`thor docs:download` 命令会从生产环境下载由 `thor docs:upload` 命令上传的文档文件。如果在文件上传到生产环境之前，添加新文档的 PR 被合并并推送到 GitHub，则 `thor docs:download` 将无法下载新文档，Docker 容器也无法正确构建，直到新文档被部署到生产环境。

## 更新文档

更新文档的流程如下：

- 按照 [CONTRIBUTING.md#updating-existing-documentations](../.github/CONTRIBUTING.md#updating-existing-documentations) 中的检查清单操作。
- 提交更改（小提示：可使用下文介绍的 `thor docs:commit` 命令）。
- 可选：进行更多更新。
- 运行 `thor docs:upload`（见下文说明）。
- 推送到 GitHub 以 [部署应用](#deploying-devdocs)，并验证生产环境一切正常。
- 运行 `thor docs:clean`（见下文说明）。

注意：`public/docs/docs.json` 文件的更改不应被提交。该文件仅反映本地已下载或生成的文档，新的 `git clone` 环境下该文件应为空。

## 环境配置要求

要部署 DevDocs，你需要：

- 获得 Heroku 访问权限，在你的电脑上 [配置 Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)，并熟悉 Heroku 的 UI 和 CLI，以及 New Relic（可通过 [Heroku 控制台](https://dashboard.heroku.com/apps/devdocs) 访问）。
- 获得 DevDocs 的 [Sentry 实例](https://sentry.io/devdocs/devdocs-js/) 访问权限（用于 JS 错误追踪），并熟悉其界面。
- 获得 DevDocs 的 S3 凭证，并安装（macOS 下可用 `brew install awscli`）和 [配置](https://docs.aws.amazon.com/cli/latest/reference/configure/) AWS CLI。配置时需添加名为 "devdocs" 的配置文件：

  ```
  aws configure --profile devdocs
  ```

## Thor 命令

除了 [公开文档中的命令](https://github.com/freeCodeCamp/devdocs#available-commands) 外，以下命令面向 DevDocs 维护者：

- `thor docs:package`

  为一个或多个文档生成包。这些包将由维护者通过 `thor docs:upload` 命令上传到 DevDocs 的 S3 bundle 区域，用户可通过 `thor docs:download` 命令下载。

  可指定版本，例如：`thor docs:package rails@5.2 node@10\ LTS`。

  也可在抓取过程中通过 `thor docs:generate` 命令加上 `--package` 选项自动生成包。

- `thor docs:upload`

  此命令执行两项操作：

  1. 将指定文档的文件与 S3 同步（供 Heroku 应用使用）；
  2. 将文档包上传到 DevDocs 的 S3 bundle 区域（供 `thor docs:download` 命令使用）。

  运行此命令前，需按上述方式配置好 AWS CLI。

  **重要提示：** 此命令运行结束后应立即部署应用。除非你已准备好部署 DevDocs，否则不要运行此命令。

  若要上传本地所有已打包的文档，可运行 `thor docs:upload --packaged`。
  若想测试配置和命令效果但不实际上传，可加 `--dryrun` 选项。

- `thor docs:commit`

  更新文档后，为指定文档创建 Git 提交的快捷命令。会提交爬虫和 `assets/` 文件的更改，提交信息会包含文档更新到的最新版本。如果有文件遗漏，可用 `git commit --amend` 补充。该命令可在运行 `thor docs:upload` 前执行，但在文件上传和应用部署前，不应推送到 GitHub。

- `thor docs:clean`

  上传包文件后（通过 `thor docs:upload`），可用此命令删除所有包文件。

## 部署 DevDocs

文档通过 `thor docs:upload` 上传后（如适用），你可以推送到 DevDocs 主分支（或合并包含更新的 PR）。这会触发 GitHub Action，首先运行测试，测试通过后会自动部署 Heroku 应用。

- 若部署文档更新，部署完成后请验证文档是否正常。注意需等待几秒钟让 Service Worker 缓存新资源。缓存完成后会出现 "DevDocs has been updated" 通知，刷新页面即可看到更改。
- 若部署前端更改，部署完成后请在 [Sentry](https://sentry.io/devdocs/devdocs-js/) 监控新的 JS 错误。
- 若部署服务端更改，部署完成后请在 New Relic（可通过 [Heroku 控制台](https://dashboard.heroku.com/apps/devdocs) 访问）监控 Ruby 异常及吞吐量或响应时间变化。

如遇问题，可运行 `heroku rollback` 回滚到上一个版本（也可通过 Heroku UI 操作）。注意，这不会回滚通过 `thor docs:upload` 上传的文档文件。请尽快修复问题并重新部署。如需帮助请联系其他维护者。

首次部署时，请确保有其他维护者协助。

## 基础设施

打包文档可通过 downloads.devdocs.io 获取，文档本身可通过 documents.devdocs.io 获取。下载和文档请求会被代理到 S3 存储桶 devdocs-downloads.s3.amazonaws.com 和 devdocs-documents.s3.amazonaws.com。

新建代理 VM 时，应从 `devdocs-proxy` 快照创建。在加入负载均衡器前，需将其 IP 地址添加到两个存储桶的 aws:SourceIp 列表，否则请求会被拒绝。

若新建代理 VM 时没有 `devdocs-proxy` 快照，则应按如下方式配置新 VM：

```bash
# 需要至少 nginx 1.19.x
wget https://nginx.org/keys/nginx_signing.key
apt-key add nginx_signing.key
echo 'deb https://nginx.org/packages/mainline/ubuntu/ focal nginx' >> /etc/apt/sources.list
echo 'deb-src https://nginx.org/packages/mainline/ubuntu/ focal nginx' >> /etc/apt/sources.list
apt-get -y remove nginx-common
apt-get -y update
apt-get -y install nginx

# 配置文件在 github 上
rm -rf /etc/nginx/*
rm -rf /etc/nginx/.* 2> /dev/null
git clone https://github.com/freeCodeCamp/devdocs-nginx-config.git /etc/nginx

# 此时需从 Cloudflare 添加证书并测试配置
nginx -t

# 如果 nginx 已在运行
# ps aux | grep nginx
# 找到进程号并 kill 掉

nginx
```

## 维护者名单（按字母顺序）

以下人员（曾）维护 DevDocs：

- [Ahmad Abdolsaheb](https://github.com/ahmadabdolsaheb)
- [Bryan Hernández](https://github.com/MasterEnoc)
- [Jasper van Merle](https://github.com/jmerle)
- [Jed Fox](https://github.com/j-f1)
- [Mrugesh Mohapatra](https://github.com/raisedadead)
- [Oliver Eyton-Williams](https://github.com/ojeytonwilliams)
- [Simon Legner](https://github.com/simon04)
- [Thibaut Courouble](https://github.com/thibaut)

如需联系，请 @[@freeCodeCamp/devdocs](https://github.com/orgs/freeCodeCamp/teams/devdocs)。

有兴趣帮助维护 DevDocs？欢迎加入我们的 [Discord](https://discord.gg/PRyKn3Vbay) :)

此外，感谢 [这些优秀贡献者](https://github.com/freeCodeCamp/devdocs/graphs/contributors) 的重要贡献。
