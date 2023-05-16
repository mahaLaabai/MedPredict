import UpdateMedicalFolderForPatient from "./views/UpdateMedicalFolderForPatient";
import PatientAccount from "./views/PatientAccount";
import ViewScansByPatient from "./views/ViewScansByPatient";
import UpdateMedicalFolderForPatient2 from "./views/UpdateMedicalFolderForPatient2";
import UpdateMedicalFolderForPatient3 from "./views/UpdateMedicalFolderForPatient3";
import UpdateMedicalFolderForPatient4 from "./views/UpdateMedicaleFolserForPatient4";

var dashboardRoutesForPatient = [
    {
        path: "/patient-account",
        name: "Mon Profil",
        icon: "users_circle-08",
        component: PatientAccount ,
        layout: "/patient",
    },
    {
        path: "/update-medical-folder",
        name: "Mon dossier medical",
        icon: "files_single-copy-04",
        component: UpdateMedicalFolderForPatient ,
        layout: "/patient",
    },
          {
        path: "/update-medical-folder2",
        name: "protocol standrd",
        icon: "",
        component: UpdateMedicalFolderForPatient2 ,
        layout: "/patient",
    },
             {
        path: "/update-medical-folder3",
        name: "historique de maladie",
        icon: "",
        component: UpdateMedicalFolderForPatient3 ,
        layout: "/patient",
    },

            {
        path: "/update-medical-folder4",
        name: "maladie chronique",
        icon: "",
        component: UpdateMedicalFolderForPatient4 ,
        layout: "/patient",
    },
    {
        path: "/view-scans-patient",
        name: "Mes Scans",
        icon: "education_paper",
        component: ViewScansByPatient,
        layout: "/patient",
    }
    ,

];
export default dashboardRoutesForPatient;
