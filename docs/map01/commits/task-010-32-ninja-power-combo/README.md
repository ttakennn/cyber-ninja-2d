# Task 10.32 — combo phối hợp một/hai tay, mở thế và tạo lực

[Preview](preview.html) · [Atlas16pose](combo-atlas.png) · [Nguồn/prompt](../../../../integration/ninja-combo-power/PROMPTS.md) · [Plan](../../../../integration/ninja-combo-power/combo-plan.json).

## Yêu cầu mới

Người dùng đưa video https://www.youtube.com/watch?v=1gfD8P0iSHM (Ninja Gaiden: Ragebound Review) và muốn cách đánh mạnh hơn, có thể phối hợp hai tay thay vì bắt buộc một tay. Đã mở trang IGN trên YouTube, phát và thấy một số đoạn gameplay; có quảng cáo xen kẽ, chưa xem/phân tích hết11:37. Không khẳng định đo chính xác timing/cách cầm kiếm của game từ video. Thiết kế dưới đây là phương án riêng dựa brief; không sao sprite hoặc nhân vật tham chiếu.

## Art và nhịp preview

- Đòn1 mở bằng chém ngang một tay, tay kia phản lực tự do.
- Đòn2 đưa tay còn lại vào cán ở thấp, kéo hai tay vươn ra trước theo đường chém ngược lên.
- Đòn3 nạp kiếm hai tay trên đầu, hông xoay và hai tay bổ chéo xa về trước; chân trụ hãm lực rồi thu về guard. Tránh nắm hai tay khép sát ngực.
- Giữ thiết kế kiếm Hỏa cán vàng, lưỡi đỏ/cam lõi trắng vàng và vòng lửa lớn nhiều lớp theo ba atlas đã duyệt; bản copy reference/ giữ nguyên để đối chiếu. Candidate tái tạo pose/quỹ đạo, không tuyên bố trùng pixel VFX gốc.
- Dùng16pose chung. Plan thêm chainFrames để đòn1 kết ở tư thế nạp đòn2, đòn2 kết ở tư thế nạp đòn3. Chỉ đường đánh đơn/dừng chuỗi quay về guard; không bắt nhân vật nghỉ lại mỗi đòn khi đang nối.
- Giữ540/560/760ms, full1860ms, hồi220ms khi dừng sớm/320ms sau đòn3. Tối đa1đòn chờ, bỏ click trong hồi, giữ chuột không tự đánh. Các giá trị vẫn là đề xuất, chưa chốt gameplay.

## Tỷ lệ và xuất bản

Ô512²/pivot192,353/160px-unit giữ như attack hiện hành. Một scale toàn16pose; mốc body guard0 dựa đầu/chân, không dựa đuôi lửa hoặc fit bbox từng frame. Hàng nguồn được căn mặt đất bằng mốc thủ công trong sourceRowGround. Có Idle nguyên bản và mốc251px trong preview; guard hơi hạ trọng tâm230px, không thay chiều cao chuẩn của Ninja.

Generator: scripts/prepare_ninja_combo_revision.ps1 -PlanPath integration/ninja-combo-power/combo-plan.json. Task10.30/31 giữ lịch sử. Thư viện production/runtime và animation khác không thay; rules cập nhật rằng một/hai tay được phối hợp tùy đòn theo chỉ dẫn mới.

## Đã kiểm tra và phần chưa kiểm tra

Đã đọc plan/preview liên quan, xem ảnh nguồn và atlas sau chuẩn hóa; đã sửa đường nối để không reset guard giữa chuỗi. Đã mở video nguồn và xem một số đoạn qua IAB. Chưa thao tác bản preview mới trong trình duyệt hoặc thử click thực tế; anatomy, độ mượt và VFX của ảnh sinh cần người dùng review trước publish. Test/build/lint/typecheck/formatter NOT_RUN. Chưa commit hoặc tích hợp vào game.
