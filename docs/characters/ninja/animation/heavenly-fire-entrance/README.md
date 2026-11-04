# Thiên Hỏa Giáng Lâm — art candidate, chưa áp dụng vào game

**Bản chốt production2026-11-04:** người dùng đã chốt toàn bộ animation Ninja. Bộ này giữ nguyên PNG/nhịp, được ghi USER_APPROVED_PRODUCTION_ART trong plan/catalog. [Thư viện production](../preview.html), lịch sử/snapshot tại docs/map01/commits/task-010-ninja-production/. Các mục chờ duyệt bên dưới mô tả giai đoạn tạo art; spawn vẫn chưa áp dụng vào game. Authoring sau này ghi reviewDirectory trong commits, không ghi đè trực tiếp bản chốt.

[Mở preview](preview.html). Bộ mới gồm8pose nhân vật,8frame tia giáng và8frame vòng lửa; chờ người dùng duyệt. Giữ tạo hình Ninja trưởng thành đen/đỏ, khăn/bao kiếm cùng bên. Tay giữ chuôi kiếm thấp như Idle hiện hành; không thêm động tác chém, rút kiếm, nhảy xuống hoặc dịch chuyển nhân vật.

## Timeline theo yêu cầu

| Thời gian | Diễn tiến |
| --- | --- |
| 0–350ms | Tia thiên hỏa thẳng đứng lao xuống; lõi vàng sáng, đuôi cam/đỏ và ember |
| 350–650ms | Flash nhỏ tại đất, mở vòng lửa thấp; tia dọc thu/tan80ms sau chạm |
| 650–1250ms | Ninja trụ chắc ở giữa, từ bóng tối/alpha thấp dần sáng rõ |
| 1250–1650ms | Lửa thu/tan thành ember, Ninja giữ thế rồi nối Idle |

Preview giữ thêm600ms Idle thật từ atlas hiện hành trước khi lặp; phần xuất hiện vẫn đúng1650ms. Blend cuối1550–1650ms sang Idle để xem chuyển tiếp. Vòng lửa chia lớp sau/trước bằng vùng vẽ quanh nền, ôm chân mà không che đầu/thân; không flash toàn màn hoặc biến thành vụ nổ combat. Có nút chọn mốc, pause/tua/tốc độ/zoom/nền và xem riêng từng sheet/frame. Tia giáng có thể đi ngoài đỉnh khung preview vì bắt đầu từ trời; PNG đã đóng đủ tia trong từng ô.

Đây là mô phỏng art. Chưa có trigger xuất hiện, khoá/mở điều khiển, bất tử, sound, collision, sát thương hoặc thay gameplay. Mốc “người chơi bắt đầu điều khiển” chỉ được trình bày bằng nối Idle, chưa thực thi input trong game.

## Kích thước và nguồn

- Body dùng ô512×512/pivot(192,353)/160px-world unit như các pose attack/skill đã có. Một scale chung từ guard0 về chiều cao alpha≥128 của Idle gốc251px; không fit từng pose. Chỉ dịch căn chân, không sửa scale nhân vật hoặc atlas locomotion384×320/pivot(192,289).
- FX riêng ô512×512/pivot(256,484); tia dùng scale1 và anchor nguồnY484 để đầu tia chạm đất và giữ đủ đuôi; vòng lửa dùng scale300/384 cho cảsheet, căn đáy cùng nền. Không lấy kích thước FX làm collider hoặc radius.
- Công cụ image_gen.imagegen built-in, transparent_background=true. Tham chiếu đã xem: integration/task-009-special-01/source/idle-reference.png và integration/task-009-nine-dragons/candidate/cast.png.
- Source1536×1024 RGBA/4cột×2hàng mỗi sheet, nguyên byte tại integration/task-010-ninja-entrance/source/: body (exec-17ffb339-ec69-44e3-9065-e69c18b269f9.png), beam (exec-4c3572ba-2563-42cc-b2b3-89505a17e0cd.png), ring (exec-8bfcbc96-1ee6-4059-8699-de022ba7b2fd.png).
- [Plan](../../../../../integration/task-010-ninja-entrance/art-plan.json), [prompt body](../../../../../integration/task-010-ninja-entrance/prompts/body.md), [prompt tia](../../../../../integration/task-010-ninja-entrance/prompts/beam.md), [prompt vòng](../../../../../integration/task-010-ninja-entrance/prompts/ring.md). Sửa plan trước, authoring bằng scripts/prepare_ninja_entrance.ps1; xuất assets/3PNG2048×1024, atlas.json/review-data.js, reference/ và3bảng pose tại đây.
- Metadata ghi sourceRect, alpha bounds, source anchor, translation, scale, size và SHA256. PNG reference/locomotion.png sao chép nguyên file runtime để preview Idle, không sửa ảnh gốc. Các đường source/prompt trong metadata tính từ thư mục integration authoring.

## Đã thực hiện / còn mở

Đã xem ảnh tham chiếu và các bảng pose sau normalization, đọc kích thước/alpha vùng trống source bằng0; giữ đủ tia trong ô, vòng lửa thấp, body cùng chuẩn chiều cao Idle. Nguồn runtime/public/assets, physics, input, camera và toàn bộ asset Sói Điện giữ nguyên. Chưa thao tác preview trong trình duyệt hoặc nghiệm thu cảm giác blend/animation trong game. Test/build/lint/typecheck/formatter **NOT_RUN** theo yêu cầu hiện hành. Chưa commit/merge/push; không gọi artwork mới là bản đã duyệt hoặc production.
