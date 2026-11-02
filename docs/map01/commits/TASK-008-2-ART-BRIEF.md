# Task 008.2 — Artwork còn thiếu

Người dùng đã chọn **“Lập brief, chờ asset tôi cung cấp”** trong chat. Không tạo artwork mới, không tự thay phong cách và không gọi mặt đứng tạm là final. Các kích thước dưới đây là yêu cầu đề xuất để bàn giao asset, chưa phải chứng nhận asset đã có/đã duyệt.

## Quy ước chung

PNG RGBA, 128 pixel/world unit (tile 64px = 0.5 unit); hình 2D stylized Vietnamese Urban Night theo background đã duyệt. Navy/indigo/violet, bê tông xanh trầm, đèn amber; cyan/đỏ chỉ điểm nhấn. Không photorealism, không bake Ninja hoặc thang/prop tương tác vào tường. Gốc tọa độ ảnh trên trái; world Y hướng lên. Artwork chỉ visual, không thêm floor/collider. Không để gờ/bậu ngang trông như sàn đi mới.

Giữ PNG/metadata nguồn hiện hành. Asset mới cần metadata runtime riêng: đường dẫn, kích thước pixel, bounds world, anchor bottom-center, source/tác giả/giấy phép, SHA-256, phiên bản và trạng thái duyệt. Không ghi đè `APPROVED_*` của nguồn để coi asset mới đã được chấp thuận.

## A — Mặt tiền trên hầm

Đề xuất `facade-a-passage.png`, **640×640 px**, world X=12..17, Y=-1.5..3.5 (5×5 unit), bottom-center=(14.5,-1.5).

Cần tường không có sọc dọc lặp, chia tầng/mảng vữa có chủ ý, viền mái trên và gờ đáy nối cửa. Không vẽ xuống vùng cúi Y=-2.5..-1.5. Giữ đọc rõ hai cửa vào/ra X=12 và X=17. Ưu tiên không bake lại cửa/đèn đang có: cửa cuốn 297×346 px/world 2.65×3.0872 tại (13.4,-1.5), cửa/mái hiên 303×330 px/world 2.85×3.104 tại (15.55,-1.5), đèn 172×153 px/world 0.9×0.8006 tại (14.5,2). Nếu cần thay đồng bộ cửa, bàn giao cả cụm và nêu rõ decal cũ nào cần tắt; chưa tự chọn thay trong task này.

## C — Mặt đứng dưới mái

Các ảnh không gồm parapet; đỉnh mặt đứng chạm đáy phần solid mái hiện có. Không vẽ ra ngoài bề ngang và không bắc qua khe nhảy. Nền vữa/kiến trúc không lặp theo hàng 64px; cửa sổ/bậu chìm không tạo mặt đi giả.

| Đề xuất file | Pixel | World bounds | Bottom-center |
| --- | --- | --- | --- |
| `facade-c-upper.png` | 1408×448 | X37..48, Y-2.5..1 | (42.5,-2.5) |
| `facade-c-roof2.png` | 1024×576 | X50..58, Y-2.5..2 | (54,-2.5) |
| `facade-c-roof3.png` | 1024×640 | X60..68, Y-2.5..2.5 | (64,-2.5) |
| `facade-c-roof4.png` | 1280×576 | X70..80, Y-2.5..2 | (75,-2.5) |

Giữ khe X48..50/58..60/68..70 trong suốt. Mép đi thật ở Y2/3/3.5/3 vẫn do mái/parapet thể hiện. Ở đoạn X37..40 mặt đứng nằm sau player đang đi dưới ban công; không thể hiện nó như tường collision chắn đường phố. Cần nối màu/nét với parapet nguồn `foreground/individual/parapet_wall.png` (525×120 px), không đổi metadata PNG này.

## B — Tường gắn thang và AC

Đề xuất tách hai mảng để không vẽ một bức tường lớn che ban công/khoảng nhảy:

| Đề xuất file | Pixel | World bounds | Mục đích |
| --- | --- | --- | --- |
| `wall-b-ladder.png` | 192×832 | X28.25..29.75, Y-2.5..4 | Tường hậu cảnh 1.5×6.5 unit sau thang X29, không bake bậc/ray vào ảnh |
| `wall-b-ac-mount.png` | 256×256 | X35..37, Y-1.5..0.5 | Mảng tường/gá lắp phía sau AC tại (36,-0.9), prop world 0.7984×0.618 |

Không che ray/bậc hoặc nhân vật khi leo. Tường chỉ hậu cảnh, không có gờ ngang báo hiệu sàn mới. Thang thép hiện có giữ màu `#3e536e`, highlight `#8b98aa`, bậc cách 0.4 unit và kích thước vùng leo cũ. Nếu muốn texture thang thay hình học, cần ảnh riêng **128×832 px** cho world X28.5..29.5/Y-2.5..4, alpha giữa ray/bậc, bậc khớp khoảng 0.4 unit; đây là lựa chọn mỹ thuật cần duyệt thêm, chưa tự yêu cầu thay controller.

## Điều kiện nhận asset

So với ảnh baseline A/B/C/dọc trong `docs/task-008-fix-*.jpg`; sau tích hợp phải chụp lại toàn bộ từ cùng bản production cuối trên Chrome/Edge ở 1920×1080, 1280×720, 1024×768 và 540×960, ghi DPR/console/commit. Các mục này đang mở; brief không thay thế nghiệm thu runtime hoặc art approval.
