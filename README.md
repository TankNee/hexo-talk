# Hexo Talk

> Hexo 博客 talk 页面生成插件。

目前支持以下 talk 来源

-   Flomo（无需会员，仅需要 cookie）

---

## 为你的私人博客增添一分生气

六月初还在学校的里的时候，闲来无事，又把荒废了好久的博客支棱起来，找了半天往年的存文，但是有几篇文章还是找不到，也罢，旧的不去新的不来。在翻阅博客的源文件废墟的时候，找到了一个**说说**插件，大致原理就是模拟 QQ 空间的说说，通过时间流发布一些博主的屁话，另外还有点赞之类的小功能。这跟我之前用的一个 typecho 博客有点像，它也提供了一个说说页面，允许用户通过 Flomo，微博（待开发）之类的平台同步数据，将一段文字转为一张卡片，并在博客中展示。

1.0.0 版本的效果如下。

![image-20220716092304183](https://img.tanknee.cn/blogpicbed/2022/07/16/22071662d212f9dbf49.png/webp)

具体效果可以前往[我的博客](https://www.tanknee.cn/talk/)浏览。

说说的数据是在运行`hexo g`指令的时候生成的，所以在部署之后并不会请求新的数据，也就不会有登录信息过期之类的问题，相对而言比较稳定。

当然，这么设计的缺陷也显而易见，两次博客部署之间的那段时间，你在 Flomo 等平台上发布的新数据无法及时同步到你的博客页面，有一定的滞后，因此我的建议是使用 Github Actions 每天定时运行博客部署指令，这样就能相对及时的更新数据，且不妨碍 Flomo 等小平台的运行。

## 部署

hexo-talk 是一个 hexo 博客框架的插件，你可以通过 npm 指令快速将其插入到你的博客源代码中：

```bash
npm i hexo-talk
```

安装完成之后你需要在博客根目录下的 `source` 文件夹中新建一个 `talk` 文件夹，然后再在里面创建一个名为 `index.md` 的文件，最后在这个文件中填入：

```yaml
---
title: Talk
date: 2022-07-14 13:36:00
type: talk
---
```

其中日期请改为你当前的日期。要注意，这里的 type 必需指定为 talk，否则 hexo 系统无法进行正确的渲染。

## 配置

在安装好插件，并新建好对应的页面之后，你必须在博客的 `_config.yml` 中添加对应的配置字段。

```yaml
  enable: true 	# 是否启用本插件
  type: flomo		# 说说的数据来源，暂时（1.0.0）只有 flomo 一个选项
  title: Talk		# 页面 title
  theme: Paper	# 设置说说主题，暂时（1.0.0）只有 Paper 这一个选项。
  flomo:
    cookie: 		# 必填项，用于获取 flomo 数据。
    tag:				# 展示哪个标签下的数据
    limit: 30		# 展示多少条说说
```

flomo 的 cookie 请通过旧版页面获取：https://flomoapp.com/，请不要使用新版的 flomo，否则会出现无法获取数据的问题。

登录 flomo 之后打开浏览器的控制台，点击网络标签：

![image-20220716094156583](https://img.tanknee.cn/blogpicbed/2022/07/16/22071662d2176528991.png/webp)

然后再刷新页面，此时右侧的控制台中会出现大量的请求，选择一个 flomo 域名的请求，然后复制其中的 cookie 即可。

![image-20220716094321608](https://img.tanknee.cn/blogpicbed/2022/07/16/22071662d217ba9adbf.png/webp)

## 错误处理

请将您遇到的错误信息发到仓库的 [issue](https://github.com/TankNee/hexo-talk/issues) 区。
