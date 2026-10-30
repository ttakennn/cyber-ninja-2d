# Task 002 — Sprite và animation nhân vật

Đã mở rộng trực tiếp engine Task 001. Không thay đổi thông số di chuyển, trọng lực, nhảy, collider 0.8 × 1.6, bàn phím hoặc thuật toán va chạm. Không thêm dependency, framework animation hay game engine.

## Tệp mới và tệp thay đổi

| Tệp | Vai trò / thay đổi |
| --- | --- |
| `src/animation/AnimationClip.ts` | Kiểu clip, frame trong atlas và hướng nhìn; không phụ thuộc Three.js |
| `src/animation/AnimationController.ts` | Tiến frame theo delta mô phỏng, tốc độ phát, lặp, phát một lần và sự kiện hoàn tất |
| `src/animation/SpriteSheetLoader.ts` | Đọc/kiểm tra JSON, tải PNG, chọn bộ lọc, xử lý lỗi và giải phóng ảnh tải muộn sau khi hủy |
| `src/rendering/SpriteRenderer.ts` | Một mesh/material/texture; cập nhật UV, trim, pivot, kích thước, scale, offset và lật ngang |
| `src/entities/PlayerAnimator.ts` | Chọn Idle/Run/Jump/Fall/Land từ vật lý và sự kiện tiếp đất; giữ hướng độc lập |
| `src/entities/Player.ts` | Nhóm visual chứa sprite hoặc placeholder, tải asset, nội suy và API đặt lại vị trí; giữ logic di chuyển cũ |
| `src/core/Game.ts` | Chụp vị trí trước bước vật lý, chuyển sự kiện tiếp đất tới animator, render với alpha, camera theo visual |
| `src/core/GameLoop.ts` | Cập nhật chú thích về alpha; không đổi scheduler, timestep hay giới hạn bước |
| `src/debug/DebugOverlay.ts` | Thêm clip, frame (đánh số từ 1), hướng, trạng thái/lỗi tải asset và alpha |
| `src/config/game.config.ts` | Đường dẫn metadata sprite; không chứa tọa độ atlas |
| `index.html` | Nhãn Task 002 và thông báo atlas chỉ dùng thử nghiệm |
| `public/assets/characters/ninja/ninja-atlas.png` | PNG RGBA phát triển 384 × 400, gồm 17 frame hình học có màu/pose khác nhau |
| `public/assets/characters/ninja/animations.json` | Năm clip và cấu hình kích thước/trim/pivot/bộ lọc |
| `scripts/generate_dev_atlas.py` | Tạo lại atlas thử nghiệm bằng Python/Pillow; không phải dependency chạy game |
| `tests/AnimationController.test.ts` | Tiến frame, lặp, hoàn tất một lần, tốc độ và không reset clip không đổi |
| `tests/PlayerAnimator.test.ts` | Chuyển trạng thái, hướng nhìn, giữ Land, Jump ngắt Land và rơi khỏi nền |
| `tests/Interpolation.test.ts` | Nội suy, reset/pause, camera và timeline animation tại 30/60/120/144 FPS |
| `tests/SpriteSheetLoader.test.ts` | Hợp đồng atlas, bộ lọc, lỗi tải, fallback, hủy/race khi tải và ngữ cảnh gọi fetch |
| `tests/SpriteRenderer.test.ts` | UV, lật ngang, căn chân/pivot, scale, tái sử dụng tài nguyên và dispose |
| `tests/animation.fixtures.ts` | Dữ liệu dùng chung cho kiểm thử animation thuần |
| `README.md`, `docs/TASK-002.md` | Liên kết báo cáo và tài liệu tích hợp |

Toàn bộ sáu tệp kiểm thử Task 001 được giữ nguyên. `Renderer`, `GameCamera`, `PhysicsWorld`, `InputManager` và `TestLevel` không cần thay đổi.

## Luồng cập nhật và nội suy

Mỗi bước 60 Hz: `Game` chụp vị trí cũ → đọc bàn phím → cập nhật lệnh di chuyển/nhảy → `PhysicsWorld.step` → trạng thái logic → `PlayerAnimator.update(delta, body, landed)` → tiêu thụ cạnh input.

