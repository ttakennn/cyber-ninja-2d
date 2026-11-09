# Task10.41 · sửa bụng và đồng bộ kiếm với Idle production

Ngày2026-11-08. **CANDIDATE_PENDING_REVIEW**. Phản hồi: kiếm quá dài/lộ đầu bao dưới, bụng ghép lệch, kiếm không đi theo thân. Người dùng xác nhận repo chính và `docs/characters/` là chuẩn nhân vật đã chốt. Đã ghi ràng buộc nguồn và kiểm tra seam/chuyển động vào AGENTS/spec/DECISION_LOG; không xem đó là duyệt art mới.

[Preview có soi bụng4×](preview.html) · [GIF toàn thân + bụng](motion-preview.gif) · [So ảnh tĩnh](comparison.png) · [Atlas6frame](idle-atlas.png) · [Nguồn/hash/audit](provenance.json).

## Sửa gì

| Lỗi | Bản10.41 |
| --- | --- |
| Kiếm dài230px, đầu bao lộ dưới quần | Rút lớp kiếm175px, chỉ hiển thị phần trên khoảng y18–58 ở frame đầu; phần dưới được che hoàn toàn |
| Bụng/đai bị vá lệch | Cơ thể production giữ nguyên kích thước, phục hồi quanh hình kiếm cũ; giữ vùng bụng/đai còn thấy của gốc, căn vùng phục hồi theo đúng frame |
| Kiếm đứng yên trên canvas | Đo mốc vai từ đúng production pose, dịch toàn bộ kiếm cùng mốc đó qua6frame; không scale lại thân hoặc giả chuyển động bằng dịch nguyên nhân vật |
| Khó review phần vá khi chỉ nhìn tổng thể | Có ảnh/GIF so đồng pha, chi tiết bụng4× và thông số neo lưng từng frame |

Độ dịch vai/kiếm6frame, so với frame0: `(0,0),(2,-1),(-6,-2),(-6,0),(-8,0),(-6,-2)`px. Lấy từ tâm vùng da vai production trong ROI150,75,46,43, không lấy khăn đang bay. Hilt/guard/bao là một lớp cứng cùng transform; phần dưới bị occlude theo mốc vai. Chuyển động cơ thể, mặt, tay, chân là các pose production; không dùng thân ở candidate cũ.

Canvas384×320, pivot192,289,160px/world unit và6frame/7.1429fps giữ theo metadata production. GIF6frame140ms/frame xấp xỉ nhịp840ms của production; GIF chỉ review, atlas PNG vẫn giữ chất lượng nguồn.

## Kiểm tra ảnh đã thực hiện

Đã xem production, ảnh lỗi bụng trước, atlas mới toàn6pose, comparison và ảnh chi tiết frame0/frame4 trong chu kỳ. Đọc lại các chuẩn chung/nhân vật/production và dữ liệu nguồn trước authoring. Bộ xuất GIF được mở bằng bộ giải mã ảnh, nhận1000×820/6frame.

Audit từng frame trong provenance:

- Đầu–mắt rect190,30,55,75:0pixel khác production.
- Vùng bụng rect194,105,35,23 và đai phía trước rect204,128,24,17:0pixel khác production.
- Ngoài vùng sửa cho phép:0pixel khác production.
- Phía dưới vùng hiển thị chuôi kiếm:0pixel thêm từ kiếm so với body không kiếm.

Các phép đối chiếu có ROI cụ thể; chúng không chứng nhận toàn vùng phục hồi bị vũ khí cũ che hoặc thay việc review mỹ thuật. Vùng hông/quần áo phục hồi còn cần người dùng duyệt. Source, mask, thông số căn nguồn/neo từng frame và hash lưu trong integration/plan và review/provenance.

**Giới hạn browser:** đã thử mở Chrome bằng Computer Use, nhưng công cụ dừng do không xác định được URL hiện tại trên Windows với độ tin cậy cần thiết. Không tiếp tục thao tác UI; chưa xác nhận toàn vòng GIF/Canvas hoặc các nút trong browser. PNG các pose đã được xem riêng. Test/build/lint/typecheck/formatter **NOT_RUN**.

Chưa đổi PNG/JSON production, src/public, physics/input/collider/AI/timing runtime; chưa commit/merge/push. Idle gặp quái/chạy vẫn chờ chốt Idle. Các task/sửa chưa commit trước đó giữ nguyên. Nguồn task: `integration/ninja-idle-attached-sword/`; generator `scripts/prepare_ninja_idle_attached_sword.ps1` và GIF packer `scripts/assemble_ninja_idle_review.mjs`.
