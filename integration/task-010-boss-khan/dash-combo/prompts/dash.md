# Huyết Đao Khan — lướt nhanh trước combo

Tool: built-in `image_gen.imagegen` với nền trong suốt. Tham chiếu: run-contact.png và combo-b-contact.png đã duyệt trong docs/characters/boss-khan/animation/, cùng ảnh boss-khan-v1.png. Ba output gốc được giữ ở `source/`; ID cuối nằm trong `animation-plan.json`.

Prompt tạo: tám frame 4×2, Khan nhìn phải, giữ mặt nạ/mắt đỏ/áo trắng xám/quần than/đường đỏ/chi tiết cyan/hai đoản đao, cùng tỉ lệ và đường chân. Frame0 thủ, frame1 nén trọng tâm, frame2 chân sau bật và áo tung, frame3–4 lướt cực nhanh với vệt đỏ–cyan phía sau, frame5 hãm, frame6 đứng lên, frame7 về thế thủ để nối ngay sang combo. Vệt sau lưng mảnh, không che mặt, không xuyên ô atlas; không vẽ hiệu ứng trúng đòn.

Hai lần sửa: yêu cầu bỏ mảng đỏ lớn phía sau, chỉ giữ vài vệt sáng đỏ–cyan mảnh; sau đó giảm tiếp mảng khói/lửa sáng và giữ pose chân tay. Ảnh được chọn là `source/dash.png` (`exec-51b52dbb-3617-4ecc-9ee3-6cab8b47b8f6.png`). Vì hai pose lướt giữa hàng dưới vẫn vượt bề ngang ô source, plan chọn các pose 0,1,2,3,6,7; hiệu ứng bóng mờ chuyển động ngắn được minh hoạ ở preview. Không co giãn riêng pose hoặc cắt chân để ép ảnh vào ô.
