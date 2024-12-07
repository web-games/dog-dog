import Mediator = puremvc.Mediator;
import IMediator = puremvc.IMediator;
import LoadingScene from './scenes/loading/LoadingScene';
import {SceneEvent} from './scenes/Scene';
import SceneCommand from '../command/SceneCommand';

export default class LoadSceneMediator extends Mediator implements IMediator {
  public static NAME: string = 'loading_scene_mediator'

  constructor(viewComponent: any) {
    super(LoadSceneMediator.NAME, viewComponent)
    this.loadingScene.on(SceneEvent.INIT_COMPLETE, this.initComplete, this);
    this.loadingScene.on(LoadingScene.CLICK_CONTINUE, () => {
      this.sendNotification(SceneCommand.TO_START, {from: this.loadingScene});

      // this.sendNotification(SceneCommand.TO_GAME, {from: this.loadingScene});

      // this.sendNotification(SceneCommand.TO_END, {from: this.loadingScene})
    }, this);
  }

  private initComplete() {
    var assetLoader = new PIXI['Loader']();
    assetLoader.add([
      './resources/images/animal1.png',
      './resources/images/animal2.png',
      './resources/images/animal3.png',
      './resources/images/animal4.png',
      './resources/images/animal5.png',
      './resources/images/animal6.png',
      './resources/images/animal7.png',
      './resources/images/animal8.png',
      './resources/images/animal9.png',
      './resources/images/animal10.png',
      './resources/images/animal11.png',
      './resources/images/animal12.png',
      './resources/images/animal13.png',
      './resources/images/animal14.png',
      './resources/images/animal15.png',
    ]);
    assetLoader.once('complete', () => {
      this.loadingScene.setLoadingText('加载完成，点击任意地方继续')

      this.loadingScene.loading = false;

      // this.sendNotification(SceneCommand.TO_START, {from: this.loadingScene});
      // this.sendNotification(SceneCommand.TO_GAME, {from: this.loadingScene});
    });
    assetLoader.on('progress', (e) => {
      // console.log('加载百分比' + e.progress + '%');
      this.loadingScene.setLoadingProgress(e.progress);
    });
    assetLoader.load();
  }

  public get loadingScene() {
    return this.viewComponent as LoadingScene
  }
}