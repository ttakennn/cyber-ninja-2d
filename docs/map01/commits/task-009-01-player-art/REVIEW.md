# Task09.1 — review artwork attack nhân vật hoả

Cập nhật: người dùng đã duyệt combo và canvas đệm, yêu cầu commit ảnh hiện tại rồi tích hợp. Trạng thái candidate bên dưới là hồ sơ tại thời điểm review, không phải đang chờ duyệt nữa. Phần triển khai tiếp theo dùng click trái, chuỗi1→2→3 và reset sau khoảng nghỉ0.5s theo yêu cầu mới; không nhập damageLogic của nguồn.

Trạng thái: **CANDIDATE_NOT_APPROVED**, chưa thay runtime. Nhánh codex/task-009-player-attack-art từ a26fcd3. Nguồn người dùng ở C:/Users/anhthaitrong/Downloads/Games/docs/Character/red-ninja/attacks, đã sao nguyên sáu tệp vào integration/task-009-player-attacks/source/ để giữ provenance. Không sửa nguồn ngoài repo.

## Kết quả review

| Sheet | Nguồn | Nhận xét |
| --- | --- | --- |
| attack_1 | 2304×1024, 3×2 ô768×512, 6 frame | Chém quét ngang có chuẩn bị/đòn chính/thu kiếm; dáng thấp hơn idle là do khuỵu gối, không nên fit chiều cao cả bbox thành idle |
| attack_2 | 3072×1024, 4×2 ô, 7 frame | Hất kiếm từ thấp lên cao; frame đầu crouch sâu, hiệu ứng vươn cao. Chơi toàn bộ ngay sau recovery attack1 làm đổi tư thế mạnh |
| attack_3 | 3072×1024, 4×2 ô, 8 frame | Cơ thể/mặt lớn hơn hai bộ đầu, có trang trí vàng khác; tên nguồn “spinning” nhưng hình không mô tả đủ xoay360°. Dùng mô tả chém vòng và bổ xuống thay vì hứa xoay360° |

Metadata nguồn không khớp hết pixel thật: attack1 frame0 khai contentBounds [200,196,514,444], trong khi đo alpha≥16 là [187,211,564,503]. Pivot nguồn chuẩn hoá tương đương(350,440), cao hơn chân thật khoảng60px ở frame đầu. Không dùng trực tiếp để tích hợp.

Các field damagePulseTimesMs/damageLogic/attackDurationMs là dữ liệu của nguồn khác (có Game.updateHero/slashPulse), không phải chỉ dẫn triển khai, không phải quyết định damage/hitbox của Cyber Ninja hiện tại. Bản candidate metadata chỉ giữ dữ liệu hình/clip. Tổng300ms mỗi sheet được giữ làm tốc độ preview tham chiếu, chưa chốt nhịp combat; rounding durationMs của sheet2 cũng không nên được sao mù quáng.

## Đã xử lý

