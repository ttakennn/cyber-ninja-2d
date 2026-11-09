# Task10.48 — Chốt và publish Idle10.47 cho production

**USER_APPROVED_PRODUCTION_ART · 2026-11-09.** Người dùng xác nhận10.47 là Idle chính thức của Ninja Hỏa và yêu cầu cập nhật production, commit các thay đổi. Các candidate attack/locomotion khác không được phê duyệt theo lời chốt này.

## Bản chính thức

- [Production tổng hợp](../../../characters/ninja/animation/preview.html), [production cơ bản](../../../characters/ninja/animation/basic-preview.html).
- [Bản10.47 đã duyệt](../task-010-47-ninja-idle-sash-alignment/preview.html), [idle-atlas nguyên bản](../task-010-47-ninja-idle-sash-alignment/idle-atlas.png).
- [Atlas native đã publish](flame-ninja-atlas.png), [approval](approval.json), [bằng chứng](release-evidence.json).

Không chạy lại imagegen hoặc generator artwork. Giữ nguyên PNG10.47 đã được xem, SHA256 **fbf5f1248848835cfb3f6a21deed22ee11dfc85a3ba346be4661d949a40a5940**. Chỉ copy6rect Idle vào native atlas3136×1968, giữ frame384×320/pivot192,289/FPS7.1429/loop và39file asset/JSON khác.

Canonical: docs/characters/ninja/animation/locomotion/flame-ninja-atlas.png. SHA256 **d5559f90565cdc00eec69d7692eac7e48ce0b6bdd9bd070e59d69d551d523e48**. Source cho lần publish sau trỏ đến snapshot này; manifest/catalog ghi USER_APPROVED và selectedRevision=Task10.47, không còn dùng trạng thái tự review10.46 cho Idle hiện hành.

## Đóng gói và phạm vi

Baseline ngay trước publish là7b22406fe0fa5969cc8a84a6661b59b5f8f0ae8f72bc36f80cf7ea3ef409c572, đã bao gồm các thay đổi production được duyệt trước đó. Không đưa run/hurt hoặc clip khác về bản cũ trong Git HEAD.

Bước authoring/package đã so RGBA sau lưu PNG:0pixel khác giữa6rect Idle đóng gói và ảnh10.47;0pixel khác ngoài6rect Idle;0pixel khác ngoài mask khăn bụng so với baseline ngay trước publish. PNG10.47 giữ nguyên byte.39asset/JSON khác giữ nguyên hash. Đây là kiểm tra asset được yêu cầu, không phải test/build/runtime.

Nguồn: integration/ninja-idle-production-47/release-plan.json và canonical-before-hashes.json. scripts/package_ninja_idle_production_47.ps1 chỉ đóng gói đúng ảnh đã duyệt, có guard hash; scripts/publish_ninja_idle_production_47.mjs chỉ publish atlas và cập nhật manifest/catalog/source plan. Không chạy toàn bộ publisher để chép đè asset khác. Publisher chung giữ metadata approval này cho các lần publish sau.

Commit gồm bản chính thức, nguồn/hồ sơ Idle và lịch sử liên quan; các thử nghiệm attack/preview khác đang có được giữ ngoài commit. Việc giữ baseline hiện tại bao gồm run/hurt đã duyệt từ trước, không phải phê duyệt thêm animation mới.

## Chưa thực hiện

Không đổi src/public/assets hoặc game runtime. Browser/test/build/lint/typecheck/formatter **NOT_RUN** trong lượt publish này. Không merge/push. Commit dùng cấu hình tác giả Git hiện hành theo yêu cầu người dùng.
