# Task 008 — Map01 Visual Pilot (Three.js)

## Kết quả và phạm vi

Đã tích hợp môi trường vào `?level=map01`, giữ bản đối chiếu tại `?level=map01-graybox`. Đây là pilot để duyệt trong game, chưa phải artwork production hoàn tất. **Step 09 Final Production Asset Pack chưa thực hiện, chờ duyệt ảnh A/B/C.** Không thay sprite, atlas nhân vật, pivot, scale, animation leo, input, timestep, nội suy, camera, movement, collision hoặc fall recovery.

Đã đọc prompt/checklist bàn giao, Task 007, schema level/tilemap, Game, renderer, camera, physics và test liên quan trước khi sửa. Không tìm thấy AGENTS.md khác trên đĩa trong project/các thư mục cha đã tra cứu; áp dụng hướng dẫn người dùng cung cấp trong chat. Prompt Task 008 cho phép full test/build; không chạy lint hoặc formatter. Không thêm dependency hoặc sửa package/lockfile.

## File thay đổi

| File | Nội dung |
| --- | --- |
| `src/world/EnvironmentData.ts` (mới) | Schema tùy chọn và parser có lỗi theo đường dẫn field |
| `src/rendering/EnvironmentRenderer.ts` (mới) | Tải ảnh, kiểm kích thước, parallax theo camera, props và thu hồi tài nguyên |
| `src/world/LevelData.ts` | Nối environment tùy chọn vào parser hiện có |
| `src/world/TestLevel.ts` | Sở hữu renderer môi trường; load/update/dispose |
| `src/core/Game.ts` | Một lời gọi cập nhật môi trường sau camera follow, trước render |
| `src/world/TilemapData.ts`, `src/rendering/TilemapRenderer.ts` | Tint tùy chọn theo layer; mặc định trắng giữ appearance level cũ |
| `src/world/levels/map-01-visual-pilot.json` (mới) | Visual pilot; giữ field gameplay của graybox |
| `src/world/levels/index.ts` | `map01` dùng pilot, thêm alias `map01-graybox`, giữ ba level cũ |
| `scripts/map01-environment-pilot.input.json` (mới) | Bản placement đầu vào từ handoff |
| `scripts/generate_map01_pilot.mjs` (mới) | Tạo dữ liệu pilot từ graybox/placement/metadata; không phải logic physics |
| `public/assets/environments/map01/` (mới) | Nguyên thư mục public bàn giao: 95 PNG và 5 JSON |
| `tests/EnvironmentData.test.ts`, `tests/EnvironmentRenderer.test.ts` (mới) | Schema, tài nguyên, parallax, tint, tương thích và nguồn asset |
| `index.html`, `README.md` | Nhãn và hướng dẫn mở pilot/graybox |
| `docs/TASK-008.md`, `docs/task-008-*.jpg`, `docs/task-008-runtime-observations.json` (mới) | Báo cáo, ảnh thật và mẫu FPS |

Không sửa dữ liệu `playground`, `small`, `tiles` hoặc `map-01-graybox.json`. Trường `id` nội bộ của cả hai bản Map 1 vẫn là `map01`; vì vậy F3 ở alias graybox cũng hiển thị `map01`.

## Nguồn asset và bố trí

Nguồn duy nhất là `Cyber_Ninja_Task008_Pilot_Handoff/asset-qa-v3/Cyber_Ninja_Map01_PreStep09_Final_Acceptance_v3/public/assets/environments/map01/`. Copy nguyên 100 file, tổng 17.898.665 byte; đối chiếu SHA-256 toàn bộ 100 file nguồn/đích có 0 sai khác. Không vẽ lại hay chỉnh PNG, không lấy ảnh concept/preview/quarantined làm texture. Metadata nguồn được giữ nguyên, không tự nâng trạng thái nghiệm thu mỹ thuật. Runtime dùng 15 URL môi trường duy nhất (4 background và 11 ảnh cho 12 props), thêm terrain atlas.

