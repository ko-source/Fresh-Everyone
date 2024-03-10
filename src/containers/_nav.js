export default [
  // {
    // 
  //   _tag: 'CSidebarNavDropdown',
  //   name: "Order Management",
  //   // to: "/videos",
  //   icon: "cil-speedometer",
  //   _children: [
  //     {
  //       _tag: "CSidebarNavItem",
  //       name: "Order Management",
  //       to: "/users",
  //     },
  //     // {
  //     //   _tag: "CSidebarNavItem",
  //     //   name: "Shop Order Management",
  //     //   to: "/users/shop-order",
  //     // },
  //     // {
  //     //   _tag: "CSidebarNavItem",
  //     //   name: "Hotel Order Management",
  //     //   to: "/users/hotel-order",
  //     // },
  //     // {
  //     //   _tag: "CSidebarNavItem",
  //     //   name: "Handy Order Management",
  //     //   to: "/users/handy-order",
  //     // },
  //     {
  //       _tag: "CSidebarNavItem",
  //       name: "Cancelled Order",
  //       to: "/users/cancelled-order",
  //     },
  //   ],
  // },
  {
    _tag: "CSidebarNavItem",
    name: "User Management",
    to: "/blogs/user-Orderhistory",
    icon: "cil-speedometer",
    // badge: {
    //   color: "info",
    //   text: "NEW",
    // },
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: "Vendor Management",
    // to: "/videos",
    icon: "cil-speedometer",
    _children: [
       
        {
          _tag: "CSidebarNavItem",
          name: "Vendor List",
          to: "/blogs/vendor-Orderhistory",
        },
        {
          _tag: "CSidebarNavItem",
          name: "WithDraw Vendor",
          to: "/withdrawvendor",
        },
    ],
  },
  // {
  //   _tag: "CSidebarNavItem",
  //   name: "Vendors List",
  //   to: "/blogs/vendor-Orderhistory",
  //   icon: "cil-speedometer",
  //   // badge: {
  //   //   color: "info",
  //   //   text: "NEW",
  //   // },
  // },
  // {
  //   _tag: "CSidebarNavItem",
  //   name: "Rider Management",
  //   to: "/property-pg",
  //   icon: "cil-speedometer",
  //   // badge: {
  //   //   color: "info",
  //   //   text: "NEW",
  //   // },
  // },
  {
    _tag: 'CSidebarNavDropdown',
    name: "Rider",
    icon: "cil-speedometer",
    _children: [
        {
          _tag: "CSidebarNavItem",
          name: "Rider Management",
          to: "/property-pg",
        },
        {
          _tag: "CSidebarNavItem",
          name: "Withdraw Request",
          to: "/property-pg/withdraw",
        },
        {
          _tag: "CSidebarNavItem",
          name: "Rider Charges",
          to: "/property-pg/charges",
        }]
      },
  
  // {
  //   _tag: "CSidebarNavItem",
  //   name: "Edit Room Management",
  //   to: "/edit-vendorrooms",
  //   icon: "cil-speedometer",
  //   // badge: {
  //   //   color: "info",
  //   //   text: "NEW",
  //   // },
  // },
  // {
  //   _tag: "CSidebarNavItem",
  //   name: "Delete Room Management",
  //   to: "/delete-vendorrooms",
  //   icon: "cil-speedometer",
  //   // badge: {
  //   //   color: "info",
  //   //   text: "NEW",
  //   // },
  // },
  // {
  //   _tag: "CSidebarNavItem",
  //   name: "Notification To Vendor",
  //   to: "/room-notification",
  //   icon: "cil-speedometer",
  //   // badge: {
  //   //   color: "info",
  //   //   text: "NEW",
  //   // },
  // },
  // {
  //   _tag: "CSidebarNavItem",
  //   name: "Event List",
  //   to: "/event-list",
  //   icon: "cil-speedometer",
  //   // badge: {
  //   //   color: "info",
  //   //   text: "NEW",
  //   // },
  // }, 
  // {
  //   _tag: 'CSidebarNavDropdown',
  //   name: "Employee Management",
  //   // to: "/videos",
  //   icon: "cil-speedometer",
  //   _children: [
  //       {
  //         _tag: "CSidebarNavItem",
  //         name: "View Employee",
  //         to: "/blogs",
  //       },
  //       {
  //         _tag: "CSidebarNavItem",
  //         name: "Add Employe",
  //         to: "/blogs/add-employee",
  //       },
  //       // {
  //       //   _tag: "CSidebarNavItem",
  //       //   name: "Add Products",
  //       //   to: "/service_providers",
  //       // },
  //   ],
  // },
  {
    _tag: "CSidebarNavItem",
    name: "Order Management",
    to: "/bills",
    icon: "cil-speedometer",
    // badge: {
    // color: "info",
    // text: "NEW",
    // },
  },
  {
    _tag: "CSidebarNavItem",
    name: "Payment Report",
    to: "/payment-report",
    icon: "cil-speedometer",
    // badge: {
    //   color: "info",
    //   text: "NEW",
    // },
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: "Category",
    // to: "/videos",
    icon: "cil-speedometer",
    _children: [
        {
          _tag: "CSidebarNavItem",
          name: "Category List",
          to: "/videos/sub-category",
        },
        {
          _tag: "CSidebarNavItem",
          name: "Add Category",
          to: "/videos/add-subcategory",
        },
    ],
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: "Enquiry Questions",
    // to: "/videos",
    icon: "cil-speedometer",
    _children: [
        {
          _tag: "CSidebarNavItem",
          name: "Ouestion List",
          to: "/videos",
        },
        {
          _tag: "CSidebarNavItem",
          name: "Add Question",
          to: "/videos/create-video",
        },
    ],
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: "Product",
    // to: "/videos",
    icon: "cil-speedometer",
    _children: [
        {
          _tag: "CSidebarNavItem",
          name: "Today's Deal",
          to: "/today-deal",
        },
        {
          _tag: "CSidebarNavItem",
          name: "Product List",
          to: "/view-prod",
        },
        {
          _tag: "CSidebarNavItem",
          name: "Add Product",
          to: "/add-prod",
        },
    ],
  },
  
    // badge: {
    //   color: "info",
    //   text: "NEW",
    // },
  // },
  // {
  //   _tag: "CSidebarNavItem",
  //   name: "Edit Service",
  //   to: "/edit_service",
  //   icon: "cil-speedometer",
  //   badge: {
  //     color: "info",
  //     text: "NEW",
  //   },
  // },
  // {
    
  //   icon: "cil-speedometer",
  //   // badge: {
  //   //   color: "info",
  //   //   text: "NEW",
  //   // },
  // },
  // {
  //   _tag: "CSidebarNavItem",
  //   name: "Verified Service Providers",
  //   to: "/verified_service_providers",
  //   icon: "cil-speedometer",
  //   // badge: {
  //   // color: "info",
  //   // text: "NEW",
  //   // },
  // },
  // {
  //   _tag: "CSidebarNavItem",
  //   name: "UnVerified Service Providers",
  //   to: "/unverified_service_providers",
  //   icon: "cil-speedometer",
  //   // badge: {
  //   //   color: "info",
  //   //   text: "NEW",
  //   // },
  // },
  
  // {
  //   _tag: 'CSidebarNavDropdown',
  //   name: "Quote Management",
  //   // to: "/videos",
  //   icon: "cil-speedometer",
  //   _children: [
  //       {
  //         _tag: "CSidebarNavItem",
  //         name: "View Quotes",
  //         to: "/videos/sub-category",
  //       },
  //       {
  //         _tag: "CSidebarNavItem",
  //         name: "Add Quotes",
  //         to: "/videos/add-subcategory",
  //       },
  //   ],
  // },
  // {
  //   _tag: "CSidebarNavItem",
  //   name: "Employee Links",
  //   to: "/links",
  //   icon: "cil-speedometer",
  //   badge: {
  //     color: "info",
  //     text: "NEW",
  //   },
  // },
  // {
  //   _tag: 'CSidebarNavDropdown',
  //   name: "User Management",
  //   icon: "cil-speedometer",
  //   _children: [
  //       // {
  //       //   _tag: "CSidebarNavItem",
  //       //   name: "View Employee",
  //       //   to: "/blogs",
  //       // },
  //       // {
  //       //   _tag: "CSidebarNavItem",
  //       //   name: "Add Employee",
  //       //   to: "/blogs/add-employee",
  //       // },
  //       {
  //         _tag: "CSidebarNavItem",
  //         name: "User Order History",
  //         to: "/blogs/user-Orderhistory",
  //       },
  //       {
  //         _tag: "CSidebarNavItem",
  //         name: "User Complaint",
  //         to: "/blogs/user-complaint",
  //       },
  //   ],
  // },
  
  {
    _tag: 'CSidebarNavDropdown',
    name: "Coupon Management",
    icon: "cil-speedometer",
    _children: [
        {
          _tag: "CSidebarNavItem",
          name: "View Coupons",
          to: "/coupon",
        },
        {
          _tag: "CSidebarNavItem",
          name: "Add Coupon",
          to: "/coupon/add-coupon",
        },
    ],
  },
  {
    _tag: "CSidebarNavItem",
    name: "Distance",
    to: "/distance",
    icon: "cil-speedometer",
    // badge: {
    //   color: "info",
    //   text: "NEW",
    // },
  },
  // {
  //   _tag: 'CSidebarNavDropdown',
  //   name: "Delivery Management",
  //   icon: "cil-speedometer",
  //   _children: [
  //       {
  //         _tag: "CSidebarNavItem",
  //         name: "View Center",
  //         to: "/delivery/center",
  //       },
  //       {
  //         _tag: "CSidebarNavItem",
  //         name: "Add Centers",
  //         to: "/delivery/add-center",
  //       },
  //       // {
  //       //   _tag: "CSidebarNavItem",
  //       //   name: "View Shop",
  //       //   to: "/delivery/shop",
  //       // },
  //       // {
  //       //   _tag: "CSidebarNavItem",
  //       //   name: "Add Shop",
  //       //   to: "/delivery/add-shop",
  //       // },
  //       // {
  //       //   _tag: "CSidebarNavItem",
  //       //   name: "View Hotel",
  //       //   to: "/delivery/hotel",
  //       // },
  //       // {
  //       //   _tag: "CSidebarNavItem",
  //       //   name: "Add Hotel",
  //       //   to: "/delivery/add-hotel",
  //       // },
  //   ],
  // },
  {
    _tag: "CSidebarNavItem",
    name: "Notifications",
    to: "/marketing",
    icon: "cil-speedometer",
  },
  // {
  //   _tag: "CSidebarNavItem",
  //   name: "Banner",
  //   to: "/banner",
  //   icon: "cil-speedometer",
  // },
  // {
  //   _tag: "CSidebarNavItem",
  //   name: "Admin Images",
  //   to: "/banner/popups",
  //   icon: "cil-speedometer",
  // },
  {
    _tag: 'CSidebarNavDropdown',
    name: "Banner Management",
    icon: "cil-speedometer",
    _children: [
        {
          _tag: "CSidebarNavItem",
          name: "View Banner",
          to: "/banner",
        },
        {
          _tag: "CSidebarNavItem",
          name: "Add Banner",
          to: "/banner/add-banner",
        }]
      }
  //       // {
  //       //   _tag: "CSidebarNavItem",
  //       //   name: "View Advertisement",
  //       //   to: "/banner/advertisement",
  //       // },
  //       // {
  //       //   _tag: "CSidebarNavItem",
  //       //   name: "Add Advertisement",
  //       //   to: "/banner/add-advertisement",
  //       // },
  //       // {
  //       //   _tag: "CSidebarNavItem",
  //       //   name: "Popups",
  //       //   to: "/banner/popups",
  //       // },
  //       // {
  //       //   _tag: "CSidebarNavItem",
  //       //   name: "View Instagram",
  //       //   to: "/instagram",
  //       // },
  //       // {
  //       //   _tag: "CSidebarNavItem",
  //       //   name: "Add Instagram",
  //       //   to: "/banner/add-instagram",
  //       // },
  //       // {
  //       //   _tag: "CSidebarNavItem",
  //       //   name: "Add Popups",
  //       //   to: "/banner/add-popups",
  //       // },
  //   ],
  // },
  // {
  //   _tag: 'CSidebarNavDropdown',
  //   name: "Wallet",
  //   icon: "cil-speedometer",
  //   _children: [
  //       {
  //         _tag: "CSidebarNavItem",
  //         name: "User Wallet",
  //         to: "/wallet",
  //       },
  //       // {
  //       //   _tag: "CSidebarNavItem",
  //       //   name: "Add Banner",
  //       //   to: "/banner/add-banner",
  //       // },
  //       // {
  //       //   _tag: "CSidebarNavItem",
  //       //   name: "View Advertisement",
  //       //   to: "/banner/advertisement",
  //       // },
  //       // {
  //       //   _tag: "CSidebarNavItem",
  //       //   name: "Add Advertisement",
  //       //   to: "/banner/add-advertisement",
  //       // },
  //   ],
  // },
  // {
  //   _tag: "CSidebarNavItem",
  //   name: "Wallet",
  //   to: "/wallet",
  //   icon: "cil-speedometer",
  //   // badge: {
  //   //   color: "info",
  //   //   text: "NEW",
  //   // },
  // },
  // {
  //   _tag: "CSidebarNavItem",
  //   name: "Link Orders",
  //   to: "/link-orders",
  //   icon: "cil-speedometer",
  //   badge: {
  //     color: "info",
  //     text: "NEW",
  //   },
  // },
  // {
  //   _tag: "CSidebarNavItem",
  //   name: "Referral Codes",
  //   to: "/referralCodes",
  //   icon: "cil-speedometer",
  //   badge: {
  //     color: "info",
  //     text: "NEW",
  //   },
  // },
  // {
  //   _tag: "CSidebarNavItem",
  //   name: "Employees",
  //   to: "/employees",
  //   icon: "cil-speedometer",
  //   badge: {
  //     color: "info",
  //     text: "NEW",
  //   },
  // },
  // {
  //   _tag: "CSidebarNavItem",
  //   name: "Employee Reviews",
  //   to: "/reviews",
  //   icon: "cil-speedometer",
  //   badge: {
  //     color: "info",
  //     text: "NEW",
  //   },
  // },
  // {
  //   _tag: "CSidebarNavItem",
  //   name: "Review Call",
  //   to: "/reviewcall",
  //   icon: "cil-speedometer",
  //   badge: {
  //     color: "info",
  //     text: "NEW",
  //   },
  // },
  // {
  //   _tag: "CSidebarNavItem",
  //   name: "Payments",
  //   to: "/payments",
  //   icon: "cil-speedometer",
  //   badge: {
  //     color: "info",
  //     text: "NEW",
  //   },
  // },
  // {
  //   _tag: "CSidebarNavItem",
  //   name: "Activity",
  //   to: "/activity",
  //   icon: "cil-speedometer",
  //   badge: {
  //     color: "info",
  //     text: "NEW",
  //   },
  // },
  // {
  //   _tag: "CSidebarNavItem",
  //   name: "Create Logins",
  //   to: "/create_logins",
  //   icon: "cil-speedometer",
  //   badge: {
  //     color: "info",
  //     text: "NEW",
  //   },
  // },
  // {
  //   _tag: "CSidebarNavItem",
  //   name: "Logins List",
  //   to: "/logins_list",
  //   icon: "cil-speedometer",
  //   badge: {
  //     color: "info",
  //     text: "NEW",
  //   },
  // },
  // {
  //   _tag: "CSidebarNavItem",
  //   name: "Add City",
  //   to: "/add_city",
  //   icon: "cil-speedometer",
  //   badge: {
  //     color: "info",
  //     text: "NEW",
  //   },
  // },
  // {
  //   _tag: "CSidebarNavItem",
  //   name: "Services City",
  //   to: "/services_city",
  //   icon: "cil-speedometer",
  //   badge: {
  //     color: "info",
  //     text: "NEW",
  //   },
  // },
  // {
  //   _tag: 'CSidebarNavTitle',
  //   _children: ['Theme']
  // },
  // {
  //   _tag: 'CSidebarNavItem',
  //   name: 'Colors',
  //   to: '/theme/colors',
  //   icon: 'cil-drop',
  // },
  // {
  //   _tag: 'CSidebarNavItem',
  //   name: 'Typography',
  //   to: '/theme/typography',
  //   icon: 'cil-pencil',
  // },
  // {
  //   _tag: 'CSidebarNavTitle',
  //   _children: ['Components']
  // },
  // {
  //   _tag: 'CSidebarNavDropdown',
  //   name: 'Base',
  //   route: '/base',
  //   icon: 'cil-puzzle',
  //   _children: [
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Breadcrumb',
  //       to: '/base/breadcrumbs',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Cards',
  //       to: '/base/cards',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Carousel',
  //       to: '/base/carousels',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Collapse',
  //       to: '/base/collapses',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Forms',
  //       to: '/base/forms',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Jumbotron',
  //       to: '/base/jumbotrons',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'List group',
  //       to: '/base/list-groups',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Navs',
  //       to: '/base/navs',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Navbars',
  //       to: '/base/navbars',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Pagination',
  //       to: '/base/paginations',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Popovers',
  //       to: '/base/popovers',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Progress',
  //       to: '/base/progress-bar',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Switches',
  //       to: '/base/switches',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Tables',
  //       to: '/base/tables',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Tabs',
  //       to: '/base/tabs',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Tooltips',
  //       to: '/base/tooltips',
  //     },
  //   ],
  // },
  // {
  //   _tag: 'CSidebarNavDropdown',
  //   name: 'Buttons',
  //   route: '/buttons',
  //   icon: 'cil-cursor',
  //   _children: [
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Buttons',
  //       to: '/buttons/buttons',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Brand buttons',
  //       to: '/buttons/brand-buttons',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Buttons groups',
  //       to: '/buttons/button-groups',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Dropdowns',
  //       to: '/buttons/button-dropdowns',
  //     }
  //   ],
  // },
  // {
  //   _tag: 'CSidebarNavItem',
  //   name: 'Charts',
  //   to: '/charts',
  //   icon: 'cil-chart-pie'
  // },
  // {
  //   _tag: 'CSidebarNavDropdown',
  //   name: 'Icons',
  //   route: '/icons',
  //   icon: 'cil-star',
  //   _children: [
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'CoreUI Free',
  //       to: '/icons/coreui-icons',
  //       badge: {
  //         color: 'success',
  //         text: 'NEW',
  //       },
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'CoreUI Flags',
  //       to: '/icons/flags',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'CoreUI Brands',
  //       to: '/icons/brands',
  //     },
  //   ],
  // },
  // {
  //   _tag: 'CSidebarNavDropdown',
  //   name: 'Notifications',
  //   route: '/notifications',
  //   icon: 'cil-bell',
  //   _children: [
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Alerts',
  //       to: '/notifications/alerts',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Badges',
  //       to: '/notifications/badges',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Modal',
  //       to: '/notifications/modals',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Toaster',
  //       to: '/notifications/toaster'
  //     }
  //   ]
  // },
  // {
  //   _tag: 'CSidebarNavItem',
  //   name: 'Widgets',
  //   to: '/widgets',
  //   icon: 'cil-calculator',
  //   badge: {
  //     color: 'info',
  //     text: 'NEW',
  //   },
  // },
  // {
  //   _tag: 'CSidebarNavDivider'
  // },
  // {
  //   _tag: 'CSidebarNavTitle',
  //   _children: ['Extras'],
  // },
  // {
  //   _tag: 'CSidebarNavDropdown',
  //   name: 'Pages',
  //   route: '/pages',
  //   icon: 'cil-star',
  //   _children: [
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Login',
  //       to: '/login',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Register',
  //       to: '/register',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Error 404',
  //       to: '/404',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Error 500',
  //       to: '/500',
  //     },
  //   ],
  // },
  // {
  //   _tag: 'CSidebarNavItem',
  //   name: 'Disabled',
  //   icon: 'cil-ban',
  //   badge: {
  //     color: 'secondary',
  //     text: 'NEW',
  //   },
  //   addLinkClass: 'c-disabled',
  //   'disabled': true
  // },
  // {
  //   _tag: 'CSidebarNavDivider',
  //   className: 'm-2'
  // },
  // {
  //   _tag: 'CSidebarNavTitle',
  //   _children: ['Labels']
  // },
  // {
  //   _tag: 'CSidebarNavItem',
  //   name: 'Label danger',
  //   to: '',
  //   icon: {
  //     name: 'cil-star',
  //     className: 'text-danger'
  //   },
  //   label: true
  // },
  // {
  //   _tag: 'CSidebarNavItem',
  //   name: 'Label info',
  //   to: '',
  //   icon: {
  //     name: 'cil-star',
  //     className: 'text-info'
  //   },
  //   label: true
  // },
  // {
  //   _tag: 'CSidebarNavItem',
  //   name: 'Label warning',
  //   to: '',
  //   icon: {
  //     name: 'cil-star',
  //     className: 'text-warning'
  //   },
  //   label: true
  // },
  // {
  //   _tag: 'CSidebarNavDivider',
  //   className: 'm-2'
  // }
];
