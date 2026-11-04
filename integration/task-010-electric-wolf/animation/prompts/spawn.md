# Xuất hiện từ khói điện — nhân vật / prompt nguyên văn

Tool: image_gen.imagegen built-in, transparent_background=true. Đã xem PNG tạo hình v1 và bảng groundShock đã duyệt trước khi tạo ảnh. Tham chiếu body: cảhai PNG; tham chiếu VFX: tạo hình v1 để giữ palette. Source/crop/normalization/hash theo animation-plan.json và candidate JSON tương ứng; ảnh đã duyệt giữ nguyên.

Use case: stylized-concept.
Asset: 8 pose sprite nhân vật Ninja Sói Điện xuất hiện từ khói điện. Ảnh1 là danh tính đã DUYỆT, ảnh2 là chất lượng/tỉ lệ animation đã DUYỆT.
Giữ nguyên mặt người, hai tai sói nhỏ, tóc trắng xám, mắt cyan, hai nanh nhỏ, hoodie tím than/đen hạ mũ, khăn tối dưới môi, đai tím, quấn xám, giày ninja. Hơi chibi cùng tỉ lệ đầu/thân, không đổi cỡ cơ thể. Gậy điện ngắn cyan luôn thuộc TAY PHẢI, tay trái trống. Side-view hơi3/4 nhìn PHẢI, Illustrated textured pixel art2D, texture/shading/viền đúng ảnh gốc.
PNG1536×1024 alpha THẬT,4cột×2hàng,8ô384×512. Mỗi ô 1 nhân vật toàn thân, hông gầnx192, chân chạm baseline y470, pose0 cao khoảng350px gồm tai. TẤT CẢ cùng scale giải phẫu: pose cúi không phóng lớn cho lấp ô. Chỉ pose người, không vẽ khói/phông/cảnh vật/vòng sáng/sàn vì sẽ ghép FX riêng. Ngoài silhouette/gậy/tia nhỏ trên gậy phải alpha0, kể cả khoảng tay chân. Không chữ/grid/nhãn/nền caro/nâu/đen/watermark. Không tràn/cắt tai/gậy/chân sang ô khác.
8pose trật tự trái sang phải, trên xuống:
0 GUARD THAM CHIẾU: đứng giống tạo hình đã duyệt, gậy thấp tay phải, tay trái thủ. Pose chuẩn so cỡ.
1 VỪA HIỆN: crouch nhẹ/cân bằng, đầu hơi hạ, mắt khép/nheo, hai tai hơi thấp; tay phải cầm gậy sát hông, chân trụ chắc. Nhân vật vẽ đủ màu/đủ cơ thể, KHÔNG bán trong suốt hoặc bị khói che trong PNG, việc hiện dần làm ở preview.
2 HIỆN RÕ: từ từ nâng thân lên, vai mở, đầu hơi ngẩng, mắt cyan hé sáng, một tai nâng sớm hơn tai kia, gậy bắt đầu sáng nhẹ. Giữ đúng cùng người.
3 TAI ĐỘNG / MẮT SÁNG: đứng gần guard, một tai dựng/ráng xoay nhẹ, tai còn lại hơi nghiêng ra ngoài (vẫn2tai), mắt cyan sáng rõ nhưng không tia laser; môi cười nhẹ. Tay phải gậy thấp, không giật cả đầu.
4 NGHIÊNG ĐẦU CƯỜI TINH NGHỊCH: nghiêng đầu khoảng8–12độ về phía vai sau, nụ cười lộ2nanh nhỏ, lông mày láu cá, mắt nhìn đối thủ bên PHẢI, vai thả lỏng. Tai phản ứng nhẹ cùng đầu. Không mở miệng lớn đáng sợ.
5 XOAY NHẸ GẬY: đầu bắt đầu thẳng lại, cổ tay phải lật gậy lên gần thắt lưng theo vòng xoay nhỏ, gậy nghiêng lên45độ hoặc gần dọc; khuỷu gần thân, cổ tay tự nhiên. Chỉ1gậy/1tay phải, một vệt cyan cong RẤT NGẮN cạnh gậy để thấy chuyển động, không đòn chém/cung lớn/nhân bản gậy.
6 BẮT GẬY / SẴN SÀNG: cổ tay phải bắt lại gậy chắc, gậy trở về chéo thấp, vai/hông vào thế thủ, tai dựng, ánh gậy nhẹ cyan ổn định.
7 GUARD CUỐI: khớp vị trí chân/tỉ lệ/pose0 để nối idle, ánh mắt tinh nghịch, đai/khăn đã lắng, gậy thấp cùng bên.
Cử chỉ vui/tự tin, không nhảy/lao/đánh/triệu hồi rồng/đổi vũ khí. Không thừa chi/ngón/gậy/tai; không nền, khói hoặc bóng nhân vật thứhai. Body và màn khói sẽ tách layer. Giữ nhân vật tại gốc từng ô, chuyển động thân nhẹ có chủ đích, không thay tỉ lệ hoặc kéo giãn.
