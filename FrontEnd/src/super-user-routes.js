import ManagePatients from "./views/ManagePatients";
import ManageDoctors from "./views/ManageDoctors";
import ManageSuperUsers from "./views/ManageSuperUsers";
import ManageLabTechnicians from "./views/ManageLabTechnicians";
import AddNewSuperUser from "./views/AddNewSuperUser";

var dashboardRoutesForSuperUser = [
  {
    path: "/manage-patients",
    name: "Gestion des patients",
    icon: "fa-solid fa-users",
    component: ManagePatients,
    layout: "/super-user",
  },
  {
    path: "/manage-doctors",
    name: "Gestion des médecins",
    icon: "fa-solid fa-user-doctor",
    component: ManageDoctors,
    layout: "/super-user",
  },
  {
    path: "/manage-superusers",
    name: "Gestion des super-users",
    icon: "fa-sharp fa-solid fa-user-tie",
    component: ManageSuperUsers,
    layout: "/super-user",
  },
  {
    path: "/manage-lab-technicians",
    name: "Gestion des techniciens Labo",
    icon: "fa-sharp fa-solid fa-flask-vial",
    component: ManageLabTechnicians,
    layout: "/super-user",
  },
  {
    path: "/add-super-user",
    name: "Ajout d'un super-user",
    icon: "fa-sharp fa-solid fa-user-plus",
    component: AddNewSuperUser,
    layout: "/super-user",
  }
];
export default dashboardRoutesForSuperUser;
