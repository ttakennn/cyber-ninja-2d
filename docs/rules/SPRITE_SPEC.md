# Sprite Spec — chung cho nhiều nhân vật

Mỗi nhân vật có hồ sơ tại docs/characters/<id>/rules/SPRITE_SPEC.md. Hồ sơ gắn với nhân vật, không gắn độc quyền với map. Ninja ở Map02 vẫn dùng contract ninja trừ khi người dùng yêu cầu biến thể.

## Contract cần xác định

Ghi nguồn PNG/metadata, canvas và frame/source rect, pixel/world density, visual size/scale, anchor/pivot/offset, clip/FPS/loop, hướng nhìn và điểm tiếp đất. Đọc schema/loader/renderer hiện có để thiết kế tương thích; không thêm cơ chế mới nếu chỉ cần khai báo dữ liệu.

Nhân vật mới có thể khác danh tính, màu, trang phục, silhouette, tỉ lệ và kích thước theo brief. Không bắt tất cả dùng canvas384×320, pivot(192,289), palette đen/đỏ hoặc cơ thể ninja. Những số đó chỉ khoá ninja hiện có. Nếu kích thước/contract mới ảnh hưởng engine hoặc gameplay mà brief chưa quyết định, nêu phương án và hỏi trước khi tích hợp phần đó.

## Bất biến khi sửa nhân vật đã có

- Giữ danh tính và contract đã duyệt; yêu cầu thêm pose hoặc dùng ở map mới không tự cho phép đổi kích thước/màu.
- Tạo pose theo cùng tỉ lệ cơ thể, kích thước đầu/thân và điểm neo ổn định. Không scale riêng từng frame theo bbox gây phồng/thu nhân vật.
- Chỉ đổi các clip/rect được giao. Giữ pixel ngoài vùng đó, gutter, timing và animation logic nếu chưa yêu cầu đổi.
- Tay/chân phải vận động tự nhiên theo cơ chế của nhân vật; không lật cả người để giả đổi chi làm đổi phía trang bị.
- Collider là contract gameplay riêng, không suy từ alpha/canvas. Không resize sprite theo collider hoặc thay physics trong task ảnh.

Việc xem/đối chiếu artwork cần thiết cho yêu cầu không tự cấp phép test/build. Báo rõ kiểm tra thực sự đã thực hiện và phần chưa chạy.
