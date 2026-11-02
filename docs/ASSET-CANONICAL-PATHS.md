# Chuẩn hoá đường dẫn asset — 2026-11-02

Theo yêu cầu người dùng, sau commit animation `12959ca`:

- Xoá atlas ninja cũ, đổi tên flame-ninja-atlas-v2.png thành flame-ninja-atlas.png; cập nhật animations.json và kỳ vọng URL trong test. Nội dung PNG v2 không sửa, không đổi scale/pivot/frame.
- Xoá map01/backgrounds cũ, đổi backgrounds-v2 thành backgrounds. Thay catalog backgrounds.json bằng catalog của bộ v2 và cập nhật URL trong catalog.
- Xoá map01/props cũ, đổi props-v2 thành props. Giữ cấu trúc con props/street, props/signs, atlases cùng catalog/provenance của bộ mới.
- Cập nhật generator/input, metadata integration RC2, manifest tham chiếu và test. Hai level JSON được sinh lại từ nguồn, không đổi gameplay hoặc bố trí.
- Script tạo ninja dùng tên canonical, lưu qua file trung gian để không ghi đè ảnh đang mở. Không chạy lại script tạo ninja trong tác vụ đổi tên.

Các báo cáo/prompt cũ và integration/map01-assets-v2/path-replacements.json giữ tên v2 khi mô tả nguồn/lịch sử. Chúng không được runtime đọc. Các cờ originalPropsPreserved/originalBackgroundsPreserved trong manifest là trạng thái ở lần tạo art ban đầu; bản cũ hiện chỉ còn trong lịch sử Git.

File backgrounds-v2/buildings-shop.png vốn chưa được theo dõi được giữ nguyên và chuyển theo thư mục thành backgrounds/buildings-shop.png; để ngoài commit do không thuộc thay đổi đã thực hiện.

Đã sinh lại JSON qua hai generator chế độ ghi. Không chạy test/build/lint/formatter/typecheck hoặc kiểm tra trình duyệt trong tác vụ này.