Một số tên ảnh placement cũ không khớp bản metadata mới. Generator tra ID trong `props.json`/`foreground.json` để lấy tên ảnh và kích thước thực, không đoán theo tên. Test kiểm hash foreground đang dùng với metadata đã chấp nhận, header/kích thước PNG và RGBA khi áp dụng.

Sau quan sát Three.js, hiệu chỉnh ba vị trí trang trí để bớt lơ lửng; giữ nguyên worldSize và ảnh:

| ID | Bottom-center mới |
| --- | --- |
| `foreground-street_shop_awning-9` | (4.7, -2.5), chân trên đường |
| `props-sign-pho-247-1` | (4.7, -0.8), dưới mái hiên |
| `foreground-railing_cross-11` | (46, 2), trên mái đầu |

Các background lặp có `bottomOffset: 1.5` để phần nhà phía dưới hiện rõ hơn; sky dùng 0. Đây là bố cục pilot cần duyệt, không thay tọa độ thế giới của props/collider. Thang X=29 nằm trước môi trường, không bị prop chắn. Props giữ Z=-0.25 và không có collision.

Terrain dùng atlas curated 1024×1024, tile 64×64 pixel = 0.5×0.5 world unit. Collision không lấy từ pixel hoặc tile ID. Generator chỉ tô visual theo các solid đã có: tile 12 làm phần xây, tile 11 làm mặt trên, tile 2 cho thùng; không lát hàng loạt cửa sổ/biển hiệu riêng. Mái hầm nguyên collider được phủ 100 ô masonry, tint `#2d3a54`; chỉ hai chi tiết tile 8 đặt tay. Terrain chính tint `#a5afc8`. Marker dùng tile 10. Không sửa atlas để xử lý hình ảnh.

## Schema và cách thêm môi trường

Level không có `environment` tiếp tục hoạt động như cũ và không cấp phát EnvironmentRenderer. Nếu có, cần object gồm `backgrounds` và `decorations` (cho phép mảng rỗng tường minh). `null` hoặc thiếu mảng là lỗi. Tất cả ID phải riêng biệt; cùng URL phải khai báo cùng kích thước. Ví dụ lỗi có đường dẫn `environment.decorations[2].worldSize.width`, không fallback sang ảnh/collision khác.

| Nhóm | Field và ý nghĩa |
| --- | --- |
| Chung | `id`, `image`, `pixelSize: [width,height]` pixel nguyên dương, `z` hữu hạn trong (-90,10) |
| Background | `parallaxX`, `parallaxY` trong 0..1; `repeatX` boolean; `worldHeight` dương; `bottomOffset` hữu hạn tùy chọn, mặc định 0 |
| Sky cover | `repeatX:false`, parallax X/Y bằng 0, offset 0; một quad giữ tỷ lệ, cover viewport, không lặp mặt trăng |
| Background lặp | Z tăng từ sau ra trước và nhỏ hơn -1; rộng thế giới = worldHeight × tỷ lệ pixel; chỉ lặp ngang |
| Decoration | `worldPosition:{x,y}` là bottom-center theo world (Y hướng lên), `worldSize:{width,height}` dương; `anchor:{x:0.5,y:1}` bắt buộc; `collision:false`; -0.45 < Z < 0 |
| Tile layer | `tint` tùy chọn: chuỗi `#RRGGBB` hoặc số nguyên 0..16777215; sai định dạng báo lỗi đúng layer |

Giới hạn hiện tại: tối đa 8 background, 256 props; kiểm tọa độ/kích thước hữu hạn và biên props không tràn số. Kích thước PNG tải thật phải khớp pixelSize, nếu không game báo lỗi kèm URL và kích thước thay vì âm thầm đổi ảnh.

