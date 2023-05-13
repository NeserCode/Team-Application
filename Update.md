## sql 更新、服务未更新

-   新增组织表、公告表

    -   组织表包含 id, status, appKey, hostId, name, exp, organizationKey
    -   公告表包含 id, oid, open, content, timeStamp

-   其他表改动

    -   用户根表新增 super 字段
    -   用户信息表 access_team 字段由字符类型改动为数字类型 -> (新表组织表的 id 外键)

-   BUG

    -   [√] 代码提交策略无效，无法提交
    -   [x] 新表可能会带来的变化
    -   [x] 服务端未更新，无法使用
    -   [x] 优化代码

-   Features
    -   [x] 待定
