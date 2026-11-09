# Task10.42 · sửa hai vùng đỏ/vàng người dùng đánh dấu

Ngày2026-11-08. **CANDIDATE_PENDING_REVIEW**. Không thay production khi chưa được duyệt. Nguồn tạo hình chuẩn tiếp tục là `docs/characters/`; task này chỉ sửa cục bộ hai vùng trên snapshot10.41.

[Preview từng frame](preview.html) · [Soi hai vùng trước/sau · cả6frame](contact-review.png) · [GIF trước/sau](motion-preview.gif) · [Atlas mới](idle-atlas.png) · [Nguồn/hash/audit](provenance.json).

## Review và sửa

| Đánh dấu | Nguyên nhân ở10.41 | Sửa trong10.42 |
| --- | --- | --- |
| Đỏ · cạnh nắm tay | Vùng bảo vệ găng tay giữ lại một phần cán nâu/đen và red-wrap bên trái nắm tay | Crop và soi6vùng tay; imagegen cung cấp hướng dẫn alpha, chỉ bỏ phần cán ngoài contour găng/ngón tay; không lấy màu găng vẽ lại thay cả tay |
| Vàng · gốc chuôi | Giới hạn nhìn thấy của lớp kiếm cắt theo y58+độ dịch vai, kết thúc trước alpha mép khăn ở một số pose | Hạ cả kiếm8px, tìm alpha tiếp xúc khăn/lưng theo từng frame, cho gốc chuôi chồng3px sau lớp cơ thể |

Giữ nguyên hướng kiếm thẳng đứng, kích thước kiếm ngắn và chuyển động theo vai của10.41. Chỉ đổi độ cắm sau khăn, không kéo dài để lộ đầu bao dưới. Vị trí tiếp xúc khăn6frame: y61/58/61/62/64/61; giới hạn sau lớp cơ thể y64/61/64/65/67/64. Độ dịch vai vẫn `(0,0),(2,-1),(-6,-2),(-6,0),(-8,0),(-6,-2)`px.

Giữ canvas384×320, pivot192,289,6pose và7.1429fps. Không scale/repaint cơ thể production. Ảnh trước/sau trong GIF dùng snapshot10.41 và candidate10.42; ảnh production riêng vẫn có trong preview để đối chiếu danh tính.

## Đã kiểm tra

- Đã soi crop tay ban đầu và bảng chi tiết trước/sau cho đủ6frame sau đóng gói; đã xem atlas mới. Không chỉ dựa vào số pixel vùng mắt để suy chất lượng vùng sửa.
- Xóa112/158/114/131/146/105pixel alpha tại vùng cán/contour ngoài tay qua6frame. Đây là số pixel được xử lý, không là phép đếm “vũ khí còn lại”; contour và dáng tay được xem riêng trong bảng review.
- Dọc đường giữa nối gốc chuôi với điểm tiếp xúc khăn:0pixel alpha hở trong cả6frame. Chỉ chứng nhận đường kiểm tra đó, không phải mọi bóng đổ quanh cổ kiếm.
- Các ROI đầu(190,30,55,75), bụng(194,105,35,23), đai(204,128,24,17):0pixel khác10.41 mỗi frame. Phần dưới giới hạn nhìn thấy:0pixel khác body không kiếm, không thêm đầu bao lộ dưới.
- GIF trước/sau800×400/6frame đã được mở bằng bộ giải mã ảnh; PNG atlas vẫn là nguồn chất lượng, GIF chỉ phục vụ review.

**Browser NOT_RUN** cho preview42; chưa xác nhận vòng chuyển động/nút trong trình duyệt. Test/build/lint/typecheck/formatter NOT_RUN. Không dùng thử browser bị dừng ở task41 làm bằng chứng task này.

Chưa đổi PNG/JSON production, src/public, input/physics/collider/AI/timing runtime; chưa commit/merge/push. Hai phần gặp quái/chạy vẫn chờ chốt Idle. Giữ nguyên snapshot và thay đổi chưa commit trước đó. Nguồn tại `integration/ninja-idle-contact-fix/`, generator `scripts/prepare_ninja_idle_contact_fix.ps1`, GIF packer `scripts/assemble_ninja_idle_contact_review.mjs`.
