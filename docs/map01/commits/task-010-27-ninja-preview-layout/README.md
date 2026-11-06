# Task 10.27 — bố cục preview Ninja Hỏa theo mẫu Khan

Người dùng yêu cầu [preview tổng hợp](../../../characters/ninja/animation/preview.html) và [basic preview](../../../characters/ninja/animation/basic-preview.html) của Ninja Hỏa theo cách xem đã chọn cho Huyết Đao Khan. Đây là hồ sơ lịch sử của task UI; bản art production vẫn ở `docs/characters/ninja/animation/`.

## Thay đổi

- Giữ renderer preview Ninja cũ trong `basic-preview.html`, cho phép chọn riêng các nhóm bằng query `group=combo`, `shuriken`, `special`, `nine`; nhóm mặc định chỉ hiển thị các clip động tác cơ bản. Các phép dựng composite Minh Vương/Cửu Long và metadata hiện có được tái sử dụng.
- `preview.html` là trang chọn bảy nhóm: cơ bản, combo, phi tiêu, hai tuyệt kỹ, Thiên Hỏa Giáng Lâm và Thiên Hỏa Tái Lâm. Mỗi nhóm mở preview với điều khiển riêng, kèm link atlas hoặc bảng frame tương ứng. Không tạo lại PNG, không đổi atlas/JSON/pivot/scale/FPS, không sửa runtime.
- Cập nhật danh mục Ninja và quy tắc production: mọi task chỉnh preview/art nhân vật Map01 vẫn phải ghi hồ sơ mới trong `docs/map01/commits/`, kể cả khi chỉ đổi giao diện xem.

## Giới hạn

Đi/chạy vẫn dùng cùng clip run; nhóm kỹ năng trên Canvas2D vẫn là minh họa art, chưa xác nhận shader/collision/damage trong game. Màn xuất hiện/hồi sinh chưa được tích hợp runtime. Đã mở `preview.html` bằng file cục bộ trong Chrome, thấy menu nhóm combo/phi tiêu và Canvas con tải được; chưa duyệt hết bảy nhóm bằng mắt. IAB không kết nối được localhost trong phiên này. Test/build/lint/typecheck/formatter **NOT_RUN** theo hướng dẫn hiện hành. Chưa commit hoặc merge task này.
