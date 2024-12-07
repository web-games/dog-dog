import Mediator = puremvc.Mediator;
import IMediator = puremvc.IMediator;
import INotification = puremvc.INotification;
import GameScene from './scenes/game/GameScene';
import GameCommand from '../command/GameCommand';
import GameProxy from '../proxy/GameProxy';
import {SceneEvent} from './scenes/Scene';

export default class GameSceneMediator extends Mediator implements IMediator {
  public static NAME: string = 'game_scene_mediator'

  constructor(viewComponent: any) {
    super(GameSceneMediator.NAME, viewComponent)

    this.gameScene.on(SceneEvent.INIT_COMPLETE, () => this.sendNotification(GameCommand.CHECK_OVER_RELATIONSHIP, {layer: 0}))

    this.gameScene.on(GameScene.CLICK_CARD, ({layer, row, col, value}) => this.sendNotification(GameCommand.CARD_CHECK, {layer, row, col, value}))
    this.gameScene.on(GameCommand.CHECK_SAME_CARD, data => this.sendNotification(GameCommand.CHECK_SAME_CARD, data))
  }

  public listNotificationInterests(): string[] {
    return [
      GameProxy.CHANGE_COVER_STATUS,
    ]
  }

  public handleNotification(notification: INotification): void {
    console.log('GameSceneMediator notification:', notification)
    let name = notification.getName()
    let body = notification.getBody()
    let type = notification.getType()

    switch (name) {
      case GameProxy.CHANGE_COVER_STATUS:
        this.gameScene.setCardStatus(body)
        break;
    }
  }

  get gameScene(): GameScene {
    return (this.viewComponent as GameScene)
  }
}