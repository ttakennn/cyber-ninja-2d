# Map01 Visual Revision RC2
Bộ asset và metadata tích hợp theo các ảnh đánh dấu của người dùng. Baseline: b81829a (đã dùng props/background v2).
Trạng thái: asset đã xuất; candidate JSON đã tạo; runtime integration và nghiệm thu PENDING.

## Các bước đã thực hiện
1. Review source v2 và ảnh đánh dấu: props đã đồng bộ style; vấn đề còn lại là khối terrain dựng bằng tile, facade cũ quá lớn và camera đổi Y theo tâm collider.
2. Xác nhận với người dùng: Zone1 xoá cả hình/collider hầm; Zone2 chuyển thang, ghế chỉ trang trí.
3. Tạo street-cap-ivy: viền đá xám nằm ngang tuyệt đối, lá/hoa rủ phía DƯỚI; tường gạch navy, không còn nhịp ống thép dọc.
4. Tạo backdrop thấp cho Zone4/5 và bộ bậc có artwork khớp collider. Biển Zone4 dùng đúng PNG props-v2, không bake chữ mới vào ảnh nền.
5. Xuất 8 asset definitions, bốn trang backdrop hữu hạn, 41 decoration additions, 4 collider bổ sung, danh sách xoá/thay và candidate LevelData.
6. Sửa code camera tại Game.ts/GameCamera.ts: bám chân nội suy + nửa chiều cao đứng, thay vì bám tâm thay đổi theo stance.
7. Đóng gói dữ liệu và prompt cho Sol. Chưa sửa generator/level runtime; candidate không được registry tải tự động.

## File quan trọng
- public/assets/environments/map01/revision-rc2/asset-manifest.json: PNG, size, SHA256 và provenance.
- integration/map01-revision-rc2/map-revision-plan.json: nguồn quyết định thay đổi, không phải LevelData.
- environment-additions.json: 41 decoration đúng schema hiện tại.
- map01-five-zones.rc2-candidate.json: snapshot kết quả dự kiến từ baseline để Sol đối chiếu; không ghi đè sửa mới hơn.
- camera-fix.patch: bản sao thay đổi camera đã áp dụng trong workspace; không áp dụng hai lần.
- SOL-TASK.md: prompt triển khai theo thứ tự.
- previews/: ảnh authoring, không phải ảnh runtime.
- generation-prompts.json/originals/: nguồn imagegen built-in, lưu ngoài public.

## Quyết định theo zone
| Zone | Chỉnh sửa |
|---|---|
| 1 | street-crate giữ collider1×1, thay tile bằng crate-wood v2 với alpha căn đúng collider. Xoá passage-roof và toàn bộ facade/biển/đèn gắn vào khối bị xoá. |
| 2 | Xoá raised-step và collider; thay bằng bench trang trí. Xoá cột tường và ladder visual vàng; thang PNG mới tạiX29.55, sát mép trái ban côngX30. Thay balcony-crate bằng planter, bỏ collider chậu. |
| 3 | Camera bám theo chân để đổi tư thế không kéo cảnh lên/xuống. Giữ khe nhảy48..50/58..60/68..70. |
| 4 | Bịt khối dưới roof4 tạiX70..80,Y−2.5..2. Ba bậc nốiX80..84.5 với top1.5/0/−1.5, đường−2.5. Đi lên bằng nhảy hiện có; không tự thêm auto-step. Thay nhà lớn bằng hai backdrop nửa trang, biển đúng props-v2. |
| 5 | Thay tường/cổng/props foreground cũ bằng backdrop sân thấp; giữ nguyên z5-floor-edge-stripe (z5-hazard-edge), core không thêm vật cản. |

## Quy ước kỹ thuật và giới hạn
Đường đỏ là các đoạn THẲNG, topY=−2.5, bottomY=−4.5. Chỉ skin X0..40 vàX70..144 theo các ảnh; không tạo sàn mới dưới ba khe mái hoặc lấp vùng chếtX40..70. Collider đường hiện tại giữ nguyên; dưới mái cuối được bịt riêng.
Thang sát mép trái thay vì cắt xuyên ban công: player width0.8 tạiX29.55 có mép phải29.95, trước mép ban công30. Đỉnh climbable3 cho chân lên1.4, đủ rời ngang sang sànY1. Hình thang và climbable dài5.5, bottom−2.5.
Bậc có width1.5, rise tối đa1.5; độ cao nhảy lý thuyết11²/(2×28)=2.16. Đây là căn cứ thiết kế, chưa thay thế kiểm gameplay.
Backdrop được biểu diễn bằng decoration world-anchored z=−0.44 theo parser hiện có; nằm sau props/player, không collider. Đây là nền hữu hạn theo zone, không phải background repeat toàn map; không cần mở rộng parser.
Sign z=−0.43, đường z=−0.4, hazard gốc−0.3 nên hazard vẫn nằm trước đường. Kích thước PNG biển/props v2 giữ nguyên; worldSize được căn alpha theo mục tiêu mới.
Hai strip lớn chỉ là nguồn authoring; runtime dùng các nửa trang tối đa2048px, không repeat. Tách trang giữa ảnh giữ nguyên pixel ở đường nối.
Candidate đã xoá paint các collider bị bỏ và skin phố cũ; Sol cần tái hiện ở generator, không sửa output riêng lẻ.
Camera API vẫn nhận lời gọi cũ với height mặc định bằng chiều cao đứng. Game truyền renderHeight nội suy nên tính chân cùng alpha. Không đổi physics, animation hoặc độ cao đứng/cúi.

## Kiểm thử
Không chạy test/build/lint/typecheck/formatter game trong lượt này. “Build asset” đã được thực hiện bằng script xuất PNG/metadata. Sửa camera chưa có nghiệm thu runtime.
Cần kiểm nguồn generator, điều hướng thang/bậc hai chiều, không còn collider vô hình ở khối bị xoá, mặt đường/hoa không nhấp nháy, chữ biển đủ dấu, z5-hazard-edge giữ nguyên; bốn viewport và thao tác ngồi/đứng liên tục trên mái.
Không đóng Step09 hoặc gắn nhãn production trước nghiệm thu.

