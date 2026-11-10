# Mốc art production nhân vật — đọc trước khi tiếp tục

Tổng hợp ngày **2026-11-09**, repo `C:\Users\anhthaitrong\Downloads\Games\cyber-ninja-2d`, HEAD khi đọc `082853a`. Đây là bản ghi nhớ có dẫn nguồn, không thay metadata/approval hiện hành. Task sau phải đọc lại catalog, rules và PNG thật của đúng clip; không dùng trí nhớ hội thoại, thumbnail hoặc ảnh candidate làm nguồn production.

## 1. Style và phạm vi dùng chung

**Illustrated textured pixel art, sprite 2D**: giữ texture, cụm pixel, độ nét, shading, viền tối và khối cơ thể theo PNG đã duyệt. Không chuyển sang 3D/vector/anime line-art hoặc tự vẽ lại danh tính gần giống. Hơi chibi là đặc tính riêng của quái theo brief, không tự áp lên Ninja Hỏa/Khan.

Map01 là phố Việt/Sài Gòn ban đêm, navy/indigo/tím, neon cyan/đỏ và ánh amber. Map02/03 được có palette/chủ đề khác, vẫn cùng ngôn ngữ hình ảnh; không tự recolor nhân vật dùng chung. Nguồn: [style chung](../rules/ART_STYLE_GUIDE.md), [Map01](../map01/rules/ART_STYLE_GUIDE.md), [sprite chung](../rules/SPRITE_SPEC.md), [atlas](../rules/ATLAS_SPEC.md).

## 2. Tỷ lệ đã chốt

Mốc so art Ninja Hỏa đứng là **251px =100%**, tham chiếu **160px/world unit**. Chiều cao này mô tả tư thế đứng/tham chiếu; không ép mọi pose cúi, co chân, bay thành cùng chiều cao bbox. Kích thước ô là canvas chứa sprite, không phải kích thước cơ thể hoặc collider. Pivot dưới đây thuộc metadata/preview của bộ tương ứng; không tự áp làm contract physics/runtime cho quái/boss.

| Nhân vật | Tỷ lệ / chiều cao art tham chiếu | Ô body / pivot | Nguồn production |
| --- | --- | --- | --- |
| Ninja Hỏa | 100% /251px | Locomotion và combat:384×320 /(192,289); attack và caster skill:512×512 /(192,353), FX theo metadata riêng | [Thư viện](ninja/animation/README.md), [chuẩn Ninja hiện hành](ninja/rules/PRODUCTION_REFERENCE.md) |
| Ninja Sói Điện | 88% /220,88px, gồm tai | 512×512 /(256,416); atlas thường2048×1024 | [Thư viện](electric-wolf/animation/README.md), [rules](electric-wolf/rules/SPRITE_SPEC.md) |
| Sát Thủ Bóng Neon | 95% /238,45px | 512×512 /(256,416); FX tâm(256,256) hoặc sát nền(256,416) | [Thư viện](neon-shadow/animation/README.md), [catalog](neon-shadow/animation/production.json) |
| Huyết Đao Khan | 150% /376,5px | Body512×512 /(256,456); FX theo metadata riêng, thường tâm(256,256) | [Thư viện](boss-khan/animation/README.md), [catalog](boss-khan/animation/production.json) |

Không nhân hệ số88/95/150% thêm lần nữa lên atlas đã được chuẩn hóa. Giữ scale/offset/source rect/pivot/density của đúng bộ. Không fit từng frame theo alpha bounds; không đổi physics để che lỗi ảnh.

## 3. Ninja Hỏa — ưu tiên bản chốt mới nhất theo từng clip

