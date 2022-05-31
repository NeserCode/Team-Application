<template>
  <div class="checkContainer">
    <span class="title">Sign Check</span>
    <div class="checkDays" v-show="userStatus">
      <span
        :class="[
          'day',
          index == 7 ? 'today' : '',
          item.isChecked ? 'checked' : '',
        ]"
        v-for="(item, index) in checkDays"
        :key="item"
        >{{ item.d }}</span
      >
      <a
        :class="['message', checkObject.isCheck ? 'checked' : '']"
        @click="handleCheckLoading(), handleCheckDay()"
      >
        <span v-show="!checkObject.isLoading"
          >{{ checkObject.isCheck ? "已" : "未" }}签到</span
        >
        <i class="el-icon-loading" v-show="checkObject.isLoading"></i>
      </a>
    </div>
    <div class="checkDays" v-show="!userStatus">
      <span class="notSignSpan">用户未登录</span>
    </div>
  </div>
</template>

<script>
import { _debounce } from "@/plugins/utils.js";
// @ is an alias to /src

export default {
  name: "CheckDays",
  components: {},
  beforeCreate() {
    this.$public.on("update-check-day", () => {
      this.initCheckDay();
    });
    this.$public.on("clear-user-sign-status", () => {
      this.userStatus = false;
    });
  },
  activated() {},
  mounted() {
    this.initCheckDay();
    // setInterval(() => {
    //   this.checkObject.timestamp = (+new Date()).toString();
    //   // console.log(this.checkObject.timestamp);
    // }, 1000);
  },
  data() {
    return {
      checkDays: [],
      checkedDays: [],
      checkObject: {
        checkDay: null,
        checkMonth: null,
        isCheck: false,
        isLoading: false,
        timeStamp: null,
      },
      userStatus: false,
    };
  },
  methods: {
    //this.getMonthDays(T.getFullYear(), T.getMonth(), 0) 某月天数
    getMonthDays: (year, month) => new Date(year, month, 0).getDate(),
    initCheckDay: function () {
      this.checkObject.checkDay = null;
      this.checkObject.checkMonth = null;
      this.checkObject.isCheck = false;

      let T = new Date();
      this.checkObject.checkMonth = T.getMonth();
      this.checkObject.checkDay = T.getDate();

      let days = [],
        formatDay = [];
      //获取每月天数
      for (let i = 0; i <= 11; i++) {
        formatDay.push(this.getMonthDays(T.getFullYear(), i + 1, 0));
      }
      // 获取数组上半部分的日期
      for (let j = 0; j <= 6; j++) {
        if (T.getDate() - (7 - j) >= 1)
          days.push({
            m: T.getMonth(),
            d: T.getDate() - (7 - j),
            isChecked: false,
          });
        else
          days.push({
            m: T.getMonth() - 1,
            d:
              formatDay[T.getMonth() - 1 >= 0 ? T.getMonth() - 1 : 11] +
              T.getDate() -
              (7 - j),
            isChecked: false,
          });
      }
      days.push({ m: T.getMonth(), d: T.getDate(), isChecked: false });
      //获取数组下半部分的日期
      for (let t = 0; t <= 6; t++) {
        if (T.getDate() + t + 1 <= formatDay[T.getMonth()])
          days.push({
            m: T.getMonth(),
            d: T.getDate() + t + 1,
            isChecked: false,
          });
        else
          days.push({
            m: T.getMonth() + 1,
            d: T.getDate() + t + 1 - formatDay[T.getMonth()],
            isChecked: false,
          });
      }
      this.checkDays = days;
      this.userStatus = this.getUserStatus();
      this.getCheckedDay();
    },
    handleCheckDay: _debounce(function () {
      for (let i = 0; i < this.checkedDays.length; i++)
        if (
          (this.checkedDays[i].m == this.checkObject.checkMonth &&
            this.checkedDays[i].d == this.checkObject.checkDay) ||
          new Date(new Date().toLocaleDateString()).getTime() <
            this.checkedDays[i].timeStamp
        ) {
          this.$public.emit("notice", {
            msg: "今日已经签到",
            type: "error",
            fn: () => {
              this.checkObject.isCheck = true;
              this.checkObject.isLoading = false;
            },
          });
          return 0;
        }

      if (!this.checkObject.isCheck)
        this.$conf.getConfPromise().then((response) => {
          const { name } = response.data.userInfo;
          const { key } = response.data.appInfo;
          this.$conf
            .getHost()
            .then((h) => {
              this.$conf
                .updateCheckDay({
                  host: this.$conf.getHttpString(h.host),
                  username: name,
                  appKey: key,
                  timeStamp: new Date().getTime(),
                })
                .then((res) => {
                  this.checkObject.isLoading = false;
                  this.checkObject.isCheck = res.status == 200 ?? false;
                  this.$public.emit("notice", {
                    type: "success",
                    msg: `签到成功`,
                    fn: () => {
                      this.$public.emit("update-user-check");
                    },
                  });
                  this.getCheckedDay();
                })
                .catch(() => {
                  this.$public.emit("notice", {
                    type: "error",
                    msg: `更新签到状态失败`,
                    fn: () => {
                      this.$public.emit("update-user-check");
                    },
                  });
                });
            })
            .catch((e) => {
              console.log(e.message);
            });
        });
    }, 500),
    handleCheckLoading: function () {
      this.checkObject.isLoading = true;
    },
    getCheckedDay: function () {
      let checkedDays = [];

      if (this.getUserStatus())
        this.$conf.getHost().then((h) => {
          this.$conf
            .getCheckDay({
              host: this.$conf.getHttpString(h.host),
              username: localStorage.getItem("username"),
            })
            .then((response) => {
              response.data.forEach((element) => {
                const { id, timeStamp } = element;
                checkedDays.push({
                  id,
                  m: new Date(Number(timeStamp)).getMonth(),
                  d: new Date(Number(timeStamp)).getDate(),
                  timeStamp: Number(timeStamp),
                });
              });
              this.checkedDays = checkedDays;

              for (let i = 0; i < this.checkedDays.length; i++) {
                if (
                  this.checkedDays[i].m == this.checkObject.checkMonth &&
                  this.checkedDays[i].d == this.checkObject.checkDay
                )
                  this.checkObject.isCheck = true;
                for (let j = 0; j < this.checkDays.length; j++)
                  if (
                    this.checkDays[j].m == this.checkedDays[i].m &&
                    this.checkDays[j].d == this.checkedDays[i].d
                  )
                    this.checkDays[j].isChecked = true;
              }
            })
            .catch(() => {
              this.$public.emit("notice", {
                msg: `获取签到状态失败`,
              });
            });
        });
    },
    getUserStatus: () => localStorage.getItem("username"),
  },
};
</script>

