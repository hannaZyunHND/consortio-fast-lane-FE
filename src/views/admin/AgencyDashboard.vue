<template>
    <div class="dashboard-layout">
        <!-- <AppTopbar /> -->
        <div class="dashboard-body">
            <AppSidebar />
            <div class="content">

                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>
import AppSidebar from '@/components/layout/AppSidebar.vue';
export default {
    components: {
        AppSidebar
    }
}
</script>

<style scoped>
/* .dashboard-body {
    height: 100vh;
    display: flex;
} */

.content {
    flex: 1;
    /* width: 80%; */
    padding: 20px 20px 0px 20px;
    font-size: 14px;
    font-family: "Inter var", sans-serif;
    color: #334155;
    /* background: #494c77; */

}

.data-table-tilte {
    text-transform: uppercase;
}
</style>