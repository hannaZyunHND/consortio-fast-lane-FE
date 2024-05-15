<template>
    <div class="popup-content">
        <span class="title-header">Customer Information Image</span>
        <div class="customer-image">
            <div class="image">
                <span>Passport image below
                    <a :href="getCompleteImageUrl(orderData.passport_File)" download="abc.jpg"><i class="pi pi-download"
                            style="font-size: 1rem"></i>
                    </a>
                </span>
                <img :src="getCompleteImageUrl(orderData.passport_File)" alt="Passport Image">
            </div>

            <div class="image">
                <span>Visa image below
                    <a :href="orderData.visa_File" download>
                        <i class="pi pi-download" style="font-size: 1rem"></i>
                    </a>
                </span>
                <img :src="getCompleteImageUrl(orderData.visa_File)" alt="Visa Image">
            </div>

            <div class="image">
                <span>Portrait image below
                    <a :href="orderData.portrait_File" download>
                        <i class="pi pi-download" style="font-size: 1rem"></i>
                    </a>
                </span>
                <img :src="getCompleteImageUrl(orderData.portrait_File)" alt="Portrait Image">
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'ImagePopup',
    props: {
        orderId: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            orderData: {
                visa_File: '',
                passport_File: '',
                portrait_File: ''
            }
        };
    },
    mounted() {
        this.fetchOrder(this.orderId);
    },

    methods: {
        fetchOrder(item) {
            console.log('do là item', item)
            const apiUrl = process.env.VUE_APP_API_URL;
            axios.get(`${apiUrl}/order/${item}`)
                .then(response => {
                    const responseData = response.data;
                    console.log(responseData)
                    if (responseData) {
                        this.orderData.visa_File = responseData.visa_File;
                        this.orderData.passport_File = responseData.passport_File;
                        this.orderData.portrait_File = responseData.portrait_File;
                    }
                })
                .catch(error => {
                    console.error('Error fetching user data:', error);
                });
        },
        getCompleteImageUrl(imagePath) {
            const apiUrl = process.env.VUE_APP_API_URL;

            return `${apiUrl}/${imagePath}`;
        }
    }
}
</script>

<style scoped>
.popup-content {
    width: fit-content;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.customer-image {
    gap: 10px;
    display: flex;
}

.image {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

img {
    width: 300px;
    height: 300px;
    border-radius: 5px;
    box-shadow: 0 3px 5px #00000005, 0 0 2px #0000000d, 0 1px 4px #00000014;
}
</style>
