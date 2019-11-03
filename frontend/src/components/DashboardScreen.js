import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import { observable } from "mobx";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// react plugin for creating charts
// import ChartistGraph from "react-chartist";
// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";
// @material-ui/icons
// import Warning from "@material-ui/icons/Warning";
// import DateRange from "@material-ui/icons/DateRange";
// import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
// import ArrowUpward from "@material-ui/icons/ArrowUpward";
// import AccessTime from "@material-ui/icons/AccessTime";
import Accessibility from "@material-ui/icons/Accessibility";
// import BugReport from "@material-ui/icons/BugReport";
// import Code from "@material-ui/icons/Code";
// import Cloud from "@material-ui/icons/Cloud";
// core components
import GridItem from "./custom/Grid/GridItem.jsx";
import GridContainer from "./custom/Grid/GridContainer.jsx";
import Table from "./custom/Table/Table.jsx";
// import Tasks from "./custom/Tasks/Tasks.jsx";
// import CustomTabs from "./custom/CustomTabs/CustomTabs.jsx";
// import Danger from "./custom/Typography/Danger.jsx";
import Card from "./custom/Card/Card";
import CardHeader from "./custom/Card/CardHeader.jsx";
import CardIcon from "./custom/Card/CardIcon.jsx";
import CardBody from "./custom/Card/CardBody.jsx";
import CardFooter from "./custom/Card/CardFooter.jsx";

// import { bugs, website, server } from "./variables/general.jsx";

// import {
//     dailySalesChart,
//     emailsSubscriptionChart,
//     completedTasksChart
// } from "./variables/charts.jsx";

import dashboardStyle from "./assets/jss/material-dashboard-react/views/dashboardStyle.jsx";
import { FileCopy, Games, RestaurantMenu } from '@material-ui/icons';
import moment from 'moment';
import Moment from 'react-moment';

@inject('SessionStore', 'ScreenStore')
@observer
class DashboardScreen extends Component {
    @observable data

    constructor(props) {
        super(props);
        this.props.ScreenStore.setTitle('Dashboard')
        this.state = {
            userName: '',
            password: '',
            value: 0
        };
    }

    handleChange = (event, value) => {
        this.setState({ value });
    };

    handleChangeIndex = index => {
        this.setState({ value: index });
    };

    componentDidMount() {
        this.get()
    }

