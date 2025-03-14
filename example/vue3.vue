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
    </view>
  </view>
</template>


<script setup>
import { ref, computed } from 'vue'

// 将xx秒转为 xx:xx 分秒格式
const formatSec2Time = (time) => {
  const min = Math.floor(time / 60)
  const sec = Math.floor(time % 60)
  return `${min}:${sec < 10 ? '0' + sec : sec}`
}

const src = ref('https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/uni-app-video-courses.mp4')
const playing = ref(false)
const loop = ref(false)
const controls = ref(true)
const autoplay = ref(false)
const playbackRate = ref(1)
const currentTime = ref(0)
const duration = ref(0)
const trackList = ref([])
const domVideoPlayer = ref(null)

const progress = computed(() => {
  const percent = currentTime.value / duration.value * 100
  return percent.toFixed(2) + '%'
})

const showPlayTime = computed(() => {
  const curr = formatSec2Time(currentTime.value)
  const dur = formatSec2Time(duration.value)
  return `${curr} / ${dur}`
})

const onPlay = () => {
  console.log('onPlay')
  playing.value = true
}

const onPause = () => {
  console.log('onPause')
  playing.value = false
}

const onEnded = () => {
  console.log('onEnded')
  playing.value = false
}

const onDurationChange = (e) => {
  console.log('onDurationChange', e)
  duration.value = e
}

const onTimeUpdate = (e) => {
  currentTime.value = e
}

const onRateChange = (e) => {
  console.log('onRateChange', e)
  playbackRate.value = e
}

const onFullscreenChange = (e) => {
  console.log('onFullScreenChange', e)
}

const doPlaying = () => {
  if (domVideoPlayer.value.playing) {
    doPause()
  } else {
    doPlay()
  }
}

const doPlay = () => {
  domVideoPlayer.value.play()
}

const doPause = () => {
  domVideoPlayer.value.pause()
}

const doSeek = (time) => {
  time += domVideoPlayer.value.currentTime
  domVideoPlayer.value.toSeek(time)
}

const doFullScreen = () => {
  domVideoPlayer.value.fullScreen()
}

const doShowTrack = () => {
  src.value = 'https://static.laijiayang.cn/video/sample/sing-song.mp4'		
  trackList.value = [
    {
      src: 'https://static.laijiayang.cn/video/sample/demo1.vtt',
      kind: 'subtitles',
      label:'中文',
      srclang:'zh',
      default: true
    }
  ]
}

const doRemove = () => {
  src.value = ''
  domVideoPlayer.value.remove()
}

const doUpdateSrc = () => {
  src.value = 'https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/create-schema2code-video.mp4'
}

const switchRate = () => {
  playbackRate.value = playbackRate.value === 1 ? 2 : 1
}

const switchControls = () => {
  controls.value = !controls.value
}
</script>

<style scoped>
.action-box {
  margin-top: 30rpx;
  padding: 0 60rpx;
}

.action-box button {
  margin-top: 10rpx;
}
</style>
