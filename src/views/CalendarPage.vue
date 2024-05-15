<template>
    <Qalendar :selected-date="new Date(2022, 0, 8)" :events="events" :config="config" />
</template>

<script>
import { Qalendar } from "qalendar";
import "qalendar/dist/style.css";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'; // Import uuid function
import moment from 'moment'; // Import moment library

export default {
    components: {
        Qalendar,
    },

    data() {
        return {
            events: [],
            config: {
                locale: "en-US",
                defaultMode: "month",
                style: {
                    colorSchemes: {
                        meetings: {
                            color: "#2e2e2e",
                            backgroundColor: "#131313",
                        },
                        sports: {
                            color: "#2e2e2e",
                            backgroundColor: "#ff4081",
                        },
                    },
                },
            },
        };
    },

    mounted() {
        this.fetchEvents();
    },

    methods: {
        async fetchEvents() {
            const apiUrl = process.env.VUE_APP_API_URL;
            try {
                const response = await axios.get(`${apiUrl}/order`);
                const dataOrder = response.data;
                console.log("data of order", dataOrder);

                this.events = dataOrder.map(item => ({
                    title: item.name,
                    with: item.email,
                    time: {
                        start: this.formatDate(item.departure_Time),
                        end: this.formatDate(item.departure_Time)
                    },
                    group: item.groupPreference,
                    description: item.note,
                    color: item.status === 'Pending' ? 'yellow' : (item.status === 'Success' ? 'green' : 'red'), // Màu sự kiện dựa trên status
                    isEditable: true,
                    id: uuidv4(),
                }));

            } catch (error) {
                console.error('Error fetching events:', error);
            }
        },

        formatDate(dateString) {
            return moment(dateString).format('YYYY-MM-DD HH:mm'); // Format date using moment.js
        },

    },
};
</script>

<style scoped>
@media (prefers-color-scheme: dark) {
    .calendar-root-wrapper .calendar-root {
        background: white;
        color: #fff;
        border-color: transparent;
    }
}

.calendar-month__event is-event is-draggable {
    top: 0px;
    background-color: rgb(165, 215, 167);
    color: rgb(255, 255, 255);
    left: -5px;
    right: 0px;
    text-decoration: inherit;
}
</style>