    get() {
        fetch(`${this.props.SessionStore.API_URL}dashboard/read`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.props.SessionStore.getUserToken()}`
            },
        }).then((result) => {
            return result.json();
        }).then((jsonResult) => {
            console.log(jsonResult);
            if (jsonResult.success) {
                this.data = jsonResult.data
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    getCardHeaderValue() {
        const tempData = {
            music: 0,
            game: 0,
            product: 0,
            account: 0,
            foundUser: [],
            foundProduct: []
        }
        const data = this.data
        if (data) {
            tempData.music = data.totalMusic
            tempData.game = data.totalGame
            tempData.account = data.totalAccount
            tempData.product = data.totalProduct
            tempData.foundUser = data.user
            tempData.foundProduct = data.product
        }
        return tempData
    }

    render() {
        const { classes } = this.props;
        const headCardData = this.getCardHeaderValue()
        return (
            <div>
                <GridContainer>
                    <GridItem xs={12} sm={6} md={3}>
                        <Card>
                            <CardHeader color="warning" stats icon>
                                <CardIcon color="warning">
                                    <FileCopy />
                                </CardIcon>
                                <p className={classes.cardCategory}>Music</p>
                                <h3 className={classes.cardTitle}>
                                    {headCardData.music}
                                </h3>
                            </CardHeader>
                            <CardFooter stats>
                                <div className={classes.stats}>
                                    <Update />
                                    Just Updated
                                </div>
                            </CardFooter>
                        </Card>
                    </GridItem>
                    <GridItem xs={12} sm={6} md={3}>
                        <Card>
                            <CardHeader color="success" stats icon>
                                <CardIcon color="success">
                                    <Games />
                                </CardIcon>
                                <p className={classes.cardCategory}>Game</p>
                                <h3 className={classes.cardTitle}>{headCardData.game}</h3>
                            </CardHeader>
                            <CardFooter stats>
                                <div className={classes.stats}>
                                    <Update />
                                    Just Updated
                                </div>
                            </CardFooter>
                        </Card>
                    </GridItem>
                    <GridItem xs={12} sm={6} md={3}>
                        <Card>
                            <CardHeader color="danger" stats icon>
                                <CardIcon color="danger">
                                    <RestaurantMenu />
                                </CardIcon>
                                <p className={classes.cardCategory}>Product</p>
                                <h3 className={classes.cardTitle}>{headCardData.product}</h3>
                            </CardHeader>
                            <CardFooter stats>
                                <div className={classes.stats}>
                                    <Update />
                                    Just Updated
                                </div>
                            </CardFooter>
                        </Card>
                    </GridItem>
                    <GridItem xs={12} sm={6} md={3}>
                        <Card>
                            <CardHeader color="info" stats icon>
                                <CardIcon color="info">
                                    <Accessibility />
                                </CardIcon>
                                <p className={classes.cardCategory}>User</p>
                                <h3 className={classes.cardTitle}>+{headCardData.account}</h3>
                            </CardHeader>
                            <CardFooter stats>
                                <div className={classes.stats}>
                                    <Update />
                                    Just Updated
                                </div>
                            </CardFooter>
                        </Card>
                    </GridItem>
                </GridContainer>
                {/* <GridContainer>
                    <GridItem xs={12} sm={12} md={4}>
                        <Card chart>
                            <CardHeader color="success">
                                <ChartistGraph
                                    className="ct-chart"
                                    data={dailySalesChart.data}
                                    type="Line"
                                    options={dailySalesChart.options}
                                    listener={dailySalesChart.animation}
                                />
                            </CardHeader>
                            <CardBody>
                                <h4 className={classes.cardTitle}>Daily Sales</h4>
                                <p className={classes.cardCategory}>
                                    <span className={classes.successText}>
                                        <ArrowUpward className={classes.upArrowCardCategory} /> 55%
                  </span>{" "}
                                    increase in today sales.
                </p>
                            </CardBody>
                            <CardFooter chart>
                                <div className={classes.stats}>
                                    <AccessTime /> updated 4 minutes ago
                </div>
                            </CardFooter>
                        </Card>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={4}>
                        <Card chart>
                            <CardHeader color="warning">
                                <ChartistGraph
                                    className="ct-chart"
                                    data={emailsSubscriptionChart.data}
                                    type="Bar"
                                    options={emailsSubscriptionChart.options}
                                    responsiveOptions={emailsSubscriptionChart.responsiveOptions}
                                    listener={emailsSubscriptionChart.animation}
                                />
                            </CardHeader>
                            <CardBody>
                                <h4 className={classes.cardTitle}>Email Subscriptions</h4>
                                <p className={classes.cardCategory}>
                                    Last Campaign Performance
                </p>
                            </CardBody>
                            <CardFooter chart>
                                <div className={classes.stats}>
                                    <AccessTime /> campaign sent 2 days ago
                </div>
                            </CardFooter>
                        </Card>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={4}>
                        <Card chart>
                            <CardHeader color="danger">
                                <ChartistGraph
                                    className="ct-chart"
                                    data={completedTasksChart.data}
                                    type="Line"
                                    options={completedTasksChart.options}
                                    listener={completedTasksChart.animation}
                                />
                            </CardHeader>
                            <CardBody>
                                <h4 className={classes.cardTitle}>Completed Tasks</h4>
                                <p className={classes.cardCategory}>
                                    Last Campaign Performance
                </p>
                            </CardBody>
                            <CardFooter chart>
                                <div className={classes.stats}>
                                    <AccessTime /> campaign sent 2 days ago
                </div>
                            </CardFooter>
                        </Card>
                    </GridItem>
                </GridContainer> */}
                <GridContainer>
                    {/* <GridItem xs={12} sm={12} md={6}>
                        <CustomTabs
                            title="Tasks:"
                            headerColor="primary"
                            tabs={[
                                {
                                    tabName: "Bugs",
                                    tabIcon: BugReport,
                                    tabContent: (
                                        <Tasks
                                            checkedIndexes={[0, 3]}
                                            tasksIndexes={[0, 1, 2, 3]}
                                            tasks={bugs}
                                        />
                                    )
                                },
                                {
                                    tabName: "Website",
                                    tabIcon: Code,
                                    tabContent: (
                                        <Tasks
                                            checkedIndexes={[0]}
                                            tasksIndexes={[0, 1]}
                                            tasks={website}
                                        />
                                    )
                                },
                                {
                                    tabName: "Server",
                                    tabIcon: Cloud,
                                    tabContent: (
                                        <Tasks
                                            checkedIndexes={[1]}
                                            tasksIndexes={[0, 1, 2]}
                                            tasks={server}
                                        />
                                    )
                                }
                            ]}
                        />
                    </GridItem> */}
                    <GridItem xs={12} sm={12} md={6}>
                        <Card>
                            <CardHeader color="success">
                                <h4 className={classes.cardTitleWhite}>New comer</h4>
                                <p className={classes.cardCategoryWhite}>
                                    update at <Moment format="D MMM YYYY hh:mm">{moment()}</Moment>
                                </p>
                            </CardHeader>
                            <CardBody>
                                <Table
                                    tableHeaderColor="success"
                                    tableHead={["ID", "Name", "Email", "Created at"]}
                                    tableData={headCardData.foundUser}
                                />
                            </CardBody>
                        </Card>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={6}>
                        <Card>
                            <CardHeader color="warning">
                                <h4 className={classes.cardTitleWhite}>New product</h4>
                                <p className={classes.cardCategoryWhite}>
                                    update at <Moment format="D MMM YYYY hh:mm">{moment()}</Moment>
                                </p>
                            </CardHeader>
                            <CardBody>
                                <Table
                                    tableHeaderColor="warning"
                                    tableHead={["ID", "Name", "NumberOfFile", "Created at"]}
                                    tableData={headCardData.foundProduct}
                                />
                            </CardBody>
                        </Card>
                    </GridItem>
                </GridContainer>
            </div>
        );
    }
}

DashboardScreen.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(DashboardScreen);
