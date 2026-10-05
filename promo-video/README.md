# GameLink 宣传介绍视频

成片：`GameLink-宣传介绍.mp4`，36 秒，1280 × 720，24 fps，H.264 + AAC。包含中文配音、内嵌字幕、原创合成配乐与动态联机示意。适合项目介绍、社交分享和展示页。

另有 `GameLink-宣传介绍-男声版.mp4`（Eddy 中文男声）和 `GameLink-宣传介绍-无配音版.mp4`（保留字幕和背景配乐）。两版沿用当前成片画面，包括项目 Logo 和不含 GitHub 地址的结尾。运行 `.venv/bin/python export_variants.py` 可重新导出；需先运行 `render.py` 生成画面与配乐。

## 分镜与文案

| 时间 | 画面重点 | 配音 |
| --- | --- | --- |
| 00–06 | 一个人玩，也能一起玩 | 你的单人游戏，能不能和朋友一起玩？试试 Game Link。 |
| 06–12 | 单人到多人，三位玩家连接 | 通过接入 Game Link SDK，让你的单人游戏实现真人联机。 |
| 12–18 | SDK + 配置说明双卡片 | 一个 SDK，加一份配置说明。连接房间，接入游戏状态同步。 |
| 18–24 | 创建房间、邀请朋友 | 创建房间，邀请朋友。让真人玩家，进入同一个游戏世界。 |
| 24–30 | JavaScript / TypeScript、Godot 4、Rust | 支持 JavaScript、Godot 和 Rust。让你的游戏，多一种一起玩的方式。 |
| 30–36 | 欢迎使用，不展示 GitHub 地址 | Game Link，连接游戏，也连接玩家。欢迎使用。 |

画面是产品概念示意，不是实际游戏录屏。SDK 功能依据项目当前 README 与 sdk/README.md：游戏接入时仍需定义消息内容并实现所需状态同步。

## 文件

- `cover.png`：结尾封面。
- `storyboard.jpg`：六段分镜预览。
- `render.py`：完整可修改制作源文件，所有输出均写入本文件夹。
- `music.wav`：本地数学合成的原创背景配乐。
- `assets/gamelink-logo.png`：直接复制项目已有的 GameLink Logo，用于全程角标、品牌介绍和结尾封面。

## 重新生成

需要 macOS 的 `say`、婷婷中文语音、STHeiti 字体，以及 ffmpeg、Python 与 Pillow。

```sh
cd promo-video
python3 -m venv .venv
.venv/bin/pip install Pillow
.venv/bin/python render.py
```

修改 `render.py` 的 `scenes` 可调整标题、副标题和配音。AI 云端视频工具在本次制作时未登录，因此成片采用本地程序动效制作。

## 实际联机素材接入

将成功联机的实录按 24 fps 提取成 `captures/frames/000001.png` 等连续帧，再运行制作脚本；06–12 秒与 18–24 秒将使用前 12 秒实录。没有录制帧时仍保留原来的概念示意，不应宣称已加入联机实录。

本次修改录制已尝试两个实际坦克客户端，房间内有两位玩家，但内置浏览器持续 P2P 重连。系统同时报告 Mac 已锁定，等待解锁后使用本机浏览器继续录制。当前成片已删除结尾地址，实际联机素材尚未完成。
