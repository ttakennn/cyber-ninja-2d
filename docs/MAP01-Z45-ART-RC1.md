# Map01 Zone 4/5 — Atlas Art Preview RC1

Ngày bàn giao: 2026-10-31. Nhánh: `codex/map01-z45-art-integration`.
Baseline HEAD: `fe4ff7d5c6540053857394357ff70dec9b092d3a`; baseline code: `12244bf98183262bb312b164c4d550ad6e968945`.

Đã tích hợp artwork vào dữ liệu và generator. Trạng thái **ART PREVIEW RC1**, nghiệm thu runtime **NOT_RUN**, duyệt mỹ thuật **PENDING**. Chưa duyệt production, chưa khóa Step09, chưa merge master.

## Phạm vi thay đổi

- `scripts/generate_map01_five_zones.mjs`: đọc replacement atlas, resolve theo ID; giữ placement từ master/reuse, chỉ thay `image`, `pixelSize`, `sourceRect`. Bỏ phát sinh SVG cho asset đã resolve; giữ SVG/catalog graybox làm reference. Phát hiện ID replacement trùng, placement bị thay trùng, ảnh không tồn tại và replacement chưa resolve. Không append lại crate/pallet đã có trong reuse.
- `src/world/levels/map-01-five-zones.json`: đầu ra đã sinh lại từ generator, dùng bốn trang atlas cho đúng 22 decoration dưới đây.
- `src/main.ts`: đổi riêng nhãn alias `map01-five-zones` thành ART PREVIEW RC1.
- `tests/Z45AtlasIntegration.test.ts`: thêm test đúng 22 ID, không trùng; placement khớp master, ba reuse giữ nguyên; URL atlas, rect/gutter, kích thước và SHA-256 của PNG nguồn/atlas. Test chưa chạy.
- `tests/FiveZones.test.ts`: cập nhật yêu cầu không tải SVG đã resolve; giữ test hình học, spawn, camera, landing, ô tile và generator hiện có. Test chưa chạy.
- `README.md`: hướng dẫn mở alias và phân biệt bằng chứng graybox với bản art.
- `docs/MAP01-Z45-ART-RC1.md`: báo cáo này.
- `integration/z45-atlas-rc1/`: theo dõi nguyên trạng bảy file bàn giao: README, REVIEW, ACCEPTANCE, SOL-TASK, replacement-map và hai bảng replacements atlas/individual.
- `public/assets/environments/map01/expansion-z45-rc1/`: theo dõi nguyên trạng manifest, 14 PNG individual và bốn PNG atlas được bàn giao. Individual chỉ lưu nguồn/reference; dữ liệu runtime mới chỉ trỏ atlas.

Hai thư mục bàn giao đã tồn tại, chưa được Git theo dõi khi bắt đầu. Không ghi đè chúng. Không sửa năm file thiết kế master-data gốc, catalog props gốc hoặc PNG nguồn. Provenance, source hash và trạng thái trong asset-manifest nguồn được giữ nguyên.

## Các decoration được thay

| Nhóm | ID |
| --- | --- |
| Quán và biển Zone 4 | `z4-noodle-building`, `z4-noodle-sign`, `z4-market-building`, `z4-market-sign` |
| Đèn Zone 4 | `z4-lamp-1`, `z4-lamp-2`, `z4-lamp-3` |
| Chậu Zone 4 | `z4-flowerpot-1`, `z4-flowerpot-2`, `z4-flowerpot-3`, `z4-flowerpot-4` |
| Tường và cửa Zone 5 | `z5-entry-sidewall`, `z5-arena-wall`, `z5-exit-sidewall`, `z5-backdrop-shutter` |
| Cổng mở | `z5-entry-gate-open`, `z5-exit-gate-open` |
| Vạch và đèn Zone 5 | `z5-floor-edge-stripe`, `z5-edge-lamp-1`, `z5-edge-lamp-2` |
| Prop thay artwork | `z5-wood-crate-background`, `z5-pallet-background` |

20 placement trước dùng 12 SVG placeholder; hai placement còn lại trước dùng crate/pallet từ props cũ. Giữ nguyên `z4-hanging-flowers`, `z5-wall-light-1`, `z5-wall-light-2` và toàn bộ decoration ba zone cũ.

Theo diff JSON đã đọc, các trường thay đổi chỉ là thông tin ảnh của 22 ID; worldPosition, worldSize, anchor, layer, z và collision giữ nguyên. Không sửa renderer, physics, animation/pivot, input, camera, solids, climbables, tile cells, spawn, deathY hoặc alias cũ. Vùng landing X80..88 và core X120..136 giữ layout hiện tại; không thêm boss/combat/checkpoint/cổng khóa.

