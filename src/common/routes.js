import Home from "../components/home/home.vue";
import FlatTree from "../components/flat-tree/flat-tree.vue";

export default [
    { path: "/", name: "Home", component: Home },
    {
        path: "/tree/:treeId",
        name: "HomeTreeRoot",
        component: Home
    },
    {
      path: "/tree/:treeId/:target(te|tg)/:parentId/:id",
      name: "HomeTreeElementOrGroup",
      component: Home
    },
    {
      path: "/flat-tree",
      name: "FlatTree",
      component: FlatTree,
      props: { selected: [] }
    }
]