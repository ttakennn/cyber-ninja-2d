# Map01 Five Zones — Graybox Implementation

**GRAYBOX, chưa phải production.** Nhánh `codex/map01-five-zones`; commit mã/build/ảnh **12244bf98183262bb312b164c4d550ad6e968945**, baseline **6492090e33da4f6925681ef42a18cf4329a043c4**. HEAD trước sửa đúng baseline, workspace sạch; không có sửa mới hơn cần mang theo. Không merge master hoặc triển khai Task009/combat.

Đã đọc README, SOURCE-REVIEW, SOL-TASK, ACCEPTANCE, ART-BRIEF và master-data của gói `C:\Users\anhthaitrong\Documents\ChatGPT\Game Ninja 2D\Cyber_Ninja_Map01_5Zone_Design_v1`. Áp dụng AGENTS do người dùng cung cấp trong chat; không thấy AGENTS khác ở project/cha đã tra cứu. Yêu cầu hiện tại cho phép test/build; không chạy lint, formatter hoặc typecheck riêng.

## Mở level và dữ liệu

Chạy `npm run dev`, mở `?level=map01-five-zones`. `map01`, `map01-graybox`, playground, small và tiles giữ nguyên. Alias mới có tiêu đề/nhãn GRAYBOX riêng; không đổi UI alias cũ. Không load bản vẽ thiết kế hoặc proof làm ảnh production.

`scripts/generate_map01_five_zones.mjs` đọc **map-01-visual-pilot.json hiện tại**, không dựng lại từ graybox Task007. Giữ nguyên 11 solids (gồm upper-roof-support), spawn, climbable, physics/config, deathY, camera followY và Y bounds, background/props/visuals cũ. Chỉ thêm ground `street-extension-z45`, tâm (112,-3.25), 64×1.5, X80..144/top=-2.5. Chuyển tiếp từ mái Y3 hạ 5.5 unit là một chiều; không thêm thang ngược, fall damage hay chỉnh jump.

Camera maxX=144; grid 288×32×6=55.296 ô, không tăng giới hạn parser. Mỗi row được mở cùng chiều rộng. Sàn mới và foundation tô vào các layer đã có; không tô kín ba khe mái. X80..88 không có prop, collision mới chỉ là mặt đường. Lõi X120..136 không có vật cản/foreground hoặc boss; tường/cửa cuốn graybox chỉ là backdrop, không collision. Cổng là khung nét đứt open-state, không khóa. Không có checkpoint/trigger thắng/camera lock/HP/AI/đòn đánh.

Marker kết thúc cũ X77.5..78.5/Y3..5.5 được xóa chỉ ở dữ liệu alias mới. Các ô cũ khác được giữ, không sửa file Map01 gốc. Giữ thang, crouch/headroom, nội suy và fall recovery cũ.

## Placeholder và asset còn thiếu

Năm file master-data được giữ nguyên trong `integration/five-zone-design/` làm nguồn thiết kế, không đưa encounter/availability vào parser runtime. Bốn asset có thật được tái dùng qua năm placement từ runtime-reuse-additions: giỏ hoa **treo**, hai đèn tường, thùng và pallet ở rìa sân. File thực phải tồn tại trước khi generator thêm URL.

12 asset chưa runtimeReady được thay bằng SVG tự dựng đơn giản, nhãn **GRAYBOX / CHỜ ASSET — KHÔNG COLLISION**, trong `public/assets/environments/map01/five-zone-graybox/`. Catalog mới ghi đúng hash SVG và trạng thái placeholder; `replacesPlannedImage` chỉ là tham chiếu trong catalog, không phải URL được tải bởi level. Không tạo hash/APPROVED cho planned PNG chưa có. Biển đọc đúng “Hủ tiếu nam vang” và “Siêu thị”; chưa phê duyệt artwork/typography production.

Các asset còn mở: hai mặt tiền Zone4, hai biển, đèn phố, hai chậu hoa đặt sàn, tường sân, cửa cuốn, cổng, vạch rìa và tường phụ Zone5. Không biến giỏ treo có sẵn thành chậu sàn, không đổi text metadata biển Phở để giả làm biển mới. Khối graybox có thể lớn/ít chi tiết; đó là preview bố cục, không bộ art cuối.

