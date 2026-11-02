# Player attack artwork — Task09.1

Cập nhật: người dùng đã duyệt candidate và chuỗi frame, art lưu ở1442907. Bộ runtime được promote vào public/assets/characters/ninja/attacks/ bằng scripts/promote_ninja_attacks.mjs và combo-plan.json. Các mô tả candidate bên dưới giữ hồ sơ trước phê duyệt; không phải trạng thái hiện tại. Điều khiển click trái/reset0.5s nằm trong PlayerAttack, chưa có damage.

Candidate, chưa được người dùng duyệt hoặc runtime nạp. Source nguyên bản sáu file ở source/; bản chỉnh danh tính attack3 riêng cùng thư mục; prompt và normalization-report.json mô tả xử lý. candidate/ chứa3 PNG,3 JSON và review-data.js cho preview.

Đọc [review](../../docs/map01/commits/task-009-01-player-art/REVIEW.md) và mở [preview](../../docs/map01/commits/task-009-01-player-art/preview.html). Chỉ promote sang public sau khi người dùng chọn bộ ảnh, tỉ lệ và contract padding. Không nhập damageLogic hoặc damagePulseTimesMs từ JSON nguồn vào engine; đó là metadata của project khác.

Source người dùng: C:/Users/anhthaitrong/Downloads/Games/docs/Character/red-ninja/attacks. File ngoài repo không sửa. Bản attack3 chỉnh bằng ImageGen built-in có source gốc công cụ exec-f1a064da-7fe9-483f-b618-d22a2460abbe.png; các bước chuẩn hoá/crop có thể tái tạo qua scripts/prepare_ninja_attacks.ps1.
