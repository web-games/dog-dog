import Container = PIXI.Container
import Graphics = PIXI.Graphics
import Sprite = PIXI.Sprite

import Scene, {SceneEvent} from '../Scene';
import Map from '../../../../proxy/model/Map';
import Card from './Card';

export default class GameScene extends Scene {

  public static NAME = 'game_scene';

  public static CLICK_CARD = 'click_fruit';

  private cards = {}

  private animalContainer: Container = null;

  constructor(game) {
    super(game)
  }

  public init(map: Map) {
    super.init(map);

    let {rows, cols, layers, data, coverData} = map;

    this.addChild(Sprite.from('sp_main_background.jpg'))

    var animalContainer = new Container();
    this.addChild(animalContainer);
    this.animalContainer = animalContainer;
    this.animalContainer.x = (this.stageWidth - cols * Map.GridWidth) / 2
    this.animalContainer.y = (this.stageHeight - rows * Map.GridHeight) / 2

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
              x: (j * Map.GridWidth),
              y: (i * Map.GridHeight),
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

  public removeCard({layer, row, col}) {
    var card = this.cards[`${layer}_${row}_${col}`];
    if (card) {
      card.parent.removeChild(card);
    }
  }

  public setCardStatus(cards: []) {
    cards.forEach(({layer, row, col}) => {
      let card: Card = this.cards[`${layer}_${row}_${col}`]
      card.setState(0)
    })
  }
}