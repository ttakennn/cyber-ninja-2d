# Task 10.26 — thư viện hoạt ảnh Huyết Đao Khan

Người dùng chốt art Diệt Nguyệt Thập Tự của Task10.25 và yêu cầu một điểm xem đầy đủ trong `docs/characters/boss-khan/animation/` trước khi commit. [Mở preview tổng hợp](../../../characters/boss-khan/animation/preview.html).

Đã đưa hai sheet `aerial` và `moon-cross` vào [art production](../../../characters/boss-khan/animation/moon-cross/README.md) bằng publisher, sao chép PNG nguyên byte từ snapshot10.25. Metadata/preview và hash nằm trong `docs/characters/boss-khan/animation/moon-cross/`, `atlas.json`, `production.json`. Preview cơ bản cũ được giữ nguyên tại `basic-preview.html`; trang tổng hợp mới mở lại chính các preview đã chốt cho động tác cơ bản, màn xuất hiện, combo, lướt và ba skill. Chọn nhóm trong thanh nút; các điều khiển phát/tua nằm trong khung preview của nhóm đó.

Nhịp và đường chuyển động trên các preview chỉ để duyệt art. Chưa tích hợp boss/AI/spawn/hitbox/damage vào game. Người dùng đã chọn kiểu preview tổng hợp + preview cơ bản riêng và yêu cầu commit bộ art Khan. Chưa kiểm tra preview trong trình duyệt; không chạy test/build/lint/typecheck/formatter theo hướng dẫn hiện hành.
