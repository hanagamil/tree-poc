<!-- <template>
    <div></div>
    <Toast />
  </template>
  
  <script setup lang="ts">
    import { useToast } from "primevue/usetoast";
    const toast = useToast();
//   const instance = (getCurrentInstance() as any);
    setTimeout(() =>
        {
            debugger;
            toast.add({ severity: 'info', summary: 'Info', detail: 'Message Content', life: 3000 });
        }, 100
    );
  </script> -->


<template>
    <b-container>
        <b-row>
            <!-- <Toast position="bottom-right" /> -->
            <!-- <span> {{ "€" + numeral(93872625144).format("0,0.00") }} </span> -->
            <!-- <b-col xl="4">
                <b-form-group label="Customer ID" :state="!v.event.customerId.$invalid">
                    <b-form-input v-model="state.event.customerId" :state="!v.event.customerId.$invalid" />
                </b-form-group>
            </b-col> -->
            <!-- <b-col xl="12" class="my-1">
                <b-form inline class="py-2">
                    <b-button
                        label="Save"
                        @click="submitEvent"
                    />
                </b-form>
            </b-col> -->
        </b-row>
    </b-container>
    
</template>

<script lang="ts">
import { reactive } from 'vue';
import { Vue, Component } from "vue-facing-decorator";
// import { useToast } from "primevue/usetoast";
import { EventBus } from "../../utils/utils.ts";
import numeral from "numeral";
import { required } from "@vuelidate/validators";
import { useVuelidate } from '@vuelidate/core';
import { useModal } from "bootstrap-vue-next";

@Component({
    name: "Test",
    props: {
        testProp: {
            type: String
        }
    }
})
export default class Test extends Vue {
    // public toast = useToast();
    public testProp!: string;
    public numeral = numeral;
    // public event = reactive({
    //     customerId: ""
    // });

    public state = reactive({
        event: {
            customerId: ""
        }
    })

    public rules = {
        event: {
            customerId: {
                required
            }
        }
    }

    public v = useVuelidate(this.rules, this.state);

    public programmaticModal = false;

    public myModal = useModal('my-modal');

    public mounted(): void {
        debugger;
        // alert(this.testProp)
        // this.$authClient();
        // this.toast.add({ severity: 'success', summary: 'my toast', detail: 'Hiiiiiiiii', life: 3000 });
        // EventBus.$emit("my-event", true);
        
        this.myModal.show();
    }

    public submitEvent(): void {
        this.v.$touch();
        if (this.v.$invalid) {
            alert("Invalid");
        } else {
            alert("Valid");
        }
    }
}

</script>