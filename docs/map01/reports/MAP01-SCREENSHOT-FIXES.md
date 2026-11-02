# Map01 — Sửa theo năm ảnh người dùng

Theo xác nhận trong chat: bỏ cây street-tree và cả điều hoà/mảng vuông Zone B; thang dùng hình dựng hiện có với viền amber nổi bật. Chỉ tường X=37 có collision mới; phần che dưới các mái tiếp theo chỉ là visual. Người dùng chọn **chỉ sửa mã, không chạy kiểm tra**. Không chạy test/build/typecheck/lint/formatter hoặc nghiệm thu trình duyệt cho thay đổi này.

1. **Khe dưới dãy nhà:** PNG near buildings có phần alpha ở đáy (pixel opaque cuối khoảng hàng 795/832). Hạ worldBottom từ -2.7 xuống -3 để chân nhà ăn vào mặt phố; thêm mặt nền navy opaque sau tile phố để các pixel alpha của viền sàn không lộ cảnh phía xa.
2. **Phở/Nhà thuốc:** chân mái hiên có 9 hàng alpha dưới hàng opaque 320/330; bù placement theo đúng worldSize hiện có, hạ biển Phở cùng cụm. Đặt biển Nhà thuốc vào mặt tiền tĩnh tại (16.35,2), trong bounds tường A và phía trên mái hiên cửa, không đổi scale/PNG.
3. **Cây/thang/khung/điều hoà:** loại riêng `props-street-tree-3`, `props-aircon-unit-4` và `production-wall-b-ac-mount` khỏi runtime generator, giữ file và metadata nguồn. Giữ hình học leo, đổi màu ray/bậc sang amber #ba8a3f, nét sáng #ffe6a3, opacity cấu trúc 1. Không xoá cây được vẽ sẵn trong background.
4. **Tường tại vạch X=37:** thêm đúng một solid `upper-roof-support`, tâm (42.5,-1.75), rộng 11, cao 5.5, bounds X37..48/Y-4.5..1, tiếp giáp đáy mái upper-roof hiện có. Đây là thay đổi collision người dùng đã yêu cầu rõ; chặn lối chạy dưới mái tại X=37, tâm body đứng bị chặn ở X=36.6. Giữ mười collider gốc, spawn, vùng leo, bounds/followY/deathY và thuật toán physics. Tuyến dự kiến vẫn phải leo/nhảy lên mái, chưa kiểm lại thực tế.
5. **Che phần dưới các mái:** rectangle visual navy #182656, opacity 1, Z=-0.6 nối xuống Y=-4.5, sau tile/RC1/player và trước background. Các mái sau không có collider mới. Không lấp khe nhảy giữa các mái. Tường phẳng là phần nền kín theo yêu cầu, không kéo dãn cửa sổ hoặc chỉnh PNG RC1.

Để khai báo phần che mà không sinh collider, visual rectangle có `bottom`/`z` tùy chọn. Parser kiểm hữu hạn, bottom dưới đỉnh hình, chiều cao không tràn và Z trong frustum; `TestLevel` chỉ dựng mesh theo các field này. Field vắng giữ cách vẽ level cũ. Chỉ level Map01 dùng các field mới.

Mọi placement/solid/visual được sửa ở `scripts/generate_map01_pilot.mjs`, sau đó chạy generator để sinh JSON; không sửa riêng output. Cập nhật các expectation visual/collider có chủ đích trong test cũ, thêm `Map01ScreenshotFixes.test.ts` để kiểm wall blocking, visual-only ở mái sau, placement và validation. **Các test này chưa chạy**; không lấy số pass của Task 008.3 làm kết quả cho bản sửa này.

Bản `dist`/production preview chưa được build lại theo lựa chọn người dùng, nên trang preview cũ không phản ánh sửa đổi. Chưa xác nhận ảnh thực tế, độ nổi thang hay các điểm nối sau sửa; chưa merge, chưa tạo commit mới, chưa chốt Step09.
