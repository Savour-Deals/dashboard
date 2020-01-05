import React, { useState } from "react";
import { AppBar, Grid, IconButton } from "@material-ui/core";
import { Menu } from "@material-ui/icons";
import LogoWhite from "../../../assets/img/brand/Savour_White.png";
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Sidebar } from "./Sidebar";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      backgroundColor: "#49ABAA",
      padding: theme.spacing(1)
    },

    img: {
      maxWidth:"15%",
      height:"auto",
      
  }
  }),
);

export const HomeHeader: React.FC = () => {

  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const toggleDrawer = (event: React.MouseEvent) => {
    setOpen(!open);
  }
  return (
    <AppBar className={classes.root} position="sticky">
      <Grid container  spacing={1} direction="row" alignItems="center">
        <Grid item xs={6}>
          <IconButton onClick={toggleDrawer}><Menu/></IconButton>
        </Grid>
        <Grid item xs={6}>
          <img src={LogoWhite} className={classes.img} alt="savour logo"/>
        </Grid>
      </Grid>
      <Sidebar
        open={open}
        toggleDrawer={toggleDrawer}
      />
    </AppBar>
  );
}