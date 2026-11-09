# Task10.34 — Review các nhóm attack tham khảo và Ninja Hỏa hiện tại

Ngày:2026-11-08. Phạm vi: phân tích ảnh người dùng gửi, dịch tiêu đề động tác và đối chiếu source hiện tại. Chỉ thêm báo cáo này; không sửa artwork, plan, gameplay hoặc chốt phương án mới. Không chạy test/build/lint/typecheck/formatter hay nghiệm thu trình duyệt.

## Nguồn và giới hạn

Người dùng gửi các ảnh cắt có nhãn Ground Attacks, Crouching Slash, Dodge Attacks, Hanging Attack, Wall Attack, cùng sheet tổng của Kenji Mozu. Review dựa trên các ảnh đính kèm, không dựa trên việc chạy game tham khảo. Không có clip/FPS/frame order/hitbox từ game tham khảo, nên không khẳng định timing, damage, bất tử, nhánh nâng cấp hoặc thứ tự nối mọi cụm. Cung trắng và cung cyan/tím có hình ảnh khác nhau; chưa đủ thông tin để gán cơ chế gameplay cụ thể.

Đối chiếu Ninja Hỏa: atlas attack1/2/3 đã xem, manifest `public/assets/characters/ninja/attacks/manifest.json`, `integration/task-009-player-attacks/combo-plan.json`, `src/entities/PlayerAttack.ts`, điều kiện canAttack/requestAttack trong `src/entities/Player.ts`, và candidate `integration/ninja-combo-separated/combo-plan.json`/atlas Task10.33 đã xem ở lượt trước. Đây là đọc source/ảnh, không phải xác nhận cảm giác chuyển động bằng cách chơi.

## Dịch và review từng mục

| Nhãn gốc | Tiếng Việt | Nguyên tắc quan sát |
| --- | --- | --- |
| Ground Attacks | Các đòn đánh trên mặt đất | Lực xuất phát từ thế chân, xoay hông/vai; nhiều hướng chém và tư thế vươn/thu. |
| Crouching Slash | Chém khi cúi / chém thấp | Giữ trọng tâm thấp, kiếm quét thấp; cần artwork riêng phù hợp tư thế cúi. |
| Dodge Attacks | Các đòn đánh kết hợp né/lướt | Thân nghiêng, chân đạp, tay/kiếm vươn theo hướng lao; smear và vệt dài làm rõ tốc độ. |
| Hanging Attack | Đòn đánh khi treo bám | Tay bám là mốc cơ thể, phần thân dưới vung theo lực chém, tay còn lại sử dụng kiếm. |
| Wall Attack | Đòn đánh khi bám/rời tường | Chân co/đạp, thân xoay/nghiêng; đòn cần quan hệ rõ với vị trí tường và hướng rời. |

### Ground Attacks

Nhiều pose có chuyển động thân/chân khác nhau, không chỉ thay vị trí tay kiếm. Hình dạng cơ thể phân biệt lấy đà, vươn chém và theo đà. Tay không cầm kiếm hỗ trợ cân bằng; việc dùng một/hai tay phụ thuộc nhát đánh, không nên ép một quy tắc cho mọi pose. Cung chém có đầu mũi rõ, thân mở rộng và đuôi thu, cho phép đọc đường kiếm. Các cụm có thể là nhiều clip/biến thể; không coi toàn bộ sheet này là một combo liên tục hoặc suy số hit từ số cung.

So với Ninja Hỏa: runtime đã có ba clip5/5/7frame được chọn, nhưng khối người và thế chân còn khá giống nhau giữa nhiều pose. Các atlas cũ có lửa lớn, đẹp và rõ bản sắc; độ liên kết cơ thể/kiếm giữa các đòn cần cải thiện. Candidate10.33 đã định nghĩa ngang→ngược lên→bổ chéo và đường nối riêng, nhưng độ xoay hông/vai, chuyển trọng tâm và pose hãm lực còn dè dặt so với tham khảo. Không coi16pose là số lượng tối ưu cố định; đánh giá các mốc chuyển động trước khi quyết định số frame bổ sung.

### Crouching Slash

Nhân vật giữ đầu/hông thấp, chân gập và thân nghiêng để tạo lực quét; vệt kiếm nằm thấp hơn bản đứng. Chuyển động cần khởi đầu từ tư thế cúi, chém, theo đà rồi về cúi. Không chỉ giảm chiều cao hoặc kéo toàn sprite đứng xuống; cách đó làm giải phẫu và điểm tiếp đất sai. Ảnh không chứng minh hurtbox được thu nhỏ hay tự động né được đòn.

Ninja Hỏa có cúi và phóng phi tiêu khi cúi, nhưng canAttack chỉ cho phép grounded+standing+không climbing. Vì vậy chưa có chém kiếm khi cúi trong runtime; candidate10.33 cũng chỉ là chuỗi đứng trên mặt đất. Nếu làm sau cần clip riêng và quyết định gameplay riêng; chưa được giao triển khai trong lượt review.

### Dodge Attacks

Cụm pose cho thấy thân kéo dài theo hướng tấn công, chân sau đạp và tay/kiếm vươn. Các frame nhoè kéo ngang (smear) nối giữa pose rõ trước/sau giúp biểu đạt bứt tốc. Hiệu ứng dài phía trước tạo cảm giác đòn lao khác với cung chém tại chỗ. Chưa thể xác định chính xác root displacement, khoảng cách, né vô địch hoặc damage chỉ từ sheet. Chuyển hình vẽ và dịch collider trong world là hai dữ liệu riêng.

