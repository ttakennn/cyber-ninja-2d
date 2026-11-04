# Sát Thủ Bóng Neon — nguồn tạo hình v1

art-plan.json là brief/input; source/neon-shadow-v1.png là output ImageGen nguyên byte. Prompt đầy đủ ở prompts/design-v1.md; design.json giữ kích thước/alpha/hash và thông số review, không phải atlas/collider runtime.

Tạo dữ liệu/ảnh so bằng Windows PowerShell5.1:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts/prepare_neon_shadow_preview.ps1
```

Chạy từ gốc repo. Script authoring chỉ đọc PNG, sinh metadata và bảng so; dùng System.Drawing của Windows PowerShell5.1. Không tạo lại, resize hoặc ghi đè PNG gốc. Snapshot reference cục bộ giữ preview độc lập; source Ninja/Sói đã chốt không bị sửa.

Ngoại hình v1/95%,6clip di chuyển, Neon Shuriken, hai skills, hurt và Nguyệt Ảnh Hiện Thân đã chốt; [production11clip](../../docs/characters/neon-shadow/animation/preview.html). [Snapshot xuất hiện10.15](../../docs/map01/commits/task-010-15-neon-shadow-entrance/preview.html), [nguồn animation](animation/README.md). Các preview10.8–10.15 giữ lịch sử. Chưa tích hợp game.
