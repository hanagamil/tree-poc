
<template>
    <div class="card flex flex-wrap p-fluid gap-3">
         <div class="flex-auto md:flex md:justify-content-start md:align-items-center flex-column">
            <label for="mask" class="font-bold block mb-2">Mask Mode</label>
            <tree :value="nodes" @node-expand="onNodeExpand" :loading="loading" class="w-full md:w-30rem"></tree>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { NodeService } from '../../services/NodeService';

const nodes = ref(null);
const loading = ref(false);

onMounted(() => {
    loading.value = true;
    setTimeout(() => {
        nodes.value = initateNodes();
        loading.value = false;
    }, 2000);
});

const onNodeExpand = (node) => {
    if (!node.children) {
        loading.value = true;

        setTimeout(() => {
            let _node = { ...node };

            _node.children = [];

            for (let i = 0; i < 3; i++) {
                _node.children.push({
                    key: node.key + '-' + i,
                    label: 'Lazy ' + node.label + '-' + i
                });
            }

            let _nodes = { ...nodes.value };
            _nodes[parseInt(node.key, 10)] = _node;

            nodes.value = _nodes;
            loading.value = false;
        }, 500);
    }
};

const initateNodes = () => {
    return [
        {
            key: '0',
            label: 'Node 0',
            leaf: false,
            children: [{
                key: '01',
                label: 'Node 01',
                leaf: false
            }]
        },
        {
            key: '1',
            label: 'Node 1',
            leaf: false
        },
        {
            key: '2',
            label: 'Node 2',
            leaf: false
        }
    ];
};
</script>
