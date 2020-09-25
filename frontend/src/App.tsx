import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Layout from './layout/Layout';
import LayoutWrapper from './layout/LayoutWrapper';
import TestRoute from './TestRoute';
import Home from './Home';

function App() {
  return (
    <LayoutWrapper>
      <div className="App">
        <Layout>
          <Switch>
            <Route path="/" exact>
              <Home />
            </Route>
            <Route path="/test" exact>
              <TestRoute />
            </Route>
          </Switch>
        </Layout>
      </div>
    </LayoutWrapper>
  );
}

export default App;
