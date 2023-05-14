<script>
export default {
	name: "manage-page",
	beforeCreate() {},
	mounted() {},
	components: {},
	data() {
		return {}
	},
	methods: {},
}
</script>

<template>
	<div class="organization">
		<div class="organization-info">
			<span class="title">
				<span class="name">Name</span>
				<span class="id">编号 ?</span>
			</span>
			<div class="member-list">
				<span class="count">组织人数 ?</span>
				<span
					class="item"
					v-for="detail in membersInfo.detail"
					:key="detail.id"
				>
					<span class="info">
						<span class="name">{{ detail.nickname }}</span>
						<span class="id">{{ `#${detail.id}` }}</span>
					</span>
					<span class="position">{{ detail.access_position }}</span>
				</span>
			</div>
		</div>
		<div class="organization-list">
			<span class="title">
				<span>组织列表</span>
				<button class="btn" @click="handleCreateOrganization">
					<el-icon><Plus /></el-icon>
				</button>
			</span>
			<span
				:class="['item', computedOwnOgnizationClass(item)]"
				v-for="item in allOrganization"
				:key="item.id"
			>
				<span class="info">
					<span class="id">{{ `#${item.id}` }}</span>
					<span class="name">{{ item.name }}</span>
					<span class="status">
						{{ item.status ? "已认证" : "未认证" }}
					</span>
				</span>
				<button
					class="btn"
					title="向该组织提交申请"
					@click="handleJoinOrganization(item)"
				>
					<el-icon><Promotion /></el-icon>
				</button>
			</span>
		</div>
		<create-organization
			:visible="visible.createOrganization"
			@update:visible="updateVisibleCreateOrganization"
			@create:success="updateUserOrganization"
		/>
		<join-organization
			:visible="visible.joinOrganization"
			:organization="willJoinOrganization"
			@update:visible="updateVisibleJoinOrganization"
			@join:success="updateUserOrganization"
		/>
	</div>
</template>

<style scoped lang="postcss">
.organization {
	@apply inline-flex flex-col items-center w-full h-auto py-4;
	font-family: "Consolas", "HanSerif";
}

.title {
	@apply inline-flex items-center mb-4;
}

.organization-info {
	@apply flex flex-col w-full max-w-2xl my-8 justify-center;
}
.organization-info .name {
	@apply text-2xl font-bold;
}
.organization-info .title .name {
	@apply text-4xl;
}
.organization-info .id {
	@apply inline-block self-end mx-1 font-black;
}
.organization-info .status {
	@apply inline-flex justify-center items-center px-1 py-0.5 mx-2 rounded
	font-bold text-gray-50 dark:text-gray-800 bg-gray-400 dark:bg-gray-500
	transition-all shadow;
}
.organization-info .status.access {
	@apply bg-green-400 dark:bg-green-500;
}

.item {
	@apply flex items-center justify-between w-full my-1 px-4 py-2 text-base border-2 rounded-md
	border-gray-200 dark:border-gray-700
	hover:border-gray-300 dark:hover:border-gray-500
	hover:shadow
	hover:bg-gray-50 dark:hover:bg-gray-600 transition-all;
}
.item.own,
.item.self {
	@apply bg-green-100 dark:bg-green-800;
}

.organization-list {
	@apply flex flex-col w-full max-w-2xl justify-center;
}
.organization-list .title {
	@apply text-4xl mb-4 font-bold;
}
.organization-list .item .info {
	@apply inline-flex items-center;
}
.organization-list .item .id {
	@apply inline-block self-end mx-1;
}
.organization-list .item .status {
	@apply inline-block mx-1;
}

.btn {
	@apply dark:border-gray-700;
}
.title .btn {
	@apply mx-2 text-base rounded-full p-1.5;
}
</style>
