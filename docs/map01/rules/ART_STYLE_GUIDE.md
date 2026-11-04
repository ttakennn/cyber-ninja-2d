# Art Style Guide — khoá phong cách Map01

Phạm vi: riêng Map01. Kế thừa [style chung](../../rules/ART_STYLE_GUIDE.md); palette đêm dưới đây không áp đặt lên Map02/03. Nhân vật dùng chung theo hồ sơ riêng trong docs/characters/.

## Chuẩn tạo hình

Illustrated textured pixel art: sprite 2D vẽ chi tiết, mảng sáng tối có khối, viền tối có kiểm soát, tường navy/indigo cũ, vữa nứt/gạch, kim loại và đá có texture. Ánh đèn amber từ cửa/đèn đường và neon trên biển. Đây không phải pixel art 8-bit thô, vector phẳng, low-poly/3D render, chibi, anime line-art mới hoặc ảnh chụp.

Giữ cùng độ chi tiết, độ sắc nét, tương phản và hướng nhìn với asset hiện có. Không dùng ảnh screenshot làm tile/panorama runtime. Không tạo AI sprite mới chỉ theo mô tả chữ khi có PNG tham chiếu phù hợp.

Tham chiếu bắt buộc phải xem theo nhóm công việc:

- Nhân vật: flame-ninja-atlas.png và preview integration/ninja-climb/climb-poses.png (bản leo v2 đã chốt, tên canonical không hậu tố).
- Nhà phố/mặt đứng: foreground/individual/, production/individual/ và expansion-z45-rc1/individual/.
- Props/biển: props/props/ (đặc biệt street/, signs/) và ui-polish-rc3/sign-pho-sai-gon.png.
- Background: backgrounds/buildings-near.png và các lớp đang được generator dùng. File chưa đặt vào runtime không tự thành asset đã duyệt.

Các đường dẫn môi trường trên tính từ public/assets/environments/map01/; nhân vật tính từ public/assets/characters/ninja/.

## Palette tham chiếu đã có

Trích từ foreground/foreground.json; giữ họ màu này và màu thực tế trong asset đã chốt, không ép toàn ảnh thành chín màu phẳng hoặc tự recolor cho “đồng nhất”.

| Vai trò | Màu |
| --- | --- |
| Night navy | #071638 |
| Indigo city | #182656 |
| Dusk violet | #433075 |
| Concrete blue | #2B3D60 |
| Stone highlight | #62779C |
| Neon cyan | #35D8E9 |
| Warm amber | #F7B25A |
| Neon red | #F04D52 |
| Leaf green | #406F53 |

Ninja giữ màu theo hồ sơ nhân vật, không tự recolor để khớp map. Biển Phố Sài Gòn cyan/violet là ngoại lệ cục bộ được yêu cầu, không phải quyền đổi mọi biển sang palette này. Nội dung chữ tiếng Việt phải đúng dấu và giữ brief đã duyệt.

## Bố trí và nối ảnh

- Môi trường tham chiếu 128 px/world unit, tile64px tương ứng0.5 unit. Đây là chuẩn authoring; worldSize/crop trong placement hiện hành mới quyết định kích thước hiển thị. Không reset mọi prop về raw pixel/128: nhiều món đã được người dùng chỉnh kích thước.
- Giữ tỷ lệ ảnh và kích thước đã chốt. Căn theo alpha chân hình, không theo mép canvas rỗng; kiểm trường hợp chậu, chân cột, chân bồn và nắp mái.
- Dùng connector/end-cap/crop phù hợp; không ép module cuối hoặc kéo giãn để lấp phần dư. Giữ khe giữa toà nhà thông xuống dưới; không phủ kín khe để che BG.
- Tách lớp xa/phố/props/nhân vật/tường đúng metadata. Không tự đổi parallax hoặc đưa nhà phố riêng ra trước nhân vật. Dây leo bậc hiện ở trước mặt vữa, vẫn sau player.
- Các chỉnh bố trí cụ thể (chậu1.5×, thiết bị mái1.5×, lan can ghép trụ...) nằm trong map01-polish.mjs và map01-street-layout.json. Không nhân lại hệ số mỗi task hoặc suy “1.5 lần” luôn là kích thước gốc; xác định mốc so với yêu cầu hiện tại.

Nếu thiếu asset đúng style Map01, lập brief và hỏi phần chưa rõ. Map mới có palette/thời điểm/ánh sáng theo chủ đề riêng trong hồ sơ map đó, vẫn kế thừa Illustrated textured pixel art. Không lấy quy tắc đêm Map01 làm giới hạn cho tất cả map.
