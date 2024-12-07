import Scene from '../Scene';
import Button from '../../components/Button'

export default class EndScene extends Scene {

  public static NAME = 'start_scene';

  public static CLICK_AGAIN: string = 'click_again'

  public static CLICK_RESTART: string = 'click_restart'

  private _ticker = null;

  constructor(game) {
    super(game)
  }

  public init() {
    this.addBackground();

    const againButton = new Button('再来一次');
    againButton.x = this.stageWidth / 2;
    againButton.y = this.stageHeight / 2;
    againButton.interactive = true;
    againButton.on('pointerdown', () => this.emit(EndScene.CLICK_AGAIN));
    this.addChild(againButton);

    const restartButton = new Button('重新开始');
    restartButton.x = this.stageWidth / 2;
    restartButton.y = this.stageHeight / 2 + 110;
    restartButton.interactive = true;
    restartButton.on('pointerdown', () => this.emit(EndScene.CLICK_RESTART));
    this.addChild(restartButton);
  }

  private async addBackground() {
    const stageWidth = this.stageWidth
    const stageHeight = this.stageHeight

    let fragmentShader = await fetch('./resources/shader/smog.frag').then((res) => res.text())

    const uniforms = {
      u_resolution: new PIXI.Point(stageWidth, stageHeight),
      alpha: 1.0,
      shift: 1.6,
      time: 0,
      speed: new PIXI.Point(0.1, 0.05)
    }
    // @ts-ignore
    const filter = new PIXI.Filter('', fragmentShader, uniforms)

    const sprite = PIXI.Sprite.from('./resources/images/pixi_v3_github-pad.png')
    sprite.filters = [filter]
    sprite.width = stageWidth
    sprite.height = stageHeight
    this.addChildAt(sprite, 0)

    // @ts-ignore
    const ticker = new PIXI.Ticker();
    ticker.add(function (deltaTime) {
      uniforms.time += 0.01
      console.log('update')
    });
    ticker.start();
    this._ticker = ticker;
  }

  public destroy() {
    this._ticker.stop();
  }
}
