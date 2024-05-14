<template>
    <b-container>
        <b-row>
            <b-col lg="6">
                <tree :customerId="customerId" mode="view" />
            </b-col>
            <b-col lg="6">
                <div class="dropdown">
                    <b-dropdown text="Select Customer">
                        <b-dropdown-item v-for="customer in customerList" :key="customer" @click="updateCustomerId(customer)">
                            {{ customer }}
                        </b-dropdown-item>
                    </b-dropdown>
                </div>
                <breadcrumbs />
            </b-col>
            <!-- <b-col lg="6">
                <test :testProp="testProp" />
            </b-col> -->
        </b-row>
        <!-- <b-modal id="my-modal">
            <div>Hiiiiiiiii</div>
        </b-modal> -->
    </b-container>
    
</template>

<script lang="ts">
import { Vue, Options } from "vue-class-component";
import Breadcrumbs from "./breadcrumbs.vue";
// import Test from "./test.vue";

@Options ({
    components: {
        Breadcrumbs,
        // Test
    }
})
export default class Home extends Vue {
    // public testProp = "Hiiiiiiiiiiiiiiii";
    public customerList = ["bmwadvantage", "mewa", "tkseagpssneu", "vaillant", "sapuc", "test_customer"];
    public customerId = "";

    public updateCustomerId (customer) {
        this.customerId = customer;
    }
}

</script>