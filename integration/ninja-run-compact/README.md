# Ninja run compact · Task10.54

Candidate authoring only. See [review report](../../docs/map01/commits/task-010-54-ninja-run-compact/README.md). Approved identity: actual combat51 and current production run; no rejected53 artwork used as identity.

plan.json fixes source hash, uniform0.9 scale, shared Y3.6, per-cell waist-X alignment, frame order, fixed384×320/pivot192,289. No per-frame height fitting or generated standing-control calibration. run-first-pass.png preserves the first artwork attempt; run-source.png is the selected revised12-pose sheet. Both pose-guide.json variants are authoring estimates, not measurements of real bone lengths. Reference-contract.json contains production frame rects.

Artwork generation used imagegen with actual51/currentRun/12pose guide for first pass, then first-pass sheet/revised guide/actual51 to edit leg phases. Art direction and limitations are recorded in art-direction.txt. Final source grid4×3 is1536×1024, cut by row edges0/341/683/1024.

Draw guide: Windows PowerShell5, draw-guide.ps1. Package: scripts/prepare_ninja_run_compact.ps1. Assemble GIF: scripts/assemble_ninja_run_compact_review.mjs. These author candidate output under commits/task-010-54-ninja-run-compact; they do not publish production or change game runtime.