Mỗi lần render: `Player.syncVisual(alpha)` tính `previous + (current - previous) × alpha` → `SpriteRenderer` chọn UV/pose hiện tại → camera theo X của visual → renderer vẽ → overlay đọc chẩn đoán. Không sửa vị trí hoặc vận tốc vật lý khi render, không dùng thời gian render để tiến animation, không tạo object vị trí mỗi frame.

`current` là vị trí collider chính thức; `previous` được chụp ngay trước mỗi bước vật lý, kể cả khi có nhiều bước trước một render. Nội suy chuẩn có độ trễ một bước mô phỏng, tối đa khoảng 16.667 ms. `start`, `stop`, chuyển trạng thái hiển thị của tab và `Player.setPosition(x, y)` đồng bộ lại lịch sử để không kéo visual qua vị trí cũ. Khi teleport, dùng `setPosition`; nếu sửa `body.position` trực tiếp thì gọi `resetInterpolation` ngay sau đó. `setPosition` không tự đặt lại vận tốc hay trạng thái chạm đất.

`Player.visual` hiện là `Group`, không còn là mesh placeholder trực tiếp. Root của nhóm vẫn nằm ở tâm collider được nội suy; root của sprite đặt tại `-body.height / 2`, tức chân collider. Mesh placeholder chỉ được ẩn sau khi atlas hợp lệ đã tải thành công.

## Quy tắc animation

- Đứng trên nền: Idle ↔ Run theo vận tốc ngang. Chỉ có một clip Run.
- Trên không: vận tốc Y dương chọn Jump; Y không dương chọn Fall. Rơi khỏi mép nền vào Fall ngay cả khi chưa nhảy.
- Sự kiện `CollisionResult.landed` được xử lý ngay trong bước mô phỏng và khởi động Land phát một lần. Animator giữ Land qua các bước tiếp theo, dù `Player.state` đã trở về Idle/Move để tương thích Task 001.
- Land kết thúc thì bước kế tiếp chọn Idle hoặc Run theo vận tốc hiện tại. Di chuyển không bị khóa trong Land. Nhảy hoặc rơi khỏi nền có thể ngắt Land ngay.
- Hướng trái/phải theo vận tốc ngang khác không; khi dừng, giữ hướng gần nhất. Đổi hướng không reset clip Run.
- `AnimationController.play(name)` không reset clip hiện hành. `play(name, true)` chủ động phát lại. `setPlaybackSpeed(0)` tạm dừng; tốc độ chung nhân với `clip.speed`.
- `AnimationController.update(delta)` trả về tên clip đúng một lần khi clip không lặp hoàn tất; các lần cập nhật sau trả `null`. Frame cuối được giữ. `PlayerAnimator.update` chuyển tiếp sự kiện này cho caller nếu cần dùng về sau.

## Hợp đồng atlas

PNG phải có alpha trong suốt. JSON và đường dẫn ảnh có thể đặt cạnh nhau; đường dẫn PNG được giải tương đối từ URL JSON. Ví dụ tối giản về cấu trúc (cần khai báo đủ năm clip khi dùng cho Player):

```json
{
  "version": 1,
  "kind": "production",
  "image": "ninja-atlas.png",
  "filter": "linear",
  "frameWidth": 64,
  "frameHeight": 80,
  "columns": 6,
  "visual": {
    "width": 1.6,
    "height": 2,
    "offset": { "x": 0, "y": 0 },
    "scale": { "x": 1, "y": 1 },
    "anchor": { "x": 0.5, "y": 0 }
  },
  "clips": {
    "idle": { "frames": [0, 1, 2, 3], "fps": 5, "loop": true, "speed": 1 },
    "run": { "frames": [6, 7, 8, 9], "fps": 12, "loop": true },
    "jump": { "frames": [12, 13], "fps": 10, "loop": false },
    "fall": { "frames": [18, 19], "fps": 8, "loop": true },
    "land": { "frames": [24, 25, 26], "fps": 12, "loop": false }
  }
}
```

Chỉ số frame bắt đầu từ 0, đi từ trái sang phải rồi xuống hàng. Ngoài chỉ số lưới, mỗi phần tử `frames` có thể là vùng atlas cụ thể:

```json
{
  "x": 2, "y": 2, "width": 40, "height": 64,
  "sourceWidth": 64, "sourceHeight": 80,
  "offsetX": 10, "offsetY": 8,
  "pivot": { "x": 32, "y": 72 }
}
```

