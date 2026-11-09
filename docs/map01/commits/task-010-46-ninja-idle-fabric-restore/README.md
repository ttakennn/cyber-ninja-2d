# Task10.46 — Release Idle: tay sạch, nếp khăn và tà vải production

**PUBLISHED_ART_SELF_REVIEWED · 2026-11-09.** Người dùng giao tự review cho giống production rồi release. Đây là release theo quyền được giao sau khi assistant rà ảnh; không ghi nhận rằng người dùng đã xem/duyệt riêng bản10.46. Runtime chưa đổi, chưa commit.

## Điểm xem

- [Production tổng hợp](../../../characters/ninja/animation/preview.html), [production cơ bản](../../../characters/ninja/animation/basic-preview.html).
- [So ba cột](preview.html): production gốc đã lưu / bản10.45 / bản release10.46. Có tua, tốc độ, nền, chồng ảnh và crop4×.
- [Soi đủ6pose](arm-waist-review.png), [GIF](motion-preview.gif), [atlas6frame](idle-atlas.png).
- [Atlas native đã release](flame-ninja-atlas.png), [bằng chứng release](release-evidence.json), [provenance authoring](provenance.json).

## Sửa đúng phản hồi

| Vùng | Sai ở10.45 | Bản10.46 |
| --- | --- | --- |
| Cạnh trong cẳng tay, cạnh ngoài nắm tay | Giữ cả pixel cán/vỏ kiếm cũ trong mask tay | Thu mask giáp theo contour từng pose, bỏ phần da/nâu của trang bị và phần dư ngoài găng; giữ giáp bạc, viền tối, cổ tay và bàn tay nguồn |
| Khăn vòng bụng | Nội suy màu theo hàng thành các dải phẳng | Bỏ cách kéo hàng màu; phục hồi nếp vải có texture từ guide chỉnh riêng, giữ phần đai production còn nhìn thấy bên phải |
| Tà vải bên hông dưới đai | Vùng xoá kiếm làm mất vải đỏ, thay bằng quần đen | Phục hồi tà đỏ đầu nhọn, mặt sáng và mặt tối, nối từ đai xuống các dải trang phục |

Lấy lại từng frame từ production native; không tiếp tục dùng thân đã vá10.45 làm chuẩn. Imagegen chỉ vẽ bù phần bị trang bị che, không thay đầu/cơ thể/chân. Phần vải từng bị kiếm che không có pixel gốc để sao nguyên, nên được phục hồi theo style và nếp vải production; không gọi phần này là pixel-identical. Kiếm thẳng, ngắn, chỉ lộ trên lưng và bám mốc vai/mép khăn từng frame giữ như yêu cầu trước.

## Tự review và bằng chứng

Đã xem bảng so4× đủ6pose, toàn thân và chi tiết từng frame; qua các lượt sửa đã phát hiện/bỏ đầu phụ kiện vàng còn sót, phần dư quanh cổ tay và nắm tay. Tà vải đỏ hiện đủ6pose, nếp khăn không còn là dải màu phẳng. Kiểm tra pixel6frame:0khác ở ROI đầu/tay xa/mask tay bảo vệ và ngoài footprint sửa so với production gốc. Mask/ROI chỉ chứng minh vùng được định nghĩa, không thay thế đánh giá mỹ thuật.

Đóng gói lại đúng6rect Idle trong atlas3136×1968, frame384×320, pivot192,289,6frame/7.1429fps giữ nguyên. Reload PNG native: **0pixel RGBA khác ngoài6rect Idle**, **0pixel khác giữa Idle đóng gói và atlas đã review**.39file asset/JSON production khác giữ nguyên hash. Metadata clip/FPS/frame/pivot không đổi.

Baseline giữ nguyên tại integration/ninja-idle-fabric-restore/production-reference-atlas.png, SHA2560f6f86e222f86ceda5cd7849c9b11de64793c3c3c0e233e36fc941684c52eeba. Canonical/source release SHA2567b22406fe0fa5969cc8a84a6661b59b5f8f0ae8f72bc36f80cf7ea3ef409c572. Metadata/manifest/cấu hình publish ghi rõ **USER_AUTHORIZED_RELEASE_AFTER_SELF_REVIEW**, userViewedThisRevision=false.

## Nguồn và cách tái tạo

Nguồn: integration/ninja-idle-fabric-restore/{plan.json,prompt.txt,fabric-guide.png,production-reference-atlas.png,production-reference-animations.json,canonical-before-hashes.json}. Có backup manifest/catalog/production-plan trước publish để đối chiếu.

- scripts/prepare_ninja_idle_fabric_restore.ps1: dựng candidate từ baseline bất biến, xuất ảnh/metadata/GIF; không ghi production.
- scripts/assemble_ninja_idle_fabric_review.mjs: ghép6frame GIF140ms/frame.
- scripts/package_ninja_idle_fabric_release.ps1: thay đúng6rect vào atlas native và kiểm RGBA ngoài Idle.
- scripts/publish_ninja_idle_fabric_release.mjs: chỉ copy PNG đã review, cập nhật manifest/catalog/source plan và kiểm39file khác giữ hash; có guard baseline chống ghi đè khi production đã đổi. Không chạy lại publish khi đã phát hành; guard cố ý từ chối baseline không khớp.
- Publisher thư viện chung chỉ bổ sung passthrough quyền release Idle, không chạy cả publisher trong task này.

## Giới hạn

Computer Use đã dừng trước khi mở preview vì không xác định được URL Chrome trên Windows đủ tin cậy; **browser tương tác và quan sát phát realtime chưa xác nhận**. Rà PNG/chuỗi frame và kiểm giải mã GIF được thực hiện riêng. Test/build/lint/typecheck/formatter/gameplay **NOT_RUN**. Không đổi src/public/assets, physics/input, cảnh giác/chạy/attack hoặc clip khác. Release thư viện art không phải release game/runtime.