- **Idle chính thức:Task10.47**, publish ở10.48; commit `070bf93`. Sáu frame,7.1429FPS, cùng ô384×320/pivot192,289. Nguồn trực tiếp: `ninja/animation/locomotion/flame-ninja-atlas.png` + `animations.json`. Hash toàn atlas theo catalog: `d5559f90565cdc00eec69d7692eac7e48ce0b6bdd9bd070e59d69d551d523e48`. Khăn bụng/đai đã được sửa và chốt; không quay về mảng vải lỗi của baseline cũ.
- **Vào thế chiến đấu chính thức:Task10.51**, publish ở10.52; commit `082853a`. Bộ riêng [combat-idle](ninja/animation/combat-idle/README.md):2frame vào thế×100ms,6frame giữ/thở×140ms, vòng840ms. Atlas1536×640,384×320/pivot192,289. Hash PNG theo manifest: `ad287263e305ab1b96e2630b03b772ee554166eaffedb0835015ce6fa6d493da`.
- Tạo hình: nam lực lưỡng đúng mẫu, hood/mặt nạ đen, khe mắt nhỏ, dải đỏ/miếng kim loại trán, khăn/đai/tà đỏ, áo đen không tay viền đỏ, quần rộng, giáp cẳng tay/ống chân bạc, giày đen–đỏ. Idle47/combat51 đã có trang bị sau lưng; combat giữ đúng tay nắm chuôi của51. Các clip khác theo asset đã chốt của chính clip đó; không tự sửa toàn bộ trang bị hoặc trộn mảng cơ thể giữa các bộ.
- Run/hurt10.29 đã từng được chốt và nằm trong atlas hiện hành. Đi/chạy production hiện vẫn dùng run8frame/12FPS; chưa có walk riêng. Leo giữ bảnv2 đã chọn, tên canonical không hậu tố; không lật cả người để giả đổi tay/chân.
- Combo production vẫn là bộ `animation/attacks/` theo manifest, speed0,8. Giữ cây kiếm cán vàng/lưỡi hỏa đỏ–cam, lõi trắng vàng và chất lửa lớn nhiều lớp. Không thay bằng kiếm bạc hoặc lửa mỏng. Cho phép phối hợp một/hai tay theo đòn, mở thế và vươn ra trước; không ép luôn một tay hoặc tư thế hai tay khép sát ngực.
- Phi tiêu đứng/cúi, Minh Vương Bạo Viêm và Cửu Long Hỏa Trận đã có art/logic hiện hành. Source input hiện dùng E cho Minh Vương (cooldown5s), Q cho Cửu Long (12s), F bám thang, H ẩn/hiện trợ giúp. Tham số Q hiện hành:cast1s, aura7s, ring2,0×, thickness1,0×. Đây là mốc source, không cấp phép thay gameplay ở task art.
- Thiên Hỏa Giáng Lâm1,65s và Thiên Hỏa Tái Lâm0,75s đã chốt art. Idle47/combat51 và hai màn này có trạng thái tích hợp riêng; không suy đã đưa vào game chỉ vì nằm trong thư viện.

## 4. Quái và boss đã chốt art

**Sói Điện:** ninja đường phố nhỏ gọn, tai sói nhỏ/tóc xám trắng/nanh nhỏ/mắt cyan; hoodie tím than–đen, quấn tay/chân xám trắng, gậy điện cyan. Không dùng áo khoác bomber/jeans của brief đã thay. Đã chốt10clip: di chuyển, nhảy/rơi/đáp, leo hai chiều, Electric Baton bản sửa v2, hurt, Điện Quang Đột Kích, Điện Chấn Mặt Đất và xuất hiện khói điện. Nguồn `animation/atlas.json`; tên thư mục `candidate/` bên trong thư viện này là đường dẫn lịch sử của PNG đã chọn, không tự coi đó là art chưa duyệt. Commit thư viện `262f459`.

**Bóng Neon:** hoodie/trang phục ninja tím đen, khăn che mặt, mắt đỏ nhẹ, hai đoản đao/phi tiêu neon tím hồng; không có tai/nanh sói. Đã chốt11clip/14sheet: di chuyển/nhảy/leo, Neon Shuriken hai lần phóng, Nguyệt Nhận Hồi Sát, Thiên Ảnh Liên Trảm, hurt và Nguyệt Ảnh Hiện Thân. Ngoại hình95%, không lấy88% từ bản đề xuất đã bỏ. Commit thư viện `22d3589`.

**Khan:** nam cao/săn chắc, street-assassin áo xẻ tà ngắn, nửa mặt mask/mắt đỏ, trắng xám–đỏ neon–cyan lạnh, hai đao cong. Đã chốt5động tác cơ bản, Huyết Nguyệt Giáng Lâm, Song Đao Liên Trảm bản X vươn xa, dash nối combo, Ảnh Bộ Đoạn Sát bản tan/hiện dần, Huyết Ảnh Loạn Đao và Diệt Nguyệt Thập Tự. Commit thư viện `c56fbbd`. Cú X phải có hai tay/đao vươn về trước rồi hồi thế, không lấy lại bản X khép gần ngực đã bị yêu cầu sửa.

