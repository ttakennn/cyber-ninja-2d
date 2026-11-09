# Nguồn sửa tay và hai nhịp vào thế — Task10.51

[Preview](../../docs/map01/commits/task-010-51-ninja-combat-grip-entry/preview.html), [báo cáo](../../docs/map01/commits/task-010-51-ninja-combat-grip-entry/README.md). Trạng thái CANDIDATE_PENDING_REVIEW.

Input nền là atlas10.50 đã được người dùng xác nhận không còn ảnh dư. grip-source.png sửa chiều bàn tay phải; chỉ vùng28×27px được dùng vào sáu frame50, các pixel khác giữ nguyên. entry-source.png cung cấp hai nhịp Nâng tay vào kiếm/Đưa tay về chuôi kiếm theo pose49 và tạo hình50. Reference50 được composite trên nền tối để đọc đúng alpha; ảnh49 chỉ tham khảo động tác, không làm nguồn thay body.

Nguồn hình/prompt/plan lưu ở đây; scripts/prepare_ninja_combat_grip_entry.ps1 xuất8frame4×2, ô384×320/pivot192,289. Nguồn/generator/preview đều ghi reviewDirectory mới, không sửa atlas50 hoặc production47. Timing vào thế100+100ms, sau đó sáu frame thở140ms/frame. Chưa publish/runtime/commit.
