# Điện Chấn Mặt Đất — pose nhân vật / prompt nguyên văn

Tool: image_gen.imagegen built-in, transparent_background=true. PNG tham chiếu đã được xem: tạo hình electric-wolf-ninja-v1.png và bảng Skill1 dash-contact.png đã duyệt. Nguồn/crop/scale/hash theo animation-plan.json và candidate JSON tương ứng; không thay ảnh đã duyệt.

Use case: stylized-concept.
Asset: sprite sheet NHÂN VẬT thi triển Skill2 “Điện Chấn Mặt Đất” cho game2D.
Ảnh1 là danh tính Sói Điện ĐÃ DUYỆT. Ảnh2 là bộ Skill1 đã duyệt, tham chiếu màu/texture/tỉ lệ, không sao tư thế lao.
Giữ CHÍNH XÁC mặt người, tóc trắng xám, tai sói nhỏ, mắt cyan láu cá/hai nanh nhỏ; hoodie tím than/đen (mũ hạ), khăn tối dưới môi, đai tím, quấn tay/chân xám, giày ninja. Hơi chibi đúng ảnh gốc. Một gậy điện NGẮN công nghệ cyan luôn trong TAY PHẢI, tay trái trống. Giữ tỷ lệ đầu/thân/cơ thể và kích cỡ giải phẫu của nhân vật giữa mọi pose.
Phong cách Illustrated textured pixel art, sprite2D side-view hơi3/4 nhìn PHẢI, nét tạo khối/shading/viền đúng tham chiếu, không 3D/vector/jeans/bomber/sói toàn mặt thú.
PNG1536×1024 trong suốt THẬT,4cột×2hàng,8ô384×512. Mỗi ô 1nhân vật toàn thân, hông quanh x192, baseline chân tại y470. Pose0 đứng cao khoảng350px gồm tai. Dành khoảng trống trên đầu cho gậy giơ cao; KHÔNG fit scale pose1/2 khi tay cao hoặc pose4/5 khi cúi thấp. Không bị cắt tai/gậy/chân/chi tiết, không tràn ô. Không vẽ chữ/grid/nhãn/số/nền nâu/đen/caro/khung/sàn/đường. Pixel ngoài cơ thể/gậy phải alpha0, cả khe tay chân.
8pose tuần tự trái sang phải, hàng trên rồi hàng dưới:
0 GUARD SO CỠ: thế đứng gốc, gậy thấp tay phải, tay trái thủ. Đây là pose chuẩn chiều cao trước skill.
1 LẤY ĐÀ: chân mở vững, khuỵu nhẹ, vai xoay; tay phải bắt đầu đưa gậy lên sau đầu, khuỷu gập tự nhiên, tay trái cân bằng. Mắt nhìn vị trí mặt đất phía PHẢI trước chân.
2 GIƠ GẬY CAO / TỤ ĐIỆN: tay phải nâng gậy trên đầu và hơi ra sau, khuỷu/khớp vai đúng giải phẫu, gối chùng, thân ngả nhẹ chuẩn bị bổ xuống. Gậy sáng trắng-cyan mạnh hơn với vài tia điện nhỏ. Mặt vẫn rõ. Đây là động tác đập từ TRÊN xuống ĐẤT, không vung ngang.
3 BỔ XUỐNG: vai/hông/gối phối hợp, thân hạ nhanh, cánh tay phải đưa gậy theo cung dọc xuống phía trước bên PHẢI; tay trái mở cân bằng. Gậy còn cách nền một chút, vệt cyan ngắn bám gậy thể hiện hướng xuống, không che mặt.
4 CHẠM ĐẤT: crouch sâu nhưng không quỳ, 2bàn chân tiếp đất; vai phải thấp, tay phải xuống thấp, ĐẦU GẬY THỰC SỰ CHẠM MẶT ĐẤT ở phía PHẢI trước chân trước, cùng baseline y470 với đáy giày. Cánh tay đủ duỗi đúng chiều dài gậy ngắn, không kéo dài gậy hoặc tay. Gậy hướng chéo xuống phải, mắt nhìn điểm chạm. Không vẽ sóng lớn hoặc mặt đường ở pose này vì FX sẽ là layer riêng.
5 GIỮ LỰC / GIẢI PHÓNG: vẫn thấp người, gậy còn sát điểm chạm, cơ thể bật nhẹ phản lực, vai nhả lực, tay trái cân bằng, đai/khăn phản ứng có quán tính. Chỉ vài tia quanh đầu gậy, không sóng điện lớn.
6 THU GẬY / ĐỨNG DẬY: nhấc gậy khỏi mặt đất, chân đẩy hông lên, vai trở lại, tia cyan nhỏ tan.
7 TRỞ VỀ GUARD: khớp cỡ/điểm chân/tư thế0, gậy thấp tay phải, tay trái thủ.
Giữ nhân vật đứng tại chỗ theo gốc ô, chỉ chuyển hình dáng cơ thể. Không làm nhân vật lao/nhảy trong skill này. Không thừa gậy/tay/ngón/chân. Không máu, đối thủ, vật cản, mặt đường, cảnh vật. Không chớp sáng trắng cả người. FX luồng điện chạy mặt đất sẽ vẽ sheet riêng; ở sheet này chỉ nhân vật và ánh điện nhỏ ở gậy.
