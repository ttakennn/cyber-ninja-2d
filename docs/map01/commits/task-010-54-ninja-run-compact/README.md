# Task 10.54 — Ninja Hoả: vẽ lại vòng chạy gọn

**CANDIDATE_PENDING_REVIEW · 2026-11-09.** Thay hướng chạy 10.53 bị người dùng bác vì sai kích thước, tỷ lệ cơ thể và khoảng mở chân quá dài. 10.47 và 10.51 vẫn là các bản đã chốt. Bản chạy này chưa được duyệt production.

## Xem bản sửa

- [Preview so sánh](preview.html): trái 10.51, giữa run production 8 frame, phải bản vẽ lại 12 frame. Cùng tỷ lệ pixel, mặt phẳng chân và mức phóng.
- [GIF so sánh](motion-preview.gif), [GIF chỉ nhân vật](run-loop.gif), [12 frame nền sáng](contact-sheet-light.png), [12 frame nền tối](contact-sheet-dark.png).
- [Atlas RGBA](run-atlas.png), [metadata/quan sát](review.json), [kiểm tra ảnh](asset-review.json), [nguồn/hash](provenance.json).

Preview có phát/dừng, từng frame, tua, tốc độ 0,25/0,5/1×, phóng chung và nền sáng/tối/caro. Chỉ một dòng trạng thái frame; không log thông báo liên tục.

## Đã làm lại

Lấy ảnh thật 10.51 và run production làm tham chiếu đầu–mặt–vai–thân–đùi–ống chân; không dùng hình 10.53 làm mẫu cơ thể. Giữ dáng cơ bắp, quần rộng, ống chân ngắn và bộ đồ đỏ/đen/giáp bạc. Thân hướng trước khoảng 30° tính từ phương thẳng đứng; đây là hướng tạo dáng trong guide, chưa phải số đo từ rig animation.

Tay phải giữ chuôi kiếm sau gáy, khuỷu nâng; tay trái gập trước ngực. Chuôi đi cùng vai/bàn tay, chỉ lộ phần trên. Thu vòng chân dưới hông, bỏ thế hai chân mở thành cú nhảy dài. Khăn và tà vải đổi hướng theo từng nhịp. Lượt vẽ đầu có ba frame đầu quá giống nhau, đã sửa lại phần chân ở lượt hai; giữ cả hai nguồn để đối chiếu.

Không căn tỷ lệ bằng một pose đứng do model vẽ lại. Cả 12 frame dùng **một hệ số 0,9** được chọn bằng đối chiếu kích thước đầu/thân với ảnh chuẩn thật, một dịch dọc 3,6 px và mốc eo để căn ngang. Không kéo dãn hai trục, không fit từng bbox chạy theo chiều cao đứng. Đây là artwork vẽ lại nên không khẳng định đồng nhất từng pixel với cơ thể gốc.

| Đóng gói | Giá trị |
| --- | --- |
| Atlas | 2304 × 640, 6 cột × 2 hàng, RGBA |
| Ô / pivot | 384 × 320 / (192, 289) |
| Mật độ tham chiếu | 160 px / unit |
| Vòng chạy đề xuất | 12 frame / 18 FPS ≈ 0,667 giây |
| GIF | 12 frame / 670 ms, do tick GIF 10 ms |

Nguồn model trả 1536 × 1024, 4 cột × 3 hàng. Cắt theo hàng 341/342/341 px, dùng scale đều hai trục; không ép nguồn về tỷ lệ guide 1536 × 960. Nhãn pha trong preview mô tả pose để review, không điều khiển collision/physics.

## Review ảnh và giới hạn

Đã xem cả 12 pose trên nền tối/sáng và ảnh so phóng cùng tỷ lệ; soi vai–nách–cổ tay–chuôi kiếm, eo/khăn bụng, chân và các khung đầu/cuối. Vùng chân dưới tại native y ≥ 220 có bề ngang alpha 81–154 px. Chỉ số này gồm cả giáp ống chân, không phải khoảng cách chính xác hai đế giày. Cả 12 ô không có alpha chạm biên; không có mảnh rời lớn hơn 3 px ở ngưỡng alpha 128. Các kiểm tra đó chỉ bổ trợ việc xem hình, không chứng nhận cơ học cơ thể hoàn hảo.

Hai GIF giải mã đủ 12 frame. 43 file asset đã chốt từ hồ sơ publish 10.52 vẫn khớp SHA256, gồm Idle 10.47, run hiện hành và combat 10.51. Game/src/public và catalog production không thay; chưa commit/merge/push. Browser/runtime/test/build/lint/typecheck/formatter **NOT_RUN**. Chờ người dùng review dáng, tỷ lệ và nhịp chạy.

## Nguồn / dựng lại

Nguồn ở integration/ninja-run-compact/: plan.json, run-source.png, run-first-pass.png, pose-guide.json, pose-guide-initial.json, mechanics-guide.png, art-direction.txt, các ảnh tham chiếu production và preview source. Đây là thư mục authoring candidate.

Windows PowerShell 5: powershell -NoProfile -ExecutionPolicy Bypass -File scripts/prepare_ninja_run_compact.ps1. Sau đó node scripts/assemble_ninja_run_compact_review.mjs dựng GIF. draw-guide.ps1 chỉ vẽ guide cơ học, không tạo artwork nhân vật. Không chạy publisher hoặc generator production.
