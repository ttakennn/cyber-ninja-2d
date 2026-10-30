"""Tạo atlas hình học để kiểm tra animation; không phải nhân vật chính thức.

Chỉ dùng khi tạo lại tài nguyên phát triển. Cần Python và Pillow; game không
phụ thuộc vào Python. Mỗi frame được cắt viền trong suốt nhưng giữ pivot chân.
"""
import json
from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "assets" / "characters" / "ninja"
CELL_WIDTH, CELL_HEIGHT, COLUMNS = 64, 80, 6
CLIPS = [
    ("idle", 4, 5, True, (88, 231, 219)),
    ("run", 6, 12, True, (89, 183, 255)),
    ("jump", 2, 10, False, (255, 194, 93)),
    ("fall", 2, 8, True, (181, 145, 255)),
    ("land", 3, 12, False, (255, 133, 168)),
    ("crouch", 2, 4, True, (238, 206, 115)),
    ("climb", 4, 8, True, (157, 218, 130)),
]


def draw_frame(name, index, color):
    frame = Image.new("RGBA", (CELL_WIDTH, CELL_HEIGHT))
    draw = ImageDraw.Draw(frame)
    shade = tuple(max(0, channel - 65) for channel in color)
    top = 36 + index % 2 if name == "crouch" else 25 - index * 4 if name == "land" else 8 + (index % 2 if name == "idle" else 0)
    hip = 62 if name == "crouch" else 58 if name == "land" else 50
    draw.rectangle((22, top, 41, top + 19), fill=color)
    draw.rectangle((23, top + 9, 41, top + 14), fill=(18, 30, 48))
    draw.rectangle((35, top + 10, 39, top + 12), fill=(255, 255, 244))
    draw.rectangle((10 - index % 3, top + 16, 24, top + 20), fill=shade)
    draw.rectangle((23, top + 22, 39, hip), fill=color)
    draw.rectangle((23, hip - 4, 39, hip), fill=shade)
    # Vạch trên ngực giúp nhận ra từng frame, kể cả khi pose gần giống nhau.
    for marker in range(index + 1):
        draw.rectangle((25 + marker * 2, top + 25, 25 + marker * 2, top + 29), fill=(245, 255, 255))
    if name == "run":
        stride = [-8, -4, 0, 8, 4, 0][index]
        draw.line((27, hip, 26 + stride, 68), fill=color, width=7)
        draw.line((36, hip, 36 - stride, 68), fill=shade, width=7)
        draw.rectangle((22 + stride, 68, 30 + stride, 71), fill=color)
        draw.rectangle((32 - stride, 68, 40 - stride, 71), fill=shade)
        draw.line((26, top + 24, 16 - stride, 42), fill=shade, width=6)
        draw.line((38, top + 24, 44 + stride, 40), fill=color, width=6)
    else:
        spread = 4 if name in ("jump", "fall") else 0
        draw.rectangle((24 - spread, hip + 1, 29, 71), fill=color)
        draw.rectangle((34, hip + 1, 39 + spread, 71), fill=shade)
        arm_y = top + 10 + index * 3 if name in ("jump", "fall") else hip - 5
        if name == "climb":
            draw.line((25, top + 24, 16, top + (4 if index % 2 else 29)), fill=shade, width=6)
            draw.line((38, top + 24, 47, top + (29 if index % 2 else 4)), fill=color, width=6)
        else:
            draw.line((25, top + 24, 16, arm_y), fill=shade, width=6)
            draw.line((38, top + 24, 47, arm_y), fill=color, width=6)
    return frame


def main():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    atlas = Image.new("RGBA", (COLUMNS * CELL_WIDTH, len(CLIPS) * CELL_HEIGHT))
    clips = {}
    for row, (name, count, fps, loop, color) in enumerate(CLIPS):
        frames = []
        for index in range(count):
            source = draw_frame(name, index, color)
            bounds = source.getbbox()
            left, top, right, bottom = bounds
            x, y = index * CELL_WIDTH + 2, row * CELL_HEIGHT + 2
            atlas.paste(source.crop(bounds), (x, y))
            frames.append({
                "x": x, "y": y, "width": right - left, "height": bottom - top,
                "sourceWidth": CELL_WIDTH, "sourceHeight": CELL_HEIGHT,
                "offsetX": left, "offsetY": top, "pivot": {"x": 32, "y": 72},
            })
        clips[name] = {"frames": frames, "fps": fps, "loop": loop, "speed": 1}
    atlas.save(OUTPUT / "ninja-atlas.png")
    metadata = {
        "version": 1, "kind": "development", "image": "ninja-atlas.png", "filter": "nearest",
        "frameWidth": CELL_WIDTH, "frameHeight": CELL_HEIGHT, "columns": COLUMNS,
        "visual": {
            "width": 1.6, "height": 2, "offset": {"x": 0, "y": 0},
            "scale": {"x": 1, "y": 1}, "anchor": {"x": 0.5, "y": 0},
        },
        "clips": clips,
    }
    (OUTPUT / "development-animations.json").write_text(json.dumps(metadata, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
