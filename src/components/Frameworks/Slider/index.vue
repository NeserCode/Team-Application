<template>
  <div class="slider">
    <div class="container" ref="container">
      <div
        class="scrollContent"
        @mouseenter="handleShow"
        @mouseleave="handleHidden"
        @scroll="handleScroll"
        ref="content"
      >
        <div class="horizontal" ref="xthumb" v-show="horizontal && showH">
          <span
            class="horCell"
            @mousedown="handleBarHold($event)"
            @mouseenter="handleBarFlash($event)"
            ref="xbar"
          ></span>
        </div>
        <div class="vertical" ref="ythumb" v-show="vertical && showV">
          <span
            class="verCell"
            ref="ybar"
            @mousedown="handleBarHold($event)"
            @mouseenter="handleBarFlash($event)"
          ></span>
        </div>
        <div ref="realContent"><slot></slot></div>
      </div>
    </div>
  </div>
  <!-- <div class="absolute">
    <div class="relative sliderContainer">
      <Slider>Content</Slider>
    </div>
  </div> -->
</template>

<script>
// import { _debounce } from "@/plugins/utils";

export default {
  name: "Slider",
  watch: {
    scrollYRate() {
      this.$refs.ybar.style.top = this.scrollYRate + "px";
      this.$refs.ythumb.style.height = this.$refs.content.scrollHeight + "px";
    },
    scrollXRate() {
      this.$refs.xbar.style.left = this.scrollXRate + "px";
      this.$refs.xthumb.style.width = this.$refs.content.scrollWidth + "px";
    },
    scrollBarHeight() {
      this.$refs.ybar.style.height = this.scrollBarHeight + "px";
    },
    scrollBarWidth() {
      this.$refs.xbar.style.width = this.scrollBarWidth + "px";
    },
    offsetThumbY() {
      this.$refs.ythumb.style.left = this.offsetThumbY + "px";
      this.$refs.xthumb.style.top = this.offsetThumbX + "px";
    },
    offsetThumbX() {
      this.$refs.xthumb.style.top = this.offsetThumbX + "px";
      this.$refs.ythumb.style.left = this.offsetThumbY + "px";
    },
    $route() {
      this.$refs.content.scrollTop = 0;
      this.$refs.content.scrollLeft = 0;
      this.$refs.ybar.style.top = 0;
      this.$refs.xbar.style.left = 0;
      this.showH = false;
      this.showV = false;
    },
  },
  mounted() {
    this.resizeObserver = new ResizeObserver(() => {
      console.log(
        `Slider(${this.$refs.ythumb.nextElementSibling.lastElementChild.classList}) Resized`
      );
      this.$refs.ythumb.style.height = `0px`;
      this.$refs.xthumb.style.width = `0px`;
      this.initBars();
    });
    this.resizeObserver.observe(this.$refs.ythumb.nextElementSibling);
  },
  activated() {
    this.initBars();
  },
  beforeUnmount() {
    this.resizeObserver.disconnect();
  },
  props: {
    horizontal: {
      type: Boolean,
      defalut: false,
    },
    vertical: {
      type: Boolean,
      defalut: true,
    },
  },
  data() {
    return {
      scrollYRate: 0,
      scrollXRate: 0,
      scrollBarHeight: 0,
      scrollBarWidth: 0,
      offsetThumbX: 0,
      offsetThumbY: 0,
      showH: true,
      showV: true,
      isBarHold: false,
      resizeObserver: null,
      prevY: null,
      prevX: null,
      limit: {
        xmin: null,
        xmax: null,
        ymin: null,
        ymax: null,
        xsmin: null,
        xsmax: null,
        ysmin: null,
        ysmax: null,
        radixX: null,
        radixY: null,
      },
    };
  },
  methods: {
    handleScroll: function () {
      let offsetW = this.$refs.content.offsetWidth,
        scrollW = this.$refs.content.scrollWidth,
        scrollLeft = this.$refs.content.scrollLeft,
        offsetH = this.$refs.content.offsetHeight,
        scrollH = this.$refs.content.scrollHeight,
        scrollTop = this.$refs.content.scrollTop;

      if (this.vertical) {
        this.scrollBarHeight = (offsetH / scrollH) * offsetH;
        this.limit.ymax = offsetH - this.scrollBarHeight;
        this.limit.radixY = (scrollH - offsetH) / this.limit.ymax;
        this.scrollYRate = scrollTop + scrollTop / this.limit.radixY;
        this.showV = !(scrollH <= offsetH);
      }

      if (this.horizontal) {
        this.scrollBarWidth = (offsetW / scrollW) * offsetW;
        this.limit.xmax = offsetW - this.scrollBarWidth;
        this.limit.radixX = (scrollW - offsetW) / this.limit.xmax;
        this.scrollXRate = scrollLeft + scrollLeft / this.limit.radixX;
        this.showH = !(scrollW <= offsetW);
      }

      this.offsetThumbY = scrollLeft + offsetW - this.$refs.ythumb.offsetWidth;
      this.offsetThumbX = scrollTop + offsetH - this.$refs.xthumb.offsetHeight;
    },
    initBars: function () {
      let offsetW = this.$refs.content.offsetWidth,
        scrollW = this.$refs.content.scrollWidth,
        scrollTop = this.$refs.content.scrollTop,
        scrollLeft = this.$refs.content.scrollLeft,
        offsetH = this.$refs.content.offsetHeight,
        scrollH = this.$refs.content.scrollHeight;

      this.limit.ysmin = 0;
      this.limit.ysmax = scrollH - offsetH;
      this.scrollBarHeight = (offsetH / scrollH) * offsetH;
      this.limit.ymin = 0;
      this.limit.ymax = offsetH - this.scrollBarHeight;
      this.limit.radixY = (scrollH - offsetH) / this.limit.ymax;
      this.limit.xsmin = 0;
      this.limit.xsmax = scrollW - offsetW;
      this.scrollBarWidth = (offsetW / scrollW) * offsetW;
      this.limit.xmin = 0;
      this.limit.xmax = offsetW - this.scrollBarWidth;
      this.limit.radixX = (scrollW - offsetW) / this.limit.xmax;

      this.showV = !(scrollH <= offsetH);
      this.showH = !(scrollW <= offsetW);

      if (this.vertical) this.scrollBarHeight = (offsetH / scrollH) * offsetH;
      if (this.horizontal) this.scrollBarWidth = (offsetW / scrollW) * offsetW;

      this.offsetThumbY = scrollLeft + offsetW - this.$refs.ythumb.offsetWidth;
      this.offsetThumbX = scrollTop + offsetH - this.$refs.xthumb.offsetHeight;
    },
    handleShow: function () {
      if (!this.isBarHold) {
        this.$refs.ybar.style.transition = `opacity ease-in-out 0.32s`;
        this.$refs.xbar.style.transition = `opacity ease-in-out 0.32s`;
        this.$refs.ythumb.style.transition = `opacity ease-in-out 0.32s`;
        this.$refs.xthumb.style.transition = `opacity ease-in-out 0.32s`;
        this.$refs.ybar.style.opacity = `.25`;
        this.$refs.xbar.style.opacity = `.25`;
        this.$refs.ythumb.style.opacity = `.5`;
        this.$refs.xthumb.style.opacity = `.5`;
      }
      this.$refs.ybar.removeEventListener("mouseleave", this.handleShow);
      this.$refs.xbar.removeEventListener("mouseleave", this.handleShow);
    },
    handleHidden: function () {
      if (!this.isBarHold) {
        this.$refs.ybar.style.transition = `opacity ease-in-out 0.64s`;
        this.$refs.xbar.style.transition = `opacity ease-in-out 0.64s`;
        this.$refs.ythumb.style.transition = `opacity ease-in-out 0.64s`;
        this.$refs.xthumb.style.transition = `opacity ease-in-out 0.64s`;
        this.$refs.ybar.style.opacity = `0`;
        this.$refs.xbar.style.opacity = `0`;
        this.$refs.ythumb.style.opacity = `0`;
        this.$refs.xthumb.style.opacity = `0`;
      }
    },
    handleBarHold: function (e) {
      if (!this.isBarHold) {
        this.isBarHold = true;
        e.target.style.transition = `none`;
        e.target.style.opacity = `0.45`;
        this.prevY = e.pageY;
        this.prevX = e.pageX;
        document.onmousemove = (ev) => {
          if (this.vertical && e.target == this.$refs.ybar) {
            this.scrollYRate =
              this.$refs.content.scrollTop +
              this.$refs.content.scrollTop / this.limit.radixY;

            this.$refs.content.scrollTop +=
              (ev.pageY - this.prevY) * this.limit.radixY;
            this.prevY = ev.pageY;
          }
          if (this.horizontal && e.target == this.$refs.xbar) {
            this.scrollXRate =
              this.$refs.content.scrollLeft +
              this.$refs.content.scrollLeft / this.limit.radixX;

            this.$refs.content.scrollLeft +=
              (ev.pageX - this.prevX) * this.limit.radixX;
            this.prevX = ev.pageX;
          }
        };
        document.onmouseup = () => {
          this.handleBarFree();
          this.prevY = null;
          this.prevX = null;
        };
      }
    },
    handleBarFlash: function (e) {
      if (e.target == this.$refs.ybar || e.target == this.$refs.xbar) {
        e.target.style.transition = `none`;
        e.target.style.opacity = `0.35`;

        e.target.addEventListener("mouseleave", this.handleShow);
      }
    },
    handleBarFree: function () {
      if (this.isBarHold) {
        this.isBarHold = false;
        this.$refs.ybar.style.transition = `opacity ease-in-out 0.64s`;
        this.$refs.ybar.style.opacity = `0.25`;
        this.$refs.xbar.style.transition = `opacity ease-in-out 0.64s`;
        this.$refs.xbar.style.opacity = `0.25`;
        document.onmouseup = null;
        document.onmousemove = null;
      }
    },
  },
};
</script>

