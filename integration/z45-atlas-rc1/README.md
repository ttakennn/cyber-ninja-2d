# Zone 4–5 Atlas RC1
Gói artwork và metadata để Sol tích hợp vào map01-five-zones. Ngày 2026-10-31.
Trạng thái: RC1 candidate; chưa duyệt art bởi chủ dự án, chưa chạy trong game. Không phải Step09 final.

## Nội dung
- 14 PNG individual: 12 asset còn thiếu + bản đồng bộ thùng gỗ/pallet chỉ dành cho placement Zone5.
- 4 trang atlas: z4-facades 1312×1568; z5-structures 1312×1376; z45-props 1568×1008; z5-backwall 2048×768.
- public/assets/environments/map01/expansion-z45-rc1/asset-manifest.json: kích thước thật, SHA256, sourceRect, provenance, worldSize, anchor.
- integration/environment-replacements-atlas.json: 22 replacement theo ID, KHÔNG append.
- integration/environment-replacements-individual.json: phương án PNG riêng tương đương, không dùng đồng thời.
- integration/replacement-map.json: mapping ID cũ→asset mới; 3 placement dùng lại giỏ hoa/đèn tường giữ nguyên.
- previews/: contact sheet và ảnh ghép thiết kế; KHÔNG phải ảnh runtime hoặc bằng chứng nghiệm thu.
- sources/: 11 ảnh gốc imagegen, prompt, SVG chữ/vạch, hash source review.
- REVIEW.md, SOL-TASK.md, ACCEPTANCE.md.

## Cách đọc metadata
pixelSize trong mỗi decoration atlas là kích thước TOÀN TRANG, sourceRect là vùng asset tính từ góc trên trái.
worldPosition là bottom-center; không đổi sang tâm collider. Giữ anchor {x:0.5,y:1}.
Atlas không rotation; extrusion 4px trong gutter8px; LinearFilter, SRGB, không mipmaps.
Tường arena rộng2048 dùng trang riêng không gutter/extrusion, sourceRect toàn ảnh; giữ ClampToEdge, không RepeatWrapping. Đây là ngoại lệ rõ ràng với policy gutter của trang nhiều sprite, không giảm độ phân giải tường.
Renderer hiện tạo mesh và clone texture cho mỗi sourceRect; không cam kết atlas làm giảm draw calls.

## Tích hợp
Hai thư mục mới đã được đặt trong repo: public/assets/environments/map01/expansion-z45-rc1/ và integration/z45-atlas-rc1/.
Chưa sửa generator, level JSON, code, UI, physics hoặc catalog nguồn. Runtime vẫn graybox cho tới khi Sol tích hợp.
Không overwrite asset props gốc hoặc metadata thiết kế gốc. reuse-crate-wood/reuse-wooden-pallet là ID mapping được giữ để tương thích; các PNG trong gói này là artwork mới, không phải bản sao source cũ.

## Tạo lại gói
assemble.cjs dùng Node + sharp; truyền đường dẫn repo làm đối số thứ nhất. SHARP_MODULE có thể trỏ đến package sharp có sẵn. Đây là script authoring xuất ảnh/atlas/metadata, không phải kiểm thử game. Chạy trong thư mục gói có sources/generated; ảnh gốc đã được lưu để không phụ thuộc cache imagegen.
11 asset dùng image_gen.imagegen built-in, 2 biển và vạch nền dùng SVG. Prompt đầy đủ tại sources/generation-prompts.json. Không dùng API/CLI image generation.

