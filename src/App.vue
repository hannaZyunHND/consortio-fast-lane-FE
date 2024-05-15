<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>
<style>
.calendar-root.mode-is-month {
  background: white !important;
  color: #4a4a4a !important;
}

.calendar-root-wrapper {
  box-shadow: 0 3px 5px #00000005, 0 0 2px #0000000d, 0 1px 4px #00000014 !important;
  border-radius: 15px;
  color: #4a4a4a;
}

.calendar-month__day-name[data-v-09c7c5db] {
  color: #4a4a4a !important;
}

.calendar-month__day-date {
  color: #4a4a4a !important;
}

.date-picker__value-display {
  color: #fff !important;
}

.calendar-header__mode-value {
  color: #fff !important;
}

.calendar-month__event.is-event.is-draggable {
  top: 0px;
  background-color: rgb(165, 215, 167);
  color: rgb(255, 255, 255);
  left: -5px;
  right: -6px;
  text-decoration: inherit;
  padding: 10px;
  margin: 5px;
}

.dp__pointer {
  border: none !important;
  margin-top: 4px !important;
  box-shadow: 0 3px 5px #00000005, 0 0 2px #0000000d, 0 1px 4px #00000014 !important;
}
</style>