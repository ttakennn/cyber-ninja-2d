# Task 10.17 — Huyết Đao Khan: động tác cơ bản

Người dùng đã chốt tạo hình v1 cao 150% Ninja Hỏa và giao vẽ đứng/thở, đi bộ, chạy, nhảy–rơi–tiếp đất, trúng đòn–hồi thế. [Preview động](preview.html) và bốn bảng frame (`locomotion-contact.png`, `run-contact.png`, `jump-contact.png`, `hurt-contact.png`) là **candidate chờ duyệt động tác**. Tạo hình v1 đã duyệt nằm tại `docs/characters/boss-khan/reference/boss-khan-v1.png`. Không đổi bộ nhân vật khác.

| Clip | Frame | Ý đồ |
| --- | --- | --- |
| Đứng/thở | `locomotion` 0–1 | Guard bình tĩnh, vai/ngực và tà áo chuyển động nhẹ |
| Đi bộ | `locomotion` 2–7 | Bước có chủ đích, giữ hai đoản đao |
| Chạy | `run` 1–6 | Nghiêng người, chân thay phiên, tà áo kéo sau |
| Nhảy/rơi/tiếp đất | `jump` 0–7 | Hạ gối, bật, lên đỉnh, rơi, chạm đất rồi guard |
| Trúng đòn/hồi thế | `hurt` 0–7 | Giật thân, lùi đỡ, hạ trọng tâm, trở lại guard |

Nguồn ImageGen là `integration/task-010-boss-khan/animation/source/`; prompt đầy đủ tại `integration/task-010-boss-khan/animation/prompts/`. `animation-plan.json` là đầu vào của `scripts/prepare_boss_khan_animation.ps1`; script sinh `candidate/*.png`, metadata JSON, `atlas.json`, `review-data.js` và bản sao cho preview. Mỗi nguồn 1774×887 RGBA, chia 4×2 theo `sourceRects` vì 1774 và 887 không chia hết cho 4/2. Ảnh candidate mỗi sheet 2048×1024, ô 512×512, pivot review (256,456), mật độ tham chiếu 160px/world unit. Một tỷ lệ duy nhất được tính từ frame đứng của **mỗi sheet** để chiều cao mực alpha≥128 đạt 376,5px; không phóng từng pose riêng. Frame đứng đầu có ink bbox cao 377px sau làm tròn. Chiều cao tham chiếu Ninja Hỏa là 251px.

Đã xem bốn bảng frame đã sinh: chân đứng và chân tiếp đất bám cùng đường nền; cơ thể, mặt nạ, áo trắng xám/đỏ/cyan và hai đao vẫn nhận diện được. Một vài pose đi bộ có khác biệt nhỏ nên cần xem preview động trước khi chốt. Bóng tốc độ ở sheet chạy là phần hình ảnh, chưa là dash gameplay. Độ cao nhảy và thời gian frame trong preview là cách xem art, không chốt physics, hitstun, AI, tốc độ chạy hay thời gian hồi thế.

Chưa mở preview trong trình duyệt, chưa nghiệm thu chuyển frame thực tế hoặc các viewport. Không chạy test, build, lint, typecheck, formatter theo yêu cầu hiện tại. Chưa đưa candidate vào `docs/characters/boss-khan/animation/` production hoặc `public/assets/`; không sửa runtime, collider, hitbox, damage, spawn hay vị trí boss. Skills boss sẽ là bước khác sau khi người dùng review art cơ bản.

Cập nhật 2026-11-05: người dùng đã chốt bộ động tác cơ bản ở lượt sau. Các PNG được sao chép nguyên byte sang [thư viện production](../../../characters/boss-khan/animation/README.md); đoạn trên ghi lại trạng thái lúc tạo candidate. Chưa tích hợp boss vào game.
