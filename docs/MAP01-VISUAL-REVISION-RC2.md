# Map01 Visual Revision RC2

Ngày: 2026-11-01. Baseline: `b81829a`.
Nhánh: `codex/map01-visual-revision-rc2`.
Trạng thái: đã tích hợp source/data, **ART PREVIEW RC2 / RUNTIME NOT_RUN**. Chưa merge master, chưa đóng Step09.

## Các thay đổi chưa commit lúc nhận bàn giao

Hai file trong ảnh Git status thuộc sửa camera RC2 đã được gói bàn giao áp sẵn:

- `src/core/Game.ts`: `camera.follow(player.visual.position, player.renderHeight)` dùng cùng chiều cao nội suy với player visual.
- `src/rendering/GameCamera.ts`: điểm bám Y = tâm visual − nửa chiều cao nội suy + nửa chiều cao đứng. Chân cố định khi cúi/đứng thì điểm bám không đổi; lời gọi cũ vẫn dùng chiều cao đứng mặc định. Giữ nguyên patch có sẵn, không áp hai lần.

Hai thư mục `integration/map01-revision-rc2/` và `public/assets/environments/map01/revision-rc2/` cũng đã có sẵn nhưng chưa được theo dõi. Chúng chứa plan/candidate và PNG, chưa được level registry nạp. HEAD lúc bắt đầu vẫn là `b81829a`; phần tích hợp RC2 chưa được commit trước lượt này.

## Tích hợp theo plan

| Khu vực | Thay đổi trong dữ liệu |
| --- | --- |
| Zone1 | Bỏ `passage-roof` và hình/collider hầm, facade/biển/đèn thuộc danh sách xoá. `street-crate` vẫn là collider 1×1; bỏ tile thùng, dùng `rc2-street-crate` PNG v2 căn alpha. |
| Zone2 | Bỏ `raised-step`, `balcony-crate` và collider của chúng; ghế/chậu mới chỉ trang trí. Bỏ cột tường và hình thang vàng. Thay `alley-ladder` bằng vùng leo tâm (29.55, 0.25), 1×5.5; PNG thang dùng worldSize/position đã căn alpha trong plan. Giữ ban công. |
| Mặt đường | Dùng `street-cap-ivy` top Y=−2.5, bottom Y=−4.5 tại X0..40 và X70..144. Xoá paint các vùng được chỉ định trên mọi layer, bỏ rectangle skin street/street-extension/roof4. Không thêm đường dưới vùng chết X40..70 hoặc ba khe mái. |
| Zone3 | Giữ mái/khe 48..50, 58..60, 68..70. Giữ sửa camera bám chân nội suy. Không sửa animator, pivot hoặc physics. |
| Zone4, riêng năm zone | Thêm `roof4-sealed-support` X70..80/Y−2.5..2 và ba collider bậc rộng 1.5, top 1.5/0/−1.5 tại X80..84.5. PNG bậc đúng metadata 576×512, worldSize 4.5×4. Giữ jump hiện có, không auto-step. |
| Zone4/5 | Bỏ decoration facade/cổng/props cũ theo danh sách, dùng bốn trang backdrop hữu hạn và biển exact `sign-hu-tieu`/`sign-supermarket` props-v2; không repeat. Giữ nguyên toàn bộ entry `z5-floor-edge-stripe`, gồm image/rect/position/size/z. |

Generator pilot lọc solid trước khi paint tile. Kích thước/placement crate, bench, ladder, planter lấy trực tiếp từ metadata đã căn alpha; không lấy worldSize mặc định của catalog.

`map01` chỉ nhận additions có phần hình nằm trước X80, không nhận support/bậc/backdrop Zone4/5. Module `rc2-street-78` được cắt còn X78..80 bằng sourceRect 256×256; không ép ngang module 512×256. Camera bounds/grid vẫn là 80 unit/160 cột.

