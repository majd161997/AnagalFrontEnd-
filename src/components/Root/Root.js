import React from "react";

import { Route, Switch } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Stats from "./Stats";

class Root extends React.Component {

    constructor(props) {
        super(props);
        this.state = { apiResponse: "" };
    }

    render() {
        return(
            <div>
                <Switch>
                    <Route component={Login} path="/" exact/>
                    <Route component={Home} path="/home" />
                    <Route component={Stats} path="/stats" />
                </Switch>
            </div>
        )
    }
};

export default Root;