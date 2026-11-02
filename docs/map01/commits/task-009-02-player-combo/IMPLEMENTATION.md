# Task09.2 — áp dụng animation combo lên nhân vật

Nhánh codex/task-009-player-attack-art. Artwork được người dùng duyệt và commit1442907 trước khi tích hợp. Không merge master.

## Điều khiển đã chốt

- Click chuột trái trên canvas: đòn1. Mỗi click kế tiếp nối thêm đòn2, rồi3, rồi quay1 nếu còn click tiếp.
- Khoảng cách hai click ≥0.5s: lần click sau bắt đầu lại đòn1. Dùng timestamp pointer event, không dùng tổng delta đã clamp để quyết định mốc này.
- Không giữ chuột để tự đánh liên tục. Tối đa hai đòn đang chờ ngoài đòn hiện tại; click dư lúc buffer đầy chỉ duy trì mốc liên tục, không tích luỹ chuỗi vô hạn. Các đòn đã buffer hoàn tất theo thứ tự.
- Bản tích hợp này chỉ có đòn dưới đất khi đứng, vẫn cho phép chạy. Nhảy, crouch/headroom hoặc vào thang huỷ chuỗi để locomotion hiện có ưu tiên. Hướng vẽ khoá riêng từng đòn tại lúc click yêu cầu; không lật giữa swing. Đây là lựa chọn tích hợp giới hạn của đòn grounded, không phải thiết kế air attack đã được duyệt.
- Blur/tab ẩn/stop/respawn/dispose xoá buffer. Click trước khi load ảnh xong không được giữ để tự phát muộn. F3 hiển thị trạng thái/lỗi nạp attack.

## Asset và source

Ảnh public/assets/characters/ninja/attacks/attack_1..3.png được copy nguyên byte từ candidate đã duyệt. Metadata mỗi sheet được tạo bằng scripts/promote_ninja_attacks.mjs từ integration/task-009-player-attacks/combo-plan.json, chỉ giữ các frame đã duyệt ở preview:

1. attack_1: [0,1,2,3,4], fps20.
2. attack_2: [1,2,3,4,5], fps23.333333….
3. attack_3: [1,2,3,4,5,6,7], fps26.666666….

Không chỉnh pixel/repack atlas canonical. Sheet attack riêng dùng ô512×512, pivot(192,353), visual3.2×3.2; vẫn160px/world unit. SpriteRenderer hiện có dùng pivot nên padding không đẩy điểm chân. Manifest ghi source/plan/hash và phạm vi animation-only.

PlayerAttack sở hữu renderer/texture/controller riêng, nhận click trong fixed update, giải phóng tài nguyên khi tải lỗi hoặc dispose. PlayerAnimator locomotion tiếp tục chạy và sprite cũ được hiện lại khi combo dừng. Player.body/collider/physics/camera/timestep không đổi. Phần visual attack cũng đặt theo đáy collider nội suy như sprite thường.

Game thu pointerdown trái/primary trên canvas và chuyển request vào simulation step. Không đổi InputManager/key binding hiện có. HUD/aria-label cập nhật click combo. Không thực thi các damagePulseTimesMs/damageLogic trong JSON nguồn.

## Kiểm tra và giới hạn

Đã chạy generator **chế độ ghi** để đưa ảnh/JSON đã chọn vào public. Đã đọc source/diff và rà các consumer; chưa chạy game.

Thêm tests/PlayerAttack.test.ts cho thứ tự frame, mật độ/pivot, một click, buffer, hướng vẽ, ranh0.499/0.5/0.501s, quay3→1, huỷ chuỗi, không sửa body, lỗi/late texture và dispose. Điều chỉnh test placeholder để bỏ qua group attack ẩn. **Tất cả test vẫn NOT_RUN**, không có kết quả pass.

**NOT_RUN:** npm run test/build, lint, formatter, typecheck riêng, trình duyệt/console, bốn viewport, thao tác pointer trên Chrome/Edge. Chưa xác nhận thực tế độ mượt khi chạy/đổi hướng, hiệu ứng gần mép màn hình hoặc các chỗ nối combo. Cần người dùng chạy để review như các lượt artwork trước.

Chưa có damage, hitbox/hurtbox, knockback, energy/cooldown, kỹ năng riêng, enemy hoặc boss. MovementState/F3 Animation vẫn thể hiện locomotion; dòng Attack mới cho biết stage riêng. Phần combat logic cần thiết kế và task tiếp theo, không gọi animation này là hệ thống combat đã hoàn tất.
