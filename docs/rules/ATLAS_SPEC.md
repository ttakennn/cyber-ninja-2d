# Atlas Spec — chung cho nhiều pack

Mỗi pack/map/nhân vật có metadata và thông số riêng. Không bắt mọi atlas dùng kích thước/padding/density của Map01 hoặc ninja. Hồ sơ cục bộ phải chỉ rõ nguồn runtime và contract tương thích engine trước khi tích hợp.

## Quy tắc dữ liệu

- PNG alpha thật; pixelSize là kích thước file thật. sourceRect dùng hệ tọa độ được schema hỗ trợ, nằm trong ảnh; không sửa số giả để loader nhận ảnh sai.
- Giữ ID/rect, gutter/extrusion, frame order, filter, color space và mipmap của pack đã duyệt khi sửa cục bộ. Không tự repack/rotate/power-of-two resize hoặc áp filter chung lên mọi loại ảnh.
- Mật độ môi trường, mật độ nhân vật và worldSize placement là các thông số khác nhau. Đọc hồ sơ tương ứng; không auto-fit tất cả theo một px/unit.
- Giữ aspect và alpha-foot alignment. Không cắt collider theo alpha. Chỉnh một placement không tự cho phép đổi các nơi khác dùng chung PNG.
- Sửa một phần atlas phải bảo toàn vùng không được giao. Đổi tên đường dẫn phải giữ byte ảnh và cập nhật consumer, metadata, generator và test liên quan.

## Nguồn và bàn giao

Nếu có generator, sửa input/plan/source trước rồi sinh output theo dependency, không sửa riêng JSON đầu ra. Không chạy lại script tạo artwork trong task chỉ đổi tên file. Generator chế độ ghi cho authoring không đồng nghĩa được chạy --check/test/build; tuân thủ AGENTS.md.

Lưu nguồn, prompt/công cụ, crop/normalization, thông số file/rect, hash khi đã thu thập và trạng thái review. Giữ provenance lịch sử. Tên thư mục production/ hoặc tên canonical không phải chứng cứ nghiệm thu.

Map mới đặt asset theo phạm vi riêng và ghi pack metadata tương ứng. Nhân vật dùng chung nằm ở khu vực characters/, không nhân bản/recolor theo từng map một cách ngầm định. Các chuẩn hiện có của [Map01](../map01/rules/ATLAS_SPEC.md) và [ninja](../characters/ninja/rules/SPRITE_SPEC.md) là tham chiếu cụ thể, không phải cấu hình bắt buộc cho tất cả nội dung mới.
