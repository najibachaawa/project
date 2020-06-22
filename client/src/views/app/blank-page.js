import React, { Component, Fragment } from "react";
import { Row } from "reactstrap";
import IntlMessages from "../../helpers/IntlMessages";
import { Colxx, Separator } from "../../components/common/CustomBootstrap";
import Breadcrumb from "../../containers/navs/Breadcrumb";
import { Bar, Line } from 'react-chartjs-2';
const state = {
  labels: ['Monday', 'Tuesday', 'Wednesday',
    'Thursday', 'Friday', 'Saturday', 'Sunday'],
  datasets: [
    {
      label: 'minute',
      backgroundColor: 'rgba(75,192,192,1)',
      borderColor: 'rgba(0,0,0,1)',
      borderWidth: 2,
      data: [1, 5, 8, 9, 10, 12, 3]
    }
  ]
}
const state2 = {
  labels: ['January', 'February', 'March',
    'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  datasets: [
    {
      label: 'Mounth',
      fill: false,
      lineTension: 0.5,
      backgroundColor: 'rgba(75,192,192,1)',
      borderColor: 'rgba(0,0,0,1)',
      borderWidth: 2,
      data: [2, 4, 2, 5, 9, 6, 8, 7, 6, 5, 8, 3]
    }
  ]
}
export default class StatsPage extends Component {
  render() {

    return (
      <div>
        <Bar
          data={state}
          options={{
            title: {
              display: true,
              text: 'Waiting time per day',
              fontSize: 20
            },
            legend: {
              display: true,
              position: 'right'
            }
          }}
        />


        <div>
          <Line
            data={state2}
            options={{
              title: {
                display: true,
                text: 'Waiting time per mounth',
                fontSize: 20
              },
              legend: {
                display: true,
                position: 'right'
              }
            }}
          />
        </div>
      </div>




    );

  }
}
