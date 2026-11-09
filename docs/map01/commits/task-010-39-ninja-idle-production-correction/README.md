# Task10.39 · chỉ sửa Idle đứng/thở theo production

Ngày2026-11-08. **CANDIDATE_PENDING_REVIEW**. Người dùng yêu cầu tất cả kích thước/tỉ lệ/khối cơ/vị trí quần áo theo Idle production; phản hồi ống chân trước hơi dài và kiếm/bao kiếm sau lưng không cùng trục. Chờ chốt riêng phần này trước khi sửa Idle gặp quái và chạy.

[Mở preview](preview.html) · [So production/bản mới](comparison.png) · [Atlas mới](idle-atlas.png) · [6frame production](production-idle-atlas.png) · [Nguồn/hash](provenance.json).

## Thay đổi

- Trích6frame Idle trực tiếp từ atlas production hiện hành theo metadata; dùng sheet này làm **nguồn ảnh duy nhất** cho imagegen. Không tiếp tục lấy cơ thể ở candidate10.38 làm nền.
- Vẽ lại cùng dáng đứng/tay buông, hình khối cơ, áo/đai đỏ/quần/giáp/giày theo mẫu production. Gấu quần và phần cẳng chân bám mẫu gốc, tránh kéo dài ống chân.
- Dời kiếm/bao kiếm từ hông lên lưng, hướng chuôi lên-phải và bao xuống-trái để nối trên cùng đường chéo, bỏ hướng gãy của candidate trước; phần giữa bị thân/khăn che. Vẫn một kiếm có bao, không thêm vũ khí phụ.
- Giữ canvas384×320, pivot192,289, mật độ160px/world unit; chuẩn đầu/đất38/289 ở pose đầu. Một scale đồng đều251/374 cho cả6pose, không bóp/kéo riêng cơ thể hoặc fit mỗi frame. Frame tham chiếu production được crop nguyên pixel.
- Giữ nhịp Idle metadata production7.1429fps, khoảng840ms/6frame. Preview có so cùng frame/mốc hình thể, chồng production35%, trục kiếm tùy chọn, tua/từng frame và tốc độ chậm.

## Đã xem và giới hạn

Đã xem trực tiếp sheet production trước khi tạo, source mới, comparison và atlas sau đóng gói. Trong comparison, gấu quần/giáp/chân và đầu được đặt cùng mốc với production để người dùng soi tỉ lệ; đường hướng dẫn không là bằng chứng artwork trùng từng pixel. Đây là art được vẽ lại bằng imagegen nên còn phải review các đường nét cơ thể/quần áo và độ thẳng kiếm qua6frame.

Preview mới **chưa mở kiểm tra trong browser**. Độ mượt toàn vòng/tất cả nút/chồng ảnh/trục kiếm chưa xác nhận trong browser. Test/build/lint/typecheck/formatter **NOT_RUN**, theo phạm vi art hiện tại. Không dùng kết quả task cũ để xác nhận preview này.

Chưa thay ảnh/JSON production, src/public, collider/input/physics/AI/timing runtime, chưa commit/merge/push. **Idle gặp quái và chạy không sửa trong lượt này**. Nguồn/prompt/plan: `integration/ninja-idle-production-correction/`; generator: `scripts/prepare_ninja_idle_production_correction.ps1`. Giữ các thay đổi chưa commit từ task trước và các snapshot lịch sử.
