<template>
    <div class="popup-content" v-if="orderData">
        <h4 class="title-header">Customer Information Image</h4>
        <div class="customer-image row">
    <div class="image col-md-4 mb-3">
        <span>
            Passport image below
            <a :href="getCompleteImageUrl(orderData.passport_Path)" download="abc.jpg">
                <i class="pi pi-download" style="font-size: 1rem"></i>
            </a>
        </span>
        <img :src="getCompleteImageUrl(orderData.passport_Path)" alt="Passport Image" class="img-fluid">
    </div>

    <div class="image col-md-4 mb-3">
        <span>
            Visa image below
            <a :href="orderData.visa_Path" download>
                <i class="pi pi-download" style="font-size: 1rem"></i>
            </a>
        </span>
        <img :src="getCompleteImageUrl(orderData.visa_Path)" alt="Visa Image" class="img-fluid">
    </div>

    <div class="image col-md-4 mb-3">
        <span>
            Portrait image below
            <a :href="orderData.portrait_Path" download>
                <i class="pi pi-download" style="font-size: 1rem"></i>
            </a>
        </span>
        <img :src="getCompleteImageUrl(orderData.portrait_Path)" alt="Portrait Image" class="img-fluid">
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
            orderData: null
        };
    },
    mounted() {
        this.maintainFetchOrder();
    },

    methods: {
        maintainFetchOrder() {
            axios.get(`${process.env.VUE_APP_API_URL}/MaintainOrderDetails/GetById/${this.orderId}`).then((response) => {
                console.log(response.data)
                this.orderData = response.data

            })
        },
        fetchOrder(item) {

            const apiUrl = process.env.VUE_APP_API_URL;
            axios.get(`${apiUrl}/order/${item}`)
                .then(response => {
                    const responseData = response.data;
                    console.log(responseData)
                    if (responseData) {
                        this.orderData.visa_File = responseData.visa_Path;
                        this.orderData.passport_File = responseData.passport_Path;
                        this.orderData.portrait_File = responseData.portraint_Path;
                    }
                })
                .catch(error => {
                    console.error('Error fetching user data:', error);
                });
        },
        getCompleteImageUrl(imagePath) {
            const apiUrl = process.env.VUE_APP_API_URL.replace('/api','');

            return `${apiUrl}/${imagePath}`;
        }
    }
}
</script>

<style scoped>
.popup-content {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.customer-image {
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
