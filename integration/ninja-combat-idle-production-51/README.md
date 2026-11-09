# Ninja Hoả — Vào thế chiến đấu

**Production art đã được người dùng CHỐT:10.51, ngày2026-11-09.** [Preview](preview.html), [atlas](combat-idle-atlas.png), [metadata](animations.json), [manifest / approval](manifest.json).

- combatEnter:2frame Nâng tay vào kiếm / Đưa tay về chuôi kiếm,100ms mỗi frame, không lặp.
- combatIdle:6frame giữ thế và thở,140ms mỗi frame, lặp840ms.
- Ô384×320, pivot192,289, atlas1536×640 RGBA;160px/world unit, cùng chuẩn Idle10.47.

PNG được sao chép nguyên byte từ bản10.51 người dùng đã xem, SHA256 ad287263e305ab1b96e2630b03b772ee554166eaffedb0835015ce6fa6d493da. Không regenerate/crop/resize/recolor khi publish. Rect, thứ tự và nhịp giữ đúng bản đã duyệt, metadata đưa về schema thư viện. Idle đứng/thở10.47 và các asset đã chốt khác giữ nguyên.

[Hồ sơ publish và bằng chứng](../../../../map01/commits/task-010-52-ninja-combat-production-51/README.md), [snapshot đã duyệt](../../../../map01/commits/task-010-51-ninja-combat-grip-entry/preview.html). Chỉ lưu art production, **chưa đưa vào game**; không nối AI/phát hiện quái/boss/input. Browser/runtime/test/build/lint/typecheck/formatter NOT_RUN trong lượt publish.
