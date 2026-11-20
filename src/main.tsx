import { ViteReactSSG } from 'vite-react-ssg';
import { routes } from './routes';
import './index.css';
import './styles/gta-cinematic.css';

// Self-hosted fonts
import '@fontsource/anton';
import '@fontsource/bowlby-one';
import '@fontsource/outfit';
import '@fontsource/jetbrains-mono';

export const createRoot = ViteReactSSG(
  { routes },
);