Art quái/boss đã duyệt **chưa đồng nghĩa AI, spawn, hitbox, damage hoặc timing gameplay đã tích hợp/nghiệm thu**. Các HTML là preview art, không chứng nhận cơ chế combat thật.

## 5. Những bản chưa được dùng làm chuẩn

- Task10.30 bị bác vì đổi kiếm/VFX và thế đánh; các bản31/32 và các thử nghiệm Ground Attacks/Spin33–36 không thay combo production khi chưa có approval tương ứng trong catalog. Lỗi cắt vệt lửa pose4/ảnh lẫn ô pose5 và vấn đề chuyển động đã được báo; không gọi bản thử là final.
- **Run10.53 bị bác**: sai tỷ lệ, chân mở quá dài. **Run10.54 đang chờ duyệt**,12frame gọn; không thay run production8frame hoặc combat51. Các file53/54 đang nằm trong working tree chưa commit ở thời điểm tổng hợp.
- Tên task, số revision cao hơn hoặc hình đẹp hơn không phải bằng chứng duyệt. Bản mới chỉ thành production sau lời chốt và cập nhật nguồn/catalog đúng quy trình.
- Tài liệu cũ có các đoạn “candidate/chờ duyệt” lịch sử đã bị cập nhật ở đầu file; đọc phần approval hiện hành và catalog trước, không lấy một dòng cũ làm kết luận trạng thái hiện tại.

## 6. Cách tiếp tục art cho đúng

1. Đọc AGENTS, bản ghi này, rules nhân vật và catalog/approval hiện hành; mở đúng PNG production ở độ phân giải gốc. Khi sửa Ninja, đọc thêm PRODUCTION_REFERENCE. Không tái dùng ảnh `idle-reference.png` cũ trong integration chỉ vì tiện.
2. Khóa danh tính, anatomy, màu/chất liệu, vũ khí/VFX và contract trước khi vẽ. Ảnh tham khảo ngoài chỉ dùng đúng phần được giao (ví dụ chuyển động), không thay costume/palette/kích thước.
3. Dựng theo lấy đà→gia tốc→chạm→theo đà→hồi; kiểm tra tay sinh học, vai–khuỷu–cổ tay, bàn tay–chuôi kiếm, cơ thể–trang bị, bụng–đai–tà, khăn và chân trụ. Không để tay cũ/kiếm trùng/mảnh ảnh rời/đường ghép lộ.
4. Vệt chém dài phải có source rect/gutter/lớp VFX phù hợp; không cắt grid ước lượng qua ngọn lửa, thu nhỏ nhân vật để nhét FX hoặc kéo mảnh ô bên cạnh vào frame. Kiểm tra cả4/5 và các frame nối, không chỉ ảnh impact.
5. Xem toàn bộ vòng ở cỡ thật/phóng lớn, nền sáng/tối và tốc độ chậm; audit pixel/hash chỉ bổ trợ, không thay review vùng đã sửa. Không tuyên bố đã xem browser/test khi chưa làm.
6. Candidate/source/prompt/metadata/provenance và nhật ký từng task vào `integration/` + `docs/map01/commits/<task>/`; bản đã chốt ở `docs/characters/<id>/animation/`. Không ghi đè lịch sử. Preview theo mẫu Khan: tổng hợp + basic, chọn nhóm, frame trước/sau, tua, tốc độ và bảng frame.
7. Chỉ publish bản người dùng chọn, giữ nguyên PNG/metadata/nhịp khi chỉ tổ chức thư viện. Art production và `public/assets/` runtime là hai trạng thái riêng. Chỉ commit khi được yêu cầu; thông điệp tiếng Anh có subject và body từng ý, giới hạn art/runtime rõ ràng.

Không tự chạy test/build/lint/typecheck/formatter. Bản tổng hợp này chỉ đọc tài liệu/source/ảnh và ghi nhận, không vẽ mới, sửa PNG, publish hoặc chạy game.
