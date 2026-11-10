# Nguồn chạy theo chuẩn51 — Task10.53

CANDIDATE_PENDING_REVIEW. [Preview](../../docs/map01/commits/task-010-53-ninja-run-reference/preview.html), [hồ sơ](../../docs/map01/commits/task-010-53-ninja-run-reference/README.md).

plan.json chọn run-arm-source.png: source4×4 gồm1control đứng +12run +3ô trống. run-source.png là nguồn đầu; run-loop-source.png sửa chân cuối; run-arm-source.png sửa tay trái ngang ngực. Prompt lưu tương ứng. Nguồn tạo hình là production51; ninja xanh người dùng gửi chỉ tham khảo động tác.

Đọc mốc bằng powershell -NoProfile -ExecutionPolicy Bypass -File integration/ninja-run-combat-reference/measure-source.ps1 -Image run-arm-source.png. Sau đổi artwork/mốc, cập nhật plan rồi chạy scripts/prepare_ninja_run_combat_reference.ps1 bằng Windows PowerShell5. Một hệ số chung theo control251px, căn ngang theo đai, một offset dọc chung; không fit từng pose hoặc ép nhịp bay xuống đất. Chỉ author output trong reviewDirectory, không ghi production/game.

Output12frame384×320/pivot192,289,18FPS đề xuất; preview so với51 và vòng8frame hiện tại. Chưa chốt/publish/commit.
