# Huyết Ảnh Loạn Đao — art đã chốt

Người dùng chốt [Task10.24](../../../../map01/commits/task-010-24-boss-khan-blood-mirage/README.md) không cần sửa. [Xem preview production](preview.html), [ảo ảnh](phantoms-contact.png), [cú quét Boss thật](finisher-contact.png), [metadata](atlas.json). Hai PNG trong `sheets/` sao chép nguyên byte từ candidate được duyệt; JSON chỉ đổi đường dẫn ảnh theo thư viện. Ô512×512, pivot(256,456), scale chung từng sheet, tham chiếu160px/world unit và hash ở `../production.json`. Nguồn/prompt/plan nằm tại `integration/task-010-boss-khan/skill2-blood-mirage/`.

Đây là bản **art production**, chưa tích hợp Boss, AI, hitbox hoặc damage. Nhịp 2,05 giây/quỹ đạo ba ảo ảnh trong preview không phải thông số gameplay đã chốt. Test/build/browser NOT_RUN trong lượt publish.
