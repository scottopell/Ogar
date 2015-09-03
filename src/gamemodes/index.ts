import Mode         from './Mode';
import FFA          from './FFA';
import Teams        from './Teams';
import Experimental from './Experimental';
import Tournament   from './Tournament';
import HungerGames  from './HungerGames';
import Rainbow      from './Rainbow';
import Debug        from './Debug';
import Zombie       from './Zombie';
//import TeamZ        from './TeamZ';
//import TeamX        from './TeamX';

export { Mode, FFA, Teams, Experimental, Tournament, HungerGames, Rainbow, Debug, Zombie};//, TeamZ, TeamX };

export function get(id: number) {
    var mode;
    switch (id) {
        case 1: // Teams
            mode = new Teams();
            break;
        case 2: // Experimental
            mode = new Experimental();
            break;
        case 10: // Tournament
            mode = new Tournament();
            break;
        case 11: // Hunger Games
            mode = new HungerGames();
            break;
        case 12: // Zombie
            mode = new Zombie();
            break;
        case 13: // Zombie Team
            //mode = new TeamZ();
            break;
        case 14: // Experimental Team
            //mode = new TeamX();
            break;
        case 20: // Rainbow
            mode = new Rainbow();
            break;
        case 21: // Debug
            mode = new Debug();
            break;
        default: // FFA is default
            mode = new FFA();
            break;
    }
    return mode;
};
