# Bản đồ tài liệu

AGENTS.md ở gốc repo là quy tắc làm việc chung. Tài liệu được chia theo phạm vi, không dùng toàn bộ quyết định của Map01 làm quy tắc cho mọi nội dung mới.

```text
docs/
  rules/                       # Quy chuẩn chung toàn game
    GAME_BIBLE.md
    ART_STYLE_GUIDE.md
    SPRITE_SPEC.md
    ATLAS_SPEC.md
  TASK_STATUS.md               # Chỉ mục trạng thái toàn dự án
  DECISION_LOG.md              # Quyết định cấp dự án và lịch sử
  map01/
    README.md                  # Nguồn, alias và phạm vi Map01
    rules/                     # Palette, ánh sáng, pack riêng Map01
    TASK_STATUS.md
    commits/                   # Báo cáo/ảnh/log các task Map01
  characters/
    README.md
    ninja/
      rules/SPRITE_SPEC.md      # Danh tính, kích thước và animation ninja
      reports/
    electric-wolf/
      README.md
      rules/SPRITE_SPEC.md
      animation/               # Thư viện xem lại hoạt ảnh/skills đã chốt
        preview.html
```

## Cách đọc và mở rộng

1. Đọc rules/ chung, rồi rules/ của đúng map và đúng nhân vật đang xử lý, sau đó source/metadata thực tế.
2. Illustrated textured pixel art là phong cách chung. Palette, mức sáng, thời tiết, thời điểm và chủ đề được định nghĩa theo map; Map02/03 có thể sáng hơn Map01 theo brief.
3. Không recolor/resize nhân vật dùng chung theo palette map. Hồ sơ nhân vật đi theo nhân vật qua mọi map.
4. Khi bắt đầu Map02, tạo docs/map02/README.md, rules/ART_STYLE_GUIDE.md, rules/ATLAS_SPEC.md và TASK_STATUS.md theo yêu cầu thực tế. Chỉ mô tả phần riêng; liên kết về quy tắc chung, không chép palette đêm Map01. Thêm reports/ và DECISION_LOG.md cục bộ khi cần theo dõi riêng. Chưa tạo Map02/03 hoặc bịa thiết kế cho chúng trong task tài liệu này.
5. Nhân vật mới dùng docs/characters/<id>/rules/SPRITE_SPEC.md; ghi contract và brief của chính nhân vật đó. Cùng contract/asset dùng chung chỉ có một nơi định nghĩa.
   Thư viện preview lâu dài của Sói Điện ở docs/characters/electric-wolf/animation/: gồm HTML, atlas/JSON, VFX, bảng pose và ảnh tham chiếu; dùng nơi này để xem lại/cập nhật preview. Nguồn authoring/provenance vẫn ở integration; commits giữ báo cáo/bằng chứng lịch sử.
6. Nếu đặc tả cục bộ cần khác quy tắc kỹ thuật chung, nêu rõ khác biệt và xác nhận phần quan trọng chưa được giao; không tự phá tương thích. Khác palette Map01 theo chủ đề map mới là điều được cho phép, không phải vi phạm style chung.

## Tài liệu hiện hành và lịch sử

Quy tắc mới theo lời chốt người dùng: docs/characters/<nhan-vat>/animation/ là bản art final cho production. Mọi task vẫn lưu báo cáo/ảnh/snapshot trong docs/<map-id>/commits/<task-id>/; bản thử chưa duyệt chỉ ở review, không ghi đè production. Đọc [ANIMATION_PRODUCTION](rules/ANIMATION_PRODUCTION.md); preview Ninja Hỏa ở [đây](characters/ninja/animation/preview.html). Không suy art final thành nghiệm thu runtime.

- [Quy chuẩn chung](rules/GAME_BIBLE.md), [Map01](map01/README.md), [nhân vật](characters/README.md), [trạng thái](TASK_STATUS.md), [quyết định](DECISION_LOG.md).
- Báo cáo/ảnh/log các task trước đã được gom vào docs/map01/commits/. Task Map01 tiếp theo cũng lưu Markdown/preview/bằng chứng tại đó theo thư mục task. Không dùng bằng chứng cũ để tuyên bố baseline mới đã được nghiệm thu.
