import React, {useState, useEffect} from 'react';
import NotificationAlert from "react-notification-alert";
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    Row,
    Col, CardTitle, Table, Form, FormGroup, Label, Input,
} from "reactstrap";
import uploadedImage from "../assets/img/upload.png";
import PanelHeader from "components/PanelHeader/PanelHeader.js";
import {apiBaseUrl, tbody, thead} from "../variables/general";
import Cookies from 'js-cookie';

function ViewScansByPatient() {
    const [elements, setElements] = useState([]);

    const [searchingQueryForPatientScans, setSearchingQueryForPatientScans] = useState('');


    useEffect(() => {
        let token = Cookies.get('token')
        if (token === undefined) {
            window.location.href = '/login';
        }
        refreshScansList();
    }, []);

    const thead = ["Id", "Scan", "Date", "Actions"];

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

    const refreshScansList = () => {
        let id = Cookies.get('id');
        fetch(apiBaseUrl + "/scans?ofPatient=" + id, {
            "method": "GET",
            "headers": {
                "content-type": "application/json",
                "accept": "application/json",
                "Authorization": Cookies.get("token")
            }
        })
            .then(response => response.json())
            .then(response => {
                for (let i = 0; i < response.length; i++) {
                    fetch(apiBaseUrl + "/users?id=" + response[i].patient, {
                        "method": "GET",
                        "headers": {
                            "content-type": "application/json",
                            "Authorization": Cookies.get("token")
                        }
                    })
                        .then(theResponse => theResponse.json())
                        .then(theResponse => {
                            let newElements = [...response];
                            newElements[i].patient = theResponse.first_name + " " + theResponse.last_name;
                            setElements(newElements);
                        })
                        .catch(error => {
                            console.log(error);
                        });
                }
            })
            .catch(error => {
                console.log(error);
            });
    };

    function setImage(file) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            console.log(reader.result)
            let result = reader.result.split(",")[1];
            setScanFile(result);
        }
    }

    function clearAllFields() {
        setSelectedPatientForUploadScan("0");
        setScanFile("");
        setScanDate("");
    }

    function sendAddScanRequest() {
        if (selectedPatientForUploadScan === "0") {
            showAlert("danger", "Veuillez choisir un patient !");
            return;
        }
        if (scanFile === "") {
            showAlert("danger", "Veuillez choisir une image de scan !");
            return;
        }
        if (scanDate === undefined) {
            showAlert("danger", "Veuillez choisir une date !");
            return;
        }
        let data = {
            patient: parseInt(selectedPatientForUploadScan),
            scan_file: scanFile,
            added_at: scanDate,
            scan_result: 'PENDING'
        }
        console.log(data)
        fetch(apiBaseUrl + "/scans", {
            "method": "POST",
            "headers": {
                "content-type": "application/json",
                "accept": "application/json",
                "Authorization": Cookies.get("token")
            },
            body: JSON.stringify(data)
        }).then(response => response.json())
            .then(response => {
                    console.log(response)
                    if (response.code === 1) {
                        showAlert("success", "Ajouté avec succès !");
                        refreshScansList();
                        clearAllFields();
                    } else {
                        showAlert("danger", "une erreur s'est produite, veuillez réessayer !");
                    }
                }
            );
    }

    function OpenScanImageInNewTab(scan) {
        window.open('http://localhost:9095/static/photos/' + scan.scan_file, '_blank');
    }


    function searchWithinPatientScans() {
        if (searchingQueryForPatientScans === "") {
            showAlert("danger", "Veuillez remplir tous les champs !");
        } else {
            let filtered = elements.filter((element) => {
                return element.added_at.toLowerCase().includes(searchingQueryForPatientScans.toLowerCase())
            });
            setElements(filtered);
        }
    }

    function showAllPatientScans() {
        setSearchingQueryForPatientScans("");
        refreshScansList();
    }

    function handleChangeOfPatientScansQuery(event) {
        setSearchingQueryForPatientScans(event.target.value);
    }

    return (
        <>
            <PanelHeader size="sm"/>
            <div className="content">
                <Row>
                    <Col md="12">
                        <Card>
                            <CardHeader>
                                <CardTitle style={{textAlign: "center"}} tag="h4">Mes scans</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <Form style={{padding: "12px"}}>
                                    <Row>
                                        <Col className="pr-1" md="8">
                                            <FormGroup style={{textAlign: "center"}}>
                                                <label>Chercher ici :</label>
                                                <Input
                                                    style={{textAlign: "center"}}
                                                    onChange={handleChangeOfPatientScansQuery}
                                                    value={searchingQueryForPatientScans}
                                                    placeholder="Chercher ici"
                                                    type="text"
                                                />
                                            </FormGroup>
                                        </Col>

                                        <Col className="pl-1" md="2">
                                            <FormGroup style={{textAlign: "center"}}>
                                                <Button
                                                    style={{marginTop: "22px"}}
                                                    color="success"
                                                    className="btn-round"
                                                    onClick={() => searchWithinPatientScans()}>
                                                    <i className={"now-ui-icons ui-1_zoom-bold"} />
                                                </Button>
                                            </FormGroup>
                                        </Col>
                                        <Col className="pl-1" md="2">
                                            <FormGroup style={{textAlign: "center"}}>
                                                <Button
                                                    style={{marginTop: "22px"}}
                                                    color="primary"
                                                    className="btn-round"
                                                    onClick={() => showAllPatientScans()}>
                                                    <i className="fa-sharp fa-solid fa-eye"></i> tout
                                                </Button>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </Form>
                                <Table responsive>
                                    <thead className="text-primary">
                                    <tr className="text-center">
                                        {thead.map((prop, key) => {
                                            return (
                                                <th key={key}>
                                                    {prop}
                                                </th>
                                            );
                                        })}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {elements.length === 0 &&
                                        <tr className="text-center">
                                            <td colSpan="5">Aucun scan trouvé</td>
                                        </tr>
                                    }
                                    {elements.map((element, index) => {
                                        return (
                                            <tr className="text-center" key={index}>
                                                <td>{element.id}</td>
                                                <td>
                                                    <img
                                                        style={{width: "160px", height: "160px"}}
                                                        src={'http://localhost:9095/static/photos/' + element.scan_file}
                                                    />
                                                </td>
                                                <td>{element.added_at}</td>
                                                <td>
                                                    <Button
                                                        className="btn-round"
                                                        color="success"
                                                        onClick={() => OpenScanImageInNewTab(element)}>
                                                        <i className="fa-sharp fa-solid fa-eye"></i>
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </Table>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
            <NotificationAlert ref={notificationAlert}/>
        </>
    );
}

export default ViewScansByPatient;
