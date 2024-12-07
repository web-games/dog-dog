import Proxy = puremvc.Proxy;
import IProxy = puremvc.IProxy;
import MapData from './model/MapData';

export default class GameProxy extends Proxy implements IProxy {
  public static NAME: string = 'game_proxy'

  public static CHANGE_COVER_STATUS: string = 'change_cover_status'

  // 地图数据
  public mapData: MapData = null;
  // 已选择的卡片
  public chooseCardList: CardDataType[] = null;
  public chooseCardMap: Map<number, CardDataType[]> = null;

  constructor() {
    super(GameProxy.NAME)

    this.mapData = new MapData(this)
  }

  public initGameData() {
    this.mapData.initMapData();

    this.chooseCardList = [];
    this.chooseCardMap = new Map();
  }

  public insertCard(data: CardDataType): boolean {
    if (this.chooseCardList.length >= 100)
      return false;

    const {value} = data;

    this.chooseCardList.push(data);

    if (!this.chooseCardMap.get(value)) {
      this.chooseCardMap.set(value, []);
    }

    let cards = this.chooseCardMap.get(value);
    cards.push(data);

    return true;
  }
}
