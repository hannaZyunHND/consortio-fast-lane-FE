<template>
    <div class="popup-content">
        <h2 style="color:black">Change Password</h2>
        <form enctype="multipart/form-data" @submit.prevent="submitForm" id="edit-service-form">
            <div class="row">
                <label for="password" style="color:black">Old Password:</label>
                <input type="text" v-model="formData.old_Password" placeholder="Your old password" />
            </div>
            <div class="row">
                <label for="password" style="color:black">New Password:</label>
                <input type="text" v-model="formData.new_Password" placeholder="Your new password" />
            </div>
            <div class="row">
                <label for="password" style="color:black">Confirm Password:</label>
                <input type="text" v-model="formData.confirm_Password" placeholder="Your confirm password" />
                <span v-if="!passwordsMatch" style="color: red;">Passwords do not match</span>
            </div>
            <button type="submit" class="btn-add-primary">Save</button>
        </form>
    </div>
</template>

<script>
import axios from "axios";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
    name: "Chang_Password",
    props: {
        userId: {
            type: Number,
            required: true,
        },

    },
    data() {
        return {
            formData: {
                user_id: "",
                old_Password: "",
                new_Password: "",
            },
            passwordsMatch: true,
        };
    },
    setup() {
        const success = () => {
            toast("Update password successfully !", {
                autoClose: 500,
                type: "success",
            });
        };
        return { success };
    },
    methods: {
        submitForm() {
            if (this.formData.new_Password !== this.formData.confirm_Password) {
                this.passwordsMatch = false;
                return;
            }
            const apiUrl = process.env.VUE_APP_API_URL;
            const user_id = localStorage.getItem("user_id");
            this.formData.user_id = user_id;


            console.log(this.formData);
            axios
                .post(`${apiUrl}/MaintainUsers/Change_Password`, this.formData)
                .then(() => {
                    this.success();
                    //-----------
                    const clickEvent = new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });

                    // Phát ra sự kiện click trên document
                    document.dispatchEvent(clickEvent);
                    this.$emit("reloadPage");
                })
                .catch((error) => {
                    console.error("Error updating service:", error);
                });
        },
    },
};
</script>
<style scoped>
.popup-content {
    z-index: 999;
    width: 50%;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

@media (max-width:768px) {

    .popup-content {
        width: 90% !important;

    }
}

#edit-service-form {
    display: flex;
    flex-direction: column;
}

.row {
    display: flex;
    flex-direction: column;
}

input[type="text"] {
    border: 1px solid #e6eae9;
    margin: 10px 0px;
    border-radius: 5px;
    padding: 10px;
}

select {
    border: 1px solid #e6eae9;
    margin: 10px 0px;
    border-radius: 5px;
    padding: 10px;
}

.btn-add-primary {
    background: black;
    border: none;
    color: white;
    font-size: 14px;
    border-radius: 5px;
    padding: 15px;
}
</style>