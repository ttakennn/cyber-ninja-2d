# Task10.44 — Phục hồi bụng và cánh tay Idle theo production

Trạng thái: **CANDIDATE_PENDING_REVIEW**. Người dùng phản hồi bụng và cánh tay phải của Task10.42 chưa đúng production. Chỉ sửa Idle đứng/thở; gặp quái, chạy và attack vẫn hoãn. Bản10.42 giữ nguyên làm lịch sử, chưa được duyệt.

## Kết quả để review

- [Preview so ba cột](preview.html): production / Task10.42 / bản sửa, đồng bộ frame và kích thước. Có phát/dừng, tua từng frame, tốc độ, nền, chồng production và phóng vùng bụng–tay4×.
- [Bảng chi tiết đủ6frame](arm-waist-review.png).
- [GIF so chuyển động](motion-preview.gif):6frame,140ms/frame,1200×760; GIF chỉ dùng xem chuyển động, PNG là nguồn màu đầy đủ.
- [Atlas candidate](idle-atlas.png), [atlas6frame production để so](production-idle-atlas.png), [mask bảo vệ tay](protected-arm-mask.png), [provenance/hash](provenance.json), [metadata/audit](review.json).

## Nguyên nhân và cách sửa

Task10.42 tiếp tục dùng vùng bụng được phục hồi ở10.41; việc xóa cán kiếm cạnh tay bằng màu/alpha còn cắt vào viền găng. Bản này bắt đầu lại từ từng frame native của atlas production, không dùng thân10.42 để vá tiếp.

1. Lấy lại khối cơ vai/bắp tay, giáp cẳng tay và nắm tay từ production theo dịch chuyển thực tế từng pose. Mask bảo vệ riêng bắp tay, cẳng tay và bàn tay giữ silhouette gốc khi xóa trang bị cũ.
2. Giữ nguyên bụng, đường áo và đai vốn thấy được ở production; chỉ vẽ bù nơi kiếm/các chi tiết đeo hông che khuất. Guide tạo từ6crop production được dùng trong footprint vũ khí cũ, không thay cả thân hoặc cả bụng. Vải ở vùng bị che là phần phục hồi mới, cần người dùng review.
3. Dùng đầu bao/cán cũ và mốc bàn tay của từng frame để xóa hết đường bao kiếm chéo, tránh để lại nét thừa dưới găng.
4. Giữ lớp kiếm sau lưng của10.42: thẳng, chỉ lộ phần trên, bị thân/khăn che phần dưới và bám mốc vai/mép khăn từng frame.

Không đổi kích thước nhân vật, canvas384×320, pivot192,289,6frame/7.1429fps hoặc timing production; không fit/resize độc lập từng pose. Chỉ repack6frame candidate sang sheet1152×640 để preview.

## Nguồn và tái tạo

Nguồn chuẩn: docs/characters/ninja/animation/locomotion/flame-ninja-atlas.png và animations.json. SHA256 PNG: 0f6f86e222f86ceda5cd7849c9b11de64793c3c3c0e233e36fc941684c52eeba.

Input/prompt/plan: integration/ninja-idle-production-restore/. Script authoring: scripts/prepare_ninja_idle_production_restore.ps1. Đóng gói GIF: scripts/assemble_ninja_idle_restore_review.mjs. Prompt, guide, phép crop, mốc pose và hash được lưu; không dùng ảnh chat thu nhỏ thay atlas native.

## Đã kiểm tra và giới hạn

Đã xem PNG atlas6frame, bảng chi tiết và ảnh so các pose; rà viền găng, bụng–đai, vải dưới đai, đầu bao cũ và kiếm sau lưng. GIF giải mã được6frame1200×760. Kiểm tra pixel trong quá trình authoring cho6frame:0pixel khác ở mask tay được bảo vệ, tay phía xa, đầu và thân ngoài footprint sửa vũ khí. Các con số này chỉ chứng minh vùng được định nghĩa trong mask/ROI, không chứng nhận phần vải mới là pixel gốc hay thay thế review mỹ thuật. Mask tay có2236–2294pixel/frame; vùng xử lý vũ khí/vải có1498–1601pixel/frame, gồm cả pixel xóa vũ khí.

Browser tương tác/chuyển động thực: **NOT_RUN**. Test/build/lint/typecheck/formatter/runtime: **NOT_RUN**. Chưa publish production, chưa đổi src/public/assets, chưa commit. Không sửa nguồn art production hoặc snapshot10.42 trong task này.
