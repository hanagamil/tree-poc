<template>

    <div class="card flex flex-column align-items-cente">
        <div v-if="!editMode && !addMode" class="flex flex-wrap gap-2 mb-4">
            <button type="button" @click="edit">Edit!</button>
            <button type="button" @click="add">Add!</button>

        </div>
        <div v-else class="flex flex-wrap gap-2 mb-4">
            <button type="button" @click="cancel">Cancel!</button>
            <button type="button" @click="Save">Save!</button>

        </div>
    </div>
    <tree v-model:expandedKeys="expandedKeys" :value="nodes" class="tree" loadingMode="icon" selectionMode="single"
        @node-expand="onNodeExpand" @nodeSelect="onNodeSelect" :expanded-keys="expandedKeys"
        @nodeUnselect="onNodeUnselect">
        <template #togglericon="{ node, expanded }">
            <fai v-if="expanded && (!node.children || node.children.length > 0)" icon="angle-down" size="sm" />
            <fai v-else-if="!node.children || node.children.length > 0" icon="angle-right" size="sm" />
        </template>
        <template #root="{ node }">
            <fai class="tree-icon" icon="list" />
            <span class="tree-label">{{ node.data.name }}</span>
            <div v-if="editMode || addMode">
                <fai class="tree-icon" icon="trash" :onclick="deleteNode" />
                <fai class="tree-icon" icon="plus" :onclick="addNode" />
            </div>
        </template>
        <template #group="{ node }">
            <fai class="tree-icon" :icon="['far', 'clone']" />
            <span class="tree-label">{{ node.data.name }}</span>
            <fai class="tree-icon filter-icon" icon="ellipsis-v" />
            <span v-if="node.children && node.children.length > 0" class="tree-num">{{ "(#" + node.children.length +
            ")" }}</span>
            <i v-if="node.childrenLoading" class="pi pi-spin pi-spinner"></i>
            <div v-if="editMode || addMode">
                <fai class="tree-icon" icon="trash" :onclick="deleteNode" />
                <fai class="tree-icon" icon="plus" :onclick="addNode" />
            </div>
        </template>
        <template #element="{ node }">
            <fai v-if="node.data.status" class="tree-icon status-icon" :class="`text-${node.data.status}`"
                icon="circle" />
            <fai v-else class="tree-icon" icon="list" />
            <span class="tree-label">{{ node.data.name }}</span>
            <i v-if="node.childrenLoading" class="pi pi-spin pi-spinner"></i>
            <div v-if="editMode || addMode">
                <fai class="tree-icon" icon="trash" :onclick="deleteNode" />
                <fai class="tree-icon" icon="plus" :onclick="addNode" />
            </div>
        </template>
    </tree>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { NodeService } from '../../services/NodeService';
import { ROOT_TREE_ELEMENT_ID } from "../../common/constants";

const nodes = ref(null);
const router = useRouter();
const route = useRoute();
const expandedKeys = ref({});
const editMode = ref(false);
const addMode = ref(false);

onMounted(() => {
    loadTrees();
});

const loadTrees = () => {
    NodeService.getTreeNodes().then((data) => (nodes.value = data));

    const { treeId, id, parentId, target } = route.params;

    if (treeId && id && parentId && parentId !== ROOT_TREE_ELEMENT_ID) { // tree element or group & parent is not tree root
        NodeService.getTreeWithParentsNodes(
            treeId,
            target === "te" ? id : parentId,
            target === "tg"
        ).then(treewithParents => {
            nodes.value.splice(
                nodes.value.findIndex((node) => node.key === treeId),
                1,
                treewithParents
            );
            openTreeItem(treeId, id, parentId);
        });
    } else if (treeId) { // tree root or group & parent is tree root
        expandedKeys.value[treeId] = true;
        if (id && parentId && parentId === ROOT_TREE_ELEMENT_ID) {
            expandedKeys.value[id] = true;
        }
    }
};

