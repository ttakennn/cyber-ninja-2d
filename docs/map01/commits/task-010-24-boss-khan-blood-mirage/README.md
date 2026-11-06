# Task 10.24 — Huyết Ảnh Loạn Đao, art đã chốt

[Mở preview](preview.html) · [bốn pose ảo ảnh](phantoms-contact.png) · [bốn pose Boss thật/cú quét](finisher-contact.png).

Ba bóng ảo lao ngang phải, ngang trái và chéo xuống; từng bóng vẫn có hình Khan, mặt nạ, áo và song đao rõ, với vệt tốc ảnh đỏ/cyan nhẹ. Sau chúng, Boss thật xuất hiện giữa sân, lấy đà, vươn hai tay quét đao rộng và thu thế. Preview 2,05 giây có nút tua từng nhịp; **chỉ cú quét cuối là đòn thật theo brief**, còn preview không có sát thương/hitbox. Quỹ đạo, thời điểm và vị trí là lựa chọn minh họa art, không chốt AI/cơ chế nhận biết bóng thật.

Hai sheet có ô512×512, pivot(256,456), tham chiếu160px/world unit và một scale chung cho mỗi sheet. Đã xem bảng pose sau khi authoring; nét hình và vệt đao còn trong ô atlas, chân Boss thật cùng đường nền. [Plan](../../../../integration/task-010-boss-khan/skill2-blood-mirage/animation-plan.json), [prompt/nguồn/hash](../../../../integration/task-010-boss-khan/skill2-blood-mirage/prompts/blood-mirage.md), [metadata](atlas.json). Người dùng chốt art không cần sửa; hai PNG được sao chép nguyên byte vào [thư viện art production](../../../characters/boss-khan/animation/blood-mirage/preview.html), chưa vào runtime.

Chưa kiểm tra preview trong trình duyệt, chưa chơi thử. Test/build/lint/typecheck/formatter **NOT_RUN** theo hướng dẫn hiện hành. Không đổi physics, Ninja Hỏa, Map01, boss AI, hitbox hoặc damage.
