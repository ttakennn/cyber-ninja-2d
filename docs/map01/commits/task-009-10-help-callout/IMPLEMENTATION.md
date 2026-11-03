# Task09 — ẩn hướng dẫn và tinh chỉnh chữ tên chiêu

Ngày2026-11-03. Tiếp tục working tree special1/UI chưa commit; không commit/merge/push trong lượt này.

- H bật/tắt riêng khung hướng dẫn phía dưới. Mặc định giữ hiện; nhấn lại hiện lại. Dùng action toggleHelp/KeyH theo InputManager hiện có nên giữ phím không lặp, không nhận khi nhập vào ô soạn thảo hoặc dùng Ctrl/Alt/Meta. Trạng thái chỉ giữ trong phiên trang, không thêm lưu trữ. index.html bổ sung gợi ý phím H.
- Tên chiêu trên đầu bỏ nền, border, padding và bóng của khung; chỉ giữ chữ. Cỡ responsive giảm đúng2px so với clamp(14px,1.5vw,22px), thành clamp(12px,calc(1.5vw - 2px),20px). Gradient trắng kem/vàng sáng/hồng, bóng tối mỏng và quầng sáng bám theo nét chữ để đọc trên background. Giữ nổi nhẹ/mờ dần1500ms, vị trí và điều kiện hiện cũ.
- File mã: src/input/InputManager.ts, src/core/Game.ts, src/styles/main.css, index.html. Không đổi HUD hồi chiêu, tốc độ cầu, physics, animation, asset hoặc kích thước nhân vật.

Đã đọc source/consumer và rà diff; **NOT_RUN:** test/build/typecheck/lint/formatter, trình duyệt/gameplay/resize/console và ảnh runtime. Yêu cầu hiện tại không cấp phép lệnh validation. Cần review hình thức chữ và H trong game; chưa tuyên bố nghiệm thu production.
