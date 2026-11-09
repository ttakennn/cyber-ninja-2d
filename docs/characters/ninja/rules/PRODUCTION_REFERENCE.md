# Ninja Hỏa · bản chuẩn production để tham chiếu

**Tư thế Vào thế chiến đấu chính thức từ2026-11-09:10.51, người dùng đã CHỐT.** [Bộ production combat-idle](../animation/combat-idle/README.md), [hồ sơ publish10.52](../../../map01/commits/task-010-52-ninja-combat-production-51/README.md). Lấy đúng8frame đã xem:2nhịp vào thế và6frame giữ/thở; PNG nguyên byte, ô384×320/pivot192,289. Idle đứng/thở10.47 vẫn là chuẩn tương ứng, không bị thay. Chỉ art production; chưa tích hợp game.

**Chuẩn Idle chính thức từ2026-11-09:10.47, được người dùng trực tiếp CHỐT.** Đã publish6frame vào canonical atlas, SHA256d5559f90565cdc00eec69d7692eac7e48ce0b6bdd9bd070e59d69d551d523e48. [Approval, hash và bằng chứng](../../../map01/commits/task-010-48-ninja-idle-production-47/README.md). Dùng Idle này làm chuẩn cho artwork về sau; không lấy lại khăn bụng lỗi ở baseline cũ hoặc candidate trước. Metadata/pivot/FPS và các clip khác giữ nguyên so trước publish, chưa áp game runtime. Phần10.46/10.43 bên dưới là lịch sử tham chiếu.

**Cập nhật Idle ngày2026-11-09/Task10.46:** người dùng giao tự review cho giống production rồi release. Idle mới đã vào canonical atlas, SHA2567b22406fe0fa5969cc8a84a6661b59b5f8f0ae8f72bc36f80cf7ea3ef409c572;0pixel RGBA khác ngoài6rect Idle, metadata giữ nguyên. Bản native tái xác nhận10.43 giữ nguyên tại integration/ninja-idle-fabric-restore/production-reference-atlas.png (hash0f6f86e2…52eeba) để so tạo hình và vùng từng bị kiếm hông che. [Hồ sơ release/tự review/giới hạn](../../../map01/commits/task-010-46-ninja-idle-fabric-restore/README.md). Không ghi rằng người dùng đã trực tiếp duyệt ảnh10.46; game runtime chưa đổi. Các mô tả/hash10.43 bên dưới là mốc baseline gốc.

Người dùng tái xác nhận ngày2026-11-08/Task10.43 qua4file: `AGENTS.md`, `flame-ninja-atlas.png`, `basic-preview.html`, `preview.html`. Tài liệu này ghi nguồn và các điểm phải giữ khi tiếp tục công việc. Đây là xác nhận bộ production hiện hành; các candidate Idle/attack trong commits tiếp tục chờ duyệt riêng.

## Nguồn chính xác

Repo chính: `C:\Users\anhthaitrong\Downloads\Games\cyber-ninja-2d`. Art nhân vật đã chốt trong `docs/characters/`; Ninja Hỏa tại `docs/characters/ninja/animation/`.

| File | Vai trò |
| --- | --- |
| `AGENTS.md` ở repo root | Quy tắc làm việc, phạm vi thay đổi, bảo toàn art, authoring/review và điều kiện chạy lệnh |
| `animation/locomotion/flame-ninja-atlas.png` | Chuẩn trực tiếp về mắt/mặt, cơ thể, cơ bắp, trang phục, màu, độ nét và các pose locomotion đã chốt |
| `animation/locomotion/animations.json` | Rect/frame order, FPS/loop, canvas/pivot và visual contract của atlas |
| `animation/basic-preview.html` | Xem từng nhóm/clip, chuỗi ghép, tua/từng frame, tốc độ/nền và Idle đối chiếu |
| `animation/preview.html` | Điểm xem tổng hợp8nhóm production, dẫn sang preview riêng và các bảng atlas |
| `animation/production.json` và `review-data.js` | Danh sách bộ đã duyệt, nguồn/hash và metadata được preview sử dụng |
| `rules/SPRITE_SPEC.md` | Contract và ràng buộc nhân vật qua các map |

Ba file văn bản người dùng gửi được đọc toàn bộ, đối chiếu nội dung trùng file repo khi bỏ khác biệt newline cuối file. Ảnh atlas gửi qua hội thoại được đọc ở2047×1285; atlas gốc trong repo là3136×1968. Giữ atlas gốc độ phân giải đầy đủ làm nguồn kỹ thuật, không lấy ảnh hiển thị thu nhỏ để repack hoặc suy rect.

SHA256 atlas gốc tại mốc xác nhận: `0f6f86e222f86ceda5cd7849c9b11de64793c3c3c0e233e36fc941684c52eeba`, khớp mục `locomotion/flame-ninja-atlas.png` trong production.json. Mốc này gồm run/hurt đã chốt từ Task10.29; các frame leo v2 giữ nguyên theo hồ sơ hiện hành. Hash là mốc nhận diện lúc đọc, không cấm thay đổi mới được người dùng giao/duyệt rõ.

