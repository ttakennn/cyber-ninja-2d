# Diệt Nguyệt Thập Tự — nguồn art

Tool: `image_gen.imagegen` built-in, hai ảnh nền trong suốt. Tham chiếu danh tính: `docs/characters/boss-khan/animation/assets/boss-khan-v1.png`; tham chiếu art chuyển động/đao đã chốt: `docs/characters/boss-khan/animation/jump-contact.png` và `docs/characters/boss-khan/animation/combo/combo-b-contact.png`. Không chỉnh ảnh tham chiếu.

## Khan trên không

Prompt: Bốn pose Khan toàn thân trong sheet 2×2: bật lên thu chân/giữ hai đao, đứng trên không gom năng lượng đỏ/cyan ở song đao, chém chéo nhát thứ nhất xuống phải, đổi vai/tay tung nhát chéo thứ hai. Giữ trang phục trắng xám viền đỏ, quần tối, tóc tím đen, nửa mặt nạ, mắt đỏ, hai đao cong và tỷ lệ cao150% Ninja Hỏa. Hai tay và hướng xoay thân phải nối logic; chỉ vệt đao ngắn trên pose, dấu X lớn là lớp FX riêng. Nền alpha, không chữ/cảnh/nhân vật khác. Nguồn `exec-82e85754-e675-4684-8169-328a91aefad7.png` copy nguyên vào `source/aerial.png`, SHA-256 `d82719e3c993159baf1d7b49045bac465e571f5e7a177a123853f70d2e2004b7`.

## Dấu X và vụ nổ trễ

Prompt: Bốn frame VFX 2×2 không nhân vật: một nhát chéo có lõi trắng/viền đỏ neon/tia cyan, hai nhát giao thành X, dấu X nén sáng giữ một nhịp, rồi chính dấu X nổ từ tâm ra bốn cánh chéo. Không chuyển thành quả cầu tròn, không khói lớn, nền alpha. Nguồn `exec-82035d77-5b5d-4ef6-bd98-a2c630e90ead.png` copy nguyên vào `source/moon-cross.png`, SHA-256 `e773fbdfec5083da76a9eb749d35772d0902d2bbe216505ed6e73c9b08cab51a`.

Plan/crop/normalization: `animation-plan.json`. Sheet Khan ô512×512/pivot(256,456); sheet FX ô512×512/pivot(256,256). Mỗi sheet dùng **một scale chung**, không fit từng pose. `atlas.json` chứa rect, ink bounds và hash của output. Nhịp X giữ trước khi nổ trong preview là minh họa art, không chốt thời gian gameplay, vùng gây sát thương hoặc AI.
