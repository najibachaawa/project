import React, { Component, Suspense } from 'react';
import { Route, withRouter, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import AppLayout from '../../layout/AppLayout';

const Gogo = React.lazy(() =>
  import(/* webpackChunkName: "viwes-gogo" */ './gogo')
);
const Conv = React.lazy(() =>
  import(/* webpackChunkName: "viwes-gogo" */ './conversations')
);
const SecondMenu = React.lazy(() =>
  import(/* webpackChunkName: "viwes-second-menu" */ './second-menu')
);
const StatsPage = React.lazy(() =>
  import(/* webpackChunkName: "viwes-stats-page" */ './blank-page')
);
const Profile = React.lazy(() =>
  import(/* webpackChunkName: "viwes-profile" */ './profile')
);
const Admin = React.lazy(() =>
  import(/* webpackChunkName: "pages" */ './admin')
);


class App extends Component {
  render() {
    const { match } = this.props;

    return (
      <AppLayout>
        <div className="dashboard-wrapper">
          <Suspense fallback={<div className="loading" />}>
            <Switch>
              <Redirect exact from={`${match.url}/`} to={`${match.url}/gogo`} />
              <Route
                path={`${match.url}/gogo`}
                render={props => <Gogo {...props} />}
              />
                 <Route
                path={`${match.url}/conversations`}
                render={props => <Conv {...props} />}
              />
              <Route
                path={`${match.url}/second-menu`}
                render={props => <SecondMenu {...props} />}
              />
              <Route
                path={`${match.url}/admin`}
                render={props => <Admin {...props} />}
              />
              <Route
                path={`${match.url}/stats-page`}
                render={props => <StatsPage {...props} />}
              />
              <Route
                path={`${match.url}/profile`}
                render={props => <Profile {...props} />}
              />
              <Redirect to="/error" />
            </Switch>
          </Suspense>
        </div>
      </AppLayout>
    );
  }
}
const mapStateToProps = ({ menu }) => {
  const { containerClassnames } = menu;
  return { containerClassnames };
};

export default withRouter(
  connect(
    mapStateToProps,
    {}
  )(App)
);
