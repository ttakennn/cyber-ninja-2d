# Task 10.20 — chỉnh nhịp Song Đao Liên Trảm

[Xem preview](preview.html) · [8 frame đầu](combo-a-contact.png) · [8 frame cuối](combo-b-contact.png).

Theo phản hồi của người dùng, nhát thứ hai đổi thành vệt chém ngược hướng, nhát quét thấp dẫn sang tư thế trụ chân lấy đà, Khan lao người ra trước để hai đao tạo dấu X rồi thu người về thế chiến đấu. Cú X là nhát mạnh nhất **về hình ảnh**: lõi trắng đỏ sáng hơn và giữ thêm một nhịp. Sát thương, hitbox và hiệu ứng gameplay chưa được quyết định.

Candidate 16 frame/1,35 giây dùng hai sheet 4×2, mỗi frame review 512×512, pivot (256,456), 160 px/world unit, cùng chính sách một scale mỗi sheet và chiều cao tham chiếu 376,5px. `offsetX` ở các frame cuối chỉ minh họa quãng lao tới trong preview, không là số liệu AI/gameplay. [Plan, nguồn ảnh và prompt](../../../../integration/task-010-boss-khan/combo-revision/animation-plan.json) giữ các lần tạo và hash. FX X phụ tái dùng từ màn xuất hiện đã duyệt. Snapshot Task10.19 giữ nguyên để đối chiếu.

Đã xem hai bảng 8 frame sau khi sinh candidate. Chưa xem preview trong trình duyệt hoặc chạy trong game; chưa làm test/build/lint/typecheck/formatter theo hướng dẫn hiện hành. Chưa đưa combo này vào thư viện art production hoặc runtime, đang chờ người dùng duyệt.