Tạo lại: `node scripts/generate_map01_five_zones.mjs`. Chế độ đối chiếu không ghi: `node scripts/generate_map01_five_zones.mjs --check`. Generator tạo JSON, SVG và catalog đồng bộ; không sửa riêng output. Không cần dependency mới.

## File chính

- Mới: generator, `src/world/levels/map-01-five-zones.json`, `tests/FiveZones.test.ts`, năm file thiết kế, 12 SVG/catalog và hồ sơ `docs/map01-five-zones/`.
- Sửa: registry `src/world/levels/index.ts` thêm alias, `src/main.ts` chỉ đổi tiêu đề/nhãn khi alias là map01-five-zones.
- Không sửa generator/file dữ liệu Map01 cũ, physics/entities/animation/input/GameCamera/core/config hoặc PNG/metadata production. `git diff --exit-code 6492090 --` các đường dẫn bảo toàn trả exit 0. Diff source đã theo dõi trước commit là 7 dòng thêm/1 dòng thay; phần còn lại là file mới, phần lớn dữ liệu JSON/design.

## Test và build cuối

Node 24.22.1. [test.log](map01-five-zones/test.log): **388/388 test, 30/30 file, exit 0, 3.14 giây**. Thêm sáu trường hợp: alias/tương thích source mới nhất, grid/ô cũ/marker, URL thực/placeholder, hai mô phỏng chạy hoặc nhảy khỏi mép mái tới nền mới, tái tạo generator. Mô phỏng xác nhận tiếp đất trong 80..88, đi tới X143.5 mà không đổi physics. Bộ test cũ vẫn qua.