`x/y/width/height` là vùng PNG đã cắt, tính bằng pixel từ góc trên trái. `sourceWidth/sourceHeight` là canvas frame gốc trước khi cắt; `offsetX/offsetY` là vị trí vùng cắt trên canvas đó. `pivot` là điểm chân trên canvas gốc, cũng tính từ góc trên trái. Các thuộc tính source mặc định bằng kích thước lưới; offset mặc định bằng 0.

`visual.width/height` mô tả kích thước canvas nguồn trong world unit; `scale` nhân kích thước visual, không tác động collider. Anchor chuẩn hóa tính từ góc dưới trái; `{x: 0.5, y: 0}` là giữa chân. Nếu frame có padding quanh chân hoặc có kích thước nguồn khác nhau, khai báo `pivot` đúng điểm chân cho frame đó để ghi đè anchor. Việc lưu trim và pivot giúp giữ nguyên vị trí chân khi vùng trong suốt thay đổi; engine không tự suy đoán điểm chân từ pixel ảnh.

Tất cả frame trong atlas thử nghiệm có pivot `(32,72)` và giữ cùng tỷ lệ canvas nguồn; các pose có vùng cắt khác nhau. Chân đứng nằm đúng cạnh dưới collider. Frame không bị xoay trong atlas. Với HD dùng `linear`; với pixel art dùng `nearest`. Mipmap được tắt. Nên để padding trong suốt giữa các vùng khi dùng lọc tuyến tính.

Metadata không hợp lệ, thiếu clip bắt buộc, HTTP/PNG lỗi hoặc frame vượt ảnh sẽ chuyển nhân vật về placeholder. Trạng thái và thông báo lỗi có trong F3. Việc tải ảnh không chặn mô phỏng. Abort/race khi dispose hoặc tải lại được xử lý; texture tải muộn được giải phóng. Mỗi renderer sở hữu texture riêng và tái sử dụng geometry/material; không cấp phát texture/material mỗi frame.

## Kiểm chứng đã thực hiện

- `npm run test`: **66/66 kiểm thử đạt, 11/11 tệp đạt**, gồm đủ 28 kiểm thử cũ và 38 kiểm thử mới. Controller/animator kiểm thử trong Node, không cần WebGL.
- `npm run build`: **đạt**, gồm TypeScript strict và Vite production. JavaScript minify 544.02 kB, gzip 137.41 kB. Vite cảnh báo chunk trên 500 kB; cảnh báo không làm build thất bại.
- Dev server có tại `http://127.0.0.1:5174/`. Đã quan sát PNG thật hiển thị, Idle/Run, lật hướng trái/phải, Jump và thông số `Sprite development` trong F3.
- Kiểm tra trình duyệt ban đầu phát hiện lỗi ngữ cảnh gọi `fetch` khiến sprite rơi về placeholder; đã sửa và thêm kiểm thử hồi quy, sau đó chạy lại cả suite và build thành công.
- Trong môi trường trình duyệt tự động, render có lúc bị giảm còn khoảng 1 FPS. Kiểm tra nhất quán ở 30/60/120/144 FPS dùng scheduler giả lập với cùng timestep thật, không khẳng định đã đo trên bốn màn hình vật lý. Giới hạn catch-up của engine vẫn giữ nguyên Task 001.
- Không chạy ESLint hoặc formatter. Không thay đổi package hoặc lockfile.

## Giới hạn và tài nguyên còn cần

Đây là atlas hình học phục vụ phát triển, **chưa tích hợp sprite ninja production**. Cần cung cấp PNG RGBA và metadata đủ Idle, Run, Jump, Fall, Land, có điểm chân/pivot chính xác và tỷ lệ nguồn nhất quán. Chỉ cần thay asset/metadata hoặc đường dẫn cấu hình, không sửa vật lý hay hardcode tọa độ vào `Player.ts`.

Chưa hỗ trợ frame xoay trong atlas, nhiều atlas trong cùng một bộ clip hoặc thời lượng riêng cho từng frame. Một clip dùng một FPS với hệ số tốc độ cấu hình. Animation tiến bằng timestep và dùng frame rời rạc; vị trí visual mới được nội suy. Không thêm combat, climbing, crouching, parallax, map, âm thanh hay hiệu ứng ngoài phạm vi.
