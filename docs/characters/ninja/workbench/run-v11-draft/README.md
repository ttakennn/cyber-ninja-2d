# Flame Ninja Run V11 — diagnostic draft

Bản sửa ngoại hình mới theo phản hồi về kích thước/màu/ánh sáng: [production-match-r2/preview.html](production-match-r2/preview.html), [bảng so production/cũ/mới](production-match-r2/production-comparison.png). Bản V11 gốc bên dưới giữ nguyên để đối chiếu; R2 vẫn chờ review.

**DRAFT_REJECTED_FOR_PRODUCTION — USER APPROVAL PENDING.** Đã tạo artwork24frame bằng host image_gen theo brief V11; còn lỗi thị giác, không coi các pose lỗi là frame được duyệt. Không thay canonical hoặc tích hợp game. Mọi đầu ra của task ở riêng thư mục này theo yêu cầu người dùng, ưu tiên hơn nơi lưu task mặc định trong AGENTS.

- [Preview tương tác](preview.html): vào chạy / vòng chạy / ghép, nền sáng-tối-checker, tốc độ, frame trước/sau và onion.
- [Contact sheet24frame](contact-sheet.png).
- [RUN_START GIF một lượt](run_start-once.gif):6frame,10FPS,600ms.
- [RUN_LOOP GIF](run_loop.gif):18frame,20FPS,900ms.
- [GIF ghép](combined.gif):6frame vào chạy và3vòng chạy,60vị trí timeline,3300ms.
- [Onion start](onion-run_start.png), [onion loop](onion-run_loop.png).
- [Atlas start](run_start.png):1152×640; [atlas loop](run_loop.png):2304×960.
- PNG nguồn runtime ở frames/frame-01.png đến frame-24.png, tất cả384×320 RGBA, pivot(192,289), facing right.
- [Timing chính xác và transform](animation-timing.json), [metadata runtime start](run_start-runtime.json), [metadata runtime loop](run_loop-runtime.json). Loader không thay; metadata kind development, chưa đưa vào game.
- [QC đọc được](QC.md), [QC JSON chi tiết](qc-report.json), [Forge clip metadata](forge-clips/animation-clips.json).
- [Kế hoạch pose ban đầu](pose-plan.json), prompts/, references/, raw/ và [provenance](provenance.json). Kế hoạch560ms ban đầu được thay bằng600ms để tương thích uniform FPS của loader hiện hành.

Quy trình dùng Forge key_still để key mềm, sheet_qc spill/frame checks và build_animation_clips để đóng gói/review. prepare.py dựng guide đúng pixel từ production không resize. package_draft.py dùng một hệ số251/284 cho tất cả pose mới, transform từng hàng được khai báo, không fit bbox từng pose. Không chạy process/scale_frames thêm sau đó vì chúng có thể tái neo các frame đã đăng ký; source và transform vẫn được giữ để kiểm tra.

Đã xem nguồn4nhóm, contact sheet toàn bộ, onion hai clip và ảnh riêng tại điểm reach/contact. So với production vẫn lệch anatomy/texture, transition và pha chân. Xem đầy đủ WARN/FAIL nguyên văn trong QC.md; không suy kết quả đóng gói đạt thành nghiệm thu animation.

Chưa chạy browser playback, test/build/lint/typecheck/formatter; không commit. GIF đã giải mã kiểm số frame/timing, atlas đã so khớp pixel với24PNG. Không image-to-video, không paid API.
