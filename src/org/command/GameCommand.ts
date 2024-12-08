import SimpleCommand = puremvc.SimpleCommand
import ICommand = puremvc.ICommand
import INotification = puremvc.INotification
import GameProxy from '../proxy/GameProxy';
import SceneCommand from './SceneCommand'
import GameScene from "../mediator/scenes/game/GameScene";
import GameSceneMediator from "../mediator/GameSceneMediator";

export default class GameCommand extends SimpleCommand implements ICommand {

  public static FIRST_TIME_GAME = 'first_time_game';

  public static GAME_START = 'game_start';

  public static CHECK_OVER_RELATIONSHIP = 'check_over_relationship';

  public static CARD_CHECK = 'card_check';

  public static GAME_OVER = 'game_over';

  public static CHECK_SAME_CARD = 'check_same_card';

  public static CHECK_GAME_OVER = 'check_game_over';

  constructor() {
    super()
  }

  public execute(notification: INotification) {
    console.log('SceneCommand notification:', notification)
    const name = notification.getName()
    const body = notification.getBody()
    const type = notification.getType()
    // console.log('name:', name);
    // console.log('body:', body);
    // console.log('type:', type);

    const gameProxy: GameProxy = this.facade.retrieveProxy(GameProxy.NAME) as GameProxy
    const gameSceneMediator: GameSceneMediator = this.facade.retrieveMediator(GameSceneMediator.NAME) as GameSceneMediator;
    const gameScene: GameScene = gameSceneMediator.gameScene;

    switch (name) {
      case GameCommand.FIRST_TIME_GAME:
        PIXI.sound.play("worldscenebgm", {loop: true})
        break;
      case GameCommand.GAME_START:
        gameProxy.initGameData();

        this.sendNotification(SceneCommand.TO_GAME, {from: body});
        break;
      case GameCommand.CARD_CHECK:
        // 卡片入已选择的列表
        const success = gameProxy.insertCard(body)

        if (!success)
          return;

        // 移动当前卡片
        gameScene.moveCard(body, gameProxy.chooseCardList)

        // 改变当前网格的状态
        gameProxy.mapData.setGridStatus({...body, value: 0, cover: 0})

        // 检测覆盖关系
        gameProxy.mapData.checkCoverRelationship(body.layer)
        break;
      case GameCommand.CHECK_OVER_RELATIONSHIP:
        gameProxy.mapData.checkCoverRelationship(body.layer)
        break;

      case GameCommand.CHECK_SAME_CARD:
        const {value} = body;
        const cardArr = gameProxy.chooseCardMap.get(value);
        if (cardArr.length >= 3) {
          for (var i = cardArr.length - 1; i >= 0; i--) {
            const arr = cardArr.splice(i, 1);
            const cardData = arr[0];
            gameScene.removeCard(cardData);

            let index = gameProxy.chooseCardList.indexOf(cardData);
            if (index !== -1)
              gameProxy.chooseCardList.splice(index, 1);
          }

          gameScene.resetChooseCardPosition(gameProxy.chooseCardList);
        }

        this.sendNotification(GameCommand.CHECK_GAME_OVER)
        break;
      case GameCommand.CHECK_GAME_OVER:
        var gameOver = gameProxy.mapData.checkGridIsAllZero();
        if (gameOver) {
          this.sendNotification(GameCommand.GAME_OVER);
        }
        break;
      case GameCommand.GAME_OVER:
        this.sendNotification(SceneCommand.TO_END, {from: gameScene});
        break;
    }
  }
}