import React from "react";
import PerfectScrollbar from "perfect-scrollbar";
import {Route, Switch, Redirect, useLocation} from "react-router-dom";
import DemoNavbar from "components/Navbars/DemoNavbar.js";
import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import routes from "patient-routes";

var ps;

function Patient(props) {
    const location = useLocation();
    const [backgroundColor, setBackgroundColor] = React.useState("blue");
    const mainPanel = React.useRef();
    React.useEffect(() => {
        if (navigator.platform.indexOf("Win") > -1) {
            ps = new PerfectScrollbar(mainPanel.current);
            document.body.classList.toggle("perfect-scrollbar-on");
        }
        return function cleanup() {
            if (navigator.platform.indexOf("Win") > -1) {
                ps.destroy();
                document.body.classList.toggle("perfect-scrollbar-on");
            }
        };
    });
    React.useEffect(() => {
        document.documentElement.scrollTop = 0;
        document.scrollingElement.scrollTop = 0;
        mainPanel.current.scrollTop = 0;
    }, [location]);

    let newRoutes = routes.filter((route) => {
            return route.name !== "protocol standrd" &&
                route.name !== "historique de maladie" &&
                route.name !== "maladie chronique";
        }
    );
    return (
        <div className="wrapper">
            <Sidebar {...props} routes={newRoutes} backgroundColor={backgroundColor}/>
            <div className="main-panel" ref={mainPanel}>
                <DemoNavbar {...props} />
                <Switch>
                    {routes.map((prop, key) => {
                        return (
                            <Route
                                path={prop.layout + prop.path}
                                component={prop.component}
                                key={key}
                            />
                        );
                    })}
                    <Redirect from="/patient" to="/patient/patient-account"/>
                </Switch>
                <Footer fluid/>
            </div>
        </div>
    );
}

export default Patient;
