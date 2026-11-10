# V11 · Sửa ngoại hình theo production · R2

**DRAFT — chờ người dùng xem; chưa chốt production.**

- Đã sửa artwork02–24 bằng host image_gen từ đúng PNG production; frame01 giữ nguyên RGBA.
- Giảm vai/bắp tay phồng, sửa tỷ lệ đầu/thân và màu da, đưa lại texture vải/giáp theo production. Không dùng hệ số brightness chung lên cả ảnh.
- Mẫu màu lấy trực tiếp từ atlas locomotion production, dùng một bộ đường cong OKLab theo nhóm vật liệu trên toàn23frame; alpha giữ nguyên. Quy tắc và mẫu ghi ở qc/color-transfer.json.
- Canvas384×320/pivot(192,289), cùng scale0.96 cho mọi pose mới; chỉ khai báo root theo hàng để xử lý độ lệch bố cục ảnh trả về. Không fit bbox từng frame.
- Giữ24frame: run_start6×100ms=600ms; run_loop18×50ms=900ms. Giữ hướng phải và thứ tự pose.
- Đã mở contact sheet24frame, bảng production/cũ/mới và frame riêng. Bản sửa gần hơn về màu và độ sáng, nhưng không tuyên bố khớp100% texture/anatomy: mắt, nếp vải, cán kiếm và một số bề rộng chi vẫn là ảnh tạo mới.
- Đã kiểm tra ảnh cần thiết:24RGBA đúng kích thước/alpha;0pixel solid chạm biên;0pixel cắt khi đăng ký;24crop atlas khớpPNG; frame01 khớpRGBA gốc; hash atlas production giữ nguyên. Forge clip builder0lint warnings, needs-visual-review.

## WARN/FAIL nguyên văn

```json
{"file": "qc/appearance/sheet-qc.json", "id": "torso_drift", "status": "warn", "value": 20.7, "threshold": 2.0, "method": "trunk", "median_x": 202.5, "note": "range of the torso x in game px; scale_frames --root-lock torso-x removes it"}
```

```json
{"file": "qc/appearance/sheet-qc.json", "id": "seam", "status": "warn", "value": 2.43, "threshold": 1.5, "transitions": [[5, 6], [11, 12]], "note": "largest frame-to-frame change over the median step; review these joins first"}
```

## Tệp xem lại

- preview.html: chọn start/loop/ghép và tua từng frame.
- contact-sheet.png:24frame trên cùng nền sáng để so màu.
- production-comparison.png:Idle production / V11 cũ / R2 ở cùng pixel scale.
- run-production-comparison.png:Run production / V11 cũ / R2; pose khác nhau, không dùng bbox cả người để suy scale.
- forge-clips/review/:onion, filmstrip nền sáng/tối/checker.
- frames/, run_start.png, run_loop.png, GIF, animation-timing.json và metadata runtime giữ contract.

Chưa chạy browser/test/build/lint/typecheck/formatter. Không thay production, code nguồn, loader hoặc public/assets; không commit. V11 cũ giữ nguyên, chỉ có bảnR2 mới trong thư mục này. Quy trìnhảnh-only, khôngvideo/API.