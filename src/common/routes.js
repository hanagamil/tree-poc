import Tree from "../components/tree/tree.vue";

export default [
    { path: "/", name: "Home", component: Tree },
    {
        path: "/tree/:treeId",
        name: "HomeTreeRoot",
        component: Tree
    },
    {
      path: "/tree/:treeId/:target(te|tg)/:parentId/:id",
      name: "HomeTreeElementOrGroup",
      component: Tree
    }
]