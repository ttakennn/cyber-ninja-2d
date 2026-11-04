# Xuất hiện từ khói điện — VFX khói / prompt nguyên văn

Tool: image_gen.imagegen built-in, transparent_background=true. Đã xem PNG tạo hình v1 và bảng groundShock đã duyệt trước khi tạo ảnh. Tham chiếu body: cảhai PNG; tham chiếu VFX: tạo hình v1 để giữ palette. Source/crop/normalization/hash theo animation-plan.json và candidate JSON tương ứng; ảnh đã duyệt giữ nguyên.

Use case: stylized-concept.
Asset: sprite sheet VFX riêng “xuất hiện từ khói điện” của Ninja Sói Điện. Ảnh tham chiếu chỉ định ngôn ngữ Illustrated textured pixel art2D và màu tím/cyan. TUYỆT ĐỐI KHÔNG vẽ nhân vật, mặt, mắt, bóng người, tai sói, gậy hay cảnh vật vào sheet FX.
PNG1536×1024 ALPHA THẬT,4cột×2hàng,8ô384×512. Mỗi ô chỉ1cụm khói ninja tím nhạt/lavender mềm, viền tím lạnh, vài tia điện cyan mảnh nhỏ lóe bên trong. Khói có khối/mảng vẽ tay mềm nhưng vẫn nét brush/texture2D như sprite game, không photoreal hoặc vector bóng nhựa. Không mảng sương phủ kín cả canvas. Khói tan ra mép có alpha mềm sạch; khoảng trống alpha0 thật, không nền đen/nâu/caro. Tia sáng có tâmcyan/trắng, ít và nhỏ, không lấp bằng sét hoặc biến khói thành lửa.
Cả8ô cùng hệ tọa độ, tâm chân nguồn tại(x192,y470). Vùng khói lớn nhất nằm trongx32..352 vày100..475; đủ margin, không tràn/cắt các ô. Không dịch/scale riêng theo ô: hình nhỏ/lớn là tiến trình nở-tan tự nhiên của cùng cụm khói.
8frame trái sang phải, trên xuống:
0 BẬT KHÓI: cụm tím thấp nhỏ rộng140px/cao70px quanh chân y470, cuộn đầu tiên,1–2tia cyan bên trong.
1 CUỘN NỞ: các búi tròn mềm cuộn lên rộng260px/cao230px, đáy lan sát đất sang2bên,3tia nhỏ lóe phân bố khác0.
2 ĐỈNH KHÓI: đám khói rộng310px/cao340px che được nhân vật khi ghép riêng, lavender mềm, chỗ dày/loãng có chiều sâu; tia cyan đan ngắn ở trong, không bức tường mây vuông.
3 HÉ BÓNG: khói bắt đầu tách sang2bên, có khe trong suốt hẹp ở giữa để ghép thấy bóng người, phía trước thấp còn wisps; tia cyan đổi chỗ ngẫu nhiên có kiểm soát.
4 LỘ RÕ: khói cuộn tản ra hai bên, LỖ RỖNG ALPHA ởgiữa lớn hơn để thấy đầu/thân người ghép;3–4dảiwispsquanhchân, hai tia nhỏ ở rìa.
5 TAN DẦN: chủ yếu khói mỏng thấp ởhai bên và chân, rời lên trên ít vệtloãng, trung tâm trống rõ,1tia cyan nhỏ.
6 GẦN HẾT: vài wisps tím nhạt rời ở độcaoy370..450, không dải khói dày,1đốmcyan.
7 DƯ ÂM CUỐI: vài vệt tím cực mảnh rất nhạt/vài hạt cyan nhỏ, trên nềntrongsuốt; KHÔNG để ô hoàn toànrỗng vì cần thấy frame tan cuối.
Cảm giác bất ngờ nhưng mềm mại: nở nhanh rồi xoáy nhẹ và tản chậm, điện chỉ điểm xuyết. Không vụ nổ lửa, không đồ vật/sàn/hìnhninja/vòngphép/rồng, không chữ/số/nhãn/grid/watermark. PNG alpha thật với mây mờ bán trongsuốt và nền ngoài khói alpha0; không có rectangle nền hoặc sương haze ngoài khuônkhói.
