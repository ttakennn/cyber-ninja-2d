# Map01 — hồ sơ riêng

Kế thừa [quy chuẩn chung](../rules/GAME_BIBLE.md). Palette/ánh sáng đêm Map01 chỉ áp dụng Map01; map khác có thể sáng hơn theo chủ đề riêng.

- [Art/palette Map01](rules/ART_STYLE_GUIDE.md), [atlas/pipeline Map01](rules/ATLAS_SPEC.md), [trạng thái Map01](TASK_STATUS.md).
- [Bố trí RC3 mới nhất](reports/MAP01-POLISH-RC3.md), [phố ghép](reports/MAP01-STREET-MIX.md), [RC2](reports/MAP01-VISUAL-REVISION-RC2.md), [Z45 RC1](reports/MAP01-Z45-ART-RC1.md), [five zones](reports/MAP01-FIVE-ZONES.md).
- Nhân vật đang dùng: [ninja](../characters/ninja/rules/SPRITE_SPEC.md); hồ sơ ninja độc lập với map.

## Nguồn hiện hành

Từ public/assets/environments/map01/: backgrounds/, props/, foreground/, production/production-assets.json, expansion-z45-rc1/asset-manifest.json và ui-polish-rc3/asset-manifest.json. Nguồn bố trí tại scripts/generate_map01_pilot.mjs, generate_map01_five_zones.mjs, map01-polish.mjs cùng input/plan chúng đọc; phố ghép tại integration/map01-street-layout.json. Các đường dẫn source này tính từ gốc repo, không phải từ thư mục tài liệu.

Alias map01 có X0..80; map01-five-zones tới X144. Spawn(2,−1.7), deathY−8, camera minY−3.5/maxY11.5/followY=true là baseline hiện hành, phải đọc JSON mới nhất trước khi sửa. Giữ khe mái, crouch/headroom, thang và chuyển tiếp/bậc; không thay gameplay để che ảnh.

Báo cáo/ảnh/log lịch sử đã được người dùng gom vào commits/. Các task Map01 tiếp theo lưu Markdown, ảnh preview và bằng chứng vào docs/map01/commits/<task-id>/; giữ tên thư mục task ổn định, không ghi đè bằng chứng cũ. Quy chuẩn lâu dài ở rules/, trạng thái tổng hợp ở TASK_STATUS.md.