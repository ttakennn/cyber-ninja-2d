# Prompt bàn giao Sol — Integrate Zone4/5 Atlas RC1

Đọc AGENTS do người dùng cung cấp; README.md, REVIEW.md, ACCEPTANCE.md của gói Cyber_Ninja_Z45_Atlas_RC1; docs/MAP01-FIVE-ZONES.md của repo.

Mục tiêu: thay artwork graybox Zone 4/5 bằng atlas RC1, giữ layout/gameplay hiện tại. Chưa khóa Step09, chưa merge master.

1. Kiểm tra HEAD và các thay đổi đang có. Baseline code 12244bf, docs fe4ff7d; giữ mọi sửa mới hơn. Không ghi đè file người dùng/Sol đang sửa. Dùng nhánh codex/map01-z45-art-integration từ nhánh five-zone hiện tại nếu trạng thái workspace cho phép.
2. Asset đã có ở public/assets/environments/map01/expansion-z45-rc1/. JSON nguồn tích hợp ở integration/z45-atlas-rc1/. Đọc asset-manifest và replacement-map.
3. Sửa nhỏ scripts/generate_map01_five_zones.mjs để resolve 22 decoration theo ID: 20 placement đang dùng 12 SVG placeholder, cộng z5-wood-crate-background và z5-pallet-background. Giữ giỏ hoa, hai đèn tường và mọi decoration cũ.
4. Thay theo ID, không append gây trùng. Không load đồng thời atlas và individual. Không overwrite năm file master-data thiết kế gốc hoặc catalog props gốc.
5. Replacement phải xảy ra sau bước thêm reuse/placeholder hoặc trong bước resolve asset theo ID. Generator phải tái tạo ổn định. Không chỉ sửa JSON output rồi để generator ghi đè lại. Không cần phát sinh placeholder cho asset đã resolve; có thể giữ thư mục graybox làm reference nhưng level art không tải các SVG đó.
6. pixelSize là kích thước toàn trang atlas; sourceRect tính từ góc trên trái. Giữ worldSize, worldPosition, anchor, z và collision. Không sửa renderer/physics/camera/solids/climbables/tile cells/alias cũ để làm art vừa.
7. Không thêm boss, combat, checkpoint, win trigger hoặc khóa cổng. Giữ core X120..136 và landing X80..88 trống.
8. Không đổi translation keys. Có thể đổi nhãn riêng alias năm zone từ GRAYBOX thành ART PREVIEW RC1; không ghi PRODUCTION/APPROVED.
9. Bàn giao commit, danh sách file đổi, ảnh thật và các mục chưa đạt. Ưu tiên hai biển, chân chậu, cổng mở, nối X120/136, vạch dưới mặt đường và độ rõ của player.

Tuân thủ AGENTS: chỉ chạy test/build/validation khi người dùng cho phép rõ trong request thực thi. Prompt này không tự cấp quyền chạy chúng. Nếu chưa được phép, ghi NOT_RUN; không dùng log graybox làm kết quả art mới.

