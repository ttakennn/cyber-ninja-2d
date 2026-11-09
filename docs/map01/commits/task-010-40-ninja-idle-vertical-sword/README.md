# Task10.40 · giữ mắt gốc, kiếm thẳng đứng giữa lưng

Ngày2026-11-08. **CANDIDATE_PENDING_REVIEW**. Người dùng chỉ định atlas production để sửa mắt/chi tiết sai và yêu cầu kiếm nằm giữa lưng thẳng lên. Chưa chốt để publish; vẫn chỉ Idle đứng/thở.

[Mở preview](preview.html) · [So toàn thân](comparison.png) · [So đầu–mắt4×](face-comparison.png) · [Atlas6frame](idle-atlas.png) · [Lớp kiếm riêng](back-sword.png) · [Nguồn/hash/audit](provenance.json).

## Review và cách sửa

Candidate10.39 làm đổi độ mở mắt, viền mũ/mặt nạ và một số nét đầu; kiếm vẫn chéo. Đã xem trực tiếp atlas production người dùng nêu và ảnh crop phóng lớn so với candidate trước. Lần này giữ pixel production ở các vùng không cần sửa, thay vì dùng toàn bộ thân được imagegen vẽ lại.

- Đầu–mắt, tay, chân, khối cơ, scarf và phần trang phục ngoài vùng xử lý kiếm cũ lấy từ chính6frame production, không scale cơ thể. Vùng đầu audit(190,30,55,75) giữ nguyên RGBA.
- Chỉ vá phần kiếm/bao kiếm/hardware cũ ở hông bằng artwork phục hồi từ imagegen; không lấy các nét đầu được vẽ lại trong source đó vào output.
- Kiếm có bao là **một lớp liền riêng**, đặt thẳng đứng phía sau giữa lưng, trụcX174/top9/cao230 trong source frame. Chuôi/bao chung một transform; không có hai đoạn chéo bị che rồi nối lệch. Thân/khăn/tay/quần gốc che lớp kiếm phía sau.
- Canvas384×320, pivot192,289 và160px/world unit giữ nguyên. Body không đổi chiều cao251px; phần hilt nhô lên trên đầu không làm cơ thể bị thu nhỏ. Nhịp6frame/7.1429fps lấy metadata production.

## Kiểm tra thực tế

Đã xem source production, so mặt trước/sau, atlas đóng gói và comparison. Lượt kiểm tra ảnh theo yêu cầu đối chiếu pixel thực tế sau đóng gói cho cả6frame:

| Vùng | Kết quả |
| --- | --- |
| Đầu–mắt rect190,30,55,75 | 0pixel khác production trong mỗi frame |
| Ngoài các vùng hông/kiếm được phép | 0pixel khác production trong mỗi frame |
| Lớp kiếm | Cùng một ảnh nguyên chiều, trục đứng cố định sau thân cho6frame |

Đã mở rộng mask vùng bỏ kiếm hông để loại các mảnh cap/shaft cũ còn sót qua các pose rồi xem lại atlas. Audit không chứng nhận toàn vùng hông vẽ mới giống production từng pixel; vùng này phải được review về đường nối quần áo và occlusion. `cleanup-inspection.png` là ảnh trung gian, không phải bản final candidate; `body-atlas.png` và `back-sword.png` là hai lớp dùng trong atlas ghép.

Preview có so cùng frame, chồng production35%, trục đứng và ảnh mắt4×. **Browser NOT_RUN** cho preview mới; chưa xác nhận toàn vòng chuyển động/các nút trong browser. Test/build/lint/typecheck/formatter **NOT_RUN**. Không dùng kiểm tra task trước để chứng nhận task này.

Chưa thay PNG/JSON production, src/public, input/physics/collider/AI hoặc timing runtime; chưa commit/merge/push. Idle gặp quái và chạy giữ chờ chốt phần này. Nguồn/prompt/plan tại `integration/ninja-idle-vertical-sword/`, generator tại `scripts/prepare_ninja_idle_vertical_sword.ps1`; các thay đổi từ task trước và snapshot cũ được giữ nguyên.
