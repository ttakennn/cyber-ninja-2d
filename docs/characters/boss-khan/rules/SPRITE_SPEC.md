# Huyết Đao Khan — sprite

Kế thừa [style chung](../../../rules/ART_STYLE_GUIDE.md), [sprite chung](../../../rules/SPRITE_SPEC.md) và palette/ánh sáng riêng [Map01](../../../map01/rules/ART_STYLE_GUIDE.md). Brief người dùng: boss nam cao, săn chắc, street-assassin áo xẻ tà ngắn, nửa mặt đeo mask/mắt đỏ, song đao cong ngắn, trắng xám–đỏ neon–cyan lạnh, hơi dễ thương nhưng ngầu; dash/afterimage, cao bằng1,5 lần Ninja Hỏa.

[Tạo hình v1 đã duyệt](../reference/boss-khan-v1.png) dùng source1199×1312 RGBA, ink alpha≥128 cao1245px. So trên mặt đất với Ninja Hỏa Idle251px: mục tiêu hiển thị376,5px (150%), hệ số vẽ đồng nhất0,302409638554; pivot review(658,1267), tham chiếu160px/world unit. Đây chỉ là kích thước trình bày art. Sheet động tác cơ bản đã duyệt dùng ô512×512/pivot review(256,456), một tỷ lệ đồng nhất theo frame đứng của từng sheet. Chưa chốt atlas/pivot runtime, animation timing, world visual placement, collider/hitbox hoặc spawn. Không suy chúng từ alpha hay từ contract Ninja Hỏa.

Không thay hoặc recolor Ninja Hỏa, Sói Điện, Bóng Neon. Bộ động tác cơ bản, art xuất hiện, combo đánh thường với X vươn xa, lướt nhanh nối combo và cả ba skill đã được publish vào [thư viện animation](../animation/preview.html). Art Diệt Nguyệt Thập Tự giữ tách nhân vật pivot(256,456) với FX pivot(256,256); chưa suy hitbox hoặc kích thước runtime từ hai sheet này.
