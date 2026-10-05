# 内置直播源核查

核查时间：2026-10-04。发现来源： https://iptv-org.github.io/iptv/countries/cn.m3u ，以及江苏官方直播网站 https://live.jstv.com/ 。

## 当前内置

| 频道 | 片源 | 实际检查 |
| --- | --- | --- |
| 广东卫视 | https://h5cul1yar48um3t.wcetv.com/hls/gdsatellite.m3u8 | 播放列表 HTTP 200；视频分片 HTTP 200；均 CORS *；媒体序号 1701945 -> 1701947 |
| 河北卫视 | https://event.pull.hebtv.com/live/live101.m3u8 | 播放列表 HTTP 200；视频分片 HTTP 200；均 CORS *；媒体序号 596967335 -> 596967338 |

这些检查确认当时能拉取持续更新的直播媒体，不代表各地区、各设备或未来持续可用。各客户端直接访问片源，没有增加服务器转播代理。

## 未内置的候选

- 浙江卫视、浙江国际频道旧 `ali-m-l.cztv.com` 源：虽然播放列表及片段均 HTTP 200，但节目时间停在 2023-09-11，媒体序号不变。排除。
- 江苏官方 `litchi-play-encrypted-site.jstv.com/applive/jswspro.m3u8`：HTTP 403。排除。
- 深圳卫视 `livepull-tcms.sztv.com.cn/live/sz4Kpgm.m3u8`：HTTP 403。排除。
- 江西、山东候选源：HTTP 403。排除。
- 四川、甘肃候选域名：DNS 解析失败。排除。
- 云南候选源：读取超时。排除。
- 公共索引中北京、湖南、江苏、浙江、天津、辽宁等其他多条候选只有 HTTP 地址：当前站点 HTTPS 下会有混合内容限制，未内置。

尚未覆盖全国全部卫视。新增源应复核 HTTPS、CORS、视频分片和媒体序号的持续更新，不能只依据 m3u8 返回 200 判断可用。

## 直播交互

- 内置频道强制直播模式；手动片源可勾选直播，HLS 的 live 标记或原生播放器无限时长会自动识别为直播。
- 直播关闭 video 原生控件，使用播放/暂停、音量、全屏按钮，不提供进度条或倍速。
- 直播同步片源及播放/暂停；各端从自己的直播边缘播放，不同步绝对秒数，避免不同播放窗口导致异常跳转。

浏览器实际播放检查：两个频道均在原生 video 中解码并持续播放，河北画面带河北卫视标识（3840px），广东画面带广东卫视标识（1280px）；readyState=4、paused=false、controls=false、playbackRate=1。未进行多设备同步检查。
