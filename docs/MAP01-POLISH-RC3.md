# Map01 UI/Visual Polish RC3

Ngày 2026-11-01. Baseline `2e0fe6a`, nhánh `codex/map01-ui-polish-rc3`.
Đã tích hợp tuần tự sáu phần theo bảy ảnh người dùng. Trạng thái **CODE/ASSET INTEGRATED — RUNTIME NOT_RUN**, chưa duyệt production hoặc đóng Step09.

## Phân tích và kết quả từng phần

| Phần | Yêu cầu | Đã tích hợp vào source/data |
| --- | --- | --- |
| 1 — Hình1, Zone1 | Cột cao, biển mới, LED, ba thùng | Cổng từ 2.4832 lên 3.8 unit, chân cổng giữ đường. Biển “Phố Sài Gòn” cyan–tím, 3.4×0.75 tại (4.7,0.45), thay biển Phở riêng. Viền 32 bóng LED đổi hai nhóm theo chu kỳ 0.8s, chữ không nhấp nháy. Bỏ scooter. Ba thùng collider 1×1 có tâm X7.5/9.1/10.7, cách đều 1.6. |
| 2 — Hình2, Zone1/2 | Ghế/chậu là vật cản, thêm đèn | Ghế collider 2.5×1, tâm X22.5, chân −2.5. Chậu ban công collider 1.5×0.65, tâm X34, chân Y1. Đèn đường X25.4, phần nhìn thấy 1.3×2.7, không collider. |
| 3 — Hình3, Zone2 | Bồn lớn về đầu mái, hai cụm lan can | Bồn nước tâm X39.4/chân Y2, phần nhìn thấy cao 2.2, không collider như prop cũ. Thay lan can cũ bằng hai cụm tâm X44.1/46.6, collider 2.2×1.2, chân Y2; dùng crop alpha từ ảnh railing_cross hiện có. |
| 4 — Hình4/5, mái | Prop lớn hơn player, chậu trang trí | Chảo X55/chân Y3 cao 2.1; anten X63.2/chân Y3.5 cao 2.2; bồn X75.6/chân Y3 cao 2.2. Chín chậu tại X51.1/52.5/57.3/60.9/65.5/66.9/71/72.3/78.8, chân theo mái. Toàn bộ nhóm này không collider. |
| 5 — Hình6, Zone4/5 | Bỏ đoạn phố bị cắt, nền sát đường | Đoạn partial trước X88 thay bằng chậu potted-plant v2, cùng lớp/parallax phố. Thêm groundOverlap=0.035 cho cả dãy ghép và biển, giấu khe sáng dưới chân nhà; không dịch mặt đường/collider. |
| 6 — Hình7, cầu thang | Mặt bậc cùng chất liệu nhà | Bỏ ảnh toàn bộ bậc gạch cũ khỏi runtime, dùng ba mặt vữa từ architecture-0, cột crop X512..640, Y theo chiều cao bậc. Giữ ba nắp đá mỏng từ ảnh bậc cũ; mỗi mặt/nắp khớp AABB bậc tương ứng. Collider bậc không đổi. |

Mỗi phần được sửa và sinh lại JSON trước khi thực hiện phần tiếp theo. Đây là hoàn tất bước authoring/integration, không phải chứng nhận đã chơi thử từng phần.

## Quyết định bố trí và an toàn hồi quy

- Chỉ các vật được người dùng chỉ định là vật cản mới thêm collider: hai thùng mới, ghế, chậu ban công và hai cụm lan can. Tổng pilot 14 solids, năm zone 19 solids. Collider thùng đầu `street-crate` giữ nguyên.
- Vị trí/chiều rộng lối rời thang không đổi; nhóm bồn/hoa/đèn trang trí không sinh collider. Cần thử đường nhảy thực tế sau khi có phép nghiệm thu.
- `placeProp` nhận target bố trí độc lập với pixel. Alpha bounds chỉ dùng căn hình vào kích thước target; chân hình chồng nền 0.02 unit để không hở do mép ảnh/anti-alias. Không suy collider nhân vật từ sprite.
- Thùng cao 1, lan can cao 1.2, chậu cao 0.65; không thay gravity/jump hoặc thêm auto-step để vượt chướng ngại. Chưa xác nhận bằng thao tác bàn phím.
- Giữ nguyên timestep, input, camera, animation/pivot, climbable, bậc, khe mái, deathY, spawn và hệ thống respawn. Không combat/boss/checkpoint/cổng khóa.
- Cổng/props mới áp dụng cả `map01` và `map01-five-zones` qua generator pilot. Nền ghép và mặt bậc áp riêng level năm zone. `map01-graybox`, `playground`, `small`, `tiles` không đổi.

## Asset và provenance

