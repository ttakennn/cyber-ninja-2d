# Cyber Ninja 2D HD

Bản thử năm zone: mở `?level=map01-five-zones`. Đây là graybox có placeholder ghi nhãn, chưa phải production; xem [báo cáo và ảnh bốn viewport](docs/MAP01-FIVE-ZONES.md). Alias `map01` và các level cũ giữ nguyên.

**Hiện tại: Task 008 đã tích hợp visual pilot, chờ duyệt hình ảnh.** Mở `?level=map01` để chơi Map 1 với môi trường Vietnamese Urban Night; `?level=map01-graybox` giữ bản Task 007 để đối chiếu. Xem [báo cáo Task 008](docs/TASK-008.md) để biết schema, ảnh chạy thật, kiểm thử và giới hạn còn lại. Chưa tạo Step 09 Final Production Asset Pack. Playground mặc định, `?level=small` và `?level=tiles` giữ hành vi cũ. [Task 007](docs/TASK-007.md), [Task 006](docs/TASK-006.md), [Task 005](docs/TASK-005.md), [Task 004](docs/TASK-004.md), [Task 003](docs/TASK-003.md), [Task 002](docs/TASK-002.md) và phần Task 001 bên dưới được giữ làm mốc lịch sử. Atlas phát triển cũ vẫn có tại `development-animations.json`; runtime dùng `animations.json` production.

Task 001: a fresh engine foundation using Vite, strict TypeScript, Three.js, and Vitest. No code or assets were migrated from the existing games.

## Run

Use Node.js 24 LTS (or another version accepted by `package.json`), then:

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. Serve the project through Vite rather than opening `index.html` directly. WebGL2 and a keyboard are required.

```sh
npm run test     # Run the unit suite once, without a browser or WebGL context
npm run build    # Strict TypeScript checking, then production output in dist/
npm run preview # Serve the production output
```

On the implementation machine, the default Node is 16.15.0, which is unsupported. Implementation and verification used the already installed bundled Node 24.22.1. To use that runtime in a PowerShell session on this machine:

```powershell
$env:PATH = "$env:USERPROFILE\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;$env:PATH"
npm run dev
```

This changes only the current terminal's PATH. Dependencies are pinned in `package.json` and `package-lock.json`.

## Controls

| Action | Keys |
| --- | --- |
| Move left | A / ArrowLeft |
| Move right | D / ArrowRight |
| Jump | Space / W / ArrowUp |
| Toggle diagnostics | F3 |

Jump requires a new press while grounded. Holding jump does not repeat it after landing. Opposing movement actions cancel each other; releasing both stops horizontal motion immediately. Blur clears held keys and pending presses. Hidden tabs pause the loop and restart with a fresh timing baseline when visible.

## Files and responsibilities

| File | Responsibility |
| --- | --- |
| `src/main.ts` | Bootstrap, startup error message, unload and Vite HMR cleanup |
| `src/core/Game.ts` | Own and connect the systems; update order, resize, visibility, lifecycle cleanup |
| `src/core/GameLoop.ts` | RAF scheduling, fixed 60 Hz updates, accumulator, stall limits, future interpolation alpha |
| `src/rendering/Renderer.ts` | WebGL renderer, scene, canvas sizing, DPR cap of 2, renderer disposal |
| `src/rendering/GameCamera.ts` | Orthographic projection, fixed nine-unit height, aspect ratio, horizontal follow |
| `src/input/InputManager.ts` | Configurable action bindings, held/pressed/released actions, keyboard listener cleanup |
| `src/physics/Collision.ts` | Center-based X/Y body and AABB primitives; edge contact is not overlap |
| `src/physics/PhysicsWorld.ts` | Gravity integration, axis-separated face sweeps, static collision resolution, landing result, guarded jump impulse |
| `src/entities/Player.ts` | Player body, movement commands, six logical states, replaceable placeholder mesh |
| `src/world/TestLevel.ts` | Ground and obstacle; visuals and colliders derive from the same rectangles |
| `src/debug/DebugOverlay.ts` | F3 visibility, FPS measurement, read-only body/state diagnostics |
| `src/config/game.config.ts` | Timing, viewport, gravity, movement, spawn, geometry, and colors |
| `src/styles/main.css` | Responsive canvas, controls, title, diagnostics, startup error styles |
| `tests/*.test.ts` | Collision, physics, player, input, loop, and camera tests |
| `public/assets/` | Empty characters, environments, effects, and audio folders reserved for later tasks |
| `index.html`, `package.json`, `package-lock.json`, `tsconfig.json`, `vite.config.ts` | Entry document, scripts, pinned packages, strict compiler and test/build configuration |