Để tạo level khác: khai báo spawn/solids/climbables/visuals/tilemap theo schema hiện có, thêm environment nếu cần rồi đăng ký trong `src/world/levels/index.ts`. Collider/climbable vẫn khai báo riêng; props không phát sinh collision. Để tái tạo pilot, sửa placement/metadata nguồn liên quan hoặc cấu hình có chủ đích trong `scripts/generate_map01_pilot.mjs`, chạy `node scripts/generate_map01_pilot.mjs`. Generator này chỉ dành cho pilot hiện tại, không phải editor hay hệ thống map production.

## Parallax, tài nguyên và thứ tự vẽ

Sky/far/mid/near lần lượt Z=-8/-6/-4/-2. Parallax X lần lượt 0/0.15/0.35/0.65; Y đều 0 theo placement nguồn. Terrain khoảng Z=-0.5, props=-0.25, thang=0, player=1; camera=10, near=0.1/far=100. Alpha transparency, alphaTest=0.01 và depthWrite=false giữ thứ tự này.

Với camera `(cx,cy)`, viewport world `W,H`, background lặp có rộng `B`, parallax `px,py`, offset đáy `o`:

- UV repeat X = W/B; UV offset X = modulo dương của `(cx*px-W/2)/B`.
- Tâm quad X=cx; Y=`cy*(1-py)-H/2+o+worldHeight/2`.
- Sky có chiều cao cover=`max(H,W/tỷ_lệ_ảnh)`, tâm trùng camera, UV không lặp.

Công thức dùng kích thước camera sau resize/zoom; pha tại tâm giữ liên tục khi resize. Cảnh nhà theo camera theo Y với dữ liệu py=0; props và thang luôn giữ world position. Không tạo geometry/mesh hoặc tải texture trong render frame. Một geometry dùng chung cho 16 quad; texture tải mỗi URL một lần, clone riêng cho UV mỗi background, hai bồn nước dùng chung texture. Load được cache; Promise.allSettled thu hồi cả ảnh đến sau khi một request lỗi. Dispose idempotent giải phóng geometry/material/texture gốc và clone; ảnh tới muộn sau dispose không gắn lại vào scene.

## Test và build đã chạy

Node 24.22.1 có sẵn trên máy; không cài dependency mới.

| Lệnh | Kết quả cuối |
| --- | --- |
| `npm run test` | **329/329 test, 25/25 file, exit 0**, 4.97 giây |
| `npm run build` | **Exit 0**, TypeScript qua, Vite 8.3.5 build 36 module, 2.92 giây |

Build tạo HTML 1.26 kB (gzip 0.69), CSS 1.52 kB (gzip 0.70), JS 757.36 kB (gzip 150.79). Vite cảnh báo chunk vượt 500 kB, không làm build thất bại. Vitest có gợi ý số worker/isolation về thời gian chạy; không đổi cấu hình theo gợi ý. Lần build đầu có TS2740 ở ảnh giả trong test mới, đã sửa kiểu `HTMLImageElement`; số liệu trên là lần chạy lại sau sửa và các điều chỉnh visual cuối.

Hai file test mới có 68 trường hợp; 261 test cũ vẫn qua. Bao gồm dữ liệu sai, compatibility level không environment, deep equality field gameplay pilot/graybox, PNG/metadata/placement, tint, parallax ở nhiều X/Y/viewport/zoom, chu kỳ repeat và pha resize, 1000 update không thêm geometry/load, chia sẻ tài nguyên, cleanup idempotent, ảnh lỗi/sai kích thước/dispose khi còn request. Test renderer dùng texture giả trong Node; bằng chứng WebGL thật là thao tác/ảnh bên dưới, không gọi unit test là kiểm tra GPU.

## Kiểm tra trình duyệt thực tế

Chạy Vite development tại localhost cổng 5174. **Dùng IAB thay Chrome/Edge theo câu trả lời cho phép của người dùng trong chat**; chưa kiểm độc lập trên Chrome/Edge. Không dùng Canvas mock, ảnh AI hoặc ảnh concept làm bằng chứng. Không teleport hay sửa state runtime để đi tuyến.

