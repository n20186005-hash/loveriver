[![Love River | Kaohsiung Travel website](https://tse1.mm.bing.net/th/id/OIP.sKjYLnFDxN-Tug8mYv2vIAHaE8?r=0\&pid=Api)](https://khh.travel/en/attractions/detail/499?utm_source=chatgpt.com)

# loveriver.org 爱河景点网站完整方案

## 一、先给结论

**loveriver.org 很适合做“高雄爱河独立旅游指南”，域名综合评分约 8.5/10。**

它的优势是简短、好记，和景点英文名完全一致；`.org` 又天然带有“公共信息、文化、旅游指南”的感觉。主要问题是 **Love River 在英语世界不一定只指高雄爱河**，因此网站所有核心位置都必须强化：

> **Love River Kaohsiung, Taiwan**
> 高雄愛河旅遊指南

不要只做一篇“爱河景点介绍”，也不要扩张成普通的高雄旅游门户。最合适的定位是：

> **以爱河为中心，覆盖爱河市区段、爱河湾、爱河之心，以及步行和轻轨可顺游的高雄港湾旅游指南。**

我此次检查时，`loveriver.org` 尚未成功解析到公开网站。若域名已经在你手中，第一步需要确认注册状态、Nameserver、Cloudflare DNS，以及根域名和 `www` 的统一跳转。

---

# 二、这个站真正应该解决什么问题

目前“爱河”搜索结果主要由高雄官方旅游网站、交通部观光署、Klook，以及已经有权重的台湾旅游博客占据。现有内容普遍是长篇攻略，但游客真正容易遇到的问题是：

* 爱河、爱河之心和爱河湾是不是同一个地方？
* 应该坐到前金、盐埕埔、真爱码头还是爱河之心站？
* 爱之船和贡多拉有什么区别？
* 哪一段最好看？
* 应该白天去还是晚上去？
* 两小时、半天和一天分别怎么走？
* 今天有没有船、活动或交通管制？

官方资料确认爱河的经典市区观光段、爱河之心及爱河湾是不同位置，邻近交通方式也不同；这正是独立网站可以做得比普通攻略更清楚的地方。([高雄旅遊網][1])

因此，网站核心不应该是“更多文字”，而是以下四个词：

> **地图、分区、路线、实时更新**

---

# 三、品牌与定位

## 推荐品牌名称

### 中文

**高雄愛河旅遊指南**

### 英文

**Love River Kaohsiung Guide**

### 品牌简称

**LoveRiver.org**

### 推荐口号

繁体中文版：

> 從愛河之心到愛河灣，一次看懂高雄最美水岸。

英文版：

> Explore Kaohsiung’s iconic waterfront, from the Heart of Love River to Love River Bay.

## 网站身份说明

由于域名看起来比较“官方”，页脚、关于页面和所有购票模块附近都应清楚写明：

> LoveRiver.org 是独立旅游指南，并非高雄市政府、观光局或爱之船官方售票网站。

不要使用高雄市政府标志、观光局 Logo，或者写成“爱河官方网站”。

---

# 四、最合适的网站边界

## 应该收录

网站可以围绕以下地理范围展开：

| 区域      | 核心内容                  |
| ------- | --------------------- |
| 爱河之心    | C24轻轨、夜景、骑行、生态池       |
| 爱河市区经典段 | 国宾站、贡多拉、河东路、河西路、历史博物馆 |
| 爱河湾     | 真爱码头、光荣码头、高雄流行音乐中心    |
| 港湾顺游区   | 大港桥、驳二、玫瑰圣母圣殿、盐埕美食    |
| 行程连接点   | 前金站、盐埕埔站、真爱码头站、爱河之心站  |

官方资料把爱河描述为贯穿高雄市区、以夜景、步道、游船和假日活动为主要体验的城市水岸；高流户外场域、爱河湾活动和港区轻轨，又让它具备扩展成“港湾目的地指南”的条件。([高雄旅遊網][1])

## 暂时不要收录

不建议一开始扩张到：

* 旗津完整攻略
* 莲池潭
* 佛光山
* 美浓
* 义大世界
* 高雄所有酒店
* 高雄所有夜市

这些内容会稀释 loveriver.org 的主题。可以在行程页中简单连接，但不要变成完整的“高雄旅游大全”。

---

# 五、推荐网站结构

## 1. 一级导航

建议使用：

```text
首頁
愛河地圖
愛河遊船
行程路線
沿岸景點
美食住宿
活動情報
認識愛河
```

移动端底部固定四个操作：

```text
地圖｜遊船｜行程｜導航
```

## 2. 完整 URL 架构

### 核心入口

```text
/
 /map/
 /guide/
 /transport/
 /best-time-to-visit/
 /faq/
```

### 游船专题

```text
/boats/
/boats/love-boat/
/boats/gondola/
/boats/cruise-comparison/
/boats/ambassador-pier/
/boats/tickets/
```

爱之船官方目前标示国宾站运营时间为每日15:00至22:00，但节庆、天气和主题航次可能调整，因此相关页面必须显示“最后核实日期”和官方来源，而不能把时间写死后多年不更新。([高雄市輪船股份有限公司][2])

### 三大区域

```text
/areas/downtown-love-river/
/areas/love-river-bay/
/areas/heart-of-love-river/
/areas/love-river-vs-love-river-bay/
```

其中最重要的一篇不是普通介绍，而是：

```text
/areas/love-river-vs-heart-vs-bay/
```

标题建议：

> 愛河、愛河之心、愛河灣差在哪？交通、位置與玩法一次看懂

这会成为网站最有差异化的内容之一。

### 行程路线

```text
/itineraries/2-hour/
/itineraries/half-day/
/itineraries/one-day/
/itineraries/night-walk/
/itineraries/couple/
/itineraries/family/
/itineraries/photography/
/itineraries/rainy-day/
/itineraries/wheelchair-friendly/
```

### 沿岸景点

```text
/places/true-love-pier/
/places/glory-pier/
/places/kaohsiung-music-center/
/places/dagou-bridge/
/places/pier-2-art-center/
/places/kaohsiung-history-museum/
/places/228-peace-park/
/places/holy-rosary-cathedral/
```

### 实用需求

```text
/food/
/hotels/
/parking/
/toilets/
/cycling/
/photo-spots/
/sunset/
/accessibility/
```

### 历史与文化

```text
/history/
/name-origin/
/river-restoration/
/bridges/
/dragon-boat-festival/
```

### 活动

```text
/events/
/events/2026-kaohsiung-wonderland/
/events/dragon-boat-festival/
/events/kaohsiung-cocktail-day/
```

爱河会承接灯会、龙舟、调酒节等大型活动。2026年官方资料中，爱河湾冬日游乐园、爱河水域端午龙舟赛和河西路调酒节都形成了明确的季节性搜索需求，因此“活动情报”应是常驻频道，而不是偶尔发布的博客文章。([高雄旅遊網][3])

---

# 六、首批最值得制作的页面

不建议一上线就批量生成100篇。第一阶段做 **15至20个高完成度页面** 更合适。

## 第一优先级

1. 高雄爱河完整攻略
2. 爱河互动地图
3. 爱河、爱河之心、爱河湾区别
4. 爱河怎么去：捷运、轻轨、公交和停车
5. 爱之船票价、时间、路线和乘船地点
6. 爱河贡多拉完整指南
7. 爱之船和贡多拉比较
8. 爱河两小时路线
9. 爱河半日游
10. 爱河一日游
11. 爱河附近景点
12. 爱河夜景和最佳拍照时间
13. 爱河附近美食
14. 爱河附近住宿区域比较
15. 爱河常见问题

## 第二优先级

* 情侣路线
* 亲子路线
* 无障碍路线
* 下雨天替代行程
* 爱河自行车路线
* 爱河历史与污染整治
* 爱河桥梁图鉴
* 真爱码头
* 光荣码头
* 高雄流行音乐中心
* 大港桥
* 驳二连接路线

Google明确建议网站优先制作真正帮助用户、具有经验和独特价值的内容，不要利用生成式AI批量发布缺乏附加价值的页面。对这个站来说，原创地图、实测路线、真实照片和更新记录，比把同一篇攻略改写成几十篇更重要。([Google for Developers][4])

---

# 七、关键词布局

不要虚构搜索量。前期先按搜索意图布局，上线后再通过 Search Console 验证。

## 核心词

```text
愛河
高雄愛河
愛河景點
愛河怎麼玩
愛河一日遊
愛河夜景
愛河地圖
```

## 交通词

```text
愛河捷運
愛河怎麼去
愛河哪一站
愛河之心捷運
愛河停車場
真愛碼頭交通
```

## 游船交易词

```text
愛之船
愛之船票價
愛之船時刻表
愛之船國賓站
愛河遊船
愛河貢多拉
愛河貢多拉票價
愛之船 貢多拉 差別
```

## 周边消费词

```text
愛河附近景點
愛河附近美食
愛河住宿
愛河飯店
愛河咖啡廳
愛河約會
```

## 英文词

```text
Love River Kaohsiung
Love River Taiwan
Love River cruise
Kaohsiung Love River night
how to get to Love River Kaohsiung
Love River vs Heart of Love River
things to do near Love River
```

当前繁体中文搜索结果已有官方页、OTA和大型旅游博客竞争，因此首页不应只押注“爱河”一个大词。应使用交通、分区、路线、游船比较和活动更新等长尾页面建立主题权威。([波比看世界][5])

---

# 八、首页应该怎么设计

## 第一屏

建议使用真实爱河夜景横图，文字不要太多：

### H1

> 高雄愛河旅遊指南

### 副标题

> 愛之船、夜景、交通、沿岸景點與一日遊路線，一次規劃完成。

### 三个按钮

```text
查看愛河地圖
比較遊船
規劃行程
```

旁边放置快速信息：

```text
河岸：全天開放
最佳時間：日落前至晚間
經典區域：國賓站至愛河灣
建議停留：2小時至半天
```

## 第二屏：不要去错地方

用三张大卡明确区分：

### 爱河市区段

适合第一次游客、爱之船、贡多拉、经典夜景。

### 爱河湾

适合高流、大港桥、港湾建筑、活动和灯光。

### 爱河之心

适合骑行、慢跑、生态和轻轨C24。

这是首页最重要的模块。

## 第三屏：今天怎么安排

让用户选择：

```text
我只有2小時
我有半天
我要看夜景
我是情侶
帶小孩出遊
下雨天備案
```

点击后进入对应路线，不要只是筛选文章列表。

## 第四屏：游船比较

| 项目  | 爱之船     | 贡多拉       |
| --- | ------- | --------- |
| 氛围  | 导览观光    | 浪漫体验      |
| 适合  | 首次游客、家庭 | 情侣、纪念日    |
| 航程  | 约25分钟   | 约25分钟     |
| 出发点 | 国宾站     | 河东路、民生路附近 |
| 建议  | 看更多地标   | 重视氛围和歌唱体验 |

动态价格和时间要从内容数据中读取，并显示：

> 最后核实：2026年7月24日
> 临时停航及节庆价格以运营方公告为准

## 第五屏：互动地图

地图提供筛选：

```text
景點
碼頭
捷運輕軌
拍照點
廁所
停車
美食
住宿
```

每个点位显示：

* 步行时间
* 推荐停留时间
* 白天或夜间推荐
* 最近车站
* 打开Google Maps
* 加入路线

---

# 九、内容页面统一模板

每个景点页面都应采用相同的数据结构：

```json
{
  "name": "真愛碼頭",
  "nameEn": "True Love Pier",
  "slug": "true-love-pier",
  "area": "love-river-bay",
  "coordinates": {
    "lat": 22.619,
    "lng": 120.289
  },
  "summary": "",
  "openingHours": "",
  "admission": "",
  "recommendedDuration": "30–60分鐘",
  "bestTime": "日落至晚間",
  "nearestStations": [],
  "facilities": {
    "toilet": true,
    "wheelchair": true,
    "parking": true,
    "youBike": true
  },
  "suitableFor": [
    "couples",
    "families",
    "photography"
  ],
  "photoSpots": [],
  "nearbyPlaces": [],
  "officialSources": [],
  "lastVerifiedAt": "2026-07-24"
}
```

## 页面正文顺序

1. 一句话结论
2. 适合谁
3. 基本信息
4. 最佳游览时间
5. 怎么去
6. 现场怎么玩
7. 拍照位置
8. 周边顺游
9. 注意事项
10. 信息来源与核实日期

这样既适合游客，也方便搜索引擎和AI问答系统抽取答案。

---

# 十、多语言策略

## 推荐顺序

### 第一阶段

繁体中文：

```text
loveriver.org/
```

### 第二阶段

英文：

```text
loveriver.org/en/
```

### 第三阶段

日文：

```text
loveriver.org/ja/
```

暂时不需要一开始同时做五六种语言。先把繁体中文做完整，再上线10至15个高价值英文页面。

英文版不能只是机器直译，至少应重新处理：

* 台湾交通用语
* 台币价格
* 车站英文名
* EasyCard和轻轨使用方法
* 从高铁左营站和高雄机场出发
* 国际游客常见误解
* 台风和夏季气候提醒

每种语言使用独立URL，并配置相互对应的 `hreflang`。Google明确建议多语言内容使用不同URL，而不是依赖Cookie或浏览器语言动态替换。([Google for Developers][6])

示例：

```html
<link rel="alternate" hreflang="zh-Hant" href="https://loveriver.org/boats/love-boat/">
<link rel="alternate" hreflang="en" href="https://loveriver.org/en/boats/love-boat/">
<link rel="alternate" hreflang="ja" href="https://loveriver.org/ja/boats/love-boat/">
<link rel="alternate" hreflang="x-default" href="https://loveriver.org/en/boats/love-boat/">
```

---

# 十一、SEO与GEO执行重点

## 1. 每页先回答，再展开

例如“爱河哪一站下车”页面，开头直接写：

> 前往爱之船国宾站，可从前金站或盐埕埔站步行；前往爱河湾建议在轻轨真爱码头站下车；前往爱河之心则使用轻轨C24爱河之心站。

不要先写500字历史再回答。

## 2. 明确区分稳定信息和动态信息

### 稳定信息

* 历史
* 经纬度
* 景点关系
* 桥梁名称
* 地区介绍

### 动态信息

* 船票价格
* 运营时间
* 临时停航
* 活动日期
* 市集
* 餐厅营业状态
* 交通管制

动态信息旁统一显示：

```text
最後核實日期
資料來源
前往官方公告
回報資訊錯誤
```

## 3. 原创信息资产

最值得投入的不是普通文章，而是：

* 三大爱河区域对比图
* 爱河沿岸完整步行地图
* 各车站到景点的实测路线
* 日落与夜景拍摄点地图
* 爱之船沿途地标图
* 无障碍厕所与坡道地图
* 一日游时间轴
* 爱河桥梁图鉴
* 雨天替代行程

这些内容更容易获得自然链接，也更容易被AI搜索引用。

## 4. 图片SEO

图片建议使用：

```text
kaohsiung-love-river-night-view.webp
love-boat-ambassador-pier.webp
heart-of-love-river-c24.webp
love-river-bay-sunset.webp
```

每张图片应包含真实说明、拍摄位置、拍摄时间和适当的alt文本。Google建议使用清晰、高质量图片，将图片放在相关文字附近，并使用有描述性的文件名和上下文。([Google for Developers][7])

## 5. 结构化数据

建议使用：

* 首页：`WebSite`、`Organization`
* 爱河总览：`TouristDestination`
* 景点页：`TouristAttraction`、`Place`、`GeoCoordinates`
* 路线页：`TouristTrip`、`ItemList`
* 活动页：`Event`
* 文章：`Article`
* 所有内页：`BreadcrumbList`

Schema.org提供了 `TouristAttraction`、`TouristDestination` 和 `TouristTrip` 类型；但它们不等于一定获得Google富媒体结果。Google当前明确支持的搜索展示应以官方Search Gallery为准，活动页面和面包屑可以按照Google规范实施。([Schema.org][8])

不要添加不存在的用户评分，也不要把Google Maps评分复制进自己的结构化数据。

---

# 十二、地图和图片版权

## 地图

可以选择：

### 最简单

Google Maps Embed，用于导航和单个地点展示。

### 更适合自定义路线

MapLibre或Leaflet，加合法授权的底图服务。

地图需要支持自定义点位和路线，但不要抓取Google Maps地点库、评论、用户图片或批量商家数据。Google Maps条款允许在符合要求并保留署名的情况下展示地图内容，但禁止复制、批量下载或利用内容建立替代性地点数据库。([Google][9])

## 图片

优先顺序：

1. 自己实地拍摄
2. 委托高雄本地摄影师
3. 获得书面授权的店家图片
4. 明确允许再利用的政府开放资料
5. 正确署名的CC授权图片

不要直接保存Google Maps游客上传的照片拿来建站，也不要默认高雄旅游网图片可以商业使用。

建议安排一次完整采集：

* 下午拍白天景观
* 日落拍蓝调
* 晚上拍灯光和游船
* 拍摄每个车站出口
* 拍摄码头售票处和指示牌
* 拍摄厕所、无障碍坡道和YouBike点
* 录制10至20段竖屏短视频

---

# 十三、视觉设计方案

## 风格方向

不要做成俗气的粉红色情侣网站。推荐：

* 深海军蓝：港湾夜色
* 水面蓝：地图和链接
* 暖金色：河岸灯光
* 少量珊瑚红：按钮和“Love”元素
* 大量留白：维持旅游指南感

## Logo

建议图形：

> 一条弯曲河流和一座桥共同组成不封闭的爱心。

文字组合：

```text
LOVE RIVER
高雄愛河指南
```

## 字体

以系统字体为主，降低加载成本：

```css
font-family:
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  "Noto Sans TC",
  sans-serif;
```

## 移动端体验

这个站的大量用户会在旅途中用手机查看，因此移动端比桌面端更重要：

* 点击区域不小于44px
* 底部固定导航
* 地图按钮始终可见
* 页面开头显示最近车站
* 一键打开地图
* 一键复制地址
* 不要首屏弹出广告
* 弱网下仍可看到路线文字

---

# 十四、技术栈建议

结合这种内容型、地图型旅游微站，我最推荐：

```text
Astro
TypeScript
Tailwind CSS
MDX / Astro Content Collections
Cloudflare Pages
Cloudflare R2 或对象存储
MapLibre / Leaflet
Plausible 或 GA4
Google Search Console
```

## 为什么适合静态生成

大部分景点、历史和路线内容是稳定的，适合构建成静态HTML：

* 首屏速度快
* 服务器成本低
* SEO稳定
* 维护简单
* 容易部署到Cloudflare
* 不需要一开始建设复杂后台

动态部分单独处理：

```text
/events.json
/boat-status.json
/transport-alerts.json
```

通过定时任务或人工后台更新，而不是让整个网站依赖服务端渲染。

## 推荐内容目录

```text
src/content/
  places/
  routes/
  boats/
  food/
  hotels/
  events/
  guides/

src/data/
  stations.json
  map-points.json
  sources.json
  site-settings.json
```

## 图片处理

构建时生成：

```text
AVIF
WebP
JPEG fallback
320 / 640 / 960 / 1440 px
```

地图不要在首屏同步加载；用户滚动到地图区域或点击“查看地图”后再加载。

---

# 十五、更新机制

这是这个站能否超过普通博客的关键。

## 建立信息状态

每条动态数据包含：

```json
{
  "value": "15:00–22:00",
  "source": "Kaohsiung City Shipping",
  "verifiedAt": "2026-07-24",
  "status": "verified",
  "expiresAt": "2026-08-24"
}
```

状态分为：

```text
已核實
待重新確認
活動期間異動
已停止營運
```

## 更新频率

| 内容      | 建议频率      |
| ------- | --------- |
| 游船营业和票价 | 每两周及重大节日前 |
| 活动日历    | 每周        |
| 餐厅和咖啡店  | 每两个月      |
| 交通信息    | 每季度       |
| 景点基础资料  | 每半年       |
| 酒店推荐    | 每月检查价格链接  |
| 历史内容    | 有新资料时更新   |

首页显示：

> 本站重要旅游信息最后更新于：2026年7月24日

---

# 十六、变现方式

## 第一优先：旅游票券联盟

可以在以下页面加入第三方购票按钮：

* 爱之船
* 贡多拉
* 高雄港游艇
* 高雄捷运套票
* 驳二体验
* 旗津连接行程

Klook目前仍提供面向内容网站的联盟计划，可通过网站流量获得预订分成。按钮应明确写成“查看第三方优惠票”，不能写成“官方购票”。([Klook Travel][10])

## 第二优先：酒店

制作的是“住宿区域选择”，而不是复制几百家酒店页面：

* 前金区：靠近经典爱河
* 盐埕区：靠近驳二和美食
* 爱河湾：靠近高流和轻轨
* 高雄车站：交通方便
* 左营：适合高铁转乘

Agoda现有网站联盟计划，并要求注册、网站验证和银行资料；其联盟产品目前以酒店为主。([partners.agoda.com][11])

## 第三优先：本地合作

后期可以合作：

* 河畔咖啡厅
* 摄影师
* 求婚策划
* 自行车租赁
* 高雄当地导览
* 行李寄存
* 包车和接送
* 旅馆和青年旅舍

所有付费合作都要显示：

```text
合作內容
贊助推薦
本站可能取得分潤
```

## 广告

初期不建议首页大面积放AdSense。

更好的顺序是：

```text
实用内容 → 搜索流量 → 票券与住宿分润 → 本地合作 → 最后再考虑展示广告
```

`.org` 域名可以商业化，但商业模块必须透明，否则会损害独立指南的信任感。

---

# 十七、推广与外链

最值得制作的可传播资产：

* 免费爱河步行地图PDF
* 爱河沿岸景点地图
* 爱河之船沿途地标图
* 高雄夜景拍摄地图
* 爱河桥梁图鉴
* 轻轨爱河一日游地图
* 爱河活动日历订阅
* 英文版“Kaohsiung Waterfront Map”

外链合作对象：

* 爱河附近酒店和青年旅舍
* 高雄摄影社群
* 高雄在地导览团队
* 海外台湾旅游博客
* 日本台湾旅行媒体
* 高雄餐厅和咖啡店
* 大学交换生与国际学生网站

不要购买大量目录外链。这个站更适合通过原创地图、照片和可引用数据获得自然链接。

---

# 十八、上线计划

## 第1周：基础建设

* 配置域名和Cloudflare
* 确定品牌、Logo和设计系统
* 建立内容数据模型
* 完成网站骨架
* 建立地图点位数据库

## 第2周：核心内容

上线：

* 首页
* 完整攻略
* 三大区域区别
* 交通
* 地图
* 爱之船
* 贡多拉
* 游船比较
* 两小时路线
* 半日路线

## 第3周：商业和长尾内容

上线：

* 一日游
* 夜景拍照
* 附近景点
* 美食
* 住宿区域
* 停车
* FAQ
* 活动频道

## 第4周：国际化和SEO

* 上线5至10个英文核心页面
* 配置hreflang
* 提交站点地图
* 配置Search Console
* 检查结构化数据
* 压缩图片
* 测试移动端和Core Web Vitals
* 开始本地合作与外链联系

Google表示整体页面体验、移动端内容质量、HTTPS、广告干扰和Core Web Vitals都会影响用户体验；但这些不是替代优质内容的单一排名捷径。([Google for Developers][12])

---

# 十九、最容易踩的坑

1. **只做一个超长首页**
   会失去游船、交通、路线和周边需求的独立搜索入口。

2. **把爱河之心当作爱河经典游船区**
   这是游客最常见的地点混淆。

3. **把票价和营业时间写死**
   动态信息必须有核实日期。

4. **批量生成餐厅和酒店薄页面**
   没有实地信息时，宁可做区域指南。

5. **直接搬Google Maps评论和图片**
   有版权和平台条款风险。

6. **让网站看起来像政府官网**
   必须清楚声明独立身份。

7. **过早扩展到整个高雄**
   会破坏爱河主题集中度。

8. **只做中文**
   `loveriver.org` 是很好的英文域名，至少应该有核心英文版。

9. **只写历史，不提供现场决策信息**
   游客最需要的是去哪、怎么走、什么时候去、需要多少钱。

---

# 二十、我最推荐的最终版本

## 网站定位

> **台湾最完整的高雄爱河与港湾独立旅游指南**

## 技术方案

```text
Astro + Tailwind + MDX
Cloudflare Pages
MapLibre互动地图
繁体中文为主
英文为第二语言
```

## 首期规模

```text
18个高质量页面
30至50个地图点位
100张以上原创照片
6条实测路线
3个区域专题
2个游船专题
1个活动频道
```

## 核心差异化

> 不是再写一篇“爱河好美”的博客，而是让游客在30秒内确定：**应该去哪一段、在哪一站下车、选哪种船、几点抵达，以及接下来怎么走。**

只要坚持“分区清楚、地图实用、动态信息可验证、照片原创”，loveriver.org 有机会成为爱河主题中非常强的垂直站点。

[1]: https://khh.travel/zh-tw/attractions/detail/232/ "愛河－高雄旅遊網"
[2]: https://kcs.kcg.gov.tw/Content_List.aspx?n=38E3F0AC78634C4C&utm_source=chatgpt.com "太陽能【愛之船】"
[3]: https://khh.travel/zh-tw/event/calendardetail/7307/?utm_source=chatgpt.com "2026 Kaohsiung Wonderland 冬日遊樂園｜超人力霸王"
[4]: https://developers.google.com/search/docs/fundamentals/creating-helpful-content?utm_source=chatgpt.com "Creating Helpful, Reliable, People-First Content"
[5]: https://bobbytravel.tw/love-river/?utm_source=chatgpt.com "【高雄】2026愛河景點攻略：愛河之心、愛河市集、愛之船美食 ..."
[6]: https://developers.google.com/search/docs/specialty/international/localized-versions?utm_source=chatgpt.com "Localized Versions of your Pages | Google Search Central"
[7]: https://developers.google.com/search/docs/appearance/google-images?utm_source=chatgpt.com "Image SEO Best Practices | Google Search Central"
[8]: https://schema.org/TouristAttraction?utm_source=chatgpt.com "TouristAttraction - Schema.org Type"
[9]: https://www.google.com/help/terms_maps/?utm_source=chatgpt.com "Google Maps End User Additional Terms of Service"
[10]: https://affiliate.klook.com/?utm_source=chatgpt.com "Join Klook's Affiliate Program to help you earn revenue from ..."
[11]: https://partners.agoda.com/?utm_source=chatgpt.com "Agoda Affiliate Partner"
[12]: https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing?utm_source=chatgpt.com "Mobile-first Indexing Best Practices | Google Search Central"

