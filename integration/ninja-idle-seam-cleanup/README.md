# Nguồn Task10.45

Chỉ sửa hai vùng người dùng khoanh: mép trong giáp cẳng tay và đai đỏ. Candidate chờ duyệt.

before-arm-waist.png:6crop từ10.44, crop130,75,105,108 phóng2×,3×2. seam-guide.png: nguồn imagegen chỉnh từ crop production +10.44; prompt.txt lưu đầy đủ yêu cầu. plan.json ghi dependency/mask/output. Chỉ dùng guide trong phần vải bị phụ kiện cũ che; silhouette giáp/alpha và phần đai nhìn thấy lấy native production, phần đai bị che nối texture theo từng hàng production.

Authoring: powershell -NoProfile -ExecutionPolicy Bypass -File scripts/prepare_ninja_idle_seam_cleanup.ps1. Script gọi assemble_ninja_idle_seam_review.mjs để đóng gói GIF. Không phải lệnh test/build.

[Snapshot và giới hạn](../../docs/map01/commits/task-010-45-ninja-idle-seam-cleanup/README.md). Không publish production/runtime; giữ các snapshot cũ.
