# Task 10.28 — Ninja Hỏa: tối ưu điều khiển và chuỗi preview

- Production: [preview](../../../characters/ninja/animation/preview.html), [basic-preview](../../../characters/ninja/animation/basic-preview.html).
- Thêm Frame trước/Frame sau, đi qua biên các clip trong chuỗi. Clip đơn/chuỗi pose duyệt theo frame metadata; các bản ghép VFX tua theo mốc 25ms.
- Cơ bản gồm 5 lựa chọn: đứng/thở, đi/chạy, nhảy/rơi/tiếp đất, trúng đòn/hồi thế, cúi/giữ. Bỏ các mục nhảy/rơi/tiếp đất riêng khỏi menu; giữ dữ liệu gốc để ghép. Leo lên/xuống/dừng chuyển sang nhóm riêng.
- Combo có lựa chọn ghép 1 → 2 → 3 và giữ từng đòn riêng. Phi tiêu có bản ghép nhân vật đứng/cúi với projectile theo release offset, thời điểm và tốc độ từ manifest.
- Không sửa PNG, JSON, pivot, scale hoặc runtime. Hồi thế tái sử dụng Idle; độ cao nhảy 150px ở zoom 1 chỉ là minh họa. Không tạo pose mới hoặc xác nhận gameplay.
- Đã đọc source, metadata và rà diff. Browser/test/build/lint/typecheck/formatter NOT_RUN theo hướng dẫn; chưa commit. Cần người dùng review nhịp ghép và vị trí phi tiêu trong preview.
