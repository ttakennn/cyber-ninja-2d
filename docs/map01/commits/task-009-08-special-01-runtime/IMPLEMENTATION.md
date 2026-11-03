# Task09.3.4 — tích hợp Minh Vương Bạo Viêm / E, bám thang / F

Ngày2026-11-03, baseline25d85cd, nhánh codex/task-009-player-attack-art. Người dùng duyệt art special và yêu cầu tích hợp bằng **E**, thay kế hoạch Q cũ; thao tác bám thang chuyển sang **F**. Khi hỏi mốc cooldown5 giây, người dùng chọn **từ lúc bắt đầu thi triển; bị ngắt vẫn hồi chiêu**. Chưa commit/merge/push lượt này; giữ art/source chưa commit của lượt trước.

## Hành vi triển khai

- E phát một lần theo cạnh nhấn, giữ phím không tự lặp sau cooldown. F chỉ bám thang; W/S hoặc↑/↓ tiếp tục leo, A/D rời, Space nhảy rời như trước. Cập nhật help/aria-label và test input theo key mới.
- Special dùng pose đứng đã duyệt nên chỉ bắt đầu khi grounded/standing, không đang leo hoặc phát combo/phi tiêu. Không xếp hàng khi đang bận/cooldown, không tiêu cooldown nếu request bị từ chối hoặc asset chưa sẵn sàng. Cùng fixed step, các click chuột được xử lý trước E để giữ luồng combo/phi tiêu cũ.
- Nhịp giữ như preview:120/140/100/90/100/150ms, tổng700ms. Tụ cầu tại ba socket tay rồi phóng ở360ms; hướng khoá theo lần cast. Chạy ngang vẫn dùng movement hiện có, không khoá/thay physics hoặc vận tốc để hợp pose.
- Cooldown5s bắt đầu khi cast được chấp nhận. Nhảy/cúi/bám thang huỷ pose chưa xong, không hoàn cooldown. Orb đã phóng tiếp tục bay. Stop/blur/ẩn tab/respawn dọn pose và mọi orb/nổ, vẫn giữ cooldown đã dùng. Cooldown chạy bằng fixed simulation; khi loop dừng (stop/tab ẩn) thì tạm dừng cùng game, không dùng wall clock để tự trừ thời gian.
- Orb ở world riêng, tốc độ4.5unit/s và cỡ khung1.5×1.5unit tương ứng preview720px/s,240px ở160px/unit. Không TTL. Dọn ngoài biên ngang level theo cách phi tiêu hiện có (hợp cameraBounds và solids, thêm biên bằng chiều rộng khung), không dọn chỉ vì ra camera hiện tại.
- Quét tâm orb liên tục theo đoạn ngang qua solids, tìm mặt collider gần nhất cả hai chiều kể cả tường mỏng. Đoạn từ thân tới tay cũng được kiểm tra, tránh sinh orb bên kia vật sát người. Chạm solid thì bỏ orb và đặt explosion tại đúng mặt chạm; đồ thuần ảnh/background/climbable không tự trở thành collider.
- Explosion8 frame/16fps, cỡ khung4×4unit như preview640px, phát một lần rồi dispose. Tính phần thời gian còn lại sau điểm va chạm trong fixed step, không phát lại hoặc giữ frame cuối vô hạn. Orb ra ngoài level không tự nổ trong không khí.
- Dòng hướng dẫn hiển thị tải/lỗi/sẵn sàng/hồi chiêu; chỉ ghi DOM khi nội dung đổi (cooldown làm tròn lên0.1s). F3 có trạng thái/lỗi và số giây cooldown chi tiết.

**Chưa damage, AOE gameplay/radius, quái hoặc boss.** Có hình nổ AOE đã duyệt và va chạm solid, không tự lấy cỡ ảnh làm bán kính sát thương hoặc đặt số damage. Phần này để bước combat/quái tiếp theo theo phân chia trước đó. Không thêm cơ chế cast khi cúi/trên không, không tạo asset mới trong lượt này.

## Asset và nguồn dữ liệu

Ảnh cast/orb/explosion copy nguyên byte từ integration/task-009-special-01/candidate/ sang public/assets/characters/ninja/skills/special-01/. Cast giữ ô512×512, pivot(192,353), visual3.2×3.2,160px/unit; không đổi kích thước cơ thể, atlas locomotion, combo hoặc phi tiêu. Orb/explosion giữ rect/pivot đã review.

Nguồn runtime: integration/task-009-special-01/runtime-plan.json + art-plan.json + atlas.json. Generator mới scripts/promote_ninja_special_01.mjs sinh metadata runtime, manifest và src/config/special-01.generated.json; đã chạy **node scripts/promote_ninja_special_01.mjs** để authoring. Slot10ms giữ nguyên thời lượng từng pose qua controller hiện có; không sửa AnimationController/SpriteRenderer dùng chung hoặc chạy lại ImageGen/normalization.

Mỗi renderer orb/nổ dùng texture clone sở hữu riêng từ sheet tải một lần; charge dùng clone riêng tái sử dụng. Load lỗi/dispose lúc tải sẽ thu các texture tới muộn, không đụng sprite đi/chạy/leo. Đã viết kiểm tra lifecycle cho các trường hợp này nhưng chưa chạy.

## File thay đổi

- src/entities/PlayerSpecialSkill01.ts: load/cast/charge/cooldown/flight/nearest-solid impact/explosion/lifecycle; src/config/special-01.generated.json.
- src/entities/Player.ts: action mới, gate loại trừ combo/phi tiêu, chọn visual và reset/respawn/dispose; src/core/Game.ts: world, load, E theo edge, render effects và trạng thái cooldown, dọn khi dừng/mất focus.
- src/input/InputManager.ts: E specialSkill1, F climb; src/debug/DebugOverlay.ts, src/rendering/Renderer.ts và index.html: thông tin/hướng dẫn E/F.
- Generator/runtime-plan và public/assets/characters/ninja/skills/special-01/{cast.png,cast.json,orb.png,orb.json,explosion.png,explosion.json,manifest.json}.
- tests/PlayerSpecialSkill01.test.ts: ảnh/timing/pivot, cooldown và huỷ, hai hướng, nearest solid/muzzle, nội suy/world/cleanup, gate và texture lifecycle. InputManager/MovementInput/FallRecovery/SpriteSheetLoader tests cập nhật mapping/reset/fallback. Không thay kỳ vọng physics/movement để hợp code mới.
- Docs trạng thái/decision/contract và báo cáo art có chú thích đường dẫn runtime mới; giữ provenance/bằng chứng art lịch sử, kể cả nội dung kế hoạch Q trước khi người dùng đổi sang E.

## Kiểm tra và còn mở

Đã đọc source/metadata/diff, rà luồng input, ownership texture và các consumer visual trước khi sửa. **NOT_RUN:** toàn bộ test/build/typecheck/lint/formatter, trình duyệt/gameplay/console và ảnh runtime. Không lấy test được viết hoặc ảnh preview art cũ làm bằng chứng tích hợp đã chạy đúng.

Cần review: E/F không đụng nhau khi đứng cạnh/trên thang; giữ E và nhấn lại khi hồi; chạy/đổi hướng; ngắt trước/sau frame360ms; collider mỏng và vật cản sát tay; nearest hit hai chiều; cỡ/căn orb/nổ, resize/help cooldown; blur/đổi tab/respawn; combo/phi tiêu và các level cũ. Chưa tuyên bố nghiệm thu production. Damage/quái/AOE combat sẽ chốt ở bước tiếp theo.
