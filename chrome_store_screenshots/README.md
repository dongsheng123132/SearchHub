# Chrome商店截图与资产

2026-08-31 全部重制（多 AI 协作：真实 UI 实机截图 + HTML 模板合成，经 opus 三轮读图 QA 收敛到 GO）。

## 文件清单

### 截图 (1280x800，统一尺寸)
- `screenshot_1_1280x800.png` — 主界面：一次输入多引擎出结果（3 引擎选中态与计数自洽）
- `screenshot_2_1280x800.png` — 侧边栏垂直管理结果标签
- `screenshot_3_1280x800.png` — 深色模式 + 快捷键

### Promo 资产
- `chrome_promo_images/small_tile_440x280.png` — Promo 小图
- `chrome_promo_images/large_banner_1400x560.png` — Marquee 大图

## 注意

- 旧版 640x400 截图与 jpg 版本已删除（混用会被商店放大导致模糊；PNG 为准）
- 旧图「第一 AI 搜索」为违规排名声明（CWS 政策禁止），已全部清除
- 引擎数以代码实测 50 为准（旧 54 为误计）
- 源文件与管线：`_store_assets/`（可复跑：`node capture5.js && node compose2.js`）
- 商店文案：`../STORE_LISTING.md`
