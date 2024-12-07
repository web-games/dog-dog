import GameProxy from "../GameProxy";

/**
 * 洗牌算法 打乱数组
 * @return 打乱后的数组
 * */
// @ts-ignore
Array.prototype.shuffle = function () {
  var i, t, m = this.length
  while (m) {
    i = Math.floor(Math.random() * m--)
    t = this[m]
    this[m] = this[i]
    this[i] = t
  }
  return this
}

const START_NUM = 9;
const CARD_NUM = 7;

export default class MapData {
  public static GridWidth = 40
  public static GridHeight = 40

  public coverData = [];
  public data = []
  public rows = 16
  public cols = 16
  public layers = 5;

  private proxy: GameProxy = null;

  constructor(proxy) {
    this.proxy = proxy;
  }

  public initMapData() {
    let {layers, rows, cols} = this;

    this.data = Array.apply(null, {length: layers}).map((item, index) => {
      return Array.apply(null, {length: rows}).map(() => {
        return Array.apply(null, {length: cols}).map(() => 0)
      })
    })

    this.coverData = JSON.parse(JSON.stringify(this.data))

    for (let l = 0; l < layers; l++) {
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          if (Math.random() < 0.1) {
            if (!this.check8direction(l, i, j)) {
              let random = parseInt(String(Math.random() * CARD_NUM)) + START_NUM;
              this.data[l][i][j] = random
              this.coverData[l][i][j] = 1;
            }
          }
        }
      }
    }
    console.log('this.data:', this.data);
  }

  /**
   * 检测某层及以下层的元素覆盖关系
   * */
  public checkCoverRelationship(layer: number = 0) {
    // console.log('this.coverData:', this.coverData);
    let {layers, rows, cols} = this;
    let coverMap = Array.apply(null, {length: rows}).map(() => {
      return Array.apply(null, {length: cols}).map(() => 0)
    })

    let arr: Object[] = []

    for (let l = 0; l < layers; l++) {
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          let value = this.data[l][i][j];
          // console.log('value:',value);
          if (value !== 0) {
            let cover = this.check4Grid(coverMap, i, j);
            // 说明没有被覆盖
            if (cover === 0) {
              if (this.coverData[l][i][j] === 1) {
                this.coverData[l][i][j] = 0;
                arr.push({layer: l, row: i, col: j})
              }
            }
          }
        }
      }
    }

    // console.log('coverMap:', coverMap);

    this.proxy.sendNotification(GameProxy.CHANGE_COVER_STATUS, arr);
  }

  public setGridStatus({layer, row, col, value, cover}) {
    this.data[layer][row][col] = value;
    this.coverData[layer][row][col] = cover;
  }

  // 检测上一层的4格 是否有覆盖(i,j)格子
  private check4Grid(map, i, j): number {
    // 记录当前网格是否被覆盖
    let cover = 0;

    let grid = [
      [0, 0], // 自身
      [0, 1], // 右
      [1, 0], // 下
      [1, 1], // 右下
    ]

    grid.forEach(([m, n]) => {
      let row = i + m;
      let col = j + n;

      if (map[row][col] === 1)
        cover = 1;

      map[row][col] = 1
    })

    return cover
  }

  /**
   * 检测当前节点的8方向是否有卡片
   * */
  private check8direction(l, i, j) {
    let direction = [
      [0, -1],// 上
      [0, 1],// 下
      [-1, 0],// 左
      [1, 0],// 右
      [-1, -1],// 左上
      [-1, 1],// 右上
      [1, -1],// 左下
      [1, 1],// 右下
    ]
    for (let m = 0; m < direction.length; m++) {
      let row = i + direction[m][0]
      let col = j + direction[m][1]

      if (row < 0 || row >= this.rows)
        return true;

      if (col < 0 || col >= this.cols)
        return true;

      if (this.data[l][row][col] !== 0)
        return true;
    }

    return false;
  }
}