# Thiên Hỏa Tái Lâm — art hồi sinh candidate

**Bản chốt production2026-11-04:** người dùng đã chốt toàn bộ animation Ninja, gồm hồi sinh. Plan/catalog hiện USER_APPROVED_PRODUCTION_ART; PNG/nhịp giữ nguyên. [Thư viện production](../preview.html), lịch sử/snapshot tại docs/map01/commits/task-010-ninja-production/. Các mục candidate bên dưới là lịch sử tạo art; respawn/input vẫn chưa tích hợp. Authoring mới phải ghi reviewDirectory trong commits trước khi được chốt.

[Mở preview0,75s](preview.html) · [So với Thiên Hỏa Giáng Lâm1,65s](../heavenly-fire-entrance/preview.html). Chờ duyệt art mới, chưa áp dụng hồi sinh/input vào game. Bộ Giáng Lâm và asset runtime giữ nguyên.

## Nhịp theo brief

| Mốc | Nội dung preview |
| --- | --- |
| 0–180ms | Tia thiênhỏa ngắn/thẳng/sắc, lõi vàng trắng, cam/đỏcam ngoài, ít ember |
| 180–350ms | Flash20ms, vòng lửa nhỏ mở thấp, không nổ lớn; tia dọc thu/tan50ms |
| 350–600ms | Silhouette35ms; alpha/chi tiết hiện rõ nhanh đến420ms, chân vững/head nâng nhẹ/kiếm ở thế sẵn sàng |
| 600–750ms | Lửa/glow tan nhanh, ember nhỏ và nối Idle thật ở frame cuối |

Body7pose dùng35/35/65/65/60/60/80ms, tổng400ms từ350đến750ms. Pose0 chỉ làm chuẩn so cỡ. Độ hiện rõ tăng từ0,3 tại350ms lên1 ở420ms; độ sáng giữ tối35ms đầu rồi về đúng màu. Glow viền mảnh2px tham chiếu và ánh ấm trên pose, tan600–750ms; không phủ trắng hoặc che silhouette. Blend sang Idle700–750ms. Tay ở chuôi kiếm thấp đúng baseline, không tự thêm vung/rút kiếm.

Vòng lửa8frame dùng20/30/50/100/100/120/90/60ms, tổng570ms từ180đến750ms, chia cung trước/sau để ôm chân. Tia ngắn hơn bản Giáng Lâm, quãng rơi minh hoạ110px và thời gian đến đất180ms. Preview giữ thêm450ms Idle để xem nối rồi lặp; phần hồi sinh vẫn750ms. Các lớp và frame nguồn xem riêng bằng menu/tua, có nền sáng/đêm/caro và Idle so cỡ.

## Nguồn và cách authoring

Ba sheet mới được tạo bằng image_gen.imagegen built-in/transparent_background=true. Tham chiếu đã xem: body.png của Giáng Lâm và idle-reference.png hiện hành. PNG gốc1536×1024 RGBA/4cột×2hàng, giữ nguyên byte tại integration/task-010-ninja-respawn/source/:

- body.png: exec-fdea8cbe-448b-4578-a54f-ee85e97e700a.png.
- beam.png: exec-502622b9-250b-4629-ad39-1ddaaf729192.png.
- ring.png: exec-aa84812f-6af6-470c-bfd2-334a332c093b.png. Lượt đầu exec-e1300602-faf4-4f07-8a08-e46553c6303f.png bị lẫn nhân vật, lưu ring-first.png để truy vết; không dùng nó trong preview. Công cụ ảnh đã sửa để chỉ giữ VFX.

[Plan](../../../../../integration/task-010-ninja-respawn/art-plan.json) là nguồn authoring. [Prompt body](../../../../../integration/task-010-ninja-respawn/prompts/body.md), [tia](../../../../../integration/task-010-ninja-respawn/prompts/beam.md), [vòng lượt đầu](../../../../../integration/task-010-ninja-respawn/prompts/ring.md), [sửa tách VFX](../../../../../integration/task-010-ninja-respawn/prompts/ring-cleanup.md) lưu nguyên văn. Đường source/prompt trong metadata tính từ integration authoring.

Tái sử dụng scripts/prepare_ninja_entrance.ps1 bằng **-Profile respawn**: chỉ đọc/ghi pack hồi sinh mới, không chạy lại pack Giáng Lâm. Profile mặc định entrance giữ đầu ra cũ. Generator xuất3PNG2048×1024/8ô512×512, atlas.json/review-data.js,3bảng pose và bản copy Idle tham chiếu. Metadata ghi sourceRect/anchor/translation/size/scale/hash; không chỉnh riêng output để che dữ liệu.

Body giữ pivot(192,353)/160px-world unit, một scale từ guard0 về251px chiều cao alpha≥128 của Idle gốc; không fit từng frame. FX riêng pivot(256,484); tia scale300/384/anchorY470, vòng scale260/384. Collider/scale locomotion/physics không đổi. Vòng nhỏ hơn bản Giáng Lâm, không lấy pixel FX làm radius damage.

## Đã làm / chưa làm

Đã xem tham chiếu, source mới và contact sheet body/vòng sau normalization; đọc kích thước và alpha mẫu ngoài nguồn bằng0, tâm vòng mẫu alpha5/255 gần trong suốt (không có nhân vật sau cleanup). Đã giữ bản gốc runtime và pack Giáng Lâm, không sửa public/assets/src hoặc Sói Điện. Preview dùng classic JS/drawImage, mở file:// hoặc localhost với đủ file trong thư mục; không đọc pixel Canvas.

Chưa thao tác preview trong trình duyệt. Test/build/lint/typecheck/formatter **NOT_RUN**. Đây là art review: chưa trigger hồi sinh, respawn/checkpoint, HP, bất tử, khoá/mở input, Combat Ready runtime, AI hoặc damage. Chưa commit/merge/push, chưa gọi là production.
