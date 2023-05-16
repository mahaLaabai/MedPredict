import React, {useState, useEffect} from 'react';
import NotificationAlert from "react-notification-alert";
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    Row,
    Col, CardTitle, Table, Form, FormGroup, Input, Label,
} from "reactstrap";
import { Link } from 'react-router-dom';
import PanelHeader from "components/PanelHeader/PanelHeader.js";
import {apiBaseUrl, tbody, thead} from "../variables/general";
import Cookies from 'js-cookie';


function UpdateMedicalFolderForPatient3() {
    const [doctorsForMedicalFolder, setDoctorsForMedicalFolder] = useState([]);
    const [folderNumber, setFolderNumber] = useState('');
    const [ maladie_coronariennes , setmaladie_coronariennes] = useState('');
    const [maladie_cérébrales, setmaladie_cérébrales] = useState('');
    const [maladie_Poumon, setmaladie_Poumon] = useState('');
    const [maladie_fois, setmaladie_fois] = useState('');
    const [autre, setautre] = useState('');
    const [statusReport, setStatusReport] = useState('');
    var theDoctor = 1;

    function refreshDoctorsListForMedicalFolder() {
        fetch(apiBaseUrl + "/users?role=DOCTOR&archived=0", {
            "method": "GET",
            "headers": {
                "content-type": "application/json",
                "accept": "application/json",
                "Authorization": Cookies.get("token")
            }
        })
            .then(response => response.json())
            .then(response => {
                setDoctorsForMedicalFolder(response);
            })
            .catch(error => {
                console.log(error);
            });
    }

    useEffect(() => {
        let token = Cookies.get('token')
        if (token === undefined) {
            window.location.href = '/login';
        }
        getPatientMedicalfolder();
        refreshDoctorsListForMedicalFolder();
    }, []);



    function getPatientMedicalfolder() {
        let id = Cookies.get('id');
        fetch(apiBaseUrl + '/medicalfolders?patient=' + id, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": Cookies.get("token")
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    data = data[0];
                    setFolderNumber(data.folderNumber);
                    setmaladie_coronariennes(data.maladie_coronariennes);
                    setmaladie_cérébrales(data.maladie_cérébrales);
                    setmaladie_Poumon(data.maladie_Poumon);
                    setmaladie_fois(data.maladie_fois);
                    setautre(data.autre);
                    setStatusReport(data.status_report);
                    theDoctor = data.practitioner_doctor;
                    fetch(apiBaseUrl + '/users?id=' + data.practitioner_doctor, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": Cookies.get("token")
                        }
                    }).then(response => response.json())

                } else {
                    showAlert("warning", "Aucun dossier médical trouvé pour ce patient, Veuillez saisir les informations necessaries !");
                    setFolderNumber('');
                    setmaladie_coronariennes('');
                    setmaladie_cérébrales('');
                    setmaladie_Poumon('');
                    setmaladie_fois('');
                    setautre('');
                    setStatusReport('');
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    const handleChangeOfFolderNumber = (event) => {
        setFolderNumber(event.target.value);
    };

    const handleChangeOfmaladie_coronariennes = (event) => {
        setmaladie_coronariennes(event.target.value);
    };

    const handleChangeOfmaladie_cérébrales = (event) => {
        setTension(event.target.value);
    };

    const handleChangeOfmaladie_Poumon = (event) => {
        setTaille(event.target.value);
    };

    const handleChangeOfmaladie_fois = (event) => {
        setPoids(event.target.value);
    };



    const handleChangeOfautre = (event) => {
        setDiabette(event.target.value);
    };



    const notificationAlert = React.useRef();
    const showAlert = (type, content) => {
        var options = {};
        options = {
            place: 'tc',
            message: (
                <div>
                    <div>
                        {content}
                    </div>
                </div>
            ),
            type: type,
            icon: "now-ui-icons ui-1_bell-53",
            autoDismiss: 2,
        };
        notificationAlert.current.notificationAlert(options);
    }

    function sendUpdateMedicalFolderRequest() {
        let data = {
            patient: parseInt(Cookies.get('id')),
            folderNumber: folderNumber,
            maladie_coronariennes: maladie_coronariennes,
            maladie_cérébrales: maladie_cérébrales,
            maladie_Poumon: maladie_Poumon,
            maladie_fois: maladie_fois,
            autre: autre,
            status_report: statusReport,
        }
        fetch(apiBaseUrl + "/medicalfolders?patient=" + Cookies.get("id"), {
            "method": "PUT",
            "headers": {
                "content-type": "application/json",
                "accept": "application/json",
                "Authorization": Cookies.get("token")
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(response => {
                if (response.code === 1) {
                    showAlert("success", "Dossier médical modifié avec succès !");
                } else {
                    showAlert("danger", "une erreur s'est produite, veuillez réessayer !");
                }
            })
            .catch(error => {
                console.log(error);
            }) ;
    }



    function handleChangeOfStatusReport(event) {
        setStatusReport(event.target.value);
    }


    return(
        <>
            <PanelHeader size="sm"/>
            <div className="content">
                <Row>
                    <Col md="12">
                        <Card>
                            <CardHeader>
                                <CardTitle style={{textAlign: "center"}} tag="h4">Mettre à jour votre dossier
                                    médical</CardTitle>
                            </CardHeader>

                                     <nav aria-label="Page navigation example">
                                        <ul className="pagination justify-content-center">
                                    <nav aria-label="Page navigation example">
                                        <ul className="pagination">
                                              <li className="page-item">
                                                <a className="page-link" href="#" aria-label="Previous">
                                                    <span aria-hidden="true">&laquo;</span>
                                                    <span className="sr-only">Previous</span>
                                                </a>
                                            </li>
                                            <li className="page-item"><a className="page-link"  href="update-medical-folder" >Information Personnel </a></li>
                                            <li className="page-item"><a className="page-link" href="update-medical-folder2">Protocole standart</a></li>
                                            <li className="page-item"><a className="page-link" href="update-medical-folder3">historique des maladies</a></li>
                                            <li className="page-item"><a className="page-link" href="update-medical-folder4">Les maladies cronique </a></li>
                                           <li className="page-item">
                                                <a className="page-link" href="#" aria-label="Next">
                                                    <span aria-hidden="true">&raquo;</span>
                                                    <span className="sr-only">Next</span>
                                                </a>
                                            </li>
                                        </ul>
                                    </nav>
                                       </ul>
                                     </nav>


                            <CardBody>
                                <Form style={{padding: "12px"}} >

                                    <Row>
                                        <Col className="pr-1" md="12">
                                            <FormGroup style={{textAlign: "center"}}>
                                                <label>Numéro de dossier :</label>
                                                <Input
                                                    disabled={true}
                                                    style={{textAlign: "center"}}
                                                    onChange={handleChangeOfFolderNumber}
                                                    value={folderNumber}
                                                    placeholder="Numéro de dossier"
                                                    type="text"
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                        <Col className="pr-1" md="12">
                                          <FormGroup style={{textAlign: "center"}}>
                                                <label>maladie de Poumon:</label>
                                                <Input
                                                    style={{textAlign: "center"}}
                                                    onChange={handleChangeOfmaladie_Poumon}
                                                    value={maladie_Poumon}
                                                    placeholder="maladie_Poumon"
                                                    type="text"
                                                />
                                            </FormGroup>
                                        </Col>

                                        <Col className="pr-1" md="12">
                                          <FormGroup style={{textAlign: "center"}}>
                                                <label>maladie  coronariennes</label>
                                                <Input
                                                    style={{textAlign: "center"}}
                                                    onChange={handleChangeOfmaladie_coronariennes}
                                                    value={maladie_coronariennes}
                                                    placeholder="maladie_coronariennes"
                                                    type="text"
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col className="pr-1" md="12">
                                           <FormGroup style={{textAlign: "center"}}>
                                                <label>maladie cérébrales:</label>
                                                <Input
                                                    style={{textAlign: "center"}}
                                                    onChange={handleChangeOfmaladie_cérébrales}
                                                    value={maladie_cérébrales}
                                                    placeholder="maladie_cérébrales"
                                                    type="text"
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col className="pr-1" md="12">
                                          <FormGroup style={{textAlign: "center"}}>
                                                <label>maladie de fois:</label>
                                                <Input
                                                    style={{textAlign: "center"}}
                                                    onChange={handleChangeOfmaladie_fois}
                                                    value={maladie_fois}
                                                    placeholder="maladie_fois"
                                                    type="text"
                                                />
                                            </FormGroup>
                                        </Col>

                                                     <Col className="pr-1" md="12">
                                            <FormGroup style={{textAlign: "center"}}>
                                                <label>autre maladie :</label>
                                                <Input
                                                    style={{textAlign: "center"}}
                                                    onChange={handleChangeOfautre}
                                                    value={autre}
                                                    placeholder="autre"
                                                    type="text"
                                                />
                                            </FormGroup>
                                        </Col>

                                        <Col className="pr-1" md="12">
                                            <FormGroup style={{textAlign: "center"}}>
                                                <label>Etat de rapport :</label>
                                                <br></br>
                                                <textarea
                                                    disabled={true}
                                                    style={{textAlign: "center", width: "420px", height: "100px"}}
                                                    onChange={handleChangeOfStatusReport}
                                                    value={statusReport}
                                                    placeholder="Etat de rapport"
                                                />
                                            </FormGroup>
                                        </Col>
                                    <Row>
                                        <Col className="pl-1" md="12">
                                            <FormGroup style={{textAlign: "center"}}>
                                                <Button
                                                    color="primary"
                                                    className="btn-round"
                                                    onClick={() => sendUpdateMedicalFolderRequest()}>
                                                    Mettre à jour votre dossier médical
                                                </Button>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
            <NotificationAlert ref={notificationAlert}/>
        </>
    );
}

 export default UpdateMedicalFolderForPatient3;
