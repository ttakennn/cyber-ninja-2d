# Task 10.56 — Đối chiếu Run10.55 với atlas production

Ngày2026-11-10. Phạm vi: đọc hai PNG người dùng chỉ định, metadata và source plan; so art ở cùng tỉ lệ pixel. Không vẽ lại, thay PNG, publish, đổi preview/gameplay hoặc commit.

## Nguồn và cách so

- Production: `docs/characters/ninja/animation/locomotion/flame-ninja-atlas.png`,3136×1968; rect Idle/Run từ `animations.json` cạnh PNG.
- Candidate: `docs/map01/commits/task-010-55-ninja-run-production-match/run-atlas.png`,2304×640; rect từ `review.json`.
- [Bảng đối chiếu](comparison-native.png): Idle production frame1, Run production frame1, Run10.55 frame1/frame4. Mỗi cột dùng nguyên ô384×320, không fit hoặc scale theo bbox; cùng mặt phẳng pivoty289. Hai hàng nền tối/sáng là cùng pixel, không recolor.
- [Số đo](measurements.json): bounds lấy pixel alpha≥128, tọa độ bao gồm phụ kiện/khăn. Đây không phải số đo giải phẫu hoặc collider. Pose và phụ kiện khác nhau nên không dùng chiều cao bbox để suy một hệ số resize cơ thể.

## Kết quả

**10.55 chưa khớp tạo hình/tỉ lệ/chất liệu production, không nên publish.** Nhận xét trước rằng đã khớp tỉ lệ bằng một scale chung là quá vội. Giữ frame/pivot đúng và dùng ảnh tham chiếu không bảo đảm artwork vẽ lại đúng anatomy.

| Phần | Giống | Khác/lệch ở10.55 |
| --- | --- | --- |
| Danh tính tổng quát | Hood/mặt nạ đen, khăn/đai/tà đỏ, áo không tay, quần đen rộng, giáp bạc, giày đỏ đen | Chỉ giữ các dấu hiệu nhận diện; các khối cơ thể và chi tiết đã được vẽ lại |
| Kích thước | Cùng ô384×320/pivot192,289 | Nhân vật nhìn thấp/gọn hơn; thân và khối đùi–chân nén lại, vai/tay chiếm tỉ trọng lớn hơn. PNG tổng khác kích thước do cách đóng sheet, không tự là lỗi |
| Đầu/mặt | Cùng hood/dải trán/mắt nhìn phải | Góc đầu, hình mask/khe mắt và tỉ lệ đầu với thân khác; đầu nhìn lớn tương đối với thân ngắn, không khẳng định đầu tăng kích thước tuyệt đối |
| Tay/cơ bắp | Vẫn cơ thể nam có cơ bắp | Vai/bắp tay tròn, phồng và nhiều nét chia cơ; highlight da sáng hơn. Production có khối cơ tự nhiên và chuyển sắc dịu hơn |
| Vị trí tay | Tay sau gáy nắm chuôi thuộc hướng pose10.51 đã được chốt | Khác tay đánh nhịp/kiếm hông của Run production; đổi pose là chủ ý riêng, nhưng không giải thích được việc thay khối và tỉ lệ tay/thân. Phần thân/tay trong12frame mới biến đổi ít |
| Thân/eo | Còn áo đen viền đỏ và đai | Ngực–eo ngắn, khối thân nén và dáng tổng thể đậm ngắn hơn mẫu; không chỉ là nghiêng cả người |
| Chân | Còn quần rộng, giáp bạc, giày đỏ đen | Chân thu/co nhiều, đùi/quần tròn; tỉ lệ chân nhìn ngắn so thân trên và tay. Co chân làm giảm chiều cao pose là bình thường, nhưng toàn silhouette vẫn khác production |
| Khăn/tà | Cùng họ màu đỏ và hướng bay sau | Khăn nhỏ/gọn hơn, chia nhiều dải nhọn; độ rộng, đường gấp và chuyển sắc không giống mảng khăn lớn production |
| Màu/chất liệu | Cùng họ đỏ–đen–bạc/da ấm | Đỏ sáng hơn, da nhạt/sáng hơn, shading cơ nổi gắt và bề mặt có hạt/viền khác; chưa đồng nhất cách tạo khối/texture của PNG gốc |

Frame Run production đầu có bao hình219×241px tại(70,48)..(288,288); Run10.55 đầu168×221px tại(102,69)..(269,289). Sự khác biệt gồm pose, sải chân, khăn và vũ khí; không gọi đây là “cơ thể thu nhỏ8,3%”. Pivot cùng vị trí không đồng nghĩa đầu/vai/hông có cùng tỉ lệ và đăng ký hình ảnh.

## Hướng sửa rút ra, chưa thực thi

Lấy hình học đầu–vai–ngực–eo–đùi–ống chân của PNG production làm chuẩn trực tiếp, chỉ thay góc khớp và chuyển động được giao. Giữ màu da, độ rộng khăn, chất liệu/viền và khối cơ; không lấy10.55 làm cơ thể gốc mới, không chỉ phóng to cả candidate để chữa sai tỉ lệ. Tay nắm chuôi theo10.51 là yêu cầu pose riêng, phải được giữ mà không đổi anatomy.

## Đã xem / giới hạn

Đã mở hai atlas, metadata, plan và bảng ghép cùng pixel trên nền sáng/tối; ghi số đo ảnh theo yêu cầu so sánh. Lỗi nhiễu màu khi xem trực tiếp vùng trong suốt không được dùng làm bằng chứng về màu thực tế; bảng đã composite trên hai nền để xem phần hiển thị.

Không chạy test/build/lint/typecheck/formatter, không xác nhận toàn bộ chuyển động trong browser. Không thay PNG production/candidate hoặc thông số runtime.10.55 vẫn là candidate chưa duyệt; task này chỉ phân tích.
