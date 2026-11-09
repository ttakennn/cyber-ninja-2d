# Task10.52 — Publish Vào thế chiến đấu10.51 và commit toàn bộ thay đổi

**USER_APPROVED_PRODUCTION_ART · 2026-11-09.** Người dùng chốt10.51, yêu cầu đưa vào art production, chưa đưa game và commit tất cả code changes. [Preview production](../../../characters/ninja/animation/combat-idle/preview.html), [thư viện tổng hợp](../../../characters/ninja/animation/preview.html), [approval](approval.json), [bằng chứng](release-evidence.json).

## Kết quả publish

- Copy đúng PNG10.51 đã được xem, SHA256 **ad287263e305ab1b96e2630b03b772ee554166eaffedb0835015ce6fa6d493da**, không chạy imagegen hoặc generator artwork. [Snapshot PNG](combat-idle-atlas.png).
- combatEnter: hai frame Nâng tay vào kiếm/Đưa tay về chuôi kiếm,100ms mỗi frame, không loop. combatIdle: sáu frame giữ thế/thở,140ms mỗi frame, loop840ms. Atlas1536×640, ô384×320/pivot192,289/160px-unit.
- [Metadata production](animations.json) chuyển từ review.json của51 sang schema thư viện; giữ nguyên rect, thứ tự và timing. [Manifest](manifest.json) ghi approval/source/hash và chuỗi enter→idle.
- Canonical ở docs/characters/ninja/animation/combat-idle/. Main preview có nhóm mới; basic preview có đường mở riêng. Catalog, production.json và source plan đăng ký bộ đã duyệt, publisher chung giữ authority này về sau.
- **40asset production cũ giữ nguyên hash**, kể cả atlas locomotion chứa Idle10.47. Không thay Idle thường, attack/skill/map đã chốt.

## Phạm vi commit theo yêu cầu

Lưu toàn bộ thay đổi hiện có trong repo: preview cơ bản28, lịch sử/source/run-hurt/combo/ground/spin28–36, các candidate chiến đấu49–51, prompt, generator, atlas và ảnh/GIF review, cùng phần publish51 ở task này. Run/hurt29 đã được chốt ở lịch sử trước; các candidate attack khác giữ trạng thái chờ duyệt, không đưa chúng vào production mới. Các thay đổi người dùng đang có được giữ nguyên khi gom commit.

Chỉ thư viện art/docs/source authoring; **không sửa src hoặc public/assets, không đưa vào game**, không nối detection quái/boss/AI/input/hitbox. Không merge/push. Git dùng tên/email đã cấu hình, không đổi tác giả.

## Kiểm tra và giới hạn

Publisher kiểm PNG canonical giống nguyên byte ảnh đã duyệt và40asset cũ giữ nguyên; bản review.json nguồn có guard hash. Rect/timing chuyển đúng2+6frame. Đây là kiểm tra đóng gói phục vụ yêu cầu publish, không là test game. Browser/runtime/test/build/lint/typecheck/formatter **NOT_RUN** trong lượt này. Lời chốt art không là nghiệm thu gameplay.

Nguồn publish: integration/ninja-combat-idle-production-51/release-plan.json và các mốc trước publish; scripts/publish_ninja_combat_idle_production_51.mjs chỉ publish bộ51 đã duyệt. Không sửa snapshot review51 hoặc chạy lại generator vẽ.
