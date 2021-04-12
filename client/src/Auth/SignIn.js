import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Avatar, Button, Link, TextField, Typography } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import UserContext from '../UserContext';

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(4),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main
	},
	form: {
		marginTop: theme.spacing(4),
		width: '100vw'
	},
	formElement: {
		marginTop: theme.spacing(2),
		width: '20vw'
	},
	submit: {
		width: '20vw'
	},
	link: {
		marginTop: theme.spacing(2)
	}
}));

const SignIn = () => {
	const classes = useStyles();

	const [uname, setUname] = useState('');
	const [pass, setPass] = useState('');
	const { setUser } = useContext(UserContext);
	const history = useHistory();

	const submitHandler = async (e) => {
		e.preventDefault();
		const credentials = { uname, pass };
		const res = await axios.post('http://localhost:5000/signin', credentials);
		if (res.status === 202) {
			setUser(res.data.user);
			history.push('/dashboard');
		}
	};

	return (
		<Grid container className={classes.paper}>
			<Grid item>
				<Avatar className={classes.avatar}>
					<LockOutlinedIcon />
				</Avatar>
			</Grid>
			<Grid item>
				<Typography variant='h5' component='h1'>
					Sign In
				</Typography>
			</Grid>
			<Grid item>
				<form className={classes.form} onSubmit={submitHandler}>
					<Grid container direction='column' alignItems='center'>
						<Grid item className={classes.formElement}>
							<TextField
								variant='outlined'
								label='Username'
								required
								fullWidth
								onChange={(e) => {
									setUname(e.target.value);
								}}
							/>
						</Grid>
						<Grid item className={classes.formElement}>
							<TextField
								variant='outlined'
								label='Password'
								type='password'
								required
								fullWidth
								onChange={(e) => {
									setPass(e.target.value);
								}}
							/>
						</Grid>
						<Grid item className={classes.formElement}>
							<Button
								variant='contained'
								type='submit'
								id='submit'
								color='primary'
								className={classes.submit}
							>
								Sign In
							</Button>
						</Grid>
					</Grid>
				</form>
			</Grid>
			<Grid item className={classes.link}>
				<Link href='/signup' variant='body2'>
					Don't have an account yet? Sign Up
				</Link>
			</Grid>
		</Grid>
	);
};

export default SignIn;
