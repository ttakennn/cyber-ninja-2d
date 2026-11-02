# Atlas Spec — metadata và pipeline Map01

Phạm vi: asset môi trường Map01, kế thừa [chuẩn atlas chung](../../rules/ATLAS_SPEC.md). Thông số pack dưới đây không phải kích thước atlas bắt buộc cho map/nhân vật mới.

## Nguồn và đường dẫn

Tên canonical runtime: characters/ninja/flame-ninja-atlas.png; environments/map01/backgrounds/ và props/. Các đường dẫn tính từ public/assets/. Không tái tạo suffix-v2 runtime đã bỏ ở4ce0146. File source/prompt/manifest có chữ v2 vẫn có thể là lịch sử/provenance hợp lệ.

Không gom/repack mọi atlas thành một chuẩn kích thước duy nhất. Đọc đúng metadata của pack đang sửa:

| Pack | Nguồn thông số |
| --- | --- |
| Ninja dùng chung | [Hồ sơ ninja](../../characters/ninja/rules/SPRITE_SPEC.md); không phải atlas môi trường Map01 |
| Props | map01/props/props.json: atlas2048×2048, padding8px, extrusion4px, top-left rect |
| Foreground | map01/foreground/foreground.json |
| Production facades | map01/production/production-assets.json |
| Zone4/5 RC1 | map01/expansion-z45-rc1/asset-manifest.json: padding8/extrusion4, không xoay rect |
| Tilemap | terrain-64-atlas.png 1024×1024, tile64×64; tileSize world0.5 |

Giữ ID, đường dẫn tương đối, alphaBounds, pixelSize, sourceRect, gutter/extrusion và thứ tự frame nếu không được yêu cầu thay. Không tự xoay rect, power-of-two resize, pack lại hoặc đổi filter. Environment hiện dùng SRGBColorSpace, LinearFilter và không mipmap; tilemap dùng NearestFilter cùng sample inset trong source. Không áp một filter toàn cục cho mọi loại ảnh.

## Ảnh và placement

- PNG alpha thật, không nền caro vẽ sẵn, không đường viền/grid/nhãn trong ảnh runtime trừ placeholder được yêu cầu rõ. Không crop luôn collider theo alpha.
- pixelSize phải là kích thước file/atlas thật; sourceRect nằm trong ảnh và dùng hệ top-left pixel. Không dùng số giả để làm loader chấp nhận ảnh sai kích thước.
- Dùng alphaBounds để căn vật vào target worldSize đã chỉ định. Bảo toàn aspect, chân hình và chiều cao cơ thể; đừng làm nhỏ nhân vật chỉ vì tay vươn cao mở rộng bbox.
- Trước khi thay asset, kiểm nơi dùng chung: cùng PNG có thể có nhiều placement, crop và mức phóng khác nhau. Chỉnh một placement không tự cấp quyền đổi tất cả.
- Atlas chỉnh một phần: giữ các vùng khác nguyên pixel. Không dùng ảnh AI tái tạo toàn sheet làm replacement nếu các clip không được giao cũng đổi.

## Nguồn sinh Map01

Đọc generate_map01_pilot.mjs, generate_map01_five_zones.mjs, map01-polish.mjs và input/plan chúng tham chiếu. Đổi nguồn trước, sinh pilot trước five-zones nếu nguồn pilot thay đổi. JSON level là đầu ra; không sửa riêng output để tránh lỗi test hoặc bỏ bước generator.

Tạo artwork và sinh output thuộc phạm vi được giao; generator --check, test/build/lint/typecheck/formatter không tự được phép. Không chạy lại script tạo ảnh trong task chỉ đổi tên file: rename/copy phải giữ byte ảnh đã chọn.

## Hồ sơ bàn giao

Lưu source được chọn, prompt, công cụ, ảnh tham chiếu, kích thước file/rect, cách crop/chuẩn hoá, hash khi đã thu thập và thay đổi placement. Không xoá provenance lịch sử hoặc gọi trạng thái candidate là production vì file đã được đặt trong thư mục production/. Khi canonical thay tên, cập nhật consumer/generator/catalog/test và ghi mapping; báo cáo cũ cần được nhận diện là lịch sử.
