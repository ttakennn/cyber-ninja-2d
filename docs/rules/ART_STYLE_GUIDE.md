# Art Style Guide — chung toàn game

Phong cách xuyên suốt: **Illustrated textured pixel art, sprite 2D**. Giữ cách tạo khối, độ chi tiết, texture, shading, viền tối có kiểm soát và chất lượng sprite nhất quán. Không tự chuyển sang vector phẳng, low-poly/3D render, ảnh chụp hoặc một style chibi/8-bit khác.

## Phần chung và phần riêng

| Phạm vi | Quy định |
| --- | --- |
| Toàn game | Ngôn ngữ tạo hình 2D, chất lượng texture/shading, tính nhất quán sprite và pipeline |
| Từng map | Palette, độ sáng, ánh sáng, thời điểm, khí hậu, kiến trúc và chủ đề theo brief riêng |
| Từng nhân vật | Danh tính, màu trang phục, tỉ lệ/cơ thể, kích thước, frame và animation theo hồ sơ riêng |

Map01 là phố Việt ban đêm với navy/indigo/neon/amber. **Đây không phải palette bắt buộc cho Map02/03.** Map mới có thể tươi sáng, ấm/lạnh hoặc có bảng màu khác theo chủ đề nhưng vẫn cùng bản chất Illustrated textured pixel art. Khi brief chưa xác định palette/chủ đề quan trọng, đề xuất cụ thể để người dùng chọn; không tự sao Map01 hoặc tự chốt thiết kế.

Asset đã duyệt giữ chuẩn trong phạm vi của nó. Không recolor toàn bộ asset dùng chung, đổi danh tính hoặc scale nhân vật để hợp một map. Biến thể theo map phải là asset/placement riêng, không ghi đè nguồn đang dùng ở map khác nếu chưa được phép.

## Làm artwork

- Xem PNG và metadata đã chốt của đúng map/nhân vật. Tham chiếu map khác để giữ kỹ thuật/style, không buộc sao màu hoặc nội dung.
- Ưu tiên nguồn phù hợp hiện có; không dùng screenshot như texture runtime. Giữ aspect, chân hình, độ nét và các lớp hiển thị theo placement.
- Đổi đúng vùng/clip được giao; giữ nguyên phần còn lại. Không fit từng frame độc lập, kéo giãn atlas, đổi pivot hoặc sửa physics để che lỗi ảnh.
- Nếu tạo/chỉnh ảnh, ghi rõ style chung, palette/chủ đề cục bộ, tham chiếu và invariants. Lưu prompt/source/provenance, phân biệt candidate với bản được duyệt.
- Chưa rõ phần nghệ thuật nào thì hỏi riêng phần đó và tiếp tục phần độc lập. Không tự gọi placeholder/final hoặc bỏ qua review.
