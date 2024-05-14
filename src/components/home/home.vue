<template>
    <b-container>
        <b-row>
            <b-col lg="6">
                <tree />
            </b-col>
            <b-col lg="6">
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
}

</script>