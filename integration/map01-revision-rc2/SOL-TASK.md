# Prompt cho Sol — Map01 Visual Revision RC2
Đọc AGENTS hiện hành và toàn bộ README/map-revision-plan/asset-manifest trong integration/map01-revision-rc2 và public/assets/environments/map01/revision-rc2.
Mục tiêu: triển khai đầy đủ các chỉnh sửa map đã được duyệt theo ảnh đánh dấu. Baseline b81829a. Chưa merge master hoặc đóng Step09.

Bước1 — kiểm workspace:
Giữ các sửa mới hơn baseline và hai sửa camera có sẵn tại src/core/Game.ts, src/rendering/GameCamera.ts. Không áp patch hai lần. Tạo nhánh codex/map01-visual-revision-rc2 nếu phù hợp workspace. Xác định generatorpilot/fivezones và catalog thực tế, không ghi đè công việc khác.

Bước2 — Zone1/2 trong nguồn pilot:
Theo plan.removeSolidIds, bỏ passage-roof, raised-step, balcony-crate trước khi paint tile. Người dùng đã xác nhận xoá cả hầm/collider và ghế không collider.
Bỏ các decoration đích, tường đỡ thang và hình ladder vàng. Giữ street-crate collider, thay paint bằng crate PNG căn alpha theo metadata.
Thay climbable alley-ladder theo plan; không cho nó cắt xuyên collider ban công. Giữ ban công và ba khe mái.
Thêm bench/ladder/planter đúng worldPosition/worldSize đã tính. Không dùng kích thước mặc định catalog thay cho metadata đã căn alpha.

Bước3 — đường phố và các khối màu:
Dùng street-cap-ivy theo41 additions; không chồng thêm lên tile/rectangle cũ. Suppress paint tại các vùng trong plan và rectangle foundation của street/street-extension/roof4 tương ứng.
Bảo đảm top đường thẳngY−2.5; lá dưới viền đá. Các đoạnroad không được lấp vùng chết/khe mái.
Map01 gốc chỉ áp phầnX<80. Không thêm collider/bậc/backgroundX>80 vào alias80unit.

Bước4 — Zone4/5 trong generatorfivezones:
Bịt roof4 support và thêm3step colliders theo appendSolids. Artwork steps khớp từngAABB; không đổi gravity/jump/auto-step. Có thể nhảy lên và đi xuống, không yêu cầu tự bước lên1.5unit khi chỉ giữD.
Thay các z4/z5 facade, cổng và props bị xoá trong plan bằngfinite backdrops và biển exact props-v2. Giữ nguyên z5-floor-edge-stripe: image, sourceRect, worldPosition, worldSize,z. Không append2lần khi kế thừa pilot.
Không thêmboss, combat, checkpoint hoặc cổng khóa.

Bước5 — camera:
Sửa nhỏ đã có: camera.follow(position,height) tínhY từ chân; Game truyền player.renderHeight. Giữ tương thích call cũ/defaultheight. Kiểm ngồi/đứng liên tục trên roof2/3/4 ở vị trí đứng yên: camera/background/terrain không đổiY theo stance; chân không trượt. Jump/climb/respawn vẫn follow như cũ.
Không đổi animator/physics để che lỗi camera.

Bước6 — tái sinh và bàn giao:
Cập nhật source generator trước, rồi sinhJSON. candidate JSON chỉ để đối chiếu quyết định, không overwrite output mù quáng. Đọc diff xác nhận chỉ thay đổi đã yêu cầu, giữ alias cũ không liên quan.
Bàn giao commit, ảnh thật từngzone và4viewport, console, các lỗi còn mở. Đặc biệt thử nhập/rời thang từground/balcony, jump lênstairs từ84.5 về80, seam backdrop, sign đầy đủhai dòngHủ tiếu vàhazard còn hiện.
TheoAGENTS chỉ chạy test/build/validation khi người dùng yêu cầu rõ trong lượt thực thi. Nếu chưa được phép, ghi NOT_RUN; không dùng log/ảnh cũ chứng minh bản mới.

