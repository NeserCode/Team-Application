<script>
// import { _debounce } from "@/plugins/utils"
// import { ElMessageBox } from "element-plus"
// import renameOrganization from "@/components/Dialogs/renameOrganization.vue"
import { SettingKey, HostKey, UserStatusKey } from "@/tokens"

export default {
	name: "Manage-checkdays",
	inject: {
		host: {
			from: HostKey,
		},
		setting: {
			from: SettingKey,
		},
		userStatus: {
			from: UserStatusKey,
		},
	},
	data() {
		return {
			users: {
				detail: [],
				info: [],
			},
			checkdays: [],
			count: {},
			rates: {},
			isUpdate: false,
		}
	},
	beforeCreate() {
		this.$public.on("app-provided", () => {})
	},
	mounted() {
		this.$nextTick(() => {
			this.getUsers()
		})
	},
	methods: {
		getUsers: function () {
			this.isUpdate = false

			this.$conf
				.getMembersByOrganizationId({
					host: this.host.host,
					id: this.setting.userInfo.organization ?? 0,
				})
				.then((res) => {
					this.users = res.data
					res.data &&
						this.$public.emit("notice", {
							title: "计算组织用户考勤情况",
							msg: "获取用户成功, 等待获取考勤记录",
							type: "success",
							fn: () => {
								this.getCheckdaysByOid()
								this.isUpdate = false
							},
						})
				})
		},
		getAllUsers: function () {
			this.isUpdate = false

			this.$conf
				.allUser({
					host: this.host.host,
				})
				.then((res) => {
					this.users = res.data
					res.data &&
						this.$public.emit("notice", {
							title: "计算所有用户考勤情况",
							msg: "获取用户成功, 等待获取考勤记录",
							type: "success",
							fn: () => {
								this.getCheckdaysByOid()
								this.isUpdate = false
							},
						})
				})
		},
		getCheckdaysByOid: function () {
			this.$conf
				.getCheckdayByOid({
					host: this.host.host,
					oid: this.setting.userInfo.organization ?? 0,
				})
				.then((res) => {
					this.checkdays = res.data
					console.log(res.data)
					res.data &&
						this.$public.emit("notice", {
							title: "计算所有用户考勤情况",
							msg: "获取考勤记录成功",
							type: "success",
							fn: () => {
								this.isUpdate = false
							},
						})

					for (let i = 0; i < this.users.detail.length; i++) {
						this.count[this.users.detail[i].id] = []
					}

					for (let i = 0; i < this.checkdays.length; i++) {
						this.count[this.checkdays[i].userid].push(
							this.checkdays[i]
						)
					}

					//去除count中值为0的项
					for (let i in this.count) {
						if (this.count[i].length == 0) {
							delete this.count[i]
						}
					}

					this.getRates()
					console.log(this.count, this.rates)
				})
		},
		//根据count中的数据计算出每个用户一周内和一月内的考勤率
		getRates: function () {
			for (let i in this.count) {
				let week = 0
				let month = 0

				let now = new Date()
				let lastWeek = new Date(
					now.getTime() - 7 * 24 * 3600 * 1000
				).getTime()
				let lastMonth = new Date(
					now.getTime() - 30 * 24 * 3600 * 1000
				).getTime()

				for (let j = 0; j < this.count[i].length; j++) {
					let time = this.count[i][j].timeStamp
					if (time > lastWeek) {
						week++
					}
					if (time > lastMonth) {
						month++
					}
				}

				this.rates[i] = {
					week: Math.round((week / 7) * 10000) / 100,
					month: Math.round((month / 30) * 10000) / 100,
				}
			}
		},
	},
}
</script>

<template>
	<div class="users-checkday">
		<div class="title">
			<span class="name">用户考勤</span>
			<div class="op">
				<button
					class="btn"
					title="全部用户"
					v-if="userStatus.isSuper"
					@click="getAllUsers"
				>
					<el-icon :class="{ 'is-loading': isUpdate }"
						><Filter
					/></el-icon>
				</button>
				<button class="btn" title="重新获取" @click="getAllUsers">
					<el-icon :class="{ 'is-loading': isUpdate }"
						><Refresh
					/></el-icon>
				</button>
			</div>
		</div>
		<div class="users-list">
			<span class="count"
				>用户人数
				{{ users.detail ? users.detail.length : NaN }}
			</span>
			<span class="item" v-for="detail in users.detail" :key="detail.id">
				<span class="info">
					<span class="avatar">
						<el-avatar
							@error="() => true"
							:src="detail.avatar"
							shape="square"
						/>
					</span>
					<span class="name">{{ detail.nickname }}</span>
					<span class="id">{{ `#${detail.id}` }}</span>
				</span>
				<span class="count">
					<span class="week"
						>周考勤率
						{{ rates[detail.id] ? rates[detail.id].week : 0 }}%
					</span>
					<span class="month"
						>月考勤率
						{{ rates[detail.id] ? rates[detail.id].month : 0 }}%
					</span>
				</span>
			</span>
		</div>
	</div>
</template>

<style scoped lang="postcss">
.users-checkday {
	@apply inline-flex flex-col items-center w-full h-auto py-4;
	font-family: "Consolas", "HanSerif";
}

.users-checkday .title {
	@apply inline-flex justify-between items-center w-full max-w-2xl
	mb-4 text-3xl font-semibold text-left;
}

.users-list {
	@apply inline-flex flex-col items-center w-full max-w-2xl h-auto;
}
.users-list > .count {
	@apply inline-block w-full px-1 text-left;
}

.item {
	@apply flex items-center justify-between w-full my-1 p-2 text-base border-2 rounded-md
	border-gray-200 dark:border-gray-700
	hover:border-gray-300 dark:hover:border-gray-500
	hover:shadow
	hover:bg-gray-50 dark:hover:bg-gray-600 transition-all;
}

.item .info {
	@apply inline-flex items-center;
}
.count {
	@apply inline-block text-left;
}
.info .avatar {
	@apply inline-flex items-center;
}
.info .name {
	@apply ml-2 text-2xl font-semibold;
}
.info .id {
	@apply inline-block self-end mx-1 font-black;
}

.btn {
	@apply dark:border-gray-700;
}
.btn.danger {
	@apply text-red-500 dark:text-red-400;
}
.title > .btn {
	@apply mx-2 rounded-full p-1.5;
}
.op > .btn {
	@apply mx-1 text-base;
}

.btn span {
	@apply inline-block mx-1 text-sm;
}
</style>
