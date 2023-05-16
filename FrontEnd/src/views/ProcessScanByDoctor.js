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
import {Doughnut} from "react-chartjs-2";

function ProcessScanByDoctor() {
    const [patientsForUploadScan, setPatientsForUploadScan] = useState([]);
    const [selectedPatientToProcessScan, setSelectedPatientToProcessScan] = useState(0);
    const [thePatient, setThePatient] = useState("");
    const [elements, setElements] = useState([]);
    const [canShowChart, setCanShowChart] = useState(false);


    const [chartData, setChartData] = useState({
        labels: ['No Tumor', 'Glioma', 'Meningioma', 'Pituitary'],
        datasets: [
            {
                data: [],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1,
            },
        ],
    });

    useEffect(() => {
        let token = Cookies.get('token')
        if (token === undefined) {
            window.location.href = '/login';
        }
        refreshPatientsListForUploadScan();
    }, []);


    function refreshPatientsListForUploadScan() {
        fetch(apiBaseUrl + "/users?role=PATIENT", {
            "method": "GET",
            "headers": {
                "content-type": "application/json",
                "accept": "application/json",
                "Authorization": Cookies.get("token")
            }
        })
            .then(response => response.json())
            .then(response => {
                setPatientsForUploadScan(response);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const thead = ["Id", "Patient", "Scan", "Date", "résultat", "Actions"];

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

    const handlePatientChange = (event) => {
        setSelectedPatientToProcessScan(event.target.value.toString());
        setThePatient(event.target.value.toString());
    };

    const refreshScansList = (patientId) => {
        fetch(apiBaseUrl + "/scans?ofPatient=" + patientId, {
            "method": "GET",
            "headers": {
                "content-type": "application/json",
                "accept": "application/json",
                "Authorization": Cookies.get("token")
            }
        })
            .then(response => response.json())
            .then(response => {
                if (response.length === 0) {
                    showAlert("danger", "Aucun résultat trouvé !");
                } else {
                    let allUserScans = response;
                    let numberOfNoTumorScans = 0;
                    let numberOfGliomaScans = 0;
                    let numberOfMeningiomaScans = 0;
                    let numberOfPituitaryScans = 0;
                    for (let i = 0; i < allUserScans.length; i++) {
                        if (allUserScans[i].scan_result === "NO_TUMOR") {
                            numberOfNoTumorScans++;
                        } else if (allUserScans[i].scan_result === "GLIOMA") {
                            numberOfGliomaScans++;
                        } else if (allUserScans[i].scan_result === "MENINGIOMA") {
                            numberOfMeningiomaScans++;
                        } else if (allUserScans[i].scan_result === "PITUITARY") {
                            numberOfPituitaryScans++;
                        }
                    }

                    let numberOfTotalScans = numberOfNoTumorScans + numberOfGliomaScans + numberOfMeningiomaScans + numberOfPituitaryScans;
                    let percentageOfNoTumorScans = (numberOfNoTumorScans / numberOfTotalScans) * 100;
                    let percentageOfGliomaScans = (numberOfGliomaScans / numberOfTotalScans) * 100;
                    let percentageOfMeningiomaScans = (numberOfMeningiomaScans / numberOfTotalScans) * 100;
                    let percentageOfPituitaryScans = (numberOfPituitaryScans / numberOfTotalScans) * 100;

                    const updatedData = {
                        labels: ['No Tumor', 'Glioma', 'Meningioma', 'Pituitary'],
                        datasets: [
                            {
                                data: [percentageOfNoTumorScans, percentageOfGliomaScans, percentageOfMeningiomaScans, percentageOfPituitaryScans],
                                backgroundColor: [
                                    'rgba(255, 99, 132, 0.2)',
                                    'rgba(54, 162, 235, 0.2)',
                                    'rgba(255, 206, 86, 0.2)',
                                    'rgba(75, 192, 192, 0.2)'
                                ],
                                borderColor: [
                                    'rgba(255, 99, 132, 1)',
                                    'rgba(54, 162, 235, 1)',
                                    'rgba(255, 206, 86, 1)',
                                    'rgba(75, 192, 192, 1)'
                                ],
                                borderWidth: 1,
                            },
                        ],
                    }

                    setChartData(updatedData);
                    setCanShowChart(true)

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
                }
            })
            .catch(error => {
                console.log(error);
            });
    };

    function OpenScanImageInNewTab(scan) {
        window.open('http://localhost:9095/static/photos/' + scan.scan_file, '_blank');
    }

    function processScan(element) {
        let data = {
            id: element.id,
            processed: true
        }
        fetch(apiBaseUrl + "/scans?id=" + element.id, {
            "method": "PUT",
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
                        showAlert("success", "Traitement effectué avec succès !");
                        refreshScansList(thePatient);
                    } else {
                        showAlert("danger", "une erreur s'est produite, veuillez réessayer !");
                    }
                }
            );
    }

    function getPatientScans() {
        if (setSelectedPatientToProcessScan() === 0) {
            showAlert("danger", "Veuillez saisir l'Id du patient !");
            return;
        }
        refreshScansList(thePatient);
    }

    return (
        <>
            <PanelHeader size="sm"/>
            <div className="content">
                <Row>
                    <Col md="12">
                        <Card>
                            <CardHeader>
                                <CardTitle style={{textAlign: "center"}} tag="h4">Traiter un scan</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col className="pr-1" md="10">
                                        <FormGroup style={{textAlign: "center"}}>
                                            <Label for="patientSelect">Entrez l'Id du patient:</Label>
                                            <Input type="text" name="patient" id="patientSelect"
                                                   value={thePatient}
                                                   onChange={handlePatientChange}/>
                                        </FormGroup>
                                    </Col>
                                    <Col className="pl-1" md="2">
                                        <FormGroup style={{marginTop: "16px"}}>
                                            <Button
                                                className="btn-round"
                                                color="success"
                                                onClick={() => getPatientScans()}>
                                                <i className="fa-solid fa-magnifying-glass"></i>
                                            </Button>
                                        </FormGroup>
                                    </Col>

                                </Row>
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
                                    {elements.map((element, index) => {
                                        return (
                                            <tr className="text-center" key={index}>
                                                <td>{element.id}</td>
                                                <td>{element.patient}</td>
                                                <td>
                                                    <img
                                                        style={{width: "160px", height: "160px"}}
                                                        src={'http://localhost:9095/static/photos/' + element.scan_file}
                                                    />
                                                </td>
                                                <td>{element.added_at}</td>
                                                <td>{element.processed ? element.scan_result : 'PAS ENCORE'}</td>
                                                <td>
                                                    <Button
                                                        className="btn-round"
                                                        color="success"
                                                        onClick={() => OpenScanImageInNewTab(element)}>
                                                        <i className="fa-sharp fa-solid fa-eye"></i>
                                                    </Button>
                                                    {!element.processed &&
                                                        <Button
                                                            className="btn-round"
                                                            color="primary"
                                                            style={{marginLeft: "10px"}}
                                                            onClick={() => processScan(element)}>
                                                            Traiter
                                                        </Button>
                                                    }
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </Table>
                            </CardBody>
                        </Card>
                    </Col>


                    {canShowChart && <Col md="12">
                        <Card>
                            <CardHeader>
                                <CardTitle style={{textAlign: "center"}} tag="h4">Statistiques Des Scans</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <div style={{height: '60vh', textAlign: "center"}}>
                                    <Doughnut data={chartData} options={{maintainAspectRatio: false}}/>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>}

                </Row>
            </div>
            <NotificationAlert ref={notificationAlert}/>
        </>
    );
}

export default ProcessScanByDoctor;
