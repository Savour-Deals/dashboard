import React, { useState, ChangeEvent, useContext } from "react";

import { 
  Card, 
  CardContent, 
  Grid,
  makeStyles, 
  createStyles, 
  Theme, 
  TextField,
  CardMedia,
  Typography,
  Button
} from "@material-ui/core";
import LogoWhite from "../assets/img/brand/Savour_White.png";
import Background from "../assets/img/brand/vendorbackground.jpg";
import {useSpring, animated} from 'react-spring'
import { useHistory } from "react-router-dom";
import { AuthContext } from "../auth";

export const CreateAccount: React.FC = () => {

  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      card: {
        margin: theme.spacing(3),
        display: "inline-block",
  
  
      },
      root: {
        textAlign: "center",
        padding: theme.spacing(1),
        backgroundImage: `url(${Background})`,
        position: 'fixed',
        width: '100%',
        height: '100%',
        backgroundSize: 'cover',
      },
      header: {
        backgroundColor: "#49ABAA",
  
      },
      img: {
        width: "100%",
        height: 125,
        backgroundColor: "#49ABAA",
  
        
      },
      createAccount: {
        margin: theme.spacing(2),
        cursor: "pointer"
      },
  
      button: {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        color: "white",
        margin: theme.spacing(2),
      },
  
    }),
  );

  const springProps = useSpring({opacity: 1, from: {opacity: 0}});
  const styles = useStyles();
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { handleSignUp, handleLogin } = useContext<IAuthContext>(AuthContext);
  async function handleCreateAccount() {
    const creationSucess = await handleSignUp(email, password);
    if (creationSucess.isAuthenticated){
      await handleLogin(email, password);//this should not fail?
      history.push("/index");
    }//else an error was displayed from auth object
  }


  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    const email: string = event.target.value;
    setEmail(email);
  }

  function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    const password: string = event.target.value;
    setPassword(password);
  }


  // if (auth) return <Redirect to="/index" />;

  return(
    <animated.div className={styles.root} style={springProps}>
      <Card className={styles.card}>
        {/* <CardHeader
        /> */}
        <CardMedia
          className={styles.img}
          image={LogoWhite}
          title="logo"
        />
        <CardContent>
          <form>
            <Grid container spacing={1}  direction="column">
              <Grid item xs={12}>
                <TextField
                  id="email"
                  label="Email"
                  margin="normal"
                  type="email"
                  onChange={handleEmailChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="password"
                  label="Password"
                  type="password"
                  onChange={handlePasswordChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  onClick={handleCreateAccount}
                  className={styles.button}
                >
                  Sign Up
                </Button>
              </Grid>
            </Grid>
          </form>
        <Typography className={styles.createAccount} onClick={() => history.push("/login")}>Already Have an Account? Click Here!</Typography>
        </CardContent>
      </Card>
    </animated.div>
  );
}
