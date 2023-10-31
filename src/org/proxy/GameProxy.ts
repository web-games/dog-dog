import Proxy = puremvc.Proxy;
import IProxy = puremvc.IProxy;
import Map from './model/Map';

export default class GameProxy extends Proxy implements IProxy {
  public static NAME: string = 'game_proxy'

  public static CHANGE_COVER_STATUS: string = 'change_cover_status'

  // 地图数据
  public map: Map = null;

  constructor() {
    super(GameProxy.NAME)

    this.map = new Map(this)
  }

  public initGameData() {
    this.map.initMapData();
  }
}
