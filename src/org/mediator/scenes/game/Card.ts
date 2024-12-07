import GameScene from "./GameScene";

export default class Card extends PIXI.Container {

  public scene = null;
  public graphics: PIXI.Graphics = null;
  public text: PIXI.Text = null;
  public layer: number = null;
  public row: number = null;
  public col: number = null;
  public value: number = null;

  constructor(scene, layer, row, col, value) {
    super()
    this.scene = scene;
    this.layer = layer;
    this.row = row
    this.col = col
    this.value = value

    const bg = new PIXI.Graphics();
    bg.beginFill(0xf5f5f5);
    bg.drawRect(-39, -39, 78, 78);
    bg.endFill();
    this.addChild(bg)

    var sprite = PIXI.Sprite.from(`./resources/images/animal${value}.png`)
    this.addChild(sprite)
    sprite.width = 78;
    sprite.height = 78;
    sprite.anchor.set(0.5)

    const graphics = new PIXI.Graphics();
    graphics.beginFill(0x000000, 0.5);
    graphics.drawRect(-39, -39, 78, 78);
    graphics.endFill();
    this.addChild(graphics)
    this.graphics = graphics;

    /*let text = new PIXI.Text(`${layer} (${row},${col})`, {fontSize: 14, fill: 0x000000})
    this.addChild(text)
    text.anchor.set(0.5, 0.5)
    this.text = text*/
  }

  // val 1 被覆盖 0 没有被覆盖
  setState(val: number) {
    if (val === 0) {
      this.graphics.visible = false;
      this.buttonMode = true
      this.interactive = true
      this.on('pointerover', (event) => {
        this.filters = [new PIXI.filters['OutlineFilter'](2, 0x99ff99)];
      })
      this.on('pointerout', (event) => {
        this.filters = [];
      })
      this.on('pointertap', (event) => {
        this.scene.emit(GameScene.CLICK_CARD, event.currentTarget)
      })
    }
  }
}