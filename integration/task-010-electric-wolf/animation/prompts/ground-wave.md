# Điện Chấn Mặt Đất — FX sát nền / prompt nguyên văn

Tool: image_gen.imagegen built-in, transparent_background=true. PNG tham chiếu đã được xem: tạo hình electric-wolf-ninja-v1.png và bảng Skill1 dash-contact.png đã duyệt. Nguồn/crop/scale/hash theo animation-plan.json và candidate JSON tương ứng; không thay ảnh đã duyệt.

Use case: stylized-concept.
Asset: sprite sheet FX RIÊNG “Điện Chấn Mặt Đất” cho Ninja Sói Điện. Ảnh tham chiếu chỉ xác định palette cyan trắng/tím than và chất liệu Illustrated textured pixel art2D.
Chỉ hiệu ứng, TUYỆT ĐỐI KHÔNG nhân vật, gậy, vật cản, mặt đường hoặc bệ. Đây là một LUỒNG ĐIỆN BÒ THẤP chạy từ TRÁI sang PHẢI dọc nền, để người chơi nhảy tránh. Không tia laser bay, không quả cầu, không sóng cao, không cột sét từ trời, không lửa/rồng.
PNG1536×1024 alpha thật,4cột×2hàng,8ô384×512. Mỗi ô chỉ một FX. Toàn bộ FX ở vùng thấp y365..470, đáy tiếp đất quanh y470, tâm x192. Chiều rộng tối đa320px, chiều cao tối đa100px, còn margin32px hai bên. Hình bám mặt phẳng nhìn ngang: chân luồng là các nhánh sét ziczac cyan sáng nằm ngang; đầu luồng ở PHẢI có gai điện thấp hơi cong, đuôi dài tưa về TRÁI. Tâm trắng cyan, viền xanh điện mỏng, vài pixel tím lạnh theo style gậy; chi tiết vẽ có kiểm soát và hạt sáng ít, không blur mù/mây khói dày.
8frame trái sang phải, trên xuống dưới:
0: phát sinh tại điểm đập, nụ tia điện thấp nhỏ mở ngang, khoảng90px rộng; không vụ nổ cao.
1: luồng điện vừa hình thành, khoảng220px rộng, đầu phải dâng thấp, nhánh chạy sát đất.
2: vòng lặp di chuyển A, rộng300px, đầu phải sáng, ziczac ngang/nhánh tách 2–3tia, đuôi sang trái.
3: vòng lặp di chuyển B, cùng envelope/cỡ/điểm đáy như2, đổi nhánh và gai sét tạo cảm giác điện chạy.
4: vòng lặp di chuyển C, cùng envelope/cỡ/điểm đáy như2/3, đầu phải kéo dài nhẹ, nhánh sáng đổi pha tự nhiên. Không di chuyển cả FX trong ô: code sẽ tịnh tiến.
5: hết tầm, luồng yếu dần/tách vài tia, rộng260px, vẫn bám nền.
6: chạm vật cản vô hình ở PHẢI, điện co và tóe ngược về TRÁI, thấp, rộng150px, không vẽ vật cản/tường; không vượt qua sang phải.
7: tan hết, vài tia/hạt cyan thấp rời, rộng100px, dùng kết thúc sau5 hoặc6.
TẤT CẢ bên ngoài tia điện alpha0, kể cả vùng trên FX và khoảng giữa các nhánh. Không nền đen/nâu/xám/caro, không chữ/nhãn/số/grid/watermark, không đường baseline vẽ sẵn. Giữ8ô tách bạch đủ margin, không cắt tia sang ô bên. Nhịp/tịnh tiến sẽ làm trong preview; cần8pose FX đẹp, thống nhất cùng một đòn điện mặt đất.
