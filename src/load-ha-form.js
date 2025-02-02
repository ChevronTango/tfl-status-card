const whenCreate = async (element) => {
  await customElements.whenDefined(element);
  return document.createElement(element);
}

// Helps us to preload ha-entity-picker which can then be used by our controls

export const loadHaForm = async () => {
  if (customElements.get("ha-checkbox") && customElements.get("ha-slider") && customElements.get("ha-combo-box")) return;


  const ppr = await whenCreate('partial-panel-resolver');
  ppr.hass = {
    panels: [{
      url_path: "tmp",
      component_name: "config",
    }]
  };
  ppr._updateRoutes();
  await ppr.routerOptions.routes.tmp.load();

  const cpr = await whenCreate("ha-panel-config");
  await cpr.routerOptions.routes.automation.load();
}