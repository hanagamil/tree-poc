export const ROOT_TREE_ELEMENT_ID = "65e0daee-c7bf-4201-a7c9-5ea53b9745bb";

export function getIconFromEventType(status) {
    const mapping = {
      ok: "check-circle",
      warning: "exclamation-circle",
      error: "times-circle",
      maintenance: "pause-circle",
      disabled: "stop-circle",
      info: "info-circle"
    };
    return mapping[status];
};