Biển mới dùng **image_gen.imagegen built-in**, chỉnh từ sign-pho-247 v2 làm tham chiếu style. Đã xem ảnh đầu ra: đúng chữ “Phố Sài Gòn”, palette cyan/violet và khung thép navy. Không dùng ảnh tạo ra như bằng chứng game.

- PNG: `public/assets/environments/map01/ui-polish-rc3/sign-pho-sai-gon.png`.
- Manifest: `public/assets/environments/map01/ui-polish-rc3/asset-manifest.json`, ghi kích thước thật 2172×724, SHA-256, ảnh tham chiếu và file prompt. Crop runtime (58,137,2058,454) lấy bounds alpha≥32, không sửa PNG đã sinh.
- Prompt đầy đủ: [image-prompts.md](../integration/map01-polish-rc3/image-prompts.md).
- Bản gốc công cụ: `C:/Users/anhthaitrong/.codex/generated_images/01a186ed-7c3b-7910-a19b-66e98696e98e/exec-064f9494-5f2b-42b4-8a63-34704ae9eafe.png`. Asset runtime đã copy vào repo, không phụ thuộc đường dẫn này.
- Các prop khác tái sử dụng props-v2/foreground/production. Không ghi đè PNG/catalog nguồn; không tạo atlas mới cho một biển duy nhất. Bậc dùng UV của texture đã có, không vẽ vật liệu khác phong cách.
- Bounds crop railing_cross (10,8,346,171) được đọc từ alpha≥16. Texture mặt bậc dùng patch giữa các cửa sổ, tránh lấy nguyên cửa/quạt lên cầu thang; vẫn cần xem runtime để duyệt mỹ thuật.

## File thay đổi

- `scripts/map01-polish.mjs`: bố trí RC3, căn alpha, collider mới, crop mặt bậc/nắp.
- `scripts/generate_map01_pilot.mjs`, `scripts/generate_map01_five_zones.mjs`: gọi bước RC3 từ source, sinh JSON; thay mảnh background partial bằng chậu và bù groundOverlap.
- `integration/map01-street-layout.json`: chậu transition và độ ăn xuống mép đường.
- `src/world/EnvironmentData.ts`: metadata LED tùy chọn, kiểm hai màu #RRGGBB và period trong 0.1..10s; dữ liệu vắng trường vẫn giữ hành vi cũ.
- `src/rendering/EnvironmentRenderer.ts`: tạo bóng LED một lần bằng geometry chia sẻ, hai material màu nhấp nháy theo delta; dispose cùng renderer. Không tạo mesh mới mỗi frame.
- `src/core/Game.ts`, `src/world/TestLevel.ts`: truyền frameDelta cho visual; lời gọi cũ vẫn có default delta=0. Physics/update cố định không đổi.
- Hai JSON level pilot/five-zones: sinh từ generator, không sửa output riêng.
- `tests/Map01Polish.test.ts`: collider, alpha, prop trang trí, PNG/hash, LED cadence/dispose/validation và mặt bậc.
- `tests/EnvironmentData.test.ts`, `FiveZones`, `Map01ScreenshotFixes`, `Map01RevisionRC2`, `StreetLayout`: cập nhật kỳ vọng bị RC3 thay thế, giữ các kiểm tra khác.
- `README.md`, báo cáo này, file prompt, PNG/manifest mới.

## Kết quả và bước tiếp theo

Đã thực hiện: đọc source/dữ liệu/ảnh, tạo và xem biển mới, đọc bounds alpha, chạy generator ở chế độ ghi (exit 0), rà diff. Dữ liệu hiện có 71 decorations pilot và 110 decorations năm zone, không tính 32 bóng LED là con của mesh biển.

**NOT_RUN:** toàn bộ test, build, generator --check, lint/formatter/typecheck riêng, trình duyệt/console, đi toàn tuyến, chụp ảnh bốn viewport. AGENTS yêu cầu phép rõ trong request thực thi; task này chưa cấp phép chạy những kiểm tra đó. Không dùng log/ảnh cũ để xác nhận RC3, chưa cập nhật dist/production preview.

Các bước nghiệm thu tiếp theo khi được phép:

1. Chạy test/build mới, lưu đúng log và xử lý lỗi nếu có.
2. Đi từ spawn qua ba thùng/ghế, nhập-rời thang, vượt chậu/lan can, ba khe mái và bậc hai chiều; thử crouch/headroom, camera/respawn. Kiểm collider debug khớp hình mới.
3. Xem LED khi đứng/chạy, pause/đổi tab; kiểm chữ và bố cục cổng, chân prop, các mép ghép/nền Zone4/5 và texture bậc.
4. Chụp 1920×1080, 1280×720, 1024×768, 540×960 từ cùng commit; ghi browser/DPR/console và kích thước ảnh thực.
5. Chỉ chốt art/layout cho bước tiếp theo sau khi những mục trên đạt hoặc vấn đề còn mở được người dùng chấp nhận. Bản này chưa được gọi là production hoàn chỉnh.
