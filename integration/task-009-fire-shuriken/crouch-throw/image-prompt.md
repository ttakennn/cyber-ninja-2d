# Prompt — crouch phóng phi tiêu

ImageGen built-in, nền RGBA thật. Tham chiếu1: crouch-reference.png, crop rect(788,988,384,320) từ atlas locomotion canonical. Tham chiếu2: standing-release-reference.png, crop rect(0,512,512,512) từ atlas ném đứng đã duyệt. Không dùng lại standing pose để giả cúi bằng co chiều cao.

```text
Use case: identity-preserve. Create NEW CROUCHING throwing-animation artwork of the exact existing ninja in the references. Image1: canonical low crouched pose, the PRIMARY reference for body height/foot position/costume. Image2: approved standing throw, ONLY reference for same identity and extended-release hand. Do NOT replace the crouch with the standing pose.
Deliver a transparent RGBA 1536x1024 spritesheet with exactly six full-body sprites in a 3x2 grid of 512x512 cells. Left-to-right, top-to-bottom chronological sequence. Illustrated textured pixel art, crisp dark silhouette and textured shading matching references, adult muscular tan arms, black hood/mask sleeveless suit, red narrow headband/scarf/sash, metal black/grey bracers and shin guards, sheathed sword on belt. Same face, head size, muscle thickness and equipment; no redesign. Transparent outside silhouette; no background/colored glow/floor/shadow, labels, panel lines, or fire effects.
Every pose must remain LOW CROUCHED, same deep folded knees/front boot and lowered rear knee as Image1. Keep both ground contact points planted, rear knee near ground. Torso leans slightly forward. NEVER stand up, straighten the knees or raise the hips during the throw. Do not compress or shrink the body to make it shorter: bend at hip and knees anatomically. The head/arm/torso proportions remain the SAME as original ninja.
Composition per cell: boot/knee contact baseline localy450, pelvis center localx230, top of hood around localy180 (head-to-ground270px), head about80px high/wide; source body drawn at approximately2x reference size. Entire scarf/body/fingertips inside localx30..480. Preserve this identical body scale across six frames. Hands should not rise above the hood; use a LOW horizontal forehand/wrist throw suitable for crouching under a ceiling, not an overhead standing throw.
Six distinct poses:
1. Crouched ready/prepare: low pose like Image1, near throwing elbow folded, hand drawing toward shoulder; far hand balances near chest.
2. Crouched anticipation: hand beside cheek, wrist cocked, shoulder coiled back, knees/feet remain in same low stance.
3. Crouched forward acceleration: near elbow travels forward and starts opening, wrist around face/shoulder height, torso rotates modestly.
4. Crouched RELEASE: throwing arm extends horizontally screen right at shoulder/eye height, wrist snaps and fingers open naturally; far hand pulls to waist. This is a complete low throw with no rise.
5. Crouched follow-through: throwing arm bends downward across body, torso eases back; retain low folded legs.
6. Crouched recovery: hands return close to the guard pose of Image1, hips remain low, ready to loop into crouch.
Exactly two arms/two legs, no extra fingers/limbs, all complete and uncropped. Scarf trails behind left without covering throwing hand. NO sword drawn, NO projectile included in pose (separate fire-shuriken will be composited later at frame4). Each sprite must be separated by transparent gutters. Avoid copied idle frames; show a clear natural hand/shoulder motion, while legs and ground contacts remain steady.
```

