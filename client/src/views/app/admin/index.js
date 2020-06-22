import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const UserList = React.lazy(() =>
  import(/* webpackChunkName: "product-data-list" */ './users/user-list')
);

const PagesUsers = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Route
        path={`${match.url}/users`}
        render={props => <UserList {...props} />}
      />      
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default PagesUsers;
