const PARASITES = [
  {
    // Inside the Giardia object (id:1)
image: "https://wwwn.cdc.gov/phil/image/3743.jpg",   // direct trophozoite
microImage: "https://wwwn.cdc.gov/phil/image/22462.jpg", // direct cyst

// Inside the Crypto object (id:2)
image: "https://wwwn.cdc.gov/phil/image/7829.jpg",   // direct acid-fast oocysts
microImage: "",
  },
  // ... (Continue the exact same pattern for id 3 to id 24)
  // For the remaining parasites, use this template and fill from https://www.cdc.gov/dpdx/az.html
  // Example for id 3 (Toxoplasma):
  // {
  //   id:3, name:"Toxoplasma gondii", common:"Toxo", cat:"protozoa", risk:"high",
  //   // ... all your original fields ...
  //   regionEmoji: "🌍",
  //   image: "https://wwwn.cdc.gov/phil/Details.aspx?pid=1460",
  //   imageAlt: "Toxoplasma gondii tachyzoites",
  //   microImage: "https://wwwn.cdc.gov/phil/Details.aspx?pid=1461",
  //   video: "",
  //   lifecycleImage: "https://www.cdc.gov/dpdx/toxoplasmosis/modules/Toxoplasma_LifeCycle_lg.jpg"
  // },
];
