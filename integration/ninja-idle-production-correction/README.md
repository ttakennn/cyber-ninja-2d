# Task10.39 · nguồn Idle sửa theo production

Chỉ Idle đứng/thở, ngày2026-11-08. Candidate chưa duyệt; Idle gặp quái và chạy để sau theo yêu cầu người dùng.

## Tham chiếu thực tế

Lấy trực tiếp6frame `clips.idle` từ `docs/characters/ninja/animation/locomotion/flame-ninja-atlas.png`, rect/pivot/FPS từ `animations.json` cạnh atlas. `production-idle-sheet.png` là crop/copy nguyên kích thước1152×640, không resize/recolor; `production-idle.png` là frame đầu384×320. Đã xem trực tiếp sheet này trước khi tạo art.

`image_gen.imagegen` chỉ nhận sheet production vừa trích làm ảnh tham chiếu. `prompt.txt` giữ nguyên yêu cầu khóa đầu/thân/khối cơ/quần áo/gấu quần/ống chân và sửa một kiếm có bao thẳng sau lưng. Không dùng candidate10.37/10.38 hoặc ninja xanh làm nguồn tạo ảnh lần này.

## Đóng gói

`idle-source.png`1683×935, lưới3×2,6pose. Một hệ số251/374 cho toàn bộ source, dựa vào mũ đầu52 đến mốc đất426 của pose đầu so với251px production. Mốc ngang nguồn286; ground theo hàng426/428. Không kéo dọc/rút riêng cẳng chân bằng code, không fit mỗi frame hoặc sửa physics. Phần ống chân/quần áo được vẽ bởi imagegen theo reference; generator chỉ cắt/scale đồng đều/đặt pivot.

`plan.json` cấp dữ liệu cho `scripts/prepare_ninja_idle_production_correction.ps1`. Output384×320/pivot192,289/160px-unit, atlas1152×640. Nhịp giữ metadata production7.1429fps/6frame. Đường trục kiếm trong preview là hướng dẫn soi hình, không phải phép kiểm chứng tự động rằng mọi điểm cơ khí thẳng tuyệt đối.

Output ở `docs/map01/commits/task-010-39-ninja-idle-production-correction/`, gồm so sánh, atlas candidate, crop production, preview/metadata/provenance. Đã xem comparison và atlas; browser/test/build NOT_RUN. Chưa publish, runtime hoặc commit.
