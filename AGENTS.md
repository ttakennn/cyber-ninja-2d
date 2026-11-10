# Hướng dẫn làm việc trong Cyber Ninja 2D

Áp dụng cho toàn repo. Giao tiếp và báo cáo bằng tiếng Việt; giữ tên API, identifier và phong cách code hiện có. Yêu cầu rõ ràng của người dùng trong task hiện tại có ưu tiên hơn quy tắc repo. Không xem ví dụ trong tài liệu/ảnh tham khảo là quyền tự thay thiết kế.

## Nguồn sự thật phải đọc

- Mọi task: [cấu trúc tài liệu](docs/README.md), [GAME_BIBLE](docs/rules/GAME_BIBLE.md), [TASK_STATUS](docs/TASK_STATUS.md), [DECISION_LOG](docs/DECISION_LOG.md).
- Task ảnh, UI, môi trường hoặc map: [ART_STYLE_GUIDE chung](docs/rules/ART_STYLE_GUIDE.md), [ATLAS_SPEC chung](docs/rules/ATLAS_SPEC.md), rồi docs/<map-id>/README.md, rules/ và TASK_STATUS.md của đúng map đang làm.
- Task nhân vật/animation: đọc [SPRITE_SPEC chung](docs/rules/SPRITE_SPEC.md) và hồ sơ docs/characters/<character-id>/ của đúng nhân vật, kể cả khi nhân vật dùng ở map khác. Map01 không sở hữu contract ninja dùng chung.
- Đọc [mốc production toàn bộ nhân vật/quái/boss](docs/characters/PRODUCTION_BASELINE.md) trước task art; đối chiếu catalog/approval mới nhất, không dùng candidate hoặc trí nhớ hội thoại thay chuẩn.
- Riêng Ninja Hỏa: đọc [bản chuẩn production đã được người dùng tái xác nhận](docs/characters/ninja/rules/PRODUCTION_REFERENCE.md), xem đúng PNG gốc và metadata trước khi sửa; không lấy candidate đang review thay bản chuẩn.
- Vòng đời artwork/animation: đọc [ANIMATION_PRODUCTION](docs/rules/ANIMATION_PRODUCTION.md). docs/characters/<id>/animation/ là bản art đã chốt cho production; bản thử, ảnh review và lịch sử task phải lưu trong commits. Không ghi đè production bằng candidate chưa được duyệt.
- Sau đó đọc source, metadata, generator và báo cáo gần nhất liên quan trước khi sửa. Phải xem PNG tham chiếu khi tạo/chỉnh artwork, không chỉ đọc tên file.
- Các tài liệu trên mô tả baseline hiện hành. Báo cáo TASK-xxx/RC cũ là lịch sử; đường dẫn v2 trong báo cáo cũ không thay thế đường dẫn canonical. Khi tài liệu và source mâu thuẫn ở điểm ảnh hưởng thiết kế, nêu rõ mâu thuẫn và hỏi trước khi đổi phần đó.

## Khoá art và kích thước

- Khi người dùng gửi ảnh tham khảo tư thế: đối chiếu góc thân, vai–khuỷu–cổ tay, vị trí nắm chuôi và tay trái/phải sinh học trước khi vẽ. Review từng frame ở kích thước thật và phóng lớn trên nền sáng/tối; rà tay cũ còn sót, mảnh ảnh rời, vùng nách/eo, đường nối khăn–đai và điểm tiếp xúc tay–kiếm. Chỉ số0pixel ngoài mask không đủ chứng nhận pose hay chất lượng ghép; không bàn giao chỉ dựa trên audit vùng giữ nguyên.

- Nguồn dự án người dùng xác nhận: `C:\Users\anhthaitrong\Downloads\Games\cyber-ninja-2d`. Art nhân vật đã chốt trong `docs/characters/` là chuẩn tạo hình; candidate trong commits/integration không thay thế chuẩn đó khi chưa được duyệt.
- Khi sửa animation đã chốt, review cả vùng được sửa: khớp bụng/đai/quần áo qua từng frame và trang bị phải đi theo mốc cơ thể. Kiểm tra pixel vùng được giữ không thay thế việc xem đường nối và vòng chuyển động; không ghép mảng cơ thể lệch vị trí hoặc để trang bị đứng yên trên canvas khi thân cử động.

- Không tự redesign nhân vật, đổi style/palette/chất liệu/góc nhìn, scale, canvas, frame rect, pivot, anchor hoặc atlas đã chốt của map/nhân vật đang chỉnh. Không tự thay bằng asset khác phong cách, hình tạm hoặc ảnh tạo lại gần giống.
- Chung toàn game: Illustrated textured pixel art, sprite 2D, cùng ngôn ngữ tạo khối/texture và nguyên tắc kỹ thuật. Palette, độ sáng, chủ đề và ánh sáng thuộc từng map; Map02/03 có thể tươi sáng hơn theo brief, không phải sao palette đêm Map01. Không tự recolor asset đã duyệt của map/nhân vật khác để làm map mới.
- Nhân vật mới có danh tính, trang phục, palette, silhouette và contract riêng theo brief; không bắt mọi nhân vật dùng màu đen/đỏ, tỉ lệ người trưởng thành hoặc atlas ninja. Phải xác lập kích thước/world scale/frame/pivot/clip phù hợp engine trong hồ sơ nhân vật trước khi tích hợp, hỏi các điểm quan trọng chưa rõ. Nhân vật đã duyệt giữ contract/danh tính khi dùng qua map khác, trừ khi được yêu cầu đổi rõ.
- Chỉ thay vùng/clip được giao; các phần khác phải được giữ nguyên. Không resize cả atlas, fit từng frame độc lập, lật toàn nhân vật để giả pose đối bên hoặc sửa physics để che lỗi ảnh.
- Ưu tiên tái sử dụng asset hiện có. Nếu thiếu artwork phù hợp: nêu asset, kích thước, vị trí/chức năng cần bổ sung và hỏi phần mỹ thuật chưa rõ; tiếp tục phần độc lập đã rõ. Không tự gọi bản tạm/candidate là final.
- Khi được phép tạo/chỉnh ảnh: dùng ảnh đã chốt làm tham chiếu, ghi rõ invariants trong prompt, lưu phiên bản để review trước khi thay canonical trừ khi đã được phép thay. Lưu prompt, nguồn, crop/normalization và metadata; không bịa provenance.
- Artwork được duyệt không đồng nghĩa test/build/runtime đã đạt. Không tuyên bố nghiệm thu khi chưa thực hiện.

