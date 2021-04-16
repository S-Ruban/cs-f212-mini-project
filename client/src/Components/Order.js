import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router';
import axios from 'axios';
import {
	Card,
	CardContent,
	Container,
	Grid,
	makeStyles,
	Typography,
	Stepper,
	Step,
	StepLabel,
	Button,
	Dialog,
	DialogTitle,
	DialogActions,
	StepConnector
} from '@material-ui/core';
import OrderContentTable from './Tables/OrderContentTable';
import CancelIcon from '@material-ui/icons/Cancel';

const useStyles = makeStyles((theme) => ({
	root: {
		margin: theme.spacing(2)
	},
	address: {
		marginTop: theme.spacing(2)
	},
	name: {
		fontWeight: 'bold'
	},
	flex: {
		display: 'flex'
	},
	grow: {
		flexGrow: 1
	}
}));

const Order = () => {
	const classes = useStyles();

	const { order_no } = useParams();
	const history = useHistory();

	const [details, setDetails] = useState(null);
	const [activeStep, setActiveStep] = useState(0);
	const [open, setOpen] = useState(false);

	const getActiveStep = (order) => {
		if (order.ispaid) return 6;
		if (order.isdelivered) return 5;
		if (order.isreceived) return 4;
		if (order.isprepared) return 3;
		if (order.isassigned) return 2;
		if (order.isplaced) return 1;
	};

	const handleDeleteOrder = async () => {
		try {
			setOpen(false);
			await axios.delete(`/orders/${order_no}`);
			console.log('Order cancelled');
			history.replace('/');
		} catch (err) {
			console.log(err.response.data.message);
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await axios.get(`/orders/${order_no}`);
				setActiveStep(getActiveStep(res.data.order));
				setDetails(res.data);
			} catch (err) {
				history.replace('/orders');
				console.log(err.response.data.message);
			}
		};
		fetchData();
	}, [history, order_no]);

	return (
		details && (
			<Container>
				<Grid
					container
					direction='column'
					justify='space-evenly'
					alignItems='center'
					spacing={4}
					className={classes.root}
				>
					<Grid item>
						<Grid
							container
							justify='space-between'
							alignItems='stretch'
							xs={12}
							spacing={4}
						>
							{details.customer && (
								<Grid item xs={4} className={classes.flex}>
									<Card className={classes.grow}>
										<CardContent>
											<Typography variant='h5' gutterBottom>
												CUSTOMER
											</Typography>
											<Typography variant='h5' className={classes.name}>
												{details.customer.firstname}{' '}
												{details.customer.lastname}
											</Typography>
											<Grid
												container
												justify='flex-start'
												alignItems='center'
												spacing={4}
											>
												<Grid item>
													<Typography variant='subtitle1'>
														{details.customer.phone}
													</Typography>
												</Grid>
												<Grid item>
													<Typography variant='subtitle1'>
														{details.customer.email}
													</Typography>
												</Grid>
											</Grid>
											<Typography variant='body1' className={classes.address}>
												{details.customer.aline1}
												<br />
												{details.customer.aline2}
												<br />
												{details.customer.city} - {details.customer.pin}
											</Typography>
										</CardContent>
									</Card>
								</Grid>
							)}
							{details.restaurant && (
								<Grid item xs={4} className={classes.flex}>
									<Card className={classes.grow}>
										<CardContent>
											<Typography variant='h5' gutterBottom>
												RESTAURANT
											</Typography>
											<Typography variant='h5' className={classes.name}>
												{details.restaurant.rest_name}
											</Typography>
											<Grid
												container
												justify='space-between'
												alignItems='center'
											>
												{details.restaurant_phones.map((phone, i) => (
													<Grid item key={phone.phone}>
														<Typography variant='subtitle1'>
															{phone.phone}
															{i + 1 ===
															details.restaurant_phones.length
																? ''
																: ', '}
														</Typography>
													</Grid>
												))}
											</Grid>
											<Typography variant='body1' className={classes.address}>
												{details.restaurant.aline1}
												<br />
												{details.restaurant.aline2}
												<br />
												{details.restaurant.city} - {details.restaurant.pin}
											</Typography>
										</CardContent>
									</Card>
								</Grid>
							)}
							{details.delivery && (
								<Grid item xs={4} className={classes.flex}>
									<Card className={classes.grow}>
										<CardContent>
											<Typography variant='h5' gutterBottom>
												DELIVERY PERSON
											</Typography>
											<Typography variant='h5' className={classes.name}>
												{details.delivery.firstname}{' '}
												{details.delivery.lastname}
											</Typography>
											<Grid
												container
												justify='space-between'
												alignItems='center'
												spacing={4}
											>
												<Grid item>
													<Typography variant='subtitle1'>
														{details.delivery.phone}
													</Typography>
												</Grid>
												<Grid item>
													<Typography variant='subtitle1'>
														{details.delivery.email}
													</Typography>
												</Grid>
											</Grid>
											<Typography variant='body1' className={classes.address}>
												{details.delivery.vno}
												<br />
												{details.delivery.vmodel} -{' '}
												{details.delivery.vcolour}
											</Typography>
										</CardContent>
									</Card>
								</Grid>
							)}
							{!details.delivery && (
								<Grid item xs={4} className={classes.flex}>
									<Card className={classes.grow}>
										<CardContent>
											<Typography variant='h5' gutterBottom>
												DELIVERY PERSON
											</Typography>
											<Typography variant='h5'>
												Waiting to be assigned...
											</Typography>
										</CardContent>
									</Card>
								</Grid>
							)}
						</Grid>
					</Grid>
					<Grid item>
						<Stepper
							activeStep={activeStep}
							alternativeLabel
							orientation='horizontal'
							connector={<StepConnector />}
						>
							<Step>
								<StepLabel>Order Placed</StepLabel>
							</Step>
							<Step>
								<StepLabel>Delivery person assigned</StepLabel>
							</Step>
							<Step>
								<StepLabel>Food prepared!</StepLabel>
							</Step>
							<Step>
								<StepLabel>Order picked up</StepLabel>
							</Step>
							<Step>
								<StepLabel>Order delivered</StepLabel>
							</Step>
							<Step>
								<StepLabel>Customer paid</StepLabel>
							</Step>
						</Stepper>
					</Grid>
					<Grid item>
						<OrderContentTable
							order_content={details.orderContent}
							order_no={order_no}
						/>
					</Grid>
					<Grid item>
						<Dialog open={open} onClose={() => setOpen(false)}>
							<DialogTitle>Are you sure you want to cancel this order?</DialogTitle>
							<DialogActions>
								<Button
									color='primary'
									variant='contained'
									onClick={handleDeleteOrder}
								>
									Yes, cancel
								</Button>
								<Button
									color='primary'
									variant='contained'
									onClick={() => setOpen(false)}
								>
									Close
								</Button>
							</DialogActions>
						</Dialog>
						<Button
							variant='contained'
							color='secondary'
							startIcon={<CancelIcon />}
							onClick={() => setOpen(true)}
						>
							Cancel order
						</Button>
					</Grid>
				</Grid>
			</Container>
		)
	);
};

export default Order;
