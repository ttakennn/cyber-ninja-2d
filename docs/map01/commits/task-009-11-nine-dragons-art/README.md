# Task09 — art CỬU LONG HỎA TRẬN

Ngày2026-11-03. Nhánh codex/task-009-player-attack-art. Theo yêu cầu “Oke ổn áp, commit lại”: đã commit toàn bộ art/runtime/UI Minh Vương Bạo Viêm và H ẩn hướng dẫn ở **08294d4 — feat(ninja): add dark-fire special skill and compact skill HUD**. Không chạy test/build khi commit. Art Cửu Long Hỏa Trận mới nằm ngoài commit này, chờ review; không merge master hoặc push.

## Kết quả thiết kế

1. **Tụ Hỏa ·350ms:** tám pose caster bao gồm rút kiếm, định kiếm, cắm mũi kiếm sát nền và trụ giữ trận. Vòng trận dưới chân phát sáng với9nút lửa, hỏa long hình thành dần. Tên CỬU LONG HỎA TRẬN hiện phía trên, nổi nhẹ và mờ dần trong1.5s; chỉ chữ, không khung/nền.
2. **Long Viêm Toàn Vũ ·800ms:**9rồng từ cùng atlas được chia3nhóm×3; mỗi nhóm gồm3rồng cách120° quanh thân. Rồng chuyển động nhanh theo quỹ đạo elip/xoắn, nhóm đang đánh sáng hơn; thứ tự sau/trước người theo chiều sâu giúp còn đọc caster.
3. **Bạo Viêm ·250ms:** cả9rồng co vào tâm;6pha hội tụ, flash trắng vàng, vòng lửa đỏ cam mở ra rồi tan. Vụ nổ đi cùng mốc đánh thứ3, không tạo hit thứ4. Chín rồng riêng ở lớp orbit; đòn nổ có nét đầu rồng hòa vào vành lửa, không yêu cầu đếm9đầu trong từng frame nổ.

Palette mới vàng trắng/cam/đỏ son, cùng Illustrated textured pixel art2D, shading/texture đã chốt. Phân biệt hỏa trận sáng với cầu hắc hỏa skill cũ. Không dùng vector hoặc PNG screenshot thay asset. Không đổi ảnh/pivot/scale của nhân vật hiện hành.

## Bàn giao

- [preview.html](preview.html): canvas1280×720, tua từng mốc, bước25ms, phát chậm, nền tối/sáng/caro, idle ghost, vòng125px tham chiếu, chu kỳ nhanh2.4s hoặc chờ12s.
- [overview.png](overview.png): bố cục ba giai đoạn; hình minh họa bố cục, không phải gameplay screenshot.
- [cast-contact-sheet.png](cast-contact-sheet.png): idle gốc và8pose ở cùng mật độ160px/world unit/đường chân. Một scale0.75 dùng cho toàn bộ source caster, không phóng/thu riêng mỗi pose. Độ hạ đầu do hông/gối thấp xuống.
- [alpha-review.png](alpha-review.png): source đã chọn ghép trên nền trắng/navy để quan sát alpha, không phải texture runtime.
- integration/task-009-nine-dragons/: source/, candidate/, prompts/, art-plan.json, atlas.json và review-data.js. [Chi tiết nguồn/contract](../../../../integration/task-009-nine-dragons/README.md).
- scripts/prepare_ninja_nine_dragons.ps1: crop/normalization/pad có nguồn, sinh metadata/hash/board. Đã chạy authoring bằng Windows PowerShell5.1; không gọi lại generator của gameplay/skill cũ.

## Brief đã ghi và phần chưa tích hợp

Cooldown12s,125px tham chiếu,3waves×30HP, Burn12HP/s×3s, tổng lý thuyết126HP; Burn refresh không stack, một hit/wave/enemyID; knockback nhẹ/đợt cuối mạnh và boss có thể kháng. Đây là brief cho bước combat sau, **không có damage/Burn/knockback/hit flash enemy đang chạy trong preview**.

Preview chọn mốc1280×720,DPR1 và camera9unit cao đang có trong GameCamera/game.config:125px/80px-per-unit=1.5625world units. Không dùng160px/unit của atlas để suy bán kính. Mốc camera này chưa được người dùng xác nhận cho gameplay; FX có thể tràn nhẹ ngoài đường tham chiếu và không định nghĩa collider.

Phím E trong brief trùng E của Minh Vương Bạo Viêm. Chưa thay binding hoặc xóa skill cũ. Movement lock khi cast chưa áp dụng; không sửa physics trong task art. Cần chốt key và camera tham chiếu trước tích hợp. Tên "Special Skill1" trong brief không tự đổi ID skill cũ; dùng slug nine-dragons riêng.

## Kiểm tra thực sự và giới hạn

- Đã đọc rules/source/metadata/ảnh idle và special cũ, xem output ảnh mới; ghép/quan sát trên nền trắng/navy, xem bảng pose và overview; dùng alpha thật khi render. Ảnh tạo rồng/vòng trận thực1254×1254, khai cell627×627 đúng output, không giả metadata1024.
- Đã mở preview qua **IAB**, từ serverlocalhost5173 đang chạy; dùng nút chọn orbit700ms và burst1260ms, thấy trạng thái1/3 và3/3 đúng nhịp đề xuất; quan sát orbit trên nền tối và burst trên nền sáng. Đọc console preview tại lượt xem: không có warn/error được ghi nhận. Không suy thành đã xem mọi frame hoặc chơi game.
- **NOT_RUN:** test/build/lint/typecheck/formatter, production preview, gameplay/E/phím leo, damage/quái/boss và nghiệm thu responsive nhiều viewport. Đây là art candidate, chưa production, chưa apply runtime hoặc commit bộ art mới.
- Preview trở về idle trực tiếp sau1.4s; chưa có clip rút kiếm khỏi đất/tra vỏ tách riêng. Cần review chuyển tiếp khi tích hợp, không tự kéo dài1.4s của brief. Chín rồng dùng chung một thiết kế4pha, khác vị trí/pha/quỹ đạo; nếu muốn9silhouette độc lập cần brief artwork bổ sung.

Chờ người dùng review art và nhịp trước khi promote runtime. Nguồn/prompt giữ lại đầy đủ, không lấy việc đã sinh atlas làm bằng chứng người dùng duyệt.