Generator năm zone đọc pilot mới, giữ đường mở rộng X80..144, thêm bốn solid theo plan và resolve lại toàn bộ 41 additions theo ID để không trùng phần kế thừa. Module X78..82 được dùng đủ chiều rộng; module cuối X142..144 crop UV theo metadata. Grid/camera bounds vẫn là 288 cột/144 unit.

Pilot hiện có 8 solids; năm zone có 13 solids. Một climbable theo plan. Không thay gravity/jump, input, animation/pivot, timestep, spawn, camera bounds/followY, deathY, respawn hay các alias `playground`, `small`, `tiles`, `map01-graybox`. Không thêm boss/combat/checkpoint/cổng khóa.

## Source và tài liệu bàn giao

- `scripts/generate_map01_pilot.mjs`: đọc plan, xoá/thay geometry/visual được chỉ định, thêm phần RC2 trước X80, crop đoạn cuối và suppress paint.
- `scripts/generate_map01_five_zones.mjs`: thêm support/bậc, thay decorations theo plan, suppress skin mở rộng.
- `src/world/levels/map-01-visual-pilot.json`, `src/world/levels/map-01-five-zones.json`: sinh lại từ source generator, không copy candidate vào output.
- `src/core/Game.ts`, `src/rendering/GameCamera.ts`: giữ và đưa patch camera đã có vào commit.
- `src/main.ts`: nhãn riêng năm zone ART PREVIEW RC2.
- `README.md`, báo cáo này: trạng thái hiện hành và nghiệm thu còn mở.
- Tests được cập nhật: `EnvironmentData`, `EnvironmentPolish`, `FiveZones`, `ProductionArchitecture`, `Map01ScreenshotFixes`, `VisualClosure`, `Z45AtlasIntegration` để phản ánh các mục đã được RC2 thay thế, vẫn giữ kiểm tra source/asset cũ còn liên quan.
- `tests/BoundedCamera.test.ts`: thêm trường hợp 20 lần đổi chiều cao đứng/cúi, nhiều alpha nội suy và bốn viewport tại vị trí mái 2/3/4; lời gọi API cũ vẫn được test hiện có bao phủ.
- `tests/Map01RevisionRC2.test.ts`: thêm kiểm tra 41 additions/ID, hazard, alias 80 unit, crop, tile suppression/khe mái, alpha bounds, khoảng trống vùng thang/core, AABB bậc và hash/kích thước asset.

Nguồn [plan](../integration/map01-revision-rc2/map-revision-plan.json), [README bàn giao](../integration/map01-revision-rc2/README.md), [ACCEPTANCE](../integration/map01-revision-rc2/ACCEPTANCE.md), [manifest](../public/assets/environments/map01/revision-rc2/asset-manifest.json) giữ nguyên nội dung/provenance. `runtimeApplied: false` trong plan và trạng thái nguồn khác mô tả thời điểm bàn giao; không sửa nguồn để giả chứng nhận runtime. Báo cáo này ghi trạng thái tích hợp hiện tại.

Candidate JSON chỉ dùng tham khảo quyết định. Có khác biệt có chủ đích với snapshot: generator bỏ cả paint của `street-crate` theo `tilemapEdits.removeSolidPaintIds`; script xuất candidate bàn giao chỉ erase bounds của ba solid bị xoá và vùng street, còn paint thùng nằm trên đường. Output thực thi theo plan và prompt, không theo thiếu sót này của candidate. Không sửa candidate.

Các trang backdrop runtime: Zone4 2×1536×768, Zone5 2×2048×768. Hai strip authoring 3072/4096 px vẫn lưu làm nguồn, không được runtime tham chiếu. Không chỉnh PNG hoặc tự thay artwork.

## Kết quả thực tế

Đã đọc source/metadata/diff; xem trực tiếp street-cap, stairs, bốn trang backdrop và PNG biển Hủ tiếu hai dòng. Đây là xem asset, không phải ảnh game hay nghiệm thu hiển thị trong game.

Đã chạy hai generator ở chế độ ghi theo thứ tự pilot → five zones để tạo level JSON; exit 0. Không chạy `--check` hoặc lệnh validation. Chưa cập nhật `dist` hay production preview.