<style lang="postcss">
.slider {
  @apply relative top-0 left-0 w-full h-full;
}
.scrollContent {
  @apply relative w-full h-full overflow-scroll;
}
.slider div.container {
  @apply relative min-w-full min-h-full w-full h-full;
}
.slider div.container div.horizontal,
.slider div.container div.vertical {
  @apply absolute pointer-events-auto;
  z-index: 2011;
}
.slider div.container div.vertical {
  @apply right-0 top-0 w-3 h-full min-h-full;
}
.slider div.container div.horizontal {
  @apply left-0 bottom-0 h-3 w-full min-w-full;
}
.slider div.container div.horizontal span.horCell,
.slider div.container div.vertical span.verCell {
  transition: opacity ease-in-out 0.64s;
}
.slider div.container div.horizontal span.horCell,
.slider div.container div.vertical span.verCell {
  @apply relative block opacity-25;
}
.slider div.container div.horizontal span.horCell {
  @apply h-full min-h-full;
}
.slider div.container div.vertical span.verCell {
  @apply w-full min-w-full;
}

@media (prefers-color-scheme: light) {
  .horizontal,
  .vertical {
    @apply bg-gray-200;
  }
  span.horCell,
  span.verCell {
    @apply bg-gray-600;
  }
}

@media (prefers-color-scheme: dark) {
  .horizontal,
  .vertical {
    @apply bg-gray-700;
  }
  span.horCell,
  span.verCell {
    @apply bg-gray-50;
  }
}

.scrollContent::-webkit-scrollbar {
  display: none;
}
</style>