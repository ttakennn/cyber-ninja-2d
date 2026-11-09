# Task10.45 — Sửa mép giáp và đường ghép đai Idle

**CANDIDATE_PENDING_REVIEW.** Phản hồi: hai vùng khoanh vàng trong bản10.44 còn dính ảnh, chưa giống production. Chỉ sửa Idle đứng/thở; giữ snapshot10.44, production và runtime.

## Xem kết quả

- [Preview3cột](preview.html): production / bản10.44 / bản10.45, cùng frame, kích thước, nhịp thở; có tua/chậm/phóng chi tiết4×.
- [So chi tiết đủ6frame](arm-waist-review.png), [GIF6frame](motion-preview.gif), [atlas candidate](idle-atlas.png).
- [Nguồn/hash](provenance.json), [metadata/mốc/audit](review.json).

## Hai vùng sửa

1. **Mép trong cẳng tay:** mask đa giác cũ chưa bao hết silhouette và khoảng trống sát giáp, tạo mảng kéo dài bên tay. Lấy lại contour/alpha trực tiếp từng frame production, gồm cả khoảng trống đến phần kiếm hông cũ; không cắt vào giáp bạc, viền tối, găng hoặc đai cổ tay.
2. **Đai đỏ:** bỏ vùng ghép lệch bề dày và các nét tối bên trong. Xác định mép trên/dưới từ sash production từng pose, ưu tiên pixel production ở phần vốn thấy được. Phần đai từng bị phụ kiện che được nối bằng texture từng hàng của chính đai gốc, có bóng nhẹ ở cạnh trái; không lấy viền đen của guide làm đường nối giữa đai. Chỗ vải bị vũ khí che dưới đai dùng guide chỉnh sửa riêng, giữ đường áo/đai/tà vải liên tục. Không phục hồi phụ kiện vàng cũ.

Đã dùng imagegen để chỉnh6crop từ production và candidate10.44; prompt/source được giữ. Guide chỉ cung cấp phần vải bị che. Không thay cả cơ thể bằng ảnh tạo lại. Khi đóng gói copy RGBA trực tiếp để giữ màu/alpha gốc; các giá trị RGBA ngoài footprint vũ khí được khôi phục từ native production thay vì tiếp tục qua alpha compositing.

Kiếm sau lưng giữ mốc và chuyển động10.44. Frame384×320, pivot192,289,6frame/7.1429fps; sheet review1152×640. Không đổi mắt, cơ thể, chân, chuyển động, gặp quái/chạy/attack hoặc game.

## Nguồn và tái tạo

- Production: docs/characters/ninja/animation/locomotion/flame-ninja-atlas.png + animations.json.
- Candidate trước: docs/map01/commits/task-010-44-ninja-idle-production-restore/body-atlas.png, idle-atlas.png và review.json.
- Nguồn mới: integration/ninja-idle-seam-cleanup/plan.json, prompt.txt, seam-guide.png, before-arm-waist.png, preview.html/js.
- Authoring: scripts/prepare_ninja_idle_seam_cleanup.ps1 và scripts/assemble_ninja_idle_seam_review.mjs.

## Kiểm tra và giới hạn

Đã đối chiếu PNG phóng lớn với production, rà đường giáp/đai và bảng6pose. GIF giải mã6frame1200×760. SHA256 atlas production vẫn là0f6f86e222f86ceda5cd7849c9b11de64793c3c3c0e233e36fc941684c52eeba. Cả6frame có0pixel khác ở các ROI đầu/tay xa/mask tay bảo vệ. Kiểm tra artwork theo các mask/ROI trong authoring được ghi review.json: đầu, tay xa và vùng tay bảo vệ so với production; vùng ngoài cleanup so với packed body10.44 dùng ngưỡng tổng chênh RGB>6 cho pixel có alpha, tách khỏi sai khác làm tròn RGBA. cleanupChangedPixels là tổng sai khác RGBA từ packed body10.44, gồm cả việc trả pixel/alpha về source native; không phải số pixel vẽ mới hoặc thước đo chất lượng mỹ thuật. Mask/ROI không thay thế review vùng phục hồi.

Browser tương tác/chuyển động thực: **NOT_RUN**. Test/build/lint/typecheck/formatter/runtime: **NOT_RUN**. Chưa duyệt/publish production hoặc commit. Snapshot trước và art chuẩn giữ nguyên.
