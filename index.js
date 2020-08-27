import './style.css';

import game from '@byog/sdk';
import gameDef from './game.js';
import {setup, draw} from './ui.js';

game.dev(gameDef);
setup(game);
draw(game);
