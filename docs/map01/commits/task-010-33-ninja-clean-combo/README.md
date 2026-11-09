# Task10.33 — Ninja Hỏa: combo sạch khung, nối theo đà

[Preview](preview.html) · [Atlas16pose](combo-atlas.png) · [Plan](../../../../integration/ninja-combo-separated/combo-plan.json) · [Nguồn/prompt](../../../../integration/ninja-combo-separated/PROMPTS.md) · [Hash](provenance.json).

## Phạm vi tiếp nối

Tiếp tục yêu cầu cuối trong cuộc trò chuyện được chia sẻ: sửa pose4 “Theo đà ngang” và pose5 “Thu về guard” lỗi ảnh, vẽ lại chuỗi combo mạnh và liền mạch theo động tác tham khảo. Giữ thiết kế Ninja Hỏa, kiếm cán vàng/lưỡi lửa và chất lửa đỏ/cam/lõi trắng vàng; không sao thiết kế nhân vật từ ảnh tham khảo. Baseline HEAD3098f98, nhánh `codex/task-010-enemy-art`; giữ nguyên các thay đổi chưa commit từ các task trước.

## Kết quả art và preview

- Vẽ mới16pose, phối hợp một/hai tay theo động tác: ngang → ngược lên → bổ chéo. Pose4 theo đà thấp và pose5 thu kiếm có cơ thể/kiếm riêng đầy đủ; không còn lấy mảnh sát mép của candidate cũ.
- Nguồn4×4 có khoảng trống giữa ô. Kiểm tra alpha tại biên từng ô nguồn: cả16ô không có pixel alpha>32 chạm biên. Không dùng cách giữ duy nhất connected-component vì có thể xoá ember/VFX hợp lệ.
- Atlas2048², ô512²/pivot(192,353)/160px-unit. Một scale230/176 cho toàn bộ16pose, căn chân bằng mốc nguồn tường minh; không phóng từng frame để fit toàn bộ VFX. Guard hạ gối230px so với Idle251px, không tăng kích thước cơ thể theo vòng lửa.
- Đường nối dùng đà cuối đòn1 sang nạp đòn2, đà cao đòn2 sang nạp đòn3. Đường đánh đơn có pose thu về guard riêng. Không chèn guard vào giữa hai đòn đang nối.
- Preview có một đòn/cả chuỗi/tự click, tua/frame trước–sau, tốc độ1×/0,5×/0,25×,16nút chọn pose và hai nút xem riêng pose4/5.
- Chỉ giữ một đòn chờ trong cửa sổ nối; click khi thu/hồi bị bỏ qua, giữ chuột không lặp đòn. Ghi đòn chờ không đổi frame hiện tại.

| Đường phát | Thời gian preview1× |
| --- | --- |
| Đòn1:405ms + thu155ms + nghỉ220ms | 780ms |
| Đòn2:395ms + thu165ms + nghỉ220ms | 780ms |
| Đòn3:730ms + nghỉ320ms | 1050ms |
| Combo:405+395+730+320ms, không thu guard giữa đòn | 1850ms |

Thông số là đề xuất art review, chưa được chốt gameplay. Quỹ đạo lửa được vẽ lại theo pose mới dựa thiết kế đã duyệt, không tuyên bố giữ nguyên từng pixel VFX cũ.

## File và cách sinh lại

Source/prompt/reference/plan/preview authoring: `integration/ninja-combo-separated/`. Generator mới `scripts/prepare_ninja_clean_combo.ps1` ghi đúng thư mục task này; bản10.32 và các snapshot cũ giữ nguyên. Generator sao chép ảnh kiếm gốc để đối chiếu, ghi JSON/JS và provenance/hash. Không sửa generator của những candidate cũ.

Thư viện `docs/characters/ninja/animation/` chỉ thêm liên kết trạng thái candidate trong README; ảnh, metadata và preview production không bị thay bởi task này. `public/assets/`, runtime combat, input, physics và các nhân vật khác không sửa. Các thay đổi production đang có từ task trước được giữ nguyên, không coi là sửa của10.33.

## Đã xem và giới hạn

Đã đọc yêu cầu cuối trong link, quy tắc repo, source/metadata/preview cũ, xem atlas attack1/3, Idle, ảnh động tác và atlas review mới sau đóng gói. Đã đo mốc chân nguồn để authoring, đối chiếu khoảng trống tại biên ô nguồn. Đã chạy generator ghi candidate.

**Chưa xác nhận chuyển động trực tiếp trong trình duyệt.** Preview HTTP đã khởi động tại `http://127.0.0.1:5180/docs/map01/commits/task-010-33-ninja-clean-combo/preview.html`, nhưng IAB không kết nối được địa chỉ cục bộ. Chrome hiện có đang thu nhỏ; công cụ không lấy được trạng thái sau một lần thử khôi phục. Không dùng ảnh source/atlas làm bằng chứng đã chơi preview. Có thể mở preview.html trực tiếp vì JS/PNG đều nằm cạnh trang và không dùng fetch.

Test/build/lint/typecheck/formatter **NOT_RUN** theo giới hạn hiện hành. Click nối thực tế, cảm nhận chuyển động, anatomy chi tiết và độ dài/đẹp của vệt lửa chờ người dùng review. Chưa publish art mới, chưa áp vào game, chưa commit/merge/push.
