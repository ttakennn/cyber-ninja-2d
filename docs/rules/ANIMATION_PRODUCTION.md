# Animation — bản chốt production và lịch sử task

Quyết định người dùng2026-11-04, áp dụng mọi nhân vật. Kế thừa ART_STYLE_GUIDE/SPRITE_SPEC/ATLAS_SPEC; không đổi style, danh tính, kích thước hoặc gameplay qua quy tắc tổ chức này.

## Hai nơi, hai vai trò

- docs/characters/<nhan-vat>/animation/ là bộ **art đã được người dùng chốt cho production**, gồm atlas/metadata/clip/VFX và preview đúng phiên bản đã chọn. Không đặt candidate, phiên bản bị loại hoặc đồ thử mới chưa duyệt vào đây.
- Mọi task vẫn phải cập nhật báo cáo và ảnh/preview/snapshot trong docs/<map-id>/commits/<task-id>/; với Map01 là docs/map01/commits/. Không ghi đè snapshot task trước. Không thay việc lưu lịch sử bằng chỉ sửa production.
- integration/ giữ source, prompt, plan, audit và provenance. public/assets/ là bản game đang dùng; việc tích hợp runtime là bước riêng được giao, không tự apply vì art đã được chốt.

## Quy trình bắt buộc

1. Đọc rules nhân vật, manifest production và source thực tế; xác định chính xác bộ được chốt. Không lấy tên v2/v3/candidate làm bằng chứng duyệt.
2. Artwork mới/đổi pose phải authoring vào reviewDirectory riêng trong commits. Đổi plan/input trước rồi sinh metadata; không sửa riêng output để che lỗi, không dùng production làm thư mục thử.
3. Lưu báo cáo, source/prompt/hash, ảnh trước/sau hoặc snapshot đủ file mở preview. Ghi điều đã xem và NOT_RUN; chỉ chạy test/build khi được phép trong yêu cầu hiện tại.
4. Sau lời chốt của người dùng, publish đúng file đã duyệt vào animation/. Không tạo lại PNG khi chỉ gom/đổi tên; copy/move nguyên byte và cập nhật consumer/generator/catalog tương ứng.
5. Khi thay bản cũ bằng v2 đã chọn, production chỉ còn một bản canonical không hậu tố phiên bản nếu người dùng yêu cầu. Bản cũ nằm trong Git/commits/source lịch sử, không trộn vào preview production. Không xoá nhầm atlas debug hoặc asset khác chỉ vì tên cũ.
6. Cập nhật manifest approval, nguồn/hash/frame/pivot/timing, trạng thái tích hợp, chỉ mục nhân vật và TASK_STATUS/DECISION_LOG. Bản chốt art không chứng nhận physics, input, shader, damage, AI hoặc build/runtime đã nghiệm thu.

## Preview tổng hợp cho nhân vật có nhiều nhóm hoạt ảnh

- Ưu tiên một `animation/preview.html` làm điểm xem chung, có nút chọn động tác cơ bản, màn xuất hiện, đánh thường, di chuyển đặc biệt và từng skill đã chốt. Giữ bộ điều khiển phát/tạm dừng/tua và bảng frame để người dùng review chi tiết.
- Khi nâng cấp một preview cơ bản đã duyệt thành trang tổng hợp, giữ nguyên bản cơ bản tại `animation/basic-preview.html`; trang tổng hợp mở lại các preview riêng của từng nhóm. Không vẽ lại hoặc đổi nhịp/atlas đã chốt chỉ để gộp giao diện. Mẫu đã được người dùng chọn: `docs/characters/boss-khan/animation/preview.html`. Dùng mẫu này khi chỉnh thư viện Ninja Hỏa ở task tiếp theo, có điều chỉnh phù hợp dữ liệu của Ninja.
- Mọi task chỉnh art, metadata hoặc giao diện preview của nhân vật Map01 đều phải có hồ sơ mới trong `docs/map01/commits/<task-id>/`, kể cả khi chỉ đổi cách xem và không sửa PNG. Ghi file đã đổi, lý do, ảnh hưởng, điều đã kiểm tra/NOT_RUN và link sang production; không dùng thông điệp Git commit thay cho hồ sơ task.

## Nguồn hiện hành

- Ninja Hỏa: docs/characters/ninja/animation/preview.html, production.json; plan integration/ninja-animation-library/production-plan.json. Publisher scripts/publish_ninja_animation_library.mjs chỉ copy các file trong danh sách đã chốt, không xử lý lại ảnh hoặc thay game.
- Ninja leo: bản người dùng chọn là v2 đã có trong flame-ninja-atlas.png; tên active là integration/ninja-climb/climb-poses.png và scripts/create_ninja_climb.ps1. Không chạy lại script ghép ảnh chỉ để đổi tên.
- Giáng Lâm/Tái Lâm: scripts/prepare_ninja_entrance.ps1 -Profile entrance/respawn ghi vào reviewDirectory từ plan; sau duyệt mới copy đúng bộ vào production và đồng bộ metadata. Không mặc định ghi candidate vào bản chốt.
- Sói Điện: authoring -OnlySheet ghi review trong commits; chỉ -PublishOnly sau khi chốt mới đồng bộ production. Mỗi task mới phải chọn reviewDirectory mới để giữ snapshot cũ.

Nếu thông tin duyệt thiếu/mâu thuẫn, hỏi riêng phần đó; tiếp tục phần có nguồn rõ. Không tự biến một bộ chưa duyệt thành final hoặc tự phát sinh walk/pose/skill còn thiếu.
