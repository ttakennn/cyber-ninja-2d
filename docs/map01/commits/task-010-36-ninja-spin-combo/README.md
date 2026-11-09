# Task10.36 — xoay người chém và vòng sáng từ đòn2

[Preview](preview.html) · [Ảnh đối chiếu](spin-review.png) · [Body22pose](body-atlas.png) · [Vòng8frame](combo-ring-atlas.png) · [Nguồn/prompt](../../../../integration/ninja-spin-combo/README.md) · [Plan](../../../../integration/ninja-spin-combo/plan.json) · [Hash](provenance.json).

## Thay đổi theo phản hồi

Người dùng chưa thấy chuyển động xoay như ảnh minh hoạ, yêu cầu kết hợp/vẽ lại và thêm vòng sáng nhẹ quanh người khi thực hiện combo từ đòn2 trở lên. Không suy thêm cơ chế tăng sức mạnh, lá chắn hoặc damage.

- Giữ slot0..5 của10.35 bằng copy ARGB không resample: đòn1/guard và đường thu cũ.
- Vẽ16pose mới cho đòn2/3: lưng3/4→quay lưng→nghiêng trái→mở ngực→về hướng đánh; có chân trụ/đổi thế, scarf/bao kiếm theo hướng thân. Không dùng lật hoặc xoay bitmap của pose đứng để giả chuyển động. Tính liên tục/anatomy cuối cùng chờ người dùng duyệt.
- Đòn2 là xoay người chém ngang. Đường nối lên đòn3 có pose đưa kiếm lên riêng; đường dừng sớm thu về guard. Đòn3 xoay người rồi bổ chéo, hãm lực và thu.
- Vòng8frame riêng: mở→duy trì nét mỏng→tan, palette vàng/amber/cam. Mặc định32%, chia nửa trước/sau body trong render; có checkbox/slider độ rõ. Tắt cả vòng khi chọn Chỉ cơ thể/kiếm.
- Trong tự thử, vòng chỉ bắt đầu khi thực sự chuyển sang đòn2, chưa bật chỉ vì vừa xếp đòn chờ; giữ qua đòn3 và tan trong hồi thế. Đòn1 luôn không có vòng. Xem riêng đòn2/3 cho vòng hiện để duyệt art.
- Cung lửa dài vẫn ở atlas riêng; PNG giữ từ10.35. Preview hiển thị8frame FX đang dùng (ngang/bổ chéo); hàng chém lên cũ không tham gia combo mới.

## Preview và nhịp

Thêm **Xem xoay người · không VFX**, **Xem combo + vòng sáng**,22nút pose/8nút cung/8nút vòng. Giữ tua/frame trước–sau/tốc độ chậm, tự click/J, mô phỏng click dồn, bảng quy tắc và slider hồi.

| Quy tắc | Giá trị đề xuất |
| --- | --- |
| Phần chính đòn1 | 450ms, giữ bản trước |
| Phần chính xoay đòn2 | 580ms |
| Đòn3 gồm thu về guard | 720ms |
| Nối1→2 | 160–410ms của đòn1 |
| Nối2→3 | 160–480ms của đòn2 |
| Đòn chờ | Tối đa1 trong cửa sổ nối |
| Hồi khi dừng sớm / sau đòn3 | 220ms / 320ms |
| Combo đủ gồm nghỉ cuối | 2070ms |
| Đòn1/2/3 xem đơn gồm nghỉ | 840ms / 890ms / 1040ms |

Click quá sớm/trễ/đang thu hoặc hồi bị bỏ qua; không tích vào combo sau, giữ chuột/J không tự lặp. Frame cuối đòn2 chỉ đổi sang pose nạp3 sau khi nhận nối; cửa sổ đóng trước frame rẽ nhánh để tránh đổi pose hiện tại. Đây vẫn là timing preview, chưa sửa PlayerAttack trong game.

## Kỹ thuật và file

Body atlas2048×3072,22slot512²/pivot192,353/160px-unit;0..5 giữ pixel bằng copy row ARGB.16pose mới dùng một scale1.23 và dịch chân theo plan, không scale riêng từng pose. Vòng atlas2048×1024/frame512²; source/hash/provenance ghi riêng. Source mới `integration/ninja-spin-combo/`, generator `scripts/prepare_ninja_spin_combo.ps1`; không sửa snapshot10.35 hoặc PNG/metadata production/src/public. TASK_STATUS và README thư viện chỉ thêm link trạng thái.

## Đã quan sát và giới hạn

Đã xem ảnh tham chiếu, body/vòng nguồn và ảnh ghép tĩnh `spin-review.png`: đòn1 không vòng, các pose lưng/nghiêng trái/đòn3 có vòng nhẹ. Đã đo mốc chân cho authoring; cả16ô body mới không có pixel alpha>32 chạm đường cắt. Generator đã ghi output thành công. Không dùng ảnh ghép tĩnh làm bằng chứng phát animation.

Đã mở đúng URL Task10.36 trong Chrome: trang/atlas/22pose tải được, demo tới2070/2070ms. Đã bấm **Xem xoay người · không VFX**, UI chuyển sang đòn2/body-only; tua tới170/890ms hiển thị **Quay lưng · kiếm theo hông**, screenshot cửa sổ thấy pose lưng trên canvas. Đây là xác nhận một thao tác phát/tua và pose giữa vòng xoay, chưa phải duyệt toàn chuyển động.

Chưa xác nhận đầy đủ vòng bật/tan qua toàn chuỗi, mọi frame và chống spam trực tiếp. Nút ghép vòng qua công cụ chưa được xác nhận đổi trạng thái; sau đó Chrome chuyển sang tab khác do người dùng đang sử dụng, đã dừng điều khiển và giữ tab preview để người dùng review. Chưa kiểm console/mọi viewport. Test/build/lint/typecheck/formatter **NOT_RUN**. Chưa chốt art/timing, chưa runtime/hitbox/damage/buff, chưa commit/merge/push.
