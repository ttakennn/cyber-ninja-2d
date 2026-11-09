# Ninja Hỏa — combo sạch khung / Task10.33

Prompt gốc trong [PROMPT.txt](PROMPT.txt), PNG image_gen trả về trong [combo-source.png](combo-source.png), không chỉnh lại pixel ảnh nguồn. Đây là candidate, chưa được người dùng duyệt.

Tool: `image_gen.imagegen`, `transparent_background=true`, `num_last_images_to_include=5`. Đã thử gửi đường dẫn Windows nhưng tool từ chối định dạng đường dẫn; lần tạo thành công dùng năm ảnh vừa được xem trong hội thoại, theo thứ tự:

1. `reference/ground-combo-motion.png`: ảnh tham khảo người dùng đã cung cấp, chỉ tham khảo động tác; không lấy nhân vật/màu/kiếm.
2. `docs/map01/commits/task-010-32-ninja-power-combo/combo-atlas.png`: candidate cũ, dùng làm đối chiếu lỗi, không sao lỗi.
3. `docs/characters/ninja/animation/attacks/attack_1.png`: thiết kế nhân vật/kiếm/lửa gốc.
4. `docs/characters/ninja/animation/attacks/attack_3.png`: thiết kế nhân vật/kiếm/lửa gốc.
5. `integration/ninja-run-hurt-revision/idle-reference.png`: đối chiếu cơ thể.

Lần tạo thành công thêm nguyên văn đoạn sau vào cuối PROMPT.txt:

> The recent images in this conversation are the exact references. The montage with cropped neighboring fragments is the OLD DEFECTIVE candidate: use it ONLY to understand defects, never replicate these. Original attack1/attack3 and Idle lock visual design; ground-combo reference is only mechanics.

Nguồn thực tế 1254×1254 RGBA, grid4×4; yêu cầu 2048×2048 trong prompt là đề nghị, không phải kích thước nguồn thực tế. Atlas review được đóng gói thành 2048×2048, frame512×512/pivot192,353/160px-unit theo plan. Mọi pose dùng chung scale230/176; dịch tọa độ chân theo sourceGround khai báo, không fit/scale riêng từng pose, không xoá thành phần VFX hoặc vẽ thêm bằng code. Giữ nguyên các atlas được duyệt trong production/runtime.

Hash nguồn, prompt, ảnh động tác và atlas ở `docs/map01/commits/task-010-33-ninja-clean-combo/provenance.json`. Chạy script authoring: `powershell -File scripts/prepare_ninja_clean_combo.ps1`.
