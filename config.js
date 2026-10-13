// Papeles del Bebé — configuración de monetización
// El checkout real queda separado del checkout de QA para evitar exponer pruebas a usuarios.
window.PAPELES_BEBE_CONFIG = {
  premiumPrice: "9,90 €",
  premiumCheckoutUrl: "",
  premiumLive: false,
  premiumTestCheckoutUrl: "https://buy.stripe.com/test_eVq28saFT1sMatzd0T5os00",
  premiumTestMode: true,
  leadEndpoint: "/api/lead",
  leadEnabled: true
};
