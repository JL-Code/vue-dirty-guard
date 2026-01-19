<template>
  <el-container style="padding: 20px">
    <el-header>
      <el-space>
        <el-button @click="$router.push('/')">表单页</el-button>
        <el-button @click="$router.push('/other')">其他页</el-button>
      </el-space>
    </el-header>

    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>
