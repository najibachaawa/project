const data = [
  {
    id: "gogo",
    icon: "iconsminds-air-balloon-1",
    label: "menu.gogo",
    to: "/app/gogo",
    subs: [
      {
        icon: "simple-icon-paper-plane",
        label: "menu.start",
        to: "/app/gogo/start"
      },   
      {
        icon: "simple-icon-paper-plane",
        label: "menu.scheduler",
        to: "/app/gogo/scheduler"
      },     
    ]
  },
  {
    id: "Conversations",
    icon: "iconsminds-bucket",
    label: "Conversations",
    to: "/app/apps"
  },
  {
    id: "blankpage",
    icon: "iconsminds-bucket",
    label: "menu.blank-page",
    to: "/app/blank-page"
  },
  {
    id: "docs",
    icon: "iconsminds-library",
    label: "menu.docs",
    to: "https://gogo-react-docs.coloredstrategies.com/",
    newWindow:true
  }
];
debugger;
if(localStorage.getItem("role") == "admin"){
  var adminpath = {
    id: "admin",
    icon: "iconsminds-three-arrow-fork",
    label: "menu.administration",
    to: "/app/admin/",
    subs: [
      {
        icon: "simple-icon-paper-plane",
        label: "menu.second",
        to: "/app/admin/users"
      }
    ]
  }; 
  data.push(adminpath);
}
export default data;