| Thao tác đã thực hiện | Quan sát |
| --- | --- |
| Chạy từ spawn, nhảy qua thùng và bậc cao | Đi qua zone A tới thang; mặt sàn/biên vật cản đúng dữ liệu cũ |
| S+D vào hầm, nhả cúi khi dưới mái, thử Space | Tâm (12.76,-2.05), collider cúi 0.8×0.9, standingBlocked=true; giữ cúi và không xuyên mái; ra hầm đứng lại |
| Bám thang E+W, giữ leo tới đỉnh | X=29, tâm Y=3.2, không vượt giới hạn |
| S xuống, W lên, S xuống rồi dừng | Y=2.453 → 3.013 → 2.453; sprite không lật, thang đứng yên trong world; frame climbDown=2 giữ nguyên ở lần đọc sau khi dừng |
| D rời thang sang ban công | Đáp tại (31.8,1.8), grounded; không bị prop chắn |
| Nhảy thùng ban công, lên mái, qua ba khe 2 unit | Tới các tâm mái Y=2.8/3.8/4.3/3.8 và X=77.4; foreground không cản quan sát mép nhảy trên tuyến đã đi |
| Camera trái/giữa/phải và follow dọc | Spawn camera (8,0), thang (29,2.453), mái (63.1,4.3), cuối màn (72,3.8) tại 16:9; không thấy lặp mặt trăng hoặc nhảy pha ngang trong lượt này |
| Resize 1920×1080, 1280×720, 1024×768, 540×960 | Canvas/viewport theo kích thước; không mất nhân vật, thang hoặc terrain. Màn dọc crop ảnh sky theo cover, có thể không thấy mặt trăng; không có điều khiển cảm ứng |
| Resize biên phải sang 1024×768 | Camera X đổi 72 → 74 theo bounds, không cuộn ra khỏi biên phải |
| Đi khỏi mép phải, rơi dưới deathY | Respawns 0 → 1, về (2,-1.7), vận tốc 0, camera (8,0), held D được xóa; Space sau hồi sinh nhảy lại được |
| F3/F4 | Bật/tắt bảng thông số và collider, chụp cả ảnh sạch lẫn debug |
| Mở playground, small, tiles | Tải hình, gửi phím D+Space và đọc state; không có console warn/error. Đây là smoke check, chưa đi lại toàn bộ mỗi level cũ |
| Mở map01-graybox | Bản gốc tải ở spawn, không environment, không console warn/error |

Đánh giá chuyển hướng leo trong Task 008: controller/clip giữ nguyên Task 004/005. Đã đổi W↔S vài lần, không thấy giật tư thế lớn/chớp trắng trong lượt thao tác; dừng giữ frame xác nhận bằng F3. Chưa phân tích từng frame hoặc đo trượt chân/tay với bậc thang, chưa lặp đổi hướng ở mọi pha chu kỳ, chưa thử giữ phím ở đáy thang trong lượt này. Không dùng kết quả này để tuyên bố asset leo hoàn hảo hoặc sửa pivot/physics.

FPS đo bằng chỉ số Render FPS thực trên F3: **27 mẫu**, khoảng thời gian từ mẫu đầu tới cuối **647.995 giây**, min 37, max 60, trung vị 60; 25 mẫu là 60, một mẫu 56, một mẫu 37 sau resize. Các mẫu lấy không đều trong lúc thao tác/chụp/resize; đây không phải trace từng frame, benchmark GPU, 1% low hay cam kết hiệu năng trên máy khác. Dữ liệu gốc trong `task-008-runtime-observations.json`. Console warn/error Map 1 ở cuối tuyến là `[]`; các lần mở level cũ cũng `[]`. Chưa gọi trực tiếp gl.getError, chưa kiểm context loss hoặc đo VRAM lâu dài.

## Ảnh nghiệm thu

