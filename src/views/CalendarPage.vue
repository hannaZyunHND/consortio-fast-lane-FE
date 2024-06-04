<template>
    <Qalendar :events="events" :config="config" />
</template>

<script>
import { Qalendar } from "qalendar";
import "qalendar/dist/style.css";
import axios from 'axios';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

export default {
    components: {
        Qalendar,
    },

    data() {
        return {
            config: {
                style: {
                    colorSchemes: {
                        pending: {
                            color: '#fff',
                            backgroundColor: '#FFFF00',
                        },
                        confirmed: {
                            color: '#fff',
                            backgroundColor: '#0000FF',
                        },
                        canceled: {
                            color: '#fff',
                            backgroundColor: '#FF0000',
                        },
                        completed: {
                            color: '#fff',
                            backgroundColor: '#00FF00',
                        },
                        uncompleted: {
                            color: '#fff',
                            backgroundColor: '#FFA500',
                        },
                    },
                },
            },
            events: []
        }
    },

    mounted() {
        this.fetchEvents();
    },

    methods: {
        async fetchEvents() {
            const apiUrl = process.env.VUE_APP_API_URL;
            const fromDate = moment().startOf('month').format('YYYY-MM-DD');
            const toDate = moment().endOf('month').format('YYYY-MM-DD');

            try {
                const response = await axios.get(`${apiUrl}/orders?fromDate=${fromDate}&toDate=${toDate}`);
                const dataOrder = response.data;

                this.events = dataOrder.map(item => ({
                    title: item.Name,
                    time: {
                        start: this.formatDate(item.Service_Time),
                        end: this.formatDate(item.Service_Time)
                    },
                    colorScheme: this.getColorScheme(item.Status),
                    id: uuidv4(),
                }));
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        },

        formatDate(dateString) {
            return moment(dateString).format('YYYY-MM-DD HH:mm');
        },

        getColorScheme(status) {
            switch (status) {
                case 'Pending':
                    return 'pending';
                case 'Confirmed':
                    return 'confirmed';
                case 'Canceled':
                    return 'canceled';
                case 'Completed':
                    return 'completed';
                case 'Uncompleted':
                    return 'uncompleted';
                default:
                    return 'pending';
            }
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

.calendar-month__event.is-event.is-draggable {
    top: 0px;
    background-color: rgb(165, 215, 167);
    color: rgb(255, 255, 255);
    left: -5px;
    right: 0px;
    text-decoration: inherit;
}
</style>
