<template>
    <div class="signup row">
        <img src="~@/assets/logo1.jpg" class="signup-image col-md-6"/>
       
        <div class="signup-form col-md-6">
            <h2>Sign up</h2>
            <form enctype="multipart/form-data" @submit.prevent="submitForm">
                <label for="username">UserName:</label>
                <input type="text" v-model="formData.name" name="username" placeholder="Your name">

                <label for="email">Email:</label>
                <input type="text" v-model="formData.email" name="email" placeholder="user@gmail.com">

                <label for="password">Password:</label>
                <input type="password" v-model="formData.password" name="password" placeholder="Your password">

                <button type="submit" class="btn-register-primary">Save</button>
            </form>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import '@/styles/auth/register.css'
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import router from '@/router';

export default {
    name: 'RegisterPage',
    data() {
        return {
            formData: {
                name: '',
                email: '',
                password: '',
            },
        };
    },
    setup() {
        const success = () => {
            toast("Add account successfully !", {
                autoClose: 3000,
                type: "success"
            });
        }
        return { success };
    },
    methods: {
        submitForm() {
            const apiUrl = process.env.VUE_APP_API_URL;
            axios.post(`${apiUrl}/user/create`, this.formData)
                .then(() => {
                    this.success();
                    router.push('/login');
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        },
        // resetForm() {
        //     for (let key in this.formData) {
        //         this.formData[key] = '';
        //     }
        // },
    },
}
</script>
<style scoped>
body {
    background: rgb(255, 255, 255);
    padding: 65px 40px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.signup {
    box-shadow: -2px 1px 12px 4px rgba(0, 0, 0, 0.2);
    margin: auto;
    margin-top: 10%;
    border-radius: 10px;
    background: white;
    display: flex;
    max-width: 1000px;
}

.signup-image {
    border-bottom-left-radius: 10px;
    border-top-left-radius: 10px;
    flex: 1;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    padding: 0 !important;
}

.signup-form {
    flex: 1;
    padding: 20px;
}

input[type="text"],
input[type="email"],
input[type="password"] {
    margin: 8px 0 15px;
    width: 100%;
    border: 2px solid #dfe4e9;
    padding: 10px;
    border-radius: 5px;
}

.btn-register-primary {
    background: #3D66F6;
    border: none;
    color: white;
    font-size: 14px;
    border-radius: 5px;
    padding: 15px;
    margin-top: 10px;
    width: 100%;
}
</style>
