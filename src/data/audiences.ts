/**
 * 按人群定制的遊覽方案與通用路線。
 * 三條人群路線（親子家庭／攝影與自然／低體力與無障礙）＋ 兩條通用長度（半日／全日）。
 */

export interface AudienceRoute {
  id: "family" | "photography" | "accessible";
  title: string;
  subtitle: string;
  href: string;
  duration: string;
  station: string;
  pace: string;
  highlights: string[];
  cautions: string[];
}

export const audienceRoutes: AudienceRoute[] = [
  {
    id: "family",
    title: "親子家庭",
    subtitle: "短距離、多休息、以廁所與遮蔭為節點",
    href: "/itineraries/family/",
    duration: "約 2 小時",
    station: "捷運 O2 鹽埕埔／O4 前金",
    pace: "慢速，每 30–40 分鐘安排一次停留",
    highlights: [
      "以捷運站廁所與飲水作為補給節點",
      "河岸短段散步為主，不勉強走完全程",
      "把遊船安排在體力最好的前半段",
    ],
    cautions: [
      "全程緊盯水域側護欄，不讓孩童攀爬欄杆",
      "推車遇到僅有階梯的橋梁需改道",
      "正午日照強，建議 15:00 後出發",
    ],
  },
  {
    id: "photography",
    title: "攝影與自然",
    subtitle: "光線優先，兼顧鳥況與河面反射條件",
    href: "/itineraries/photography/",
    duration: "約 3–4 小時",
    station: "捷運 O2 鹽埕埔 → 輕軌 C10–C12",
    pace: "彈性，依光線與潮汐式鳥況調整",
    highlights: [
      "日落前 45–60 分鐘卡位，收夕照與藍調時刻",
      "市區段橋梁倒影，愛河灣開闊港景",
      "清晨時段鳥況與水氣條件通常更好",
    ],
    cautions: [
      "腳架請避開主要步行動線，不要跨越護欄取景",
      "強風時水面破碎、倒影不易成形",
      "夜間拍攝請結伴並注意周遭環境",
    ],
  },
  {
    id: "accessible",
    title: "低體力與無障礙",
    subtitle: "以電梯、平緩步道與短程接駁為主",
    href: "/itineraries/accessible/",
    duration: "約 2 小時（可再縮短）",
    station: "捷運 O2／O4，或輕軌 C11 真愛碼頭",
    pace: "非常慢速，全程可隨時中止",
    highlights: [
      "選擇有電梯與無障礙廁所的車站作為起終點",
      "以單一區域為限，不跨區移動",
      "座位與遮蔭密度較高的路段優先",
    ],
    cautions: [
      "跨堤與橋梁段常有階梯，需事前確認替代動線",
      "夏季請避開 11:00–15:00，並準備飲水",
      "必要時可搭配計程車或無障礙接送服務",
    ],
  },
];

export interface GeneralRoute {
  id: "half-day" | "one-day";
  title: string;
  duration: string;
  href: string;
  summary: string;
  stops: string[];
  suitable: string;
}

export const generalRoutes: GeneralRoute[] = [
  {
    id: "half-day",
    title: "半日經典路線",
    duration: "約 4 小時",
    href: "/itineraries/half-day/",
    summary:
      "從市區段走到愛河灣，一次收進遊船、河岸與港灣建築；單向移動、不折返，適合第一次到訪。",
    stops: [
      "捷運 O2 鹽埕埔出發，先逛街區或市場",
      "國賓站周邊搭乘遊船",
      "沿河岸往南，經五福橋進入愛河灣",
      "光榮碼頭與高流外圍看藍調時刻",
      "搭輕軌離場",
    ],
    suitable: "第一次來訪、行程只有半天、希望一次看到愛河的代表性畫面。",
  },
  {
    id: "one-day",
    title: "全日深度路線",
    duration: "約 8 小時",
    href: "/itineraries/one-day/",
    summary:
      "以水岸為主軸，串接市區段、愛河灣、駁二與大港橋，並保留一段室內場館作為天候備案。",
    stops: [
      "上午：鹽埕街區與市立歷史博物館",
      "中午：室內場館或商場用餐避熱",
      "下午：遊船與市區段河岸散步",
      "傍晚：愛河灣、大港橋與駁二倉庫群",
      "晚間：燈光倒影與輕軌離場",
    ],
    suitable: "停留一整天、想同時認識城市歷史與水岸景觀的旅人。",
  },
];
