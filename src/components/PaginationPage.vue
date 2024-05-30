<template>
    <div class="pagination">
        <button @click="prevGroup" :disabled="currentPage === 1">Previous</button>
        <template v-if="totalPages > 0">
            <div v-for="page in visiblePages" :key="page">
                <button @click="goToPage(page)" :class="{ 'active': currentPage === page }">{{ page }}</button>
            </div>
        </template>
        <button @click="nextGroup" :disabled="currentPage === totalPages">Next</button>
    </div>
</template>

<script>
export default {
    props: ['currentPage', 'totalPages'],
    data() {
        return {
            pageSize: 10,
        };
    },
    computed: {
        visiblePages() {
            const start = Math.max(1, this.currentPage - Math.floor(this.pageSize / 2));
            const end = Math.min(this.totalPages, start + this.pageSize - 1);
            return Array.from({ length: end - start + 1 }, (_, i) => start + i);
        }
    },
    methods: {
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.$emit('nextPage');
            }
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.$emit('prevPage');
            }
        },
        goToPage(page) {
            if (page !== this.currentPage) {
                this.$emit('goToPage', page);
            }
        },
        nextGroup() {
            this.goToPage(Math.min(this.currentPage + this.pageSize, this.totalPages));
        },
        prevGroup() {
            this.goToPage(Math.max(1, this.currentPage - this.pageSize));
        }
    }
}
</script>

<style scoped>
.pagination {
    margin: 10px 20px 10px 20px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.pagination button {
    margin: 0 5px;
    padding: 5px 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #fff;
    cursor: pointer;
}

.pagination button.active {
    background-color: #007bff;
    color: #fff;
}

.pagination button:disabled {
    /* opacity: 0.5; */
    cursor: not-allowed;
}
</style>
