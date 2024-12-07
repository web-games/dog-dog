import Game from "./org/Application"
import ApplicationFacade from "./org/ApplicationFacade";

window.themeColor = 0xcc377f;

ApplicationFacade.getInstance(Game.NAME).startup();