Ninja Hỏa hiện chưa có nhánh dodge-attack riêng trong PlayerAttack; không suy việc đánh được khi đang di chuyển thành cơ chế lướt chém. Candidate10.33 không có quỹ đạo lướt/collider lướt. Có thể học động tác chân đạp, trọng tâm tiến và smear cho cảm giác nhanh; nếu muốn lao thật cần giao riêng khoảng cách/tốc độ/va chạm/ngắt hành động. Không tự gắn khả năng né bất tử.

### Hanging Attack

Một tay vươn lên làm mốc treo, tay còn lại chém; thân/hông/chân vung theo lực. Tay bám cần ổn định tại điểm bám trong những pose còn treo, đồng thời thân có thể xoay. Không neo mọi thứ theo bàn chân như đòn đứng. Không khẳng định nhân vật bám suốt mọi frame nếu thiếu timeline.

Ninja Hỏa hiện có leo thang, chưa có clip treo bám/chém khi treo tương ứng; canAttack loại climbing. Leo thang nhìn từ sau khác tư thế treo một tay trong ảnh. Nếu bổ sung, cần state và mốc bám riêng, không dùng lại pose đứng bằng cách nâng lên.

### Wall Attack

Pose có chân co/đạp và thân nghiêng ngang làm rõ tương tác với tường; đường kiếm quét theo hướng người xoay/rời điểm bám. Khi còn bám cần điểm tiếp xúc rõ; khi bật ra cần quỹ đạo chuyển tiếp liên tục. Không giữ chân cố định ở tường trong toàn clip nếu đoạn sau đã là rời tường. Ảnh chưa đủ xác định lúc nào collision/state đổi.

Ninja Hỏa chưa có nhánh wall-attack trong PlayerAttack, canAttack chỉ cho đứng trên mặt đất. Nếu bổ sung, cần artwork và chuyển state riêng; không quay/lật toàn sprite đứng để giả thế tường. Artwork được review chưa cấp phép triển khai cơ chế tường.

## Bài học về art

- Key pose có silhouette khác nhau: nạp lực, vươn chém, theo đà, hãm lực. Hông/vai/chân tham gia, không giữ nguyên thân rồi xoay kiếm.
- Giữ tỷ lệ đầu/thân ở các pose rõ. Chiều cao nhìn thấy có thể thay đổi tự nhiên khi cúi, nghiêng hoặc xoay; không fit toàn nhân vật theo bbox lửa.
- Duy trì liên tục bàn tay–cán–lưỡi kiếm. Cung VFX thể hiện quỹ đạo đã quét qua, vị trí đầu sáng/đuôi phù hợp chiều chém.
- Có ít VFX ở chuẩn bị/thu thế, lớn tại đoạn chém mạnh rồi tan. Đòn cuối có pose và silhouette riêng, không chỉ tăng kích thước cùng một vòng lửa.
- Frame smear là biến dạng chủ đích dùng rất ngắn, khác lỗi anatomy ở pose giữ. Không lấy smear làm mốc scale của key pose.
- Cung lửa nhìn thấy không tự xác định hitbox, số hit hoặc thời gian gây sát thương.

## Logic game hiện tại và candidate10.33

| Nội dung | Runtime hiện tại | Preview10.33 |
| --- | --- | --- |
| Clip kiếm | attack1/2/3;5/5/7frame được chọn |16pose chung; ba đòn có đường thu riêng |
| Tư thế | Grounded, standing, không climbing | Minh hoạ combo đứng, không tích hợp game |
| Xếp đòn chờ | Tối đa2 | Tối đa1 trong cửa sổ nối |
| Sau đòn3 | lastRequested tăng modulo3, có thể tiếp tục1 nếu nhận click/queue | Nghỉ bắt buộc320ms |
| Nghỉ sớm | Không có state recovery riêng trong PlayerAttack | Thu guard rồi nghỉ220ms |
| Reset0,5s | Khoảng cách giữa các click làm reset chuỗi; không phải cooldown sau combo | Quy tắc hồi/cửa sổ nối riêng |
| Damage | Manifest ghi NOT_IMPLEMENTED | Chỉ review art/timing, chưa damage |

Kết luận từ source: runtime chưa có cơ chế chống spam theo thiết kế mới; chưa thể nói game đã được nghỉ320ms vì preview có. Khi yêu cầu tích hợp sau này cần chuyển timing/cửa sổ nối/recovery vào state runtime bằng task riêng, giữ collider/input/physics ngoài phạm vi nếu không được giao đổi.

## Định hướng đề xuất, chưa chốt

Ưu tiên hoàn thiện Ground Attacks trước: vẽ key pose và đường đi kiếm rõ cho ngang→ngược lên→bổ chéo; cuối đòn1 sẵn cho đòn2, cuối đòn2 sẵn cho đòn3; chỉ thu guard khi dừng hoặc kết chuỗi. Giữ thiết kế Ninja Hỏa, cán vàng/kiếm lửa và palette/chất lửa cũ, thay quỹ đạo VFX theo chuyển động mới. Sau khi duyệt art mới quyết định tích hợp timing/recovery; crouching/dodge/hanging/wall là các nhánh riêng để người dùng chọn sau. Không tự mở rộng phạm vi.