| Hạng mục | Trạng thái |
| --- | --- |
| Sửa generator rồi sinh JSON | Đã thực hiện |
| Test toàn bộ/test mới | NOT_RUN |
| Production build | NOT_RUN |
| Generator `--check` | NOT_RUN |
| Lint/formatter/typecheck riêng | NOT_RUN |
| Chrome/Edge/IAB, console, DPR, FPS | NOT_RUN |
| Đi tuyến/thang/bậc/cúi-đứng/respawn | NOT_RUN |
| Ảnh game từng zone/bốn viewport | NOT_RUN — không có ảnh mới |

Theo SOL-TASK và AGENTS, lượt thực thi này chưa có yêu cầu rõ chạy test/build/validation. Không dùng log hoặc ảnh bản trước để chứng minh RC2. Không có log test/build mới; chưa xác nhận các test đã viết đều pass.

## Sửa tiếp theo bốn ảnh người dùng (2026-11-01)

- Hình1: xoá marker tile X27..27.5/Y0..0.5 trong generator pilot; thang và hình nền phố giữ nguyên.
- Hình2: sửa phép quét rơi của `PhysicsWorld.moveY` dùng cùng dung sai tiếp xúc 1e-9 với `canOccupy`. Sau `tryResize` từ đứng sang cúi, tâm có thể thấp hơn ngưỡng mặt mái một sai số số thực rất nhỏ; điều kiện `start >= top` cũ bỏ qua mặt mái và nhân vật lọt xuống. Không thêm collider, đổi chiều cao nhân vật, gravity, input S hoặc quy tắc leo. Dung sai chỉ áp tại mặt tiếp xúc khi rơi, không giải xuyên sâu hoặc giữ nhân vật trên khoảng hở.
- Hình3/4: đọc alpha PNG cho thấy hai trang Zone4 có hàng alpha cuối 725/768 (42 hàng trống dưới), hai trang Zone5 có hàng alpha cuối 672/768 (95 hàng trống dưới). Generator năm zone bù Y lần lượt −42/128 và −95/128 unit, đưa chân hình sát top đường −2.5. Hai biển Zone4 hạ cùng −42/128 để giữ vị trí tương đối với quán. Giữ scale, ảnh/UV, mặt đường, hazard và geometry; không sửa PNG nguồn hoặc global parallax.
- Đã sinh lại JSON từ hai generator (exit 0). Thêm test giữ/nhả S qua physics thật trên bốn mái và cập nhật test marker/alpha alignment; các test này **NOT_RUN**. Chưa thao tác lại game hoặc chụp ảnh mới; chưa có xác nhận runtime cho bốn lỗi.

## Mục còn mở trước nghiệm thu

- Nhập/rời thang từ ground và balcony, dừng/đổi chiều/hai đầu; xác nhận không xuyên slab, không collider vô hình của hầm/bậc/chậu bị xoá.
- Nhảy ngược từ đường X84.5 qua ba bậc về mái X80, đi xuống không mắc góc, chặn thật dưới roof4. Không yêu cầu tự bước lên bậc cao 1.5 khi chỉ giữ D.
- Cúi/đứng tại chỗ ít nhất 20 lần trên mái 2/3/4; kiểm chân, camera/background/terrain Y, resize/chuyển tab, jump/climb/respawn.
- Kiểm top đường thẳng, lá dưới viền, không seam/alpha/UV/flicker khi cuộn, nối backdrop và độ rõ player. Kiểm đủ chữ hai dòng Hủ tiếu/nam vang, Siêu thị và hazard vẫn hiện trước mặt đường.
- Đi toàn tuyến và ba khe mái; kiểm core X120..136 trống.
- Chạy test/build mới khi được phép, lưu log; chụp game thật từng zone tại 1920×1080, 1280×720, 1024×768, 540×960, ghi commit/browser/version/DPR/kích thước viewport và ảnh thực/console.

Chưa đủ bằng chứng để duyệt production hoặc đóng Step09.