## Phạm vi, phân tích và an toàn hồi quy

- Trước khi sửa: xác định yêu cầu, hành vi phải giữ, luồng dữ liệu, nơi dùng chung, phụ thuộc, ảnh hưởng và edge case. Kiểm source thay vì đoán quy tắc còn thiếu.
- Chọn giải pháp đúng, ít rủi ro, diff nhỏ, phù hợp kiến trúc và dễ hiểu. Chỉ hỏi phần mơ hồ quan trọng; không chặn phần độc lập đã rõ.
- Không refactor, hiện đại hoá, thêm dependency/abstraction hoặc tối ưu ngoài phạm vi. Không đổi shared behavior toàn cục để xử lý lỗi cục bộ.
- Giữ formatting cũ; không format cả file, sắp import, đổi quote/semicolon/whitespace hoặc đổi translation key ngoài yêu cầu. Không xoá/đổi tên/reorganize key dịch hiện có để “làm sạch”.
- Collision, spawn, climbable và camera là dữ liệu gameplay độc lập với ảnh. Không suy collider nhân vật từ pixel. Không đổi physics/input/timestep/animation logic trong task chỉ sửa artwork.
- Với dữ liệu được sinh: sửa nguồn generator/input/plan trước rồi sinh JSON; không sửa riêng output để qua kiểm tra. Chỉ chạy generator chế độ ghi khi cần authoring output của task; chế độ --check là validation và cần phép như bên dưới.
- Giữ thay đổi người dùng đang có trong working tree. Không xoá file lạ/untracked hoặc ghi đè asset ngoài phạm vi. Không tự merge, push hoặc tạo task/gameplay tiếp theo.

## Quy tắc chạy lệnh

- Không tự chạy test, build, lint, formatter, TypeScript check hoặc validation command. Chỉ chạy khi người dùng yêu cầu/cho phép rõ trong **task hiện tại**; phép ở task cũ không tự kéo sang task mới.
- Cụ thể không tự chạy npm run lint/eslint/typecheck/build/format, npm run test, npx eslint/tsc/prettier, tsc --noEmit, prettier --write, eslint --fix hoặc lệnh tương đương.
- Được đọc source/diff/metadata và xem ảnh để hiểu công việc. Không lách hạn chế bằng script tự chế thực chất chạy lại kiểm tra bị cấm. Nếu được yêu cầu review/giữ bất biến ảnh, thực hiện phần kiểm tra ảnh cần thiết cho yêu cầu đó; không tự mở rộng sang test/build.
- Không tạo test dư thừa cho sửa nhỏ, dễ đảo ngược. Khi thay contract/kỳ vọng đã có, cập nhật test liên quan nhưng không chạy nếu chưa được phép.

## Kết thúc task

- Task nhân vật vẫn phải lưu báo cáo/ảnh/metadata hoặc snapshot preview theo task trong docs/<map-id>/commits/ (Map01 dùng docs/map01/commits/). Sau khi người dùng chốt mới cập nhật docs/characters/<id>/animation/ bằng đúng file được chọn; giữ nguồn/hash/pivot/timing và bỏ hậu tố phiên bản ở bản canonical khi được yêu cầu. Không suy art production thành nghiệm thu runtime/gameplay.

- Task Map01: lưu báo cáo Markdown, ảnh preview và log/bằng chứng theo task trong docs/map01/commits/ (nên dùng thư mục con theo task để tránh trùng tên). Quy chuẩn lâu dài vẫn ở docs/map01/rules/; không ghi đè bằng chứng task cũ.

- Rà diff: mọi dòng phải phục vụ task; bỏ cleanup không cần thiết. Dừng khi hoàn tất phạm vi được giao.
- Báo file/asset thay đổi, ảnh hưởng, điều đã kiểm tra và NOT_RUN; ghi vấn đề còn mở. Không hứa đã chơi thử hoặc đã đạt production nếu thiếu bằng chứng.
- Cập nhật TASK_STATUS của phạm vi liên quan (toàn dự án/map/nhân vật) khi trạng thái/baseline hoặc giới hạn thay đổi. Chỉ thêm DECISION_LOG khi có quyết định được người dùng chốt; không tự biến đề xuất thành phê duyệt. Không sửa lịch sử để tạo cảm giác task đã được duyệt.
- Chỉ commit khi người dùng yêu cầu. Với commit art/animation, viết subject tiếng Anh nêu rõ phạm vi và body gồm các thay đổi chính theo từng dòng, tình trạng asset/provenance và giới hạn runtime; dùng tên/email Git hiện hành, không tự đặt lại tác giả hoặc ngày. Gom một phần việc nhất quán vào một commit, không gộp thay đổi ngoài phạm vi.
