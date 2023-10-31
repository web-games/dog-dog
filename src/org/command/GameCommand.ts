import SimpleCommand = puremvc.SimpleCommand
import ICommand = puremvc.ICommand
import INotification = puremvc.INotification
import GameProxy from '../proxy/GameProxy';
import SceneCommand from './SceneCommand'
import GameScene from "../mediator/view/scene/game/GameScene";
import GameSceneMediator from "../mediator/GameSceneMediator";

export default class GameCommand extends SimpleCommand implements ICommand {

  public static GAME_START = 'game_start';

  public static CHECK_OVER_RELATIONSHIP = 'check_over_relationship';

  public static CARD_CHECK = 'card_check';

  public static GAME_OVER = 'game_over';

  constructor() {
    super()
  }

  public execute(notification: INotification) {
    console.log('SceneCommand notification:', notification)

    let name = notification.getName()
    let body = notification.getBody()
    // console.log('name:', name);
    // console.log('body:', body);

    let gameProxy: GameProxy = this.facade.retrieveProxy(GameProxy.NAME) as GameProxy

    switch (name) {
      case GameCommand.GAME_START:
        gameProxy.initGameData();

        this.sendNotification(SceneCommand.TO_GAME, {from: body});
        break;
      case GameCommand.CARD_CHECK:
        // 卡片入已选择的列表

        // 检测是否游戏结束

        // 移除当前卡片
        let gameScene: GameScene = (this.facade.retrieveMediator(GameSceneMediator.NAME) as GameSceneMediator).gameScene;
        gameScene.removeCard(body)

        // 改变当前网格的状态
        gameProxy.map.setGridStatus({...body, value: 0, cover: 0})

        // 检测覆盖关系
        gameProxy.map.checkCoverRelationship(body.layer)
        break;
      case GameCommand.CHECK_OVER_RELATIONSHIP:
        gameProxy.map.checkCoverRelationship(body.layer)
        break;
      case GameCommand.GAME_OVER:
        // let gameScene: GameScene = (this.facade.retrieveMediator(GameSceneMediator.NAME) as GameSceneMediator).gameScene;
        // this.sendNotification(SceneCommand.TO_END, {from: gameScene});
        break;
    }
  }
}