# Điện Quang Đột Kích — prompt nguyên văn

Tool: image_gen.imagegen built-in, transparent_background=true. Tham chiếu đã xem: source/electric-wolf-ninja-v1.png (danh tính) và docs/map01/commits/task-010-02-electric-wolf-animation/combo-contact.png (style/cỡ/chất lượng động tác). Output thực tế1774×887, không phải kích thước2048×1024 được yêu cầu trong prompt. Source giữ nguyên byte, crop/normalization ghi trong animation-plan.json và candidate/dash.json.

Use case: stylized-concept.
Tạo sprite sheet mới cho Skill 1 “Điện Quang Đột Kích” của Ninja Sói Điện. Ảnh 1 là tạo hình đã được duyệt và là tham chiếu danh tính bắt buộc; ảnh 2 là tham chiếu chất lượng chuyển động/cỡ nhân vật, không phải bố cục để sao.
Phong cách: Illustrated textured pixel art, sprite 2D side-view hơi 3/4 nhìn PHẢI. Giữ nguyên mặt người, tai sói nhỏ, tóc trắng xám, mắt cyan tinh nghịch, hai nanh nhỏ, hoodie tím than/đen hạ mũ, khăn tối thấp dưới môi, đai tím, quấn xám ở tay/chân, giày ninja. Hơi chibi, nhỏ gọn đúng ảnh gốc. Một gậy điện công nghệ ngắn màu cyan ở TAY PHẢI; tay trái trống. Không đổi trang phục/palette/tỷ lệ đầu-thân/độ dày cơ thể giữa các pose.
PNG nền trong suốt thật, 2048×1024, 4 cột × 2 hàng, 8 ô bằng nhau 512×512. Trong mỗi ô, hông gần x256; chân chạm đường y465. Pose0 đứng cao khoảng360px tính cả tai. TẤT CẢ pose cùng cỡ cơ thể giải phẫu, không fit phóng to các pose cúi để lấp ô. Mỗi ô một nhân vật toàn thân, đủ margin cho tai, chân, gậy và vệt điện. Không tràn/cắt sang ô bên. Không chữ, số, nhãn, khung, watermark, bệ, mặt đất hoặc nền nâu/đen/checker. Pixel ngoài silhouette và tia điện phải alpha0, cả khe chân/tay.
8 pose đọc trái sang phải, hàng trên rồi hàng dưới, liên mạch:
0: đứng thế thủ khớp hình gốc, gậy thấp bên hông, là pose chuẩn so cỡ.
1: HẠ THẤP CẢNH BÁO. Gối khuỵu rõ, hông hạ, vai đổ nhẹ ra trước, chân sau nén lực; tay phải thu gậy gần hông phải, tay trái giữ cân bằng phía trước, mắt tập trung về PHẢI. Tia điện cyan nhỏ bắt đầu quấn gậy.
2: NÉN LỰC / GẬY LÓE. Người thấp hơn chút, lưng nghiêng về phải, chân sau căng chuẩn bị đạp; gậy gần vai phải kéo về sau, lóe sáng trắng-cyan có tia nhỏ rõ, mặt vẫn đọc được. Đây là phần cuối cảnh báo 0,5 giây, không lao ngay từ pose1.
3: BẬT LAO. Chân sau đạp mạnh, thân nghiêng phải, vai/hông chuyển đồng bộ; tay phải đưa gậy về PHẢI như một đòn xung kích, khuỷu không khóa cứng; chân trước kéo bước, đai/khăn văng về TRÁI. Một vệt điện ngắn phía sau, không che mặt.
4: ĐỈNH LAO. Thân thấp nhanh và vươn phải, tay cầm gậy vươn tự nhiên ra trước, gậy hướng phải ở tầm ngực, chân sau duỗi/trước co. Vệt điện cyan trắng xanh kéo về TRÁI như đuôi tốc độ, hơi cong theo đường lao; không vòng tròn chém, không tia laser, không sóng điện mặt đất. Giữ một nhân vật, không afterimage cơ thể lặp. Chân gần mặt đất, không bay cao.
5: XUYÊN ĐÀ. Đưa chân trước xuống đỡ thân, gậy còn hướng trước, cánh tay bắt đầu thu, vệt điện ngắn hơn pose4, đai còn bay về sau. Dáng chuyển tiếp có lực, không thêm đòn vung thứ hai.
6: HÃM ĐÀ. Chân trước chống đất, gối gập đỡ lực, người hơi nâng, tay phải kéo gậy về hông, tay trái cân bằng; chỉ vài tia điện tan dần.
7: THU THẾ. Trở lại guard gần pose0, gậy thấp bên tay phải, chân trụ chắc, đai/khăn hạ xuống; sáng cyan trở lại mức bình thường.
Ưu tiên cơ chế cổ-vai-hông-gối có lực, silhouette rõ, cảnh báo cúi thấp khác hẳn đỉnh lao. Vệt điện sáng đẹp nhưng mảnh, không che cơ thể hay làm nhân vật to/nhỏ. Từng pose ở cùng ô gốc; chuyển động tịnh tiến toàn thân sẽ được làm ở preview, KHÔNG dịch dần nhân vật sang ô khác.
Không đối thủ/nhân vật ninja đỏ, không máu, không cảnh vật, không sét từ trời, không rồng, không thừa chi/gậy, không thay thành quần jeans hoặc áo bomber. Chỉ art skill lao, không gameplay.
