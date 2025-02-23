import DomVideoPlayer from './src/DomVideoPlayer.vue';

export default DomVideoPlayer;

export function install(Vue) {
  Vue.component('DomVideoPlayer', DomVideoPlayer);
}