const openTreeItem = (treeId, id, parentId) => {
    const expandNode = (node) => {
        if (node.key === id && node.ancestors.length > 0 && node.ancestors[node.ancestors.length - 1].key === parentId) {
            node.ancestors.forEach(ancestor => {
                expandedKeys.value[ancestor.key] = true;
            });
            expandedKeys.value[node.key] = true;
        } else if (node.children) {
            for (let child of node.children) {
                expandNode(child);
            }
        }
    };
    const selectedTree = nodes.value.find(node => node.key === treeId);
    expandNode(selectedTree);
}

const onNodeExpand = (node) => {
    router.replace({ path: node.path });
    if (!node.children) {
        node.childrenLoading = true;
        if (node.type === "group") {
            if (!node.children || node.children.length === 0) {
                NodeService.getTreeElementsNodes(node).then((data) => {
                    node.children = data;
                    node.childrenLoading = false;
                });
            }
        } else if (node.type === "element") {
            setTimeout(() => {
                node.children = [];
                node.childrenLoading = false;
            }, 2000);
        }
    }
};

const edit = () => {
    editMode.value = true;
    // console.log(node);
    nodes.value[0].data.name = "Updated Node 1.1";
    const treeId = "580c77d9-e1d1-4448-b978-18446ba5be7a";
    NodeService.getTreeNodesbyId(treeId).then((data) => {
        nodes.value = data;
        console.log(nodes.value);

    });

};
const add = () => {
    alert("add");
    addMode.value = true;
    let data = NodeService.getNewTreeNodes()
    nodes.value = data;
    console.log(nodes.value);
};
const cancel = () => {
    addMode.value = false;
    editMode.value = false;
    alert("cancle");
    NodeService.getTreeNodes().then((data) => {
        (nodes.value = data);
    })
};
const save = () => {
    addMode.value = false;
    editMode.value = false;
    alert("save");
}
const expandNode = (node) => {
    if (expandedKeys.value[node.key]) {
        expandedKeys.value[node.key] = false;
        return;
    }
    if (node.children && node.children.length) {
        expandedKeys.value[node.key] = true;

        // for (let child of node.children) {
        //     expandNode(child);
        // }
    }
    else {
        NodeService.getTreeElementsNodes(node).then((data) => {
            node.children = data;
            if (node.children && node.children.length) {
                expandedKeys.value[node.key] = true;
            }
        });

    }
};

const deleteNode = (e) => {
    e.stopPropagation();
    alert("delete");
}
const addNode = (e) => {
    e.stopPropagation();
    alert("add Node");
}

const onNodeSelect = (node) => {
    alert("node selected");
    expandNode(node);
    expandedKeys.value = { ...expandedKeys.value };
};
const onNodeUnselect = (node) => {
    alert("node unselected");
    expandedKeys.value[node.key] = false;
}
</script>

<style>
.tree {
    font-size: 13px;
    color: black;
    --p-focus-ring-color: none;
}

.tree .p-tree-toggler {
    width: 18px;
    color: black;
    background: none;
}

.tree li {
    padding-left: 18px;
}

.tree li .tree-icon {
    margin: 0 5px;
}

.tree li .tree-icon.filter-icon {
    cursor: pointer;
    width: 15px;
    margin: 0;
}

.tree li .tree-icon.status-icon {
    font-size: 10px;
    vertical-align: baseline;
    width: 13px;
}

.tree li .tree-icon.status-icon.text-ok {
    color: #5cb85c;
}

.tree li .tree-icon.status-icon.text-error {
    color: #d9534f;
}

.tree li .tree-icon.status-icon.text-disabled {
    color: gray;
}

.tree li[aria-expanded="true"]>div .tree-label {
    color: #5f249f;
}

.tree li .tree-label {
    cursor: pointer;
    margin: 0 5px;
}

.tree li .pi-spinner {
    margin: 0 10px;
    font-size: 14px;
    vertical-align: bottom;
}

.tree li .tree-num {
    color: #666;
    margin: 0 5px;
}
</style>