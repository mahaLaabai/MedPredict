import UploadScan from "./views/UploadScan";

var dashboardRoutesForLabTechnician = [
  {
    path: "/upload-scan",
    name: "Chargement des scans",
    icon: "fa-solid fa-cloud-arrow-up",
    component: UploadScan,
    layout: "/lab-technician",
  }
];
export default dashboardRoutesForLabTechnician;
