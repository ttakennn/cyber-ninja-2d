# Task09.15 — tích hợp Cửu Long Hỏa Trận

Ngày2026-11-03. Nhánh codex/task-009-player-attack-art; baseline commit08294d4. Người dùng duyệt artwork và chốt **Q, vòng2.5×, độ dày1.0×**. Lượt này tích hợp để người dùng chạy/review; chưa commit/merge/push hoặc gọi production.

## Hành vi đã triển khai

- Q nhấn một lần khi đứng trên đất, không đang combo/phi tiêu/cast E. Không queue hoặc tự lặp khi giữ. E vẫn Minh Vương Bạo Viêm, F bám thang, H ẩn/hiện help.
- Cast1.4s:8pose rút/cắm kiếm, vòng trận và9instance rồng chia3nhóm, kết thúc bằng Bạo Viêm. Chặn input di chuyển/cúi/nhảy/bám thang trong cast, không thay controller movement/physics/collider. Không đứng yên trên không hoặc bỏ gravity.
- Aura bắt đầu ở1.4s, tồn tại7s gồm nở250ms và mờ350ms cuối; kết thúc tại8.4s. Scale FX2.5×/độ dày1.0×, loop16fps, xoay0.35vòng/s, theo tâm cơ thể. Sau cast di chuyển/cúi/leo/attack trở lại bình thường, aura tiếp tục đi theo người.
- Ninja sáng từ đầu cast, viền vàng kem/quầng cam, nhịp sáng nhẹ1.2Hz; fade cùng350ms cuối aura rồi trở về sprite gốc. Lớp sáng chỉ bám sprite nhân vật đang hiển thị, không áp orb/rồng hoặc môi trường và không chỉnh ảnh gốc.
- Cooldown12s tính từ lúc cast được chấp nhận, không tiêu hao nếu tải lỗi/chưa đủ điều kiện. Ngắt cast/reset/respawn/blur/dừng game tắt hiệu ứng nhưng giữ cooldown còn lại, theo chính sách special hiện có. Khi game tạm dừng, cooldown không chạy bằng đồng hồ ngoài mô phỏng.
- HUD Q dưới HUD E: tên/trạng thái/countdown/thanh hồi; tên skill hiện trên đầu1.5s, chỉ chữ sáng/nổi/mờ theo UI hiện có. Điều chỉnh vị trí debug/nhãn mobile để nhường chỗ ô Q.
- Đây chỉ là animation/FX/cooldown/input. Chưa damage, hitbox,3event sát thương, Burn, knockback, enemy/boss hoặc logic aura gây damage. Không suy radius125px hoặc alpha ảnh thành vùng va chạm;126HP brief cũ không phải tổng sát thương aura mới.

## File và contract

| Nhóm | Thay đổi |
| --- | --- |
| Nguồn tích hợp | integration/task-009-nine-dragons/runtime-plan.json; scripts/promote_ninja_nine_dragons.mjs |
| Asset đầu ra | public/assets/characters/ninja/skills/nine-dragons/: cast,dragon,seal,burst,aura PNG+JSON; manifest.json giữ nguồn/hash/approval |
| Cấu hình | src/config/nine-dragons.generated.json sinh từ art/atlas/runtime-plan |
| Runtime riêng | src/entities/PlayerNineDragons.ts quản lý tải/phase/aura/cooldown/dispose; src/rendering/PlayerSkillGlow.ts lớp sáng additive trên mesh Ninja |
| Điểm tích hợp | Player.ts, Game.ts, InputManager.ts, SpecialSkillHud.ts, DebugOverlay.ts, Renderer.ts, styles/main.css, index.html |
| Test thêm | PlayerNineDragons.test.ts, PlayerSkillGlow.test.ts |
| Test cập nhật | InputManager.test.ts, FallRecovery.test.ts, SpriteSheetLoader.test.ts |
| Tài liệu | integration README, docs/TASK-009.md, TASK_STATUS toàn dự án/Map01, DECISION_LOG, contract ninja |

PNG runtime là copy nguyên byte candidate, không tạo/recolor/resize artwork. Caster512×512/pivot(192,353),3.2×3.2world giữ160px/unit như attack. Thời lượng không đều được khai báo bằng slot5ms trong metadata, giữ tổng1.4s. Burst chuyển tiếp dùng4pha đầu trong250ms rồi crossfade150ms sang aura; PNG6pha vẫn nguyên.

FX quy đổi từ preview1280×720/camera cao9unit,80CSSpx/unit: khung dragon1.4375unit, seal3.575unit, burst/aura3.625unit trước scale. Aura full canvas sau scale9.0625unit, không phải đường kính collider/damage. Pivot FX tách khỏi caster. Giữ nguyên atlas locomotion/combo/E/phi tiêu, collider, map/camera, timestep, interpolation và mật độ nhân vật.

## Thực hiện và giới hạn

- Đã chạy generator **authoring** `node scripts/promote_ninja_nine_dragons.mjs` để copy PNG/sinh metadata. Không chạy lại công cụ tạo ảnh hoặc script chuẩn hoá artwork.
- Đã đọc source/diff/metadata và luồng dùng chung. Có thêm test cho byte PNG/contract,1.4+7s,grow/fade,cooldown/reset,gating movement/action,tải lỗi/dispose/texture reuse, binding Q và tài nguyên lớp sáng; **chưa chạy các test này hoặc test cũ**.
- Test/build/ESLint/formatter/TypeScript check/validation command: **NOT_RUN** theo hướng dẫn hiện tại. Không có log pass hoặc production build mới.
- Chơi thử, viewport/resize/browser console, compile shader trên GPU, đo hiệu năng và ảnh runtime mới: **NOT_RUN**. Ảnh preview09.11–14 là lịch sử được duyệt art, không phải bằng chứng runtime của bản này.
- Glow Canvas2D của preview được chuyển sang lớp additive GPU dùng cùng UV/frame/pivot của sprite; không thể coi hai bộ render đã khớp hình tuyệt đối khi chưa chạy/review. Cần xem độ sáng/viền và độ đọc nhân vật trong game trên nền Map01.
- Artwork hiện kết thúc ở thế trụ/cắm kiếm rồi trả trực tiếp về locomotion như preview; chưa có clip thu kiếm riêng. Không tự tạo pose mới hoặc sửa atlas khác trong lượt apply.
- Cần người dùng review Q trong hai hướng, vòng2.5×/độ dày1.0×, chuyển cast→movement/aura, crouch/climb/action trong aura, fade, cooldown/reset và HUD hai kỹ năng trước nghiệm thu tiếp.
