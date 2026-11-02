# Ninja climbing artwork v2 — bản thử để review

Ngày 2026-11-02. Yêu cầu: sửa hình leo lên/xuống, giữ các hình khác và kích thước nhân vật.

## Review bản cũ

Atlas flame-ninja-atlas.png có 8 frame climbUp và 8 frame climbDown. Qua xem ảnh, phần lớn pose giữ tay phải cao, tay trái bị khuất và chân đối bên ít thay đổi. FPS/physics không giải quyết được sự thiếu pose thay phiên này.

## Bản v2

- Ảnh runtime: `public/assets/characters/ninja/flame-ninja-atlas.png`, 3136×1968 RGBA. Sau khi người dùng duyệt, bản v2 đã thay tên canonical; atlas cũ còn trong lịch sử Git trước commit `12959ca`.
- Chỉ thay các hình chữ nhật khai báo trong climbUp/climbDown: tổng 16 ô 384×320. Công đoạn ghép so pixel RGBA ngoài các ô này và dừng nếu có thay đổi; đã thực hiện thành công.
- `animations.json` chỉ đổi trường image. Không đổi kích thước ô, tọa độ, sourceWidth/Height, offset, pivot (192,289), FPS, visual.width/height, visual.scale hoặc anchor. Không đổi animation controller, physics hay input.
- Artwork mới có tay trái/tay phải thay phiên ở trên và chân trái/phải nâng đối bên. Giữ trang phục đen/đỏ, khăn và bao kiếm. Không lật cả nhân vật để giả đổi tay.
- Bốn tư thế chính từ ImageGen, mỗi tư thế giữ hai frame để dùng lại 8 slot/clip và thời lượng cũ. Cả hai clip dùng cùng pha tư thế để giữ hành vi đổi chiều hiện có; chưa có bộ pose hạ người độc lập. Đây là bản art candidate, chưa khẳng định chuyển động mượt hoặc chân/tay bám bậc hoàn hảo.
- Công đoạn đưa artwork về ô cũ dùng **một hệ số đồng nhất cho cả bốn pose**, dựa trên chiều cao alpha≥16 của frame leo gốc đầu tiên (245px); không tự fit riêng từng pose gây phồng/thu nhân vật. Chân thấp nhất căn tại mép pixel Y292 của frame gốc; chiều cao silhouette có thể khác theo tư thế tay/chân. Cần người dùng duyệt cảm nhận kích thước/cơ thể trong game.

## Nguồn và tái tạo

- Công cụ tạo/chỉnh tư thế: `image_gen.imagegen` built-in. Bản tám tư thế đầu bị loại vì vẫn giữ tay phải cao. Bản 2×2 được sửa tiếp tư thế trung gian và vị trí bao kiếm.
- Source được chọn: `integration/ninja-climb-v2/climb-poses-source.png`, bản gốc công cụ `exec-c73fde79-3f88-450d-b0a6-a2e130c1f046.png`.
- Prompt chỉnh cuối: [image-prompt.md](../integration/ninja-climb-v2/image-prompt.md).
- Preview sau căn ô/kích thước: `integration/ninja-climb-v2/climb-poses-v2.png` (bốn tư thế theo thứ tự vòng lặp).
- `scripts/create_ninja_climb_v2.ps1`: chỉ crop/căn kích thước và ghép ảnh được tạo bằng ImageGen vào atlas gốc, không vẽ tay chân bằng code. Dùng PowerShell/System.Drawing; không cần dependency mới.
- SHA256 atlas v2: `432f63db6c14141940c4bf07e622df55381143348f7dcbde46aaa0013eadf2c2`.

Đã xem atlas gốc, các ảnh tạo và preview sau ghép; đã tạo atlas bằng script authoring. Cập nhật hai kỳ vọng đường dẫn trong ProductionSprites.test.ts, **chưa chạy test, build, lint, formatter, typecheck hoặc game**.

Người dùng đã duyệt bản v2 và yêu cầu dùng tên canonical. Script authoring dùng atlas canonical làm nền, ghi file trung gian rồi thay file sau khi đóng handle ảnh; không còn tạo file runtime có hậu tố -v2. Chưa chạy lại script hoặc test/build trong bước đổi tên.
