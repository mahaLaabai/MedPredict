import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.css";
import "assets/scss/now-ui-dashboard.scss?v1.5.0";
import "assets/css/demo.css";

import DoctorLayout from "layouts/Doctor.js";
import Login from "./views/Login";
import AddPatientForDoctor from "./views/AddPatientForDoctor.js"
import UpdateMedicalFolderForPatient3 from "./views/UpdateMedicalFolderForPatient3.js"
import PatientLayout from "./layouts/Patient";
import SuperUserLayout from "./layouts/SuperUser";
import Register from "./views/Register";
import LabTechnicianLayout from "./layouts/LabTechnicien";
import Home from "./views/Home";

ReactDOM.render(
  <BrowserRouter>
    <Switch>
        <Route path="/doctor" render={(props) => <DoctorLayout {...props} />} />
        <Route path="/patient" render={(props) => <PatientLayout {...props} />} />
        <Route path="/super-user" render={(props) => <SuperUserLayout {...props} />} />
        <Route path="/login" render={(props) => <Login {...props} />} />
        <Route path="/AddPatientForDoctor" render={(props) => <AddPatientForDoctor {...props} />} />
        <Route path="/UpdateMedicalFolderForPatient3" render={(props) => <UpdateMedicalFolderForPatient3 {...props} />} />
        <Route path="/register" render={(props) => <Register {...props} />} />
        <Route path="/home" render={(props) => <Home {...props} />} />
        <Route path="/lab-technician" render={(props) => <LabTechnicianLayout {...props} />} />
      <Redirect to="/home" />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
