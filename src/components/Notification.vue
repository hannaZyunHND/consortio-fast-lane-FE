<template>
    <div class="notification-button" @click="onToggleNotificationContainer()">
        Notification
    </div>
    <div class="notification-container" v-if="isShowNotification">
        <div class="notification-item">
            <div class="notification-content">Booking 123456 changed. Please See info</div>
            <div class="notification-time">At .....</div>
            <hr>
        </div>
        <div class="notification-item">
            <div class="notification-content">Booking 123456 changed. Please See info</div>
            <div class="notification-time">At .....</div>
            <hr>
        </div>
        <div class="notification-item">
            <div class="notification-content">Booking 123456 changed. Please See info</div>
            <div class="notification-time">At .....</div>
            <hr>
        </div>
        <div class="notification-item">
            <div class="notification-content">Booking 123456 changed. Please See info</div>
            <div class="notification-time">At .....</div>
            <hr>
        </div>
        <div class="notification-item">
            <div class="notification-content">Booking 123456 changed. Please See info</div>
            <div class="notification-time">At .....</div>
            <hr>
        </div>
    </div>
</template>
<script>
    export default {
        name: Notification,
        data(){
            return{
                isShowNotification: true
            }
        },
        method: {
            onToggleNotificationContainer(){
                this.isShowNotification = !this.isShowNotification
            },
        }
    }
</script>
<style scoped>
    .notification-button{
        padding: 5px 50px;
        text-align: center;
        display: flex;
        margin: 0 auto;
        border: 1px solid black;
        position: fixed;
        bottom: 50px;
        right: 50px;
        /* z-index:999; */
    }
    .notification-container{
        position: fixed;
        padding: 5px;
        bottom: 60px;
        right: 50px;
        border: 1px solid black;
        /* z-index:999; */
    }
</style>