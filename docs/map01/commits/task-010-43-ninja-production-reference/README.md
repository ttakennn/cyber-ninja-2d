# Task10.43 · đọc và ghi nhớ bộ chuẩn Ninja Hỏa production

Ngày2026-11-08. Người dùng gửi AGENTS.md, flame-ninja-atlas.png, basic-preview.html, preview.html và yêu cầu đọc/ghi nhớ bản chuẩn. Đã đọc toàn bộ3file văn bản và ảnh đính kèm; đối chiếu nguồn repo cùng metadata/manifest.

[Bản chuẩn đã ghi lại](../../../characters/ninja/rules/PRODUCTION_REFERENCE.md) · [Mốc nguồn/hash đã đọc](read-evidence.json).

## Kết quả

- Nội dung3file văn bản gửi lên trùng bản repo sau khi bỏ newline cuối file.
- Atlas gốc repo3136×1968 có SHA2560f6f86e222f86ceda5cd7849c9b11de64793c3c3c0e233e36fc941684c52eeba, khớp production.json. Ảnh đọc qua hội thoại2047×1285 được giữ làm tham chiếu hiển thị; không dùng nó thay atlas độ phân giải đầy đủ.
- Đọc animations.json:384×320, pivot192,289,160px/unit; Idle6/run8, các clip còn lại và nhịp đã ghi trong PRODUCTION_REFERENCE.md.
- Đã ghi khuôn mặt/mắt/mũ/mặt nạ, màu và nếp khăn, tỉ lệ/khối cơ, áo/đai/tà vải/quần/giáp/giày và cách dùng production frame làm chuẩn. Ghi rõ8nhóm preview và phần minh họa art chưa là nghiệm thu runtime.
- Thêm liên kết vào AGENTS/spec/chỉ mục nhân vật để các lượt làm sau đọc cùng một nguồn chuẩn; không nâng các candidate Idle/attack đang review thành production.

Chỉ thay tài liệu ghi nhớ/trạng thái. Không sửa PNG/JSON art, HTML preview, src/public, physics/input/gameplay; không tạo art, publish, commit/merge/push. Browser/test/build/lint/typecheck/formatter NOT_RUN; không có yêu cầu kiểm tra trình duyệt hoặc chạy game trong task đọc tài liệu.

read-evidence.json lưu hash tại thời điểm đọc, trước khi thêm liên kết ghi nhớ vào AGENTS. Đây là mốc đối chiếu nguồn đã gửi, không phải manifest mới thay production.json.
