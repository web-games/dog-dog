import Container = PIXI.Container
import Graphics = PIXI.Graphics

import Scene, {SceneEvent} from '../Scene';
import MapData from '../../../proxy/model/MapData';
import Card from './Card';
import GameCommand from "../../../command/GameCommand";

export default class GameScene extends Scene {

  public static NAME = 'game_scene';

  public static CLICK_CARD = 'click_fruit';

  private cards = {}

  private animalContainer: Container = null;

  constructor(game) {
    super(game)
  }

  public init(map: MapData) {
    super.init(map);

    let {rows, cols, layers, data} = map;

    const screen_bg = new Graphics()
    screen_bg.beginFill(window.themeColor);
    screen_bg.drawRect(0, 0, this.stageWidth, this.stageHeight)
    screen_bg.endFill();
    screen_bg.x = 0;
    screen_bg.y = 0;
    this.addChild(screen_bg)

    var animalContainer = new Container();
    this.addChild(animalContainer);
    this.animalContainer = animalContainer;
    this.animalContainer.x = (this.stageWidth - cols * MapData.GridWidth) / 2
    this.animalContainer.y = (this.stageHeight - rows * MapData.GridHeight) / 2

    for (var l = layers - 1; l >= 0; l--) {
      for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
          let value = data[l][i][j]
          if (value) {
            this.addCard({
              layer: l,
              row: i,
              col: j,
              value,
              x: (j * MapData.GridWidth),
              y: (i * MapData.GridHeight),
            })
          }
        }
      }
    }

    this.emit(SceneEvent.INIT_COMPLETE)
  }

  public addCard({layer, row, col, x, y, value}) {
    var card = new Card(this, layer, row, col, value)
    this.animalContainer.addChild(card)
    card.x = x;
    card.y = y;

    this.cards[`${layer}_${row}_${col}`] = card;
    return card
  }

  public moveCard(cardData: CardDataType, chooseCard: CardDataType[]) {
    const {layer, row, col} = cardData;
    const card = this.cards[`${layer}_${row}_${col}`];
    if (card) {
      const {x: startX, y: startY} = card.toGlobal(new PIXI.Point());
      const x = chooseCard.length * (MapData.GridWidth * 2);
      const y = MapData.GridHeight * 2;

      this.addChild(card);
      card.x = startX;
      card.y = startY;

      TweenMax.to(card, 0.5, {
        x,
        y,
        onComplete: () => {
          this.emit(GameCommand.CHECK_SAME_CARD, cardData)
        }
      });
    }
  }

  public removeCard({layer, row, col}: CardDataType) {
    const card = this.cards[`${layer}_${row}_${col}`];
    if (card) {
      this.removeChild(card);
    }
  }

  public resetChooseCardPosition(arr: CardDataType[]) {
    arr.forEach((item, index) => {
      const {layer, row, col} = item;
      const card = this.cards[`${layer}_${row}_${col}`];
      if (card) {
        const x = (index + 1) * (MapData.GridWidth * 2);
        const y = MapData.GridHeight * 2;
        TweenMax.to(card, 0.3, {x, y});
      }
    })
  }

  public setCardStatus(cards: []) {
    cards.forEach(({layer, row, col}) => {
      let card: Card = this.cards[`${layer}_${row}_${col}`]
      card.setState(0)
    })
  }
}