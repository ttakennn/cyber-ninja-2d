# Combo B — đẩy nhát X ra phía trước

Tool: built-in `image_gen.imagegen`, transparent background. Edit target: `combo-b-before.png`. Reference thứ hai: ảnh người dùng đánh dấu X đỏ ở bên phải khung `combo-b/5`. Bản đầu `combo-b-first.png` vươn tay đúng hướng nhưng vệt X tràn ô atlas; bản sửa `combo-b-forward-generated.png` thu gọn riêng đầu vệt sáng. `compose-selected-frames.ps1` lấy **chỉ frame 4–5** từ bản sửa, các frame 0–3 và 6–7 giữ nguyên byte pixel từ bản trước.

Prompt tạo lần đầu: Giữ danh tính Khan, hai đoản đao, trang phục trắng xám/đỏ/cyan, tỉ lệ và chân hình. Frame 4: chân sau trụ, chân trước bước xa hơn, hông xoay, thân đổ về phải, hai khuỷu tay kéo đao về sau lấy lực. Frame 5: chân sau đẩy, gối trước chống, vai và **cả hai cánh tay** duỗi mạnh về phía phải; hai lưỡi đao thật giao nhau tạo X đỏ neon lõi trắng ở **trước ngực và trước hai bàn tay**, xa hơn bản cũ, không vẽ X rời khỏi vũ khí. Frame 6–7 thu tay và trở lại thế chiến đấu. Không thêm tay/đao, không đổi kích thước, góc nhìn, nền hoặc chữ.

Prompt sửa lần hai: Giữ các pose trên; sửa frame 5 để toàn bộ thân, hai đao và X nằm trong ô thứ hai hàng dưới của sheet 1774×887 (x443..886, y443..886), có gutter alpha. Không thu kích thước nhân vật, chỉ tiết chế đuôi áo và đầu vệt chém; giữ hai tay vươn ra trước và X nằm rõ trước cơ thể.

Hai output gốc ImageGen: `exec-77ff496b-3089-48b0-b6ca-ddb550d04bb3.png`, `exec-cce4e05b-5c06-4203-afb5-a60b49492a6b.png`. Bản chọn đã được copy vào `source/`; hash source/candidate nằm trong `atlas.json`. Đây là candidate art, chưa là artwork đã duyệt.
