# Map01 props/background v2

Cập nhật 2026-11-02: người dùng yêu cầu bộ v2 thay tên canonical `public/assets/environments/map01/backgrounds/` và `props/`; catalog background hiện là `backgrounds.json`. Nội dung bên dưới và `path-replacements.json` giữ lịch sử bàn giao ban đầu, không phải hướng dẫn di chuyển hiện tại. Runtime/generator/test đã dùng đường dẫn canonical.

Art candidate để thay asset cũ. Baseline review: 5d8674d. Đã chuyển runtime `map01` và `map01-five-zones` sang backgrounds-v2/props-v2; chưa nghiệm thu production.

Tích hợp ngày 2026-10-31: đã sửa nguồn generator/input và sinh lại hai level, chỉ đổi URL của bốn background và bảy placement prop đang dùng. Giữ placement/gameplay, foreground/production và atlas Zone 4/5 RC1. Bốn biển mới chưa có placement nên chưa được thêm. Test/build/runtime: NOT_RUN; chưa cập nhật dist. Các bước và trạng thái trong path-replacements.json bên dưới là thông tin bàn giao trước tích hợp.

## Đã hoàn thành

- Vẽ lại 26 props, giữ ID, tên file tương đối, canvas, worldSize, anchor và atlasRect của bản cũ.
- Thêm bốn biển: sign-supermarket 264×106, sign-com-tam 180×115, sign-hu-tieu 264×106, sign-banh-mi 264×106. Các biển này chưa có bản cũ nên dùng kích thước nhóm biển tương ứng; chưa có placement mới.
- Đủ tám nội dung: Nhà thuốc, Cà phê sữa Đá, Trà đá vỉa hè, Siêu thị, Cơm tấm sài gòn, Hủ tiếu nam vang, Phở 24/7, Bánh mì ngon. Chữ trong artwork có thể dùng kiểu in hoa.
- PNG alpha palette256, atlas2048×2048, gutter8/extrusion4. Hình được fit vào vùng alpha cũ và căn chân; actual alphaBounds được cập nhật trong catalog.
- backgrounds-v2/buildings-near.png 2048×832 với bốn cửa hàng Phở/Bánh mì/Cà phê/Nhà thuốc và cờ Việt Nam. Ba background khác sao nguyên byte để thư mục mới có đủ bộ.
- Nguồn dùng image_gen.imagegen built-in, foreground làm chuẩn và ảnh Phố đêm Sài Gòn dưới mưa làm tham khảo. Biển được tách/tái tạo thành sprite riêng, không phải crop nguyên byte từ ảnh cảnh. Hủ tiếu được tạo mới.

## Review Sol

Đã đọc diff generator/UI và docs/MAP01-Z45-ART-RC1.md ở commit5d8674d. Việc resolve22ID giữ placement và chỉ đổi image/pixelSize/sourceRect phù hợp mục tiêu tích hợp. Ba reuse còn lại được giữ; crate/pallet không append trùng.

Sol ghi rõ test/build/runtime/ảnh bốn viewport NOT_RUN. Chưa có bằng chứng để duyệt hình ảnh bản atlas trong game hoặc đóng Step09. Lượt v2 này cũng không chạy test/build/lint/typecheck/formatter.

## Đổi sang v2 ở bước tiếp theo

1. Đọc AGENTS và giữ các sửa mới hơn baseline.
2. Trong scripts/generate_map01_pilot.mjs, đổi nguồn catalog props/props.json sang props-v2/props.json. Chỗ dựng URL đang dùng match[1] làm tên thư mục; đổi riêng nhánh props sang props-v2, giữ foreground.
3. Background thực tế lấy từ scripts/map01-environment-pilot.input.json, không tự đọc backgrounds.json. Đổi riêng image của buildings-near sang assets/environments/map01/backgrounds-v2/buildings-near.png tại nguồn input, hoặc đổi toàn tiền tố backgrounds/ nếu muốn dùng trọn thư mục v2. backgrounds-v2.json là catalog bàn giao, chưa tự được runtime nạp.
4. Sinh lại visual pilot rồi five zones bằng generator tương ứng. Không chỉ sửa JSON output. Không tìm-thay props/ toàn repo, không đổi worldSize/physics/collider/camera.
5. Giữ foreground, production và expansion-z45-rc1. Các prop reuse trong integration/five-zone-design/runtime-reuse-additions.json cần xét riêng; crate/pallet Zone5 hiện bị atlas RC1 override nên đổi props-v2 không thay chúng.
6. Bốn biển bổ sung chỉ tích hợp khi có placement được duyệt. Không đổi translation keys hay biển của zone khác để giả làm biển mới.

## Điều kiện duyệt

Kiểm chân vật thể, alpha/UV, chữ Việt ở kích thước thật, độ rõ player, nối strip khi camera cuộn và UI tại bốn viewport. Preview lặp hai lần chỉ là ảnh authoring tĩnh. Không cam kết seamless runtime trước khi kiểm cuộn. Chỉ chạy test/build khi người dùng yêu cầu rõ theo AGENTS.

Ảnh gốc AI và prompt lưu ngoài public tại C:/Users/anhthaitrong/Documents/ChatGPT/Game Ninja 2D/Cyber_Ninja_Map01_Props_v2/. Game chỉ cần PNG/catalog đã tối ưu trong public.