[build.log](map01-five-zones/build.log): **exit 0**, TypeScript trong script build qua, Vite 8.3.5/37 module/**3.00 giây**. JS `index-D8rgOncG.js` **1.120,50 kB**, gzip **158,68 kB**; CSS 1,85/gzip 0,78; HTML 1,26/gzip 0,69. Cảnh báo chunk >500kB và gợi ý worker/isolation của Vitest còn; không đổi cấu hình để giấu cảnh báo.

Lần kiểm đầu có lỗi kiểu vùng leo trong test mới và mô phỏng đi quá mép X144 rồi kỳ vọng vẫn đứng trên sàn. Đã dùng dữ liệu qua parser và dừng mô phỏng trong sàn; không sửa physics hoặc hạ tiêu chí tiếp đất để làm pass. Sau quan sát ảnh đã tách dòng chữ placeholder cho dễ đọc; log và mọi ảnh bàn giao là từ build sau chỉnh này.

## Đi tuyến thực tế

Production preview dùng localhost:4180, **IAB**. Không yêu cầu Chrome/Edge trong lượt graybox này, không lấy ảnh Chrome cũ làm bằng chứng. Đi bằng bàn phím, không teleport hoặc sửa runtime state.

| Kiểm thực tế trên build cuối | Quan sát |
| --- | --- |
| Chạy/nhảy thùng, crouch qua hầm, nhả cúi và Space dưới mái | X13.14/Y-2.05, standingBlocked=true; không xuyên mái; ra hầm đứng lại |
| Bậc và thang | Tới X28.8, bám thang X29, giữ lên tới Y3.2, xuống Y2.453 rồi rời sang ban công |
| Ba khe mái | Tới các tâm Y3.8/4.3/3.8; không đổi vị trí mặt mái hoặc tường X37 |
| Chuyển tiếp mái→Zone4 | Chạy khỏi mái; đáp X82.4/Y-1.7, Respawns=0, trong vùng trống 80..88 |
| Quán và siêu thị | Đứng X93 và 104.5, Y-1.7, không prop chặn/che nhân vật; biển đúng chữ |
| Arena | Tới X127.4, nền phẳng, không boss/cổng khóa/camera lock; F3/F4 bật/tắt và chụp cùng cảnh |
| Cuối màn | X142.2, camera X136 tại 16:9, maxX level144 |
| Fall/respawn | Đi quá mép144, Respawns=1, về (2,-1.7), camera(8,0); Space sau respawn nhảy lại được |
| Alias cũ | map01/map01-graybox có bounds0..80; playground/small/tiles tải được; warn/error mỗi trang=[] |

Đổi chiều W↔S/dừng thang đã thực hiện trong lượt quan sát trước chỉnh chữ placeholder; lượt build cuối lặp leo lên, xuống và rời thang. Chưa giữ ở đáy thang trên build cuối. Chưa nhảy khỏi sát mép mái trong browser; hai biến thể này được kiểm bằng unit simulation, không gọi đó là thao tác browser. Smoke các level cũ chỉ là tải/đọc state, không đi lại mọi tuyến.

Console cuối alias năm zone là `[]` ở mức warn/error. HUD F3 tại các điểm đọc chủ yếu 60 FPS; không có trace frame liên tục hay benchmark GPU, không cam kết hiệu năng trên máy khác. Browser version/DPR thực không được lấy; metadata runtime không đoán các giá trị đó. Lệnh đọc navigator.userAgent trong scope chỉ đọc không được cung cấp, đã bỏ việc đọc này, không ảnh hưởng game.

## Ảnh và hồ sơ runtime

**32 screenshot thật** từ cùng build/commit mã: tám cảnh × bốn viewport 1920×1080, 1280×720, 1024×768, 540×960. Cảnh gồm spawn, landing, noodle-shop, market, arena, arena-debug (F3/F4), exit và respawn. Biển không thể cùng nằm trọn trong portrait, lõi16 unit cũng không thấy toàn bộ ở màn dọc; giữ camera hiện có theo yêu cầu.

Ảnh JPEG nguyên byte từ IAB. API trả ảnh 1920×1061 khi đặt viewport CSS1920×1080; ba cỡ còn lại trả đúng kích thước. Không kéo giãn ảnh để giả đủ 1080. Kích thước file thực trong [image-dimensions.json](map01-five-zones/image-dimensions.json); [runtime.json](map01-five-zones/runtime.json) ghi code commit/build SHA-256, hash ảnh, viewport đặt và các điểm HUD đã đọc. Các điểm HUD được chép từ kết quả accessibility, không phải telemetry từng frame. [legacy-smoke.json](map01-five-zones/legacy-smoke.json) ghi alias cũ.

| Cảnh | 1920×1080 (file cao1061) | 1280×720 | 1024×768 | 540×960 |
| --- | --- | --- | --- | --- |
| Tiếp đất | [Ảnh](map01-five-zones/landing-1920x1080.jpg) | [Ảnh](map01-five-zones/landing-1280x720.jpg) | [Ảnh](map01-five-zones/landing-1024x768.jpg) | [Ảnh](map01-five-zones/landing-540x960.jpg) |
| Hủ tiếu | [Ảnh](map01-five-zones/noodle-shop-1920x1080.jpg) | [Ảnh](map01-five-zones/noodle-shop-1280x720.jpg) | [Ảnh](map01-five-zones/noodle-shop-1024x768.jpg) | [Ảnh](map01-five-zones/noodle-shop-540x960.jpg) |
| Siêu thị | [Ảnh](map01-five-zones/market-1920x1080.jpg) | [Ảnh](map01-five-zones/market-1280x720.jpg) | [Ảnh](map01-five-zones/market-1024x768.jpg) | [Ảnh](map01-five-zones/market-540x960.jpg) |
| Arena | [Ảnh](map01-five-zones/arena-1920x1080.jpg) | [Ảnh](map01-five-zones/arena-1280x720.jpg) | [Ảnh](map01-five-zones/arena-1024x768.jpg) | [Ảnh](map01-five-zones/arena-540x960.jpg) |

## Còn mở

Đây chỉ là nền dữ liệu/graybox năm zone. Cần author và duyệt 12 asset mới, đóng các lỗi art/UI/runtime còn mở từ Task008.3, kiểm thêm các biến thể transition/viewport/DPR/Chrome hoặc Edge khi nghiệm thu production. Chưa có đường quay ngược từ Zone4 lên mái C; cần thiết kế riêng nếu được yêu cầu. Không boss/combat/checkpoint/cổng khóa và không tự khóa Step09.