Ảnh JPEG nguyên byte từ screenshot IAB. Viewport được đặt 1920×1080 cho A/B/C, nhưng API chụp trả ảnh **1920×1061**; ghi đúng kích thước file, không kéo giãn/chỉnh ảnh để khớp số yêu cầu. Ảnh 4:3 và dọc trả đúng kích thước.

| Ảnh | Nội dung |
| --- | --- |
| [Zone A](task-008-zone-a.jpg) | Đường phố, mái hiên/biển hiệu và lối vào hầm |
| [Zone B](task-008-zone-b.jpg) | Thang rõ trước nhà, nhân vật dừng giữa thang |
| [Zone C](task-008-zone-c.jpg) | Mái nhà và các mép nhảy |
| [Crouch + debug](task-008-crouch-debug.jpg) | Collider cúi, headroom dưới mái |
| [4:3](task-008-4x3.jpg) | 1024×768 tại hầm |
| [Màn dọc](task-008-narrow.jpg) | 540×960 tại hầm |
| [Biên phải 4:3 + debug](task-008-right-4x3-debug.jpg) | Bounds/camera và cuối màn |

## Git và bảo toàn gameplay

Khác mô tả lịch sử trong Task 007, workspace hiện có Git. Baseline trước sửa sạch, HEAD `4f8b68f Task007`. Không stage hoặc tạo commit. Đã xem `git status --short`, `git diff --stat`, diff từng file đang được Git theo dõi, và diff các đường dẫn cần bảo toàn.

Trước thay README/báo cáo, diff tracked là **7 file, +27/-7 dòng**. Thay README sau đó chỉ sửa đoạn giới thiệu Task hiện tại; tổng tracked cuối là **8 file, +28/-8 dòng**. File mới chưa track được liệt kê riêng bởi git status, không nằm trong số dòng diff tracked: hai module môi trường, JSON pilot, generator/placement, hai test, 100 asset nguồn, báo cáo/ảnh/mẫu runtime. Git cảnh báo LF có thể đổi CRLF khi Git chạm file; không chạy formatter hoặc chuẩn hóa line ending.

`git diff --exit-code` cho physics, entities, animation, input, config, GameLoop, FallRecovery, GameCamera, nhân vật assets, bốn dữ liệu level gốc và package/lockfile trả **exit 0, không có diff**. Test còn so sánh chính xác spawn, 10 solids, climbables, bounds, followY, deathY và visuals giữa pilot và graybox. Thay đổi Game chỉ nối update visual, không sửa update physics.

## Giới hạn còn lại và cổng Step 09

- Mái hầm đã tối, nhưng họa tiết masonry từ atlas vẫn lặp rõ trên khối lớn; hai chi tiết thưa chưa thay thế được mặt tiền thiết kế riêng. Chờ duyệt styling, không tự vẽ asset mới.
- Khi camera lên cao có dải sky tím phía dưới dãy nhà; bố cục background đang theo viewport, không phải toàn bộ phố dựng theo world. Một số props nhỏ có thể trông lơ lửng khi không có tường world phía sau. Không tăng collider hoặc sửa physics để che các điểm này.
- Props/foreground có nét vẽ khác background chi tiết; cần duyệt độ hòa hợp màu/nét trong ảnh thật. Tên “foreground” trong nguồn không có nghĩa được vẽ đè lên player: pilot đặt tất cả sau thang/player để giữ đọc gameplay.
- Đã kiểm tuyến và các viewport nêu trên; chưa kiểm mọi tỉ lệ/DPR, thiết bị khác, Chrome/Edge độc lập, production preview trong browser, soak test, pixel-level seam ở mọi chu kỳ hoặc phân tích animation từng frame.
- Runtime integration, test/build và ảnh đã có. Các mục mỹ thuật terrain/foreground vẫn chờ duyệt. **Không đánh dấu Step 09 hoàn tất và không tạo Final Production Asset Pack trước khi có duyệt tiếp theo.**
