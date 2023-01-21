<template>
    <div class="table">
        <h1>Table Heading</h1>


        <div class="data-type">
            <div class="type-all">
                <ul>
                    <li :class="selectedAction == 'All' ? 'activecat' : 'inactivecat'" @click="categoryChange('All')">
                        All
                    </li>
                    <li :class="selectedAction == 'Paid' ? 'activecat' : 'inactivecat'" @click="categoryChange('Paid')">
                        Paid
                    </li>
                    <li :class="selectedAction == 'Unpaid' ? 'activecat' : 'inactivecat'"
                        @click="categoryChange('Unpaid')">
                        Unpaid
                    </li>
                    <li :class="selectedAction == 'Overdue' ? 'activecat' : 'inactivecat'"
                        @click="categoryChange('Overdue')">
                        Overdue
                    </li>
                </ul>
            </div>

            <div class="total">Total payable amount: <span>$900.00</span> USD</div>
        </div>
        <div class="table-line"></div>

        <div>
            <div class="content-section">
                <div class="card-table">
                    <DataTable v-model:selection="selectedUsers" v-model:expandedRows="expandedRows"
                        :value="selectedData" dataKey="id" v-model:filters="filters1" filterDisplay="menu"
                        :paginator="true" :rows="10"
                        currentPageReportTemplate="Rows per page: {first} - {last} of {totalRecords}"
                        :rowsPerPageOptions="[10]"
                        paginatorTemplate="CurrentPageReport RowsPerPageDropdown FirstPageLink  LastPageLink "
                        responsiveLayout="scroll"
                        :globalFilterFields="['name', 'userAction', 'userStatus', 'paymentStatus', 'paymentAction']"
                        :selectAll="selectAll">
                        <template #header>
                            <div
                                class="table-header-container flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                                <div>
                                    <Button type="button" class="p-button-outlined" @click="clearFilter1()"> <i
                                            class="pi pi-filter-fill"></i> Filter </Button>
                                    <span class="p-input-icon-left">
                                        <InputText class="pi pi-search search-filter" v-model="filters1['global'].value"
                                            placeholder="Search Users by Name, Email or Date" />
                                    </span>
                                </div>
                                <div>
                                    <button class="pay-button">PAY DUES</button>
                                </div>
                            </div>
                        </template>

                        <Column selectionMode="multiple" headerStyle="width: 3em"></Column>
                        <Column :expander="true" headerStyle="width: 3rem" />
                        <Column field="name" header="Name" v-for="(col, index) of selectedColumns" :field="col.field"
                            :header="col.header" :key="col.field + '_' + index">
                            <template #body="slotProps">
                                <div class="user-name">{{ slotProps.data.name }}</div>
                                <div class="user-email">{{ slotProps.data.email }}</div>
                            </template>
                        </Column>

                        <Column field="userStatus" header="User Status">
                            <template #body="slotProps">
                                <div class="user-action"
                                    :class="{ 'active': slotProps.data.userAction == 'Active', 'inactive': slotProps.data.userAction == 'Inactive' }">
                                    <i class="pi pi-circle-fill"></i> {{
                                        slotProps.data.userAction
                                    }}
                                </div>
                                <div class="user-status">{{ slotProps.data.userStatus }}</div>
                            </template>
                        </Column>
                        <Column field="paymentStatus" header="Payment Status">
                            <template #body="slotProps">
                                <div class="status-badge"
                                    :class="{ 'paid': slotProps.data.paymentStatus == 'Paid', 'overdue': slotProps.data.paymentStatus == 'Overdue', 'unpaid': slotProps.data.paymentStatus == 'Unpaid' }">
                                    <i class="pi pi-circle-fill"></i>
                                    {{ slotProps.data.paymentStatus }}
                                </div>
                                <div class="payment-status">{{ slotProps.data.paymentAction }}</div>
                            </template>
                        </Column>
                        <Column field="amount" header="Amount">
                            <template #body="slotProps">
                                <div class="amount">{{ slotProps.data.amount }}</div>
                                <div class="amount-currency">{{ slotProps.data.amountCurrency }}</div>
                                <div class="view-more">View More</div>

                            </template>
                        </Column>
                        <Column class="pi pi-ellipsis-v">
                        </Column>
                        <template #expansion="slotProps">
                            <div class="orders-subtable">
                                <DataTable :value="slotProps.data.orders" responsiveLayout="scroll">
                                    <Column field="date" header="Date"></Column>
                                    <Column field="userActivity" header="User Activity"></Column>
                                    <Column field="userDetail" header="Detail">
                                        <template #body="slotProps">
                                            <span>{{ slotProps.data.date }}</span>
                                            <span>{{ slotProps.data.userActivity }}</span>
                                            <span>{{ slotProps.data.userDetail }}</span>
                                        </template>
                                    </Column>
                                </DataTable>
                            </div>
                        </template>
                    </DataTable>
                </div>
            </div>

        </div>

    </div>
</template>

<script>

import Users from './Users';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
export default {


    data() {
        return {
            selectedUsers: null,
            selectedData: [],
            selectedAction: "",
            selectedCategory: "",
            users: [],
            expandedRows: [],
            filters1: {
                'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
                'name': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
                'userAction': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
                'userStatus': { value: null, matchMode: FilterMatchMode.IN },
                'paymentStatus': { value: null, matchMode: FilterMatchMode.EQUALS },
                'amount': { value: null, matchMode: FilterMatchMode.EQUALS },
                'amountCurrency': { value: null, matchMode: FilterMatchMode.EQUALS }
            },

        }
    },
    userService: null,
    created() {
        this.userService = new Users();

        this.column = this.users

        this.selectedColumns = this.column;
    },
    mounted() {
        this.selectedAction = "All"
        this.userService.getUsers().then(data => {
            this.users = data
            this.selectedData = this.users
        });
    },
    methods: {
        categoryChange(action) {
            this.selectedAction = action
            if (action == "All") {
                this.selectedData = this.users
            }
            else {
                this.selectedData = this.users.filter(x => x.paymentStatus == action)
            }

        },

        onToggle(value) {
            this.selectedColumns = this.columns.filter(col => value.includes(col));
        },

        onRowExpand(event) {
            this.$toast.add({ severity: 'info', summary: 'Product Expanded', detail: event.data.name, life: 3000 });
        },
        onRowCollapse(event) {
            this.$toast.add({ severity: 'success', summary: 'Product Collapsed', detail: event.data.name, life: 3000 });
        },
        expandAll() {
            this.expandedRows = this.products.filter(p => p.id);
            this.$toast.add({ severity: 'success', summary: 'All Rows Expanded', life: 3000 });
        },
        collapseAll() {
            this.expandedRows = null;
            this.$toast.add({ severity: 'success', summary: 'All Rows Collapsed', life: 3000 });
        },
        formatCurrency(value) {
            return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        },
        initFilters1() {
            this.filters1 = {
                'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
                'name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
                'userAction': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
                'userStatus': { value: null, matchMode: FilterMatchMode.IN },
                'paymentStatus': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
                'amount': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
                'amountCurrency': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
            }

        }

    }
}
</script>


<style>
@import '../components/Table.css';
</style>