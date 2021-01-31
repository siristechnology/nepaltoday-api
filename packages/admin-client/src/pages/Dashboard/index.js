import React, { useState } from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle, Media } from "reactstrap";
import { gql, useQuery } from '@apollo/client';

//import Charts
import StackedColumnChart from "./StackedColumnChart";

// Pages Components
import WelcomeComp from "./WelcomeComp";
import MonthlyEarning from "./MonthlyEarning";

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

const Dashboard = () => {

    const [dataType, setDataType] = useState('week')

    const GET_STAT_QUERY = gql`
        query statQuery{
            getReadCategoryData{
                weekStat{
                    category
                    data
                }
                monthStat{
                    category
                    data
                }
            }
        }
    `

    const { loading, data, error } = useQuery(GET_STAT_QUERY, {
        variables: {}
    })
    console.log(data)

    const reports = [
        { title: "Installs", iconClass: "bx-copy-alt", description: "1,235" },
        { title: "Active installs", iconClass: "bx-archive-in", description: "723" }
    ];
    const dataTypes = ['week', 'month'];

    return (
        <React.Fragment>
          <div className="page-content">
              <Container fluid>
                  {/* Render Breadcrumb */}
                  <Breadcrumbs title='Dashboard' breadcrumbItem='Dashboard' />
                  <Row>
                      <Col xl="4">
                          <WelcomeComp />
                          <MonthlyEarning />
                      </Col>
                      <Col xl="8">
                          <Row>
                              {/* Reports Render */}
                              {
                                  reports.map((report, key) =>
                                      <Col md="4" key={"_col_" + key}>
                                          <Card className="mini-stats-wid">
                                              <CardBody>
                                                  <Media>
                                                      <Media body>
                                                          <p className="text-muted font-weight-medium">{report.title}</p>
                                                          <h4 className="mb-0">{report.description}</h4>
                                                      </Media>
                                                      <div className="mini-stat-icon avatar-sm rounded-circle bg-primary align-self-center">
                                                          <span className="avatar-title">
                                                              <i className={"bx " + report.iconClass + " font-size-24"}></i>
                                                          </span>
                                                      </div>
                                                  </Media>
                                              </CardBody>
                                          </Card>
                                      </Col>
                                  )
                              }
                          </Row>
                          <Card>
                              <CardBody>
                                  <CardTitle className="mb-4 float-sm-left">
                                      Categories
                                  </CardTitle>
                                  <div className="float-sm-right">
                                      <ul className="nav nav-pills">
                                          {
                                              dataTypes.map((type, key) =>
                                                  <li onClick={()=>setDataType(type)} className="nav-item" key={"_li_" + key}>
                                                      <p className={type==dataType ? "nav-link active" : "nav-link"}>{type}</p>
                                                  </li>
                                              )
                                          }
                                      </ul>
                                  </div>
                                  <div className="clearfix"></div>
                                  {data && <StackedColumnChart 
                                    stat={dataType=='month' && data.getReadCategoryData.monthStat || data.getReadCategoryData.weekStat}
                                  />}
                              </CardBody>
                          </Card>
                      </Col>
                  </Row>
              </Container>
          </div>
      </React.Fragment>
      );
    }

export default Dashboard;