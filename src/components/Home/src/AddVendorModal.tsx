import { Card, CardContent, CardHeader, createStyles, Grid, IconButton, Button, makeStyles, Modal, TextField, Theme } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import GoogleMapsReact from "google-map-react";
import React, { ChangeEvent, createRef, useState } from "react";
import { animated, useSpring } from "react-spring";
import { SearchBox } from "./Searchbox";
import { useFormFields } from "../../CustomHooks/useFormField";

interface IAddVendorModal {
  open: boolean;
  handleClose: () => void;
  addVendor: (vendor: Vendor) => void;
}

interface FadeProps {
  children?: React.ReactElement;
  in: boolean;
  onEnter?: () => {};
  onExited?: () => {};
}

const useStyles = makeStyles((theme: Theme) => 
  createStyles({
    card: {
      overflow: 'scroll',
      margin: theme.spacing(3),
      display: "inline-block",
      width: "90%",
      height: "90%",
      '&::-webkit-scrollbar': {
        width: '0.4em'
      },
      '&::-webkit-scrollbar-track': {
        boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
        webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(0,0,0,.1)',
        outline: '1px solid slategrey'
      }
    },
    root: {
      textAlign: "center",
      padding: theme.spacing(1),
      position: 'fixed',
      width: '100%',
      height: '100%',
    },
    textInput: {
      width: '100%'
    },
    inputGrid: {
      margin: theme.spacing(3),
    },
    cardContent: {
      overflow: 'scroll',
      alignItems: 'center',
      '&::-webkit-scrollbar': {
        width: '0.4em'
      },
      '&::-webkit-scrollbar-track': {
        boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
        webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(0,0,0,.1)',
        outline: '1px solid slategrey'
      }
    },
    button: {
      backgroundColor: "#49ABAA",
      color: "white",
      margin: theme.spacing(2),
    },
    modal: {

    },
  })
);

// https://material-ui.com/components/modal/#modal
const Fade = React.forwardRef<HTMLDivElement, FadeProps>(function Fade(props, ref) {
  const { in: open, children, onEnter, onExited, ...other } = props;
  const layout = useStyles();
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) {
        onEnter();
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited();
      }
    },
  });

  return (
    <animated.div ref={ref} style={style} {...other} className={layout.root}>
      {children}
    </animated.div>
  );
});

function loadScript(src: string, position: HTMLElement | null, id: string) {
  if (!position) {
    return;
  }

  const script = document.createElement('script');
  script.setAttribute('async', '');
  script.setAttribute('id', id);
  script.src = src;
  position.appendChild(script);
}

const TEXT_INPUT_SIZE = 4;
export const AddVendorModal: React.FC<IAddVendorModal> = props => {

  const { open, handleClose, addVendor } = props;
  const [coords, setCoords] = useState<MapCoordinates>({
    lat: 59.95,
    lng: 30.33
  });
  const [mapsApiLoaded, setMapsApiLoaded] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);
  const [mapsApi, setMapsApi] = useState(null);
  const [vendorName, setVendorName] = useState("Select a business from the map above");
  const [placeId, setPlaceId] = useState("");
  const [primaryAddress, setPrimaryAddress] = useState("Select a business from the map above");
  const [secondaryAddress, setSecondaryAddress] = useState("Select a business from the map above");
  const [locationSelected, setLocationSelected] = useState(false);
  const [onboardDeal, setOnboardDeal] = useState("");
  const [doubleClickDeal, setDoubleClickDeal] = useState("");
  const [twilioNumber, setTwilioNumber] = useState("");


  const styles = useStyles();
  const zoom = 11;

  const searchBoxProps = {
    setVendorName,
    setPlaceId,
    setPrimaryAddress,
  }

  const createVendor = () => {
    const vendor: Vendor = {
      placeId,
      vendorName,
      primaryAddress
    }

    addVendor(vendor);
    handleClose();
  }

  function vendorNameChange(event: ChangeEvent<HTMLInputElement>) {
    const vendorName = event.target.value;

    setVendorName(vendorName);
  }

  function primaryAddressChange(event: ChangeEvent<HTMLInputElement>) {
    const primaryAddress = event.target.value;

    setPrimaryAddress(primaryAddress);
  }

  function secondaryAddressChange(event: ChangeEvent<HTMLInputElement>) {
    const secondaryAddress = event.target.value;

    setSecondaryAddress(secondaryAddress);
  }

  function onboardDealChange(event: ChangeEvent<HTMLInputElement>) {
    const onboardDeal = event.target.value;

    setOnboardDeal(onboardDeal);
  }

  function doubleClickDealChange(event: ChangeEvent<HTMLInputElement>) {
    const doubleClickDeal = event.target.value;
    
    setDoubleClickDeal(doubleClickDeal);
  }

  const successCallback = (position: Position) => {
    setCoords({lat: position.coords.latitude, lng: position.coords.longitude});
  }

  const errorCallback = () => {

  }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  }

  const searchBar = createRef<HTMLInputElement>();

  return (
    <Modal open={open} className={styles.modal} onClose={handleClose}>
      <Fade
        in={open}
      >
      
        <Card className={styles.card}>
          <CardHeader
            action={
              <IconButton onClick={handleClose}>
                <CloseIcon/>
              </IconButton>
            }
          />
          <CardContent className={styles.cardContent} >
            <form className={styles.modal}>
              <h1>Add Business</h1>
              <div style={{ height: '45vh ', width: '100%' }}>

                <div ref={searchBar}>
                  {mapsApiLoaded && <SearchBox {...searchBoxProps}/>}
                </div>
              </div>
              <br></br>
              <div>
                <Grid container spacing={4}>
                    <Grid item xs={TEXT_INPUT_SIZE}>
                      <TextField
                        className={styles.textInput}
                        label="Business Name"
                        value={vendorName}
                        id="vendorName"
                        onChange={vendorNameChange}

                      />
                    </Grid>
                    <Grid item xs={TEXT_INPUT_SIZE}>
                      <TextField
                        className={styles.textInput}
                        label="Primary Address"
                        value={primaryAddress}
                        id="primaryAddress"
                        onChange={primaryAddressChange}

                      />
                    </Grid>
                </Grid>
                <Button 
                  variant="contained"   
                  className={styles.button} 
                  onClick={createVendor}>
                    Create Vendor
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </Fade> 
    </Modal>
  );
}