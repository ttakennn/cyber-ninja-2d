# Nguồn Idle chiến đấu Ninja Hoả — Task10.49

Trạng thái: **CANDIDATE_PENDING_REVIEW**. [Preview](../../docs/map01/commits/task-010-49-ninja-combat-idle/preview.html), [hồ sơ](../../docs/map01/commits/task-010-49-ninja-combat-idle/README.md).

Bám Idle10.47 đã duyệt, ảnh ninja xanh chỉ tham chiếu động tác. idle47-reference.png là bản sao nguyên byte1152×640. combat-master.png cung cấp hai tay tư thế sẵn sàng; combat-enter-source.png cung cấp hai pose chuyển tiếp được chọn trong plan.json. Prompt nguồn lưu riêng. Các ảnh guide toàn thân không phải atlas production; generator chỉ dùng vùng tay/vùng khuất và giữ pixel nguồn bên ngoài mask.

Author bằng scripts/prepare_ninja_combat_idle.ps1; đầu ra chỉ vào reviewDirectory của plan. Không có quyền publish vào production từ trạng thái candidate này. Bộ đóng gói giữ ô384×320/pivot192,289, 2frame vào thế và6frame thở chiến đấu. Chi tiết timing/nguồn/hash/giới hạn nằm trong hồ sơ snapshot.
