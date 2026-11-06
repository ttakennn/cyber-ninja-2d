# Huyết Ảnh Loạn Đao — nguồn art

Tool: `image_gen.imagegen` built-in; cả hai ảnh có nền alpha. Tham chiếu danh tính: `docs/characters/boss-khan/animation/assets/boss-khan-v1.png`; tham chiếu chuyển động đã chốt: `docs/characters/boss-khan/animation/dash/dash-contact.png` và `docs/characters/boss-khan/animation/combo/combo-b-contact.png`. Không chỉnh các ảnh tham chiếu.

## Ảo ảnh

Prompt: Bốn pose Khan toàn thân trong sheet 2×2, lần lượt lao ngang sang phải, lao ngang sang trái với giải phẫu vẽ lại, lao chéo xuống phải, lao chéo lên trái. Giữ khuôn mặt/mặt nạ/tóc, áo trắng xám xẻ tà, quần tối, chi tiết cyan và song đao cong đỏ-cyan đúng bản đã duyệt. Thêm vệt tốc ảnh mảnh phía sau, không biến nhân vật thành vạch sáng, không khói lớn, nền trong suốt; mỗi ô tách riêng và cùng tỷ lệ. Nguồn `exec-526df44b-cda7-4e8e-8680-7af083c6300b.png` được copy nguyên vào `source/phantoms.png`, SHA-256 `e39aee49daa3ce845277d83d195741e9fd2427d74e43b5a480b0f096c1234e52`.

## Boss thật và đòn quét

Prompt: Bốn pose 2×2 của chính Khan: hiện giữa sân trong thế thấp, xoay vai lấy đà, vươn cả hai tay quét ngang rộng với một cung đao đỏ/cyan lõi sáng, theo đà thu đao. Nhát cuối là quét rộng, không phải dấu X; giữ nhân dạng, cơ thể, trang phục và chất liệu đã duyệt, nền alpha, không chữ/cảnh. Nguồn `exec-bfa8a09c-53b7-4f4b-9cfe-ddf99ec5ff19.png` được copy nguyên vào `source/finisher.png`, SHA-256 `4910a2ebf257c000444d0e535820f5b2c1f4d50045def5b29ca449484fcc5fa7`.

Plan và crop nguồn từng ô: `animation-plan.json`. Cả hai sheet được authoring với **một scale chung cho mỗi sheet**, ô512×512, pivot(256,456), tham chiếu160px/world unit; không fit từng frame. Output, rect, ink bounds và hash nằm trong `atlas.json`. Preview dùng ba bóng ảo không gây sát thương; chỉ cú quét của Boss thật là nhịp tấn công được mô tả, còn hitbox/damage/AI vẫn chờ task tích hợp.
