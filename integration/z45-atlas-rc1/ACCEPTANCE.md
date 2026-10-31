# Điều kiện nghiệm thu sau tích hợp

Gói hiện là RC1; các mục runtime bên dưới chưa thực hiện.

- Resolve đúng 22 ID, không trùng; không còn URL five-zone-graybox cho 12 asset đã thay. Giỏ hoa và hai đèn tường giữ nguyên.
- 14 PNG, 4 atlas đúng URL; UV không lấy sang asset khác. Không viền đen, alpha rác hoặc lem màu khi camera di chuyển.
- Giữ terrain, physics, spawn, 12 solids, một climbable và camera bounds. Không thêm vật cản tại X80..88 hoặc X120..136.
- Cổng có hình ảnh mở. Chậu, đèn, crate và pallet chạm đường Y=-2.5, không lơ lửng hoặc chìm.
- Đứng X93 đọc đủ “Hủ tiếu nam vang” trên hai dòng; X105 đọc đủ “Siêu thị”. Dấu Việt đúng, chữ không bị HUD che ở bốn viewport.
- Player đứng/cúi/nhảy vẫn rõ trên cửa cuốn; backdrop không che sprite. Combat chưa thuộc nghiệm thu này.
- Ảnh thật tại landing, noodle, market, entry/core/exit và nối X120/136; viewport 1920×1080, 1280×720, 1024×768, 540×960. Ghi cả viewport yêu cầu và kích thước ảnh thực, DPR/browser nếu đọc được.
- Đi tuyến cũ → C → D → E và respawn; ghi console nếu được kiểm. Không dùng ảnh ghép authoring làm ảnh game.
- Các mục P1/P2 art/UI trong REVIEW.md phải được đóng hoặc chủ dự án chấp nhận rõ trước khi gắn nhãn production.
- Test/build mới chỉ chạy khi người dùng yêu cầu. Log 388 test của Sol chỉ là baseline graybox.