<style scoped lang="postcss">
/* width changeable */
.checkContainer {
  @apply w-full h-full;
}
.title {
  @apply sticky inline-block w-full h-full top-0 mx-4 px-4 py-4 text-lg font-bold text-left font-mono;
  z-index: 2001;
}

.checkDays {
  @apply flex flex-wrap justify-center text-left;
}
.checkDays span.notSignSpan {
  @apply inline-block text-base font-semibold;
  line-height: 3rem;
}
.message {
  @apply inline-block w-32 h-12 px-3 my-4 text-center font-thin text-sm transition rounded-lg;
  line-height: 3rem;
}
.message.checked {
  @apply bg-green-400;
}
.day {
  @apply w-8 h-8 mx-3 my-2 inline-block rounded-full text-base text-center;
  line-height: 1.85rem;
}
.today {
  @apply box-border border-2 border-blue-500;
  line-height: 1.75rem;
}

@media (prefers-color-scheme: dark) {
  .title {
    @apply bg-gray-800;
  }
  .message {
    @apply bg-gray-600;
  }
  .day {
    @apply bg-gray-600;
  }
  .day.checked {
    @apply bg-gray-800;
  }
}

@media (prefers-color-scheme: light) {
  .title {
    @apply bg-gray-100;
  }
  .message {
    @apply bg-blue-400;
  }
  .day {
    @apply bg-gray-200;
  }
  .day.checked {
    @apply bg-green-300;
  }
}
</style>