## Chuẩn tạo hình phải bám

- Illustrated textured pixel art2D; dùng các cụm pixel, texture, viền tối và shading của ảnh gốc làm mẫu trực tiếp.
- Mũ/mặt nạ đen, dải đỏ và miếng kim loại trán theo hình gốc. Khe mắt nhỏ, mí/độ mở/hướng nhìn đúng gốc; tham chiếu crop production ở độ phân giải thật trước khi sửa mặt.
- Khăn đỏ có đúng mảng sáng–tối, chỗ ôm cổ, nếp gấp, viền và hướng bay của từng pose.
- Thân nam lực lưỡng đúng mẫu: đầu, vai, ngực, eo, khối bắp tay, chiều dài tay và hai chân lấy từ production. Không lấy cơ thể của bản vẽ candidate làm chuẩn mới.
- Áo đen sát người không tay, đường đỏ trên thân, đai đỏ, tà vải đỏ, quần đen rộng và vị trí gấu quần theo đúng pose gốc. Giữ liên tục bụng–đai–tà vải khi phục hồi phần bị vũ khí che.
- Bảo vệ cẳng tay, giáp ống chân bạc, dây/viền đỏ và giày đen–đỏ giữ kích thước, chất liệu và shading gốc; độ dài ống chân đối chiếu cả đầu gối/lưng giày.
- Vũ khí trong atlas production hiện hành có phụ kiện vàng, vỏ nâu/đen và đặt ở hông. Các yêu cầu chuyển kiếm lên lưng là thay đổi riêng đang review; bộ chuẩn về khuôn mặt/cơ thể/quần áo vẫn là production này.

Khi sửa một chi tiết, dùng đúng production frame tương ứng làm nền và giữ các phần không được giao. Không tạo lại toàn cơ thể chỉ để đổi vũ khí. Phần ghép phải được soi đường nối ở kích thước thật/phóng lớn và qua từng pose; trang bị gắn mốc cơ thể, cơ thể/khăn/tay che lớp sau đúng logic. Số pixel vùng được giữ không tự chứng nhận chất lượng vùng đã vá.

## Contract locomotion đã đọc

| Thuộc tính | Chuẩn |
| --- | --- |
| PNG | 3136×1968 RGBA |
| Frame/source | 384×320, rect thực tế trong animations.json |
| Pivot | (192,289) |
| Visual | 2.4×2.0 world unit, scale(1,1), offset(0,0), anchor(0.5,0) |
| Mật độ | 160px/world unit =0.00625unit/px |
| Filter | linear |
| Mốc Idle frame đầu | Đầu khoảngy38, mặt đất/pivoty289, chuẩn chiều cao cơ thể251px đã dùng trong authoring |

| Clip | Frame | FPS | Loop |
| --- | --- | --- | --- |
| idle | 6 | 7.1429 | Có |
| run | 8 | 12 | Có |
| jump | 4 | 11.1111 | Không |
| fall | 3 | 9.0909 | Không |
| land | 3 | 10.5263 | Không |
| crouch | 2 | 5 | Có |
| crouchEnter | 4 | 10 | Không |
| climbUp / climbDown | 8mỗi clip | 11.1111 | Có |
| climb | 8, alias bản leo hiện hành | 11.1111 | Có |
| climbIdle | 1 | 1 | Không |
| hurt | 4 | 13.3333 | Không |

Đi/chạy production dùng clip run, chưa có walk riêng. Cơ bản có5lựa chọn ghép, leo có nhóm riêng. Giữ rect/FPS/loop/pivot theo JSON nếu không được yêu cầu đổi. Không fit từng frame theo alpha bounds hoặc thay collider/physics để bù ảnh.

## Các nhóm trong preview production

1. Cơ bản: Idle, đi/chạy, nhảy–rơi–tiếp đất, trúng đòn–hồi thế, cúi–giữ.
2. Leo: lên, xuống, dừng, theo bản v2 đã chốt.
3. Combo1–2–3, giữ speed0.8 theo bộ đã duyệt.
4. Phi tiêu Hỏa: phóng đứng/cúi và projectile.
5. E · Minh Vương Bạo Viêm: cast, orb, explosion.
6. Q · Cửu Long Hỏa Trận: cast,9hỏa long, trận pháp, burst, aura.
7. Thiên Hỏa Giáng Lâm:1650ms, đã chốt art.
8. Thiên Hỏa Tái Lâm:750ms, đã chốt art.

Quỹ đạo/vật cản/FX ghép trong HTML là minh họa art. Hai màn xuất hiện/hồi sinh vẫn chưa tích hợp runtime theo trạng thái nguồn. Art production không đồng nghĩa đã nghiệm thu gameplay/AI/damage/shader.

## Trạng thái sau lần xác nhận này

Chỉ đọc/đối chiếu và ghi lại chuẩn, không thay atlas/metadata/preview runtime, không vẽ mới và không publish candidate. Các bản sửa Idle10.37–10.42 và candidate attack vẫn giữ trạng thái riêng. Hồ sơ đọc/hash: `docs/map01/commits/task-010-43-ninja-production-reference/`.
