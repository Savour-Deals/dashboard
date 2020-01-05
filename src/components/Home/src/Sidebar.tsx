import React, { useContext } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import { AuthContext } from "../../../auth";
import { useHistory } from "react-router-dom";


const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
});

interface SidebarProps {
  open: boolean;
  toggleDrawer: (event: React.MouseEvent) => void;
}

export const Sidebar: React.FC<SidebarProps> = (props) => {
  const styles = useStyles();
  const { open, toggleDrawer } = props;
  const history = useHistory();

  const { handleLogout } = useContext<any>(AuthContext);

  async function handleSignOut(event: React.MouseEvent) {
    await handleLogout();
    history.push("/login");
  }
  const sideList = () => (
    <div
      className={styles.list}
      role="presentation"
      onClick={toggleDrawer}
    >
      <List>
      <ListItem button key={"logout"} onClick={handleSignOut}>
            <ListItemIcon><InboxIcon/></ListItemIcon>
            <ListItemText primary={"Log Out"} />
          </ListItem>
      </List>
    </div>
  );


  return(
    <Drawer open={open} onClose={toggleDrawer}>
      {sideList()}
    </Drawer>
  );
}