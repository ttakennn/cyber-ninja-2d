# Ảnh Bộ Đoạn Sát — nguồn tạo ảnh

Tool: `image_gen.imagegen` built-in, nền trong suốt. Ảnh tham chiếu: `docs/characters/boss-khan/animation/assets/boss-khan-v1.png` và `docs/characters/boss-khan/animation/combo/combo-b-contact.png`. Cả hai chỉ dùng để giữ danh tính, chất liệu, bảng màu và tỷ lệ đã duyệt. Không sửa ảnh tham chiếu.

## Pose sheet được chọn

Yêu cầu sprite 4 cột × 2 hàng, nhìn sang phải, Khan áo khoác trắng xám xẻ tà, tóc tím đen, nửa mặt nạ, mắt đỏ, song đao cong đỏ/cyan, cùng phong cách Illustrated textured pixel art. Dãy pose: đứng gác, nén người, tan vào vệt sáng, gần biến mất, hiện lại thấp người, một nhát chém lao tới, theo đà, hồi thế. Giữ tỉ lệ nhân vật và chân cùng mặt đất, nền alpha, không chữ/cảnh. Nguồn ImageGen `exec-9fa1603c-ec80-4882-99f0-6b48a8603c75.png`, copy nguyên vào `source/shadow-step-poses.png`, SHA-256 `14e52f4a67d28c0a4be31884c39af6bb4ee9360dc96f6eb9c53761add212ac41`.

Hai ô tan biến quá dày; các ô đáy 4/6 lẫn phần vệt chém từ ô kế cận. Bản preview dùng riêng ba pose sạch 0,1,7. Vệt báo trước và biến mất là đường sáng mảnh do canvas vẽ, không dùng mây sáng dày.

## Thử chỉnh làn sáng, không chọn

Yêu cầu ImageGen giữ các pose khác, chỉ thay hai ô biến mất thành vệt trắng-đỏ viền cyan mảnh, không khói/cổng. Kết quả `exec-e4a4d7c9-1f9e-475e-b2fb-a54f5a999ac1.png` vẫn tạo quầng lớn, giữ ở `source/shadow-step-light-rejected.png` làm lịch sử, SHA-256 `3ba14225e8258182692db4b553d5498a7c12b461e91338d18b601534d1fd8691`, không đưa vào atlas review.

## Nhát chém riêng được chọn

Yêu cầu ImageGen một sprite Khan toàn thân trên canvas vuông alpha, nhìn phải, hai tay vươn xa và cơ thể lao tới, một nhát chém nhanh với vệt lưỡi mảnh lõi trắng/đỏ neon/cyan nhẹ, không dấu X, giữ danh tính và khoảng trống quanh mép. Nguồn `exec-5b3ee1f7-669f-46c6-8c4a-0032c48d6743.png`, copy nguyên vào `source/shadow-step-slash.png`, SHA-256 `3aa9d5db6d4f84f1fe81de0ee9c145f675074f662439855ee9312e16e6411857`.

Plan/crop/tỷ lệ và hash atlas xuất ra nằm ở `animation-plan.json` và `atlas.json`. Tất cả timing và vị trí trong HTML chỉ để duyệt art.

## Chỉnh theo phản hồi: Khan phải tan/hiện bằng hình nhân vật

Người dùng thấy preview cũ chỉ có đường sáng, chưa thấy quá trình Khan biến mất và trở lại. Dùng ImageGen với ảnh Khan canonical và bản thử làm tham chiếu, yêu cầu bốn mức alpha của cùng Khan nhìn phải, giữ khuôn mặt, trang phục, song đao, tỷ lệ và chân cùng nền. Các mảnh đỏ/cyan phải bám theo cơ thể, không thay bằng vạch sáng. Nguồn được chọn: `exec-246c7d1e-93f0-479e-b2a9-0744fdc3b644.png`, copy nguyên vào `source/shadow-transition.png`, SHA-256 `ade93641074dc5e0b9b3f119185a0cc0533270fbe0e5db2e1d779d8d61c8ee46`. Chọn ba ô đầu sạch từ sheet 2×2; ô cuối có vùng sáng quá rộng nên không dùng. Chuẩn hóa bằng một scale chung 420/642, frame512×512, pivot(256,456); xem `shadow-transition` trong plan và atlas metadata. Preview phát ba mức theo chiều xuôi để tan, chiều ngược để hiện, kèm crossfade; bỏ các vạch dọc và ngang cũ. Chưa đưa candidate vào thư viện animation production hoặc game.
