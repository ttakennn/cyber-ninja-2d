# Tileset thử Task 006

`test-tileset.svg` được tự vẽ bằng SVG trong Task 006 cho dự án này, không dùng asset bên thứ ba hoặc ảnh sinh bằng AI. Đây là hình thử chức năng, chưa phải artwork Map 1.

Atlas có kích thước 128 × 64 px, 4 cột × 2 hàng, tile 32 × 32 px, không margin/spacing. ID bắt đầu từ 0, tăng theo hàng từ góc trên trái:

| ID | Hình |
| --- | --- |
| 0 | Mặt sàn có mép cyan |
| 1 | Phần thân sàn |
| 2 | Thùng/vật cản |
| 3 | Mái có vạch vàng ở đáy |
| 4 | Sàn cao có mép cyan |
| 5 | Panel nền tối |
| 6 | Panel đèn cyan |
| 7 | Biển cảnh báo với nền trong suốt |

Để thay: đặt ảnh atlas mới vào `public/assets/environments/`, cập nhật `tilemap.tileset.image`, kích thước ảnh/tile trong JSON và các ID trong layer. PNG hoặc SVG có kích thước tường minh đều tải qua TextureLoader. Ảnh thực phải đúng kích thước đã khai báo. Giữ `tileSize` world và các collider/vùng leo nếu chỉ thay artwork; không suy physics từ ID hoặc alpha của tile.