- Attack1/2 giữ artwork người dùng, chuẩn hoá đồng nhất trong từng clip với hệ số0.625. Attack3 có bản sửa danh tính bằng image_gen.imagegen built-in, source riêng attack-3-identity-candidate.png, chuẩn hoá hệ số0.5 sau đưa grid về kích thước nguồn. Tham chiếu canonical flame-ninja-atlas.png và ba sheet gốc.
- Chọn hệ số theo đối chiếu phần đầu/thân (đầu nguồn khoảng70–90px so với đầu canonical khoảng40–45px), không theo tổng bbox lửa. Đây là hiệu chỉnh art có chủ đích để review, chưa phải khẳng định mọi frame đã trùng tỉ lệ giải phẫu hoàn hảo. Không fit từng frame độc lập, không recolor bản1/2.
- Căn điểm tiếp đất/root theo pixel phần chân tối, bỏ vùng lửa sáng. Crouch đầu attack2 giới hạn vùng đo để tránh lấy bàn tay chạm đất làm chân. Finisher bị lửa che chân dùng mốc root thủ công theo từng frame. Đây là translation artwork, không phải root motion gameplay; vẫn cần xem hiện tượng trượt chân khi phát liên tục.
- Bản ImageGen attack3 có vệt lửa sót ở64 cột trái ô cuối: bỏ riêng dải rỗng bên ngoài nhân vật đó khi đóng gói. Source đã tạo giữ nguyên, bước xử lý ghi trong script.
- Canvas candidate mỗi ô **512×512**, pivot **(192,353)**, visual **3.2×3.2**, scale(1,1): vẫn0.00625 world/px như ninja hiện tại. Thêm64px khoảng đệm trên pivot so với ô cũ, không thay contract384×320/(192,289) của các clip hiện có. Khoảng trống bổ sung cho hiệu ứng, không phóng nhân vật. Đây là đề xuất atlas attack riêng cần duyệt, không được âm thầm repack atlas canonical.
- Xuất riêng ba atlas/JSON tại integration/task-009-player-attacks/candidate/. JSON theo schema loader hiện tại; kind=production là enum kỹ thuật, **không phải nhãn đã nghiệm thu**. Chưa sửa animations.json hoặc load những file này trong game.
- Script tái tạo: scripts/prepare_ninja_attacks.ps1 (PowerShell5/System.Drawing). normalization-report.json lưu đo đạc, hệ số/mốc và hash. [Prompt attack3](../../../../integration/task-009-player-attacks/attack-3-prompt.md) dùng built-in, không CLI.

## Preview và nhịp combo

Mở [preview.html](preview.html) trực tiếp: ba đòn đầy đủ hoặc combo đề xuất, điều tốc0.25/0.5/1×, dừng/tiến/lùi từng frame, chồng idle tại cùng pixel scale. Không cần build/dependency. Đây là công cụ review ảnh, chưa mở/chạy trong trình duyệt ở lượt này.

Combo đề xuất dùng frame0-based: attack1 [0,1,2,3,4] → attack2 [1,2,3,4,5] → attack3 [1,2,3,4,5,6,7]. Bỏ phần thu kiếm/chuẩn bị sâu giữa đòn, không đảo thứ tự swing, không dùng alpha crossfade để che khớp sai. Đây chỉ là lựa chọn cắt hình trong preview, không phải cửa sổ cancel hay damage cuối cùng.

- [So nguồn với idle](source-scale-review.png): các attack giảm đều0.5 chỉ để xem nguồn, không phải tỉ lệ candidate.
- [So candidate với idle](candidate-scale-review.png): vẽ1 pixel=1 pixel, cùng đường chân cyan; attack có dáng thấp vì chùng gối. Khác chiều cao silhouette không tự đồng nghĩa cơ thể bị thu nhỏ.
- Cần duyệt tiếp: cảm nhận kích thước đầu/thân, tay cầm kiếm/cổ tay ở từng điểm đổi hướng, đường đi lửa, mối nối1→2 và2→3, frame xoáy finisher và thu kiếm về idle. Chưa có frame rút/tra kiếm trung gian hoàn chỉnh, chưa khẳng định chuyển động mượt tuyệt đối hoặc đúng kỹ thuật võ thực tế. Nếu người dùng không muốn cắt recovery hoặc cần xoay360°, cần bổ sung artwork riêng trước gameplay.

## Giới hạn và bước kế tiếp

Đã xem3 sheet gốc, metadata, ảnh canonical và3 candidate; đã chạy script **authoring ảnh** có guard không cắt hiệu ứng. Hai lần authoring ban đầu dừng vì canvas thiếu chỗ cho lửa và tâm chân finisher bị che; đã mở padding và ghi root trước khi xuất thành công. Không có PNG runtime nào bị thay đổi.

**NOT_RUN:** toàn bộ test/build/lint/typecheck/formatter, trình duyệt preview, chơi game/combo/hit detection. Không có enemy, boss, skill projectile, damage, cooldown, hitbox hoặc phím attack mới.

Người dùng review ảnh + padding/scale và chốt. Khi chốt mới promote bộ được chọn vào public/assets/characters/ninja/attacks/ và thực hiện09.2 theo thiết kế input/combat riêng. Chưa tự chốt art, chưa merge master, chưa tự ghi ảnh này là production.
