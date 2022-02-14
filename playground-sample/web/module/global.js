
// local
// const token = "Mi6F6bioooAjGrS7nP1DPqPgYoJniEw8";
// const target = "https://cupix.dev.cupix.works";
const token = "pTqdixG8g2fLkdLyu2f0fGeZNvlQEgPF";
const target = "https://apidemo.cupix.works";

const facilities = [
  // local
  // {
  //   id: "fa-1",
  //   title: "Stanford Central Energy Facility",
  //   siteViewKey: "rvqkch",
  //   levelId: 3841,
  //   captureId: 5151,
  //   annotation: {
  //     layerId: 2741,
  //     formDesignId: 31,
  //   },
  //   utilities: [
  //     {
  //       id: "ut-1",
  //       title: "Generator",
  //       sensors: [
  //         {
  //           id: "se-1",
  //           title: "GEN-TURB-001",
  //           lookAt: [34.277655919601116, -13.519828718953224, 0],
  //           normal: [2, 1],
  //         },
  //         {
  //           id: "se-1",
  //           title: "GEN-TURB-002",
  //           lookAt: [
  //             34.277655919601116, -14.519828718953224, 1.8745094885332523,
  //           ],
  //           normal: [0.5, 1.5],
  //         },
  //         {
  //           id: "se-1",
  //           title: "GEN-EL-004512",
  //           lookAt: [34.95691348181549, -3.483489364609671, 0],
  //           normal: [0, 1],
  //         },
  //         {
  //           id: "se-1",
  //           title: "GEN-PR-004532",
  //           lookAt: [23.91891279105208, -31.34853085989837, 1.9159067032779364],
  //           normal: [-1, 0],
  //         },
  //       ],
  //     },
  //     {
  //       id: "ut-2",
  //       title: "Cooling",
  //       disabled: true,
  //     },
  //     {
  //       id: "ut-3",
  //       title: "HVAC",
  //       disabled: true,
  //     },
  //     {
  //       id: "ut-4",
  //       title: "Network",
  //       disabled: true,
  //     },
  //   ],
  // },
  {
    id: "fa-1",
    title: "Stanford Central Energy Facility",
    siteViewKey: "9hivpe82w8",
    levelId: 17872,
    captureId: 14929,
    annotation: {
      formDesignId: 1529
    },
    utilities: [
      {
        id: "ut-1",
        title: "Generator",
        sensors: [
          {
            id: "se-1",
            title: "GEN-TURB-001",
            lookAt: [30.069420772880356, 15.550932460845633, 2.8790764937247832],
            normal: [1, 2],
          },
          {
            id: "se-1",
            title: "GEN-TURB-002",
            lookAt: [
              29.59331574239744,
              13.533437955528932,
              1.923392272819295
            ],
            normal: [1, 1],
          },
          {
            id: "se-1",
            title: "GEN-EL-004512",
            lookAt: [
              29.779445740500613,
              23.571481387199135,
              1.9070641590403041
            ],
            normal: [0, 1],
          },
          {
            id: "se-1",
            title: "GEN-PR-004532",
            lookAt: [
              19.789162196110038,
              -3.248367673558766,
              1.916706461596184
            ],
            normal: [-1, 0],
          },
        ],
      },
      {
        id: "ut-2",
        title: "Cooling",
        disabled: true,
      },
      {
        id: "ut-3",
        title: "HVAC",
        disabled: true,
      },
      {
        id: "ut-4",
        title: "Network",
        disabled: true,
      },
    ],
  },
  {
    id: "fa-2",
    title: "Nordstrom Emergency Generator",
  },
  // local
  // {
  //   id: "fa-3",
  //   title: "Stanford Hospital Machine Room",
  //   siteViewKey: "8g7mun",
  //   levelId: 644,
  //   captureId: 1097,
  //   annotation: {
  //     layerId: 2744,
  //     formDesignId: 31,
  //   },
  //   utilities: [
  //     {
  //       id: "ut-1",
  //       title: "Generator",
  //       sensors: [
  //         {
  //           id: "se-1",
  //           title: "GEN-TURB-001",
  //           lookAt: [
  //             -10.218512050794944, 7.109362295665051, 1.3900202237555286,
  //           ],
  //           normal: [-1, -1],
  //         },
  //         {
  //           id: "se-1",
  //           title: "GEN-TURB-002",
  //           lookAt: [-8.559498164758221, 8.802570791464378, 1.4002393915397509],
  //           normal: [0, 1],
  //         },
  //         {
  //           id: "se-1",
  //           title: "GEN-EL-004512",
  //           lookAt: [-7.37022958183257, 8.785483588508814, 1.4045116770168367],
  //           normal: [0, 1],
  //         },
  //       ],
  //     },
  //     {
  //       id: "ut-2",
  //       title: "Cooling",
  //       disabled: true,
  //     },
  //     {
  //       id: "ut-3",
  //       title: "HVAC",
  //       disabled: true,
  //     },
  //     {
  //       id: "ut-4",
  //       title: "Network",
  //       disabled: true,
  //     },
  //   ],
  // },
];

const navItems = {
  title: "Energy Facility (US)",
  children: [
    {
      title: "West",
      children: [
        { title: "WA" },
        {
          title: "CA",
          children: [
            { title: "San Jose" },
            { title: "Stockton" },
            { title: "Stanford", active: true },
          ],
        },
        { title: "OR" },
        { title: "NV" },
        { title: "AZ" },
        { title: "ID" },
      ],
    },
    {
      title: "Central",
    },
  ],
};
