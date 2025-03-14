<template>
  <view>
    <view style="width: 750rpx;height: 400rpx;">
      <DomVideoPlayer
        ref="domVideoPlayer"
        object-fit='contain'
        :controls="controls"
        :autoplay="autoplay"
        :loop="loop"
        :src="src"
        :playback-rate="playbackRate"
        :is-loading="isLoading"
        :track-list="trackList"
        @play="onPlay"
        @pause="onPause"
        @ended="onEnded"
        @durationchange="onDurationChange"
        @timeupdate="onTimeUpdate"
        @ratechange="onRateChange"
        @fullscreenchange="onFullscreenChange"
      />
    </view>

    <!-- video的属性值 -->
    <view class="action-box">
      <view>播放进度: {{ progress }}</view>
      <view>播放时间: {{ showPlayTime }}</view>
      <view>当前时长: {{ currentTime }}</view>
      <view>总时长: {{ duration }}</view>
      <view>播放倍速: {{ playbackRate }}</view>
      <view>播放控制器: {{ controls }}</view>
      <view>循环播放: {{ loop }}</view>
      <view>自动播放: {{ autoplay }}</view>
    </view>

    <!-- 操作 -->
    <view class="action-box">
      <h3>事件调用</h3>
      <!-- 单个按钮控制播放/暂停 -->
      <button @tap="doPlaying">
        单个按钮控制：
        <text v-if="!playing">播放</text>
        <text v-else>暂停</text>
      </button>
      <!-- 分别控制播放/暂停 -->
      <button @tap="doPlay">播放</button>
      <button @tap="doPause">暂停</button>
    </view>

    <!-- 属性操作 -->
    <view class="action-box">
      <h3>更改属性</h3>
      <button @tap="switchRate">切换到{{ playbackRate === 1 ? 2 : 1 }}倍速播放</button>
      <button @tap="switchControls">切换视频控制栏：{{ !controls ? '显示' : '隐藏' }}</button>
    </view>

    <!-- 自定义操作 -->
    <view class="action-box">
      <h3>自定义事件</h3>
      <button @tap="doSeek(-15)">快退15秒</button>
      <button @tap="doSeek(15)">快进15秒</button>
      <button @tap="doShowTrack">展示字幕</button>
      <button @tap="doFullScreen">全屏播放</button>
      <button @tap="doRemove">移除视频</button>
      <button @tap="doUpdateSrc">更换src</button>
      <button @tap="doUpdateSrcToSeek">更换src并快进</button>
    </view>
  </view>
</template>

<script>
import DomVideoPlayer from './DomVideoPlayer.vue'

// 将xx秒转为 xx:xx 分秒格式
const formatSec2Time = (time) => {
  const min = Math.floor(time / 60)
  const sec = Math.floor(time % 60)
  return `${min}:${sec < 10 ? '0' + sec : sec}`
}

export default {
  components: {
    DomVideoPlayer
  },
  data() {
    return {
      src: 'https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/uni-app-video-courses.mp4',
      playing: false,
      loop: false,
      controls: true,
      autoplay: false,
      isLoading: true,
      playbackRate: 1,
      currentTime: 0,
      duration: 0,
      trackList: []
    }
  },
  computed: {
    // 播放进度
    progress() {
      const percent = this.currentTime / this.duration * 100
      return percent.toFixed(2) + '%'
    },
    // 显示当前时间
    showPlayTime() {
      const curr = formatSec2Time(this.currentTime)
      const dur = formatSec2Time(this.duration)
      return `${curr} / ${dur}`
    },
  },
  methods: {
    // 播放 - 事件
    onPlay() {
      console.log('onPlay')
      this.playing = true
    },
    // 暂停 - 事件
    onPause() {
      console.log('onPause')
      this.playing = false
    },
    // 播放完毕 - 事件
    onEnded() {
      console.log('onEnded')
      this.playing = false
    },
    // 总时长变化 - 事件
    onDurationChange(e) {
      console.log('onDurationChange', e)
      this.duration = e
    },
    // 播放时间更新 - 事件
    onTimeUpdate(e) {
      // console.log('onTimeUpdate', e)
      this.currentTime = e
    },
    // 倍速变化 - 事件
    onRateChange(e) {
      console.log('onRateChange', e)
      this.playbackRate = e
    },
    // 进入/退出全屏 - 事件
    onFullscreenChange(e) {
      console.log('onFullScreenChange', e)
    },

    // 切换播放/暂停 - 函数
    doPlaying() {
      const domVideoPlayer = this.$refs.domVideoPlayer
      if (domVideoPlayer.playing) {
        this.doPause()
      } else {
        this.doPlay()
      }
    },
    // 播放 - 函数
    doPlay() {
      const domVideoPlayer = this.$refs.domVideoPlayer
      domVideoPlayer.play()
    },
    // 暂停 - 函数
    doPause() {
      const domVideoPlayer = this.$refs.domVideoPlayer
      domVideoPlayer.pause()
    },
    // 快退/快进 - 函数
    doSeek(time) {
      const domVideoPlayer = this.$refs.domVideoPlayer
      time += domVideoPlayer.currentTime
      domVideoPlayer.toSeek(time)
    },
    // 全屏播放 - 函数
    doFullScreen() {
      const domVideoPlayer = this.$refs.domVideoPlayer
      domVideoPlayer.fullScreen()
    },
    // 展示字幕 - 函数
    doShowTrack() {
			this.src = 'https://static.laijiayang.cn/video/sample/sing-song.mp4'		
      this.trackList = [
        {
          src: 'https://static.laijiayang.cn/video/sample/demo1.vtt',
          kind: 'subtitles',
          label:'中文',
          srclang:'zh',
          default: true
        }
      ]
    },
    // 移除视频 - 函数
    doRemove() {
      this.src = ''
      const domVideoPlayer = this.$refs.domVideoPlayer
      domVideoPlayer.remove()
    },
    // 更换src - 函数
    doUpdateSrc() {
      this.src = 'https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/create-schema2code-video.mp4'
    },
    doUpdateSrcToSeek() {
      // 切换视频
      this.src = 'https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/create-schema2code-video.mp4'
      setTimeout(() => {
        const domVideoPlayer = this.$refs.domVideoPlayer
        // 视频加载完后，延迟调用toSeek()方法，跳转到第60s位置
        domVideoPlayer.toSeek(60, true)
      }, 100)
    },
    // 切换倍速 - 函数
    switchRate() {
      this.playbackRate = this.playbackRate === 1 ? 2 : 1
    },
    // 切换视频控制栏 - 函数
    switchControls() {
      this.controls = !this.controls
    },
  }
}
</script>

<style>
.action-box {
  margin-top: 30rpx;
  padding: 0 60rpx;
}

.action-box button {
  margin-top: 10rpx;
}
</style>
