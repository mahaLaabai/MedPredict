import ManagePatientsForDoctor from "./views/ManagePatientsForDoctor";
import AddPatientForDoctor from "./views/AddPatientForDoctor";
import UpdateMedicalFolderForDoctor from "./views/UpdateMedicalFolderForDoctor";
import ProcessScanByDoctor from "./views/ProcessScanByDoctor";
import UpdateMedicalFolderForDoctor2 from "./views/UpdateMedicalFolderForDoctor2";
import UpdateMedicalFolderForDoctor3 from "./views/UpdateMedicaleFolderForDoctor3";
import UpdateMedicalFolderForDoctor4 from "./views/UpdateMedicaleFolderForDoctor4";

var dashboardRoutesForDoctor = [
  {
    path: "/manage-patients",
    name: "Gestion des patients",
    icon: "fa-solid fa-user",
    component: ManagePatientsForDoctor,
    layout: "/doctor",
  },
  {
    path: "/add-patient",
    name: "Ajouter un patient",
    icon: "design_app",
    component: AddPatientForDoctor,
    layout: "/doctor",
  },
  {
    path: "/update-medical-folder",
    name: "Dossiers medicals",
    icon: "fa-sharp fa-solid fa-pen-to-square",
    component: UpdateMedicalFolderForDoctor ,
    layout: "/doctor",
  },
     {
    path: "/update-medical-folder2",
    name: "standard",
    icon: "standart",
    component: UpdateMedicalFolderForDoctor2 ,
    layout: "/doctor",
  },
       {
    path: "/update-medical-folder3",
    name: "historique",
    icon: "standart",
    component: UpdateMedicalFolderForDoctor3 ,
    layout: "/doctor",
  },
        {
    path: "/update-medical-folder4",
    name: "maladie chronique",
    icon: "standart",
    component: UpdateMedicalFolderForDoctor4 ,
    layout: "/doctor",
  },
  {
    path: "/process-scan",
    name: "Traitement des scans",
    icon: "fa-sharp fa-solid fa-folder-open",
    component: ProcessScanByDoctor ,
    layout: "/doctor",
  },
];
export default dashboardRoutesForDoctor;
