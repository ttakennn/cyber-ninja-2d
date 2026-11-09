# Task10.47 — Khăn bụng liền mạch

**Đã được người dùng chốt làm Idle chính thức ngày2026-11-09**, publish tại [Task10.48](../task-010-48-ninja-idle-production-47/README.md). PNG được duyệt giữ nguyên byte/hash trong hồ sơ approval48. Các giá trị CANDIDATE_SELF_REVIEW trong metadata47 là snapshot thời điểm authoring, không phải trạng thái production hiện tại.

[Preview trước/sau](preview.html), [6frame chi tiết](sash-review.png), [GIF](motion-preview.gif), [idle-atlas](idle-atlas.png), [mask vùng sửa](sash-edit-mask.png), [provenance](provenance.json).

Chỉ sửa khăn bụng và mép nối áo/tà vải sau khi người dùng xác nhận production gốc cũng có lỗi. Imagegen tạo guide sửa6crop từ đúng atlas10.46; generator chỉ ghép vào mask eo, không tái tạo thân/tay/kiếm/khăn cổ/chân.6frame có0pixel RGBA khác ngoài mask. Frame384×320/pivot192,289/FPS7.1429 giữ nguyên. Nguồn: integration/ninja-idle-sash-alignment/; generator: scripts/prepare_ninja_idle_sash_alignment.ps1, GIF: scripts/assemble_ninja_idle_sash_review.mjs.

Bản review đã được tạo trước khi workspace ngắt kết nối; không regenerate artwork sau lời chốt. Browser/runtime/test/build không được xác nhận ở lượt authoring này. Các chi tiết khác giữ theo bản10.46 đã được người dùng phản hồi ổn.
