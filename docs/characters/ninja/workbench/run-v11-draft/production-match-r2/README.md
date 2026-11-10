# Run V11 — sửa ngoại hình production R2

Tạo mới frame02–24 bằng host image_gen theo yêu cầu sửa kích thước, màu, độ sáng, anatomy và texture; frame01 giữ nguyên pixel production. Chuyển động/thứ tự24pose/timing giữ cấu trúc V11. Đây là draft chờ người dùng review, không thay production hoặc tích hợp runtime.

- [Mở preview R2](preview.html)
- [Contact sheet24frame](contact-sheet.png)
- [Production / V11 cũ / R2](production-comparison.png)
- [So Run production](run-production-comparison.png)
- [RUN_START600ms](run_start-once.gif), [RUN_LOOP900ms](run_loop.gif), [ghép](combined.gif)
- [QC và giới hạn](QC.md), [QC JSON](qc-report.json)
- [Timing](animation-timing.json); PNG trong frames/, atlas run_start.png và run_loop.png, metadata *-runtime.json.
- Nguồn ảnh tạo ở raw/, prompt thực tế ở prompts/, reference production ở references/. Mẫu màu/hash và đường cong chuyển màu dùng chung nằm trong qc/color-transfer.json; alpha report ở qc/matte-reports.json.

Forge matte và OKLab được dùng cho xử lý ảnh; Forge clip builder tạo onion/filmstrip trong forge-clips/review/. Không dùng video/API. Chưa chạy browser hoặc test/build/lint/typecheck. Mắt/nếp vải/cán kiếm vẫn có sai biệt ảnh tạo mới; chưa tuyên bố khớp production100% hoặc tự duyệt.
