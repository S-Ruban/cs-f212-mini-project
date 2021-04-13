import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './App.css';
import { Auth, UnAuth } from './routes';
import SignIn from './Components/Auth/SignIn';
import SignUp from './Components/Auth/SignUp';
import CustDashboard from './Components/Dashboards/CustDashboard';
import RestDashboard from './Components/Dashboards/RestDashboard';
import DelDashboard from './Components/Dashboards/DelDashboard';
import Layout from './Components/Layout';

function App() {
	const user = useSelector((state) => state.user);

	return (
		<Router>
			<Layout>
				<Switch>
					<Route exact path='/'>
						{(user.uname && <Redirect to='/dashboard' />) ||
							(!user.uname && <Redirect to='/signin' />)}
					</Route>
					<UnAuth exact path='/signin'>
						<SignIn />
					</UnAuth>
					<UnAuth exact path='/signup'>
						<SignUp />
					</UnAuth>
					<Auth exact path='/dashboard'>
						{user.type === 'customer' && <CustDashboard />}
						{user.type === 'restaurant' && <RestDashboard />}
						{user.type === 'delivery' && <DelDashboard />}
					</Auth>
				</Switch>
			</Layout>
		</Router>
	);
}

export default App;
