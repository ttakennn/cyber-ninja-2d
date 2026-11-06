# Task 10.25 — Diệt Nguyệt Thập Tự, snapshot art đã duyệt

[Mở preview](preview.html) · [pose Khan trên không](aerial-contact.png) · [bốn frame dấu X](moon-cross-contact.png).

Khan bật lên, tụ năng lượng đỏ/cyan ở hai đao, chém nhát chéo thứ nhất rồi đổi tay chém nhát thứ hai. Dấu X có lõi trắng, viền đỏ neon và tia cyan, nén sáng trong một nhịp trước khi nổ dọc bốn cánh. Preview có nút tua từng nhịp. Nhịp1,95 giây, khoảng dừng210ms, vị trí/tầm hiệu ứng chỉ phục vụ duyệt hình; chưa chốt thông số gameplay, hitbox, sát thương hoặc AI.

Art nhân vật và FX là hai sheet riêng. Khan giữ ô512×512/pivot(256,456), FX ô512×512/pivot(256,256); mỗi sheet dùng một scale chung, tham chiếu160px/world unit. Đã xem bảng frame sau khi authoring: nhân vật và dấu X nằm trong ô atlas, không cắt vệt đao. [Plan gốc](../../../../integration/task-010-boss-khan/skill3-moon-cross/animation-plan.json), [quyết định duyệt](../../../../integration/task-010-boss-khan/skill3-moon-cross/approved-plan.json), [prompt/nguồn/hash](../../../../integration/task-010-boss-khan/skill3-moon-cross/prompts/moon-cross.md), [metadata snapshot](atlas.json). Người dùng đã chốt art; hai PNG được sao chép nguyên byte vào [thư viện production](../../../characters/boss-khan/animation/moon-cross/README.md).

Chưa kiểm tra preview trong trình duyệt hoặc chơi thử. Test/build/lint/typecheck/formatter **NOT_RUN** theo hướng dẫn hiện hành. Không đổi Map01, physics, Ninja Hỏa, boss AI, hitbox hoặc damage.