## Quy ước atlas

`pixelSize` là kích thước toàn trang; `sourceRect` tính từ góc trên trái, không tính extrusion vào nội dung sprite.

| Trang | Kích thước | Gutter theo manifest |
| --- | --- | --- |
| z4-facades.png | 1312×1568 | Padding 8 px, extrusion 4 px |
| z5-structures.png | 1312×1376 | Padding 8 px, extrusion 4 px |
| z45-props.png | 1568×1008 | Padding 8 px, extrusion 4 px |
| z5-backwall.png | 2048×768 | Ảnh đơn full page, không padding/extrusion |

Backwall dùng rect `(0, 0, 2048, 768)`. Giữ sampler hiện có: LinearFilter, sRGB, không mipmap, ClampToEdge; không repeat. Không sửa engine để làm ảnh vừa placement.

Nguồn và chỉ dẫn bàn giao: [README](../integration/z45-atlas-rc1/README.md), [manifest](../public/assets/environments/map01/expansion-z45-rc1/asset-manifest.json), [replacement-map](../integration/z45-atlas-rc1/replacement-map.json), [review](../integration/z45-atlas-rc1/REVIEW.md), [acceptance](../integration/z45-atlas-rc1/ACCEPTANCE.md). Trạng thái runtime trong manifest là trạng thái nguồn, không phải chứng nhận bản tích hợp.

## Việc đã thực hiện và chưa thực hiện

Đã đọc source/metadata, xem trực tiếp bốn trang atlas và đọc diff mã/JSON. Đã chạy generator ở chế độ ghi để tạo JSON sau khi sửa generator. Lần đầu generator phát hiện crate bị thêm trùng; đã sửa vòng master bỏ qua ID có trong reuse, rồi sinh JSON thành công (exit 0). Đây là bước tạo dữ liệu, không phải kết quả test hay nghiệm thu runtime.

| Hạng mục | Kết quả lượt này |
| --- | --- |
| Generator ghi JSON | Đã thực hiện, exit 0 |
| Generator `--check` | NOT_RUN |
| Toàn bộ test, gồm test mới | NOT_RUN |
| Production build | NOT_RUN |
| Lint, formatter, typecheck riêng | NOT_RUN |
| Đi tuyến, movement, respawn | NOT_RUN |
| Chrome/Edge/IAB, console, DPR, FPS | NOT_RUN |
| Ảnh game bản art ở bốn viewport | NOT_RUN — không có ảnh runtime mới |

Prompt bàn giao yêu cầu chỉ chạy test/build/validation khi có phép rõ trong request thực thi; lượt này chưa có phép mới. Không dùng kết quả 388 test, build hoặc ảnh graybox làm bằng chứng cho atlas RC1. Không có log test/build mới. Không cập nhật `dist`; preview production có sẵn có thể vẫn phục vụ bản graybox cũ. Xem source mới qua dev server với `?level=map01-five-zones`; production cần build mới khi được phép.

## Các mục còn mở

- Chạy test/build mới và lưu log khi được phép; kiểm generator tái tạo ổn định bằng test `--check` hiện có.
- Đi toàn tuyến cũ → C → D → E, crouch/headroom, thang, khe mái, camera bounds và fall/respawn trên bản art.
- Chụp game thật tại landing, noodle, market, entry/core/exit, nối X120/136 ở 1920×1080, 1280×720, 1024×768, 540×960. Ghi commit, browser/version, DPR, kích thước yêu cầu/thực tế và console.
- Xác nhận đọc đủ “Hủ tiếu nam vang” ở X93 và “Siêu thị” ở X105, dấu Việt và HUD không che chữ.
- Kiểm chân chậu/đèn/crate/pallet tại Y=-2.5, cổng nhìn mở, vạch dưới mặt đường, UV/alpha/bleeding khi camera di chuyển, nối tường X120/136 và player rõ khi đứng/cúi/nhảy trước cửa cuốn.
- Các P1/P2 trong REVIEW chưa tự đóng chỉ vì đã thay URL ảnh. Camera nhìn toàn core ở 4:3/portrait, nhịp lặp nền/prop cũ, hiệu năng và duyệt mỹ thuật vẫn cần đánh giá riêng; không đổi gameplay trong lượt art này.

Chưa đủ bằng chứng để gọi bản này là production hoặc đề xuất khóa Step09.
