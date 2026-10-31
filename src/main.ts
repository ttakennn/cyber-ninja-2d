import { Game } from './core/Game';
import { getLevelData } from './world/levels';
import './styles/main.css';

const container = document.querySelector<HTMLElement>('#game');
if (!container) throw new Error('Missing game container');

try {
  const levelId = new URLSearchParams(window.location.search).get('level') ?? 'playground';
  if (levelId === 'map01-five-zones') {
    document.title = 'Cyber Ninja 2D HD — Map01 Five Zones Art Preview RC1';
    container.querySelector('.eyebrow')!.textContent = 'MAP01 / FIVE ZONES / ART PREVIEW RC1';
    container.querySelector('.scene-label p')!.textContent = 'Artwork RC1 · chưa duyệt production';
  }
  const game = new Game(container, getLevelData(levelId));
  void game.loadLevelVisuals().then(() => game.start()).catch((error: unknown) => {
    game.dispose();
    showStartupError(error, container);
  });

  const dispose = (): void => game.dispose();
  window.addEventListener('beforeunload', dispose, { once: true });
  import.meta.hot?.dispose(() => {
    window.removeEventListener('beforeunload', dispose);
    game.dispose();
  });
} catch (error) {
  showStartupError(error, container);
}

function showStartupError(error: unknown, target: HTMLElement): void {
  console.error('Unable to initialize Cyber Ninja 2D HD', error);
  const message = document.createElement('p');
  message.className = 'startup-error';
  message.textContent = `Không thể khởi tạo game: ${error instanceof Error ? error.message : String(error)}`;
  target.append(message);
}
