import SimpleCommand = puremvc.SimpleCommand;
import ICommand = puremvc.ICommand
import SceneCommand from "../SceneCommand"
import GameCommand from "../GameCommand";

export default class ControllerPrepCommand extends SimpleCommand implements ICommand {
  constructor() {
    super()
  }

  public execute() {
    this.facade.registerCommand(SceneCommand.TO_LOADING, SceneCommand)
    this.facade.registerCommand(SceneCommand.TO_START, SceneCommand)
    this.facade.registerCommand(SceneCommand.TO_GAME, SceneCommand)
    this.facade.registerCommand(SceneCommand.TO_END, SceneCommand)

    this.facade.registerCommand(GameCommand.FIRST_TIME_GAME, GameCommand)
    this.facade.registerCommand(GameCommand.GAME_START, GameCommand)
    this.facade.registerCommand(GameCommand.GAME_OVER, GameCommand)
    this.facade.registerCommand(GameCommand.CARD_CHECK, GameCommand)
    this.facade.registerCommand(GameCommand.CHECK_OVER_RELATIONSHIP, GameCommand)
    this.facade.registerCommand(GameCommand.CHECK_SAME_CARD, GameCommand)
    this.facade.registerCommand(GameCommand.CHECK_GAME_OVER, GameCommand)
  }
}