# Đổi các mức độ dày vòng Bạo Viêm

Theo yêu cầu mới, thay0.3/0.5/0.7 bằng **1.0/1.3/1.5/1.7**, mặc định1.0. Mức1.0 dùng nguyên frame gốc khi vẽ; các mức lớn hơn làm dày về phía trong, giữ đường kính ngoài. Không đổi bộ chọn kích thước vòng, ánh sáng Ninja hoặc thời gian7s.

Sửa art-plan.json trước, chạy scripts/prepare_ninja_nine_dragons.ps1 để authoring metadata/review-data.js. Preview giữ URL cũ; bảng so sánh rộng2560px để hiển thị đủ4mức, cùng nhân vật phát sáng. review-effects.js thêm đường vẽ trực tiếp ở mức1.0, các mức còn lại dùng cùng phép remap đã có. Không đổi PNG/cỡ/pivot nhân vật, runtime hoặc damage.

Đã đọc source/diff; **NOT_RUN:** test/build/lint/typecheck/formatter và review trình duyệt lượt này. Chưa commit/merge/push. Đây là các lựa chọn preview, chưa coi là cỡ final được duyệt.
