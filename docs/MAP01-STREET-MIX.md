# Dãy phố ghép Map01 năm zone

Ngày 2026-11-01. Baseline `a90e287`, nhánh `codex/map01-visual-revision-rc2`.
Trạng thái ART PREVIEW, runtime NOT_RUN, chưa duyệt production/Step09.

Người dùng xác nhận: đưa quán Hủ tiếu, Siêu thị và sân Zone5 vào cùng dãy phố phía sau, cùng tỷ lệ/độ cuộn, thay thế từng đoạn phố cũ và bỏ dãy nhà riêng phía trước.

## Bố cục mới

- Chỉ alias `map01-five-zones` đổi bố cục. `map01` và các alias cũ tiếp tục dùng dữ liệu hiện tại.
- Bỏ background lặp `buildings-near` khỏi alias năm zone và bỏ sáu decoration backdrop/biển riêng của Zone4/5. PNG được tái sử dụng trong layout mới, không xoá hoặc sửa ảnh nguồn.
- Dùng ảnh phố v2 cho đoạn trước X88; X88..112 dùng hai trang quán RC2 và hai biển props-v2; X112..144 dùng hai trang sân RC2. Không vẽ thêm phố cũ phía sau các đoạn đã thay.
- Các mảnh cùng Z=−2, parallaxX=0.65, baseline Y=−2.5. Hệ số ngang là 0.65; theo ảnh đường vàng bổ sung, `heightScale=1.4` tăng riêng chiều cao 40% trên nền hệ số 0.65. Riêng sân Zone5 dùng `zone5HeightScale=2.3` để phần nhà nhìn thấy cân với phố. Biển được biến đổi cùng quán nên giữ vị trí tương đối, không còn đứng cố định phía trước một lớp phố khác.
- Tọa độ X tác giả được đổi sang không gian parallax bằng `x × scale`. Renderer đặt X thực bằng `x dữ liệu + cameraX × (1 − parallaxX)`. Với scale=parallax=0.65, khi camera tới khu vực của quán thì quán vẫn nằm tại khu vực đó trong khung hình.
- Bù padding alpha dưới chân: ảnh phố v2 có 34 hàng rỗng (đã đọc pixel PNG), quán RC2 42 hàng, sân RC2 95 hàng. Tất cả chân hình chạm cùng baseline đường sau biến đổi. Sky, city-far và city-mid giữ nguyên.
- Layout hữu hạn có đoạn đệm phía ngoài map X−32..0 và X144..176 để phủ viewport ở hai đầu. Các mảnh phố cuối đoạn crop UV, giữ tỷ lệ ảnh; không tạo một PNG khổng lồ hoặc dependency mới.

Giữ nguyên terrain, collider, vùng leo, thang, bậc, spawn, deathY, camera, input, physics, animation/pivot, chân tường thấp và các khe mái. Không thêm boss/combat/checkpoint/cổng khóa.

## File thay đổi và schema

- `integration/map01-street-layout.json`: cấu hình background nguồn, baseline, scale, padding, các đoạn dùng phố v2 và sáu ID chuyển vào layout chung. Trạng thái ghi rõ chưa nghiệm thu.
- `scripts/generate_map01_five_zones.mjs`: đọc cấu hình, thay hai lớp cũ bằng dãy phố ghép, đổi tọa độ/scale và sinh JSON. Kiểm nguồn background và đủ sáu ID trước khi ghép.
- `src/world/levels/map-01-five-zones.json`: sinh lại từ generator; không sửa output riêng.
- `src/world/EnvironmentData.ts`: thêm tùy chọn `layer: background` cho mảnh ảnh hữu hạn tại Z<−1, và `parallaxX` hữu hạn trong [0,1] chỉ dành cho lớp này. Trường vắng mặt giữ hành vi cũ; collision vẫn phải false, vị trí/kích thước/UV vẫn kiểm như trước.
- `src/rendering/EnvironmentRenderer.ts`: theo dõi các mảnh có parallax, chỉ cập nhật X theo camera. Y/UV/scale giữ cố định, dùng chung geometry, mỗi URL tải một lần và dùng dispose hiện có; danh sách parallax được dọn khi dispose.
- `tests/StreetLayout.test.ts`: thêm test schema/depth/parallax sai, layout không trùng hai hàng, độ liên tục giữa các đoạn, chân alpha, biến đổi kích thước và pha cuộn ảnh/biển ở bốn viewport, prop đứng yên, tải/dispose tài nguyên.
- `tests/FiveZones.test.ts`, `tests/Map01RevisionRC2.test.ts`: cập nhật kỳ vọng cho lớp nền mới; giữ kiểm geometry/camera/hazard và asset nguồn.
- `README.md`, `docs/MAP01-VISUAL-REVISION-RC2.md`, báo cáo này: trạng thái và cách mở bản ghép.

