# Bóng Neon — nguồn hoạt ảnh di chuyển

Hiện hành sau lời chốt: approved-plan.json chọn snapshot10.15 và publisher đưa đúng11clip/14sheet vào [art production](../../../docs/characters/neon-shadow/animation/preview.html), gồm spawn và spawnSmoke; không tái tạo PNG. Các đoạn “chờ duyệt” dưới đây ghi trạng thái ở thời điểm từng task, nay là lịch sử. Chưa runtime/spawn/AI/damage hoặc nghiệm thu game.

Hiện hành10.15: hurt đã chốt; approved-plan/publisher chọn snapshot10.14 với10clip/12sheet vào production. [Nguyệt Ảnh Hiện Thân mới](../../../docs/map01/commits/task-010-15-neon-shadow-entrance/preview.html):spawn8pose/spawnSmoke8frame,1200ms/Idle400ms, reviewDirectory10.15; authoring -OnlySheet từng bộ, giữ PNG cũ. Chưa trigger spawn/input/runtime; các trạng thái dưới đây giữ lịch sử.

Hiện hành10.14: Thiên Ảnh Liên Trảm đã chốt; approved-plan/publisher chọn snapshot10.13 với9clip/11sheet vào production. [Hurt8pose mới](../../../docs/map01/commits/task-010-14-neon-shadow-hurt/preview.html) chờ duyệt, reviewDirectory10.14; authoring -OnlySheet hurt không tái tạo PNG cũ, nhịp860ms chỉ review, chưa hitstun/physics/damage/runtime. Các trạng thái bên dưới giữ lịch sử.

Hiện hành10.13: Nguyệt Nhận Hồi Sát đã chốt; approved-plan/publisher chọn snapshot10.12 với8clip/8sheet vào production. [Skill2 Thiên Ảnh Liên Trảm mới](../../../docs/map01/commits/task-010-13-aerial-multi-slash/preview.html):aerialCombo16pose/aerialArc8frame/aerialGround8frame, reviewDirectory10.13. Source/prompt/hash/điểm neo FX sát nền giữ trong plan/atlas. Authoring -OnlySheet từng bộ, không tái tạo PNG đã chốt. Chưa runtime/gameplay; trạng thái dưới đây giữ lịch sử.

Hiện hành10.12: Neon Shuriken đã được người dùng chốt; approved-plan/publisher chọn snapshot10.11 với7clip/6sheet đã duyệt vào production. [Skill1 Nguyệt Nhận Hồi Sát mới](../../../docs/map01/commits/task-010-12-moon-boomerang/preview.html) gồm moonCast12pose/moonBlade8frame, mới chờ review, reviewDirectory10.12. Authoring -OnlySheet từng bộ; không tái tạo PNG cũ hoặc ghi candidate vào production. Các trạng thái bên dưới giữ lịch sử.

Hiện hành:6clip di chuyển đã được người dùng chốt và publish nguyên PNG qua approved-plan.json / scripts/publish_neon_shadow_animation.mjs. [Production](../../../docs/characters/neon-shadow/animation/preview.html). animation-plan.json tiếp tục authoring Neon Shuriken mới, [review10.11](../../../docs/map01/commits/task-010-11-neon-shuriken/preview.html):12pose body +8frame FX, chưa duyệt. Source/prompt giữ riêng, -OnlySheet không sinh lại PNG cũ; các mô tả chờ duyệt di chuyển bên dưới giữ lịch sử.

Ngoại hình v1 và chiều cao95% đã được người dùng chốt. Bộ chuyển động mới chờ duyệt:4sheet/33pose/6clip; [preview](../../../docs/map01/commits/task-010-10-neon-shadow-animation/preview.html).

animation-plan.json khai báo clip/timing, nguồn/prompt/gốc ImageGen, grid và chính sách scale. source/ giữ PNG AI nguyên byte, gồm climb-first.png trước sửa tay/chân; candidate/ là PNG/JSON chuẩn hoá, không phải production. atlas.json/review-data.js là output authoring. Ngoại hình nguồn ../source/neon-shadow-v1.png không bị tạo lại.

Từ gốc repo, dùng Windows PowerShell5.1:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts/prepare_neon_shadow_animation.ps1
# Chỉnh một sheet:
powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts/prepare_neon_shadow_animation.ps1 -OnlySheet climb
```

Đầu ra reviewDirectory trong plan; task mới phải đổi reviewDirectory để giữ lịch sử. Một scale theo pose đứng0 của mỗi sheet, frame512/pivot256,416/160px-unit; airborne/climb không căn chân lại từng frame. Nhịp và motionY chỉ để xem art, không phải dữ liệu physics. Sau khi người dùng chốt, mới publish đúng bộ được chọn theo docs/rules/ANIMATION_PRODUCTION.md. Chưa runtime/test/build/browser/commit.
