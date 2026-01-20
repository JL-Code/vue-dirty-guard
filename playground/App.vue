<template>
    <el-container style="padding: 24px">
        <el-header>
            <el-space>
                <el-text size="large" type="primary">
                    vue-dirty-guard Playground
                </el-text>
                <el-button @click="$router.push('/')">表单页</el-button>
                <el-button @click="$router.push('/customer-edit')">
                    客户信息编辑
                </el-button>
                <el-button @click="$router.push('/other')">其他页</el-button>
            </el-space>
        </el-header>

        <el-main>
            <router-view />
        </el-main>
    </el-container>
</template>