Metadata/provenance nguồn props-v2, backgrounds-v2, RC1 và RC2 không đổi. Các mảnh `street-mix-*` là dữ liệu dựng cảnh từ ảnh đã có, không phải artwork mới đã được duyệt.

## Kết quả thực tế và mục còn mở

Điều chỉnh theo đường vàng: tăng toàn bộ dãy `street-mix-*` từ chiều cao nền 5.2 lên 7.28 unit; quán/sân/biển cũng tăng chiều cao cùng hệ số 1.4, neo quanh đường Y−2.5 và bù alpha tương ứng. Không đổi bề ngang, tọa độ X, đường nối, parallax, camera, terrain hoặc gameplay. Đây là mức ước lượng theo ảnh (khoảng 40%), chưa đối chiếu vị trí đường vàng bằng ảnh runtime mới. Đã sửa cấu hình/generator rồi sinh lại JSON (exit 0); các test kỳ vọng chiều cao được cập nhật nhưng NOT_RUN.

Sửa riêng Zone5 theo ảnh tiếp theo: PNG sân có alpha trong hàng 280..672 và 290..672; phần trên trống làm nhà nhìn thấp khi dùng cùng heightScale1.4. Thêm `zone5HeightScale=2.3` thay cho hệ số chung ở hai mảnh sân; chiều cao canvas tăng 5.46→8.97 unit, phần nhà nhìn thấy khoảng 4.59/4.47 unit. Neo chân alpha ở Y−2.5, giữ chung tỷ lệ Y cho cả hai trang để đường nối giữa sân không lệch. Các đoạn phố/quán khác, chiều ngang, tọa độ X, parallax và gameplay không đổi. Đã sinh lại JSON (exit 0); cập nhật test chiều cao nhìn thấy nhưng NOT_RUN, chưa có ảnh runtime mới.

Đã đọc source, metadata, ảnh phố v2, và sinh lại JSON bằng generator năm zone (exit 0). Chưa chạy generator `--check`, test, build, lint, formatter hoặc typecheck riêng. Chưa khởi chạy/đi lại trong trình duyệt, chưa cập nhật dist, chưa chụp ảnh mới, chưa thu console/DPR/FPS.

Các test được thêm/cập nhật đều **NOT_RUN**. Không dùng ảnh hoặc log bản trước làm bằng chứng cho bố cục này.

Cần nghiệm thu khi được phép: chuyển tiếp X88/112/144 và các đường nối/crop, alpha/bleeding khi cuộn/resize, chữ hai dòng Hủ tiếu/nam vang và Siêu thị, độ rõ player, vị trí quán theo camera, bốn viewport 1920×1080/1280×720/1024×768/540×960, console và đi toàn tuyến. Việc nối đúng biên dữ liệu chưa chứng minh đã kín seam mỹ thuật trong game; nếu cần connector artwork ở mép ghép phải đánh giá từ ảnh runtime, không tự gọi bản này là final.
