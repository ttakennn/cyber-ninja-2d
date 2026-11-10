# Run V11 — QC bản nháp

**DRAFT — CHƯA DUYỆT. Không đủ điều kiện thay production.**

24 PNG RGBA384×320, pivot(192,289); run_start6frame×100ms=600ms, run_loop18frame×50ms=900ms/20FPS. Tạo bằng host image_gen; không video/API. Frame01 là pixel production gốc. Các frame mới dùng cùng scale251/284, không fit bbox từng frame; row roots được ghi trong animation-timing.json. Scale chung không bảo đảm mô hình giữ tỷ lệ anatomy.

## Kết quả kiểm tra ảnh

- 24frame đúng mode/kích thước, có alpha thật, không pixel solid chạm biên.
- 24crop atlas khớp RGBA tuyệt đối với frame nguồn; frame01 khớp Idle production.
- Forge clip builder:0lint warnings, preview WebP được tool giải mã kiểm tra; trạng thái vẫn needs-visual-review.
- Nguồn nền/quầng đầu tiên bị loại, đã sửa cục bộ thành chroma rồi key mềm bằng Forge. Nhóm giữa được sửa riêng leg depth. Các nguồn trước được giữ trong raw/.

## Lỗi thị giác còn lại — không chấp nhận các pose02–24

- Texture/tạo khối mới mượt hơn production; vai và bắp tay phồng, tỷ lệ đầu/thân chưa giữ chính xác. Đặc biệt rõ ở06→07.
- Góc thân khi chạy chưa đạt chắc chắn30°; nửa thân trên và tay giữ kiếm quá tĩnh, xoay vai/hông chưa đủ.
- Nửa chu kỳ chân đối bên13–24 còn mơ hồ dù đã chỉnh riêng; contact/flight thực tế có chỗ không khớp nhãn kế hoạch.
- Có nhảy pose ở ranh nhóm; khăn đổi shape theo nhóm. Vòng24→07 vẫn cần chỉnh biên độ chân và timing sau khi sửa anatomy.
- Chưa chứng minh chân không trượt khi di chuyển. Không dùng gán pivot làm bằng chứng chân trụ ổn định.
- Không tự duyệt bàn tay/grip chỉ dựa QC số; cần đối chiếu phóng lớn reference10.51 trước khi chốt.

## WARN/FAIL nguyên văn từ QA

```json
{"file": "qc\\run-loop\\sheet-qc.json", "id": "leg_alternation", "status": "warn", "value": ["near", "near", "unclear", "far", "far", "unclear", "unclear", "unclear", "unclear", "unclear", "near", "near", "near", "near", "near", "near", "unclear", "near"], "threshold": "lead differs between i and i+n/2", "verdict": "mixed: some half-cycle pairs repeat the lead", "pairs": [[1, 10, true], [3, 12, false], [4, 13, false]], "mode": "auto-luminance", "near_leading": 9, "unclear": 7, "half_cycle": {"pairs": [{"pair": [0, 9], "iou_best_shift": 0.6361}, {"pair": [1, 10], "iou_best_shift": 0.7001}, {"pair": [2, 11], "iou_best_shift": 0.6436}, {"pair": [3, 12], "iou_best_shift": 0.7753}, {"pair": [4, 13], "iou_best_shift": 0.8183}, {"pair": [5, 14], "iou_best_shift": 0.8084}, {"pair": [6, 15], "iou_best_shift": 0.7487}, {"pair": [7, 16], "iou_best_shift": 0.8318}, {"pair": [8, 17], "iou_best_shift": 0.7574}], "adjacent_iou_median": 0.7739, "half_cycle_iou_median": 0.7574}, "fix": "regenerate frames 9-17 with NEAR and FAR swapped (attach frames 0-8 and the guide)"}
```

```json
{"file": "qc\\run-loop\\sheet-qc.json", "id": "torso_drift", "status": "warn", "value": 4.55, "threshold": 2.0, "method": "trunk", "median_x": 202.5, "note": "range of the torso x in game px; scale_frames --root-lock torso-x removes it"}
```

```json
{"file": "qc\\run-loop\\sheet-qc.json", "id": "seam", "status": "warn", "value": 1.55, "threshold": 1.5, "transitions": [[8, 9], [5, 6]], "note": "largest frame-to-frame change over the median step; review these joins first"}
```

```json
{"file": "qc\\run-start\\sheet-qc.json", "id": "identity_head_ratio", "status": "fail", "value": {"0": 0.958, "1": 0.938, "2": 0.938, "3": 1.042, "4": 1.042, "5": 1.042}, "threshold": [0.95, 1.05], "frames": [1, 2], "note": "head scale against the median frame (master template)"}
```

```json
{"file": "qc\\run-start\\sheet-qc.json", "id": "torso_drift", "status": "warn", "value": 25.83, "threshold": 2.0, "method": "trunk", "median_x": 196.8, "note": "range of the torso x in game px; scale_frames --root-lock torso-x removes it"}
```

## Bàn giao / giới hạn

preview.html có chọn start/loop/ghép, tua từng frame, nền sáng/tối/checker, tốc độ và onion-skin. Mở trực tiếp file cục bộ; review-data.js tránh fetch JSON qua file://. Chưa chạy browser để xác minh UI. GIF chuẩn start là run_start-once.gif; run_start.gif giữ bản thử lặp trước đó. run_loop.gif và combined.gif có lặp.

run_start-runtime.json và run_loop-runtime.json theo loader hiện tại, kind development; không tích hợp. Canonical PNG/JSON, loader, physics và code production không thay. Không build/lint/typecheck/test/commit. Tất cả file mới trong workbench này theo brief, không ghi báo cáo ngoài thư mục đã chỉ định.

Image-only dễ lệch anatomy/texture, mất phân biệt chân gần/xa; các thông số pose là ý định prompt, không phải bằng chứng hình đã đạt. Cần chỉnh cục bộ anatomy/grip/pha chân còn lỗi trước khi xin duyệt production.