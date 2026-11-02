# Task09 — bổ sung art cúi phóng phi tiêu

Đã commit phần art + click phải đứng/projectile hiện tại tại **20d4cd3 — feat(ninja): add right-click fire shuriken animation and projectile**, nhánh codex/task-009-player-attack-art. Không merge/push; chưa chạy test/build của commit này.

[Preview động bộ cúi](preview.html) · [Ảnh đối chiếu](crouch-contact-sheet.png) · [Atlas mới](../../../../integration/task-009-fire-shuriken/crouch-throw/crouch-throw-atlas.png) · [Prompt/nguồn/metadata](../../../../integration/task-009-fire-shuriken/crouch-throw/README.md).

Đã vẽ sáu pose cúi phóng bằng ImageGen built-in, tham chiếu crouch canonical và động tác đứng đã duyệt. Giữ gối gập/hông thấp xuyên suốt; vung tay ngang rồi thu về, không nâng nhân vật lên tư thế đứng hoặc co ảnh đứng để giả cúi. Canvas512×512, pivot(192,353),160px/unit giống bộ đứng; tỉ lệ đầu/thân đối chiếu crouch gốc. Một scale cho toàn clip và dịch căn hông/chân; source/rect/scale/hash/prompt lưu trong integration.

Preview có pause, step, tốc độ chậm, nền sáng/tối, chồng crouch gốc mờ và phi tiêu phát từ tay ởpose4. Ảnh tĩnh gồm crouch gốc, sáu pose mới và standing-release gốc, cùng đường chân. Timing và điểm thả trong preview là đề xuất cho bộ mới, chờ review. Metadata này chưa được nạp trong runtime.

Files bổ sung: integration/task-009-fire-shuriken/crouch-throw/{crouch-reference.png,standing-release-reference.png,source-v1.png,crouch-throw-atlas.png,atlas.json,review-data.js,image-prompt.md,README.md}, scripts/prepare_ninja_crouch_throw.ps1 và thư mục báo cáo/preview này. docs/TASK_STATUS.md cập nhật commit đứng và trạng thái art cúi; docs/TASK-009.md thêm tiến độ trong skills; không sửa src/ hoặc public/.

Đã chạy generator **powershell -NoProfile -ExecutionPolicy Bypass -File scripts/prepare_ninja_crouch_throw.ps1** để authoring PNG/metadata/contact sheet, đã xem ảnh kết quả. Không chạy lệnh validation. **NOT_RUN:** test/build/typecheck/lint/formatter, browser preview, gameplay/console. Không lấy preview artwork làm bằng chứng nghiệm thu game.

Runtime tại20d4cd3 hiện vẫn chỉ cho phóng khi đứng trên đất. Bộ cúi mới là candidate riêng, chưa thay canonical hoặc tự mở điều kiện cúi khi chưa review artwork. Physics/collider/crouch/headroom, movement, standing throw và combo giữ nguyên. Art và preview lưu commit riêng với trạng thái candidate; việc commit không có nghĩa artwork mới đã được duyệt.