## Data flow and coordinates

`GameLoop` calls `Game.update(1 / 60)`. `Game` reads input, assigns player horizontal velocity, attempts an edge-triggered jump, advances `PhysicsWorld`, updates the player's logical state, and consumes input edges. Edges survive rendered frames that contain no simulation update and are consumed only once when several updates occur in a frame.

Rendering runs separately: synchronize the player's mesh from its body, follow player X with `GameCamera`, draw the scene through `Renderer`, and update `DebugOverlay`. Diagnostics never modify a body. `PhysicsWorld` and `Collision` have no Three.js, DOM, or renderer dependencies. The scheduler is injectable for timing tests.

World positions are rectangle centers. X points right and Y points up; Z controls visuals only. The reference camera spans 16 by 9 world units at 16:9. Its height stays nine units at every aspect ratio. Player size is 0.8 by 1.6, run speed is 6 units/s, gravity is -28 units/s², and jump velocity is 11 units/s. The ground's top is Y = -2.5; a standing player's center is Y = -1.7.

The loop clamps incoming frame time to 250 ms and runs at most eight simulation steps per rendered frame. Excess whole steps are discarded after a stall to bound work; the game intentionally slows relative to wall-clock time during sustained overload. The render callback receives the remainder as an interpolation alpha, but currently draws the latest fixed state. A landing state lasts one fixed step before idle/movement.

`Game.dispose()` cancels scheduling, disconnects resize observation, removes keyboard/window/document listeners, removes the overlay/canvas, and releases Three.js geometries, materials, and renderer resources. Start/stop/dispose are idempotent. HMR disposes the previous instance.

## Verification

Executed with Node 24.22.1:

- `npm run build`: passed TypeScript checking and Vite production build. Vite emitted a non-failing warning for the 532.11 kB minified JavaScript chunk (133.30 kB gzip), primarily the renderer dependency.
- `npm run test`: 28 tests passed across six files. Covers overlap, gravity, precise/stable landing, landing edges, grounded/airborne jump rules, both wall directions, high-speed axis sweeps, nearest surface ordering, ceiling contact, walking off platforms, all player states, input edges/aliases/blur/disposal, FPS-independent simulation, accumulator/stall limits, lifecycle scheduling, and camera sizing/follow.
- `npm run dev -- --host 127.0.0.1 --port 5174 --strictPort`: Vite started successfully. The local browser rendered the player, ground, and obstacle; F3 displayed updating diagnostics, movement/jump states were observable, and narrow viewport resizing updated the canvas. No browser warnings or errors were captured.

No ESLint or formatter was run.

## Known limits and Task 002

This playground has finite ground and no respawn, touch controls, gameplay art, combat, audio, or actual map. The player can fall off the level's outer ends. Bodies must spawn outside solid colliders; resolving pre-existing penetration is not implemented. Collision is axis-separated for static rectangles, without slopes or moving/one-way platforms. Visuals use the latest simulation state, so very high refresh rates can show fixed-step motion.

Task 002 recommendation: introduce a small sprite loading and animation layer connected to the existing logical movement states. Keep the body dimensions and physics independent, and reuse this playground and test suite before building a production map.
